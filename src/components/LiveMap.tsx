import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useLiveUsers, useDangerZones } from '../hooks/useFirestore';

const SRI_LANKA_CENTER: [number, number] = [7.8731, 80.7718];
const ZOOM = 8;

const userIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:14px;height:14px;background:#4F46E5;border:2.5px solid white;border-radius:50%;box-shadow:0 0 0 2px #4F46E5, 0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const journeyIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:14px;height:14px;background:#D97706;border:2.5px solid white;border-radius:50%;box-shadow:0 0 0 2px #D97706, 0 2px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function FitBounds() {
  const map = useMap();
  useEffect(() => {
    map.fitBounds([[5.9, 79.6], [9.85, 81.9]], { padding: [30, 30] });
  }, [map]);
  return null;
}

export default function LiveMap() {
  const { liveUsers } = useLiveUsers();
  const { zones } = useDangerZones();

  const getDangerColor = (level: string) => {
    switch (level) {
      case 'risky': return '#DC2626';
      case 'high': return '#EA580C';
      case 'medium': return '#D97706';
      default: return '#6B7280';
    }
  };

  return (
    <div style={styles.mapWrapper}>
      <div style={styles.mapHeader}>
        <h3 style={styles.mapTitle}>Live Map</h3>
        <div style={styles.legend}>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: '#4F46E5' }} />
            Online Users
          </span>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: '#D97706' }} />
            On Journey
          </span>
          <span style={styles.legendItem}>
            <span style={{ ...styles.legendDot, background: '#DC2626' }} />
            Danger Zones
          </span>
        </div>
      </div>
      <MapContainer
        center={SRI_LANKA_CENTER}
        zoom={ZOOM}
        style={styles.map}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <FitBounds />

        {liveUsers.map((user) => (
          <Marker
            key={user.uid}
            position={[user.latitude, user.longitude]}
            icon={user.onJourney ? journeyIcon : userIcon}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>{user.displayName}</strong>
                <br />
                <span style={{ color: user.onJourney ? '#D97706' : '#4F46E5', fontSize: '12px' }}>
                  {user.onJourney ? 'On Journey' : 'Online'}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}

        {zones.map((zone) => (
          <Circle
            key={zone.id}
            center={[zone.latitude, zone.longitude]}
            radius={zone.level === 'risky' ? 800 : zone.level === 'high' ? 600 : 400}
            pathOptions={{
              color: getDangerColor(zone.level),
              fillColor: getDangerColor(zone.level),
              fillOpacity: 0.15,
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong style={{ color: getDangerColor(zone.level) }}>
                  {zone.level.toUpperCase()} Danger Zone
                </strong>
                <br />
                <span style={{ fontSize: '12px' }}>{zone.reports} reports</span>
              </div>
            </Popup>
          </Circle>
        ))}
      </MapContainer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  mapWrapper: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    marginBottom: '32px',
  },
  mapHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #E5E7EB',
  },
  mapTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1F2937',
    margin: 0,
  },
  legend: {
    display: 'flex',
    gap: '16px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#6B7280',
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  map: {
    width: '100%',
    height: '420px',
  },
};
