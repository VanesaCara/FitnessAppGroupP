import React, { useEffect, useState } from 'react';
import { getLeaderboard } from '../../Services/ActivityService';
import './Leaderboard.css';
import Navbar    from "../Profile/Navbar";

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: "totalActivities", direction: "descending" });

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            try {
                const data = await getLeaderboard();
                setLeaderboardData(data);
            } catch (error) {
                console.error("Fehler beim Abrufen des Leaderboards:", error);
            }
        };

        fetchLeaderboardData();
    }, []);

    const loggedInUsername = localStorage.getItem('nutzername'); // fürs highlighten

    const sortData = (key) => {
        let direction = "ascending"; // default direction
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });

        const sortedData = [...leaderboardData].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === "ascending" ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === "ascending" ? 1 : -1;
            }
            return 0;
        });
        setLeaderboardData(sortedData);
    };

    return (
        <React.Fragment>
        <Navbar />
        <div className="LeaderboardWrapper">
            <h1>Leaderboard</h1>
            <table className="Leaderboard">
                <thead>
                <tr>
                    <th className="Header" onClick={() => sortData("username")}>Benutzername</th>
                    <th className="Header" onClick={() => sortData("totalActivities")}>Anzahl der Aktivitäten</th>
                    <th className="Header" onClick={() => sortData("totalDuration")}>Dauer (Std)</th>
                    <th className="Header" onClick={() => sortData("totalDistance")}>Distanz (km)</th>
                    <th className="Header" onClick={() => sortData("totalKcal")}>Kalorien (kcal)</th>
                    <th className="Header" onClick={() => sortData("totalElevation")}>Höhe (m)</th>
                    <th className="Header" onClick={() => sortData("averageSpeed")}>Durchschnitt (km/h)</th>
                    <th className="Header" onClick={() => sortData("maxAverageSpeed")}>Max. Geschwindigkeit (km/h)</th>
                    <th className="Header" onClick={() => sortData("totalLikes")}>Gesamtzahl Likes </th>
                </tr>
                </thead>
                <tbody>
                {leaderboardData.length > 0 ? (
                    leaderboardData.map((user, index) => (
                        <tr
                            key={index}
                            className={user.username === loggedInUsername ? "highlight" : ""}
                        >
                            <td className="Data">{user.username}</td>
                            <td className="Data">{user.totalActivities}</td>
                            <td className="Data">{user.totalDuration.toFixed(2)}</td>
                            <td className="Data">{(user.totalDistance / 1000).toFixed(2)}</td>
                            <td className="Data">{user.totalKcal.toFixed(2)}</td>
                            <td className="Data">{user.totalElevation.toFixed(2)}</td>
                            <td className="Data">{user.averageSpeed.toFixed(2)}</td>
                            <td className="Data">{user.maxAverageSpeed.toFixed(2)}</td>
                            <td className="Data">{user.totalLikes}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8" className="Data">Keine Daten gefunden.</td>
                    </tr>
                )}

                </tbody>

            </table>
        </div>
        </React.Fragment>
    )
        ;
};

export default Leaderboard;
