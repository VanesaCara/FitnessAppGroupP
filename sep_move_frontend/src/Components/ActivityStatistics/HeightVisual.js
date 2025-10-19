import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import {useParams} from "react-router-dom";
import "./HeightVisual.css";

const HeightVisual = () => {
    const [data, setData] = useState([]);
    const {id} = useParams();
    const [activity, setActivity] = useState("");
    const [activityLikes, setActivityLikes] = useState("");
    const thisNutzerId = localStorage.getItem('thisNutzerId');

    useEffect(() => {
        fetch(`http://localhost:8080/activities/getActivity/${id}`)
            .then((response => response.json()))
            .then(type => setActivity(type))
            .catch(error => console.error("Fehler beim Activity Fetch :-:-(", error))
    }, [id]);

    useEffect(() => {
        fetch(`http://localhost:8080/likes/${id}/likeAmount`)
            .then(response => response.text())
            .then(type => setActivityLikes(type))
            .catch(error => console.error("Fehler beim abruf des aktivitätstypen:", error));
    }, [id]);

    useEffect( () => {
        fetch(`http://localhost:8080/ActivityStatistics/${id}/heightVisual`)
            .then((response) => response.json())
            .then((data) => setData(data))
            .catch((error) => console.error("Error bei Graph fetch rahhh", error));
    }, [id]);



    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p><strong>Aktivitätsname:</strong> {activity.activityName}</p>
                    <p><strong>Typ:</strong> {activity.activityType}</p>
                    <p><strong>Gesamtdauer:</strong> {(activity.duration / 60).toFixed(2)} min</p>
                    <p><strong>Gesamtdistanz:</strong>{(activity.distance).toFixed(2)} m</p>
                    <p><strong>DurchschnittsGeschwindigkeit:</strong>{(activity.averageSpeed).toFixed(2)} Km/h</p>
                    <p><strong>Gesamthöhenmeter:</strong>{(activity.elevation).toFixed(2)} m</p>
                    <p><strong>Verbrannte Kalorien:</strong>{(activity.kcal).toFixed(2)} Kcal</p>
                    <p><strong>Likes:</strong> {activityLikes}</p>
                </div>
            );
        }
        return null;
    };


    return (
        <div>
            <h1 className="Name" >{activity.activityName}</h1>
            <h1 className="Date">{activity.date}</h1>
            <LineChart
                width={1000}
                height={800}
                data={data}
                margin={{top: 20, right: 30, left: 20, bottom: 5}}
            >
                <CartesianGrid strokeDasharray="5 5"/>
                <XAxis
                    dataKey="x" label={{ value: "Zeit(min)", position: "insideBottom", offset: -5}} tick={''}
                />
                <YAxis dataKey="y" label={{ value: "Höhenmeter (m)", angle: -90, position: "insideLeft" }} />
                <Tooltip
                    content={<CustomTooltip />}
                />
                <Legend/>
                <Line name={activity.activityName} dataKey="y" stroke="#8884d8" dot={false}/>
            </LineChart>
            <a href={`/home/${thisNutzerId}`}>
                <button className="back-button">Zurück zum Profil
                </button>
            </a>
        </div>

    );
};

export default HeightVisual;
