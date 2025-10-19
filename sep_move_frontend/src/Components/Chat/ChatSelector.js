import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChatSelector = () => {

    const [chatRooms, setChatRooms] = useState([]);
    const navigate = useNavigate();
    
    const userId = localStorage.getItem("nutzerId");
    const API_BASE_URL = 'http://localhost:8080/chatrooms';
     useEffect(() =>{
const getChatRooms = async () =>
{

try {
    const response = await axios.get(`${API_BASE_URL}/findrooms/${userId}`)
    setChatRooms(response.data);
}


catch (err) {
              alert("Chatrooms konnten nicht geladen werden");
} 
};

getChatRooms();
}, []);

const handleRoomSelect = (chatRoomId) => {
navigate(`/chat/${chatRoomId}`);


}

const handleRoomCreate = () => {
    navigate('/createChat');

}

return(

<div className ="chatSelector">
 <h1>ChatRoomSelector</h1>
 <div roomList>
    {chatRooms.length > 0 ?(


<ul>
                        {chatRooms.map((chatRoom) => (
                            <li key={chatRoom.chatRoomId}>
                                <button onClick={() => handleRoomSelect(chatRoom.chatRoomId)}>
                                    {chatRoom.chatRoomId}
                                </button>
                            </li>
                        ))}
                    </ul>
    ) : (<p>Keine Chatrooms verfügbar</p>)
    

}


 </div>

 <button onClick={handleRoomCreate}>Create New Chat Room</button>


</div>



)


}
export default ChatSelector;