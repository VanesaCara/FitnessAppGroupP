import React, {  useState, useEffect } from 'react';
import axios from "axios";
/*navbar muss auch implementiert werden, aber so dass der user bei jedem klick bestätigen muss, dass er die seite verlassen möchte */
import { useNavigate } from 'react-router-dom';
import './Bestätigungsseite.css'; // Der .css Code (Style der Webseite) ist in einer seperaten Datei (External Style), daher muss die noch importiert werden.
import { Button } from 'bootstrap';





function BestätigungsSeite()   {

    const API_BASE_URL = 'http://localhost:8080/gpx';
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [isValid, setIsValid] = useState(false);
    const nutzerID = localStorage.getItem("nutzerID");
    /*  const activType =localStorage.getItem(activityDetails.activityType);
      const typeImage = {switch (activType) {
      case "Wandern" :return "./src":

          break;

      default:
          break;
    }} */
    const [activityDetails, setActivityDetails] = useState({
        activityName: '',
        activityType: '',
        visibility: ''
    });

    const conditions = () =>
    { if (nutzerID) {
        if (activityDetails) {
            return false
        } else {
            return false
        }
    } else {
        return true
    }}

    /*conditions gibt zurzeit true zurück, weil die Hauptseite auch ohne Daten im localstorage geladen wird.
    Wenn man untem im return ein '!' vor dem "conditions?" schreibt, wird die alternative Seite geladen. */
    useEffect(() => {
        const storedActivityDetails = localStorage.getItem("activityDetails");
        if (storedActivityDetails) {
            setActivityDetails(JSON.parse(storedActivityDetails));
        }
    }, []);
    const Check = async (formData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/validate`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            } ) ;


            if (response.data.valid) {
                alert("Die Datei ist gültig. Du kannst nun deine Aktivität erstellen");
                setIsValid(response.data.valid);
                console.log(response)
            } else {
                alert("Die Datei enthält möglicherweise nicht genug Wegpunkte oder ist zu groß. Füge neue Wegpunkte hinzu oder versuch es mit einer anderen Datei.");
                setIsValid(false);
                console.log(response)
            }
        } catch (error) {
            console.error("Validation error:", error);
            alert("Es gab einen Fehler bei der Überprüfung der Datei. Versuch es bitte erneut");
        }}







    /* handleMethods (handle user Input) are declared as constants outside of the return body and have an arrow function as value.
    handleGoBack might need "activity" page to access local storage and use previous user input in the input form to avoid users having to choose their settings 2x */

    const handleFileChange = (e) => {
        const choice = e.target.files[0];
        setFile(choice);
        setIsValid(false); //Der Nutzer könnte eine geeignete Datei auswählen, dann wird isValid auf true gesetzt. Wenn er dann eine ungeeignete auswäht
        console.log("Selected file:", file);

        const formData = new FormData();
        try{
            formData.append("file", choice);
            Check (formData); // die oben deklariete CheckMethode überprüft ob die Datei genug Wegpunkte enthält.
            setFile(choice);}

        catch (error) {
            console.error("Validation error:", error);
            alert("Leider ist etwas schiefgelaufen. Versuch es in Kürze erneut.");
        }





    };



    //Start: handleUpload
    const handleGoBack = () => navigate(-1);

    const handleUpload = async () => {
        if (!file || !isValid) {
            alert("Bitte wähle zuerst eine gültige GPX-Datei aus. Diese muss mindestens zwei Wegpunkte enthalten.");
            return;
        }
        console.log("Selected file:", file);
        const formData = new FormData();

        const activityDetails = JSON.parse(localStorage.getItem("activityDetails"));
        const nutzerID = localStorage.getItem("nutzerId");
        formData.append("file", file);
        formData.append("activityDetails", JSON.stringify(activityDetails));
        formData.append("nutzerId", nutzerID);

        try {
            const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 200) {
                alert("Deine Aktivität wurde gespeichert!");
                if (nutzerID) {
                    navigate(`/home/${nutzerID}`);
                } else {
                    console.error("Wir konnten keine NutzerId finden. Stelle bitte sicher, dass du angemeldet bist.");
                }
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Leider ist etwas schiefgelaufen.");
        }
    };                                                        //Ende: handeUpload

    return (
        /*!doctype html?*/
        <html lang='de'>

        <head> <title>Überprüfe deine Angaben </title>




        </head>


        <body className='Seite'> {conditions() ?

            <div className="details-container">

                <h1 className="details-title">Wähle nun deine .gpx-Datei aus</h1>

                <div className="confirmation-button details-button"><br/>
                    Aktivitätsname: {activityDetails.activityName} <br/>
                    Aktivitätstyp : {activityDetails.activityType}

                    <br/>
                    Sichtbarkeit
                    : {activityDetails.visibility === 'true' ? 'Für alle sichtbar' : 'Nur für mich sichtbar'}
                    <br/><br/><br/>
                    Deine .gpx-Datei: <br/>

                    <input type="file" accept=".gpx" onChange={handleFileChange}
                           className="confirmation-button choose-button"/>

                </div>
                ;


                <div className="button-container">


                    <button onClick={handleUpload} className="confirmation-button confirm-button">
                        Angaben bestätigen und Aktivität erstellen
                    </button>
                    <button onClick={handleGoBack} className="confirmation-button back-button">
                        Zurück
                    </button>
                </div>

            </div>
            : <p> Diese Seite kann nur geladen werden, wenn folgende Bedingungen erfüllt wurden: <br/><br/>
                -Du bist angemeldet <br/>
                -Du hast den Namen, Typ und Sichtbarkeit deiner zur erstellenden Aktivität ausgewählt.
            </p>}
        </body>



        </html>
    );
}

export default BestätigungsSeite;
