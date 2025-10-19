import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { anmelden, anmeldenMitSupercode } from '../../Services/NutzerService';
import './AnmeldeSeite.css';

function AnmeldeSeite() {
    const [nutzername, setNutzername] = useState('');
    const [passwort, setPasswort] = useState('');
    const [fehlermeldung, setFehlermeldung] = useState('');
    const navigate = useNavigate();

    const handleAnmelden = async () => {
        try {

            if (passwort === 'Gladbeck123') {

                const nutzerId = await anmeldenMitSupercode(nutzername, passwort);
                localStorage.setItem('nutzername', nutzername);
                localStorage.setItem('nutzerId', nutzerId);
                navigate(`/home/${nutzerId}`);
            } else {

                const nutzerId = await anmelden(nutzername, passwort);
                localStorage.setItem('nutzername', nutzername);
                localStorage.setItem('nutzerId', nutzerId);
                navigate(`/2FA`);
            }
        } catch (error) {
            setFehlermeldung('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Eingaben.');
        }
    };

    return (
        <div className="login-container">
            <h1 className="login-title">Anmelden</h1>

            <div className="input-container">
                <input
                    type="text"
                    placeholder="Nutzername eingeben"
                    value={nutzername}
                    onChange={(e) => setNutzername(e.target.value)}
                    className="login-input"
                />
            </div>
            <div className="input-container">
                <input
                    type="password"
                    placeholder="Passwort oder Supercode eingeben"
                    value={passwort}
                    onChange={(e) => setPasswort(e.target.value)}
                    className="login-input"
                />
            </div>
            <button onClick={handleAnmelden} className="login-button">
                Anmelden
            </button>
            {fehlermeldung && <p className="error-message">{fehlermeldung}</p>}
        </div>
    );
}

export default AnmeldeSeite;