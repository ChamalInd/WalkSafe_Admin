import { FaSpinner, FaMapMarkerAlt, FaShieldAlt, FaCheck } from 'react-icons/fa';
import { useDangerZones } from '../hooks/useFirestore';

export default function DangerZones() {
  const { zones, loading } = useDangerZones();

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner style={styles.spinner} />
        <p style={styles.loadingText}>Loading danger zones...</p>
      </div>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'medium': return { bg: '#FEF3C7', text: '#D97706', border: '#F59E0B' };
      case 'high': return { bg: '#FED7AA', text: '#EA580C', border: '#F97316' };
      case 'risky': return { bg: '#FECACA', text: '#DC2626', border: '#EF4444' };
      default: return { bg: '#F3F4F6', text: '#6B7280', border: '#D1D5DB' };
    }
  };

  const totalReports = zones.reduce((sum, z) => sum + z.reports, 0);
  const totalSafeVotes = zones.reduce((sum, z) => sum + z.safeVoters.length, 0);

  return (
    <div style={styles.container}>
      <div style={styles.summaryBar}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryValue}>{zones.length}</span>
          <span style={styles.summaryLabel}>Active Zones</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={{ ...styles.summaryValue, color: '#DC2626' }}>
            {zones.filter((z) => z.level === 'risky').length}
          </span>
          <span style={styles.summaryLabel}>Risky</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={{ ...styles.summaryValue, color: '#EA580C' }}>
            {zones.filter((z) => z.level === 'high').length}
          </span>
          <span style={styles.summaryLabel}>High</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={{ ...styles.summaryValue, color: '#D97706' }}>
            {zones.filter((z) => z.level === 'medium').length}
          </span>
          <span style={styles.summaryLabel}>Medium</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryValue}>{totalReports}</span>
          <span style={styles.summaryLabel}>Total Reports</span>
        </div>
        <div style={styles.summaryItem}>
          <span style={{ ...styles.summaryValue, color: '#059669' }}>{totalSafeVotes}</span>
          <span style={styles.summaryLabel}>Safe Votes</span>
        </div>
      </div>

      <div style={styles.zonesList}>
        {zones.length === 0 ? (
          <div style={styles.emptyState}>
            <FaShieldAlt size={40} color="#D1D5DB" />
            <p style={styles.emptyText}>No danger zones reported</p>
          </div>
        ) : (
          zones.map((zone) => {
            const levelStyle = getLevelColor(zone.level);
            return (
              <div key={zone.id} style={styles.zoneCard}>
                <div style={{
                  ...styles.levelBadge,
                  background: levelStyle.bg,
                  color: levelStyle.text,
                  borderColor: levelStyle.border,
                }}>
                  {zone.level.toUpperCase()}
                </div>
                <div style={styles.zoneInfo}>
                  <div style={styles.zoneCoords}>
                    <FaMapMarkerAlt color={levelStyle.text} />
                    <span>{zone.latitude.toFixed(4)}, {zone.longitude.toFixed(4)}</span>
                  </div>
                  <div style={styles.zoneStats}>
                    <span style={styles.zoneStat}>
                      <strong>{zone.reports}</strong> reports
                    </span>
                    <span style={styles.zoneStat}>
                      <FaCheck size={12} color="#059669" /> {zone.safeVoters.length} safe votes
                    </span>
                    <span style={styles.zoneStat}>
                      {zone.reporters.length} unique reporters
                    </span>
                  </div>
                </div>
                <div style={styles.zoneTime}>
                  {new Date(zone.createdAt).toLocaleDateString()}
                </div>
              </div>
            );
          })
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
    color: '#D97706',
  },
  loadingText: {
    color: '#6B7280',
    fontSize: '14px',
  },
  summaryBar: {
    display: 'flex',
    gap: '24px',
    marginBottom: '32px',
    background: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  summaryItem: {
    flex: 1,
    textAlign: 'center',
  },
  summaryValue: {
    display: 'block',
    fontSize: '24px',
    fontWeight: '700',
    color: '#1F2937',
  },
  summaryLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#6B7280',
    marginTop: '4px',
  },
  zonesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  emptyState: {
    background: 'white',
    borderRadius: '12px',
    padding: '48px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: '14px',
  },
  zoneCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px 20px',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  levelBadge: {
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.5px',
    border: '1px solid',
    flexShrink: 0,
  },
  zoneInfo: {
    flex: 1,
  },
  zoneCoords: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#374151',
    fontFamily: 'monospace',
    marginBottom: '6px',
  },
  zoneStats: {
    display: 'flex',
    gap: '16px',
  },
  zoneStat: {
    fontSize: '12px',
    color: '#6B7280',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  zoneTime: {
    fontSize: '12px',
    color: '#9CA3AF',
    flexShrink: 0,
  },
};
