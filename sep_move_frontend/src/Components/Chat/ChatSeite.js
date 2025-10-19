
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ChatComponent = () => {
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [connected, setConnected] = useState(false);
    const stompClientRef = useRef(null);
    const API_ROOM_URL = 'http://localhost:8080/chatrooms';
    const { chatRoomId } = useParams(); 
    const userId = localStorage.getItem('nutzerId');
    const userName = localStorage.getItem('nutzername');
    const [editingMessageId, setEditingMessageId] = useState(null); 
    const [newMessageText, setNewMessageText] = useState(''); 
    const navigate = useNavigate();
    const mesSub = (client) =>{ client.subscribe(
        `/chatroom/${chatRoomId}/messages`,
        onMessageReceived
    );}
    const statSub = (client) => { client.subscribe(
        `/chatroom/${userId}/status`,
        onStatusUpdate
    );}

    /*********************************************************************************************/
const home = () => {
    navigate(`/home/${userId}`)

};


    /*********************************************************************************************/
    const connect = () => {
        if (stompClientRef.current) return;
        const socket = new SockJS('http://localhost:8080/websocket');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => onConnected(client),
            onStompError: (frame) => {
                console.error('WS Fehler:', frame);
                client.deactivate(); 
            },
            onWebSocketClose: () => {
              console.log("WS geschlossen");
              
          },
            onDisconnect: () => {
                console.log("WS Verbindung getrennt");
                setConnected(false);
            }, debug: (str) => {
              console.log('STOMP Debug:', str); 
          }
        });
        
        stompClientRef.current = client;
        client.activate();
    };


    /*********************************************************************************************/
  const onConnected = (client) => {
    console.log("Mit WebSocket verbunden");
    setConnected(true);
    mesSub(client);
    statSub(client);
    console.log(`Subscribed to: /chatroom/${chatRoomId}`);
};

/*********************************************************************************************/
useEffect(() => {
  connect(); 
  return () => { 
      if (stompClientRef.current) {
          console.log("WS Verbindung wird getrennt");
          stompClientRef.current.deactivate();
          stompClientRef.current = null; 
          
          console.log("WS Verbindung wurde getrennt");
      }
  };
}, []);




  

/********************************************NACHRICHT SENDEN*************************************************/
const sendMessage = () => {
    if (!stompClientRef.current || messageText.trim() === '') return;

    const message = {
      message: messageText,
        senderId: userId,
        senderName: userName,
        chatRoomId : chatRoomId,
        timestamp: new Date(),
        type: "Chat"
    };

    try {
      stompClientRef.current.publish({
          destination: '/app/chat', 
          body: JSON.stringify(message), 
      });
      setMessageText(''); 
  } catch (error) {
      console.error('Nachricht konnte nicht verschickt werden:', error);
  }
};
/****************************************CHATVERLAUF LADEN*****************************************************/

    const fetchMessages = async () => {
        try {
          const response = await axios.get(`${API_ROOM_URL}/getChat/${chatRoomId}/${userId}`);
          setMessages(response.data);  
        } catch (error) {
          console.error('Nachrichten konnten nicht geladen werden:', error);  
        }
      };


      /*********************************************************************************************/

useEffect(() => {


    fetchMessages();  

    
    return () => {
      console.log('leaving');  
    };

  }, [chatRoomId, userId]);
/*********************************************Löschen von Nachrichten************************************************/


const handleDeleteClick = async (msg) => {
    
    if (Number(msg.senderId) === Number(userId)) {
        try {
            
            const response = await axios.delete(`${API_ROOM_URL}/messages/${userId}/${msg.id}/delete`);
            
            
            if (response.status === 200) {
                
                setMessages(messages.filter((message) => message.id !== msg.id));
                alert("Nachricht wurde gelöscht.");
            }
        } catch (error) {
            console.error("Fehler beim Löschen:", error);
            alert("Fehler beim löschen");
        }
    } else {
        alert("Du kannst nur deine eigenen Nachrichten löschen");
    }
};

/*****************************************BEARBEITEN VON NACHRICHTEN****************************************************/
    const handleEditClick = (msg) => {
        if (Number(msg.senderId) === Number(userId))  {
        setEditingMessageId(msg.id);
        
        setNewMessageText(msg.messageText); } else {
            alert("Du kannst nur deine eigenen Nachrichten löschen");
        }
    };
/*********************************************************************************************/
    const handleSaveClick = () => {
        if (newMessageText.trim()) {
            onTextEdit(editingMessageId, newMessageText); 
            setEditingMessageId(null); 
            setNewMessageText('');
        } else if (!newMessageText) {
            setEditingMessageId(null); 
            setNewMessageText('');
            alert("Du kannst die Nachricht nicht leer lassen")}
    };
