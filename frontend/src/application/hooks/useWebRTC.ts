import { useEffect, useRef, useState, useCallback } from 'react';
import { getSocket } from '../../infrastructure/socket/socketClient';
import type { Room } from '../../domain/types';

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

export function useWebRTC(room: Room | null, userName: string) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pcsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [hasRemoteStream, setHasRemoteStream] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState<boolean | null>(null);
  const [volume, setVolumeState] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Refs always reflect latest values without re-registering socket handlers
  const roomRef = useRef(room);
  const userNameRef = useRef(userName);
  roomRef.current = room;
  userNameRef.current = userName;

  const createPC = useCallback((peerId: string): RTCPeerConnection => {
    const existing = pcsRef.current.get(peerId);
    if (existing) {
      existing.close();
      pcsRef.current.delete(peerId);
    }

    const pc = new RTCPeerConnection(RTC_CONFIG);
    pcsRef.current.set(peerId, pc);

    pc.onicecandidate = ({ candidate }) => {
      if (candidate) getSocket().emit('webrtc:ice', { candidate });
    };

    pc.ontrack = ({ track, streams }) => {
      console.log('[webrtc] ontrack', peerId, 'kind:', track.kind, 'streams:', streams.length);
      if (!videoRef.current) return;

      if (streams[0]) {
        videoRef.current.srcObject = streams[0];
      } else {
        // Some browsers don't populate streams[0]; build one from the track
        const existing = videoRef.current.srcObject;
        const ms = existing instanceof MediaStream ? existing : new MediaStream();
        ms.addTrack(track);
        videoRef.current.srcObject = ms;
      }
      videoRef.current.play().catch(console.error);
      setHasRemoteStream(true);
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[webrtc] ICE', peerId, pc.iceConnectionState);
    };

    pc.onconnectionstatechange = () => {
      console.log('[webrtc] conn', peerId, pc.connectionState);
      if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
        pcsRef.current.delete(peerId);
      }
    };

    return pc;
  }, []);

  const cleanupWebRTC = useCallback(() => {
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    localStreamRef.current = null;
    pcsRef.current.forEach(pc => pc.close());
    pcsRef.current.clear();
    setHasRemoteStream(false);
    setAudioAvailable(null);
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const startCapture = useCallback(async (width: number, height: number, frameRate: number): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: { ideal: width }, height: { ideal: height }, frameRate: { ideal: frameRate } },
        // Disable all audio processing — system audio (music/video) sounds much better raw
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        // Chrome: pre-select "Share system audio" checkbox; ignored by other browsers
        ...({ systemAudio: 'include' } as object),
      } as DisplayMediaStreamOptions);
      setAudioAvailable(stream.getAudioTracks().length > 0);
      localStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.error);
      }
      setHasRemoteStream(true);

      stream.getVideoTracks()[0].addEventListener('ended', () => {
        getSocket().emit('share:stop');
        cleanupWebRTC();
      });

      getSocket().emit('share:start');
      return true;
    } catch {
      return false;
    }
  }, [cleanupWebRTC]);

  // Replace tracks in all peer connections without renegotiation.
  // Also lets the user pick a different window/source mid-session.
  const changeCapture = useCallback(async (width: number, height: number, frameRate: number): Promise<boolean> => {
    try {
      const newStream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: { ideal: width }, height: { ideal: height }, frameRate: { ideal: frameRate } },
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        ...({ systemAudio: 'include' } as object),
      } as DisplayMediaStreamOptions);
      setAudioAvailable(newStream.getAudioTracks().length > 0);

      const oldStream = localStreamRef.current;

      // Swap tracks in every active peer connection
      pcsRef.current.forEach(pc => {
        newStream.getTracks().forEach(newTrack => {
          const sender = pc.getSenders().find(s => s.track?.kind === newTrack.kind);
          if (sender) {
            sender.replaceTrack(newTrack).catch(console.error);
          } else {
            // Previous capture had no audio track; add it now
            pc.addTrack(newTrack, newStream);
          }
        });
      });

      localStreamRef.current = newStream;

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play().catch(console.error);
      }

      // Stop old tracks after handing off
      oldStream?.getTracks().forEach(t => t.stop());

      newStream.getVideoTracks()[0].addEventListener('ended', () => {
        getSocket().emit('share:stop');
        cleanupWebRTC();
      });

      return true;
    } catch {
      return false;
    }
  }, [cleanupWebRTC]);

  const toggleMute = useCallback(() => setIsMuted(m => !m), []);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (v > 0) setIsMuted(false);
  }, []);

  // Re-attach the local stream to the video element and resume playback.
  // Called by RoomScreen when the window regains focus.
  const resumeCapture = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    // Re-set srcObject so the browser treats it as a fresh source
    const stream = localStreamRef.current ?? (video.srcObject instanceof MediaStream ? video.srcObject : null);
    if (!stream) return;
    if (video.srcObject !== stream) video.srcObject = stream;
    video.play().catch(console.error);
  }, []);

  // Apply volume/mute to video element whenever they change
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = volume;
    videoRef.current.muted = isMuted;
  }, [volume, isMuted]);

  // Auto-resume if the browser pauses the video (e.g. tab throttling, focus loss)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handlePause = () => {
      if (video.srcObject) video.play().catch(console.error);
    };
    video.addEventListener('pause', handlePause);
    return () => video.removeEventListener('pause', handlePause);
  }, []);

  useEffect(() => {
    const socket = getSocket();

    // Keep roomRef in sync immediately (before React re-render) to avoid race with session:started
    const onRoomUpdated = (updatedRoom: Room) => {
      roomRef.current = updatedRoom;
    };

    // Viewer: session:started carries sharingUser directly — no need to wait for room:updated re-render
    const onSessionStarted = async ({ sharingUser }: { sessionId: string; sharingUser: string }) => {
      console.log('[webrtc] session:started sharingUser=%s me=%s', sharingUser, userNameRef.current);
      if (!sharingUser || sharingUser === userNameRef.current) return;

      const pc = createPC(sharingUser);
      pc.addTransceiver('video', { direction: 'recvonly' });
      pc.addTransceiver('audio', { direction: 'recvonly' });

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      console.log('[webrtc] viewer sending offer to sharer=%s', sharingUser);
      socket.emit('webrtc:offer', { offer });
    };

    // Sharer: a viewer sent an offer, create answer and send back targeted
    const onOffer = async ({ from, offer }: { from: string; offer: RTCSessionDescriptionInit }) => {
      console.log('[webrtc] got offer from=%s sharingUser=%s me=%s stream=%s', from, roomRef.current?.sharingUser, userNameRef.current, !!localStreamRef.current);
      if (roomRef.current?.sharingUser !== userNameRef.current) return;
      if (!localStreamRef.current) return;

      const pc = createPC(from);
      // setRemoteDescription must come before addTrack so transceivers are
      // created from the offer before tracks are associated with them
      await pc.setRemoteDescription(offer);
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Set per-track bitrate limits for better quality
      pc.getSenders().forEach(sender => {
        const kind = sender.track?.kind;
        if (!kind) return;
        const params = sender.getParameters();
        if (!params.encodings.length) params.encodings = [{}];
        params.encodings[0].maxBitrate = kind === 'audio' ? 320_000 : 8_000_000; // audio: 320 kbps, video: 8 Mbps
        sender.setParameters(params).catch(console.error);
      });

      console.log('[webrtc] sharer sending answer to viewer=%s', from);
      socket.emit('webrtc:answer', { answer, target: from });
    };

    // Viewer: sharer sent the answer to my offer
    const onAnswer = async ({ from, answer }: { from: string; answer: RTCSessionDescriptionInit }) => {
      // from = sharer; ignore if this is our own answer or from is unknown
      if (!from || from === userNameRef.current) return;

      const pc = pcsRef.current.get(from);
      if (pc && pc.signalingState !== 'stable') {
        await pc.setRemoteDescription(answer).catch(console.error);
      }
    };

    // Both sides: apply incoming ICE candidates
    const onIce = ({ from, candidate }: { from: string; candidate: RTCIceCandidateInit }) => {
      const pc = pcsRef.current.get(from);
      if (pc && candidate) {
        pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
      }
    };

    socket.on('room:updated', onRoomUpdated);
    socket.on('session:started', onSessionStarted);
    socket.on('webrtc:offer', onOffer);
    socket.on('webrtc:answer', onAnswer);
    socket.on('webrtc:ice', onIce);

    return () => {
      socket.off('room:updated', onRoomUpdated);
      socket.off('session:started', onSessionStarted);
      socket.off('webrtc:offer', onOffer);
      socket.off('webrtc:answer', onAnswer);
      socket.off('webrtc:ice', onIce);
    };
  }, [createPC]);

  // Clean up WebRTC state when sharing stops
  useEffect(() => {
    if (!room?.sharingUser) cleanupWebRTC();
  }, [room?.sharingUser, cleanupWebRTC]);

  // Final cleanup on unmount
  useEffect(() => cleanupWebRTC, [cleanupWebRTC]);

  return { videoRef, hasRemoteStream, audioAvailable, startCapture, changeCapture, resumeCapture, volume, isMuted, toggleMute, setVolume };
}
