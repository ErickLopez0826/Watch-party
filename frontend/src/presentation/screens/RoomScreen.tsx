import { useEffect, useRef, useState } from 'react';
import { WpRoomHeader } from '../components/WpRoomHeader';
import { WpUserList } from '../components/WpUserList';
import { WpChat } from '../components/WpChat';
import { WpBtn } from '../components/WpBtn';
import { WpShareSettingsModal } from '../components/WpShareSettingsModal';
import type { ShareSettings } from '../components/WpShareSettingsModal';
import { WpRateModal } from '../components/WpRateModal';
import { WpConfirmModal } from '../components/WpConfirmModal';
import { WpHistoryPanel } from '../components/WpHistoryPanel';
import { useAppStore } from '../../application/store/useAppStore';
import { useRoom } from '../../application/hooks/useRoom';
import { useWebRTC } from '../../application/hooks/useWebRTC';
import { USER_PALETTE } from '../constants/users';

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

const IconVolume = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 5.5H4.5L8 2.5v10L4.5 9.5H2z" fill="currentColor"/>
    <path d="M10.5 5a3.5 3.5 0 010 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M12 3.5a6 6 0 010 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const IconMute = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 5.5H4.5L8 2.5v10L4.5 9.5H2z" fill="currentColor"/>
    <path d="M11 5l-2.5 5M8.5 5L11 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const IconExpand = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9"/>
  </svg>
);

const IconCompress = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 1v4H1M9 1v4h4M9 13v-4h4M5 13v-4H1"/>
  </svg>
);

const ctrlBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.12)',
  border: '1px solid rgba(255,255,255,0.18)',
  borderRadius: 6,
  color: '#fff',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '5px 7px',
  lineHeight: 1,
  flexShrink: 0,
};

