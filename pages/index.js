// UI Components
import Select from 'react-select';

import dynamic from 'next/dynamic'
import Table from '../components/Tables';
import Chart from '../components/Chart';


import { useData } from '../DataFetcher';
import { useEffect, useId, useState } from 'react';

const DynamicMap = dynamic(() => import('../components/Map'), {
    ssr: false,
});

const Home = () => {

    const Data = useData();
    // Selecting Year State
    const [yearOptions, setYearOptions] = useState([]);
    const [activeYear, setActiveYear] = useState(null);


    useEffect(() => {

        if (Data.length > 0) {

            // Finds Unique Year Dates 
            const hash = {};
            for (let i = 0; i < Data.length; i++) {
                hash[Data[i]["Year"]] = true;
            }

            const uniqueArr = Object.keys(hash).map(String);
            let selectOptions = [];

            for (let k = 0; k < uniqueArr.length; k++) {
                let options = {}
                options["value"] = uniqueArr[k]
                options["label"] = uniqueArr[k]
                selectOptions.push(options);
            }
            // Adds Unique Years Options to Select component 
            setYearOptions(selectOptions)
            // Selects Active Year 
            setActiveYear(selectOptions[0])
        }

    }, [Data])

    // used for select input id attribute
    const id = useId()

    // Chart Type
    const options = [
        { value: 'Business Category', label: 'View by Category Names' },
        { value: 'Asset Name', label: 'View by Asset Names' },
        { value: 'Lat', label: 'View by Position (Lat / Long)' },
    ];
    // Selecting Chart Type State
    const [type, setType] = useState(options[0]);

    return (
        <div className={`h-full w-full min-h-screen grid grid-cols-[repeat(7,1fr)] grid-rows-[50px,150px,650px,250px,auto] bg-[white] `} >

            <span className={`col-start-1 col-end-8 row-start-2 row-end-3 justify-self-start self-center z-[100000000000]`}>

                <span className={`flex`}>
                    <p className={` text-[1em] font-medium font-serif text-[rgb(36,36,36)] my-auto mx-4`}>
                        Select Year
                    </p>

                    <Select
                        instanceId={id}
                        className={``}
                        value={activeYear}
                        onChange={(v) => {

                            setActiveYear(v)
                        }}
                        name="Select Year"
                        options={yearOptions}
                    />
                </span>

            </span>

            <span className={`col-start-1 col-end-8 row-start-2 row-end-3 justify-self-end self-center z-[100000000000]`}>

                <span className={`flex`}>
                    <p className={` text-[1em] font-medium font-serif text-[rgb(36,36,36)] my-auto mx-4`}>
                        Chart Type
                    </p>

                    <Select
                        instanceId={id}
                        className={``}
                        defaultValue={options[0]}
                        onChange={(v) => {

                            setType(v)
                        }}
                        name="Select Year"
                        options={options}
                    />
                </span>

            </span>

            <div className={`col-start-1 col-end-4 row-start-3 row-end-4 mx-4 `}>
                <DynamicMap activeYear={activeYear?.value} />

            </div>

            <div className={`col-start-4 col-end-8 row-start-3 row-end-3 mx-4 max-w-[1100px]`}>
                <Chart activeYear={activeYear?.value} type={type?.value} />

            </div>

            <div className={`col-start-1 col-end-8 row-start-4 row-end-5 mx-4 my-4 `}>
                <Table />

            </div>

        </div>
    )
}
export default Home;