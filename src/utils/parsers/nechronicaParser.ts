import type { NechronicaCharacter } from '../../types/systems/nechronica';

/**
 * キャラクターシート管理サイトからのJSONデータをNechronicaCharacter型に変換
 */
export const parseNechronicaData = (rawData: any): NechronicaCharacter => {
  try {
    // データ構造の確認
    console.log('Raw character data:', rawData);

    // 基本情報の抽出（実際のデータ構造に基づく）
    const characterName = rawData.pc_name || rawData.characterName || '名前不明';
    const sex = rawData.sex || '';
    const tags = rawData.pc_tags || '';
    const position = rawData.Position_Name || '';
    const mainClass = rawData.MCLS_Name || '';
    const subClass = rawData.SCLS_Name || '';
    
    // プロフィール情報の構築
    const profileParts = [];
    if (sex) profileParts.push(`性別: ${sex}`);
    if (position) profileParts.push(`ポジション: ${position}`);
    if (mainClass) profileParts.push(`メインクラス: ${mainClass}`);
    if (subClass) profileParts.push(`サブクラス: ${subClass}`);
    if (tags) profileParts.push(`タグ: ${tags}`);
    
    const profile = profileParts.join('\n');

    // 能力値の抽出（ネクロニカの実際の能力値）
    const abilities = {
      muscle: Number(rawData.muscle) || 0,
      dexterity: Number(rawData.dexterity) || 0, 
      sense: Number(rawData.sense) || 0,
      knowledge: Number(rawData.knowledge) || 0,
      exercise: Number(rawData.exercise) || 0,
      information: Number(rawData.information) || 0,
    };

    // 部位の状態を抽出
    const parts = parseNechronicaParts(rawData);

    // スキルの抽出（ネクロニカ用）
    const skills = parseNechronicaSkills(rawData);

    // マニューバの抽出（実際のデータ構造）
    const maneuvers = parseNechronicaManeuvers(rawData);

    // 記憶のカケラの抽出
    const memoryFragments = parseNechronicaMemories(rawData);

    // 宝物/未練の抽出
    const treasures = parseNechronicaTreasures(rawData);

    return {
      name: characterName,
      profile,
      abilities,
      parts,
      skills,
      maneuvers,
      memoryFragments,
      treasures,
    };
  } catch (error) {
    console.error('Error parsing character data:', error);
    throw new Error('キャラクターデータの解析に失敗しました');
  }
};

/**
 * オブジェクトから文字列を抽出するヘルパー関数
 */
const extractString = (obj: any, keys: string[]): string | undefined => {
  for (const key of keys) {
    if (obj && typeof obj === 'object') {
      // 直接的なキーマッチ
      if (obj[key] && typeof obj[key] === 'string') {
        return obj[key].trim();
      }
      
      // ネストされたオブジェクトを検索
      for (const [objKey, objValue] of Object.entries(obj)) {
        if (typeof objValue === 'object' && objValue !== null) {
          const result = extractString(objValue, [key]);
          if (result) return result;
        }
      }
    }
  }
  return undefined;
};

/**
 * オブジェクトから数値を抽出するヘルパー関数
 */
const extractNumber = (obj: any, keys: string[]): number | undefined => {
  for (const key of keys) {
    if (obj && typeof obj === 'object') {
      // 直接的なキーマッチ
      if (obj[key] !== undefined) {
        const num = Number(obj[key]);
        if (!isNaN(num)) {
          return num;
        }
      }
      
      // ネストされたオブジェクトを検索
      for (const [objKey, objValue] of Object.entries(obj)) {
        if (typeof objValue === 'object' && objValue !== null) {
          const result = extractNumber(objValue, [key]);
          if (result !== undefined) return result;
        }
      }
    }
  }
  return undefined;
};

/**
 * ネクロニカの部位情報を解析
 */