export function RoomScreen() {
  const { room, userName, sessionStartedAt, activeSessionId } = useAppStore();
  const { handleLeave, handleStartShare: _unused, handleStopShare, handleEndSession } = useRoom();
  const { videoRef, hasRemoteStream, audioAvailable, startCapture, changeCapture, resumeCapture, volume, isMuted, toggleMute, setVolume } = useWebRTC(room, userName);
  const [showChangeSettings, setShowChangeSettings] = useState(false);
  const [showRateModal, setShowRateModal] = useState(false);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<ShareSettings>({ resolution: '1080p', fps: 30 });
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  const [showShareSettings, setShowShareSettings] = useState(false);

  void _unused;

  const isLive = room?.sharingUser != null;
  const iAmSharing = room?.sharingUser === userName;
  const showVideoControls = hasRemoteStream && !iAmSharing;

  const users = (room?.users ?? []).map((name, i) => ({
    key: name,
    name,
    color: room?.userColors?.[name] ?? USER_PALETTE[i]?.color ?? '#555',
    initials: name.slice(0, 2).toUpperCase(),
  }));

  // Session elapsed timer
  useEffect(() => {
    if (!isLive || !sessionStartedAt) { setElapsed(0); return; }
    const tick = () => setElapsed(Math.floor((Date.now() - sessionStartedAt.getTime()) / 1000));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isLive, sessionStartedAt]);

  // Track fullscreen state
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // Track window focus — used to show Discord-style "sharing" overlay
  useEffect(() => {
    const onFocus = () => {
      setIsWindowFocused(true);
      resumeCapture();
    };
    const onBlur = () => setIsWindowFocused(false);
    const onVisibility = () => {
      if (document.visibilityState === 'visible') { setIsWindowFocused(true); resumeCapture(); }
      else setIsWindowFocused(false);
    };
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [resumeCapture]);

  // Only pause local preview when sharer switches away — viewers keep playing regardless
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasRemoteStream || !iAmSharing) return;
    if (!isWindowFocused) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  }, [isWindowFocused, hasRemoteStream, iAmSharing, videoRef]);

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoContainerRef.current.requestFullscreen();
    }
  };

  const onShare = () => setShowShareSettings(true);

  const resolutionDims = (r: ShareSettings['resolution']) =>
    r === '1080p' ? { width: 1920, height: 1080 } : { width: 1280, height: 720 };

  const onConfirmShare = async (settings: ShareSettings) => {
    setShowShareSettings(false);
    setCurrentSettings(settings);
    const { width, height } = resolutionDims(settings.resolution);
    await startCapture(width, height, settings.fps);
  };

  const onConfirmChange = async (settings: ShareSettings) => {
    setShowChangeSettings(false);
    setCurrentSettings(settings);
    const { width, height } = resolutionDims(settings.resolution);
    await changeCapture(width, height, settings.fps);
  };

  const onChangeWindow = async () => {
    const { width, height } = resolutionDims(currentSettings.resolution);
    await changeCapture(width, height, currentSettings.fps);
  };

  if (!room) return null;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {showShareSettings && (
        <WpShareSettingsModal
          onConfirm={onConfirmShare}
          onCancel={() => setShowShareSettings(false)}
        />
      )}
      {showChangeSettings && (
        <WpShareSettingsModal
          onConfirm={onConfirmChange}
          onCancel={() => setShowChangeSettings(false)}
        />
      )}
      {showRateModal && activeSessionId && (
        <WpRateModal activeSessionId={activeSessionId} onClose={() => setShowRateModal(false)} />
      )}
      {showConfirmEnd && (
        <WpConfirmModal
          title="¿Finalizar sesión para todos?"
          description="Todos los usuarios serán llevados al formulario de guardado."
          confirmLabel="Finalizar"
          onConfirm={() => { setShowConfirmEnd(false); handleEndSession(); }}
          onCancel={() => setShowConfirmEnd(false)}
        />
      )}
      {showHistory && <WpHistoryPanel onClose={() => setShowHistory(false)} />}
      <WpRoomHeader
        roomCode={room.code}
        onBack={handleLeave}
        onEndSession={room.creatorName === userName ? () => setShowConfirmEnd(true) : undefined}
        isLive={isLive}
        userCount={room.users.length}
        onShowHistory={() => setShowHistory(true)}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Main area */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          padding: 'var(--density-padding)', gap: 14, overflow: 'hidden',
        }}>

          {/* Video / placeholder area */}
          {isLive ? (
            <div
              ref={videoContainerRef}
              style={{
                flex: 1, borderRadius: 'var(--radius-lg)',
                position: 'relative', overflow: 'hidden', background: '#000',
                border: '1.5px solid rgba(139,92,246,0.2)',
              }}
            >
              {/* Video is always mounted so srcObject can be set before hasRemoteStream flips */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={iAmSharing}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'contain',
                }}
              />

              {/* Gradient overlay: only when no stream available yet (viewer connecting) */}
              {!hasRemoteStream && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 1,
                  background: 'linear-gradient(135deg, #0d0d1a 0%, #12183a 40%, #0e2860 70%, #0d0d1a 100%)',
                  backgroundSize: '300% 300%',
                  animation: 'wp-stream 9s ease-in-out infinite',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'none',
                    background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
                  }} />
                  <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column', gap: 10,
                  }}>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
                      Conectando...
                    </div>
                  </div>
                </div>
              )}

              {/* Discord-style overlay: shown when sharer switches to another app */}
              {iAmSharing && hasRemoteStream && !isWindowFocused && (
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 1,
                  background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', gap: 12,
                }}>
                  <div style={{ fontSize: 28 }}>📡</div>
                  <div style={{ fontSize: 15, color: '#fff', fontWeight: 700 }}>
                    Estás compartiendo pantalla
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center', maxWidth: 260 }}>
                    Vuelve a esta ventana para ver tu transmisión
                  </div>
                </div>
              )}

              {/* "Shared by" badge — top left */}
              <div style={{
                position: 'absolute', top: 14, left: 14,
                background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
                padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 8,
                zIndex: 2,
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)',
                  animation: 'wp-pulse 1.5s infinite', display: 'inline-block',
                }} />
                <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>
                  {iAmSharing ? 'Compartiendo tu pantalla' : `Compartido por ${room.sharingUser}`}
                </span>
              </div>

              {/* Video controls overlay — only for viewers with active stream */}
              {showVideoControls && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '24px 12px 10px',
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.72))',
                  zIndex: 2,
                }}>
                  {/* Mute toggle */}
                  <button onClick={toggleMute} style={ctrlBtnStyle} title={isMuted ? 'Activar sonido' : 'Silenciar'}>
                    {isMuted ? <IconMute /> : <IconVolume />}
                  </button>

                  {/* Volume slider */}
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={isMuted ? 0 : volume}
                    onChange={e => setVolume(Number(e.target.value))}
                    style={{ width: 76, accentColor: 'var(--accent)', cursor: 'pointer' }}
                  />

                  <div style={{ flex: 1 }} />

                  {/* Fullscreen toggle */}
                  <button onClick={toggleFullscreen} style={ctrlBtnStyle} title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}>
                    {isFullscreen ? <IconCompress /> : <IconExpand />}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              flex: 1, borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-card)', border: '1.5px dashed var(--border)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 14,
            }}>
              <div style={{ fontSize: 56, opacity: 0.2 }}>📡</div>
              <div style={{ fontSize: 17, color: 'var(--text-secondary)', fontWeight: 500 }}>
                Esperando stream...
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', maxWidth: 280 }}>
                Cuando alguien comparta pantalla, el video aparecerá aquí
              </div>
            </div>
          )}

          {/* Controls bar */}
          {isLive ? (
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
              {iAmSharing && (
                <WpBtn variant="danger" onClick={handleStopShare} style={{ padding: '11px 18px', fontSize: 13 }}>
                  ⏹ Detener
                </WpBtn>
              )}
              <span style={{
                fontSize: 13, color: 'var(--text-secondary)',
                fontVariantNumeric: 'tabular-nums', fontWeight: 600, letterSpacing: '0.03em',
                padding: '0 4px',
              }}>
                ⏱ {formatElapsed(elapsed)}
              </span>
              {iAmSharing && audioAvailable === false && (
                <span style={{
                  fontSize: 11, color: '#f59e0b', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: 6, padding: '4px 8px',
                }}>
                  🔇 Sin audio — al compartir, activa &ldquo;Compartir audio del sistema&rdquo;
                </span>
              )}
              <div style={{ flex: 1 }} />
              <WpBtn variant="outline" onClick={() => setShowRateModal(true)} style={{ padding: '11px 16px', fontSize: 13 }}>
                ⭐ Calificar
              </WpBtn>
              {iAmSharing && (
                <>
                  <WpBtn variant="outline" onClick={onChangeWindow} style={{ padding: '11px 16px', fontSize: 13 }}>
                    🖥 Cambiar ventana
                  </WpBtn>
                  <WpBtn variant="outline" onClick={() => setShowChangeSettings(true)} style={{ padding: '11px 16px', fontSize: 13 }}>
                    ⚙ Cambiar calidad
                  </WpBtn>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <WpBtn variant="primary" onClick={onShare} style={{ flex: 1, padding: '13px', fontSize: 14 }}>
                🎥 Compartir mi pantalla
              </WpBtn>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{
          width: 280, display: 'flex', flexDirection: 'column',
          borderLeft: '1px solid var(--border)', flexShrink: 0,
        }}>
          <WpUserList users={users} sharingUserName={room.sharingUser} />
          <WpChat users={users} style={{ flex: 1, borderLeft: 'none', minHeight: 0 }} />
        </div>
      </div>
    </div>
  );
}
