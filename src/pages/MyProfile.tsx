import React, { useEffect, useState } from 'react';
import {Avatar, List, Card, Button, Input, Modal, Form, Spin, message, Typography, Select, Empty} from 'antd';
import {HistoryOutlined, StarOutlined, EditOutlined} from '@ant-design/icons';
import { AppProtectedLayout } from '../components/AppLayout';
import {fetchPointHistory, fetchUserInformation, updateMyProfile} from "../services/apiServices.ts";
import {countries} from "../constants/countires.ts";

const { Text } = Typography;
const {Option} = Select;

interface Item {
    username: string;
    point: number;
    date: string;
}


export const MyProfile: React.FC = () => {
    const [user, setUser] = useState<any>(null); // Updated initial state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const profileData = await fetchUserInformation();
                const historyData = await fetchPointHistory();
                setUser({ ...profileData, history: historyData || [] });
            } catch (error) {
                message.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);


    const showEditProfileModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const handleEditProfile = async (values: any) => {
        try {
            await updateMyProfile(values);
            setIsModalVisible(false);
            message.success('Profile updated successfully');
        } catch (error) {
            message.error(error.message);
        }
    };

    return (
        <AppProtectedLayout>
            {
                loading ? (
                    <Spin size="large" style={{display: 'block', margin: '20px auto'}}/>
                ) : (
                    <Card bordered={false}
                          style={{
                              textAlign: 'center',
                              backgroundColor:"inherit",
                              color: "white",
                              borderRadius: '16px',
                              padding: '40px'
                          }}>
                        <Avatar size={120} style={{fontSize:'45px'}}>
                            {user?.username.charAt(0)}
                        </Avatar>
                        <h1 style={{marginTop: '20px', fontSize: '28px', color: '#f5f5f5'}}>{user.username}</h1>
                        <p style={{fontSize: '18px', color: '#ccc'}}>
                            Points: {user.point} <StarOutlined style={{color: '#ffc107', fontSize: '20px'}}/>
                        </p>
                        <Button icon={<EditOutlined/>} onClick={showEditProfileModal} style={{marginTop: '20px'}}>
                            Edit Profile
                        </Button>
                    </Card>
                )
            }

            <div style={{marginTop: '40px', padding: '0 20px'}}>
                <h2 style={{color: 'white'}}>Recent History</h2>
                {user?.history.length > 0 ? (<List
                        dataSource={user?.history}
                        renderItem={(item:Item) => (
                            <List.Item
                                style={{
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '8px',
                                    marginBottom: '12px',
                                    padding: '12px',
                                    backgroundColor: item.username === user.username ? '#1890ff' : '#4CAF50', // Sender (user) in blue, receiver in green
                                    color: '#fff',
                                }}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <HistoryOutlined style={{fontSize: '20px', color: '#fff'}}/>
                                    }
                                    title={
                                        <Text style={{color: '#fff'}}>
                                            {item.username === user.username ? 'You' : item.username}
                                        </Text>
                                    }
                                    description={
                                        <Text style={{color: '#d9d9d9'}}>
                                            {item.point} points on {new Date(item.date).toLocaleString()}
                                        </Text>
                                    }
                                />
                            </List.Item>
                        )}
                    />) :
                    (<Empty
                        description={<span style={{color: '#fff'}}>No history found</span>}
                        style={{color: '#fff'}}
                    />)}

            </div>
            {/*/!* Edit Profile Modal *!/*/}
            <Modal
                title="Edit Profile"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    initialValues={{
                        username: user?.username,
                        country: user?.country, // Prepopulate with user's country if available
                    }}
                    onFinish={handleEditProfile}
                >
                    {/* Username Field */}
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    {/* Country Selection Field */}
                    <Form.Item
                        label="Country"
                        name="country"
                        rules={[{ required: true, message: 'Please select your country!' }]}
                    >
                        <Select placeholder="Select your country">
                            {countries.map((country) => (
                                <Option key={country} value={country}>
                                    {country}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Submit Button */}
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