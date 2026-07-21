import { useState } from 'react';
import { FaSave } from 'react-icons/fa';

export default function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'WalkSafe',
    enableNotifications: true,
    enableLocationTracking: true,
    alertTimeout: '30',
    maxRouteDeviation: '500',
    maintenanceMode: false,
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>General Settings</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Site Name</label>
          <input
            type="text"
            value={settings.siteName}
            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Maintenance Mode</label>
          <div style={styles.toggle}>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              style={styles.checkbox}
            />
            <span style={styles.toggleLabel}>Enable maintenance mode</span>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Safety Settings</h3>
        <div style={styles.formGroup}>
          <label style={styles.label}>Alert Timeout (seconds)</label>
          <input
            type="number"
            value={settings.alertTimeout}
            onChange={(e) => setSettings({ ...settings, alertTimeout: e.target.value })}
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label style={styles.label}>Max Route Deviation (meters)</label>
          <input
            type="number"
            value={settings.maxRouteDeviation}
            onChange={(e) => setSettings({ ...settings, maxRouteDeviation: e.target.value })}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Notification Settings</h3>
        <div style={styles.formGroup}>
          <div style={styles.toggle}>
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
              style={styles.checkbox}
            />
            <span style={styles.toggleLabel}>Enable push notifications</span>
          </div>
        </div>
        <div style={styles.formGroup}>
          <div style={styles.toggle}>
            <input
              type="checkbox"
              checked={settings.enableLocationTracking}
              onChange={(e) => setSettings({ ...settings, enableLocationTracking: e.target.checked })}
              style={styles.checkbox}
            />
            <span style={styles.toggleLabel}>Enable location tracking</span>
          </div>
        </div>
      </div>

      <button onClick={handleSave} style={styles.saveButton}>
        <FaSave />
        Save Settings
      </button>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '32px',
    maxWidth: '600px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    margin: '0 0 20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    border: '1px solid #D1D5DB',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  toggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    accentColor: '#4F46E5',
  },
  toggleLabel: {
    fontSize: '14px',
    color: '#374151',
  },
  saveButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    background: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};
