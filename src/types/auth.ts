export interface SignUpParams {
  username: string;
  password: string;
  email: string;
}

export interface SignInParams {
  username: string;
  password: string;
}

export interface AuthUser {
  username: string;
  email?: string;
  userId: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface SignUpResult extends AuthResult {
  isSignUpComplete?: boolean;
  userId?: string;
  nextStep?: any;
}

export interface SignInResult extends AuthResult {
  isSignedIn?: boolean;
  nextStep?: any;
}

export interface AuthStatus {
  isAuthenticated: boolean;
  tokens: any;
}