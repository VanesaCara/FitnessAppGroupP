
package com.example.sep_moove_backend.serviceSchicht;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.*;
import io.jenetics.jpx.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.example.sep_moove_backend.serviceSchicht.ActivityStatisticsService;
import java.io.*;
import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Nutzer;

import com.example.sep_moove_backend.persistenzSchicht.entitaeten.Activity;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;


import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class GpxService {

    private final ActivityStatisticsService activityStatisticsService;

    public GpxService(ActivityStatisticsService activityStatisticsService) {
        this.activityStatisticsService = activityStatisticsService;
    }

    public List<ActivityTrack> createTracklist(MultipartFile file) {
        List<ActivityTrack> activityTracks = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream()) {
            // XML-Dokument aus dem InputStream laden
            DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
            Document doc = dBuilder.parse(inputStream);
            doc.getDocumentElement().normalize();

            // Alle trkpt-Elemente abrufen
            NodeList trkptList = doc.getElementsByTagName("trkpt");

            for (int i = 0; i < trkptList.getLength(); i++) {
                Node trkptNode = trkptList.item(i);

                if (trkptNode.getNodeType() == Node.ELEMENT_NODE) {
                    Element trkptElement = (Element) trkptNode;

                    // Latitude und Longitude abrufen
                    double latitude = Double.parseDouble(trkptElement.getAttribute("lat"));
                    double longitude = Double.parseDouble(trkptElement.getAttribute("lon"));

                    // Altitude abrufen (optional)
                    double altitude = 0.0;
                    NodeList eleList = trkptElement.getElementsByTagName("ele");
                    if (eleList.getLength() > 0) {
                        altitude = Double.parseDouble(eleList.item(0).getTextContent());
                    }

                    // Timestamp abrufen (optional)
                    ZonedDateTime timestamp = null;
                    NodeList timeList = trkptElement.getElementsByTagName("time");
                    if (timeList.getLength() > 0) {
                        String timeString = timeList.item(0).getTextContent();
                        timestamp = ZonedDateTime.parse(timeString, DateTimeFormatter.ISO_DATE_TIME);
                    }

                    // Neues ActivityTrack-Objekt erstellen
                    ActivityTrack track = new ActivityTrack();
                    track.setLatitude(latitude);
                    track.setLongitude(longitude);
                    track.setAltitude(altitude);
                    track.setTimestamp(timestamp);

                    // Track zur Liste hinzufügen
                    activityTracks.add(track);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        return activityTracks;
    }


    public boolean validateGPX(MultipartFile file) {
        File tempFile = null;
       /* Ein temporäres Objekt, die mit den Daten aus der .gpx-Datei  gefüllt werden soll.
         Damit das Objekt im Anschluss im finally-bracket gelöscht werden kann,
         wird es außerhalb des try-brackets deklariert. */

        try  {
            tempFile = convertMultipartFileToFile(file);
            //MultipartFile wird benutzt, um Dokumente als Byte-Stream zu übertragen.


            System.out.println("Temporary file created at: " + tempFile.getAbsolutePath());
            GPX gpx = GPX.read(tempFile.toPath());
            /*Gpx.read benötigt wohl ein Pfad zur Datei. Wenn man etwas aus der Working
            Directory lesen möchte, reicht dateiname+Extension.
            toPath gibt den "relative" Pfad des Objekts wieder (also
            welche Schritte man vom jetzigen Verzeichnis gehen müsste),
             daher kann man stattdessen dass hier benutzen.
             */
            long trackpointCount =
                    gpx.tracks()
                            .flatMap(Track::segments)
                            .flatMap(TrackSegment::points)
                            .count();
            System.out.println("Trackpoint count: " + trackpointCount);
          /*   Es gibt wohl verschiedene Arten, wie eine .gpx aufgebaut sein kann (je
          nachdem wie die .gpx generiert wurde? z.B. live-aufzeichnung oder nachtragung)
             Im Folgenden werden routePoints statt trackpoints gezählt */
            if (trackpointCount < 2) {
                long routePointCount = gpx.routes()
                        .flatMap(Route::points)
                        .count();

                System.out.println("Route point count: " + routePointCount);
                //sysoutprnt ist nicht relevant für den nutzer, aber für Debugging
                return routePointCount >= 2;
            }


            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        } finally {
            /* das tempörare File-Objekt wird gelöscht, sobald try und/oder catch
            Blöcke ausgeführt wurden */
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
                System.out.println("Temporary file deleted: " + tempFile.getAbsolutePath());
                /*getAbsolutePath ist ähnlich wie toPath, nur dass der absolute Pfad statt
                der relativen zurückgegeben wird*/
            }
        }
    }

    public Activity parseGPX(MultipartFile file, Activity activityDetails) {
        File tempFile;
        try{

/*die .gpx wird unter "file" als ein Stream von Bytes erhalten (multipartFile).
mit file.getBytes werden die Bytes als byte [] zurückgegeben, was im Folgenden
dann als Attribut gpxFile der Aktivität gespeichert wird.
Zum Lesen der Datei müssen wir den Array wieder in ein file konvertieren.
 */
            tempFile = convertMultipartFileToFile(file);

            List< ActivityTrack> track = createTracklist(file);
            Activity activity = activityDetails;
            activity.setActivityTracks(track);

            int last = activity.getActivityTracks().size() -1;
            activity.setDistance(activityStatisticsService.distanceBetween(0, last, activity));
            activity.setTime(activityStatisticsService.timeBetween(0, last, activity));
            activity.setElevation(activityStatisticsService.elevationBetween(0, last, activity));
            activity.setAverageSpeed((activity.getDistance() / activity.getTime()) * 3.6);
            activity.setDateTime(activity.getActivityTracks().getFirst().getTimestamp());

            return activity;
/*es fehlt noch die NutzerID, die wird im Controller zusammen mit der activity an
die createActivty() methode in activityService als Argumente übergeben
 */
        } catch (IOException e) //MultipartFile ist ein ByteStream, daher IOException
        {
            e.printStackTrace();
            return null;
        }




    }
    private File convertMultipartFileToFile(MultipartFile file) throws IOException {
        File tempFile = File.createTempFile("temp", ".gpx");
        try (FileOutputStream fos = new FileOutputStream(tempFile)) {
            fos.write(file.getBytes());
        }
        return tempFile;
    }


}
