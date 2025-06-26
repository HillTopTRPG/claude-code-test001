import React from 'react';
import { Layout, Typography, Card, Row, Col, Button, Space } from 'antd';
import { 
  ToolOutlined, 
  ArrowRightOutlined,
  ExperimentOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthenticatedHeader from '../../components/common/AuthenticatedHeader';
import UnauthenticatedHeader from '../../components/common/UnauthenticatedHeader';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const SystemsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {isAuthenticated ? (
        <AuthenticatedHeader />
      ) : (
        <UnauthenticatedHeader />
      )}

      <Content style={{ padding: '50px' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <Title level={1}>TRPGシステム選択</Title>
          <Paragraph style={{ fontSize: '18px', color: '#666' }}>
            遊びたいTRPGシステムを選択してください
          </Paragraph>
        </div>

        <Row gutter={[32, 32]} justify="center">
          {/* 永い後日談のネクロニカ */}
          <Col xs={24} md={12} lg={8}>
            <Card
              hoverable
              style={{ height: '100%' }}
              cover={
                <div style={{ 
                  height: '200px', 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ToolOutlined style={{ fontSize: '60px', color: 'white' }} />
                </div>
              }
              actions={[
                <Link to="/systems/nechronica" key="enter">
                  <Button type="primary" icon={<ArrowRightOutlined />}>
                    ツールを使用する
                  </Button>
                </Link>
              ]}
            >
              <Card.Meta
                title="永い後日談のネクロニカ"
                description={
                  <div>
                    <Paragraph>
                      キャラクターシートの可視化機能に対応済み。
                      ドール情報、能力値、部位・パーツ情報などを美しく表示します。
                    </Paragraph>
                    <Space>
                      <Text type="success" strong>対応済み</Text>
                      <Text type="secondary">• キャラクターシート表示</Text>
                    </Space>
                  </div>
                }
              />
            </Card>
          </Col>

          {/* 今後対応予定のシステム */}
          <Col xs={24} md={12} lg={8}>
            <Card
              style={{ height: '100%', opacity: 0.7 }}
              cover={
                <div style={{ 
                  height: '200px', 
                  background: 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ExperimentOutlined style={{ fontSize: '60px', color: 'white' }} />
                </div>
              }
              actions={[
                <Button disabled key="coming-soon">
                  準備中
                </Button>
              ]}
            >
              <Card.Meta
                title="その他のTRPGシステム"
                description={
                  <div>
                    <Paragraph>
                      クトゥルフ神話TRPG、ソード・ワールド2.5、
                      ダンジョンズ&ドラゴンズなど、
                      人気のTRPGシステムへの対応を予定しています。
                    </Paragraph>
                    <Space>
                      <Text type="warning" strong>開発予定</Text>
                      <Text type="secondary">• 順次対応予定</Text>
                    </Space>
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '80px',
          padding: '40px',
          background: '#f9f9f9',
          borderRadius: '8px'
        }}>
          <Title level={3}>リクエスト・フィードバック</Title>
          <Paragraph style={{ fontSize: '16px' }}>
            対応してほしいTRPGシステムや機能の要望がありましたら、
            お気軽にお知らせください。
          </Paragraph>
          <Button type="primary" size="large">
            リクエストを送る
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default SystemsPage;