import React from 'react';
import { Card, Row, Col, Statistic, Progress, Tag, Typography, Divider, Space, Tooltip } from 'antd';
import { UserOutlined, HeartOutlined, ThunderboltOutlined, BookOutlined, EyeOutlined, ToolOutlined } from '@ant-design/icons';
import type { NechronicaCharacter } from '../../../types/systems/nechronica';

const { Title, Text, Paragraph } = Typography;

interface CharacterSheetProps {
  character: NechronicaCharacter;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character }) => {
  // 能力値アイコンの定義
  const abilityIcons = {
    muscle: <ThunderboltOutlined />,
    dexterity: <ToolOutlined />,
    sense: <EyeOutlined />,
    knowledge: <BookOutlined />,
    exercise: <HeartOutlined />,
    information: <UserOutlined />
  };

  // 能力値の日本語名
  const abilityNames = {
    muscle: '筋力',
    dexterity: '器用',
    sense: '感覚',
    knowledge: '知識',
    exercise: '運動',
    information: '情報'
  };

  // 部位の色分け
  const getPartColor = (position: string, damage: number) => {
    const colors = {
      head: '#ff4d4f',    // 赤
      arm: '#52c41a',     // 緑
      body: '#1890ff',    // 青
      leg: '#faad14'      // 黄
    };
    
    if (damage > 0) {
      return '#d9d9d9'; // ダメージがある場合はグレー
    }
    
    return colors[position as keyof typeof colors] || '#d9d9d9';
  };

  // 部位の日本語名
  const getPartPositionName = (position: string) => {
    const names = {
      head: '頭部',
      arm: '腕部',
      body: '胴体',
      leg: '脚部'
    };
    return names[position as keyof typeof names] || position;
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* キャラクター基本情報 */}
      <Card style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <Title level={2} style={{ margin: 0, color: '#722ed1' }}>
              {character.name}
            </Title>
            <Space direction="vertical" size="small" style={{ marginTop: '10px' }}>
              {character.age && <Text type="secondary">年齢: {character.age}</Text>}
              {character.height && <Text type="secondary">身長: {character.height}</Text>}
              {character.weight && <Text type="secondary">体重: {character.weight}</Text>}
            </Space>
          </Col>
          <Col xs={24} md={12}>
            {character.profile && (
              <div>
                <Title level={5}>プロフィール</Title>
                <Paragraph style={{ margin: 0 }}>{character.profile}</Paragraph>
              </div>
            )}
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        {/* 能力値 */}
        <Col xs={24} lg={12}>
          <Card title="能力値" style={{ height: '100%' }}>
            <Row gutter={[16, 16]}>
              {Object.entries(character.abilities).map(([key, value]) => (
                <Col xs={12} sm={8} key={key}>
                  <Statistic
                    title={abilityNames[key as keyof typeof abilityNames]}
                    value={value}
                    prefix={abilityIcons[key as keyof typeof abilityIcons]}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* 部位・パーツ */}
        <Col xs={24} lg={12}>
          <Card title="部位・パーツ" style={{ height: '100%' }}>
            <Row gutter={[8, 8]}>
              {character.parts.map((part, index) => (
                <Col xs={12} sm={8} key={index}>
                  <Tooltip title={`${getPartPositionName(part.position)} - ダメージ: ${part.damage}`}>
                    <Tag
                      color={getPartColor(part.position, part.damage)}
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        padding: '8px 4px',
                        marginBottom: '4px',
                        opacity: part.damage > 0 ? 0.5 : 1
                      }}
                    >
                      {part.name}
                      {part.damage > 0 && <span> (損傷)</span>}
                    </Tag>
                  </Tooltip>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* スキル */}
        <Col xs={24} lg={12}>
          <Card title="スキル" style={{ height: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {character.skills.map((skill, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>{skill.name}</Text>
                  <div style={{ display: 'flex', alignItems: 'center', minWidth: '100px' }}>
                    <Progress
                      percent={(skill.level / 5) * 100}
                      showInfo={false}
                      size="small"
                      style={{ marginRight: '8px', flex: 1 }}
                    />
                    <Tag color="blue">{skill.level}</Tag>
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* マニューバ */}
        <Col xs={24} lg={12}>
          <Card title="マニューバ" style={{ height: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {character.maneuvers.map((maneuver, index) => (
                <Card key={index} size="small" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <Text strong style={{ fontSize: '14px' }}>{maneuver.name}</Text>
                    <Space>
                      <Tag color="orange">コスト: {maneuver.cost}</Tag>
                      <Tag color="green">{maneuver.timing}</Tag>
                    </Space>
                  </div>
                  <div style={{ marginBottom: '4px' }}>
                    <Text type="secondary">射程: {maneuver.range}</Text>
                  </div>
                  <Text style={{ fontSize: '12px' }}>{maneuver.description}</Text>
                </Card>
              ))}
            </Space>
          </Card>
        </Col>

        {/* 記憶の欠片 */}
        {character.memoryFragments && character.memoryFragments.length > 0 && (
          <Col xs={24} lg={12}>
            <Card title="記憶の欠片" style={{ height: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {character.memoryFragments.map((fragment, index) => (
                  <Card key={index} size="small" style={{ width: '100%' }}>
                    <Text strong style={{ color: '#722ed1' }}>{fragment.name}</Text>
                    <Paragraph style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
                      {fragment.description}
                    </Paragraph>
                  </Card>
                ))}
              </Space>
            </Card>
          </Col>
        )}

        {/* 宝物 */}
        {character.treasures && character.treasures.length > 0 && (
          <Col xs={24} lg={12}>
            <Card title="宝物" style={{ height: '100%' }}>
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {character.treasures.map((treasure, index) => (
                  <Card key={index} size="small" style={{ width: '100%' }}>
                    <Text strong style={{ color: '#faad14' }}>{treasure.name}</Text>
                    <Paragraph style={{ margin: '8px 0 0 0', fontSize: '12px' }}>
                      {treasure.description}
                    </Paragraph>
                  </Card>
                ))}
              </Space>
            </Card>
          </Col>
        )}

        {/* その他の備考 */}
        {character.notes && (
          <Col xs={24}>
            <Card title="備考">
              <Paragraph>{character.notes}</Paragraph>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default CharacterSheet;