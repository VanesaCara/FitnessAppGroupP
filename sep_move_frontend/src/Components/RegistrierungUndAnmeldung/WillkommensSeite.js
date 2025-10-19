import '../../index.css';
import './WillkommensSeite.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';


function WillkommensSeite() {
    const navigate = useNavigate();

    return (
        <div className="welcome-container">
            <h1 className="welcome-title">Willkommen bei Sep Move!</h1>
            <p className="welcome-text">Bitte wählen Sie eine Option aus:</p>
            <div className="button-container">
                <button onClick={() => navigate('/login')} className="welcome-button login-button">
                    Anmelden
                </button>
                <button onClick={() => navigate('/register')} className="register-button">
                    Registrieren
                </button>
            </div>
        </div>
    );
}

export default WillkommensSeite;
