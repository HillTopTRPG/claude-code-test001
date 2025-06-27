import React, { useState } from 'react';
import { Layout, Card, Form, Input, Button, Typography, Space, Divider, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { authSignUp } from '../../services/auth';

const { Content } = Layout;
const { Title, Text } = Typography;

const SignupPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; email: string; password: string; confirmPassword: string }) => {
    setLoading(true);
    try {
      const result = await authSignUp({
        username: values.email,
        email: values.email,
        password: values.password,
      });

      if (result.success) {
        message.success(
          'アカウントが作成されました。メールを確認してアカウントを有効化してください。'
        );
        navigate('/auth/login');
      } else {
        message.error(result.error || 'アカウント作成に失敗しました');
      }
    } catch {
      message.error('アカウント作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Content
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <Card style={{ width: '100%', maxWidth: '400px', padding: '20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Title level={2}>新規登録</Title>
            <Text type="secondary">アカウントを作成してください</Text>
          </div>

          <Form name="signup" onFinish={onFinish} layout="vertical" size="large">
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'ユーザー名を入力してください' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="ユーザー名" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'メールアドレスを入力してください' },
                { type: 'email', message: '有効なメールアドレスを入力してください' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="メールアドレス" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'パスワードを入力してください' },
                { min: 8, message: 'パスワードは8文字以上で入力してください' },
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="パスワード" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'パスワードを再入力してください' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('パスワードが一致しません'));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="パスワード（確認）" />
            </Form.Item>

            <Form.Item style={{ marginBottom: '20px' }}>
              <Button type="primary" htmlType="submit" block loading={loading}>
                新規登録
              </Button>
            </Form.Item>
          </Form>

          <Divider>または</Divider>

          <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }}>
            <Text type="secondary">既にアカウントをお持ちの方は</Text>
            <Link to="/auth/login">
              <Button type="link" style={{ padding: 0 }}>
                ログインはこちら
              </Button>
            </Link>
            <Link to="/">
              <Button type="text">トップページに戻る</Button>
            </Link>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
};

export default SignupPage;
