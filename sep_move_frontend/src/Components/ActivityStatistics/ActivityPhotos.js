import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getActivityById } from '../../Services/ActivityService';
import './ActivityPhotos.css';

const ActivityPhotos = () => {
    const { activityId } = useParams();
    const navigate = useNavigate();
    const nutzerId = localStorage.getItem('nutzerId');
    const thisNutzerId = localStorage.getItem('thisNutzerId');
    const [activityTracks, setActivityTracks] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [caption, setCaption] = useState('');
    const [message, setMessage] = useState('');
    const [photos, setPhotos] = useState([]);
    const [photoUrls, setPhotoUrls] = useState({});

    useEffect(() => {
        const fetchActivityTracks = async () => {
            try {
                const response = await getActivityById(activityId);
                setActivityTracks(response.trackData);
            } catch (error) {
                console.error('Fehler beim Abrufen der Aktivitätsdaten:', error);
            }
        };

        const fetchPhotos = async () => {
            try {
                const response = await fetch(`http://localhost:8080/photos/${activityId}`);
                const data = await response.json();
                setPhotos(data);

                const urls = {};
                for (const photo of data) {
                    const photoResponse = await fetch(`http://localhost:8080/photos/photo/${photo.id}`);
                    const blob = await photoResponse.blob();
                    urls[photo.id] = URL.createObjectURL(blob);
                }
                setPhotoUrls(urls);
            } catch (error) {
                console.error('Fehler beim Abrufen der Fotos:', error);
            }
        };

        fetchActivityTracks();
        fetchPhotos();
    }, [activityId]);

    const handleFileChange = (event) => {
        setPhoto(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedTrack || !photo || !caption) {
            setMessage('Bitte wählen Sie alle Felder aus.');
            return;
        }

        const formData = new FormData();
        formData.append('photo', photo);
        formData.append('caption', caption);
        formData.append('latitude', selectedTrack.latitude);
        formData.append('longitude', selectedTrack.longitude);
        formData.append('activityId', activityId);

        try {
            const response = await fetch('http://localhost:8080/photos/upload', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                setMessage('Foto erfolgreich hochgeladen!');
                setPhoto(null);
                setCaption('');
                setSelectedTrack(null);
                const updatedPhotos = await fetch(`http://localhost:8080/photos/${activityId}`);
                setPhotos(await updatedPhotos.json());
            } else {
                setMessage('Fehler beim Hochladen des Fotos.');
            }
        } catch (error) {
            console.error('Fehler beim Hochladen:', error);
            setMessage('Fehler beim Hochladen.');
        }
    };

    const handleDelete = async (photoId) => {
        try {
            const response = await fetch(`http://localhost:8080/photos/${photoId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setMessage('Foto erfolgreich gelöscht!');
                setPhotos(photos.filter(photo => photo.id !== photoId));
            } else {
                setMessage('Fehler beim Löschen des Fotos.');
            }
        } catch (error) {
            console.error('Fehler beim Löschen:', error);
            setMessage('Fehler beim Löschen.');
        }
    };

    const goBackToProfile = () => {
        navigate(`/home/${thisNutzerId}`);
    };

    if (nutzerId !== thisNutzerId) {
        return (
            <div className="ActivityPhotosWrapper">
                <button className="backButton" onClick={goBackToProfile}>Zurück zur Profilseite</button>
                <h2>Keine Berechtigung</h2>
                <p>Nur der Uploader der Aktivität kann Fotos hinzufügen oder verwalten.</p>
            </div>
        );
    }

    return (
        <div className="ActivityPhotosWrapper">
            <button className="backButton" onClick={goBackToProfile}>Zurück zur Profilseite</button>
            <h2>Fotos zur Aktivität hinzufügen</h2>
            <form className="PhotoForm">
                <label>GPS-Koordinate auswählen:</label>
                <select
                    value={selectedTrack ? JSON.stringify(selectedTrack) : ''}
                    onChange={(e) => setSelectedTrack(JSON.parse(e.target.value))}
                >
                    <option value="">-- Wählen Sie eine Koordinate aus --</option>
                    {activityTracks.map((track, index) => (
                        <option key={index} value={JSON.stringify(track)}>
                            Lat: {track.latitude}, Lon: {track.longitude}
                        </option>
                    ))}
                </select>
                <label>Foto auswählen:</label>
                <input type="file" onChange={handleFileChange} />
                <label>Bildunterschrift:</label>
                <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                />
                <button type="button" onClick={handleUpload}>Foto hochladen</button>
            </form>
            {message && <p>{message}</p>}

            <h3>Hochgeladene Fotos</h3>
            <div className="UploadedPhotos">
                {photos.map((photo) => (
                    <div key={photo.id} className="PhotoItem">

                        <img
                            src={`http://localhost:8080/photos/photo/${photo.id}`}
                            alt={photo.caption}
                        />
                        <p><strong>Bildunterschrift:</strong> {photo.caption}</p>
                        <p><strong>Latitude:</strong> {photo.latitude}</p>
                        <p><strong>Longitude:</strong> {photo.longitude}</p>
                        <button onClick={() => handleDelete(photo.id)}>Foto löschen</button>
                    </div>
                ))}
            </div>
        </div>
    );

};

export default ActivityPhotos;