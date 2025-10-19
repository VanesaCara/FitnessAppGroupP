import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WillkommensSeite from "./Components/RegistrierungUndAnmeldung/WillkommensSeite";
import RegistrierungsSeite from "./Components/RegistrierungUndAnmeldung/RegistrierungsSeite";
import AnmeldeSeite from "./Components/RegistrierungUndAnmeldung/AnmeldeSeite";
import BenutzerProfil from "./Components/Profile/BenutzerProfil";
import ProfilbildSeite from "./Components/RegistrierungUndAnmeldung/ProfilbildSeite";
import AlleUser from "./Components/Profile/AlleUser";
import ActivityStatistics from "./Components/ActivityStatistics/ActivityStatistics";
import ActivitySeite from "./Components/GPX/ActivitySeite";
import ZweiFaktorSeite from "./Components/RegistrierungUndAnmeldung/ZweiFaktorSeite";
import Bestätigungsseite from "./Components/GPX/Bestätigungsseite";
import ActivityMapVisualization from "./Components/ActivityStatistics/ActivityMapVisualization";
import Leaderboard from "./Components/ActivityStatistics/Leaderboard";
import FreundeSeite from './Components/Profile/FreundeSeite';
import 'leaflet/dist/leaflet.css';
import HeightVisual from "./Components/ActivityStatistics/HeightVisual";
import ChatComponent  from "./Components/Chat/ChatSeite";
import ChatCreator from "./Components/Chat/ChatCreator";
import ChatSelector from "./Components/Chat/ChatSelector";
import ActivityPhotos from "./Components/ActivityStatistics/ActivityPhotos";
import ActivityProtocol from "./Components/ActivityStatistics/ActivityProtocol";
import SocialFeedSeite from "./Components/Profile/SocialFeedSeite";
import Erfolge from "./Components/Profile/Erfolge";
import Comment from "./Components/Comment/Comment"




function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<WillkommensSeite />} />
                <Route path="/register" element={<RegistrierungsSeite />} />
                <Route path="/login" element={<AnmeldeSeite />}/>
                <Route path="/home/:id" element={<BenutzerProfil />} />
                <Route path="/profilbild" element={<ProfilbildSeite />} />
                <Route path="/alleuser" element={<AlleUser />} />
                <Route path="/activitystatistics/:id" element={<ActivityStatistics/>} />
                <Route path="/activity" element={<ActivitySeite />} />
                <Route path="/2FA" element={<ZweiFaktorSeite />} />
                <Route path="/Bestätigungsseite" element={<Bestätigungsseite />} />
                <Route path="/activity/:activityId" element={<ActivityMapVisualization />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/HeightVisual/:id" element={<HeightVisual />} />
                <Route path="/chat/:chatRoomId" element={<ChatComponent />} />
                <Route path="/createChat" element={<ChatCreator />} />
                <Route path="/selectChat" element={<ChatSelector />} />
                <Route path="/freunde" element={<FreundeSeite />} />
                <Route path="/activityPhotos/:activityId" element={<ActivityPhotos />} />
                <Route path="/activityProtocol/:userId" element={<ActivityProtocol />} />
                <Route path="/socialfeed" element={<SocialFeedSeite />} />
                <Route path="/achievements/:id" element={<Erfolge />} />
                <Route path="/comment/:activityId" element={<Comment />} />
            </Routes>
        </Router>
    );
}

export default App;