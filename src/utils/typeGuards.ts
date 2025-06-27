/**
 * 型安全なデータアクセスのためのユーティリティ関数
 */

/**
 * 安全な文字列取得
 * @param value - チェックする値
 * @param fallback - フォールバック値（デフォルト: 空文字）
 * @returns 文字列または指定されたフォールバック値
 */
export const safeGetString = (value: unknown, fallback = ''): string => {
  return typeof value === 'string' ? value : fallback;
};

/**
 * 安全な配列取得
 * @param value - チェックする値
 * @returns 配列または空配列
 */
export const safeGetArray = <T>(value: unknown): T[] => {
  return Array.isArray(value) ? value : [];
};

/**
 * 安全な文字列配列要素取得
 * @param array - 配列
 * @param index - インデックス
 * @param fallback - フォールバック値（デフォルト: 空文字）
 * @returns 文字列または指定されたフォールバック値
 */
export const safeGetArrayString = (array: unknown[], index: number, fallback = ''): string => {
  const value = array[index];
  return typeof value === 'string' ? value : fallback;
};

/**
 * 安全な数値取得
 * @param value - チェックする値
 * @param fallback - フォールバック値（デフォルト: 0）
 * @returns 数値または指定されたフォールバック値
 */
export const safeGetNumber = (value: unknown, fallback = 0): number => {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};