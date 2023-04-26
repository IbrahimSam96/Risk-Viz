// React
import { useEffect, useState } from "react";
// CTX
import { useData } from '../DataFetcher';
// Leaflet
import L from 'leaflet'
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
// Extends leaflet functionality to support SVG markers
import * as SVGMarker from '../components/Markers'


const Map = ({ activeYear }) => {

    const Data = useData();
    // Used for generating svg marker color scale 
    const [min, setMin] = useState()
    const [max, setMax] = useState()

    useEffect(() => {

        if (Data.length > 0) {
            // Calculates risk rating max and min values
            let max = Data[0]["Risk Rating"];
            let min = Data[0]["Risk Rating"];

            for (let i = 1; i < Data.length; i++) {
                if (Data[i]["Risk Rating"] > max) {
                    max = Data[i]["Risk Rating"];
                }
                if (Data[i]["Risk Rating"] < min) {
                    min = Data[i]["Risk Rating"];
                }
            }
            setMax(max)
            setMin(min)
        }

    }, [Data])

    // Generate color scale based on risk rating
    function generateColorScale(minValue, maxValue, value) {
        // Calculate the range of values
        var range = maxValue - minValue;

        // Calculate where the input value falls within the range
        var valuePosition = (value - minValue) / range;

        // Calculate the RGB values for the corresponding color
        var green = Math.floor((1 - valuePosition) * 255);
        var red = Math.floor(valuePosition * 255);
        var blue = 0;

        // Return the RGB color as a string
        return "rgb(" + red + "," + green + "," + blue + ")"

    };

    return (
        <MapContainer center={Data.length > 0 ? [Data[0]['Lat'], Data[0]['Long']] : [46.1351, -60.1831]} zoom={3} scrollWheelZoom={true} className={`w-[100%] h-[100%]`}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {Data.map((obj) => {

                let color = generateColorScale(min, max, obj["Risk Rating"])

                let options = {
                    icon: 'leaf',
                    iconShape: 'marker',
                    backgroundColor: color,
                    borderColor: "white"
                };
                // Returns markers with the same year property as selectedYear
                // NOTE: We could use a UID generator library instead of using obj properties for unique key 
                if (obj['Year'] == activeYear) {
                    let factorsKeys = Object.keys(JSON.parse(obj['Risk Factors']));
                    let factorsValues = Object.values(JSON.parse(obj['Risk Factors']));
                    let tooltip = ``

                    for (let k = 0; k < factorsKeys.length; k++) {
                        tooltip += factorsKeys[k] + `: ` + factorsValues[k] + `
                        `
                    }

                    return (
                        <Marker
                            key={
                                obj["Asset Name"] +
                                obj["Lat"] +
                                obj["Long"] +
                                obj["Risk Rating"] +
                                obj["Business Category"] +
                                obj["Year"] +
                                obj["Risk Factors"]
                            }
                            icon={L.BeautifyIcon.icon(options)}
                            position={[obj["Lat"], obj["Long"]]}
                            eventHandlers={{
                                click: (v) => {
                                  console.log(obj)
                                },
                              }}
                            
                        >
                            <Popup>
                                <p className={`inline`}> {obj["Asset Name"]} - {obj["Business Category"]} </p>
                                <p className={`inline`}> { `(${obj["Year"]})` }  </p>
                                <br />
                                <br />
                                <p style={{ color: color }} className={`inline whitespace-nowrap`}> Risk Rating: {obj["Risk Rating"]} </p>
                                <br />
                                <br />
                                <p className={`inline whitespace-pre-line`}>{tooltip}</p>
                            </Popup>
                        </Marker>
                    )
                }

            })}

        </MapContainer>
    )
}
export default Map;