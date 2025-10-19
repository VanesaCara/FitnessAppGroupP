import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import "./ActivityProtocol.css";

const ActivityProtocol = () => {
    const { userId } = useParams();
    const [yearsData, setYearsData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(null);
    const [monthsData, setMonthsData] = useState([]);
    const [selectedMetric, setSelectedMetric] = useState('Anzahl');
    const [fastestActivities, setFastestActivities] = useState({}); // Stores fastest activity per year
    const nutzerId = localStorage.getItem('nutzerId');
    const thisNutzerId = localStorage.getItem('thisNutzerId');

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await fetch(`http://localhost:8080/activities/${userId}/activitieslist`);
                const activities = await response.json();

                const groupedByYearAndMonth = activities.reduce((acc, activity) => {
                    const date = new Date(activity.dateTime);
                    const year = date.getFullYear();
                    const month = date.getMonth() + 1;

                    if (!acc[year]) {
                        acc[year] = {
                            months: Array(12).fill(0).map(() => ({
                                Anzahl: 0,
                                Zeit: 0,
                                Distanz: 0,
                                Verbrannt: 0,
                                Höhenmeter: 0,
                                Durchschnitssgeschwindigkeit: 0,
                            })),
                            fastest: null,
                        };
                    }

                    const monthData = acc[year].months[month - 1];
                    monthData.Anzahl += 1;
                    monthData.Zeit += activity.time / 3600;
                    monthData.Distanz += activity.distance / 1000;
                    monthData.Verbrannt += activity.kcal;
                    monthData.Höhenmeter += activity.elevation;
                    monthData.Durchschnitssgeschwindigkeit += activity.averageSpeed;



                    if (activity.averageSpeed > (acc[year].fastest?.averageSpeed || 0)) {
                        acc[year].fastest = activity;
                    }

                    return acc;
                }, {});


                Object.values(groupedByYearAndMonth).forEach(yearData => {
                    yearData.months.forEach(monthData => {
                        if (monthData.Anzahl > 0) {
                            monthData.Durchschnitssgeschwindigkeit /= monthData.Anzahl;
                        }
                    });
                });

                const yearsDataArray = Object.keys(groupedByYearAndMonth).map(year => ({
                    year,
                    months: groupedByYearAndMonth[year].months,
                    fastest: groupedByYearAndMonth[year].fastest,
                }));

                setYearsData(yearsDataArray);

                const fastestPerYear = yearsDataArray.reduce((acc, { year, fastest }) => {
                    acc[year] = fastest;
                    return acc;
                }, {});
                setFastestActivities(fastestPerYear);
            } catch (err) {
                console.error('Error fetching activities:', err);
            }
        };

        fetchActivities();
    }, [userId]);

    const handleYearSelect = (year) => {
        setSelectedYear(year);
        const yearData = yearsData.find(y => y.year === year);
        if (yearData) {
            const monthsArray = yearData.months.map((data, index) => ({
                month: new Date(0, index).toLocaleString('default', { month: 'short' }),
                ...data,
            }));
            setMonthsData(monthsArray);
        }
    };

    const handleMetricSelect = (criteria) => {
        setSelectedMetric(criteria);
    };

    const fastestActivityForYear = fastestActivities[selectedYear];

    if(nutzerId === thisNutzerId){
        return (
            <div>
                <h1>Activitäts Protokoll</h1>

                <label htmlFor="year-select">Jahr:</label>
                <select
                    id="year-select"
                    onChange={(e) => handleYearSelect(e.target.value)}
                    defaultValue=""
                >
                    <option value="" disabled>
                        Jahr Auswählen
                    </option>
                    {yearsData.map(({year}) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>

                <label htmlFor="metric-select">Statistik Auswählen:</label>
                <select
                    id="metric-select"
                    onChange={(e) => handleMetricSelect(e.target.value)}
                    defaultValue="Anzahl"
                >
                    <option value="Anzahl">Anzahl Aktivitäten</option>
                    <option value="Zeit">Zeit (Stunden)</option>
                    <option value="Distanz">Distanz (km)</option>
                    <option value="Verbrannt">Verbrannte Kalorien (kcal)</option>
                    <option value="Höhenmeter">Erklommene Höhenmeter (m)</option>
                    <option value="Durchschnitssgeschwindigkeit">Durchschnittsgeschwindigkeit (km/h)</option>
                </select>

                {selectedYear && (
                    <div>
                        <ResponsiveContainer width={1200} height={600}>
                            <BarChart data={monthsData}>
                                <XAxis dataKey="month"/>
                                <YAxis/>
                                <Tooltip
                                    formatter={(value, name, props) => {
                                        if (
                                            selectedMetric === 'Durchschnitssgeschwindigkeit' &&
                                            fastestActivityForYear &&
                                            props.payload.month ===
                                            new Date(fastestActivityForYear.dateTime).toLocaleString('default', {month: 'short'})
                                        ) {
                                            return`${value.toFixed(2)} km/h | Schnellste: ${fastestActivityForYear.activityName} am ${new Date(fastestActivityForYear.dateTime).toLocaleDateString()} mit ${fastestActivityForYear.averageSpeed.toFixed(2)} km/h`
                                        }
                                        else if (selectedMetric === 'Anzahl') {
                                            return value;
                                        }
                                        else if (selectedMetric === 'Distanz') {
                                            return `${value.toFixed(2)} Km`
                                        }
                                        else if (selectedMetric === 'Verbrannt') {
                                            return `${value.toFixed(2)} Kcal`
                                        }
                                        else if (selectedMetric === 'Höhenmeter') {
                                            return `${value.toFixed(2)} m`
                                        }
                                        else if (selectedMetric === 'Zeit') {
                                            return `${value.toFixed(2)} h`
                                        }
                                        else if (selectedMetric === 'Durchschnitssgeschwindigkeit') {
                                            return `${value.toFixed(2)} km/h`
                                        }
                                    }}/>
                                <Bar
                                    dataKey={selectedMetric}
                                    fill="#8884d8"
                                    shape={({x, y, width, height, fill, payload}) => {
                                        const isFastest =
                                            selectedMetric === 'Durchschnitssgeschwindigkeit' &&
                                            fastestActivityForYear &&
                                            payload.month ===
                                            new Date(fastestActivityForYear.dateTime).toLocaleString('default', {month: 'short'});

                                        return (
                                            <rect
                                                x={x}
                                                y={y}
                                                width={width}
                                                height={height}
                                                fill={isFastest ? 'orange' : fill}
                                            />
                                        );
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
                <a href={`/home/${userId}`}>
                    <button className="back-button">Zurück zum Profil
                    </button>
                </a>
            </div>
        );
    } else {
        return (
            <div>
                <h1>Activitäts Protokoll</h1>
                <a href={`/home/${thisNutzerId}`}>
                    <button className="back-button">Zurück zum Profil
                    </button>
                </a>
                <h2>Keine Berechtigung</h2>
                <p>Du kannst nur dein Eigenes Aktivitätsprotokoll Einsehen</p>
            </div>
    )
    }

};

export default ActivityProtocol;
