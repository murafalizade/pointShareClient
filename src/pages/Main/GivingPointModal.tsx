import React, { useState, useEffect } from 'react';
import { Modal, Button, Rate, message } from 'antd';
import { StarOutlined } from '@ant-design/icons';
import { io } from 'socket.io-client';
import { baseUrl } from "../../constants/baseUrl.ts";
import Cookies from "js-cookie"; // WebSocket for real-time

const socket = io(baseUrl, {
    query: {
        token: Cookies.get('token'),
    },
});

export const GivingPointModal: React.FC<{ isVisible: boolean, userId: string, onClose: () => void }> = ({ isVisible, userId, onClose }) => {
    const [points, setPoints] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Reset the state when modal opens
        if (isVisible) {
            setPoints(0);
        }
    }, [isVisible]);

    const handleSendPoints = () => {
        if (points === 0) {
            message.error('Please select a point value before submitting!');
            return;
        }

        setLoading(true);
        // Emit the points to the server via WebSocket
        socket.emit('givePoint', {targetUserId: userId, points});
        message.success('Points successfully given!');
        setLoading(false);
    };

    return (
        <Modal
            title={<span style={{ color: '#1890ff', fontSize: '24px' }}>Give Points <StarOutlined /></span>}
            visible={isVisible}
            onCancel={onClose}
            footer={null} // Remove default footer
            style={{ padding: '24px' }}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Rate component for giving points */}
                <div style={{ textAlign: 'center' }}>
                    <h3 style={{ color: "black" }}>Select Point</h3>
                    <Rate
                        allowHalf
                        count={5}
                        value={points}
                        onChange={(value) => setPoints(value)}
                        style={{ fontSize: '36px', color: '#fadb14' }}
                    />
                </div>

                {/* Centered Submit Button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button
                        type="primary"
                        loading={loading}
                        onClick={handleSendPoints}
                        style={{ padding: '0 40px' }} // Adjust button width if needed
                    >
                        Send
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
