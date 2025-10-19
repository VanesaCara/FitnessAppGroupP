import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {getNutzerById, getProfilbildById, fetchFriendsForProfile} from '../../Services/NutzerService';
import Navbar from './Navbar';
import Aktivitaetszusammenfassung from "./Aktivitaetszusammenfassung";
import ListeDerAktivitäten from "./ListeDerAktivitäten";
import Erfolge from "./Erfolge";

function BenutzerProfil() {
    const { id } = useParams();
    const [nutzer, setNutzer] = useState(null);
    const [error, setError] = useState(''); // funktion und dependency
    const [profilBildUrl, setProfilBildUrl] = useState(null);
    const navigate = useNavigate();

    // Neu hinzugefügte States um Freunde im Benutzerprofil anzeigen zu können
    const [friendList, setFriendList] = useState([]); // Speichert die Freundesliste des Nutzers
    const [isFriendListPrivate, setIsFriendListPrivate] = useState(false); // Zeigt an, ob die Freundesliste privat ist

    const handleBackToWelcome = () => {
        navigate('/');
    };
    useEffect(() => { //side effects, hier: user holen
        const fetchNutzer = async () => {
            try {
                const response = await getNutzerById(id); // daten abrufen, user by id
                setNutzer(response); // Nutzerdaten setzen
                localStorage.setItem("thisNutzerId", id);

                const bildUrl = await getProfilbildById(id);
                setProfilBildUrl(bildUrl);

                //Freundesliste des Benutzers abrufen
                const loggedInUserId = localStorage.getItem("nutzerId");
                const friendsResponse = await fetchFriendsForProfile(id, loggedInUserId); // Neue Funktion
                setFriendList(friendsResponse);

            } catch (error) {
                if (error.response?.status === 403) {
                    setIsFriendListPrivate(true); // Freundesliste ist privat
                }else if (error.response?.status === 404) {
                    setError('Freundesliste nicht gefunden.'); // Freundesliste existiert nicht
                } else {
                    setError('Fehler beim Laden der Nutzerdaten.'); // Fehler setzen (Allgemein)
                }
                console.error('Fehler beim Laden der Nutzerdaten:', error);
            }
        };

        fetchNutzer();
    }, [id]);

    return (
        <React.Fragment>
            <Navbar />
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {nutzer ? ( // Überprüfe, ob nutzer existiert
                    <>
                        <h1>Profil von {nutzer.nutzername}</h1>
                        {nutzer.profilBildPfad && (
                            <img
                                src={profilBildUrl}
                                alt="Profilbild"
                                style={{width: '150px', height: '150px', borderRadius: '50%', marginBottom: '20px'}}
                            />
                        )}
                        <p><strong>Rolle:</strong> {nutzer.istAdmin ? 'Administrator' : 'Regulärer Benutzer'}</p>
                        <p><strong>Vorname:</strong> {nutzer.vorname}</p>
                        <p><strong>Nachname:</strong> {nutzer.nachname}</p>
                        <p><strong>E-Mail:</strong> {nutzer.email}</p>

                        {!nutzer.istAdmin && (
                            <>
                                <p><strong>Geburtsdatum:</strong> {new Date(nutzer.geburtsdatum).toLocaleDateString()}
                                </p>
                                <p><strong>Körpergröße:</strong> {nutzer.groesse} cm</p>
                                <p><strong>Gewicht:</strong> {nutzer.gewicht} kg</p>
                                <p><strong>Geschlecht:</strong> {nutzer.geschlecht}</p>
                                <Erfolge userId={id} />
                                {/* Aktivitäten nur für reguläre nutzer */}
                                <h1> Aktivitätszusammenfassung </h1>
                                <Aktivitaetszusammenfassung/>
                                <h1> Liste der Aktivitäten </h1>
                                <ListeDerAktivitäten/>
                            </>

                        )}


                        {/* Freundesliste */}
                        {!nutzer.istAdmin && (
                            <div style={{marginTop: '30px'}}>
                                {isFriendListPrivate ? (
                                    <p style={{color: 'red'}}>Die Freundesliste dieses Nutzers ist privat.</p>
                                ) : (
                                    <>
                                        <h2>Freundesliste</h2>
                                        {friendList.length > 0 ? (
                                            friendList.map((friend) => (
                                                <div key={friend.id} className="friend-item">
                                                    {friend.nutzername} ({friend.vorname} {friend.nachname})
                                                </div>
                                            ))
                                        ) : (
                                            <p>Keine Freunde gefunden.</p>
                                        )}
                                    </>
                                )}
                            </div>
                        )}

                        <button
                            style={{marginTop: '20px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer'}}
                            onClick={handleBackToWelcome}
                        >
                            Zur Willkommensseite
                        </button>
                    </>
                ) : null}
            </div>
        </React.Fragment>
    );
}

export default BenutzerProfil;