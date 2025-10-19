import React, { useState, useEffect } from "react";
import { getSocialFeed, getSocialFeedAdmin, isAdmin } from "../../Services/NutzerService";
import Navbar from './Navbar';
import LikeButton from "../LikeButton/LikeButton";
import { Link } from 'react-router-dom';
import "./SocialFeedSeite.css"

const SocialFeedSeite = () => {
    const [activities, setActivities] = useState([]);
  //  const [adminStatus, setAdminStatus] = useState(false); //Redundant weil adminStatus nie verwendet wurde

    useEffect(() => {
    const fetchSocialFeed = async () => {
        try {
            const nutzerId = localStorage.getItem('nutzerId'); // Aktueller Nutzer
            if (!nutzerId) {
                throw new Error('Nutzer-ID nicht gefunden');
            }

            // Admin-Status prüfen
            const isUserAdmin = await isAdmin(nutzerId);
           // setAdminStatus(isUserAdmin); // ebenso redundant

            // Social Feed abrufen und unterscheiden, ob Admin oder regulärer Nutzer
            const feedData = isUserAdmin
                ? await getSocialFeedAdmin(nutzerId)
                : await getSocialFeed(nutzerId);

            //Sortierung des Feeds nach der neusten Aktivität oben
            const sortedFeedData = feedData.sort((a, b) => b.id - a.id);
            setActivities(sortedFeedData);
        } catch (error) {
            console.error('Fehler beim Abrufen des Social Feeds:', error);
        }
    };
    fetchSocialFeed();
}, []);

    return (
        <React.Fragment>
            <Navbar />
            <div className="socialfeed-container">
                <h1>Social Feed</h1>
                <p>Werfen Sie einen Blick auf die neusten Aktivitäten anderer Nutzer!</p>
                <div className="activity-list">
                    {/* Überprüfen, ob Aktivitäten existieren */}
                    {activities.length > 0 ? (
                        activities.map((activity) => (
                            <div
                                key={activity.id}
                                className="activity-card"
                                data-art={activity.art} // mit data-art ist die farbliche Gestaltung in der css datei
                            >
                                <h3>{activity.name}</h3>
                                <p>Erstellt von: {activity.nutzername}</p>
                                <p>Typ: {activity.type}</p>
                                <p>Distanz: {activity.distance} km</p>
                                <p>Dauer: {activity.time} Minuten</p>
                                <p>Kcal: {activity.kcal}</p>

                                <LikeButton activityId={activity.id} />

                                <Link to={`/comment/${activity.id}`}>
                                    <button className="comment-button">Kommentare anzeigen</button>
                                </Link>


                            </div>
                        ))
                    ) : (
                        <p>Keine Aktivitäten gefunden.</p>
                    )}
                </div>
            </div>
        </React.Fragment>
    );
};

export default SocialFeedSeite;