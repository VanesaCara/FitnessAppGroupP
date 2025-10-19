import React, {useEffect,useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import {getNutzerById} from "../../Services/NutzerService"; // Backend-Aufruf für Nutzerinformationen

const Navbar = () => {
    const navigate = useNavigate();
    // Adminstatus prüfen und je nach Status den Freunde Button ausblenden
    const [isAdmin, setIsAdmin] = useState(false); // Zustand für Adminstatus

    // Adminstatus des eingeloggten Nutzers abrufen
    useEffect(() => {
        const fetchUserData = async () => {
            const nutzerId = localStorage.getItem('nutzerId'); // ID des eingeloggten Nutzers
            if (nutzerId) {
                try {
                    const user = await getNutzerById(nutzerId); // Nutzerinformationen abrufen
                    setIsAdmin(user.istAdmin); // Adminstatus setzen
                } catch (error) {
                    console.error("Fehler beim Abrufen des Adminstatus:", error);
                }
            }
        };

        fetchUserData();
    }, []);

    const alleUser = () => {
        console.log("Navigiere zu /alleuser");
        navigate('/alleuser');
    };
    const activitySeite = () => {
        navigate('/activity');
    };

    const meinProfil = () => {
        const nutzerId = localStorage.getItem('nutzerId'); // userId aus localStorage extrahieren
        if (nutzerId) {
            navigate(`/home/${nutzerId}`); // Navigiere zum Profil des angemeldeten Nutzers
        } else {
            console.error('Kein Nutzer angemeldet!');
        }
    };

    const leaderboard = () => {
        navigate('/leaderboard')
    };

    const freundeSeite = () => {
        console.log("Navigiere zu (/freunde)");
        navigate('/freunde');
    };

    const chat =() => {
        navigate(`/selectChat`);
    };

    const socialFeedSeite = () => {
        navigate('/socialfeed'); // Navigiere zur SocialFeedSeite
    };

    return (
        <nav className="navbar bg-body-tertiary">
            <div className="container-fluid">
                <button type="button" className="btn btn-primary" onClick={alleUser}>Alle User</button>
                <button type="button" className="btn btn-primary" onClick={meinProfil}>Mein Profil</button>
                <button type="button" className="btn btn-primary" onClick={activitySeite}>Aktivität Erstellen</button>
                <button type="button" className="btn btn-primary" onClick={leaderboard}>Leaderboard</button>
                {!isAdmin && (  // Button "Freunde" nur anzeigen, wenn der Nutzer kein Admin ist
                    <button type="button" className="btn btn-primary" onClick={freundeSeite}>Freunde</button>
                )}
                <button type="chat" className="btn btn-primary" onClick={chat}>Chat</button>
                <button type="button" className="btn btn-primary" onClick={socialFeedSeite}>Social Feed</button>
            </div>
        </nav>
    );
};

export default Navbar;


