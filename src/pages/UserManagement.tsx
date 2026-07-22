import { useState } from 'react';
import { FaSearch, FaSpinner, FaCheck, FaTimes, FaUserClock, FaSave } from 'react-icons/fa';
import { useUsers, useLiveUsers, useApprovalRequests } from '../hooks/useFirestore';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function UserManagement() {
  const { users, loading: usersLoading } = useUsers();
  const { liveUsers, loading: liveLoading } = useLiveUsers();
  const { requests: approvalRequests, loading: approvalLoading, approveUser, rejectUser } = useApprovalRequests();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPhone, setEditingPhone] = useState<Record<string, string>>({});

  const handlePhoneChange = (uid: string, value: string) => {
    setEditingPhone((prev) => ({ ...prev, [uid]: value }));
  };

  const savePhone = async (uid: string) => {
    const phone = editingPhone[uid];
    if (phone === undefined) return;
    await updateDoc(doc(db, 'users', uid), { phone });
    setEditingPhone((prev) => {
      const next = { ...prev };
      delete next[uid];
      return next;
    });
  };

  const loading = usersLoading || liveLoading || approvalLoading;

  const liveUserMap = new Map(liveUsers.map((lu) => [lu.uid, lu]));

  const approvalMap = new Map(approvalRequests.map((r) => [r.uid, r]));

  const enrichedUsers = users.map((user) => {
    const live = liveUserMap.get(user.uid);
    const approval = approvalMap.get(user.uid);
    const phone = (user as Record<string, unknown>).phone
      || (user as Record<string, unknown>).phoneNumber
      || approval?.phone
      || (approval as Record<string, unknown> | undefined)?.phoneNumber
      || '';
    return {
      ...user,
      phone: phone as string,
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

  const pendingRequests = approvalRequests.filter((r) => r.status === 'pending');
  const processedRequests = approvalRequests.filter((r) => r.status !== 'pending');

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
      {pendingRequests.length > 0 && (
        <div style={styles.approvalSection}>
          <div style={styles.approvalHeader}>
            <div style={styles.approvalTitleRow}>
              <FaUserClock size={20} color="#D97706" />
              <h2 style={styles.approvalTitle}>Pending Approval Requests</h2>
              <span style={styles.pendingBadge}>{pendingRequests.length}</span>
            </div>
            <span style={styles.liveTag}>
              <span style={styles.liveDotSmall} />
              LIVE
            </span>
          </div>
          <div style={styles.approvalList}>
            {pendingRequests.map((request) => (
              <div key={request.id} style={styles.approvalCard}>
                <div style={styles.approvalAvatar}>
                  {request.displayName?.charAt(0) || '?'}
                </div>
                <div style={styles.approvalInfo}>
                  <p style={styles.approvalName}>{request.displayName}</p>
                  <p style={styles.approvalDetail}>{request.email}</p>
                  {request.phone && <p style={styles.approvalDetail}>{request.phone}</p>}
                </div>
                <div style={styles.approvalActions}>
                  <button
                    onClick={() => approveUser(request.uid)}
                    style={styles.approveButton}
                  >
                    <FaCheck size={12} />
                    Approve
                  </button>
                  <button
                    onClick={() => rejectUser(request.uid)}
                    style={styles.rejectButton}
                  >
                    <FaTimes size={12} />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {processedRequests.length > 0 && (
        <div style={styles.processedSection}>
          <h3 style={styles.sectionTitle}>Recently Processed</h3>
          <div style={styles.processedList}>
            {processedRequests.map((request) => (
              <div key={request.id} style={styles.processedCard}>
                <div style={{
                  ...styles.approvalAvatar,
                  background: request.status === 'approved' ? '#ECFDF5' : '#FEF2F2',
                  color: request.status === 'approved' ? '#059669' : '#DC2626',
                }}>
                  {request.displayName?.charAt(0) || '?'}
                </div>
                <div style={styles.approvalInfo}>
                  <p style={styles.approvalName}>{request.displayName}</p>
                  <p style={styles.approvalDetail}>{request.email}</p>
                </div>
                <span style={{
                  ...styles.statusBadge,
                  background: request.status === 'approved' ? '#ECFDF5' : '#FEF2F2',
                  color: request.status === 'approved' ? '#059669' : '#DC2626',
                }}>
                  {request.status === 'approved' ? 'Approved' : 'Rejected'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.toolbar}>
        <h2 style={styles.tableTitle}>Approved Users</h2>
        <div style={styles.toolbarRight}>
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
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Phone</th>
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
                  {editingPhone[user.uid] !== undefined ? (
                    <div style={styles.phoneEdit}>
                      <input
                        type="text"
                        value={editingPhone[user.uid]}
                        onChange={(e) => handlePhoneChange(user.uid, e.target.value)}
                        style={styles.phoneInput}
                        placeholder="Enter phone"
                      />
                      <button onClick={() => savePhone(user.uid)} style={styles.savePhoneBtn}>
                        <FaSave size={12} />
                      </button>
                    </div>
                  ) : (
                    <span
                      style={styles.phoneEditable}
                      onClick={() => setEditingPhone((prev) => ({ ...prev, [user.uid]: user.phone || '' }))}
                    >
                      {user.phone || <span style={{ color: '#9CA3AF' }}>Click to add</span>}
                    </span>
                  )}
                </td>
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
  approvalSection: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderLeft: '4px solid #D97706',
  },
  approvalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  approvalTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  approvalTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1F2937',
    margin: 0,
  },
  pendingBadge: {
    background: '#FEF3C7',
    color: '#D97706',
    fontSize: '12px',
    fontWeight: '700',
    padding: '2px 10px',
    borderRadius: '12px',
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
  approvalList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  approvalCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '16px',
    background: '#FFFBEB',
    borderRadius: '10px',
    border: '1px solid #FDE68A',
  },
  approvalAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: '#FEF3C7',
    color: '#D97706',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '16px',
    flexShrink: 0,
  },
  approvalInfo: {
    flex: 1,
  },
  approvalName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0 0 2px',
  },
  approvalDetail: {
    fontSize: '13px',
    color: '#6B7280',
    margin: 0,
  },
  approvalActions: {
    display: 'flex',
    gap: '8px',
  },
  approveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  rejectButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    background: '#FEF2F2',
    color: '#DC2626',
    border: '1px solid #FECACA',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  processedSection: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#6B7280',
    margin: '0 0 12px',
  },
  processedList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  processedCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  toolbar: {
    marginBottom: '24px',
  },
  tableTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0 0 16px',
  },
  toolbarRight: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  phoneEditable: {
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background 0.2s',
  },
  phoneEdit: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  phoneInput: {
    padding: '4px 8px',
    border: '1px solid #D1D5DB',
    borderRadius: '4px',
    fontSize: '13px',
    outline: 'none',
    width: '140px',
  },
  savePhoneBtn: {
    padding: '4px 8px',
    background: '#059669',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
};
