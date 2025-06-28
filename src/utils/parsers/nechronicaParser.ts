import type { NechronicaCharacter } from '../../types/systems/nechronica';
import { safeGetString, safeGetArray, safeGetArrayString } from '../typeGuards';

// 外部キャラクターシート管理サイトから取得される実際のデータ構造
interface RawNechronicaApiData {
  pc_name?: string;
  characterName?: string;
  sex?: string;
  pc_tags?: string;
  Position_Name?: string;
  MCLS_Name?: string;
  SCLS_Name?: string;
  muscle?: string | number;
  dexterity?: string | number;
  sense?: string | number;
  knowledge?: string | number;
  exercise?: string | number;
  information?: string | number;
  // 部位の生存状態
  nou_alive?: string;
  medama_alive?: string;
  kuchi_alive?: string;
  migi_ude_alive?: string;
  hidari_ude_alive?: string;
  mune_alive?: string;
  hara_alive?: string;
  koshi_alive?: string;
  migi_ashi_alive?: string;
  hidari_ashi_alive?: string;
  // スキル
  Skill_Hakuhei?: string | number;
  Skill_Syageki?: string | number;
  Skill_Henni?: string | number;
  Skill_Kaizou?: string | number;
  // 配列データ
  Power_name?: string[];
  Power_memo?: string[];
  Power_cost?: (string | number)[];
  Power_timing?: string[];
  Power_range?: string[];
  Power_hantei?: (string | number)[];
  Power_Type?: (string | number)[];
  carma_name?: string[];
  carma_memo?: string[];
  roice_name?: string[];
  roice_memo?: string[];
  [key: string]: unknown;
}

/**
 * キャラクターシート管理サイトからのJSONデータをNechronicaCharacter型に変換
 */
// 基本パーツ名のマッピング（優先順位が高い）
const basicPartsMapping: Record<string, string> = {
  'のうみそ': 'brain',
  '脳みそ': 'brain',
  'めだま': 'eye', 
  '眼球': 'eye',
  'あご': 'jaw',
  '顎': 'jaw',
  'こぶし': 'fist',
  '拳': 'fist',
  'うで': 'arm',
  '腕': 'arm',
  'かた': 'shoulder',
  '肩': 'shoulder', 
  'せぼね': 'spine',
  '背骨': 'spine',
  'はらわた': 'viscera',
  '内臓': 'viscera',
  'ほね': 'bone',
  '骨': 'bone',
  'あし': 'leg',
  '脚': 'leg',
  '足': 'leg'
};

/**
 * マニューバのアイコン画像パスを取得する関数
 */
export const getManeuverIconPath = (maneuverName: string, attachment: string): string => {
  const basePath = '/src/components/systems/nechronica/images';
  
  // 基本パーツのチェック（優先）
  for (const [partName, fileName] of Object.entries(basicPartsMapping)) {
    if (maneuverName.includes(partName)) {
      return `${basePath}/maneuver-base/${fileName}.png`;
    }
  }
  
  // 部位別のフォールバック
  const attachmentMapping: Record<string, string> = {
    'head': 'head',
    'arm': 'arm', 
    'body': 'body',
    'leg': 'leg',
    'position': 'skill',
    'main-class': 'skill',
    'sub-class': 'skill'
  };
  
  const iconName = attachmentMapping[attachment];
  if (iconName) {
    return `${basePath}/maneuver/${iconName}.png`;
  }
  
  // デフォルト
  return `${basePath}/unknown.png`;
};

/**
 * マニューバタイプから背景画像パスを取得する関数
 */
export const getManeuverBackgroundPath = (powerType: string | number): string => {
  const basePath = '/src/components/systems/nechronica/images';
  const typeNum = Number(powerType);
  
  // Power_Type値に対応するファイル名
  const typeMapping: Record<number, string> = {
    0: '0', // なし
    1: '1', // 通常
    2: '2', // 必殺技
    3: '3', // 行動値増加
    4: '4', // 補助
    5: '5', // 妨害
    6: '6', // 防御/生贄
    7: '7', // 移動
  };
  
  const fileName = typeMapping[typeNum];
  if (fileName) {
    return `${basePath}/maneuver-back/${fileName}.png`;
  }
  
  // デフォルト（なし）
  return `${basePath}/maneuver-back/0.png`;
};

