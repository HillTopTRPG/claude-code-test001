import React, { useState } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Tag,
  Typography,
  Space,
  Tooltip,
  Popover,
  Button,
  Form,
  message,
  Input,
  InputNumber,
  Select,
} from 'antd';
import {
  UserOutlined,
  HeartOutlined,
  ThunderboltOutlined,
  BookOutlined,
  EyeOutlined,
  ToolOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import type { NechronicaCharacter } from '../../../types/systems/nechronica';
import {
  getManeuverIconPath,
  getManeuverBackgroundPath,
} from '../../../utils/parsers/nechronicaParser';
import CharacterSymbolIcons from './CharacterSymbolIcons';

const { Title, Text, Paragraph } = Typography;

interface CharacterSheetProps {
  character: NechronicaCharacter;
  onManeuverEdit?: (
    maneuverIndex: number,
    updatedManeuver: NechronicaCharacter['maneuvers'][0]
  ) => void;
  onManeuverStatusChange?: (
    maneuverIndex: number,
    field: 'damaged' | 'used',
    value: boolean
  ) => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ 
  character, 
  onManeuverEdit,
  onManeuverStatusChange
}) => {
  const [editingManeuver, setEditingManeuver] = useState<{
    maneuver: NechronicaCharacter['maneuvers'][0];
    index: number;
  } | null>(null);
  const [popoverVisible, setPopoverVisible] = useState<number | null>(null);
  const [form] = Form.useForm();

  // 編集処理のハンドラー
  const handleEditClick = (
    maneuver: NechronicaCharacter['maneuvers'][0],
    maneuverIndex: number
  ) => {
    setEditingManeuver({ maneuver, index: maneuverIndex });
    setPopoverVisible(maneuverIndex);
    form.setFieldsValue({
      name: maneuver.name,
      cost: maneuver.cost,
      timing: maneuver.timing,
      range: maneuver.range,
      description: maneuver.description,
      attachment: maneuver.attachment,
    });
  };

  const handleEditCancel = () => {
    setEditingManeuver(null);
    form.resetFields();
    // 編集キャンセル時はポップアップをクリック制御にする
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingManeuver && onManeuverEdit) {
        const updatedManeuver = {
          ...editingManeuver.maneuver,
          ...values,
        };
        onManeuverEdit(editingManeuver.index, updatedManeuver);
        message.success('マニューバを更新しました');
      }
      setPopoverVisible(null);
      handleEditCancel();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  // マニューバのステータス変更ハンドラー
  const handleStatusChange = (
    maneuverIndex: number,
    field: 'damaged' | 'used',
    value: boolean
  ) => {
    if (onManeuverStatusChange) {
      onManeuverStatusChange(maneuverIndex, field, value);
    }
  };
  // 能力値アイコンの定義
  const abilityIcons = {
    muscle: <ThunderboltOutlined />,
    dexterity: <ToolOutlined />,
    sense: <EyeOutlined />,
    knowledge: <BookOutlined />,
    exercise: <HeartOutlined />,
    information: <UserOutlined />,
  };

  // 能力値の日本語名
  const abilityNames = {
    muscle: '筋力',
    dexterity: '器用',
    sense: '感覚',
    knowledge: '知識',
    exercise: '運動',
    information: '情報',
  };

  // 部位の色分け
  const getPartColor = (position: string, damage: number) => {
    const colors = {
      head: '#ff4d4f', // 赤
      arm: '#52c41a', // 緑
      body: '#1890ff', // 青
      leg: '#faad14', // 黄
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
      leg: '脚部',
    };
    return names[position as keyof typeof names] || position;
  };

  // attachment の日本語名
  const getAttachmentName = (attachment: string) => {
    const names = {
      position: 'ポジション',
      'main-class': 'メインクラス',
      'sub-class': 'サブクラス',
      head: '頭部',
      arm: '腕部',
      body: '胴体',
      leg: '脚部',
    };
    return names[attachment as keyof typeof names] || attachment;
  };

  // attachment の色
  const getAttachmentColor = (attachment: string) => {
    const colors = {
      position: '#722ed1', // 紫
      'main-class': '#13c2c2', // シアン
      'sub-class': '#52c41a', // 緑
      head: '#ff4d4f', // 赤
      arm: '#1890ff', // 青
      body: '#faad14', // 黄
      leg: '#fa8c16', // オレンジ
    };
    return colors[attachment as keyof typeof colors] || '#d9d9d9';
  };

  // マニューバを attachment でグルーピング
  const groupedManeuvers = character.maneuvers.reduce(
    (groups, maneuver) => {
      const attachment = maneuver.attachment;
      if (!groups[attachment]) {
        groups[attachment] = [];
      }
      groups[attachment].push(maneuver);
      return groups;
    },
    {} as Record<string, typeof character.maneuvers>
  );

  // グループの表示順序
  const attachmentOrder = ['position', 'main-class', 'sub-class', 'head', 'arm', 'body', 'leg'];

  // プロフィールからポジション・クラス情報を抽出（シンボルアイコン用）
  const extractProfileInfo = () => {
    if (!character.profile) return { position: '', mainClass: '', subClass: '', cleanedProfile: '' };

    const lines = character.profile.split('\n');
    let position = '';
    let mainClass = '';
    let subClass = '';
    const cleanedLines: string[] = [];

    lines.forEach(line => {
      if (line.includes('ポジション:')) {
        position = line.replace('ポジション:', '').trim();
      } else if (line.includes('メインクラス:')) {
        mainClass = line.replace('メインクラス:', '').trim();
      } else if (line.includes('サブクラス:')) {
        subClass = line.replace('サブクラス:', '').trim();
      } else {
        // ポジション・クラス情報以外の行は保持
        const trimmedLine = line.trim();
        if (trimmedLine) {
          cleanedLines.push(trimmedLine);
        }
      }
    });

    return { 
      position, 
      mainClass, 
      subClass, 
      cleanedProfile: cleanedLines.join('\n')
    };
  };

  const { position, mainClass, subClass, cleanedProfile } = extractProfileInfo();

  return (
    <div style={{ padding: '20px' }}>
      {/* キャラクター基本情報 */}
      <Card style={{ marginBottom: '20px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={12}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '10px' }}
            >
              <Title level={2} style={{ margin: 0, color: '#722ed1' }}>
                {character.name}
              </Title>
              <CharacterSymbolIcons
                position={position}
                mainClass={mainClass}
                subClass={subClass}
                size="large"
              />
            </div>
            <Space direction="vertical" size="small">
              {character.age && <Text type="secondary">年齢: {character.age}</Text>}
              {character.height && <Text type="secondary">身長: {character.height}</Text>}
              {character.weight && <Text type="secondary">体重: {character.weight}</Text>}
            </Space>
          </Col>
          <Col xs={24} md={12}>
            {cleanedProfile && (
              <div>
                <Title level={5}>プロフィール</Title>
                <Paragraph style={{ margin: 0 }}>{cleanedProfile}</Paragraph>
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

        {/* 部位状態 */}
        <Col xs={24} lg={12}>
          <Card title="部位状態" style={{ height: '100%' }}>
            <Row gutter={[8, 8]}>
              {(() => {
                // 部位ごとのマニューバを集計
                const bodyParts = ['head', 'arm', 'body', 'leg'];
                const partStatus = bodyParts.map(partType => {
                  const partManeuvers = character.maneuvers.filter(m => m.attachment === partType);
                  const damagedManeuvers = partManeuvers.filter(m => m.damaged || false);
                  const usedManeuvers = partManeuvers.filter(m => m.used || false);
                  const isLost = partManeuvers.length > 0 && partManeuvers.every(m => m.damaged || false);
                  
                  return {
                    type: partType,
                    name: getPartPositionName(partType),
                    total: partManeuvers.length,
                    damaged: damagedManeuvers.length,
                    used: usedManeuvers.length,
                    isLost
                  };
                }).filter(part => part.total > 0); // マニューバがある部位のみ表示

                return partStatus.map((part, index) => (
                  <Col xs={12} sm={6} key={index}>
                    <Tooltip
                      title={`${part.name} - 損傷:${part.damaged}/${part.total} 使用:${part.used}/${part.total}${part.isLost ? ' (欠損)' : ''}`}
                    >
                      <Tag
                        color={part.isLost ? '#d9d9d9' : getPartColor(part.type, part.damaged)}
                        style={{
                          width: '100%',
                          textAlign: 'center',
                          padding: '8px 4px',
                          marginBottom: '4px',
                          opacity: part.isLost ? 0.5 : 1,
                        }}
                      >
                        {part.name}
                        {(part.damaged > 0 || part.used > 0) && (
                          <span>
                            {part.damaged > 0 && ` 損:${part.damaged}`}
                            {part.used > 0 && ` 使:${part.used}`}
                            /{part.total}
                          </span>
                        )}
                        {part.isLost && <span> (欠損)</span>}
                      </Tag>
                    </Tooltip>
                  </Col>
                ));
              })()}
            </Row>
          </Card>
        </Col>

        {/* スキル */}
        <Col xs={24} lg={12}>
          <Card title="スキル" style={{ height: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {character.skills.map((skill, index) => (
                <div
                  key={index}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
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
        <Col xs={24}>
          <Card title="マニューバ">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              {attachmentOrder
                .filter(attachment => groupedManeuvers[attachment]?.length > 0)
                .map(attachment => (
                  <div key={attachment}>
                    <Title
                      level={5}
                      style={{
                        margin: '0 0 12px 0',
                        color: getAttachmentColor(attachment),
                        borderBottom: `2px solid ${getAttachmentColor(attachment)}`,
                        paddingBottom: '4px',
                      }}
                    >
                      {getAttachmentName(attachment)}
                    </Title>
                    <Space wrap style={{ width: '100%' }}>
                      {groupedManeuvers[attachment].map((maneuver, originalIndex) => {
                        const maneuverIndex = character.maneuvers.findIndex(m => m === maneuver);
                        const isEditing = editingManeuver?.index === maneuverIndex;

                        const popoverContent = (
                          <div style={{ maxWidth: '400px' }}>
                            {isEditing ? (
                              // 編集フォーム
                              <Form form={form} layout="vertical" style={{ margin: 0 }}>
                                <div
                                  style={{
                                    marginBottom: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Text strong style={{ fontSize: '14px' }}>
                                    マニューバ編集
                                  </Text>
                                  <Space size="small">
                                    <Button
                                      icon={<SaveOutlined />}
                                      size="small"
                                      type="primary"
                                      onClick={handleEditSubmit}
                                    >
                                      保存
                                    </Button>
                                    <Button
                                      icon={<CloseOutlined />}
                                      size="small"
                                      onClick={handleEditCancel}
                                    >
                                      キャンセル
                                    </Button>
                                  </Space>
                                </div>

                                <Form.Item
                                  name="name"
                                  label="マニューバ名"
                                  rules={[
                                    { required: true, message: 'マニューバ名を入力してください' },
                                  ]}
                                  style={{ marginBottom: '12px' }}
                                >
                                  <Input size="small" />
                                </Form.Item>

                                <Form.Item
                                  name="cost"
                                  label="コスト"
                                  rules={[{ required: true, message: 'コストを入力してください' }]}
                                  style={{ marginBottom: '12px' }}
                                >
                                  <InputNumber min={0} size="small" style={{ width: '100%' }} />
                                </Form.Item>

                                <Form.Item
                                  name="timing"
                                  label="タイミング"
                                  rules={[
                                    { required: true, message: 'タイミングを入力してください' },
                                  ]}
                                  style={{ marginBottom: '12px' }}
                                >
                                  <Input size="small" />
                                </Form.Item>

                                <Form.Item
                                  name="range"
                                  label="射程"
                                  rules={[{ required: true, message: '射程を入力してください' }]}
                                  style={{ marginBottom: '12px' }}
                                >
                                  <Input size="small" />
                                </Form.Item>

                                <Form.Item
                                  name="attachment"
                                  label="部位"
                                  rules={[{ required: true, message: '部位を選択してください' }]}
                                  style={{ marginBottom: '12px' }}
                                >
                                  <Select size="small">
                                    <Select.Option value="position">ポジション</Select.Option>
                                    <Select.Option value="main-class">メインクラス</Select.Option>
                                    <Select.Option value="sub-class">サブクラス</Select.Option>
                                    <Select.Option value="head">頭部</Select.Option>
                                    <Select.Option value="arm">腕部</Select.Option>
                                    <Select.Option value="body">胴体</Select.Option>
                                    <Select.Option value="leg">脚部</Select.Option>
                                  </Select>
                                </Form.Item>

                                <Form.Item
                                  name="description"
                                  label="説明"
                                  style={{ marginBottom: '0' }}
                                >
                                  <Input.TextArea rows={3} size="small" />
                                </Form.Item>
                              </Form>
                            ) : (
                              // 詳細表示
                              <div>
                                <div
                                  style={{
                                    marginBottom: '8px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                  }}
                                >
                                  <Text strong style={{ fontSize: '14px' }}>
                                    {maneuver.name}
                                  </Text>
                                  {onManeuverEdit && (
                                    <Button
                                      icon={<EditOutlined />}
                                      size="small"
                                      type="text"
                                      onClick={() => handleEditClick(maneuver, maneuverIndex)}
                                      style={{ marginLeft: '8px' }}
                                    >
                                      編集
                                    </Button>
                                  )}
                                </div>
                                <Space style={{ marginBottom: '8px' }}>
                                  <Tag
                                    color="orange"
                                    style={{ fontSize: '11px', padding: '2px 6px' }}
                                  >
                                    コスト: {maneuver.cost}
                                  </Tag>
                                  <Tag
                                    color="green"
                                    style={{ fontSize: '11px', padding: '2px 6px' }}
                                  >
                                    {maneuver.timing}
                                  </Tag>
                                </Space>
                                <div style={{ marginBottom: '8px' }}>
                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                    射程: {maneuver.range}
                                  </Text>
                                </div>
                                {maneuver.description && (
                                  <Text style={{ fontSize: '12px', lineHeight: '1.4' }}>
                                    {maneuver.description}
                                  </Text>
                                )}
                              </div>
                            )}
                          </div>
                        );

                        return (
                          <Popover
                            key={originalIndex}
                            content={popoverContent}
                            trigger={
                              isEditing || popoverVisible === maneuverIndex ? 'click' : 'hover'
                            }
                            open={popoverVisible === maneuverIndex || isEditing ? true : undefined}
                            onOpenChange={visible => {
                              if (!visible && !isEditing) {
                                setPopoverVisible(null);
                              } else if (visible && !isEditing) {
                                setPopoverVisible(maneuverIndex);
                              }
                            }}
                            placement="right"
                            mouseEnterDelay={0.1}
                            mouseLeaveDelay={
                              isEditing || popoverVisible === maneuverIndex ? 0 : 0.1
                            }
                          >
                            <div
                              style={{
                                cursor: 'pointer',
                                margin: '2px 4px 2px 0',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '2px',
                                width: '68px',
                              }}
                            >
                              <div
                                style={{
                                  fontSize: '10px',
                                  lineHeight: '1.1',
                                  textAlign: 'center',
                                  minHeight: '20px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  wordBreak: 'break-all',
                                  color: maneuver.damaged ? '#999' : maneuver.used ? '#faad14' : '#666',
                                  textDecoration: maneuver.damaged ? 'line-through' : 'none',
                                  fontStyle: maneuver.used ? 'italic' : 'normal',
                                }}
                              >
                                {maneuver.name}
                              </div>
                              <div
                                style={{
                                  width: '64px',
                                  height: '64px',
                                  border: `2px solid ${getAttachmentColor(attachment)}`,
                                  borderRadius: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  position: 'relative',
                                  backgroundImage: `url(${getManeuverBackgroundPath(maneuver.powerType)})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  backgroundRepeat: 'no-repeat',
                                  opacity: maneuver.damaged ? 0.4 : maneuver.used ? 0.7 : 1,
                                  filter: maneuver.damaged ? 'grayscale(80%)' : maneuver.used ? 'sepia(50%)' : 'none',
                                }}
                              >
                                <img
                                  src={getManeuverIconPath(maneuver.name, attachment)}
                                  alt={maneuver.name}
                                  style={{
                                    width: '48px',
                                    height: '48px',
                                    objectFit: 'contain',
                                    position: 'relative',
                                    zIndex: 1,
                                  }}
                                  onError={e => {
                                    // 画像読み込みエラー時のフォールバック
                                    e.currentTarget.src =
                                      '/src/components/systems/nechronica/images/unknown.png';
                                  }}
                                />
                                {/* 状態マーク（損傷状態が優先） */}
                                {maneuver.damaged ? (
                                  <img
                                    src="/src/components/systems/nechronica/images/mark/lost.png"
                                    alt="損傷"
                                    style={{
                                      position: 'absolute',
                                      top: '0px',
                                      left: '0px',
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      borderRadius: '4px',
                                      zIndex: 2,
                                    }}
                                  />
                                ) : maneuver.used ? (
                                  <img
                                    src="/src/components/systems/nechronica/images/mark/used.png"
                                    alt="使用済み"
                                    style={{
                                      position: 'absolute',
                                      top: '0px',
                                      left: '0px',
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      borderRadius: '4px',
                                      zIndex: 2,
                                    }}
                                  />
                                ) : null}
                              </div>
                              {/* 状態変更ボタン */}
                              {onManeuverStatusChange && (
                                <div
                                  style={{
                                    display: 'flex',
                                    gap: '2px',
                                    marginTop: '2px',
                                  }}
                                >
                                  <Button
                                    size="small"
                                    type={maneuver.used ? 'primary' : 'default'}
                                    icon={<CheckCircleOutlined />}
                                    style={{
                                      fontSize: '8px',
                                      padding: '0 4px',
                                      height: '16px',
                                      minWidth: '16px',
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(maneuverIndex, 'used', !maneuver.used);
                                    }}
                                    title="使用状態切り替え"
                                  />
                                  <Button
                                    size="small"
                                    type={maneuver.damaged ? 'primary' : 'default'}
                                    danger={maneuver.damaged}
                                    icon={<StopOutlined />}
                                    style={{
                                      fontSize: '8px',
                                      padding: '0 4px',
                                      height: '16px',
                                      minWidth: '16px',
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStatusChange(maneuverIndex, 'damaged', !maneuver.damaged);
                                    }}
                                    title="損傷状態切り替え"
                                  />
                                </div>
                              )}
                            </div>
                          </Popover>
                        );
                      })}
                    </Space>
                  </div>
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
                    <Text strong style={{ color: '#722ed1' }}>
                      {fragment.name}
                    </Text>
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
                    <Text strong style={{ color: '#faad14' }}>
                      {treasure.name}
                    </Text>
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
