import React, { useState } from 'react';
import {Menu, notification} from 'antd';
import { LogoutOutlined, TeamOutlined, TrophyOutlined, UserOutlined, DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import Sider from 'antd/es/layout/Sider';
import { Button } from 'antd';
import Cookies from "js-cookie";

export const Sidebar: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    // Toggle sidebar collapse
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };

    const handleLogout = () => {
        notification.info({
            message: 'Logged Out',
            description: 'You have successfully logged out.',
        });
        Cookies.remove('token');
    };

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            width={200}
            trigger={null} // We will use a custom trigger
            style={{
                backgroundColor: 'rgb(34, 36, 41)',
                paddingTop: '180px',
            }}
        >
            {/* Menu */}
            <Menu
                theme="dark"
                style={{ backgroundColor: 'rgb(34, 36, 41)' }}
                mode="inline"
                defaultSelectedKeys={[location.pathname]} // Highlight active route
                selectedKeys={[location.pathname]} // Active key update
            >
                <Menu.Item key="/app" icon={<UserOutlined />}>
                    <Link to="/app">Main Page</Link>
                </Menu.Item>
                <Menu.Item key="/closest-users" icon={<TeamOutlined />}>
                    <Link to="/closest-users">Closest Users</Link>
                </Menu.Item>
                <Menu.Item key="/ranking" icon={<TrophyOutlined />}>
                    <Link to="/ranking">Ranking</Link>
                </Menu.Item>
                <Menu.Item key="/my-profile" icon={<UserOutlined />}>
                    <Link to="/my-profile">My Profile</Link>
                </Menu.Item>
                <Menu.Item key="/logout" onClick={handleLogout} icon={<LogoutOutlined />}>
                    Logout
                </Menu.Item>
            </Menu>

            {/* Collapse Button */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Button
                    type="text"
                    onClick={toggleCollapse}
                    icon={collapsed ?  <DoubleRightOutlined /> : <DoubleLeftOutlined />}
                    style={{ color: 'white', fontSize: '18px' }}
                />
            </div>
        </Sider>
    );
};
