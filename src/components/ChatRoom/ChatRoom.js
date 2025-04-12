import React, { useEffect, useState } from 'react';
import { MessageSquare, X } from "lucide-react";
import { over } from 'stompjs';
import SockJS from 'sockjs-client';
import './chatRoom.css';
import axiosInstance from '../../API/axiosInstance';

var stompClient = null;

const predefinedMessages = {
    "requirements": [
        "Can you share your project requirements in detail?",
        "What are the main features you’re looking for?",
        "Do you have any reference projects in mind?",
        "Would you like to provide a project document?"
    ],
    "budget": [
        "What is your estimated budget for this project?",
        "Are you open to a flexible budget based on features?",
        "Would you like a cost breakdown for different options?",
        "Are there any cost constraints we should consider?"
    ],
    "technology": [
        "Do you have any preferred technology stack?",
        "Are you looking for a mobile or web-based solution?",
        "Would you like recommendations on the best technology?",
        "Should we consider AI, ML, or automation for efficiency?"
    ],
    "timeline": [
        "When do you need this project completed?",
        "Is there a strict deadline we should meet?",
        "Would you like to discuss a phased delivery plan?",
        "Do you need an MVP first before full development?"
    ],
    "communication": [
        "Would you like to schedule a call to discuss details?",
        "Do you prefer email, WhatsApp, or direct calls for updates?",
        "Shall we set up a recurring weekly progress meeting?",
        "What time zone are you in for smooth collaboration?"
    ],
    "payment": [
        "What is your preferred payment mode?",
        "Shall we sign an NDA before discussing details?",
        "Would you like milestone-based payments?",
        "Do you have specific contract terms we should review?"
    ]
};

