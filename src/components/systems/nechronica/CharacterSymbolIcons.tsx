import React from 'react';
import { Space } from 'antd';

interface CharacterSymbolIconsProps {
  position?: string;
  mainClass?: string;
  subClass?: string;
  size?: 'small' | 'medium' | 'large';
}

const CharacterSymbolIcons: React.FC<CharacterSymbolIconsProps> = ({
  position,
  mainClass,
  subClass,
  size = 'medium',
}) => {
  // サイズ設定
  const sizeMapping = {
    small: 40,
    medium: 60,
    large: 80,
  };
  
  const iconSize = sizeMapping[size];

  // ポジション名からファイル名への変換
  const getPositionIconPath = (positionName: string): string => {
    const basePath = '/src/components/systems/nechronica/images/position';
    
    const positionMapping: Record<string, string> = {
      'アリス': 'alice',
      'オートマトン': 'automaton', 
      'コート': 'court',
      'ホリック': 'holic',
      'ジャンク': 'junk',
      'ソロリティ': 'sorority',
    };
    
    const fileName = positionMapping[positionName];
    return fileName ? `${basePath}/${fileName}.png` : `${basePath}/alice.png`;
  };

  // クラス名からファイル名への変換
  const getClassIconPath = (className: string): string => {
    const basePath = '/src/components/systems/nechronica/images/class';
    
    const classMapping: Record<string, string> = {
      'バロック': 'baroque',
      'ゴシック': 'gothic',
      'サイケデリック': 'psychedelic',
      'レクイエム': 'requiem',
      'ロマネスク': 'romanesque',
      'ステイシー': 'stacy',
      'タナトス': 'thanatos',
    };
    
    const fileName = classMapping[className];
    return fileName ? `${basePath}/${fileName}.png` : `${basePath}/gothic.png`;
  };

  // 表示するアイコンを決定
  const getDisplayIcons = () => {
    const icons: Array<{ type: 'position' | 'class'; path: string; name: string }> = [];
    
    // ポジションは必須（最優先）
    if (position) {
      icons.push({
        type: 'position',
        path: getPositionIconPath(position),
        name: position,
      });
    }
    
    // メインクラス
    if (mainClass) {
      icons.push({
        type: 'class',
        path: getClassIconPath(mainClass),
        name: mainClass,
      });
    }
    
    // サブクラス（メインクラスと異なる場合のみ）
    if (subClass && subClass !== mainClass) {
      icons.push({
        type: 'class',
        path: getClassIconPath(subClass),
        name: subClass,
      });
    }
    
    return icons;
  };

  const displayIcons = getDisplayIcons();

  return (
    <Space size="small" align="center">
      {displayIcons.map((icon, index) => (
        <div
          key={`${icon.type}-${index}`}
          style={{
            position: 'relative',
            display: 'inline-block',
          }}
          title={icon.name}
        >
          <img
            src={icon.path}
            alt={icon.name}
            style={{
              width: iconSize,
              height: iconSize,
              objectFit: 'contain',
              border: icon.type === 'position' ? '3px solid #722ed1' : '2px solid #13c2c2',
              borderRadius: '8px',
              backgroundColor: '#fff',
              padding: '4px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}
            onError={(e) => {
              // 画像読み込みエラー時のフォールバック
              const fallbackPath = icon.type === 'position' 
                ? '/src/components/systems/nechronica/images/position/alice.png'
                : '/src/components/systems/nechronica/images/class/gothic.png';
              e.currentTarget.src = fallbackPath;
            }}
          />
          {/* タイプ識別用の小さなマーカー */}
          <div
            style={{
              position: 'absolute',
              bottom: -2,
              right: -2,
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: icon.type === 'position' ? '#722ed1' : '#13c2c2',
              border: '2px solid #fff',
            }}
          />
        </div>
      ))}
    </Space>
  );
};

export default CharacterSymbolIcons;