const parseNechronicaParts = (rawData: any) => {
  const parts = [];
  
  // ネクロニカの部位構造に基づく
  const partMapping = [
    { key: 'nou_alive', name: '脳', position: 'head' },
    { key: 'medama_alive', name: '眼', position: 'head' },
    { key: 'kuchi_alive', name: '口', position: 'head' },
    { key: 'migi_ude_alive', name: '右腕', position: 'arm' },
    { key: 'hidari_ude_alive', name: '左腕', position: 'arm' },
    { key: 'mune_alive', name: '胸', position: 'body' },
    { key: 'hara_alive', name: '腹', position: 'body' },
    { key: 'koshi_alive', name: '腰', position: 'body' },
    { key: 'migi_ashi_alive', name: '右脚', position: 'leg' },
    { key: 'hidari_ashi_alive', name: '左脚', position: 'leg' },
  ];

  partMapping.forEach(part => {
    const isAlive = rawData[part.key];
    parts.push({
      name: part.name,
      position: part.position,
      damage: isAlive === '1' ? 0 : 1, // 1 = 生存, 0 = 損傷
    });
  });

  return parts;
};

/**
 * 部位名から位置を推定
 */
const mapPartPosition = (partName: string): string => {
  const name = partName.toLowerCase();
  
  if (name.includes('頭') || name.includes('head')) return 'head';
  if (name.includes('腕') || name.includes('arm') || name.includes('手')) return 'arm';
  if (name.includes('胴') || name.includes('体') || name.includes('body') || name.includes('chest')) return 'body';
  if (name.includes('脚') || name.includes('足') || name.includes('leg')) return 'leg';
  
  return 'body'; // デフォルト
};

/**
 * ネクロニカのスキル情報を解析
 */
const parseNechronicaSkills = (rawData: any) => {
  const skills = [];
  
  // ネクロニカの基本技能
  const skillMapping = [
    { key: 'Skill_Hakuhei', name: '白兵' },
    { key: 'Skill_Syageki', name: '射撃' },
    { key: 'Skill_Henni', name: '変異' },
    { key: 'Skill_Kaizou', name: '改造' },
  ];

  skillMapping.forEach(skill => {
    const level = Number(rawData[skill.key]) || 0;
    skills.push({
      name: skill.name,
      level: level,
    });
  });

  return skills;
};

/**
 * ネクロニカのマニューバ情報を解析
 */
const parseNechronicaManeuvers = (rawData: any) => {
  const maneuvers = [];
  
  // Power_name配列からマニューバを抽出
  const powerNames = rawData.Power_name || [];
  const powerMemos = rawData.Power_memo || [];
  const powerCosts = rawData.Power_cost || [];
  const powerTimings = rawData.Power_timing || [];
  const powerRanges = rawData.Power_range || [];

  for (let i = 0; i < powerNames.length; i++) {
    const name = powerNames[i];
    if (name && name.trim()) {
      maneuvers.push({
        name: name.trim(),
        cost: Number(powerCosts[i]) || 0,
        timing: powerTimings[i] || '不明',
        range: powerRanges[i] || '不明',
        description: powerMemos[i] || '',
      });
    }
  }

  return maneuvers;
};

/**
 * ネクロニカの記憶のカケラを解析
 */
const parseNechronicaMemories = (rawData: any) => {
  const memories = [];
  
  // carma_name配列から記憶のカケラを抽出
  const carmaNames = rawData.carma_name || [];
  const carmaMemos = rawData.carma_memo || [];

  for (let i = 0; i < carmaNames.length; i++) {
    const name = carmaNames[i];
    if (name && name.trim()) {
      memories.push({
        name: name.trim(),
        description: carmaMemos[i] || '',
      });
    }
  }

  return memories;
};

/**
 * ネクロニカの宝物/未練を解析
 */
const parseNechronicaTreasures = (rawData: any) => {
  const treasures = [];
  
  // roice_name配列から宝物を抽出
  const roiceNames = rawData.roice_name || [];
  const roiceMemos = rawData.roice_memo || [];

  for (let i = 0; i < roiceNames.length; i++) {
    const name = roiceNames[i];
    if (name && name.trim()) {
      treasures.push({
        name: name.trim(),
        description: roiceMemos[i] || '',
      });
    }
  }

  return treasures;
};