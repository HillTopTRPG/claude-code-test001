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

// AWS Amplify認証のnextStep型定義
export interface AuthNextStep {
  signUpStep?: 'CONFIRM_SIGN_UP' | 'COMPLETE_AUTO_SIGN_IN' | 'DONE';
  signInStep?: 'CONFIRM_SIGN_UP' | 'CONFIRM_SIGN_IN_WITH_NEW_PASSWORD' | 'CONFIRM_SIGN_IN_WITH_CUSTOM_CHALLENGE' | 'CONFIRM_SIGN_IN_WITH_SMS_MFA' | 'CONFIRM_SIGN_IN_WITH_TOTP_MFA' | 'CONTINUE_SIGN_IN_WITH_MFA_SELECTION' | 'CONTINUE_SIGN_IN_WITH_TOTP_SETUP' | 'RESET_PASSWORD' | 'DONE';
  codeDeliveryDetails?: {
    destination?: string;
    deliveryMedium?: 'EMAIL' | 'SMS';
    attributeName?: string;
  };
  missingAttributes?: string[];
  allowedMFATypes?: ('SMS' | 'TOTP')[];
  totpSetupDetails?: {
    sharedSecret: string;
    getSetupUri: (appName: string, accountName?: string) => string;
  };
}

// AWS Amplify認証のトークン型定義
export interface AuthTokens {
  accessToken: {
    toString: () => string;
    payload: {
      sub: string;
      iss: string;
      client_id: string;
      origin_jti: string;
      event_id: string;
      token_use: string;
      scope: string;
      auth_time: number;
      exp: number;
      iat: number;
      jti: string;
      username: string;
    };
  };
  idToken?: {
    toString: () => string;
    payload: {
      sub: string;
      aud: string;
      'cognito:groups'?: string[];
      email_verified?: boolean;
      iss: string;
      'cognito:username': string;
      origin_jti: string;
      event_id: string;
      token_use: string;
      auth_time: number;
      exp: number;
      iat: number;
      jti: string;
      email?: string;
    };
  };
  refreshToken?: {
    toString: () => string;
  };
}

export interface SignUpResult extends AuthResult {
  isSignUpComplete?: boolean;
  userId?: string;
  nextStep?: AuthNextStep;
}

export interface SignInResult extends AuthResult {
  isSignedIn?: boolean;
  nextStep?: AuthNextStep;
}

export interface AuthStatus {
  isAuthenticated: boolean;
  tokens?: AuthTokens;
}
