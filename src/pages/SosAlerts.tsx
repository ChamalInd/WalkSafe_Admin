import { FaSpinner, FaMapMarkerAlt } from 'react-icons/fa';
import { useSosAlerts } from '../hooks/useFirestore';

export default function SosAlerts() {
  const { alerts, loading } = useSosAlerts();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner style={styles.spinner} />
        <p style={styles.loadingText}>Connecting to real-time alerts...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.alertHeader}>
        <div style={styles.alertCount}>
          <span style={styles.alertNumber}>{alerts.length}</span>
          <span style={styles.alertLabel}>Total SOS Alerts</span>
          <span style={styles.liveTag}>
            <span style={styles.liveDot} />
            LIVE
          </span>
        </div>
      </div>

      <div style={styles.alertsList}>
        {alerts.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No SOS alerts have been triggered</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} style={styles.alertCard}>
              <div style={styles.alertIcon}>
                <FaMapMarkerAlt color="#DC2626" size={20} />
              </div>
              <div style={styles.alertInfo}>
                <h4 style={styles.alertName}>{alert.displayName}</h4>
                <p style={styles.alertMessage}>{alert.message}</p>
                <div style={styles.alertMeta}>
                  <span style={styles.alertCoord}>
                    {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                  </span>
                  {alert.destination && (
                    <span style={styles.alertDest}>Dest: {alert.destination}</span>
                  )}
                </div>
              </div>
              <div style={styles.alertTime}>
                <span style={styles.timeText}>
                  {new Date(alert.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '32px',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    gap: '16px',
  },
  spinner: {
    fontSize: '40px',
    color: '#DC2626',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#6B7280',
    fontSize: '14px',
  },
  alertHeader: {
    marginBottom: '24px',
  },
  alertCount: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '12px',
  },
  alertNumber: {
    fontSize: '36px',
    fontWeight: '700',
    color: '#DC2626',
  },
  alertLabel: {
    fontSize: '14px',
    color: '#6B7280',
  },
  liveTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: '#FEF2F2',
    border: '1px solid #FCA5A5',
    borderRadius: '12px',
    padding: '3px 8px',
    fontSize: '10px',
    fontWeight: '700',
    color: '#DC2626',
    letterSpacing: '0.5px',
  },
  liveDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#DC2626',
    display: 'inline-block',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  alertsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  emptyState: {
    background: 'white',
    borderRadius: '12px',
    padding: '48px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: '14px',
  },
  alertCard: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    padding: '20px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderLeft: '4px solid #DC2626',
  },
  alertIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: '#FEF2F2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  alertInfo: {
    flex: 1,
  },
  alertName: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0 0 4px',
  },
  alertMessage: {
    fontSize: '13px',
    color: '#6B7280',
    margin: '0 0 8px',
  },
  alertMeta: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  alertCoord: {
    fontSize: '12px',
    color: '#9CA3AF',
    fontFamily: 'monospace',
  },
  alertDest: {
    fontSize: '12px',
    color: '#6B7280',
  },
  alertTime: {
    flexShrink: 0,
  },
  timeText: {
    fontSize: '12px',
    color: '#9CA3AF',
  },
};
