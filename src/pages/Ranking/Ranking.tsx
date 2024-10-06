import React, {useState} from 'react';
import {List, Avatar, Select, Button} from 'antd';
import {TrophyOutlined, CrownOutlined, GoldOutlined, StarOutlined} from '@ant-design/icons';
import { AppProtectedLayout} from '../../components/AppLayout.tsx';
import ViewProfile from "./ProfileModal.tsx"; // Import AppLayout

const {Option} = Select;

const rankingData = {
    USA: [
        {id: 1, name: 'Alice', points: 150},
        {id: 2, name: 'Bob', points: 140},
        {id: 3, name: 'Charlie', points: 135},
        {id: 4, name: 'Dave', points: 130},
        {id: 5, name: 'Eve', points: 120},
        {id: 6, name: 'Frank', points: 115},
        {id: 7, name: 'Grace', points: 110},
        {id: 8, name: 'Hank', points: 105},
        {id: 9, name: 'Isaac', points: 100},
        {id: 10, name: 'John', points: 95},
        {id: 11, name: 'Karen', points: 90},
        {id: 12, name: 'Liam', points: 85},
        {id: 13, name: 'Mona', points: 80},
        {id: 14, name: 'Nick', points: 75},
        {id: 15, name: 'Olivia', points: 70}
    ],
    UK: [
        {id: 1, name: 'Arthur', points: 148},
        {id: 2, name: 'Betty', points: 139},
        {id: 3, name: 'Clyde', points: 132},
        {id: 4, name: 'Diana', points: 129},
        {id: 5, name: 'Edward', points: 121},
        {id: 6, name: 'Fiona', points: 115},
        {id: 7, name: 'Gareth', points: 110},
        {id: 8, name: 'Harry', points: 108},
        {id: 9, name: 'Isabelle', points: 104},
        {id: 10, name: 'James', points: 99},
        {id: 11, name: 'Kate', points: 93},
        {id: 12, name: 'Lola', points: 89},
        {id: 13, name: 'Mick', points: 82},
        {id: 14, name: 'Nora', points: 78},
        {id: 15, name: 'Oscar', points: 74}
    ]
};

export const Ranking: React.FC = () => {
    const [selectedCountry, setSelectedCountry] = useState('USA');
    const [rankingList, setRankingList] = useState(rankingData['USA']);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleCountryChange = (country: string) => {
        setSelectedCountry(country);
        setRankingList(rankingData[country]);
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
                <div style={{display: 'flex', justifyContent: 'space-between', alignContent: "center"}}>
                    <h1>
                        Top Ranking Users
                    </h1>
                    <Select
                        defaultValue={selectedCountry}
                        style={{width: 200}}
                        onChange={handleCountryChange}
                    >
                        <Option value="USA">USA</Option>
                        <Option value="UK">UK</Option>
                    </Select>
                </div>

                {/* Ranking List */}
                <List
                    itemLayout="horizontal"
                    dataSource={rankingList}
                    renderItem={(user, index) => (
                        <List.Item
                            actions={[
                                <Button type="primary" onClick={()=> setIsModalVisible(true)}>View Profile</Button>,
                            ]}
                            style={{
                                background: '#001529',
                                marginBottom: '10px',
                                borderRadius: '10px',
                                padding: '15px',
                                border: '1px solid #333'
                            }}
                        >
                            <List.Item.Meta
                                avatar={<Avatar>{user.name.charAt(0)}</Avatar>}
                                title={<span style={{color: '#fff'}}>{user.name}</span>}
                                description={<span style={{color: '#fff'}}>Points: {user.points} <StarOutlined/></span>}
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
            </div>
            <ViewProfile isModalVisibleProps={isModalVisible} />
        </AppProtectedLayout>
    );
};