import React, { useState } from 'react';
import {
  Layout,
  Typography,
  Card,
  Input,
  Button,
  Space,
  Alert,
  Spin,
  message,
} from 'antd';
import {
  LinkOutlined,
  SearchOutlined,
  ArrowLeftOutlined,
  ExperimentOutlined,
} from '@ant-design/icons';
import { useAuth } from '../../../hooks/useAuth';
import AuthenticatedHeader from '../../../components/common/AuthenticatedHeader';
import UnauthenticatedHeader from '../../../components/common/UnauthenticatedHeader';
import CharacterSheet from '../../../components/systems/nechronica/CharacterSheet';
import {
  fetchNechronicaCharacterData,
  getMockNechronicaData,
} from '../../../services/external/nechronica';
import { parseNechronicaData } from '../../../utils/parsers/nechronicaParser';
import type { NechronicaCharacter } from '../../../types/systems/nechronica';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const NechronicaPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [character, setCharacter] = useState<NechronicaCharacter | null>(null);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async () => {
    if (!url.trim()) {
      setError('キャラクターシートのURLを入力してください');
      return;
    }

    setLoading(true);
    setError(null);
    setCharacter(null);

    try {
      console.log('Fetching character sheet from:', url);

      // 実際のJSONPでのデータ取得を試行
      const result = await fetchNechronicaCharacterData(url);

      if (result.success && result.data) {
        const parsedCharacter = parseNechronicaData(result.data);
        setCharacter(parsedCharacter);
        message.success('キャラクターシートを取得しました');
      } else {
        throw new Error(result.error || 'データの取得に失敗しました');
      }
    } catch (err) {
      console.error('Failed to fetch character sheet:', err);
      setError(err instanceof Error ? err.message : 'キャラクターシートの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async () => {
    setLoading(true);
    setError(null);
    setCharacter(null);

    try {
      const result = await getMockNechronicaData();
      if (result.success && result.data) {
        const parsedCharacter = parseNechronicaData(result.data);
        setCharacter(parsedCharacter);
        message.success('デモデータを表示しました');
      }
    } catch {
      setError('デモデータの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCharacter(null);
    setUrl('');
    setError(null);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isAuthenticated ? (
        <AuthenticatedHeader
          title="永い後日談のネクロニカ"
          showBackButton={true}
          backTo="/systems"
        />
      ) : (
        <UnauthenticatedHeader title="永い後日談のネクロニカ" />
      )}

      <Content style={{ padding: '50px' }}>
        {character ? (
          // キャラクターシート表示
          <div>
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
              <Button icon={<ArrowLeftOutlined />} onClick={handleReset} size="large">
                新しいキャラクターを表示
              </Button>
            </div>
            <CharacterSheet character={character} />
          </div>
        ) : (
          // URL入力画面
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* ヘッダーセクション */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <Title level={1}>キャラクターシート表示</Title>
              <Paragraph style={{ fontSize: '16px', color: '#666' }}>
                キャラクターシート管理サイトのURLを入力すると、 キャラクター情報を見やすく表示します
              </Paragraph>
            </div>

            {/* URL入力セクション */}
            <Card style={{ marginBottom: '30px' }}>
              <Title level={4}>
                <LinkOutlined /> キャラクターシートURL
              </Title>
              <Paragraph type="secondary">
                https://charasheet.vampire-blood.net/ のキャラクターシートURLを入力してください
              </Paragraph>

              {!isAuthenticated && (
                <Alert
                  message="ログインが必要です"
                  description="キャラクターシートを保存・管理するにはログインしてください。ゲストとしても一時的に表示可能です。"
                  type="info"
                  showIcon
                  style={{ marginBottom: '20px' }}
                  action={
                    <Space>
                      <Button size="small" type="primary" href="/auth/login">
                        ログイン
                      </Button>
                      <Button size="small" href="/auth/signup">
                        サインアップ
                      </Button>
                    </Space>
                  }
                />
              )}

              <Space.Compact style={{ width: '100%', marginBottom: '20px' }}>
                <Input
                  size="large"
                  placeholder="https://charasheet.vampire-blood.net/5132265 または ID番号のみ"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onPressEnter={handleSubmit}
                  disabled={loading}
                />
                <Button
                  type="primary"
                  size="large"
                  icon={<SearchOutlined />}
                  onClick={handleSubmit}
                  loading={loading}
                >
                  取得
                </Button>
              </Space.Compact>

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Space size="middle">
                  <Button
                    type="dashed"
                    size="large"
                    icon={<ExperimentOutlined />}
                    onClick={handleDemoClick}
                    loading={loading}
                  >
                    デモデータで試す
                  </Button>
                  <Button
                    type="default"
                    size="large"
                    onClick={() => setUrl('5132265')}
                    disabled={loading}
                  >
                    サンプルURL
                  </Button>
                </Space>
              </div>

              {error && (
                <Alert
                  message={error}
                  type="error"
                  style={{ marginBottom: '20px' }}
                  closable
                  onClose={() => setError(null)}
                />
              )}

              {loading && (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: '10px' }}>
                    <Text type="secondary">キャラクターデータを取得中...</Text>
                  </div>
                </div>
              )}
            </Card>

            {/* 使い方説明 */}
            <Card title="使い方" style={{ marginBottom: '30px' }}>
              <div>
                <Title level={5}>1. キャラクターシートURLを取得</Title>
                <Paragraph>
                  <a
                    href="https://charasheet.vampire-blood.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    キャラクターシート管理サイト
                  </a>
                  でキャラクターシートを作成・保存し、URLを取得してください。
                </Paragraph>

                <Title level={5}>2. URLを入力</Title>
                <Paragraph>上記の入力欄に取得したURLを貼り付けてください。</Paragraph>

                <Title level={5}>3. キャラクター情報表示</Title>
                <Paragraph>
                  「取得」ボタンをクリックすると、キャラクター情報が見やすく表示されます。
                </Paragraph>
              </div>
            </Card>

            {/* 対応情報 */}
            <Card title="対応している情報">
              <ul>
                <li>ドール基本情報（名前、年齢、身長、体重等）</li>
                <li>能力値（筋力、器用、感覚、知識、運動、情報）</li>
                <li>部位・パーツ情報</li>
                <li>スキル・マニューバ</li>
                <li>記憶の欠片</li>
                <li>宝物</li>
                <li>その他のプロフィール情報</li>
              </ul>
            </Card>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default NechronicaPage;
