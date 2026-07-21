import { FaSpinner } from 'react-icons/fa';
import { useUsers, useJourneyRequests, useDangerZones, useFeedback, useLiveUsers } from '../hooks/useFirestore';

export default function Analytics() {
  const { users, loading: usersLoading } = useUsers();
  const { requests, loading: requestsLoading } = useJourneyRequests();
  const { zones, loading: zonesLoading } = useDangerZones();
  const { feedback, loading: feedbackLoading } = useFeedback();
  const { liveUsers, loading: liveLoading } = useLiveUsers();

  const loading = usersLoading || requestsLoading || zonesLoading || feedbackLoading || liveLoading;

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner style={styles.spinner} />
        <p style={styles.loadingText}>Loading analytics...</p>
      </div>
    );
  }

  const completedJourneys = requests.filter((r) => r.status === 'completed').length;
  const pendingJourneys = requests.filter((r) => r.status === 'pending').length;
  const acceptedJourneys = requests.filter((r) => r.status === 'accepted').length;
  const avgRating = feedback.length > 0
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : 'N/A';
  const highDangerZones = zones.filter((z) => z.level === 'high' || z.level === 'risky').length;
  const totalDangerReports = zones.reduce((sum, z) => sum + z.reports, 0);

  const metrics = [
    { label: 'Total Users', value: users.length.toString(), sub: `${liveUsers.length} online` },
    { label: 'Total Journeys', value: requests.length.toString(), sub: `${completedJourneys} completed` },
    { label: 'Avg Feedback Rating', value: `${avgRating} ★`, sub: `${feedback.length} reviews` },
    { label: 'Active Danger Zones', value: zones.length.toString(), sub: `${highDangerZones} high risk` },
  ];

  const statusBreakdown = [
    { label: 'Pending', value: pendingJourneys, color: '#D97706' },
    { label: 'Accepted', value: acceptedJourneys, color: '#4F46E5' },
    { label: 'Completed', value: completedJourneys, color: '#059669' },
  ];

  const dangerBreakdown = [
    { label: 'Medium', value: zones.filter((z) => z.level === 'medium').length, color: '#D97706' },
    { label: 'High', value: zones.filter((z) => z.level === 'high').length, color: '#EA580C' },
    { label: 'Risky', value: zones.filter((z) => z.level === 'risky').length, color: '#DC2626' },
  ];

  const maxStatusValue = Math.max(...statusBreakdown.map((s) => s.value), 1);

  return (
    <div style={styles.container}>
      <div style={styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <div key={index} style={styles.metricCard}>
            <p style={styles.metricLabel}>{metric.label}</p>
            <p style={styles.metricValue}>{metric.value}</p>
            <p style={styles.metricSub}>{metric.sub}</p>
          </div>
        ))}
      </div>

      <div style={styles.chartsGrid}>
        <div style={styles.chartCard}>
          <h3 style={styles.cardTitle}>Journey Status Distribution</h3>
          <div style={styles.barChart}>
            {statusBreakdown.map((item, index) => (
              <div key={index} style={styles.barGroup}>
                <div style={styles.barWrapper}>
                  <div style={{
                    ...styles.bar,
                    height: `${(item.value / maxStatusValue) * 100}%`,
                    background: item.color,
                  }} />
                </div>
                <span style={styles.barValue}>{item.value}</span>
                <span style={styles.barLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.chartCard}>
          <h3 style={styles.cardTitle}>Danger Zone Reports</h3>
          <div style={styles.dangerStats}>
            <div style={styles.dangerBigNumber}>
              <span style={styles.dangerNumber}>{totalDangerReports}</span>
              <span style={styles.dangerSubtext}>Total reports filed</span>
            </div>
            <div style={styles.dangerBreakdown}>
              {dangerBreakdown.map((item, index) => (
                <div key={index} style={styles.dangerRow}>
                  <div style={{ ...styles.dangerDot, background: item.color }} />
                  <span style={styles.dangerLabel}>{item.label}</span>
                  <span style={styles.dangerValue}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.feedbackSection}>
        <h3 style={styles.cardTitle}>Recent Feedback</h3>
        <div style={styles.feedbackList}>
          {feedback.length === 0 ? (
            <p style={styles.emptyText}>No feedback submitted yet</p>
          ) : (
            feedback.slice(0, 10).map((item) => (
              <div key={item.id} style={styles.feedbackItem}>
                <div style={styles.feedbackRating}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{
                      color: i < item.rating ? '#F59E0B' : '#D1D5DB',
                    }}>★</span>
                  ))}
                </div>
                <p style={styles.feedbackComment}>{item.comment || 'No comment'}</p>
                <span style={styles.feedbackDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
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
  },
  loadingText: {
    color: '#6B7280',
    fontSize: '14px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    marginBottom: '32px',
  },
  metricCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  metricLabel: {
    fontSize: '13px',
    color: '#6B7280',
    margin: '0 0 8px',
  },
  metricValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1F2937',
    margin: '0 0 4px',
  },
  metricSub: {
    fontSize: '12px',
    color: '#9CA3AF',
    margin: 0,
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '32px',
  },
  chartCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0 0 24px',
  },
  barChart: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '32px',
    height: '200px',
    justifyContent: 'center',
  },
  barGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    maxWidth: '100px',
  },
  barWrapper: {
    width: '100%',
    height: '150px',
    display: 'flex',
    alignItems: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: '4px 4px 0 0',
    minHeight: '4px',
  },
  barValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F2937',
  },
  barLabel: {
    fontSize: '12px',
    color: '#6B7280',
  },
  dangerStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  dangerBigNumber: {
    textAlign: 'center',
  },
  dangerNumber: {
    fontSize: '48px',
    fontWeight: '700',
    color: '#DC2626',
  },
  dangerSubtext: {
    display: 'block',
    fontSize: '13px',
    color: '#6B7280',
  },
  dangerBreakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  dangerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  dangerDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  dangerLabel: {
    flex: 1,
    fontSize: '14px',
    color: '#374151',
  },
  dangerValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F2937',
  },
  feedbackSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  feedbackList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  emptyText: {
    color: '#9CA3AF',
    fontSize: '14px',
    textAlign: 'center',
    padding: '20px',
  },
  feedbackItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    background: '#F9FAFB',
    borderRadius: '8px',
  },
  feedbackRating: {
    fontSize: '16px',
    flexShrink: 0,
  },
  feedbackComment: {
    flex: 1,
    fontSize: '14px',
    color: '#374151',
    margin: 0,
  },
  feedbackDate: {
    fontSize: '12px',
    color: '#9CA3AF',
    flexShrink: 0,
  },
};
