import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

export async function createSession(): Promise<{
  token: string;
  recipientEmail: string;
  subjectToUse: string;
}> {
  const { data } = await api.post('/sessions');
  return data;
}

export async function getLatestByToken(token: string) {
  const { data } = await api.get('/emails/latest', { params: { token } });
  return data as { found: boolean; email?: any };
}

export async function listEmails() {
  const { data } = await api.get('/emails');
  return data as any[];
}
