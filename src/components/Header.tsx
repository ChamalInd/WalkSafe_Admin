import { FaSearch } from 'react-icons/fa';
import { useLiveUsers } from '../hooks/useFirestore';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { liveUsers } = useLiveUsers();

  return (
    <div style={styles.header}>
      <div style={styles.titleRow}>
        <h1 style={styles.title}>{title}</h1>
        <div style={styles.liveBadge}>
          <span style={styles.liveDot} />
          <span style={styles.liveText}>LIVE</span>
        </div>
      </div>
      <div style={styles.actions}>
        <div style={styles.searchBox}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            style={styles.searchInput}
          />
        </div>
        <div style={styles.onlineIndicator}>
          <span style={styles.onlineDot} />
          <span style={styles.onlineText}>{liveUsers.length} online</span>
        </div>
        <div style={styles.avatar}>
          <span style={styles.avatarText}>A</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 32px',
    background: 'white',
    borderBottom: '1px solid #E5E7EB',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1F2937',
    margin: 0,
  },
  liveBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#ECFDF5',
    border: '1px solid #059669',
    borderRadius: '20px',
    padding: '4px 10px',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#059669',
    display: 'inline-block',
    animation: 'pulse 1.5s ease-in-out infinite',
  },
  liveText: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#059669',
    letterSpacing: '0.5px',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    background: '#F3F4F6',
    borderRadius: '8px',
  },
  searchIcon: {
    color: '#9CA3AF',
    fontSize: '14px',
  },
  searchInput: {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '14px',
    color: '#374151',
    width: '200px',
  },
  onlineIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: '#ECFDF5',
    borderRadius: '20px',
  },
  onlineDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: '#059669',
    display: 'inline-block',
    animation: 'pulse 2s ease-in-out infinite',
  },
  onlineText: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#059669',
  },
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#4F46E5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
  },
};
