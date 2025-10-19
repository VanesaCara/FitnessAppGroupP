import { useParams } from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from "react";
import { getActivityById } from "../../Services/ActivityService";
import { MapContainer, TileLayer, Polyline, Popup, Marker } from "react-leaflet";
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import startIcon from '../../icons/start.png';
import endeIcon from '../../icons/finish-flag.png';
import kameraIcon from '../../icons/kamera.png';
import L from 'leaflet';

const ActivityMapVisualization = () => {
    const { activityId } = useParams();
    const [activityData, setActivityData] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const thisNutzerId = localStorage.getItem('thisNutzerId');
    const [likeAnzahl, setLikeAnzahl] = useState(0);

    const startPunktIcon = L.icon({ iconUrl: startIcon, iconSize: [30, 30], iconAnchor: [12, 25] });
    const endPunktIcon = L.icon({ iconUrl: endeIcon, iconSize: [30, 30], iconAnchor: [12, 25] });
    const kameraMarkerIcon = L.icon({ iconUrl: kameraIcon, iconSize: [30, 30], iconAnchor: [12, 25] });

    useEffect(() => {
        const getActivity = async () => {
            try {
                const daten = await getActivityById(activityId);
                setActivityData(daten);

                const photosResponse = await fetch(`http://localhost:8080/photos/${activityId}`);
                const photosData = await photosResponse.json();
                setPhotos(photosData);

                const likesCount = await axios.get(`http://localhost:8080/likes/${activityId}/likeAmount`);
                setLikeAnzahl(likesCount.data);

            } catch (error) {
                console.error("Aktivität konnte nicht geladen werden:", error);
            } finally {
                setLoading(false);
            }
        };
        getActivity();
    }, [activityId]);

    if (loading) {
        return <div>Lädt...</div>;
    }

    if (!activityData || !activityData.trackData || activityData.trackData.length === 0) {
        return <div>Keine Aktivität gefunden oder keine Daten verfügbar.</div>;
    }

    const trackData = activityData.trackData.map(p => [p.latitude, p.longitude]);
    const startPunkt = trackData[0];
    const endPunkt = trackData[trackData.length - 1];
    const zurueckZurProfilseite = () => {
        navigate(`/home/${thisNutzerId}`);
    };

    return (
        <div>
            <button onClick={zurueckZurProfilseite} className="zzpButton">
                Zurück zur Profilseite
            </button>

            <h1 className="AMVactivityName">{activityData.activityName}</h1>
            <p><strong>Likes:</strong> {likeAnzahl}</p>

            <MapContainer
                center={trackData[0]}
                zoom={13}
                style={{ height: "1200px", width: "1200px" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
                />
                <Marker position={startPunkt} icon={startPunktIcon}>
                    <Popup>Start</Popup>
                </Marker>
                <Marker position={endPunkt} icon={endPunktIcon}>
                    <Popup>Ende</Popup>
                </Marker>
                <Polyline positions={trackData} color="blue">
                    <Popup>
                        <div>
                            <p><strong>Name:</strong> {activityData.activityName}</p>
                            <p><strong>Typ:</strong> {activityData.activityType}</p>
                            <p><strong>Dauer:</strong> {activityData.duration} Sekunden</p>
                            <p><strong>Distanz:</strong> {activityData.distance.toFixed(2)} Meter</p>
                            <p>
                                <strong>Durchschnittsgeschwindigkeit:</strong> {activityData.averageSpeed.toFixed(2)} km/h
                            </p>
                            <p><strong>Höhe:</strong> {activityData.elevation.toFixed(2)} Meter</p>
                            <p><strong>Kalorien:</strong> {activityData.kcal.toFixed(2)}</p>
                        </div>
                    </Popup>
                </Polyline>

                {photos.map(photo => (
                    <Marker
                        key={photo.id}
                        position={[photo.latitude, photo.longitude]}
                        icon={kameraMarkerIcon}
                    >
                        <Popup>
                            <div>
                                <img
                                    src={`http://localhost:8080/photos/photo/${photo.id}`}
                                    alt={photo.caption}
                                    style={{ width: '150px', height: 'auto' }}
                                />
                                <p><strong>Bildunterschrift:</strong> {photo.caption}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default ActivityMapVisualization;
