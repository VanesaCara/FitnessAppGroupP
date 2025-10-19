import React, { useEffect, useState } from "react";
import {
    fetchFriends, fetchFriendRequests, acceptFriendRequest,
    declineFriendRequest, removeFriend, toggleFriendListPrivacy,
} from '../../Services/NutzerService';
import Navbar from "./Navbar";
import './FreundeSeite.css';
import { Link } from 'react-router-dom';

    const FreundeSeite = () => {
        const [friends, setFriends] = useState([]); //für die Liste aus Freunden
        const [friendRequests, setFriendRequests] = useState([]); // für die erhaltenen Freundschaftsanfragen
        const [isPrivate, setIsPrivate] = useState(false);   //für die Privatsphäre der Freundesliste (öffentlich/privat)

        //Für freunde suchen:
        const [searchQuery, setSearchQuery] = useState(''); // Speichert den Suchbegriff
        const [filteredFriends, setFilteredFriends] = useState([]); // Speichert gefilterte Ergebnisse

        const userId = localStorage.getItem('nutzerId');  //User-ID des aktuell eingeloggten Benutzers


        // Daten laden: Freundschaftsanfragen und Freunde
        useEffect(() => {
            const fetchData = async () => {
                try {
                    // Lade Freundesliste
                    const friendsList = await fetchFriends(userId);
                    setFriends(friendsList);
                    setFilteredFriends(friendsList); // Standardmäßig alle Freunde anzeigen

                    // Lade Freundschaftsanfragen
                    const requests = await fetchFriendRequests(userId);
                    setFriendRequests(requests);
                } catch (error) {
                    console.error("Fehler beim Laden der Daten:", error);
                }
            };

            fetchData();
        }, [userId]); //Läuft immer wenn die userId sich ändert userId = aktueller Nutzer

        //Privatsphäre der Freundesliste
        const handlePrivacyToggle = async () => {
            try {
                //durch !isPrivate ändert sich der Zustand beim klick immer ins Gegenteilige
                await toggleFriendListPrivacy(userId, !isPrivate);
                setIsPrivate(!isPrivate);
            } catch (error) {
                console.error('Fehler beim Ändern der Privatsphäre:', error);
            }
        };

        // Handler für Freundschaftsanfragen annehmen
        const handleAcceptRequest = async (senderId) => {
            try {
                await acceptFriendRequest(userId, senderId);
                // prevState = aktuelle Liste der erhaltenen Anfragen bevor es verändert wird
                // req = die Freundschaftsanfrage in der Liste
                // filter = JS-Methode, erstellt ein neues Array Es enthält nur die Elemente, die die angegebene Bedingung erfüllen.
                setFriendRequests((prevState) => prevState.filter((request) => request.id !== senderId));
                // req.id = id des Nutzers der die Anfrage schickt und senderId = ebenfalls  Id des Nutzers
                /* prev.filter((req) => req.id !== senderId heißt:
                die Liste der Anfragen (prev.filter(req) besteht aus NutzerId's die nicht gleich ist wie die aktuelle
                mit anderen Worten: nach annahme der Freundschaftsanfrage wird die Liste aktualisiert und die anfrage verschwindet*/
            } catch (error) {
                console.error('Fehler beim Akzeptieren der Anfrage:', error);
            }
        };

        // Handler für Freundschaftsanfragen ablehnen
        const handleDeclineRequest = async (senderId) => {
            try {
                await declineFriendRequest(userId, senderId);
                // Entfernt die abgelehnte Anfrage aus der Liste
                setFriendRequests((prevState) => prevState.filter((request) => request.id !== senderId));
            } catch (error) {
                console.error('Fehler beim Ablehnen der Anfrage:', error);
            }
        };

        // Freund entfernen
        const handleRemoveFriend = async (friendId) => {
            try{
                await removeFriend(userId, friendId); // userID = eingeloggter Nutzer, friendId = Freund der entfernt wird
                setFriends((prevState) =>
                    prevState.filter((friend) => friend.id !== friendId)); // filter erstellt neues Array -> friend mit nutzern ohne die gegebene friendId

                setFilteredFriends((prevState) =>
                    prevState.filter((friend) => friend.id !== friendId) //Damit entfernte Freunde bei der Suche nicht angezeigt werden
                );
            } catch (error) {
                console.error('Fehler beim Entfernen des Freundes:', error);
            }
        };
        // Freunde Suchen
        const handleSearchChange = (event) => {
            const value = event.target.value.toLowerCase(); // Konvertiert zu Kleinbuchstaben
            setSearchQuery(value); //dynamische Suchanfrage

            // Filtert die Freunde, deren Nutzername, Vorname oder Nachname den Suchbegriff (bzw die Buchstaben) enthält
            const filtered = friends.filter(
                (friend) =>
                    friend.nutzername.toLowerCase().includes(value) ||
                    friend.vorname.toLowerCase().includes(value) ||
                    friend.nachname.toLowerCase().includes(value)
            );
            setFilteredFriends(filtered); // Aktualisiert die gefilterten Freunde
        };

        //Renderfunktion der Freundesliste (dynamisches Anzeigen wenn getippt wird)
        const renderFriendList = (friendList) => {
            return friendList.length > 0 ? (
                friendList.map((friend) => (
                    <div key={friend.id} className="friend-item">
                        {/* Nutzername als anklickbarer Link */}
                    <Link to={`/home/${friend.id}`}>
                        {/* vorname und nachname ggf. entfernen damit in der Suche nur nutzername ist (optional)*/}
                        {friend.nutzername} ({friend.vorname} {friend.nachname})
                    </Link>
                        <button
                            className="btn btn-danger btn-sm remove-friend"
                            onClick={() => handleRemoveFriend(friend.id)}
                        >
                            Entfernen
                        </button>
                    </div>
                ))
            ) : (
                <p>Keine Freunde gefunden.</p>
            );
        };

        return (
            <div className="freunde-seite">
                <Navbar />
                <div className="content">
                    {/* Überschrift */}
                    <h1>Meine Freundesliste</h1>

                    {/* Privatsphäre-Button */}
                    <button className="btn btn-secondary privacy-toggle" onClick={handlePrivacyToggle}>
                        {isPrivate ? 'Freundesliste öffentlich stellen' : 'Freundesliste privat stellen'}
                    </button>

                    {/* Freundesliste */}
                    <div className="friends-list">
                        <h2>Freunde</h2>

                        {/* Suchleiste */}
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Freunde suchen..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        {/*Freundesliste wird komplett gezeigt, außer man beginnt in die Suchleiste zu schreiben (filteredFriends*/}
                        {renderFriendList(searchQuery === "" ? friends : filteredFriends)}
                    </div>

                    {/* Freundschaftsanfragen*/}
                    <div className="friend-requests">
                        <h2>Freundschaftsanfragen</h2>
                        {friendRequests.length > 0 ? (
                            friendRequests.map((request) => (
                                <div key={request.id} className="request-item">
                                    <span>{request.nutzername} ({request.vorname} {request.nachname})</span>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleAcceptRequest(request.id)}
                                    >
                                        Annehmen
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeclineRequest(request.id)}
                                    >
                                        Ablehnen
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>Keine Freundschaftsanfragen.</p>
                        )}
                    </div>
                </div>
            </div>
        );

    }

    export default FreundeSeite;