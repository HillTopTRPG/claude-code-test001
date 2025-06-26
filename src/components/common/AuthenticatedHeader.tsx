import React from 'react';
import { Layout, Typography, Button, Space, Dropdown, Avatar, message } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authSignOut } from '../../services/auth';
import type { MenuProps } from 'antd';

const { Header } = Layout;
const { Title } = Typography;

interface AuthenticatedHeaderProps {
  title?: string;
  showBackButton?: boolean;
  backTo?: string;
}

const AuthenticatedHeader: React.FC<AuthenticatedHeaderProps> = ({ 
  title = "TRPG Web Tools",
  showBackButton = false,
  backTo = "/"
}) => {
  const { user, refetch } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await authSignOut();
      if (result.success) {
        message.success('ログアウトしました');
        await refetch(); // 認証状態を更新
        navigate('/'); // トップページに遷移
      } else {
        message.error('ログアウトに失敗しました');
      }
    } catch (error) {
      message.error('ログアウトに失敗しました');
    }
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'プロフィール',
      onClick: () => {
        // TODO: プロフィール画面に遷移
        message.info('プロフィール機能は準備中です');
      }
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '設定',
      onClick: () => {
        // TODO: 設定画面に遷移
        message.info('設定機能は準備中です');
      }
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'ログアウト',
      onClick: handleLogout
    }
  ];

  return (
    <Header style={{ 
      background: '#001529', 
      padding: '0 50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {showBackButton && (
          <Link to={backTo} style={{ marginRight: '20px' }}>
            <Button type="text" style={{ color: 'white' }}>
              ← 戻る
            </Button>
          </Link>
        )}
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            {title}
          </Title>
        </Link>
      </div>

      <Space>
        <Link to="/systems">
          <Button type="text" style={{ color: 'white' }}>
            システム選択
          </Button>
        </Link>
        
        {user && (
          <Dropdown 
            menu={{ items: userMenuItems }} 
            placement="bottomRight"
            trigger={['click']}
          >
            <Button 
              type="text" 
              style={{ 
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                height: 'auto',
                padding: '8px 12px'
              }}
            >
              <Avatar 
                size="small" 
                icon={<UserOutlined />} 
                style={{ marginRight: '8px' }}
              />
              {user.username || user.email}
            </Button>
          </Dropdown>
        )}
      </Space>
    </Header>
  );
};

export default AuthenticatedHeader;