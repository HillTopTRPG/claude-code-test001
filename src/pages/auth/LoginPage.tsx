import React, { useState } from 'react';
import { Layout, Card, Form, Input, Button, Typography, Space, Divider, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authSignIn } from '../../services/auth';
import { useAuth } from '../../hooks/useAuth';

const { Content } = Layout;
const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { refetch } = useAuth();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const result = await authSignIn({
        username: values.email,
        password: values.password,
      });

      if (result.success) {
        message.success('ログインしました');
        await refetch(); // 認証状態を更新
        navigate('/systems'); // システム選択画面に遷移
      } else {
        message.error(result.error || 'ログインに失敗しました');
      }
    } catch (error) {
      message.error('ログインに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Content style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '20px'
      }}>
        <Card style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Title level={2}>ログイン</Title>
            <Text type="secondary">アカウントにログインしてください</Text>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'メールアドレスを入力してください' },
                { type: 'email', message: '有効なメールアドレスを入力してください' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="メールアドレス" 
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'パスワードを入力してください' }]}
            >
              <Input.Password 
                prefix={<LockOutlined />} 
                placeholder="パスワード" 
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: '20px' }}>
              <Button type="primary" htmlType="submit" block loading={loading}>
                ログイン
              </Button>
            </Form.Item>
          </Form>

          <Divider>または</Divider>

          <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
            <Text type="secondary">
              アカウントをお持ちでない方は
            </Text>
            <Link to="/auth/signup">
              <Button type="link" style={{ padding: 0 }}>
                新規登録はこちら
              </Button>
            </Link>
            <Link to="/">
              <Button type="text">
                トップページに戻る
              </Button>
            </Link>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default LoginPage;