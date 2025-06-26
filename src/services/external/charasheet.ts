// キャラクターシート管理サイトからのデータ取得サービス

const CHARASHEET_BASE_URL = 'https://charasheet.vampire-blood.net';

export interface CharasheetResponse {
  success: boolean;
  data?: any;
  error?: string;
  sheetId?: string;
}

/**
 * JSONP形式でキャラクターシートデータを取得
 */
export const fetchCharacterSheetData = async (url: string): Promise<CharasheetResponse> => {
  try {
    // URLからキャラクターシートIDを抽出
    const sheetId = extractSheetId(url);
    if (!sheetId) {
      throw new Error('URLからキャラクターシートIDを抽出できませんでした。正しいURLを入力してください。');
    }

    console.log('Extracting character sheet ID:', sheetId);

    // JSONPでデータを取得
    const data = await fetchJsonp(`${CHARASHEET_BASE_URL}/${sheetId}.js`);
    
    return {
      success: true,
      data,
      sheetId
    };
  } catch (error) {
    console.error('Failed to fetch character sheet data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'キャラクターシートの取得に失敗しました'
    };
  }
};

/**
 * URLからキャラクターシートIDを抽出
 * 対応するURL形式:
 * - https://charasheet.vampire-blood.net/12345
 * - https://charasheet.vampire-blood.net/sheet/12345
 * - 12345 (IDのみ)
 */
const extractSheetId = (url: string): string | null => {
  try {
    // URLではなく直接IDが入力された場合
    if (/^\d+$/.test(url.trim())) {
      return url.trim();
    }

    const urlObj = new URL(url);
    
    // vampire-blood.netのドメインでない場合はエラー
    if (!urlObj.hostname.includes('charasheet.vampire-blood.net')) {
      throw new Error('対応していないURLです');
    }

    const pathSegments = urlObj.pathname.split('/').filter(segment => segment);
    
    // パスからIDを抽出
    for (const segment of pathSegments) {
      if (/^\d+$/.test(segment)) {
        return segment;
      }
    }
    
    return null;
  } catch (error) {
    // URLパースに失敗した場合、数字のみかチェック
    if (/^\d+$/.test(url.trim())) {
      return url.trim();
    }
    return null;
  }
};

/**
 * JSONP形式でデータを取得するヘルパー関数
 */
const fetchJsonp = (url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_callback_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    
    // グローバルコールバック関数を設定
    (window as any)[callbackName] = (data: any) => {
      delete (window as any)[callbackName];
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      resolve(data);
    };
    
    // スクリプトタグを作成してJSONPリクエストを実行
    const script = document.createElement('script');
    script.src = `${url}?callback=${callbackName}`;
    
    script.onerror = () => {
      delete (window as any)[callbackName];
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      reject(new Error('キャラクターシートが見つからないか、アクセスできません'));
    };
    
    script.onload = () => {
      // コールバックが呼ばれない場合のフォールバック
      setTimeout(() => {
        if ((window as any)[callbackName]) {
          delete (window as any)[callbackName];
          if (document.head.contains(script)) {
            document.head.removeChild(script);
          }
          reject(new Error('データの形式が正しくありません'));
        }
      }, 1000);
    };
    
    document.head.appendChild(script);
    
    // タイムアウト処理
    setTimeout(() => {
      if ((window as any)[callbackName]) {
        delete (window as any)[callbackName];
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        reject(new Error('リクエストがタイムアウトしました'));
      }
    }, 15000);
  });
};

/**
 * デモ用のモックデータを返す関数
 */
export const getMockNechronicaData = (): Promise<CharasheetResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          characterName: "テストドール",
          age: "外見年齢14歳",
          height: "150cm",
          weight: "45kg",
          abilities: {
            muscle: 2,
            dexterity: 3,
            sense: 1,
            knowledge: 2,
            exercise: 1,
            information: 3
          },
          parts: [
            { name: "頭部", damage: 0, position: "head" },
            { name: "右腕", damage: 1, position: "arm" },
            { name: "左腕", damage: 0, position: "arm" },
            { name: "胴体", damage: 0, position: "body" },
            { name: "右脚", damage: 0, position: "leg" },
            { name: "左脚", damage: 1, position: "leg" }
          ],
          skills: [
            { name: "白兵", level: 2 },
            { name: "射撃", level: 1 },
            { name: "変異", level: 3 },
            { name: "改造", level: 1 }
          ],
          maneuvers: [
            { name: "切断攻撃", cost: 0, timing: "オート", range: "至近", description: "近接攻撃時に追加ダメージ" },
            { name: "超反応", cost: 1, timing: "ラピッド", range: "自身", description: "判定の直前に宣言" }
          ],
          memoryFragments: [
            { name: "大切な人形", description: "小さい頃から大切にしていた人形" },
            { name: "音楽の記憶", description: "誰かと一緒に聞いた美しい音楽" }
          ],
          treasures: [
            { name: "壊れたオルゴール", description: "まだかすかに音が鳴る小さなオルゴール" }
          ],
          profile: "テスト用のキャラクターです。",
          notes: "デモ用データ"
        },
        sheetId: "demo"
      });
    }, 1500);
  });
};