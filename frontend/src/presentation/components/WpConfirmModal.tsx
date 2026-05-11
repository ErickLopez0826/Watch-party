import { WpBtn } from './WpBtn';

interface Props {
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function WpConfirmModal({ title, description, confirmLabel = 'Confirmar', onConfirm, onCancel }: Props) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
    }}>
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1.5px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 28px 24px',
        width: 340,
        boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
          {title}
        </div>
        {description && (
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 24 }}>
            {description}
          </div>
        )}
        <div style={{ display: 'flex', gap: 10, marginTop: description ? 0 : 24 }}>
          <WpBtn variant="ghost" onClick={onCancel} style={{ flex: 1, padding: '11px' }}>
            Cancelar
          </WpBtn>
          <WpBtn variant="danger" onClick={onConfirm} style={{ flex: 1, padding: '11px' }}>
            {confirmLabel}
          </WpBtn>
        </div>
      </div>
    </div>
  );
}
