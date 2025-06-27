import { signUp, signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import type {
  SignUpParams,
  SignInParams,
  AuthUser,
  SignUpResult,
  SignInResult,
  AuthStatus,
} from '../types/auth';
import {
  mockSignUp,
  mockSignIn,
  mockSignOut,
  getCurrentMockUser,
  checkMockAuthStatus,
} from './mockAuth';

// 開発環境ではモック認証を使用
const USE_MOCK_AUTH = import.meta.env.DEV || !import.meta.env.VITE_AWS_REGION;

/**
 * ユーザー登録
 */
export const authSignUp = async ({
  username,
  password,
  email,
}: SignUpParams): Promise<SignUpResult> => {
  if (USE_MOCK_AUTH) {
    return mockSignUp({ username, password, email });
  }

  try {
    const { isSignUpComplete, userId, nextStep } = await signUp({
      username,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    });

    return {
      success: true,
      isSignUpComplete,
      userId,
      nextStep,
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sign up failed',
    };
  }
};

/**
 * ログイン
 */
export const authSignIn = async ({ username, password }: SignInParams): Promise<SignInResult> => {
  if (USE_MOCK_AUTH) {
    return mockSignIn({ username, password });
  }

  try {
    const { isSignedIn, nextStep } = await signIn({
      username,
      password,
    });

    return {
      success: true,
      isSignedIn,
      nextStep,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sign in failed',
    };
  }
};

/**
 * ログアウト
 */
export const authSignOut = async () => {
  if (USE_MOCK_AUTH) {
    return mockSignOut();
  }

  try {
    await signOut();
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Sign out failed',
    };
  }
};

/**
 * 現在のユーザー情報を取得
 */
export const getCurrentAuthUser = async (): Promise<AuthUser | null> => {
  if (USE_MOCK_AUTH) {
    return getCurrentMockUser();
  }

  try {
    const user = await getCurrentUser();
    return {
      username: user.username,
      userId: user.userId,
      email: user.signInDetails?.loginId,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * 認証状態を確認
 */
export const checkAuthStatus = async (): Promise<AuthStatus> => {
  if (USE_MOCK_AUTH) {
    return checkMockAuthStatus();
  }

  try {
    const session = await fetchAuthSession();
    return {
      isAuthenticated: !!session.tokens,
      tokens: session.tokens,
    };
  } catch (error) {
    console.error('Check auth status error:', error);
    return {
      isAuthenticated: false,
      tokens: null,
    };
  }
};
