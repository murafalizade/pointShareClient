import React, {useEffect, useState} from 'react';
import { List, Avatar, Button } from 'antd';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import { AppProtectedLayout} from '../components/AppLayout';
import {io} from "socket.io-client";
import {baseUrl} from "../constants/baseUrl.ts";
import Cookies from "js-cookie"; // Import AppLayout

const socket = io(baseUrl, {
    query: {
        token: Cookies.get('token'),
    },
});


export const ClosestUsers: React.FC = () => {
    const [closestUsers, setClosestUsers] = useState([]);

    useEffect(() => {
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


    return (
        <AppProtectedLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', height: '100%' }}>
                {/* Interactive Map */}
                <div style={{ flex: 1 }}>
                    <MapContainer
                        center={[40.73061, -73.935242]}
                        zoom={13}
                        style={{ height: '100%', width: '100%', borderRadius: '16px' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {closestUsers.map(user => (
                            <Marker key={user?.id} position={user?.location?.coordinates}>
                                <Popup>
                                    {user?.username} <br /> Points: {user?.point}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                {/* Right Sidebar with full list of closest users */}
                <div
                    style={{
                        width: '300px',
                        background: '#001529',
                        padding: '15px',
                        borderRadius: '16px',
                        maxHeight: '100%',
                        overflowY: 'auto'
                    }}
                >
                    <h2 style={{ color: '#fff', textAlign: 'center' }}>Closest Users</h2>
                    <List
                        itemLayout="horizontal"
                        dataSource={closestUsers}
                        renderItem={user => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar>{user?.username.charAt(0)}</Avatar>}
                                    title={<span style={{ color: '#fff' }}>{user?.username}</span>}
                                    description={<span style={{ color: '#fff' }}>Points: {user?.point}</span>}
                                />
                                <Button type="primary">Give Points</Button>
                            </List.Item>
                        )}
                        style={{ color: '#fff', background: '#001529' }}
                    />
                </div>
            </div>
        </AppProtectedLayout>
    );
};

