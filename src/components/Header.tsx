import { FaBell, FaSearch } from 'react-icons/fa';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <div style={styles.header}>
      <h1 style={styles.title}>{title}</h1>
      <div style={styles.actions}>
        <div style={styles.searchBox}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search..."
            style={styles.searchInput}
          />
        </div>
        <button style={styles.notificationButton}>
          <FaBell size={18} />
          <span style={styles.badge}>3</span>
        </button>
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
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1F2937',
    margin: 0,
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
  notificationButton: {
    position: 'relative',
    padding: '8px',
    background: '#F3F4F6',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#6B7280',
  },
  badge: {
    position: 'absolute',
    top: '-2px',
    right: '-2px',
    background: '#DC2626',
    color: 'white',
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '10px',
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
