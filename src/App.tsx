// src/App.tsx
import React from 'react';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import {Welcome} from './pages/Welcome'; // Import the Welcome component
import "./App.css"
import Login from "./pages/Login.tsx";
import MainPage from "./pages/Main/MainPage.tsx";
import {ClosestUsers} from "./pages/ClosestUsers.tsx";
import {Ranking} from "./pages/Ranking/Ranking.tsx";
import {MyProfile} from "./pages/MyProfile.tsx";
import {QueryClient, QueryClientProvider} from "react-query";
import {RecoilRoot} from "recoil";

const App: React.FC = () => {

    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <RecoilRoot>

                <Router>
                    <Routes>
                        <Route path="/" element={<Welcome/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path={'/app'} element={<MainPage/>}/>
                        <Route path={'/closest-users'} element={<ClosestUsers/>}/>
                        <Route path={'/ranking'} element={<Ranking/>}/>
                        <Route path={'/my-profile'} element={<MyProfile/>}/>
                    </Routes>
                </Router>
            </RecoilRoot>

        </QueryClientProvider>

    );
};

export default App;
