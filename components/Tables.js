import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import GSheetReader from 'g-sheets-api'
import { TableCell, TableRow } from "@mui/material";
import { useData } from "../DataFetcher";



const Table = () => {

    const Data = useData();

    const options = {
        selectableRows: "none",
        expandableRowsOnClick: true,
        expandableRows: true,
        renderExpandableRow: (rowData, rowMeta) => {
            // console.log(rowData, rowMeta);
            console.log(JSON.parse(rowData[5]))

            let riskFactorKeys = Object.keys(JSON.parse(rowData[5]));
            let riskFactorValues = Object.values(JSON.parse(rowData[5]));
            return (
                <React.Fragment>
                    <tr>
                        <td colSpan={6}>
                            <TableRow >
                                <TableCell component="th" scope="row" className={`font-bold`}>
                                    Risk Factor
                                </TableCell>
                                <TableCell component="th" scope="row" className={`font-bold`}>
                                    Risk Ratio
                                </TableCell>
                            </TableRow>
                            {riskFactorKeys.map((risk, index) => (
                                <TableRow key={risk}>
                                    <TableCell component="th" scope="row">
                                        {risk}
                                    </TableCell>
                                    <TableCell align="right">{riskFactorValues[index].toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </td>
                    </tr>
                </React.Fragment>
            )
        },
        tableBodyMaxHeight: "358px",

    };

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

    const [data, setData] = useState([]);
    // Used for generating risk rating color scale 
    const [min, setMin] = useState()
    const [max, setMax] = useState()

    useEffect(() => {

        if (Data.length > 0) {
            const rowData = [];
            for (let i = 1; i < Data.length; i++) {
                rowData.push(Object.values(Data[i]))
            }
            setData(rowData);

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

    }, [])

    const columns = [
        {
            name: "Asset Name",
            Label: "Asset Name",
            options: {
                sortThirdClickReset: true,

            }

        },
        {
            name: "Lat",
            Label: "Lat",
            options: {
                sortThirdClickReset: true,

            }

        },
        {
            name: "Long",
            Label: "Long",
            options: {
                sortThirdClickReset: true,

            }

        },
        {
            name: "Business Category",
            Label: "Business Category",
            options: {
                sortThirdClickReset: true,

            }

        },
        {
            name: "Risk Rating",
            Label: "Risk Rating",
            options: {
                sortThirdClickReset: true,
                setCellProps: v => {
                    return {
                        style: { color: `${generateColorScale(min,max,v)}` },
                    }

                },
            }

        },
        {
            name: "Risk Factors",
            Label: "Asset Name",
            options: {
                display: "excluded",
                viewColumns: false,
                filter: false,
                sortThirdClickReset: true,

            }

        },
        {
            name: "Year",
            Label: "Year",
            options: {
                sortThirdClickReset: true,

            }

        },
    ]

    return (

        <React.Fragment>
            {columns.length > 0 &&
                <MUIDataTable
                    title={""}
                    data={data}
                    columns={columns}
                    options={options}
                />
            }
        </React.Fragment>

    )
}
export default Table;