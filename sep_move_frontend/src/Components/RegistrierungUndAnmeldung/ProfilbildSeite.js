import React, { useState } from 'react';
import { profilbildHochladen } from '../../Services/NutzerService';
import { useNavigate } from 'react-router-dom';
import './ProfilbildSeite.css';

function ProfilbildSeite() {
    const [bild, setBild] = useState(null); // Für die Bildvorschau
    const [datei, setDatei] = useState(null); // Für die tatsächliche Datei
    const navigate = useNavigate();

    // Standardbild, das verwendet wird, wenn der Benutzer auf "Überspringen" klickt
    const standardBildPfad = process.env.PUBLIC_URL + '/Bilder/standardpb.PNG'; // Pfad zum Standardbild

    // Funktion zum Verarbeiten des ausgewählten Bildes
    const handleBildAuswahl = (event) => {
        const bilddatei = event.target.files[0];
        if (bilddatei) {
            setBild(URL.createObjectURL(bilddatei));
            setDatei(bilddatei); // Setze die tatsächliche Datei für das Hochladen
        }
    };

    // Funktion zum Hochladen des Bildes über den Service
    const handleUpload = async () => {
        const nutzername = localStorage.getItem('nutzername');

        if (!datei || !nutzername) {
            console.error('Kein Bild oder kein Nutzername gefunden');
            return;
        }

        try {
            const response = await profilbildHochladen(datei, nutzername);
            console.log('Bild erfolgreich hochgeladen:', response);
            navigate('/login');
        } catch (error) {
            console.error(error.message);
        }
    };

    // Funktion zum Überspringen der Bildauswahl und Hochladen des Standardbildes
    const handleUeberspringen = async () => {
        const nutzername = localStorage.getItem('nutzername');

        try {
            // Lade das Standardbild als Datei
            const standardDatei = await fetch(standardBildPfad).then(res => res.blob());
            const response = await profilbildHochladen(standardDatei, nutzername);
            console.log('Standardbild erfolgreich gesetzt:', response);
            navigate('/login');
        } catch (error) {
            console.error('Fehler beim Setzen des Standardbildes:', error);
        }
    };

    return (
        <div className="profilbild-container">
            <h1>Profilbild hochladen</h1>
            <p>Wählen Sie ein Bild aus, um es als Profilbild hochzuladen oder überspringen Sie diesen Schritt.</p>

            {/* Datei-Input */}
            <input type="file" accept="image/*" onChange={handleBildAuswahl} />

            {/* Bildvorschau */}
            {bild && (
                <div className="bild-vorschau">
                    <img src={bild} alt="Profilbild Vorschau" className="profilbild-vorschau" />
                </div>
            )}

            {/* Upload- und Überspringen-Buttons */}
            <div className="button-container">
                <button onClick={handleUpload} className="upload-button">
                    Bild hochladen
                </button>
                <button onClick={handleUeberspringen} className="skip-button">
                    Überspringen
                </button>
            </div>
        </div>
    );
}

export default ProfilbildSeite;
