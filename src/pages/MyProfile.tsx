import React, { useState } from 'react';
import { Avatar, List, Card, Button, Input, Modal, Form } from 'antd';
import { HistoryOutlined, StarOutlined, EditOutlined } from '@ant-design/icons';
import { AppProtectedLayout} from '../components/AppLayout';

// Mocked user data, you can replace this with real data from your API
const initialUser = {
    name: 'John Doe',
    avatar: 'https://example.com/avatar.jpg',
    points: 345,
    history: [
        'Received 10 points from Alice',
        'Gave 5 points to Bob',
        'Gave 15 points to Charlie',
        'Received 3 points from Eve',
        'Received 5 points from David',
        'Gave 8 points to Frank',
        'Received 2 points from Grace',
    ]
};

export const MyProfile: React.FC = () => {
    const [user, setUser] = useState(initialUser);
    const [historyVisibleCount, setHistoryVisibleCount] = useState(3); // Initial number of history items to show
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Load more history items
    const loadMoreHistory = () => {
        setHistoryVisibleCount((prevCount) => prevCount + 3);
    };

    // Edit profile modal handling
    const showEditProfileModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleEditProfile = (values: any) => {
        setUser({ ...user, ...values });
        setIsModalVisible(false);
    };

    return (
        <AppProtectedLayout>
            {/* Profile Header */}
            <Card bordered={false} style={{ textAlign: 'center', background: "#141414", color: "white", borderRadius: '16px', padding: '40px' }}>
                <Avatar size={120} src={user.avatar} />
                <h1 style={{ marginTop: '20px', fontSize: '28px', color: '#f5f5f5' }}>{user.name}</h1>
                <p style={{ fontSize: '18px', color: '#ccc' }}>
                    Points: {user.points} <StarOutlined style={{ color: '#ffc107', fontSize: '20px' }} />
                </p>
                <Button icon={<EditOutlined />} onClick={showEditProfileModal} style={{ marginTop: '20px' }}>
                    Edit Profile
                </Button>
            </Card>

            {/* Recent History */}
            <div style={{ marginTop: '40px', padding: '0 20px' }}>
                <h2 style={{ color: 'white' }}>Recent History</h2>
                <List
                    itemLayout="horizontal"
                    dataSource={user.history.slice(0, historyVisibleCount)}
                    renderItem={(item) => (
                        <List.Item style={{ background: "#1f1f1f", borderRadius: '12px', padding: '20px', marginBottom: '10px' }}>
                            <List.Item.Meta
                                avatar={<HistoryOutlined style={{ fontSize: '20px', color: '#1890ff' }} />}
                                title={<span style={{ color: 'white' }}>{item}</span>}
                            />
                        </List.Item>
                    )}
                />
                {historyVisibleCount < user.history.length && (
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <Button onClick={loadMoreHistory} type="primary">
                            Load More
                        </Button>
                    </div>
                )}
            </div>

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