import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Cookies from 'js-cookie';


export const withAuth = (Component: React.FunctionComponent) => {
    return (props) => {
        const nav = useNavigate();
        useEffect(() => {
            const authToken = Cookies.get("token");
            if(!authToken){
                nav('/login')
            }
        }, []);

        return <Component {...props} />;
    }
}