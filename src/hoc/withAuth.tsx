import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';
import {io} from "socket.io-client";
import {baseUrl} from "../constants/baseUrl.ts";
import {notification} from "antd";


const socket = io(baseUrl, {
    query: {
        token: Cookies.get('token'),
    },
});

export const withAuth = (Component: React.FunctionComponent) => {
    return (props) => {
        const nav = useNavigate();
        useEffect(() => {
            const authToken = Cookies.get("token");
            if(!authToken){
                nav('/login')
            }

            socket.on('notification', (data) => {
                console.log(data);
                notification.info(data.message);
            });

        }, []);

        return <Component {...props} />;
    }
}