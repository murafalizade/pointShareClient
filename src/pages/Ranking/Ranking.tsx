import React, {useState} from 'react';
import {List, Avatar, Select, Spin} from 'antd';
import {TrophyOutlined, CrownOutlined, GoldOutlined, StarOutlined} from '@ant-design/icons';
import {AppProtectedLayout} from '../../components/AppLayout.tsx';
import {useQuery} from "react-query";
import {fetchTopRanked} from "../../services/apiServices.ts";
import {countries} from "../../constants/countires.ts";

const {Option} = Select;

interface IUser {
    username: string;
    point: number;
}

export const Ranking: React.FC = () => {
    const [selectedCountry, setSelectedCountry] = useState('Azerbaijan');
    const {data: rankingList = [], isLoading} = useQuery<IUser[]>(
        ["TOP_RANKED", selectedCountry],
        () => fetchTopRanked(selectedCountry),
        { cacheTime: 5000 }
    );
    const handleCountryChange = (country: string) => {
        setSelectedCountry(country);
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <CrownOutlined style={{color: 'gold'}}/>;
            case 2:
                return <TrophyOutlined style={{color: 'silver'}}/>;
            case 3:
                return <GoldOutlined style={{color: 'bronze'}}/>;
            default:
                return <span>{rank}</span>;
        }
    };

    return (
        <AppProtectedLayout>
            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                {/* Country Selection */}
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: "center"}}>
                    <h1>Top Ranking Users</h1>
                    <Select
                        value={selectedCountry}
                        style={{width: 200}}
                        onChange={handleCountryChange}
                    >
                        {
                            countries.map(country=>(
                                <Option value={country}>{country}</Option>
                            ))
                        }
                    </Select>
                </div>

                {/* Ranking List */}
                {
                    isLoading?(
                        <Spin />
                        ):(
                        <List
                            itemLayout="horizontal"
                            dataSource={rankingList}
                            renderItem={(user, index) => (
                                <List.Item
                                    style={{
                                        background: '#001529',
                                        marginBottom: '10px',
                                        borderRadius: '10px',
                                        padding: '15px',
                                        border: '1px solid #333'
                                    }}
                                >
                                    <List.Item.Meta
                                        avatar={<Avatar>{user.username.charAt(0)}</Avatar>}
                                        title={<span style={{color: '#fff'}}>{user.username}</span>}
                                        description={<span style={{color: '#fff'}}>Points: {user.point.toFixed(3)} <StarOutlined/></span>}
                                    />
                                    <div style={{
                                        color: '#fff',
                                        borderRadius: "50%",
                                        border: "1px solid #333",
                                        padding: '7px 11px'
                                    }}>
                                        {getRankIcon(index + 1)}
                                    </div>
                                </List.Item>
                            )}
                        />
                    )
                }
            </div>
        </AppProtectedLayout>
    );
};
