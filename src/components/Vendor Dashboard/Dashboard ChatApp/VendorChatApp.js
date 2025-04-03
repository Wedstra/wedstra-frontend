import React, { useEffect, useState } from 'react'
import axiosInstance from '../../../API/axiosInstance'
import { getCurrentVendor } from "../../../Auth/UserServices";
import { over } from 'stompjs';
import SockJS from 'sockjs-client';

var stompClient = null;
export default function VendorChatApp() {
    const [vendor, setVendor] = useState({});
    const [token, setToken] = useState(null);
    const [messages, setMessages] = useState([]);
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [userData, setUserData] = useState({
        senderName: "",
        receivername: "",
        connected: false,
        date: null,
        message: ''
    });




    useEffect(() => {
        const fetchTokenAndVendor = async () => {
            const storedToken = localStorage.getItem("token");
            if (storedToken) setToken(storedToken);

            const currVendor = await getCurrentVendor();
            if (currVendor) {
                setUserData(prevData => ({ ...prevData, senderName: currVendor.id }));
                setVendor(currVendor);
            }
        };

        fetchTokenAndVendor();
    }, []);

    const fetchChatMessages = async (receiverName) => {
        try {
            const response = await axiosInstance.get(`/get-messages-for-vendor?receiverName=${receiverName}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });

            if (response.data) {
                setMessages(response.data);
                // console.log(response.data);
                // Extract unique senderNames but exclude the logged-in vendor's ID
                const uniqueSenders = [...new Set(response.data.map(msg => msg.senderName))]
                    .filter(sender => sender !== vendor.id); // Remove current vendor
                setUserList(uniqueSenders);
                // console.log("distinct Username:" + uniqueSenders);
            }

        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    useEffect(() => {
        if (vendor?.id && token) {  
            fetchChatMessages(vendor.id);
            connect();
        }
    
        return () => {
            if (stompClient && stompClient.connected) {
                stompClient.disconnect(() => {
                    console.log("WebSocket disconnected!");
                });
            }
        };
    }, [vendor, token]);


    const handleUserClick = (user) => {
        setSelectedUser(user);
        setUserData(prevData => ({ ...prevData, receivername: user }));
    };

    const connect = () => {
        let Sock = new SockJS('http://localhost:8443/ws');
        stompClient = over(Sock);
        stompClient.connect({}, () => onConnected(vendor.id), onError);
    };
    
    const onConnected = (vendorId) => {
        setUserData(prev => ({ ...prev, connected: true }));
        
        if (stompClient && stompClient.connected) {
            stompClient.subscribe(`/user/${vendorId}/private`, onPrivateMessage);
            userJoin(vendorId);
        }
    };
    
    const userJoin = (vendorId) => {
        const chatMessage = { senderName: vendorId, status: "JOIN" };
        
        if (stompClient && stompClient.connected) {
            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
        }
    };

    const onPrivateMessage = (payload) => {
        const payloadData = JSON.parse(payload.body);

        setMessages(prevMessages => [...prevMessages, payloadData]); // Append new message
    };

    const onError = (err) => {
        console.log("WebSocket Error:", err);
    };

    const handleMessage = (event) => {
        setUserData(prev => ({ ...prev, message: event.target.value }));
    };

    const sendPrivateValue = () => {
        if (stompClient && userData.message.trim() !== "") {
            const chatMessage = {
                senderName: userData.senderName,
                receiverName: userData.receivername,
                message: userData.message,
                date: new Date(),
                status: "MESSAGE"
            };

            setMessages(prevMessages => [...prevMessages, chatMessage]); // Store message in state
            stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));

            setUserData(prev => ({ ...prev, message: "" })); // Clear input field
        }
    };

    const handleKeyPress = (e) => {
        // Check if the pressed key is the Enter key (keyCode 13)
        if (e.key === 'Enter') {
            e.preventDefault();  // Prevents the form from submitting
            sendPrivateValue();  // Call the send message function
        }
    };


    return (
        <>
            <div className="d-flex border border-secondary" style={{ height: '80vh' }}>
                {/* Left Sidebar - User List */}
                <div className="w-30 border-end p-3 bg-light">
                    <h4>Users</h4>
                    <ul className="list-unstyled">
                        {userList
                            .filter(sender => sender !== vendor.id)
                            .map((sender, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleUserClick(sender)}
                                    className={`p-2 rounded mb-2 ${selectedUser === sender ? 'bg-secondary text-white' : 'bg-transparent'}`}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {sender}
                                </li>
                            ))}
                    </ul>
                </div>

                {/* Right Chat Screen */}
                <div className="flex-grow-1 p-3 d-flex flex-column">
                    {selectedUser ? (
                        <>
                            <h4>Chat with {selectedUser}</h4>
                            <div className="flex-grow-1 overflow-auto border p-3 rounded" style={{ minHeight: '60vh' }}>
                                {messages
                                    .filter(msg => msg.senderName === selectedUser || msg.receiverName === selectedUser)
                                    .map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`d-flex ${msg.senderName === vendor.id ? 'justify-content-end' : 'justify-content-start'} mb-2`}
                                        >
                                            <div className={`p-2 rounded ${msg.senderName === vendor.id ? 'bg-danger text-white' : 'bg-light text-dark'}`} style={{ maxWidth: '70%' }}>
                                                {msg.message}
                                            </div>
                                        </div>
                                    ))}
                            </div>

                            {/* Message Input & Send Button */}
                            <div className="d-flex mt-3">
                                <input
                                    type="text"
                                    value={userData.message}
                                    onChange={handleMessage}
                                    placeholder="Type a message..."
                                    onKeyDown={(e) => handleKeyPress(e)}
                                    className="form-control"
                                />
                                <button className="btn btn-success ms-2" onClick={sendPrivateValue}>
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="select-user text-center">
                            <h4>Select a user to start chatting</h4>
                        </div>
                    )}
                </div>
            </div>

        </>
    )
}
