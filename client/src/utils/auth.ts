import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
  getProfile() {
    //  return the decoded token
    const token = this.getToken();
    return token ? jwtDecode<JwtPayload>(token) : null;
  }

  loggedIn() {
    // return a value that indicates if the user is logged in
    const token = this.getToken();
    return token && !this.isTokenExpired(token) ? true : false;
  }
  
  isTokenExpired(token: string): boolean {
    //  implement token expiration check
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp) {
        return decoded.exp * 1000 < Date.now();
      }
      return false;
    } catch {
      return false;
    }
  }

  getToken(): string | null {
    //  return the token
    return localStorage.getItem('token');
  }

  login(idToken: string) {
    //  set the token to localStorage
    localStorage.setItem('token', idToken);
    //  redirect to the home page
    window.location.href = '/';
  }

  logout() {
    //  remove the token from localStorage
    localStorage.removeItem('token');
    //  redirect to the login page
    window.location.href = '/';
  }
}

export default new AuthService();
