import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChatCreator = () => {
    const [participantIds, setParticipantIds] = useState([]);//mit [] im useState wird dem state erstmal ein leerer Array zugewiesen. Danach kann 
    const userId = localStorage.getItem("nutzerId");
    const [friendslist, setFriendslist] = useState([]);
const navigate = useNavigate();
/************************************************************************************/
const toChat = (chatroomId) => {
    navigate(`/chat/${chatroomId}`);

}


/*******************************Freundesliste laden************************************************/ 
    const fetchFriends = async (userId) => {
    const response = await axios.get(`http://localhost:8080/freunde/friendsList/getAllFriends/${userId}`);
    setFriendslist(response.data);

    }
    /************************************************************************************ */
    useEffect(() => {
        const currentUserId = parseInt(localStorage.getItem('nutzerId'), 10);
         //die als nutzerId gespeicherter Wert im localstorage wird als int gespeichert und der participantsListe übergeben
        if (currentUserId) {
            setParticipantIds((prev) => [...prev, currentUserId]); 
            fetchFriends(userId);
        }
    
        
    }, []);
    /****************************************************************/
    const addParticipant = (id) => {
       setParticipantIds([...participantIds, id]);
    }
    /****************************************************************/
    const createChat = () => {
        if ( participantIds.length < 2) {
            alert("Fehler. Bitte Überprüfe die Anzahl der Teilnehmer");
            return;
        }
    
        const ChatRoomRequest = {
            
            participantIds: participantIds
        };
        console.log("Participant IDs:", participantIds);
        axios
            .post('http://localhost:8080/chatrooms/create', ChatRoomRequest)
            .then((response) => {
                console.log('ChatRoom wurde erstellt:', response.data);
                alert("Chatroom Erstellt");
                toChat(response.data.chatRoomId);
            })
            .catch((error) => {
                console.error('Fehler beim Erstellen des ChatRooms:', error);
                alert("Fehler beim Erstellen");
            });
    };

    /****************************************************************/
    const removeParticipant = (id) => {
        setParticipantIds(participantIds.filter((participantId) => participantId !== id));
    };
    /****************************************************************/
   const profile = ()=> {if (userId) {navigate(`/home/${userId}`)} else {alert.error('Kein Nutzer angemeldet!')}};


    /****************************************************************/
return (
<div>
    <h2>Erstelle deinen ChatRoom</h2>
    

{friendslist.length >0 ?
    (
    <div>


        <h3>Wähle deine Chatpartner as</h3>
        {/* Das muss mit den NutzerIds der Freunde ersetzt werden. */}
        {friendslist.map((user) => (
            <div key={user.id}>
                <label>
                    <input
                        type="checkbox"
                        value={user.id}
                        onChange={(e) =>
                            e.target.checked ? addParticipant(user.id) : removeParticipant(user.id)
                        }
                    />
                    User {user.vorname}
                </label>
            </div>
        ))}
        <button onClick={createChat}>Erstelle einen ChatRoom</button>
    </div>
    
    ) :( <div> <h4>Du hast keine Freunde</h4>
     <button onClick={profile}>Zurück zum Profil</button>
        </div>
    )
}


</div> );
};
export default ChatCreator;