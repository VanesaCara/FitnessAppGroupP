import React, {useEffect, useState} from 'react';
import PointSelector from './PointSelector';
import CalculateButton from "./CalculateButton";
import './ActivityStatistics.css'
import {useParams} from "react-router-dom";

function App() {

    const [options, setOptions] = useState([]);
    const [selectedOption1, setSelectedOption1] = useState('');
    const [selectedOption2, setSelectedOption2] = useState('');
    const [result, setResult] = useState(null);
    const [activityName, setActivityName] = useState("");
    const [activityType, setActivityType] = useState("");
    const [activityDate, setActivityDate] = useState('');
    const {id} = useParams();


    useEffect(() => {
        const getSize = async () => {
            try {
                const response = await fetch(`http://localhost:8080/ActivityStatistics/${id}/getSize`);
                const trackSize = await response.json();
                const optionsArray = Array.from({ length: trackSize }, (_, index) => `TrackPoint ${index + 1}`);
                setOptions(optionsArray);
            } catch (error) {
                console.error('Fehler beim Abrufen der TrackPoint-Anzahl:', error);
            }
        };
        getSize();
    }, [id]);


    useEffect(() => {
        fetch(`http://localhost:8080/ActivityStatistics/${id}/getName`)
            .then(response => response.text())
            .then(name => setActivityName(name))
            .catch(error => console.error("Fehler beim abruf des aktivitätsnamen:", error));
    }, [id]);

    useEffect(() => {
        fetch(`http://localhost:8080/ActivityStatistics/${id}/getType`)
            .then(response => response.text())
            .then(type => setActivityType(type))
            .catch(error => console.error("Fehler beim abruf des aktivitätstypen:", error));
    }, [id]);

    useEffect(() => {
        fetch(`http://localhost:8080/ActivityStatistics/${id}/getDate`)
            .then(response => response.text())
            .then(date => setActivityDate(date))
            .catch(error => console.error("Fehler beim abruf des datums:", error));
    }, [id]);



    const handleSelectChange = (id, value) => {
        if (id === 1) {
            setSelectedOption1(value);
        } else if (id === 2) {
            setSelectedOption2(value);
        }
    };

    const handleCalculate = async () => {
        if (!selectedOption1 || !selectedOption2) {
            setResult('Bitte wähle zwei TrackPoints aus.');
            return;
        }

        const point1 = parseInt(selectedOption1.replace('TrackPoint ', ''), 10);
        const point2 = parseInt(selectedOption2.replace('TrackPoint ', ''), 10);

        if (point2 <= point1) {
            setResult('⚠️ Bitte wähle gültige Trackpoints. Trackpoint 1 muss vor Trackpoint 2 sein.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/ActivityStatistics/${id}/calculate?point1=${point1}&point2=${point2}`);
            if (!response.ok) {
                throw new Error('Fehler bei der API-Anfrage.');

            }
            const data = await response.json();


            setResult( `Distanz: ${data.distance} m\n` +
                `zeit: ${data.time} s\n` +
                `Geschwindigkeit: ${data.kmh} Km/h\n` +
                `Höhenmeter: ${data.elevation} m\n` +
                `Verbrannte Kallorien: ${data.kcal} Kcal`)
        } catch (error) {
            console.error('Fehler bei der Berechnung:', error);
            setResult('Fehler bei der Berechnung.');
        }
    };

    return (
        <div className="app-container">
            <h1 className="app-title">Aktivitäts Statistik:</h1>
            <h2 className="app-subtitle">Name: {activityName}</h2>
            <h2 className="app-subtitle">Typ: {activityType}</h2>
            <h2 className="app-subtitle">Datum: {activityDate}</h2>
            <div className="point-selector-container">
                <PointSelector
                    id={1}
                    options={options}
                    selectedOption={selectedOption1}
                    onSelectChange={handleSelectChange}
                    className="point-selector"
                />
                <PointSelector
                    id={2}
                    options={options}
                    selectedOption={selectedOption2}
                    onSelectChange={handleSelectChange}
                    className="point-selector"
                />
            </div>
            <CalculateButton onClick={handleCalculate} className="calculate-button" />
            {result && (
                <pre className="result-display">
                {result}
            </pre>
            )}
        </div>
    );
}

export default App;
