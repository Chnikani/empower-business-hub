// Simple authentication system to replace Supabase Auth
export interface User {
  id: string;
  email: string;
  fullName?: string;
  role?: 'business_owner' | 'business_manager';
}

class AuthService {
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Check for stored user on initialization
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        // Validate UUID format, clear if invalid
        if (user.id && this.isValidUUID(user.id)) {
          this.currentUser = user;
        } else {
          console.warn('Invalid user ID format, clearing stored user');
          localStorage.removeItem('currentUser');
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Generate a proper UUID v4
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  async signUp(email: string, password: string, metadata?: { full_name?: string, role?: string }): Promise<void> {
    // Simulate user creation - in a real app this would call the API
    const newUser: User = {
      id: this.generateUUID(),
      email,
      fullName: metadata?.full_name || email,
      role: (metadata?.role as 'business_owner' | 'business_manager') || 'business_manager'
    };

    this.setUser(newUser);
  }

  async signIn(email: string, password: string): Promise<void> {
    // Simulate sign in - in a real app this would validate credentials
    const user: User = {
      id: this.generateUUID(),
      email,
      fullName: email,
      role: 'business_owner'
    };

    this.setUser(user);
  }

  async signOut(): Promise<void> {
    this.setUser(null);
  }

  private setUser(user: User | null) {
    this.currentUser = user;
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }

    this.listeners.forEach(listener => listener(user));
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    this.listeners.push(callback);
    
    // Call immediately with current state
    callback(this.currentUser);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

export const authService = new AuthService();