export interface IUser {
  _id: string;
  phone: string;
  name?: string;
  avatar?: string;
  coins: number;
}

export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('vibe_token');
  }
  return null;
}

export function setToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('vibe_token', token);
  }
}

export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('vibe_token');
  }
}

export function parseJwt(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
}

export async function fetchCurrentUser(token: string): Promise<IUser | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch (err) {
    return null;
  }
}
