import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifiziereZfa, sendeZfaCodeErneut } from '../../Services/NutzerService';
import './ZweiFaktorSeite.css';

function ZweiFaktorSeite() {
    const [zfaCode, setZfaCode] = useState('');
    const [fehlermeldung, setFehlermeldung] = useState('');
    const navigate = useNavigate();

    const handleVerifiziereZfa = async () => {
        const nutzername = localStorage.getItem('nutzername');
        try {
            await verifiziereZfa(nutzername, zfaCode);
            const nutzerId = localStorage.getItem('nutzerId');
            navigate(`/home/${nutzerId}`);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setFehlermeldung('Ungültiger oder abgelaufener 2FA-Code.');
            } else {
                setFehlermeldung('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
            }
        }
    };

    const handleCodeErneutSenden = async () => {
        const nutzername = localStorage.getItem('nutzername');
        try {
            await sendeZfaCodeErneut(nutzername);
            alert('Ein neuer 2FA-Code wurde an Ihre E-Mail gesendet.');
        } catch (error) {
            setFehlermeldung('Fehler beim erneuten Senden des 2FA-Codes. Bitte versuchen Sie es später noch einmal.');
        }
    };

    return (
        <div className="two-factor-container">
            <h1 className="two-factor-title">Zwei-Faktor-Authentifizierung</h1>
            <p className="two-factor-text">Bitte geben Sie den 2FA-Code ein, der Ihnen per E-Mail zugesendet wurde.</p>

            <input
                type="text"
                placeholder="2FA-Code eingeben"
                value={zfaCode}
                onChange={(e) => setZfaCode(e.target.value)}
                className="two-factor-input"
            />

            <div className="button-container">
                <button
                    onClick={handleVerifiziereZfa}
                    className="two-factor-button confirm-button"
                >
                    Bestätigen
                </button>
                <button
                    onClick={handleCodeErneutSenden}
                    className="two-factor-button resend-button"
                >
                    Erneut senden
                </button>
            </div>

            {fehlermeldung && <p className="error-message">{fehlermeldung}</p>}
        </div>
    );
}

export default ZweiFaktorSeite;