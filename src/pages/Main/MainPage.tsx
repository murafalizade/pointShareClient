// src/pages/Login.tsx
import React, { useState } from 'react';
import { Button, Input, Tabs, Typography, Layout, Select } from 'antd';
import { useMutation } from 'react-query';
import Cookies from 'js-cookie';
import {useNavigate} from "react-router-dom";
import {login} from "../services/apiServices.ts";
import { countries } from '../constants/countires.ts';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Content } = Layout;
const {Option} = Select;


interface IUser {
    email: string;
    username: string;
    password: string;
    country: string;
}

const Login: React.FC = () => {
    const [activeTab, setActiveTab] = useState('login');
    const navigate = useNavigate();

    const [user, setUser] = useState<IUser>({
        username: '',
        email: '',
        password: '',
        country: "Azerbaijan"
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prevUser => ({ ...prevUser, [name]: value }));
    };

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };

    const handleGoogleLogin = () => {
        // Handle Google login logic here
        console.log('Google login clicked');
    };

    // API call to login
    const loginMutation = useMutation(()=>login(user, activeTab), {
        onSuccess: (data) => {
            Cookies.set('token', data.token, { expires: 7 });
            console.log('Login successful', data);
            navigate("/app")
        },
        onError: (error) => {
            console.error('Login error:', error);
            // Handle error (e.g., show notification)
        }
    });

    const handleSubmit = () => {
        loginMutation.mutate();
    };

    return (
        <Layout className="login-layout">
            <Content className="login-layout">
                <div className="login-box">
                    <Title className="login-title">Welcome Back!</Title>
                    <Tabs activeKey={activeTab} onChange={handleTabChange}>
                        <TabPane tab="Login" key="login">
                            <div className="form-group">
                                <Input
                                    name="email"
                                    onChange={handleInputChange}
                                    placeholder="Email"
                                    type="email"
                                    className="form-input"
                                />
                                <Input.Password
                                    name="password"
                                    placeholder="Password"
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                                <Button
                                    type="primary"
                                    className="form-button"
                                    onClick={handleSubmit}
                                >
                                    Login
                                </Button>
                            </div>
                        </TabPane>
                        <TabPane tab="Register" key="register">
                            <div className="form-group">
                                <Input
                                    name="username"
                                    placeholder="Username"
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                                <Input
                                    name="email"
                                    placeholder="Email"
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                                <Input.Password
                                    name="password"
                                    placeholder="Password"
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                                <Select style={{width:'320px', padding:'0', textAlign:'left', height:'45px'}} placeholder={'Country'} className='form-input' value={user.country}>
                                    {countries.map(country=>(
                                        <Option value={country}>{country}</Option>
                                    ))}
                                </Select>
                                <Button
                                    type="primary"
                                    className="form-button"
                                    onClick={handleSubmit}
                                >
                                    Register
                                </Button>
                            </div>
                        </TabPane>
                    </Tabs>
                    <button className="google-button" onClick={handleGoogleLogin}>
                        <span aria-hidden="true" className="google-logo">
                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                                viewBox="0 0 512 512" height="24"
                                                                                width="24"><path fill="#4285f4"
                                                                                                 d="M386 400c45-42 65-112 53-179H260v74h102c-4 24-18 44-38 57z"></path><path
                              fill="#34a853" d="M90 341a192 192 0 0 0 296 59l-62-48c-53 35-141 22-171-60z"></path><path
                              fill="#fbbc02" d="M153 292c-8-25-8-48 0-73l-63-49c-23 46-30 111 0 171z"></path><path
                              fill="#ea4335"
                              d="M153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55z"></path></svg>
                        </span>
                        Continue with Google
                    </button>
                </div>
            </Content>
        </Layout>
    );
};

export default Login;
