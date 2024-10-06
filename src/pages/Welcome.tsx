// src/pages/Welcome.tsx
import React from 'react';
import { Button, Typography, Layout } from 'antd';

const { Title, Paragraph } = Typography;
const { Header, Content, Footer } = Layout;

export const Welcome: React.FC = () => {
    return (
        <Layout className="welcome-layout">
            <Content className="welcome-content">
                <Header className="welcome-header">
                    <Title className="welcome-title animated-text"> Welcome to PointShare! </Title>
                </Header>
                <div className="welcome-text">
                    <Paragraph className="welcome-description animated-text">
                        🚀 A fun and interactive way to <strong>give points</strong> to your friends! <br />
                        Share your achievements and support others in reaching their goals! 🎯<br />
                        Let’s make sharing points a joyful experience! 💖
                    </Paragraph>
                </div>
                <Button type="primary" size="large" className="welcome-button" href="/login">
                    🎉 Get Started!
                </Button>
            </Content>
            <Footer className="welcome-footer">
                <Paragraph className="footer-text">© 2024 PointShare Inc. All rights reserved.</Paragraph>
            </Footer>
        </Layout>
    );
};