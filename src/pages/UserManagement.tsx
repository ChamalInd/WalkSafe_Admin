import { useState } from 'react';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { useUsers, useLiveUsers } from '../hooks/useFirestore';

export default function UserManagement() {
  const { users, loading: usersLoading } = useUsers();
  const { liveUsers, loading: liveLoading } = useLiveUsers();
  const [searchTerm, setSearchTerm] = useState('');

  const loading = usersLoading || liveLoading;

  const liveUserMap = new Map(liveUsers.map((lu) => [lu.uid, lu]));

  const enrichedUsers = users.map((user) => {
    const live = liveUserMap.get(user.uid);
    return {
      ...user,
      isOnline: !!live,
      onJourney: live?.onJourney ?? false,
      latitude: live?.latitude,
      longitude: live?.longitude,
    };
  });

  const filteredUsers = enrichedUsers.filter(
    (user) =>
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
        <div style={styles.userCount}>
          <span style={styles.countBadge}>{enrichedUsers.length} total</span>
          <span style={{ ...styles.countBadge, background: '#ECFDF5', color: '#059669', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={styles.liveDotSmall} />
            {enrichedUsers.filter((u) => u.isOnline).length} online
          </span>
        </div>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Rating</th>
              <th style={styles.th}>On Journey</th>
              <th style={styles.th}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.userInfo}>
                    <div style={{
                      ...styles.userAvatar,
                      background: user.isOnline ? '#ECFDF5' : '#F3F4F6',
                      color: user.isOnline ? '#059669' : '#6B7280',
                    }}>
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}
                    </div>
                    <div>
                      <span style={styles.userName}>{user.displayName || 'Unknown'}</span>
                      {user.isOnline && <span style={styles.onlineDot} />}
                    </div>
                  </div>
                </td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    background: user.isOnline ? '#ECFDF5' : '#F3F4F6',
                    color: user.isOnline ? '#059669' : '#6B7280',
                  }}>
                    {user.isOnline ? 'Online' : 'Offline'}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.ratingContainer}>
                    <span style={styles.ratingStar}>★</span>
                    <span style={styles.ratingValue}>
                      {user.rating?.toFixed(1) || '5.0'}
                    </span>
                    <span style={styles.ratingCount}>({user.totalRatings || 0})</span>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusBadge,
                    background: user.onJourney ? '#EEF2FF' : '#F3F4F6',
                    color: user.onJourney ? '#4F46E5' : '#9CA3AF',
                  }}>
                    {user.onJourney ? 'Yes' : 'No'}
                  </span>
                </td>
                <td style={styles.td}>
                  {user.createdAt
                    ? new Date(
                        typeof user.createdAt === 'object' && 'seconds' in user.createdAt
                          ? (user.createdAt as { seconds: number }).seconds * 1000
                          : user.createdAt as number
                      ).toLocaleDateString()
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #D1D5DB',
    width: '300px',
  },
  searchIcon: {
    color: '#9CA3AF',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    flex: 1,
    fontSize: '14px',
  },
  userCount: {
    display: 'flex',
    gap: '8px',
  },
  countBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    background: '#F3F4F6',
    color: '#6B7280',
  },
  liveDotSmall: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#059669',
    display: 'inline-block',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  tableCard: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    borderBottom: '1px solid #E5E7EB',
    background: '#F9FAFB',
  },
  tr: {
    borderBottom: '1px solid #E5E7EB',
  },
  td: {
    padding: '16px',
    fontSize: '14px',
    color: '#374151',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '14px',
  },
  onlineDot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#059669',
    marginLeft: '8px',
    animation: 'pulse 2s ease-in-out infinite',
  },
  userName: {
    fontWeight: '500',
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  ratingStar: {
    color: '#F59E0B',
    fontSize: '14px',
  },
  ratingValue: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1F2937',
  },
  ratingCount: {
    fontSize: '12px',
    color: '#9CA3AF',
  },
};
