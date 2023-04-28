import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import { TableCell, TableRow } from "@mui/material";
import { useData } from "../DataFetcher";

import { createTheme, ThemeProvider } from "@mui/material";

const Table = ({toggle, activeYear}) => {

    const Data = useData();

    const options = {
        selectableRows: "none",
        expandableRowsOnClick: true,
        expandableRowsHeader:false,
        expandableRows: true,
        renderExpandableRow: (rowData, rowMeta) => {
            // console.log(rowData, rowMeta);

            let riskFactorKeys = Object.keys(JSON.parse(rowData[5]));
            let riskFactorValues = Object.values(JSON.parse(rowData[5]));
            return (
                <React.Fragment>
                    <tr>
                        <td colSpan={7}>
                            <TableRow sx={{display:"inline-table", width:"100%"}} >
                                <TableCell sx={{width:"200px", color:`${toggle ? 'black' : "white"}`}} align="left" className={`font-bold`}>
                                    Risk Factor
                                </TableCell>
                                <TableCell sx={{color:`${toggle ? 'black' : "white"}`}} align="center" component="th" scope="row" className={`font-bold `}>
                                  Factor  Risk Ratio
                                </TableCell>
                            </TableRow>
                            {riskFactorKeys.map((risk, index) => (
                                <TableRow sx={{display:"inline-table", width:"100%"}} key={risk} className={`hover:bg-[silver] dark:hover:bg-[#454B59]`}>
                                    <TableCell sx={{width:"200px", color:`${toggle ? 'black' : "white"}`}} align="left" >
                                        {risk}
                                    </TableCell>
                                    <TableCell sx={{color:`${toggle ? 'black' : "white"}`}} align="center">{riskFactorValues[index].toFixed(2)}</TableCell>
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
    // Used for generating risk rating Text color scale 
    const [min, setMin] = useState()
    const [max, setMax] = useState()

    useEffect(() => {

        if (Data.length > 0) {
            const rowData = [];
            for (let i = 1; i < Data.length; i++) {
                if(Data[i]['Year'] == activeYear){
                    rowData.push(Object.values(Data[i]))
                }
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

    }, [Data, activeYear])

    const columns = [
        {
            name: "Asset Name",
            Label: "Asset Name",
            options: {
                sortThirdClickReset: true,
                setCellHeaderProps: v => ({style:  toggle ? {backgroundColor:"white", color:"black"} : {backgroundColor:"#131722", color:"white"}       }),
                setCellProps: v => {
                    return {style:{fontSize: ".8em", color: `${toggle ? 'black' : "white"}` }}
                },
          
            }

        },
        {
            name: "Lat",
            Label: "Lat",
            options: {
                sortThirdClickReset: true,
                setCellHeaderProps: v => ({style: toggle ? {backgroundColor:"white", color:"black"} : {backgroundColor:"#131722", color:"white"}   }),
                setCellProps: v => {
                    return {style:{fontSize: ".8em", color: `${toggle ? 'black' : "white"}` }}
                },
            }

        },
        {
            name: "Long",
            Label: "Long",
            options: {
                sortThirdClickReset: true,
                setCellHeaderProps: v => ({style: toggle ? {backgroundColor:"white", color:"black"} : {backgroundColor:"#131722", color:"white"}   }),
                setCellProps: v => {
                    return {style:{fontSize: ".8em", color: `${toggle ? 'black' : "white"}` }}
                },
            }

        },
        {
            name: "Business Category",
            Label: "Business Category",
            options: {
                sortThirdClickReset: true,
                setCellHeaderProps: v => ({style: toggle ? {backgroundColor:"white", color:"black"} : {backgroundColor:"#131722", color:"white"} }),
                setCellProps: v => {
                    return {style:{fontSize: ".8em", color: `${toggle ? 'black' : "white"}` }}
                },
            }

        },
        {
            name: "Risk Rating",
            Label: "Risk Rating",
            options: {
                sortThirdClickReset: true,
                setCellProps: v => {
                    return {
                        style: { color: `${generateColorScale(min, max, v)}` },
                    }

                },
                setCellHeaderProps: v => ({style: toggle ? {backgroundColor:"white", color:"black"} : {backgroundColor:"#131722", color:"white"} }),

            }

        },
        {
            name: "Risk Factors",
            Label: "Risk Factors",
            options: {
                display: 'excluded',
                viewColumns: false,
                filter: true,

            }

        },
        {
            name: "Year",
            Label: "Year",
            options: {
                sort: false,
                sortThirdClickReset: true,
                setCellHeaderProps: v => ({style: toggle ? {backgroundColor:"white", color:"black"} : {backgroundColor:"#131722", color:"white"}}),
                setCellProps: v => {
                    return {style:{fontSize: ".8em", color: `${toggle ? 'black' : "white"}` }}
                },
            }

        },
    ]

    const getMuiTheme3 = () => createTheme({
        components: {
            MUIDataTableHeadCell: {
                styleOverrides: {
                    sortAction: {
                        '& path': {
                            color: "teal" // or whatever you need
                        },
                    },
                    sortActive: {
                        color: "teal"  // whatever you need
                    }
                }
            },
            MuiToolbar: {
                styleOverrides: {
                    root: toggle ? {backgroundColor:"white", color:"black"} : {backgroundColor:"#131722", color:"white"}
                }
            },
            MuiTableBody: {
                styleOverrides: {
                    root: toggle ? {backgroundColor:"white", color:"black"} : {backgroundColor:"#131722", color:"white"}
                }
            },
            MuiTable: {
                styleOverrides: {
                    root:toggle ? {backgroundColor:"white", color:"black"} : {backgroundColor:"#131722", color:"white"}
                }
            },
            MUIDataTableToolbar: {
                styleOverrides: {
                    icon: {
                        color:`${toggle ? 'grey' : "white"}`,
                        '&:hover': {
                            color: "teal"
                        }
                    },
                }
            },
            MuiTableRow: {
                styleOverrides: {
                    root: {
                        "&.MuiTableRow-hover": {
                            "&:hover": {
                                backgroundColor:`${toggle ? 'Silver' : " #454B59"}`,
                            }
                        }
                    }
                }
            },
            MUIDataTableSelectCell:{
                styleOverrides: {
                    root:toggle ? {backgroundColor:"white"} : {backgroundColor:"#131722"}
                }
            },

            MuiIconButton:{
                styleOverrides: {
                    root:toggle ? {backgroundColor:"white", color:"black"} : {backgroundColor:"#131722", color:"white"}
                }
            }
        }
    });

    return (

        <React.Fragment>
            {columns.length > 0 &&

                <ThemeProvider theme={getMuiTheme3()}>

                    <MUIDataTable
                        title={""}
                        data={data}
                        columns={columns}
                        options={options}
                    />
                </ThemeProvider>

            }
        </React.Fragment>

    )
}
export default Table;