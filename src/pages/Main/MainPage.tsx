import React, { useEffect, useState } from 'react';
import { Button, List, Avatar, Row, Col, Typography, Empty } from 'antd';
import { StarOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { AppProtectedLayout } from "../../components/AppLayout.tsx";
import { useQuery } from 'react-query';
import Cookies from "js-cookie";
import { fetchUserInformation, fetchPointHistory } from "../../services/apiServices.ts";
import { io } from "socket.io-client";
import { baseUrl } from "../../constants/baseUrl.ts";
import { GivingPointModal } from "./GivingPointModal.tsx";

const { Title, Text } = Typography;

const socket = io(baseUrl, {
    query: {
        token: Cookies.get('token'),
    },
});

const MainPage: React.FC = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null); // Track selected user for giving points
    const [closestUsers, setClosestUsers] = useState([]);

    // Fetch closest users using socket
    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                socket.emit('getCloseUser', { latitude, longitude });
            },
            (error) => {
                console.error('Error fetching location:', error);
            },
            { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
        );

        socket.on('closeUser', (users) => {
            setClosestUsers(users);
        });

        return () => {
            navigator.geolocation.clearWatch(watchId);
            socket.off('closeUser');
        };
    }, []);

    // Fetch user information
    const { data: userInfo, error: userError, isLoading: userLoading } = useQuery('userInfo', fetchUserInformation, {
        enabled: !!Cookies.get('token'),
    });

    // Fetch point history
    const { data: pointHistory, error: historyError, isLoading: historyLoading } = useQuery('pointHistory', fetchPointHistory, {
        enabled: !!Cookies.get('token'),
    });

    const myName = userInfo?.username || 'Loading...';
    const myPoints = userInfo?.point || 0;

    const showGivePointModal = (userId: string) => {
        setSelectedUserId(userId);
        setIsModalVisible(true);
    };

    if (userLoading || historyLoading) return <div>Loading...</div>;
    if (userError || historyError) return <p>Error fetching data!</p>;

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
                                            <Button type="primary" onClick={() => showGivePointModal(user._id)}>
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
                        {pointHistory && pointHistory.length > 0 ? (
                            <List
                                dataSource={pointHistory.slice(0, 5)} // Show only 5 history items
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
                                            title={<Text style={{ color: '#fff' }}>{item.type === 'received' ? 'Received' : 'Given'} from {item.username}</Text>}
                                            description={
                                                <Text style={{ color: '#d9d9d9' }}>
                                                    {item.point} points on {new Date(item.date).toLocaleString()}
                                                </Text>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        ) : (
                            <Empty
                                description={<span style={{ color: '#fff' }}>No history found</span>}
                                style={{ color: '#fff' }}
                            />
                        )}
                    </Col>

                </Row>
            </div>

            {/* Giving Point Modal */}
            {selectedUserId && (
                <GivingPointModal
                    isVisible={isModalVisible}
                    userId={selectedUserId}
                    onClose={() => setIsModalVisible(false)}
                />
            )}
        </AppProtectedLayout>
    );
};

export default MainPage;
