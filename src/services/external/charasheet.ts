// キャラクターシート管理サイトからのデータ取得サービス
import { setJsonpCallback, hasJsonpCallback, deleteJsonpCallback } from '../../types/global';

export interface CharasheetResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  sheetId?: string;
}

/**
 * JSONPリクエストのクリーンアップを行う
 */
const cleanupJsonpRequest = (callbackName: string, script: HTMLScriptElement): void => {
  deleteJsonpCallback(callbackName);
  if (document.head.contains(script)) {
    document.head.removeChild(script);
  }
};

/**
 * JSONP形式でデータを取得するヘルパー関数
 */
export const fetchJsonp = <T = unknown>(url: string): Promise<T> => {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_callback_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // グローバルコールバック関数を設定
    setJsonpCallback<T>(callbackName, (data: T) => {
      cleanupJsonpRequest(callbackName, script);
      resolve(data);
    });

    // スクリプトタグを作成してJSONPリクエストを実行
    const script = document.createElement('script');
    script.src = `${url}?callback=${callbackName}`;

    script.onerror = () => {
      cleanupJsonpRequest(callbackName, script);
      reject(new Error('キャラクターシートが見つからないか、アクセスできません'));
    };

    script.onload = () => {
      // コールバックが呼ばれない場合のフォールバック
      setTimeout(() => {
        if (hasJsonpCallback(callbackName)) {
          cleanupJsonpRequest(callbackName, script);
          reject(new Error('データの形式が正しくありません'));
        }
      }, 1000);
    };

    document.head.appendChild(script);

    // タイムアウト処理
    setTimeout(() => {
      if (hasJsonpCallback(callbackName)) {
        cleanupJsonpRequest(callbackName, script);
        reject(new Error('リクエストがタイムアウトしました'));
      }
    }, 15000);
  });
};
