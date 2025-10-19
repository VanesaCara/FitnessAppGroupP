
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Importiere useParams
import { getActivitySummary } from '../../Services/ActivityService';
import './Aktivitaetszusammenfassung.css';

const Aktivitaetszusammenfassung = () => {
    const { id } = useParams();
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState(null);
    const [isLockedIn, setIsLockedIn] = useState(true);

    useEffect(() => {
        const fetchActivitySummary = async () => {
            try {
                console.log(`Extrahierte UserID: ${id}`);
                const data = await getActivitySummary(id);
                console.log("Erhaltene Daten von der API:", data);
                setSummary(data);
            } catch (error) {
                console.error('Fehler beim Laden der Aktivitätszusammenfassung:', error);
                setError('Daten konnten nicht geladen werden.');
            }
        };

        fetchActivitySummary();
    }, [id]);

    if (error) {
        return <p>{error}</p>;
    }

    if (!summary) {
        return <p>Lade Daten...</p>;
    }

    return (
        <table className="Aktivitätszusammenfassung">
            <thead>
            <tr>
                <th className="Header">Gesamtanzahl der Aktivitäten</th>
                <th className="Header">Gesamtdauer (Stunden)</th>
                <th className="Header">Gesamtdistanz (km)</th>
                <th className="Header">Verbrannte Kalorien (kcal)</th>
                <th className="Header">Zurückgelegte Höhe (m) </th>
                <th className="Header">Durchschnittsgeschwindigkeit (km/h) </th>
                <th className="Header">Maximale Geschwindigkeit(km/h) </th>
                <th className="Header" id="protocol">Aktivitäts-Protokoll</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td className="Data">{summary.totalActivities}</td>
                <td className="Data">{summary.totalDuration.toFixed(2)}</td>
                <td className="Data">{(summary.totalDistance / 1000).toFixed(2)} </td>
                <td className="Data">{summary.totalKcal.toFixed(2)} </td>
                <td className="Data">{summary.totalElevation.toFixed(2)}</td>
                <td className="Data">{summary.averageSpeed.toFixed(2)}</td>
                <td className="Data">{summary.maxAverageSpeed.toFixed(2)}</td>
                <td className="Data" id="protocol">
                    <a href={`/activityProtocol/${localStorage.getItem('thisNutzerId')}`}>
                    <button className="acc-prot">Aktivitäts-Protokoll Anzeigen
                    </button>
                </a></td>
            </tr>
            </tbody>
        </table>
    );
};

export default Aktivitaetszusammenfassung;
