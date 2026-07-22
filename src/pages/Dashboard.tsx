import { FaUsers, FaShieldAlt, FaRoute, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { useUsers, useLiveUsers, useJourneyRequests, useDangerZones, useSosAlerts } from '../hooks/useFirestore';
import LiveMap from '../components/LiveMap';

export default function Dashboard() {
  const { users, loading: usersLoading } = useUsers();
  const { liveUsers, loading: liveLoading } = useLiveUsers();
  const { requests, loading: requestsLoading } = useJourneyRequests();
  const { zones, loading: zonesLoading } = useDangerZones();
  const { alerts, loading: alertsLoading } = useSosAlerts();

  const loading = usersLoading || liveLoading || requestsLoading || zonesLoading || alertsLoading;

  const onlineUsers = liveUsers.length;
  const activeJourneys = liveUsers.filter((u) => u.onJourney).length;
  const completedJourneys = requests.filter((r) => r.status === 'completed').length;
  const pendingRequests = requests.filter((r) => r.status === 'pending').length;
  const activeAlerts = alerts.length;
  const highDangerZones = zones.filter((z) => z.level === 'high' || z.level === 'risky').length;

  const stats = [
    { title: 'Total Users', value: users.length.toString(), icon: <FaUsers />, color: '#4F46E5', live: false },
    { title: 'Online Now', value: onlineUsers.toString(), icon: <FaShieldAlt />, color: '#059669', live: true },
    { title: 'Active Journeys', value: activeJourneys.toString(), icon: <FaRoute />, color: '#D97706', live: true },
    { title: 'SOS Alerts', value: activeAlerts.toString(), icon: <FaExclamationTriangle />, color: '#DC2626', live: true },
  ];

  const recentJourneys = requests.slice(0, 8);
  const recentAlerts = alerts.slice(0, 5);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner style={styles.spinner} />
        <p style={styles.loadingText}>Connecting to real-time data...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: `${stat.color}20` }}>
              <span style={{ color: stat.color }}>{stat.icon}</span>
            </div>
            <div style={styles.statInfo}>
              <p style={styles.statTitle}>{stat.title}</p>
              <div style={styles.statValueRow}>
                <p style={styles.statValue}>{stat.value}</p>
                {stat.live && <span style={styles.livePulse} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.secondaryStats}>
        <div style={styles.miniStat}>
          <span style={styles.miniLabel}>Completed Journeys</span>
          <span style={styles.miniValue}>{completedJourneys}</span>
        </div>
        <div style={styles.miniStat}>
          <span style={styles.miniLabel}>Pending Requests</span>
          <span style={styles.miniValue}>{pendingRequests}</span>
        </div>
        <div style={styles.miniStat}>
          <span style={styles.miniLabel}>Danger Zones</span>
          <span style={styles.miniValue}>{highDangerZones} high/risky</span>
        </div>
        <div style={styles.miniStat}>
          <span style={styles.miniLabel}>Total Danger Reports</span>
          <span style={styles.miniValue}>{zones.reduce((sum, z) => sum + z.reports, 0)}</span>
        </div>
      </div>

      <LiveMap />

      <div style={styles.bottomGrid}>
        <div style={styles.activityCard}>
          <div style={styles.cardTitleRow}>
            <h3 style={styles.cardTitle}>Recent Journeys</h3>
            <span style={styles.liveTag}>
              <span style={styles.liveDotSmall} />
              LIVE
            </span>
          </div>
          <div style={styles.activityList}>
            {recentJourneys.length === 0 ? (
              <p style={styles.emptyText}>No journey requests yet</p>
            ) : (
              recentJourneys.map((journey) => (
                <div key={journey.id} style={styles.activityItem}>
                  <div style={{
                    ...styles.activityDot,
                    background: journey.status === 'completed' ? '#059669' :
                      journey.status === 'accepted' ? '#4F46E5' :
                        journey.status === 'pending' ? '#D97706' : '#9CA3AF',
                  }} />
                  <div style={styles.activityInfo}>
                    <p style={styles.activityUser}>
                      {journey.requesterName} → {journey.partnerName}
                    </p>
                    <p style={styles.activityAction}>
                      {journey.destinationAddress || 'No destination set'} • {journey.status}
                    </p>
                  </div>
                  <span style={styles.activityTime}>
                    {new Date(journey.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={styles.alertCard}>
          <div style={styles.cardTitleRow}>
            <h3 style={styles.cardTitle}>SOS Alerts</h3>
            <span style={{ ...styles.liveTag, background: '#FEF2F2', color: '#DC2626', borderColor: '#FCA5A5' }}>
              <span style={{ ...styles.liveDotSmall, background: '#DC2626' }} />
              LIVE
            </span>
          </div>
          <div style={styles.activityList}>
            {recentAlerts.length === 0 ? (
              <p style={styles.emptyText}>No active SOS alerts</p>
            ) : (
              recentAlerts.map((alert) => (
                <div key={alert.id} style={styles.alertItem}>
                  <div style={{ ...styles.activityDot, background: '#DC2626', animation: 'pulse 1.5s ease-in-out infinite' }} />
                  <div style={styles.activityInfo}>
                    <p style={styles.activityUser}>{alert.displayName}</p>
                    <p style={styles.activityAction}>{alert.message}</p>
                  </div>
                  <span style={styles.activityTime}>
                    {new Date(alert.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
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
    color: '#4F46E5',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#6B7280',
    fontSize: '14px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '24px',
  },
  statCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: '13px',
    color: '#6B7280',
    margin: '0 0 4px',
  },
  statValueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1F2937',
    margin: 0,
  },
  livePulse: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#059669',
    display: 'inline-block',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  secondaryStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  miniStat: {
    background: 'white',
    borderRadius: '8px',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  miniLabel: {
    fontSize: '13px',
    color: '#6B7280',
  },
  miniValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F2937',
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  activityCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  alertCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderLeft: '4px solid #DC2626',
  },
  cardTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    margin: 0,
  },
  liveTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: '#ECFDF5',
    border: '1px solid #059669',
    borderRadius: '12px',
    padding: '3px 8px',
    fontSize: '10px',
    fontWeight: '700',
    color: '#059669',
    letterSpacing: '0.5px',
  },
  liveDotSmall: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#059669',
    display: 'inline-block',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxHeight: '320px',
    overflowY: 'auto',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: '14px',
    textAlign: 'center',
    padding: '20px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  alertItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px',
    background: '#FEF2F2',
    borderRadius: '8px',
  },
  activityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  activityInfo: {
    flex: 1,
  },
  activityUser: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1F2937',
    margin: 0,
  },
  activityAction: {
    fontSize: '12px',
    color: '#6B7280',
    margin: 0,
  },
  activityTime: {
    fontSize: '12px',
    color: '#9CA3AF',
    flexShrink: 0,
  },
};
