import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getActivityByUser, getActivitiesOfOtherUsers } from '../../Services/ActivityService';
import './ListeDerAktivitäten.css';
import LikeButton from '../LikeButton/LikeButton';


const ListeDerAktivitäten = () => {
    const { id } = useParams(); // User-ID aus der URL abrufen
    const loggedInUserId = localStorage.getItem('nutzerId'); // Angemeldete User-ID abrufen
    const [activities, setActivities] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
    const [searchQuery, setSearchQuery] = useState('');


    useEffect(() => {
        const fetchActivities = async () => {
            try {
                let fetchedActivities;
                if (id === loggedInUserId) {
                    fetchedActivities = await getActivityByUser(id); //der user greift auf sein eigenes Profil
                } else {
                    fetchedActivities = await getActivitiesOfOtherUsers(id); // der user grift die profile der anderen
                }
                console.log('Geladene Aktivitäten:', fetchedActivities);
                setActivities(fetchedActivities);
            } catch (error) {
                console.error('Fehler beim Abrufen der Aktivitäten:', error);
            }
        };

        fetchActivities();
    }, [id, loggedInUserId]);
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredActivities = activities.filter(activity =>
        activity.activityName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });

        const sortedActivities = [...filteredActivities].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        setActivities(sortedActivities);
    };

    return (
        <div className="ListeDerAktivitätenContainer">
            <input
                type="text"
                placeholder="Nach Aktivität suchen..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="searchInput"
            />
            {/* Tabelle der Aktivitäten */}
            <table className="ListeDerAktivitäten">
                <thead>
                <tr>
                    <th className="Header" onClick={() => sortData('id')} scope="col">ID</th>
                    <th className="Header" onClick={() => sortData('activityName')} scope="col">Name</th>
                    <th className="Header" onClick={() => sortData('activityType')} scope="col">Typ</th>
                    <th className="Header" onClick={() => sortData('dateTime')} scope="col">Datum</th>
                    <th className="Header" onClick={() => sortData('time')} scope="col">Dauer (min)</th>
                    <th className="Header" onClick={() => sortData('distance')} scope="col">Distanz (m)</th>
                    <th className="Header" onClick={() => sortData('averageSpeed')}
                        scope="col">Durchschnittsgeschwindigkeit (km/h)
                    </th>
                    <th className="Header" onClick={() => sortData('elevation')} scope="col">Höhe (m)</th>
                    <th className="Header" onClick={() => sortData('kcal')} scope="col">Kalorien (kcal)</th>
                    <th className="Header" scope="col">Kartenvisualisierung</th>
                    <th className="Header" scope="col">Höhenvisualisierung</th>
                    <th className="Header" scope="col">Aktivitätsfotos</th>
                    <th className="Header" scope="col">Kommentare</th>

                    <th className="Header" scope="col">Like</th>
                </tr>
                </thead>
                <tbody>
                {filteredActivities.length > 0 ? (
                    filteredActivities.map((activity) => (
                        <tr key={activity.id}>
                            <a href={`http://localhost:3000/activitystatistics/${activity.id}`} className="Data">
                                {activity.id}
                            </a>
                            <td className="Data">{activity.activityName}</td>
                            <td className="Data">{activity.activityType}</td>
                            <td className="Data">{new Date(activity.dateTime).toLocaleDateString()}</td>
                            <td className="Data">{(activity.time / 60).toFixed(2)}</td>
                            <td className="Data">{activity.distance.toFixed(2)}</td>
                            <td className="Data">{activity.averageSpeed.toFixed(2)}</td>
                            <td className="Data">{activity.elevation.toFixed(2)}</td>
                            <td className="Data">{activity.kcal.toFixed(2)}</td>
                            <td className="Data">
                                <a href={`/activity/${activity.id}`}>
                                    <button className="karte-button">Karte anzeigen
                                    </button>
                                </a>
                            </td>
                            <td className="Data">
                                <a href={`/HeightVisual/${activity.id}`}>
                                    <button className="height-button">Graph anzeigen
                                    </button>
                                </a>
                            </td>
                    <td className="Data">
                        <a href={`/activityPhotos/${activity.id}`}>
                            <button className="foto-button">Fotos hinzufügen
                            </button>
                        </a>
                    </td>

                    <td className="Data">
                            <a href={`/comment/${activity.id}`}>
                                <button className="comment-button">Kommentare
                                </button>
                            </a>



                    </td>


                            <td className="Data">
                                <LikeButton activityId={activity.id} />
                            </td> 
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="9" className="Data">Keine Aktivitäten gefunden.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ListeDerAktivitäten;
