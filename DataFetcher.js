import { createContext, useContext, useEffect, useState } from "react";
import GSheetReader from 'g-sheets-api'

// CTX
const DataContext = createContext({
    data: []
});

export function DataProvider({ children }) {

    const [data, setData] = useState([]);

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
                // console.log(filtered)
            },
            error => {
                // handle errors here:

            });

    }, [])

    return (
        <DataContext.Provider value={data} >{children}</DataContext.Provider>
    )
}

export const useData = () => {
    return useContext(DataContext);
};
