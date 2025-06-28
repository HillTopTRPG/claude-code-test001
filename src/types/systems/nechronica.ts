// 永い後日談のネクロニカ用の型定義

export interface NechronicaCharacter {
  // 基本情報
  name: string;
  age?: string;
  height?: string;
  weight?: string;
  profile?: string; // ポジション、クラス、性別、タグなどを含む
  notes?: string;

  // 能力値
  abilities: {
    muscle: number; // 筋力
    dexterity: number; // 器用
    sense: number; // 感覚
    knowledge: number; // 知識
    exercise: number; // 運動
    information: number; // 情報
  };

  // 部位とパーツ
  parts: NechronicaPart[];

  // スキルとマニューバ
  skills: NechronicaSkill[];
  maneuvers: NechronicaManeuver[];

  // 記憶の欠片
  memoryFragments: MemoryFragment[];

  // 宝物/未練
  treasures: Treasure[];
}

export interface NechronicaPart {
  name: string;
  damage: number;
  position: 'head' | 'arm' | 'body' | 'leg';
}

export interface NechronicaSkill {
  name: string;
  level: number;
  description?: string;
}

export interface NechronicaManeuver {
  name: string;
  cost: number;
  timing: string;
  range: string;
  description: string;
  attachment: 'position' | 'main-class' | 'sub-class' | 'head' | 'arm' | 'body' | 'leg';
  powerType: number; // 0: なし, 1: 通常, 2: 必殺技, 3: 行動値増加, 4: 補助, 5: 妨害, 6: 防御/生贄, 7: 移動
}

export interface MemoryFragment {
  name: string;
  description: string;
}

export interface Treasure {
  name: string;
  description: string;
}
