import React from 'react';
import { Layout, Typography, Button, Space } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;
const { Title } = Typography;

interface UnauthenticatedHeaderProps {
  title?: string;
  showAuthButtons?: boolean;
}

const UnauthenticatedHeader: React.FC<UnauthenticatedHeaderProps> = ({ 
  title = "TRPG Web Tools",
  showAuthButtons = true
}) => {
  return (
    <Header style={{ 
      background: '#001529', 
      padding: '0 50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          {title}
        </Title>
      </Link>
      
      {showAuthButtons && (
        <Space>
          <Link to="/auth/login">
            <Button type="text" style={{ color: 'white' }}>
              ログイン
            </Button>
          </Link>
          <Link to="/auth/signup">
            <Button type="primary">
              サインアップ
            </Button>
          </Link>
        </Space>
      )}
    </Header>
  );
};

export default UnauthenticatedHeader;