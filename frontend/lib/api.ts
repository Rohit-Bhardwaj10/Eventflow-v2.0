/**
 * lib/api.ts
 * Typed API client for the Eventflow NestJS backend.
 * All paths relative to NEXT_PUBLIC_API_URL (http://localhost:3001/api/v1).
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

// ─── Token helpers ─────────────────────────────────────────────────────────

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ef_access');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('ef_refresh');
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem('ef_access', access);
  localStorage.setItem('ef_refresh', refresh);
}

export function clearTokens() {
  localStorage.removeItem('ef_access');
  localStorage.removeItem('ef_refresh');
}

// ─── Core fetch wrapper ────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  // Auto-refresh on 401
  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return request<T>(path, options, false);
    clearTokens();
    if (typeof window !== 'undefined') window.location.href = '/login';
    throw new ApiError(401, 'Session expired');
  }

  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      msg = body.message ?? msg;
    } catch {}
    throw new ApiError(res.status, msg);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

async function tryRefresh(): Promise<boolean> {
  const rToken = getRefreshToken();
  if (!rToken) return false;
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken ?? rToken);
    return true;
  } catch {
    return false;
  }
}

// ─── Types ─────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string | null;
  bio?: string | null;
  year?: number | null;
  interests?: string[];
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  type: 'IN_PERSON' | 'ONLINE' | 'HYBRID';
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  coverImage?: string | null;
  startAt: string;
  endAt: string;
  venue?: string | null;
  meetingLink?: string | null;
  capacity?: number | null;
  tags: string[];
  category?: string | null;
  faqs: { q: string; a: string }[];
  speakers: { name: string; bio: string; photo?: string }[];
  createdAt: string;
  club: {
    id: string;
    name: string;
    logo?: string | null;
    bio?: string | null;
  };
  ticketTiers?: TicketTier[];
  _count?: { registrations: number };
}

export interface TicketTier {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  capacity?: number | null;
  available?: number | null;
  closesAt?: string | null;
}

export interface Club {
  id: string;
  slug: string;
  name: string;
  tagline?: string | null;
  category: string;
  bio?: string | null;
  logo?: string | null;
  banner?: string | null;
  website?: string | null;
  instagram?: string | null;
  twitter?: string | null;
  status: string;
  isVerified: boolean;
  createdAt: string;
  _count?: { members: number; events: number };
}

export interface Registration {
  id: string;
  status: 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED' | 'ATTENDED';
  qrToken: string;
  registeredAt: string;
  cancelledAt?: string | null;
  event: Event;
  tier?: TicketTier | null;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  data: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  events?: T[];
  clubs?: T[];
  registrations?: T[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export const auth = {
  register: (body: { name: string; email: string; password: string; year?: number }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),

  login: (body: { email: string; password: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),

  me: () => request<AuthUser>('/auth/me'),

  logout: () =>
    request<{ message: string }>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken: getRefreshToken() }),
    }),
};

// ─── Events ─────────────────────────────────────────────────────────────────

export const events = {
  list: (page = 1, limit = 20) =>
    request<{ events: Event[]; meta: PaginatedResponse<Event>['meta'] }>(
      `/events?page=${page}&limit=${limit}`,
    ),

  get: (slug: string) => request<Event>(`/events/${slug}`),

  register: (eventId: string, tierId?: string) =>
    request<Registration>(`/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify({ eventId, ...(tierId && { tierId }) }),
    }),
};

// ─── Clubs ───────────────────────────────────────────────────────────────────

export const clubs = {
  list: (page = 1, limit = 20) =>
    request<{ clubs: Club[]; meta: PaginatedResponse<Club>['meta'] }>(
      `/clubs?page=${page}&limit=${limit}`,
    ),

  get: (slug: string) => request<Club>(`/clubs/${slug}`),

  join: (slug: string) =>
    request<{ message: string }>(`/clubs/${slug}/join`, { method: 'POST', body: '{}' }),

  leave: (slug: string) =>
    request<{ message: string }>(`/clubs/${slug}/leave`, { method: 'DELETE' }),
};

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = {
  me: () => request<AuthUser>('/users/me'),

  update: (body: Partial<{ name: string; bio: string; year: number; interests: string[] }>) =>
    request<AuthUser>('/users/me', { method: 'PATCH', body: JSON.stringify(body) }),

  myClubs: () =>
    request<{ clubId: string; role: string; joinedAt: string; club: Club }[]>('/users/me/clubs'),

  myRegistrations: () => request<Registration[]>('/users/me/registrations'),
};

// ─── Registrations ────────────────────────────────────────────────────────────

export const registrations = {
  list: (page = 1, limit = 20) =>
    request<{ registrations: Registration[]; meta: PaginatedResponse<Registration>['meta'] }>(
      `/my/registrations?page=${page}&limit=${limit}`,
    ),

  get: (id: string) => request<Registration & { qrCodeDataUrl: string }>(`/my/registrations/${id}`),

  cancel: (id: string) =>
    request<{ message: string }>(`/registrations/${id}`, { method: 'DELETE' }),
};

// ─── Search ────────────────────────────────────────────────────────────────

export const search = {
  global: (q: string) =>
    request<{ events: Partial<Event>[]; clubs: Partial<Club>[] }>(`/search?q=${encodeURIComponent(q)}`),
};

// ─── Notifications ────────────────────────────────────────────────────────────

export const notifications = {
  list: (page = 1, limit = 20) =>
    request<{ notifications: Notification[]; meta: PaginatedResponse<Notification>['meta'] }>(
      `/notifications?page=${page}&limit=${limit}`,
    ),

  unreadCount: () => request<{ count: number }>('/notifications/unread-count'),

  markAllRead: () => request<void>('/notifications/read-all', { method: 'PATCH', body: '{}' }),

  markRead: (id: string) =>
    request<void>(`/notifications/${id}/read`, { method: 'PATCH', body: '{}' }),
};
