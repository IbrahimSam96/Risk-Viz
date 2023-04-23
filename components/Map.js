import { LayersControl, MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useState } from "react";
import GSheetReader from 'g-sheets-api'


import { icon } from "leaflet"
import L from 'leaflet'
import * as SVGMarker from '../components/Markers'
import 'leaflet/dist/leaflet.css';
import { FormControl, InputLabel, MenuItem, NativeSelect, Select } from '@mui/material';

const Map = () => {

    const [data, setData] = useState([]);
    const [legend, setLegend] = useState([]);

    const [activeYear, setActiveYear] = useState("")
    const [min, setMin] = useState()
    const [max, setMax] = useState()


    useEffect(() => {

        const options = {
            apiKey: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API,
            sheetId: '1Y_yiT-_7IimioBvcqiCPwLzTLazfdRyzZ4k3cpQXiAw',
            sheetNumber: 1,
            sheetName: 'sample_data', // if sheetName is supplied, this will take precedence over sheetNumber
            returnAllResults: true,
        }

        GSheetReader(
            options,
            results => {
                setData(results)
                // console.log(results)

                // Calculate max and min for markers color scale 
                let max = results[0]["Risk Rating"];
                let min = results[0]["Risk Rating"];

                for (let i = 1; i < results.length; i++) {
                    if (results[i]["Risk Rating"] > max) {
                        max = results[i]["Risk Rating"];
                    }
                    if (results[i]["Risk Rating"] < min) {
                        min = results[i]["Risk Rating"];
                    }
                }

                setMax(max)
                setMin(min)

                // Set up legend i,e, List of unique years
                const hash = {};

                for (let i = 0; i < results.length; i++) {
                    hash[results[i]["Year"]] = true;
                }

                const uniqueArr = Object.keys(hash).map(Number);

                console.log(uniqueArr);
                setLegend(uniqueArr);

            },
            error => {
                // OPTIONAL: handle errors here
            });

    }, [])

    function generateColorScale(minValue, maxValue, value) {
        // Calculate the range of values
        var range = maxValue - minValue;

        // Calculate where the input value falls within the range
        var valuePosition = (value - minValue) / range;

        // Calculate the RGB values for the corresponding color
        var red = Math.floor((1 - valuePosition) * 255);
        var green = Math.floor(valuePosition * 255);
        var blue = 0;

        // Return the RGB color as a string
        return "rgb(" + red + "," + green + "," + blue + ")";
    };

    return (
        <span >
            {legend.length > 0 ?
                <span className={`flex justify-end`}>
                    <p className={`inline text-[#1976D2] text-sm mx-4 whitespace-nowrap my-auto`}>Select Year</p>
                    <FormControl >
                        <Select
                            value={activeYear}
                            onChange={(v) => {
                                setActiveYear(v.target.value)
                                console.log(v.target.value)
                            }}
                        >
                            {legend.map((value) => {
                                return (
                                    <MenuItem key={value} value={value}>{value}</MenuItem>
                                )
                            })}

                        </Select>
                    </FormControl>

                </span>
                :
                <span className={`flex ml-auto p-6 bg-[grey] w-[25%] h-[35px] rounded animate-pulse `}>  </span>
            }

            <MapContainer center={[51.505, -0.09]} zoom={3} scrollWheelZoom={false} className={`w-[100%] h-[100%]`}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {data.map((obj) => {

                    let options = {
                        icon: 'leaf',
                        iconShape: 'marker',
                        backgroundColor: generateColorScale(min, max, obj["Risk Rating"]),
                        borderColor: "white"
                    };

                    if (Number(obj['Year']) == activeYear) {
                        return (
                            <Marker key={obj["Asset Name"]
                                + obj["Lat"] +
                                obj["Long"] +
                                obj["Risk Rating"] +
                                obj["Business Category"] +
                                obj["Year"] +
                                obj["Risk Factors"]}
                                icon={L.BeautifyIcon.icon(options)}
                                position={[obj["Lat"], obj["Long"]]}
                            >
                                <Popup>
                                    {obj["Asset Name"]} - <br /> {obj["Business Category"]}
                                </Popup>
                            </Marker>
                        )
                    }

                })}

            </MapContainer>


        </span>
    )
}
export default Map;