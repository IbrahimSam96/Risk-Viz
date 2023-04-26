// UI Components
import Select from 'react-select';
import PlaceIcon from '@mui/icons-material/Place';
import InsightsIcon from '@mui/icons-material/Insights';

// Custom Components
import Table from '../components/Table';
import Chart from '../components/Chart';
import ThemeSwitch from '../components/ThemeSwitch';
import { useData } from '../DataFetcher';

// React/Next imports 
import dynamic from 'next/dynamic'
import { useEffect, useId, useState } from 'react';
import { useRouter } from 'next/router';

// Dynamically Import client-side graph
const DynamicMap = dynamic(() => import('../components/Map'), {
    ssr: false,
});

const Home = () => {
    // NextJS router
    const router = useRouter();

    // CTX - Fetches Data from Google Sheet
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

    // Theme Color
    const [toggle, setToogle] = useState(true);


    return (
        <div className={`h-full w-full min-h-screen grid grid-cols-[repeat(7,1fr)] grid-rows-[50px,100px,650px,auto] bg-[white] dark:bg-[#181C28] `} >

            <span className={`col-start-1 col-end-8 row-start-1 row-end-2 grid grid-cols-[100px,auto] dark:shadow dark:shadow-teal-800 bg-slate-300 dark:bg-[#11151F]`}>
                <span onClick={() => {
                    router.push('/')
                }} className={`flex self-center mx-4 hover:cursor-pointer`} >
                    <InsightsIcon className={`inline text-red-800`}/>
                    <p className={`inline text-xl font-bold mx-1 dark:text-white`}>Risk</p>
                    <p className={`inline text-base dark:text-white `}>Viz</p>
                    <PlaceIcon className={`inline text-teal-400`}/>
                </span>


                <span className={`justify-self-end self-center mx-8`}>
                    <ThemeSwitch setToogle={setToogle} toggle={toggle}/>
                </span>

            </span>

        

            <span className={`col-start-1 col-end-8 row-start-2 row-end-3 justify-self-start self-center z-[100000000000] mx-4`}>

                <span className={`flex`}>
                    <p className={` text-[1em] font-medium font-serif text-[rgb(36,36,36)] dark:text-white mr-4 my-auto`}>
                        Select Decade
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

            <span className={`col-start-1 col-end-8 row-start-2 row-end-3 justify-self-end self-center z-[100000000000] mx-4`}>

                <span className={`flex`}>
                    <p className={` text-[1em] font-medium font-serif text-[rgb(36,36,36)] dark:text-white my-auto mr-4`}>
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

            <div className={`col-start-1 col-end-4 row-start-3 row-end-4 mx-4 max-w-[1100px] `}>
                <DynamicMap activeYear={activeYear?.value} />

            </div>

            <div className={`col-start-4 col-end-8 row-start-3 row-end-3 mx-4 max-w-[1100px]`}>
                <Chart activeYear={activeYear?.value} type={type?.value} />

            </div>

            <div className={`col-start-1 col-end-8 row-start-4 row-end-5 m-10 `}>
                <Table activeYear={activeYear?.value} toggle={toggle}/>

            </div>

        </div>
    )
}
export default Home;