import React from 'react';
import { Layout, Typography, Button, Row, Col, Card, Space, Divider } from 'antd';
import { UserOutlined, ToolOutlined, TeamOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const LandingPage: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: '#001529',
          padding: '0 50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          TRPG Web Tools
        </Title>
        <Space>
          <Link to="/auth/login">
            <Button type="text" style={{ color: 'white' }}>
              ログイン
            </Button>
          </Link>
          <Link to="/auth/signup">
            <Button type="primary">サインアップ</Button>
          </Link>
        </Space>
      </Header>

      <Content>
        {/* ヒーローセクション */}
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '100px 0',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Title level={1} style={{ color: 'white', fontSize: '3rem' }}>
            TRPGをもっと楽しく、もっと便利に
          </Title>
          <Paragraph
            style={{
              fontSize: '1.2rem',
              color: 'rgba(255,255,255,0.9)',
              maxWidth: '600px',
              margin: '0 auto 40px',
            }}
          >
            キャラクターシートの可視化から情報共有まで、 TRPGセッションに必要なツールを一箇所で
          </Paragraph>
          <Link to="/systems">
            <Button
              type="primary"
              size="large"
              icon={<RightOutlined />}
              style={{
                height: '50px',
                fontSize: '18px',
                padding: '0 40px',
              }}
            >
              今すぐ始める
            </Button>
          </Link>
        </div>

        {/* 機能紹介セクション */}
        <div style={{ padding: '80px 50px' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '60px' }}>
            主な機能
          </Title>

          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} md={8}>
              <Card
                hoverable
                style={{ textAlign: 'center', height: '100%' }}
                bodyStyle={{ padding: '40px 24px' }}
              >
                <ToolOutlined
                  style={{ fontSize: '48px', color: '#1890ff', marginBottom: '20px' }}
                />
                <Title level={4}>キャラクターシート可視化</Title>
                <Paragraph>
                  外部キャラクターシート管理サイトのデータを取得し、 見やすいUIで表示します
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                hoverable
                style={{ textAlign: 'center', height: '100%' }}
                bodyStyle={{ padding: '40px 24px' }}
              >
                <TeamOutlined
                  style={{ fontSize: '48px', color: '#52c41a', marginBottom: '20px' }}
                />
                <Title level={4}>セッション管理</Title>
                <Paragraph>
                  TRPGセッションの情報を共有し、 プレイヤー間のコミュニケーションをサポート
                </Paragraph>
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card
                hoverable
                style={{ textAlign: 'center', height: '100%' }}
                bodyStyle={{ padding: '40px 24px' }}
              >
                <UserOutlined
                  style={{ fontSize: '48px', color: '#722ed1', marginBottom: '20px' }}
                />
                <Title level={4}>システム特化UI</Title>
                <Paragraph>各TRPGシステムに特化した 専用のUI・機能を提供します</Paragraph>
              </Card>
            </Col>
          </Row>
        </div>

        {/* 対応システムセクション */}
        <div
          style={{
            background: '#f5f5f5',
            padding: '80px 50px',
          }}
        >
          <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
            対応TRPGシステム
          </Title>

          <Row justify="center">
            <Col xs={24} md={12} lg={8}>
              <Card title="永い後日談のネクロニカ" style={{ textAlign: 'center' }}>
                <Paragraph>
                  ドール情報、能力値、部位・パーツ、 スキル・マニューバ、記憶の欠片などを 美しく表示
                </Paragraph>
                <Text type="secondary">第1段階対応済み</Text>
              </Card>
            </Col>
          </Row>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Text type="secondary" style={{ fontSize: '16px' }}>
              更多のTRPGシステムへの対応を順次追加予定
            </Text>
          </div>
        </div>

        {/* CTAセクション */}
        <div
          style={{
            background: '#001529',
            padding: '60px 50px',
            textAlign: 'center',
            color: 'white',
          }}
        >
          <Title level={2} style={{ color: 'white', marginBottom: '20px' }}>
            今すぐ始めてみませんか？
          </Title>
          <Paragraph
            style={{
              fontSize: '18px',
              color: 'rgba(255,255,255,0.8)',
              marginBottom: '40px',
            }}
          >
            アカウント作成は無料です
          </Paragraph>
          <Space size="large">
            <Link to="/auth/signup">
              <Button type="primary" size="large" style={{ height: '45px', fontSize: '16px' }}>
                サインアップ
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button type="default" size="large" style={{ height: '45px', fontSize: '16px' }}>
                ログイン
              </Button>
            </Link>
          </Space>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
        <Divider />
        <Text type="secondary">TRPG Web Tools ©2024 - TRPGをもっと楽しく</Text>
      </Footer>
    </Layout>
  );
};

export default LandingPage;
