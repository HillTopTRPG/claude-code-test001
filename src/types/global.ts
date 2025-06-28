// グローバル型定義とWindow拡張

// Window拡張（JSONP用）
export interface WindowWithJsonpCallbacks extends Window {
  [key: string]: unknown;
}

// グローバルコールバック関数の型
export type JsonpCallback<T = unknown> = (data: T) => void;

// HTMLElementの型安全性確保
export interface WindowGlobal extends Window {
  // JSONP用の動的プロパティを許可
  [callbackName: `jsonp_callback_${string}`]: JsonpCallback<unknown>;
}

// Windowオブジェクトの型アサーション用ヘルパー
export const getWindowWithJsonp = (): WindowGlobal => window as unknown as WindowGlobal;

// ジェネリクス対応のJSONPコールバック設定ヘルパー
export const setJsonpCallback = <T>(callbackName: string, callback: (data: T) => void): void => {
  const globalWindow = getWindowWithJsonp();
  globalWindow[callbackName as `jsonp_callback_${string}`] = callback as JsonpCallback<unknown>;
};

// JSONPコールバックの存在確認ヘルパー
export const hasJsonpCallback = (callbackName: string): boolean => {
  const globalWindow = getWindowWithJsonp();
  return Boolean(globalWindow[callbackName as `jsonp_callback_${string}`]);
};

// JSONPコールバックの削除ヘルパー
export const deleteJsonpCallback = (callbackName: string): void => {
  const globalWindow = getWindowWithJsonp();
  delete globalWindow[callbackName as `jsonp_callback_${string}`];
};