/*********************************************************************************************/
    const handleCancelClick = () => {
        setEditingMessageId(null); 
        setNewMessageText('');
    };

/******************************************************************************************** */
const onTextEdit = (messageId, newText) => {
    if (!messageId) {
        console.error("Message ID ist nicht definiert");
        return;
      }
    console.log("Message ID der zu verändernded Nachricht:", messageId);
    const editData = {
        textEdit: newText,
        userId: userId
        
    }
    axios
        .put(`${API_ROOM_URL}/${chatRoomId}/messages/${messageId}/edit`, editData)
        .then((response) => {
            console.log('Nachricht geändert:', response.data);
            if (response.status === 200) {
                
               
                alert("Nachricht wurde geändert. Lade die Seite erneut um die Änderung zu sehen");
            }     
        })
        .catch((error) => {
            console.error('Nachricht konnte nicht verändert werdden:', error);
        });
};

  
 

/*******************************************NACHDEM NACHRICHT ÜBER SUBSCRIPTION EMPFANGEN WURDE**************************************************/
const onMessageReceived = (message) => {
    console.log('Nachricht erhalten:', message);
    const messageBody = JSON.parse(message.body);
    console.log('parsed Nachricht:', messageBody);
    const senderId = messageBody.senderId;
    setMessages((prevMessages) => [...prevMessages, messageBody]);
    if (Number(senderId) !== Number(userId)) {
        updateStatus(messageBody);
    }

    
    
};

    /****************************************STATUS AKTUALISIEREN*****************************************************/
    const updateStatus = (message) => {
        
            console.log(message.id);
            const statusRequest = {
                messageId: Number(message.id),
                messAuthorId: message.senderId,
                userId: Number(userId),
                type: "Status",
                status: "DELIVERED" 
               

            };
            try {
                stompClientRef.current.publish({
                    destination: '/app/chat', 
                    body: JSON.stringify(statusRequest), 
                });
             
            } catch (error) {
                console.error('Status konnte nicht aktualisiert werden:', error);
            }
        
    };
  

/*********************************************************************************************/

const onStatusUpdate = (statusUpdateMessage) => {
    const statusUpdate = JSON.parse(statusUpdateMessage.body);
    const { messageId, status } = statusUpdate;

    setMessages((prevMessages) => {
        return prevMessages.map((msg) =>
            msg.id === messageId ? { ...msg, status } : msg
        );
    });
};




/***************************************HTML+CSS******************************************************/


return (
    <div className="chatContainer" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
    <h2>Chat</h2>
    <button type="button" className="btn btn-primary" onClick={home}>Go to home</button>
    {connected ? (
        <p style={{ color: 'green' }}>Verbunden</p>
    ) : (
        <p style={{ color: 'red' }}>Nicht verbunden. Lade die Seite erneut.</p>
    )}

    <div
        className="pastMessages"
        style={{
            border: '1px solid #ccc',
            padding: '10px',
            marginBottom: '20px',
            height: '300px',
            overflowY: 'auto',
        }}
    >
        {messages.length > 0 ? (
            messages.sort((a, b) => a.id - b.id).map((msg, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                    <strong>{msg.senderName}:</strong>
                    {editingMessageId === msg.id ? (
                        <>
                            <input
                                type="text"
                                value={newMessageText}
                                onChange={(e) => setNewMessageText(e.target.value)}
                                style={{ marginRight: '5px' }}
                            />
                            <button onClick={handleSaveClick} style={{ marginRight: '5px' }}>
                                Speichern
                            </button>
                            <button onClick={handleCancelClick}>Abbruch</button>
                        </>
                    ) : (
                        <>
                            <span>{msg.message}</span>
                            
                                <>
                                    <button
                                        onClick={() => handleEditClick(msg)}
                                        style={{ marginLeft: '10px' }}
                                        disabled={msg.status === 'DELIVERED'}  
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(msg)}
                                        style={{ marginLeft: '5px' }}
                                        disabled={msg.status === 'DELIVERED'}
                                    >
                                        Delete
                                    </button>
                                </>
                            
                                <button
                                    //onClick={() => handleReportClick(msg)}
                                    style={{ marginLeft: '10px' }}
                                    disabled
                                >
                                    Report
                                </button>
                            
                        </>
                    )}
                    <br />
                    <small style={{ color: '#aaa' }}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                    </small>
                </div>
            ))
        ) : (
            <p>Keine Nachrichten.</p>
        )}
    </div>

    <div style={{ display: 'flex', gap: '10px' }}>
        <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Verfasse eine Nachricht"
            style={{ flex: 1, padding: '10px', border: '1px solid #ccc' }}
        />
        <button
            onClick={sendMessage}
            style={{
                padding: '10px 20px',
                backgroundColor: 'blue',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
            }}
        >
            Senden
        </button>
    </div>
</div>

);

};

export default ChatComponent;
