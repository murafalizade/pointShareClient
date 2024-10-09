import React, { useEffect, useState } from 'react';
import { List, Avatar, Button } from 'antd';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { AppProtectedLayout } from '../components/AppLayout';
import { io } from "socket.io-client";
import { baseUrl } from "../constants/baseUrl.ts";
import Cookies from "js-cookie";


const socket = io(baseUrl, {
    query: {
        token: Cookies.get('token'),
    },
});

const MapCenterUpdater = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView(position, 13);
        }
    }, [position, map]);
    return null;
};

export const ClosestUsers: React.FC = () => {
    const [closestUsers, setClosestUsers] = useState([]);
    const [position, setPosition] = useState([40.3771, 49.8875]);

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log(latitude, longitude);
                socket.emit("updateMyLocation", { latitude, longitude });
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

        socket.on('myUserLocation', (data)=>  setPosition(data?.location.coordinates))

        return () => {
            navigator.geolocation.clearWatch(watchId); // Clean up watcher
        };
    }, []);

    console.log(position)


    return (
        <AppProtectedLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', height: '100%' }}>
                {/* Interactive Map */}
                <div style={{ flex: 1 }}>
                    <MapContainer
                        zoom={13}
                        style={{ height: '100%', width: '100%', borderRadius: '16px' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MapCenterUpdater position={position} />

                        {closestUsers.map(user => (
                            <Marker key={user?.id} position={user?.location?.coordinates}>
                                <Popup>
                                    {user?.username} <br /> Points: {user?.point}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

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
                            <List.Item key={user.id}>
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