export default function ChatRoom({ vendor, user }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [suggestedMessages, setSuggestedMessages] = useState([]);
    const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
    const [isToolTip, setIsToolTip] = useState(true);

    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState({
        senderName: user.id || "",
        receivername: vendor.id || "",
        connected: false,
        date: null,
        message: ''
    });

    const toggleChat = () => setIsOpen(!isOpen);
    const toggleSuggestion = () => setIsSuggestionOpen(!isSuggestionOpen);
    const toogleTooltip = () => setIsToolTip(!isToolTip);

    const fetchMessages = async (senderName, receiverName) => {
        try {
            if (!token) {
                console.error("Token is missing!");
                return;
            }
            const response1 = await axiosInstance.get(`/api/messages?senderName=${senderName}&receiverName=${receiverName}`, {  // Cleaner way to pass query parameters
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            const response2 = await axiosInstance.get(`/api/messages?senderName=${receiverName}&receiverName=${senderName}`, {  // Cleaner way to pass query parameters
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });


            const messages1 = Array.isArray(response1.data) ? response1.data : [];
            const messages2 = Array.isArray(response2.data) ? response2.data : [];


            const allMessages = [...messages1, ...messages2];

            allMessages.sort((a, b) => new Date(a.date) - new Date(b.date));

            setMessages(allMessages);

            console.log("Fetched and combined messages:", allMessages);

        } catch (error) {
            console.error("Error fetching messages:", error.response?.data || error.message);
        }



    }
    useEffect(() => {
        const fetchToken = () => {
            const storedToken = localStorage.getItem("token"); // No need for async/await
            if (storedToken) setToken(storedToken);

            if (user) {
                console.log(user.id);
            }

            if (vendor) {
                console.log(vendor.id);

            }
        };

        fetchToken();
    }, []);

    useEffect(() => {
        if (token) {
            console.warn("Token retrieved, now connecting:", token);
            fetchMessages(userData.senderName, userData.receivername);
            connect(); // Ensure connect() is correctly handling re-renders
        }

        return () => {
            if (stompClient) {
                stompClient.disconnect(() => {
                    console.log("WebSocket disconnected!");
                });
            }
        };
    }, [token]);

    const connect = () => {
        // let Sock = new SockJS(`http://localhost:8443/ws`);
        let Sock = new SockJS(`https://wedstra-backend-9886.onrender.com/ws`);
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    }

    const onConnected = () => {
        setUserData(prev => ({ ...prev, connected: true }));
        stompClient.subscribe('/user/' + userData.senderName + '/private', onPrivateMessage);
        userJoin();
    }

    const userJoin = () => {
        const chatMessage = { senderName: userData.senderName, status: "JOIN" };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
    }

    const onPrivateMessage = (payload) => {
        const payloadData = JSON.parse(payload.body);

        setMessages(prevMessages => [...prevMessages, payloadData]); // Append new message
    };

    const onError = (err) => {
        console.log("WebSocket Error:", err);
    };

    const handleMessage = (event) => {
        setMessage(event.target.value);
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

    useEffect(() => {
        const words = userData.message.toLowerCase().split(" ");
        const lastWord = words[words.length - 1];

        if (predefinedMessages[lastWord]) {
            toggleSuggestion();
            setSuggestedMessages(predefinedMessages[lastWord]);
        } else {
            setSuggestedMessages([]);
        }
    }, [message]);

    const handleSuggestionClick = (msg) => {
        setUserData(prev => ({ ...prev, message: msg }));
        toggleSuggestion();
    };

    return (
        <div>
            {/* Floating Chat Button */}
            {!isOpen && (
                <div className="position-fixed bottom-3 start-3 d-flex align-items-center gap-2 p-2 bg-white shadow-lg rounded-pill border" id="chat-btn" onClick={toggleChat}>
                    <img src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png" alt="User" className="rounded-circle" width="40" height="40" />
                    <div className="d-flex flex-column">
                        <strong>Message {vendor.business_name}</strong>
                        <small className="text-muted">Last seen: <span className="fw-bold">1 Hour</span></small>
                    </div>
                    <button className="btn btn-light rounded-circle shadow-sm p-2">
                        <MessageSquare size={18} />
                    </button>
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="card shadow-lg border rounded-4 d-flex flex-column" id="chat-window" style={{ width: "400px", height: "500px" }}>
                    <div className="card-header d-flex justify-content-between align-items-center bg-white border-bottom w-100">
                        <div className="d-flex align-items-center">
                            <img src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png" alt="User" className="rounded-circle me-2" width="40" height="40" />
                            <div>
                                <strong>Message {vendor.business_name}</strong>
                                <div className="text-muted small">Last seen: <strong>1 Hour</strong></div>
                            </div>
                        </div>
                        <X size={20} className="cursor-pointer" id="close-btn" onClick={toggleChat} />
                    </div>

                    {isToolTip && (
                        <div id="suggestion-tooltip" className="tooltip-box shadow-sm p-3 rounded">
                            <span>
                                Need help? Try typing keywords like <strong>"requirements"</strong>, <strong>"budget"</strong>, or <strong>"timeline"</strong> to get suggested messages.
                            </span>
                            <X size={20} className="cursor-pointer ms-2 text-danger close-btn" onClick={toogleTooltip} />
                        </div>
                    )}


                    {/* Chat Content */}
                    <div className="flex-grow-1 overflow-auto p-3 w-100" id="chat-section">
                        {messages.map((chat, index) => {
                            // Check if the current user is a vendor
                            const isVendor = userData.role === "VENDOR";
                            // Determine if the current chat message is sent by the current user
                            const isCurrentUser = isVendor ? chat.senderName === userData.username : chat.senderName !== userData.username;

                            return (
                                <div key={index} className={`d-flex mb-2 ${chat.senderName === userData.senderName ? "justify-content-end" : "justify-content-start"}`}>
                                    {/* If the message is not from the current user, show vendor's image */}
                                    {chat.senderName === userData.receivername && (
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                                            alt="Vendor"
                                            className="rounded-circle me-2"
                                            width="35"
                                            height="35"
                                        />
                                    )}

                                    {/* Chat bubble */}
                                    <div
                                        className={`p-2 shadow-sm ${chat.senderName === userData.senderName ? "bg-primary text-white" : "bg-light text-dark"}`}
                                        style={{
                                            maxWidth: "70%",
                                            padding: "5px 15px",
                                            borderRadius: chat.senderName === userData.senderName ? "18px 18px 2px 18px" : "18px 18px 18px 2px"
                                        }}>
                                        {chat.message}
                                    </div>

                                    {/* If the message is from the current user, show user's image */}
                                    {chat.senderName === userData.senderName && (
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
                                            alt="User"
                                            className="rounded-circle ms-2"
                                            width="35"
                                            height="35"
                                        />
                                    )}
                                </div>
                            );
                        })}


                    </div>

                    {isSuggestionOpen && suggestedMessages.length > 0 && (
                        <div className="mt-2 p-2 border rounded bg-light position-relative">
                            {/* Close Button */}

                            <div id='suggestion-title'>
                                <strong>Suggested Messages:</strong>
                                <X size={20} className="cursor-pointer" id="close-btn" onClick={toggleSuggestion} />
                            </div>
                            <div className="d-flex flex-wrap gap-2 mt-1">
                                {suggestedMessages.map((msg, index) => (
                                    <button
                                        key={index}
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => handleSuggestionClick(msg)}
                                    >
                                        {msg}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* Input Field */}
                    <div className="card-footer d-flex align-items-center p-2 bg-white border-top w-100">
                        <input type="text" className="form-control border-0" value={userData.message} onChange={handleMessage} placeholder="Type a message..." maxLength="2500" onKeyDown={(e) => handleKeyPress(e)} />
                        <button className="btn btn-success ms-2" onClick={sendPrivateValue}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
}
