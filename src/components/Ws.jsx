// src/WebSocketComponent.js
import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WebSocketComponent = () => {
    // Menghubungkan ke WebSocket server
    const { lastMessage } = useWebSocket('ws://localhost:4000', {
        onOpen: () => console.log('WebSocket connection opened'),
        onClose: () => console.log('WebSocket connection closed'),
        onError: (error) => console.error('WebSocket error:', error),
    });
    console.log('WebSocket connection status:', lastMessage);

    // Menggunakan useEffect untuk mendengarkan pesan terakhir
    useEffect(() => {
        if (lastMessage !== null) {
            const messageData = JSON.parse(lastMessage.data);
            console.log(`Received message: ${messageData.message}`);
            toast.info(messageData.message); // Menampilkan notifikasi
        }
    }, [lastMessage]);


};

export default WebSocketComponent;