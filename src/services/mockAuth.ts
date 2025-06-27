// 開発・テスト用のモック認証サービス
import type {
  SignUpParams,
  SignInParams,
  AuthUser,
  SignUpResult,
  SignInResult,
  AuthStatus,
} from '../types/auth';

// ローカルストレージキー
const MOCK_USERS_KEY = 'trpg_mock_users';
const MOCK_CURRENT_USER_KEY = 'trpg_current_user';

interface MockUser {
  username: string;
  email: string;
  password: string;
  userId: string;
  isVerified: boolean;
}

/**
 * ローカルストレージからユーザーリストを取得
 */
const getMockUsers = (): MockUser[] => {
  const users = localStorage.getItem(MOCK_USERS_KEY);
  return users ? JSON.parse(users) : [];
};

/**
 * ローカルストレージにユーザーリストを保存
 */
const saveMockUsers = (users: MockUser[]) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

/**
 * 現在のユーザーを保存
 */
const saveCurrentUser = (user: AuthUser | null) => {
  if (user) {
    localStorage.setItem(MOCK_CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(MOCK_CURRENT_USER_KEY);
  }
};

/**
 * モックユーザー登録
 */
export const mockSignUp = async ({
  username,
  email,
  password,
}: SignUpParams): Promise<SignUpResult> => {
  // 遅延をシミュレート
  await new Promise(resolve => setTimeout(resolve, 1000));

  const users = getMockUsers();

  // 既存ユーザーチェック
  if (users.find(u => u.email === email || u.username === username)) {
    return {
      success: false,
      error: 'ユーザーは既に存在します',
    };
  }

  // 新しいユーザーを作成
  const newUser: MockUser = {
    username,
    email,
    password,
    userId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    isVerified: true, // モックでは即座に認証済みとする
  };

  users.push(newUser);
  saveMockUsers(users);

  return {
    success: true,
    isSignUpComplete: true,
    userId: newUser.userId,
  };
};

/**
 * モックログイン
 */
export const mockSignIn = async ({ username, password }: SignInParams): Promise<SignInResult> => {
  // 遅延をシミュレート
  await new Promise(resolve => setTimeout(resolve, 1000));

  const users = getMockUsers();
  const user = users.find(
    u => (u.email === username || u.username === username) && u.password === password
  );

  if (!user) {
    return {
      success: false,
      error: 'メールアドレスまたはパスワードが正しくありません',
    };
  }

  if (!user.isVerified) {
    return {
      success: false,
      error: 'アカウントが認証されていません',
    };
  }

  // 現在のユーザーとして保存
  const authUser: AuthUser = {
    username: user.username,
    email: user.email,
    userId: user.userId,
  };

  saveCurrentUser(authUser);

  return {
    success: true,
    isSignedIn: true,
  };
};

/**
 * モックログアウト
 */
export const mockSignOut = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  saveCurrentUser(null);
  return { success: true };
};

/**
 * 現在のモックユーザー情報を取得
 */
export const getCurrentMockUser = async (): Promise<AuthUser | null> => {
  const userStr = localStorage.getItem(MOCK_CURRENT_USER_KEY);
  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * モック認証状態を確認
 */
export const checkMockAuthStatus = async (): Promise<AuthStatus> => {
  const user = await getCurrentMockUser();
  return {
    isAuthenticated: !!user,
    tokens: user ? { mock: true } : null,
  };
};
