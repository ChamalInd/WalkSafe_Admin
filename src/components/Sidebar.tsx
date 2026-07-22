import { NavLink } from 'react-router-dom';
import { FaShieldAlt, FaTachometerAlt, FaUsers, FaChartBar, FaSignOutAlt, FaExclamationTriangle, FaMapMarkedAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { to: '/users', icon: <FaUsers />, label: 'Users' },
    { to: '/analytics', icon: <FaChartBar />, label: 'Analytics' },
    { to: '/sos-alerts', icon: <FaExclamationTriangle />, label: 'SOS Alerts' },
    { to: '/danger-zones', icon: <FaMapMarkedAlt />, label: 'Danger Zones' },
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <FaShieldAlt size={28} color="#4F46E5" />
        <span style={styles.logoText}>WalkSafe</span>
      </div>

      <nav style={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              ...styles.navLink,
              background: isActive ? '#EEF2FF' : 'transparent',
              color: isActive ? '#4F46E5' : '#6B7280',
            })}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button onClick={handleLogout} style={styles.logoutButton}>
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    width: '240px',
    height: '100vh',
    background: 'white',
    borderRight: '1px solid #E5E7EB',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    position: 'fixed',
    left: 0,
    top: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 12px',
    marginBottom: '32px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1F2937',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
  },
  navIcon: {
    fontSize: '16px',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 12px',
    borderRadius: '8px',
    border: 'none',
    background: '#FEF2F2',
    color: '#DC2626',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
