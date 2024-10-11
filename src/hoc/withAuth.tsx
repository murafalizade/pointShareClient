import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import { io, Socket } from "socket.io-client";
import { baseUrl } from "../constants/baseUrl.ts";
import { notification } from "antd";

let socket: Socket | null = null;

export const withAuth = (Component: React.FunctionComponent) => {
    return (props) => {
        const nav = useNavigate();

        useEffect(() => {
            const authToken = Cookies.get("token");
            if (!authToken) {
                nav('/login');
                return;
            }

            if (!socket) {
                socket = io(baseUrl, {
                    query: {
                        token: authToken,
                    },
                });

                socket.on('notification', (data: any) => {
                    notification.info({
                        message: data.message,
                    });
                });
            }

            return () => {
                if (socket) {
                    socket.disconnect();
                    socket.off();
                    socket = null;
                }
            };
        }, [nav]);

        return <Component {...props} />;
    };
};
