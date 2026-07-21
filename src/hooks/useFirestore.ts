import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

export interface UserData {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  createdAt: unknown;
  rating: number;
  totalRatings: number;
  passwordUpdatedAt?: string;
}

export interface LiveUser {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  latitude: number;
  longitude: number;
  onJourney: boolean;
  rating: number;
  totalRatings: number;
  lastUpdate: number;
}

export interface JourneyRequest {
  id: string;
  requesterUid: string;
  requesterName: string;
  partnerUid: string;
  partnerName: string;
  destinationLat: number | null;
  destinationLon: number | null;
  destinationAddress: string | null;
  originLat: number | null;
  originLon: number | null;
  status: string;
  createdAt: number;
  userConfirmed: boolean;
  partnerConfirmed: boolean;
}

export interface DangerZone {
  id: string;
  latitude: number;
  longitude: number;
  level: string;
  reports: number;
  reportedLevels: number[];
  reporters: string[];
  safeVoters: string[];
  createdAt: number;
  lastUpdatedAt: number;
}

export interface SosAlert {
  id: string;
  uid: string;
  displayName: string;
  latitude: number;
  longitude: number;
  destination: string | null;
  message: string;
  createdAt: number;
}

export interface Feedback {
  id: string;
  walkerUid: string;
  reviewerUid: string;
  rating: number;
  comment: string;
  createdAt: number;
}

export function useUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];
      setUsers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { users, loading };
}

export function useLiveUsers() {
  const [liveUsers, setLiveUsers] = useState<LiveUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'live_users'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LiveUser[];
      setLiveUsers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { liveUsers, loading };
}

export function useJourneyRequests() {
  const [requests, setRequests] = useState<JourneyRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'journey_requests'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as JourneyRequest[];
      setRequests(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { requests, loading };
}

export function useDangerZones() {
  const [zones, setZones] = useState<DangerZone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'danger_zones'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DangerZone[];
      setZones(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { zones, loading };
}

export function useSosAlerts() {
  const [alerts, setAlerts] = useState<SosAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'sos_alerts'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as SosAlert[];
      setAlerts(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { alerts, loading };
}

export function useFeedback() {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'feedback'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Feedback[];
      setFeedback(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { feedback, loading };
}

export function usePendingJourneyRequests() {
  const [requests, setRequests] = useState<JourneyRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'journey_requests'),
      where('status', '==', 'pending')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as JourneyRequest[];
      setRequests(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { requests, loading };
}
