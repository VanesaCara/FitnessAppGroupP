import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { istEmailVerfuegbar, istNutzernameVerfuegbar, nutzerHinzufuegen } from "../../Services/NutzerService";
import './RegistrierungsSeite.css';

function RegistrierungsSeite() {
    const [rolle, setRolle] = useState('Nutzer');
    const [nutzername, setNutzername] = useState('');
    const [vorname, setVorname] = useState('');
    const [nachname, setNachname] = useState('');
    const [email, setEmail] = useState('');
    const [passwort, setPasswort] = useState('');
    const [passwortWiederholen, setPasswortWiederholen] = useState('');
    const [groesse, setGroesse] = useState('');
    const [gewicht, setGewicht] = useState('');
    const [geburtsdatum, setGeburtsdatum] = useState('');
    const [geschlecht, setGeschlecht] = useState('');
    const [nutzernameVerfuegbar, setNutzernameVerfuegbar] = useState(null);
    const [emailVerfuegbar, setEmailVerfuegbar] = useState(null);
    const [registrierungsFehler, setRegistrierungsFehler] = useState('');
    const [hatZfa, setHatZfa] = useState(false); // Toter Code der bleibt


    const navigate = useNavigate();

    const handleNutzernameBlur = async () => {
        try {
            const verfuegbar = await istNutzernameVerfuegbar(nutzername);
            setNutzernameVerfuegbar(verfuegbar);
        } catch (error) {
            console.error('Fehler bei der Überprüfung des Nutzernamens:', error);
        }
    };

    const handleEmailBlur = async () => {
        try {
            const verfuegbar = await istEmailVerfuegbar(email);
            setEmailVerfuegbar(verfuegbar);
        } catch (error) {
            console.error('Fehler bei der Überprüfung der E-Mail:', error);
        }
    };

    const handleRegistrierung = async () => {
        if (nutzernameVerfuegbar === false || emailVerfuegbar === false) {
            setRegistrierungsFehler('Nutzername oder E-Mail bereits vergeben.');
            return;
        }
        if (passwort !== passwortWiederholen) {
            setRegistrierungsFehler('Passwörter stimmen nicht überein.');
            return;
        }

        try {
            const neuerNutzer = {
                nutzername,
                vorname,
                nachname,
                email,
                passwort,
                istAdmin: rolle !== 'Nutzer',
                groesse: rolle === 'Nutzer' ? groesse : null,
                gewicht: rolle === 'Nutzer' ? gewicht : null,
                geburtsdatum: rolle === 'Nutzer' ? geburtsdatum : null,
                geschlecht: rolle === 'Nutzer' ? geschlecht : null,
                hatZfa //toter code muss aber bleiben wegen fehlern
            };
            await nutzerHinzufuegen(neuerNutzer);
            navigate('/profilbild');
            localStorage.setItem('nutzername', nutzername);
        } catch (error) {
            setRegistrierungsFehler('Fehler bei der Registrierung des Nutzers.');
            console.error('Fehler beim Hinzufügen des Nutzers:', error);
        }
    };

    return (
        <div className="registration-container">
            <h1 className="registration-title">Registrieren bei Sep Move</h1>
            <p className="registration-text">Bitte wählen Sie die Registrierungsart:</p>

            <select
                className="select-field"
                value={rolle}
                onChange={(event) => setRolle(event.target.value)}
            >
                <option value="Nutzer">Nutzer</option>
                <option value="Admin">Admin</option>
            </select>

            <input
                type="text"
                placeholder="Nutzername eingeben"
                value={nutzername}
                onChange={(event) => setNutzername(event.target.value)}
                onBlur={handleNutzernameBlur}
                className="input-field"
            />
            {nutzernameVerfuegbar === false && <p className="error-text">Nutzername ist bereits vergeben.</p>}

            <input
                type="text"
                placeholder="Vorname eingeben"
                value={vorname}
                onChange={(event) => setVorname(event.target.value)}
                className="input-field"
            />

            <input
                type="text"
                placeholder="Nachname eingeben"
                value={nachname}
                onChange={(event) => setNachname(event.target.value)}
                className="input-field"
            />

            <input
                type="email"
                placeholder="E-Mail eingeben"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={handleEmailBlur}
                className="input-field"
            />
            {emailVerfuegbar === false && <p className="error-text">E-Mail ist bereits vergeben.</p>}

            <input
                type="password"
                placeholder="Passwort eingeben"
                value={passwort}
                onChange={(event) => setPasswort(event.target.value)}
                className="input-field"
            />

            <input
                type="password"
                placeholder="Passwort wiederholen"
                value={passwortWiederholen}
                onChange={(event) => setPasswortWiederholen(event.target.value)}
                className="input-field"
            />
            {passwort !== passwortWiederholen && <p className="error-text">Passwörter stimmen nicht überein.</p>}

            {rolle === 'Nutzer' && (
                <>
                    <input
                        type="number"
                        placeholder="Größe in cm eingeben"
                        value={groesse}
                        onChange={(event) => setGroesse(event.target.value)}
                        className="input-field"
                    />

                    <input
                        type="number"
                        placeholder="Gewicht in kg eingeben"
                        value={gewicht}
                        onChange={(event) => setGewicht(event.target.value)}
                        className="input-field"
                    />

                    <input
                        type="date"
                        placeholder="Geburtsdatum eingeben"
                        value={geburtsdatum}
                        onChange={(event) => setGeburtsdatum(event.target.value)}
                        className="input-field"
                    />

                    <select
                        value={geschlecht}
                        onChange={(event) => setGeschlecht(event.target.value)}
                        className="select-field"
                    >
                        <option value="">Geschlecht wählen</option>
                        <option value="männlich">männlich</option>
                        <option value="weiblich">weiblich</option>
                        <option value="divers">divers</option>
                        <option value="keine Angabe">keine Angabe</option>
                    </select>
                </>
            )}



            <button onClick={handleRegistrierung} className="register-button">
                Registrieren
            </button>

            {registrierungsFehler && <p className="error-text">{registrierungsFehler}</p>}
        </div>
    );
}

export default RegistrierungsSeite;