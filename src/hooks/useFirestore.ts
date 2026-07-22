import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy, limit, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export interface UserData {
  id: string;
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
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
  isOnline: boolean;
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

export interface ApprovalRequest {
  id: string;
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected';
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

export function useApprovalRequests() {
  const [requests, setRequests] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'approval_requests'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ApprovalRequest[];
      setRequests(data);
      setLoading(false);
    }, () => {
      setRequests([]);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const approveUser = async (uid: string) => {
    const reqDoc = await getDoc(doc(db, 'approval_requests', uid));
    const reqData = reqDoc.data();
    await updateDoc(doc(db, 'approval_requests', uid), { status: 'approved' });
    if (reqData) {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        await setDoc(doc(db, 'users', uid), { phone: reqData.phone }, { merge: true });
      }
    }
  };

  const rejectUser = async (uid: string) => {
    await updateDoc(doc(db, 'approval_requests', uid), { status: 'rejected' });
  };

  return { requests, loading, approveUser, rejectUser };
}

export function useLiveUsers() {
  const [liveUsers, setLiveUsers] = useState<LiveUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'live_users'), (snapshot) => {
      const now = Date.now();
      const staleThreshold = 300000;
      const allDocs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as LiveUser[];
      const uniqueByUid = new Map<string, LiveUser>();
      allDocs.forEach((user) => {
        if (user.isOnline && user.lastUpdate && (now - user.lastUpdate) < staleThreshold) {
          if (!uniqueByUid.has(user.uid)) {
            uniqueByUid.set(user.uid, user);
          }
        }
      });
      setLiveUsers(Array.from(uniqueByUid.values()));
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
