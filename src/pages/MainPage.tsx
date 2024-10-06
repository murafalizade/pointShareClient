import React, { useEffect, useState } from 'react';
import { Button, List, Avatar, notification, Row, Col, Typography, Empty } from 'antd';
import { StarOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { AppProtectedLayout } from "../components/AppLayout.tsx";
import { useQuery } from 'react-query';
import Cookies from "js-cookie";
import { fetchUserInformation } from "../services/apiServices.ts";
import { io } from "socket.io-client";
import { baseUrl } from "../constants/baseUrl.ts";

const { Title, Text } = Typography;

const socket = io(baseUrl, {
    query: {
        token: Cookies.get('token'),
    },
});

const MainPage: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [closestUsers, setClosestUsers] = useState([]);

    // Function to handle location fetching
    const getUserLocation = () => {
        return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        resolve({ latitude, longitude });
                    },
                    (error) => reject(error)
                );
            } else {
                reject(new Error("Geolocation not supported"));
            }
        });
    };

    useEffect(() => {
        // Continuously fetch location updates using watchPosition
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                socket.emit('getCloseUser', { latitude, longitude });
            },
            (error) => {
                console.error('Error fetching location:', error);
            },
            { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 } // Options for accuracy and frequency
        );

        // Listen for the 'closeUser' event
        socket.on('closeUser', (users) => {
            setClosestUsers(users);
        });

        // Cleanup when component unmounts

    }, []);



    const { data, error, isLoading } = useQuery('userInfo', fetchUserInformation, {
        enabled: !!Cookies.get('token'),
    });

    const myName = data?.username || 'Loading...';
    const myPoints = data?.point || 0;

    const showGivePointModal = () => {
        setIsModalVisible(true);
    };

    const handleGivePoint = (userId: number, points: number) => {
        notification.success({
            message: 'Points Given!',
            description: `You have given ${points} points to user ID: ${userId}`,
        });
        setNotificationCount(notificationCount + 1);
        setIsModalVisible(false);
    };

    const history = [
        { id: 1, action: 'Received 5 points from Alice', type: 'received' },
        { id: 2, action: 'Gave 3 points to Bob', type: 'given' },
        { id: 3, action: 'Received 2 points from Charlie', type: 'received' },
        { id: 4, action: 'Gave 4 points to David', type: 'given' },
        { id: 5, action: 'Received 1 point from Eve', type: 'received' },
        { id: 6, action: 'Gave 2 points to Frank', type: 'given' },
    ];

    // Handle loading and error states
    if (isLoading) return <div>Loading...</div>;
    if (error) return <p>Error fetching user information!</p>;

    return (
        <AppProtectedLayout>
            <div className="main-content">
                <Row justify="space-between" align="middle">
                    <Title level={2} style={{ color: '#fff' }}>Welcome, {myName}!</Title>
                    <Title level={2} style={{ color: '#fff' }}>{myPoints} <StarOutlined /></Title>
                </Row>

                <Row gutter={24} style={{ marginTop: '24px' }}>
                    {/* Closest Users Section */}
                    <Col span={24} md={{ span: 12 }}>
                        <Title level={4} style={{ color: '#fff' }}>Closest Users</Title>
                        {closestUsers.length > 0 ? (
                            <List
                                itemLayout="horizontal"
                                dataSource={closestUsers.slice(0, 5)} // Show only 5 users
                                renderItem={user => (
                                    <List.Item
                                        actions={[
                                            <Button type="primary" onClick={() => showGivePointModal()}>
                                                Give Points
                                            </Button>,
                                        ]}
                                        style={{
                                            border: '1px solid #d9d9d9',
                                            borderRadius: '8px',
                                            marginBottom: '12px',
                                            padding: '12px',
                                            backgroundColor: '#2c2c2c',
                                            color: '#fff',
                                        }}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar>{user.username.charAt(0)}</Avatar>}
                                            title={<Text style={{ color: '#fff' }}>{user.username}</Text>}
                                            description={
                                                <Text style={{ color: '#d9d9d9' }}>
                                                    {user.point} <StarOutlined />
                                                </Text>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Empty
                                description={<span style={{ color: '#fff' }}>No closest users found</span>}
                                style={{ color: '#fff' }}
                            />
                        )}
                    </Col>
                    {/* History Section */}
                    <Col span={24} md={{ span: 12 }}>
                        <Title level={4} style={{ color: '#fff' }}>History</Title>
                        <List
                            dataSource={history.slice(0, 5)} // Show only 5 history items
                            renderItem={item => (
                                <List.Item
                                    style={{
                                        border: '1px solid #d9d9d9',
                                        borderRadius: '8px',
                                        marginBottom: '12px',
                                        padding: '12px',
                                        backgroundColor: item.type === 'received' ? '#4CAF50' : '#f5222d',
                                        color: '#fff',
                                    }}
                                >
                                    <List.Item.Meta
                                        avatar={item.type === 'received' ?
                                            <ArrowDownOutlined style={{ fontSize: '20px', color: '#fff' }} /> :
                                            <ArrowUpOutlined style={{ fontSize: '20px', color: '#fff' }} />}
                                        description={<Text style={{ color: '#fff' }}>{item.action}</Text>}
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            </div>
        </AppProtectedLayout>
    );
};

export default MainPage;