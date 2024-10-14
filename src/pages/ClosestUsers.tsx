import React, {useEffect, useState} from 'react';
import {List, Avatar, Button} from 'antd';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {AppProtectedLayout} from '../components/AppLayout';
import {io} from "socket.io-client";
import {baseUrl} from "../constants/baseUrl.ts";
import Cookies from "js-cookie";
import {GivingPointModal} from "./Main/GivingPointModal.tsx";

interface IUser {
    id: string;
    location: {
        coordinates: [number, number];
    };
    username: string;
    point: number;
    _id: string; // in case your data uses `_id`
}


const socket = io(baseUrl, {
    query: {
        token: Cookies.get('token'),
    },
});

const MapCenterUpdater = ({position}) => {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.setView(position, 16);
        }
    }, [position, map]);
    return null;
};

export const ClosestUsers: React.FC = () => {
    const [closestUsers, setClosestUsers] = useState<IUser[]>([]);
    const [position, setPosition] = useState([40.3771, 49.8875]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const showGivePointModal = (userId: string) => {
        setSelectedUserId(userId);
        setIsModalVisible(true);
    };

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const {latitude, longitude} = position.coords;
                socket.emit("updateMyLocation", {latitude, longitude});
                socket.emit('getCloseUser', {latitude, longitude});
            },
            (error) => {
                console.error('Error fetching location:', error);
            },
            {enableHighAccuracy: true, maximumAge: 1000, timeout: 5000}
        );

        socket.on('closeUser', (users) => {
            setClosestUsers(users);
        });

        socket.on('myUserLocation', (data) => setPosition(data?.location.coordinates))

        return () => {
            navigator.geolocation.clearWatch(watchId); // Clean up watcher
        };
    }, []);

    return (
        <AppProtectedLayout>
            <div className={'mobile-map'} style={{display: 'flex', justifyContent: 'space-between', gap: '20px', height: '100%'}}>
                {/* Interactive Map */}
                <div style={{flex: 1}}>
                    <MapContainer
                        style={{height: '100%', width: '100%', borderRadius: '16px'}}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <MapCenterUpdater position={position}/>

                        {closestUsers.map(user => (
                            <Marker key={user?._id} position={user?.location?.coordinates}>
                                <Popup>
                                    {user?.username} <br/> Points: {user?.point.toFixed(3)}
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>

                <div
                    className={'closest-users-list'}
                    style={{
                        width: '300px',
                        background: '#001529',
                        padding: '15px',
                        borderRadius: '16px',
                        maxHeight: '100%',
                        overflowY: 'auto'
                    }}
                >
                    <h2 style={{color: '#fff', textAlign: 'center'}}>Closest Users</h2>
                    <List
                        itemLayout="horizontal"
                        dataSource={closestUsers}
                        renderItem={user => (
                            <List.Item key={user._id}>
                                <List.Item.Meta
                                    avatar={<Avatar>{user?.username.charAt(0)}</Avatar>}
                                    title={<span style={{color: '#fff'}}>{user?.username}</span>}
                                    description={<span style={{color: '#fff'}}>Points: {user?.point.toFixed(3)}</span>}
                                />
                                <Button type="primary" onClick={() => showGivePointModal(user._id)}>Give Points</Button>
                            </List.Item>
                        )}
                        style={{color: '#fff', background: '#001529'}}
                    />
                </div>
            </div>
            <GivingPointModal isVisible={isModalVisible}
                              userId={selectedUserId}
                              onClose={() => setIsModalVisible(false)}/>
        </AppProtectedLayout>
    );
};
