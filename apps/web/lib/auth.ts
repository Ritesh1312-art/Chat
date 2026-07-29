export interface IUser {
  _id: string;
  id?: string;
  phoneNumber?: string;
  phone?: string;
  email?: string;
  displayName?: string;
  name?: string;
  avatar?: string;
  walletBalance?: number;
  coins?: number;
  nativeLanguage?: string;
  gender?: string;
  genderFilter?: string;
  languageFilter?: string;
  isBanned?: boolean;
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) return null;
    const data = await res.json();
    const rawUser = data.user || data;
    if (!rawUser || !rawUser._id) return null;
    return {
      ...rawUser,
      name: rawUser.displayName || rawUser.name || 'User',
      phone: rawUser.phoneNumber || rawUser.phone || '',
      coins: rawUser.walletBalance ?? rawUser.coins ?? 0,
    };
  } catch (err) {
    return null;
  }
}
