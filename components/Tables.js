import MUIDataTable from "mui-datatables";
import React, { useEffect, useState } from "react";
import GSheetReader from 'g-sheets-api'



const Table = () => {

    const options = {
        selectableRows: "none"
    };

    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);

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

                const rowData = [];

                for (let i = 1; i < results.length; i++) {
                    rowData.push(Object.values(results[i]))
                }
                setData(rowData);
                setColumns(Object.keys(results[0]));
            },
            error => {
                // OPTIONAL: handle errors here
            });

    }, [])

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