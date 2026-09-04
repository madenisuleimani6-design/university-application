import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  localStorage.setItem('role', response.data.role ?? 'STUDENT');
  return response.data;
};

export interface ElectionCandidate {
  id: number;
  name: string;
  manifesto?: string;
  votes: number;
  percentage: number;
  voted: boolean;
}

export interface ElectionPosition {
  id: number;
  name: string;
  displayOrder: number;
  candidates: ElectionCandidate[];
  voted: boolean;
}

export interface Election {
  id: number;
  title: string;
  description?: string;
  startsAt: string;
  endsAt: string;
  active: boolean;
  closed: boolean;
  positions: ElectionPosition[];
}

export interface ElectionResult {
  electionId: number;
  title: string;
  positions: {
    position: string;
    totalVotes: number;
    winner?: ElectionCandidate;
    candidates: ElectionCandidate[];
  }[];
}

export const getElections = async () => (await api.get<Election[]>('/elections')).data;

export const createElection = async (payload: { title: string; description: string; startsAt: string; endsAt: string }) =>
  (await api.post<Election>('/elections', payload)).data;

export const addElectionPosition = async (electionId: number, payload: { name: string; displayOrder: number }) =>
  (await api.post<ElectionPosition>(`/elections/${electionId}/positions`, payload)).data;

export const addElectionCandidate = async (positionId: number, payload: { name: string; manifesto: string }) =>
  (await api.post<ElectionCandidate>(`/elections/positions/${positionId}/candidates`, payload)).data;

export const updateElectionStatus = async (electionId: number, payload: { active: boolean; closed: boolean }) =>
  (await api.patch<Election>(`/elections/${electionId}/status`, payload)).data;

export const castElectionVote = async (electionId: number, candidateId: number) =>
  api.post(`/elections/${electionId}/votes`, { candidateId });

export const getElectionResults = async (electionId: number) =>
  (await api.get<ElectionResult>(`/elections/${electionId}/results`)).data;

export const getStudents = async () => {
  const response = await api.get('/students');
  return response.data;
};

export const getCourses = async () => {
  const response = await api.get('/courses');
  return response.data;
};

export const getPayments = async () => {
  const response = await api.get('/payments');
  return response.data;
};

export default api;
