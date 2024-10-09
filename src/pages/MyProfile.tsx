import React, { useEffect, useState } from 'react';
import { Avatar, List, Card, Button, Input, Modal, Form, Spin, message } from 'antd';
import { HistoryOutlined, StarOutlined, EditOutlined } from '@ant-design/icons';
import { AppProtectedLayout } from '../components/AppLayout';
import {fetchPointHistory, fetchUserInformation} from "../services/apiServices.ts";


export const MyProfile: React.FC = () => {
    const [user, setUser] = useState<any>(null); // Updated initial state
    const [historyVisibleCount, setHistoryVisibleCount] = useState(3);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const userId = '12345'; // Replace with the actual user ID

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const profileData = await fetchUserInformation();
                const historyData = await fetchPointHistory();
                setUser({ ...profileData, history: historyData });
            } catch (error) {
                message.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    const loadMoreHistory = () => {
        setHistoryVisibleCount((prevCount) => prevCount + 3);
    };

    const showEditProfileModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleEditProfile = async (values: any) => {
        // Update user profile via API
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error('Failed to update profile');
            const updatedUser = await response.json();
            setUser({ ...user, ...updatedUser });
            setIsModalVisible(false);
            message.success('Profile updated successfully');
        } catch (error) {
            message.error(error.message);
        }
    };

    if (loading) {
        return <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />;
    }

    return (
        <AppProtectedLayout>
            {/* Profile Header */}
            <Card bordered={false} style={{ textAlign: 'center', background: "#141414", color: "white", borderRadius: '16px', padding: '40px' }}>
                <Avatar size={120} src={user?.avatar} />
                <h1 style={{ marginTop: '20px', fontSize: '28px', color: '#f5f5f5' }}>{user.username}</h1>
                <p style={{ fontSize: '18px', color: '#ccc' }}>
                    Points: {user.point} <StarOutlined style={{ color: '#ffc107', fontSize: '20px' }} />
                </p>
                <Button icon={<EditOutlined />} onClick={showEditProfileModal} style={{ marginTop: '20px' }}>
                    Edit Profile
                </Button>
            </Card>

            {/*/!* Recent History *!/*/}
            {/*<div style={{ marginTop: '40px', padding: '0 20px' }}>*/}
            {/*    <h2 style={{ color: 'white' }}>Recent History</h2>*/}
            {/*    <List*/}
            {/*        itemLayout="horizontal"*/}
            {/*        dataSource={user.history.slice(0, historyVisibleCount)}*/}
            {/*        renderItem={(item) => (*/}
            {/*            <List.Item style={{ background: "#1f1f1f", borderRadius: '12px', padding: '20px', marginBottom: '10px' }}>*/}
            {/*                <List.Item.Meta*/}
            {/*                    avatar={<HistoryOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}*/}
            {/*                    title={<span style={{ color: 'white' }}>{item}</span>}*/}
            {/*                />*/}
            {/*            </List.Item>*/}
            {/*        )}*/}
            {/*    />*/}
            {/*    {historyVisibleCount < user.history.length && (*/}
            {/*        <div style={{ textAlign: 'center', marginTop: '20px' }}>*/}
            {/*            <Button onClick={loadMoreHistory} type="primary">*/}
            {/*                Load More*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*    )}*/}
            {/*</div>*/}
            {/* Edit Profile Modal */}
            <Modal
                title="Edit Profile"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    initialValues={{ name: user.name, avatar: user.avatar }}
                    onFinish={handleEditProfile}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Avatar URL"
                        name="avatar"
                        rules={[{ required: true, message: 'Please input the avatar URL!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </AppProtectedLayout>
    );
};