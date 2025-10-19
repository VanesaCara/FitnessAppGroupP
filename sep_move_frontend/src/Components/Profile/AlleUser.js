import React, { useEffect, useState } from 'react';
import {sendFriendRequest, getAlleNutzer } from '../../Services/NutzerService';
import { Link } from 'react-router-dom';
import Navbar from "./Navbar";

function AlleUser() {
    const [nutzerListe, setNutzerListe] = useState([]);
    const [filteredNutzerListe, setFilteredNutzerListe] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');

    //Freund adden
    const [requestStatus, setRequestStatus] = useState(null); // Für Feedback nach dem Senden einer Anfrage

    useEffect(() => {
        const fetchAlleNutzer = async () => {
            try {
                const response = await getAlleNutzer();
                const loggedUserId = localStorage.getItem('nutzerId'); // in local storage speichern
                const gefilterteNutzer = response.filter(nutzer => nutzer.id !== parseInt(loggedUserId));
                setNutzerListe(gefilterteNutzer);
                setFilteredNutzerListe(gefilterteNutzer);
            } catch (error) {
                console.error('Fehler beim Abrufen der Nutzer:', error);
                setError('Fehler beim Abrufen der Nutzer.');
            }
        };

        fetchAlleNutzer();
    }, []);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchQuery(value);
        if (value === '') {
            setFilteredNutzerListe(nutzerListe);
        } else {
            const filtered = nutzerListe.filter(nutzer =>
                nutzer.nutzername.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredNutzerListe(filtered);
        }
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const filtered = nutzerListe.filter(nutzer =>
            nutzer.nutzername.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredNutzerListe(filtered);
    };

    //Freunde
    const handleSendFriendRequest = async (friendEmail, friendName) => {
        try {
            const senderId = localStorage.getItem('nutzerId'); // Die ID des eingeloggten Nutzers
            await sendFriendRequest(friendEmail, senderId); // Backend-Call -> Anfrage senden
            // [FriendEmail mit Name später austauschen ${friendName}]
            setRequestStatus(`Anfrage an ${friendName} (${friendEmail}) erfolgreich gesendet!`);
        } catch (error) {
            console.error('Fehler beim Senden der Freundschaftsanfrage:', error);
            setRequestStatus(`Fehler: Anfrage an ${friendName} konnte nicht gesendet werden.`);
        }
    };


    return (
        <React.Fragment>
            <Navbar />
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <h1>Alle Nutzer</h1>
                <form className="d-flex" role="search" onSubmit={handleSearchSubmit}>
                    <input
                        className="form-control me-2"
                        type="search"
                        placeholder="Nach Usern suchen"
                        aria-label="Search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                    <button className="btn btn-outline-success" type="submit">Search</button>
                </form>
                <div>
                    {filteredNutzerListe.length > 0 ? (
                        filteredNutzerListe.map((nutzer) => (
                            <div key={nutzer.id}>
                                <Link to={`/home/${nutzer.id}`}>
                                    {nutzer.nutzername + " "}
                                </Link>
                                {nutzer.vorname} {nutzer.nachname}
                                {/* Button nur anzeigen, wenn der Nutzer kein Admin ist */}
                                {!nutzer.istAdmin && (
                                <button
                                    style={{ marginLeft: '10px' }}
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleSendFriendRequest(nutzer.email, nutzer.nutzername)} //Freund adden: Email des Nutzers verwenden maybe später auch name
                                    >
                                    Freund hinzufügen
                                </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>Keine Nutzer gefunden.</p>
                    )}
                </div>
                {/* Für Meldungen wie z.B, dass der User geadded wurde etc.*/}
                {requestStatus && (
                    <p style={{ color: requestStatus.includes('Fehler') ? 'red' : 'green' }}>
                        {requestStatus}
                    </p>
                )}

            </div>
        </React.Fragment>
    );
}

export default AlleUser;
