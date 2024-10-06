import React, { useState } from 'react';
import { Avatar, Modal, List } from 'antd';
import { HistoryOutlined } from '@ant-design/icons';

interface User {
    id: number;
    name: string;
    avatar: string;
    points: number;
    history: string[];
}

const exampleUser: User = {
    id: 1,
    name: 'Alice',
    avatar: 'https://example.com/avatar.png',
    points: 150,
    history: [
        'Gave 10 points to Bob',
        'Received 5 points from Eve',
        'Gave 15 points to Charlie'
    ]
};

interface  IModalProps {
    isModalVisibleProps: boolean
}

const ViewProfile = ({isModalVisibleProps}:IModalProps) => {
    const [isModalVisible, setIsModalVisible] = useState(isModalVisibleProps);

    const handleCloseProfile = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            {/* Modal for Viewing Profile */}
            <Modal
                title="User Profile"
                centered
                visible={isModalVisible}
                onCancel={handleCloseProfile}
                footer={null} // No footer for this modal
            >
                {/* Avatar, Name, and Points */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <Avatar size={100} src={exampleUser.avatar} />
                    <h2 style={{ marginTop: '10px', color:"black" }}>{exampleUser.name}</h2>
                    <p style={{ fontSize: '18px' }}>Points: {exampleUser.points}</p>
                </div>

                {/* History List - Last 3 Actions */}
                <h3>Recent History</h3>
                <List
                    itemLayout="horizontal"
                    dataSource={exampleUser.history.slice(0, 3)}  // Take last 3 history items
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<HistoryOutlined />}
                                title={item}
                            />
                        </List.Item>
                    )}
                />
            </Modal>
        </>
    );
};

export default ViewProfile;