export const parseNechronicaData = (rawData: RawNechronicaApiData | Record<string, unknown>): NechronicaCharacter => {
  try {
    // データ構造の確認
    console.log('Raw character data:', rawData);

    // 基本情報の抽出（実際のデータ構造に基づく）
    const characterName = safeGetString(rawData.pc_name) || 
                         safeGetString(rawData.characterName) || 
                         '名前不明';
    const sex = safeGetString(rawData.sex);
    const tags = safeGetString(rawData.pc_tags);
    const position = safeGetString(rawData.Position_Name);
    const mainClass = safeGetString(rawData.MCLS_Name);
    const subClass = safeGetString(rawData.SCLS_Name);

    // プロフィール情報の構築
    const profileParts: string[] = [];
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
 * ネクロニカの部位情報を解析
 */
const parseNechronicaParts = (rawData: RawNechronicaApiData | Record<string, unknown>) => {
  const parts: Array<{
    name: string;
    position: 'head' | 'arm' | 'body' | 'leg';
    damage: number;
  }> = [];

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
      position: part.position as 'head' | 'arm' | 'body' | 'leg',
      damage: isAlive === '1' ? 0 : 1, // 1 = 生存, 0 = 損傷
    });
  });

  return parts;
};

/**
 * ネクロニカのスキル情報を解析
 */
const parseNechronicaSkills = (rawData: RawNechronicaApiData | Record<string, unknown>) => {
  const skills: Array<{
    name: string;
    level: number;
  }> = [];

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
 * Power_hantei値をattachment値に変換
 */
const convertPowerHanteiToAttachment = (hantei: string | number): 'position' | 'main-class' | 'sub-class' | 'head' | 'arm' | 'body' | 'leg' => {
  const hanteiNum = Number(hantei);
  
  const hanteiMapping: Record<number, 'position' | 'main-class' | 'sub-class' | 'head' | 'arm' | 'body' | 'leg'> = {
    1: 'position',
    2: 'main-class',
    3: 'sub-class',
    4: 'head',
    5: 'arm',
    6: 'body',
    7: 'leg',
  };
  
  return hanteiMapping[hanteiNum] || 'body'; // デフォルトは胴体
};

/**
 * ネクロニカのマニューバ情報を解析
 */
const parseNechronicaManeuvers = (rawData: RawNechronicaApiData | Record<string, unknown>) => {
  const maneuvers: Array<{
    name: string;
    cost: number;
    timing: string;
    range: string;
    description: string;
    attachment: 'position' | 'main-class' | 'sub-class' | 'head' | 'arm' | 'body' | 'leg';
    powerType: number;
  }> = [];

  // Power_name配列からマニューバを抽出
  const powerNames = safeGetArray<string>(rawData.Power_name);
  const powerMemos = safeGetArray<string>(rawData.Power_memo);
  const powerCosts = safeGetArray<string | number>(rawData.Power_cost);
  const powerTimings = safeGetArray<string>(rawData.Power_timing);
  const powerRanges = safeGetArray<string>(rawData.Power_range);
  const powerHanteis = safeGetArray<string | number>(rawData.Power_hantei);
  const powerTypes = safeGetArray<string | number>(rawData.Power_Type);

  for (let i = 0; i < powerNames.length; i++) {
    const name = safeGetArrayString(powerNames, i);
    if (name.trim()) {
      maneuvers.push({
        name: name.trim(),
        cost: Number(powerCosts[i]) || 0,
        timing: safeGetArrayString(powerTimings, i, '不明'),
        range: safeGetArrayString(powerRanges, i, '不明'),
        description: safeGetArrayString(powerMemos, i),
        attachment: convertPowerHanteiToAttachment(powerHanteis[i] || 6), // デフォルトは胴体(6)
        powerType: Number(powerTypes[i]) || 0, // デフォルトは0（なし）
      });
    }
  }

  return maneuvers;
};

/**
 * ネクロニカの記憶のカケラを解析
 */
const parseNechronicaMemories = (rawData: RawNechronicaApiData | Record<string, unknown>) => {
  const memories: Array<{
    name: string;
    description: string;
  }> = [];

  // carma_name配列から記憶のカケラを抽出
  const carmaNames = safeGetArray<string>(rawData.carma_name);
  const carmaMemos = safeGetArray<string>(rawData.carma_memo);

  for (let i = 0; i < carmaNames.length; i++) {
    const name = safeGetArrayString(carmaNames, i);
    if (name.trim()) {
      memories.push({
        name: name.trim(),
        description: safeGetArrayString(carmaMemos, i),
      });
    }
  }

  return memories;
};

/**
 * ネクロニカの宝物/未練を解析
 */
const parseNechronicaTreasures = (rawData: RawNechronicaApiData | Record<string, unknown>) => {
  const treasures: Array<{
    name: string;
    description: string;
  }> = [];

  // roice_name配列から宝物を抽出
  const roiceNames = safeGetArray<string>(rawData.roice_name);
  const roiceMemos = safeGetArray<string>(rawData.roice_memo);

  for (let i = 0; i < roiceNames.length; i++) {
    const name = safeGetArrayString(roiceNames, i);
    if (name.trim()) {
      treasures.push({
        name: name.trim(),
        description: safeGetArrayString(roiceMemos, i),
      });
    }
  }

  return treasures;
};
