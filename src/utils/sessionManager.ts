export class SessionManager {
  private static readonly ACCESS_TOKEN_KEY = 'token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

  static async getAccessToken(): Promise<string | null> {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static async setAccessToken(token: string): Promise<void> {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  static async getRefreshToken(): Promise<string | null> {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static async setRefreshToken(token: string): Promise<void> {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  static async clearSession(): Promise<void> {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}