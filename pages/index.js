// UI Components
import Select from 'react-select';
import PlaceIcon from '@mui/icons-material/Place';
import InsightsIcon from '@mui/icons-material/Insights';

// Custom Components
import Table from '../components/Table';
import LineGraph from '../components/LineGraph';
// import Chart from '../components/Chart';
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


    // Theme Color
    const [toggle, setToogle] = useState(true);

    // Selecting Chart Type State
    const [groupedOptions, setGroupedOptions] = useState([]);
    const [type, setType] = useState();

    useEffect(() => {

        if (Data.length > 0) {
            let GroupedOptions = []
            // Finds unique Business Cateogries, Asset Names, lat positions 
            const hash = {};
            const Assethash = {};
            const Positionhash = {};

            for (let i = 0; i < Data.length; i++) {
                hash[Data[i]["Business Category"]] = true;
                Assethash[Data[i]["Asset Name"]] = true;
                Positionhash[Data[i]["Long"]] = true;
            }
            // Adds unique Business Cateogries, Asset Names, lat coordinates to own arrays
            const uniqueArr = Object.keys(hash).map(String);
            let CategoryOptions = [];

            const uniqueAssetArr = Object.keys(Assethash).map(String);
            let AssetOptions = [];

            const uniqueLatArr = Object.keys(Positionhash).map(String);
            let LocationOptions = [];

            for (let k = 0; k < uniqueArr.length; k++) {
                let options = {}
                options["value"] = uniqueArr[k]
                options["label"] = uniqueArr[k]
                options["group"] = 'Business Category'

                CategoryOptions.push(options);
            }

            for (let k = 0; k < uniqueAssetArr.length; k++) {
                let options = {}
                options["value"] = uniqueAssetArr[k]
                options["label"] = uniqueAssetArr[k]
                options["group"] = 'Asset Name'

                AssetOptions.push(options);

            }

            for (let k = 0; k < uniqueLatArr.length; k++) {
                let options = {}
                options["value"] = uniqueLatArr[k]
                options["label"] = uniqueLatArr[k]
                options["group"] = 'Long'


                LocationOptions.push(options);
            }

            GroupedOptions[0] = { label: "Categories", options: CategoryOptions }
            GroupedOptions[1] = { label: "Asset Names", options: AssetOptions }
            GroupedOptions[2] = { label: "Locations", options: LocationOptions }

            console.log(GroupedOptions)
            setGroupedOptions(GroupedOptions)
            setType(GroupedOptions[0]["options"][0])
        }

    }, [Data])

    const groupStyles = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    };

    const formatGroupLabel = (data) => (
        <div style={groupStyles}>
            <span className={`font-bold text-[teal]`}>{data.label}</span>
            <span className={`font-bold text-[black]`} >{data.options.length}</span>
        </div>
    );

    return (
        <div className={`h-full w-full min-h-screen grid grid-cols-[repeat(7,1fr)] grid-rows-[50px,100px,650px,auto] bg-[white] dark:bg-[#181C28] `} >

            <span className={`col-start-1 col-end-8 row-start-1 row-end-2 grid grid-cols-[100px,auto] dark:shadow dark:shadow-teal-800 bg-cyan-500 dark:bg-[#11151F]`}>
                <span onClick={() => {
                    router.push('/')
                }} className={`flex self-center mx-4 hover:cursor-pointer`} >
                    <InsightsIcon className={`inline text-red-800`} />
                    <p className={`inline text-xl font-bold mx-1 dark:text-white`}>Risk</p>
                    <p className={`inline text-base dark:text-white `}>Viz</p>
                    <PlaceIcon className={`inline text-teal-400`} />
                </span>


                <span className={`justify-self-end self-center mx-8`}>
                    <ThemeSwitch setToogle={setToogle} toggle={toggle} />
                </span>

            </span>

            <span className={`col-start-1 col-end-8 row-start-2 row-end-3 justify-self-start self-center z-[100000000000] mx-4 sm:mb-0 mb-12`}>

                <span className={`flex`}>
                    <p className={` text-[1em] font-medium font-serif text-[rgb(36,36,36)] dark:text-white mr-4 my-auto`}>
                        Select Decade
                    </p>

                    <Select

                        instanceId={id}
                        className={`needsclick`}
                        value={activeYear}
                        onChange={(v) => {

                            setActiveYear(v)
                        }}
                        name="Select Year"
                        options={yearOptions}
                        styles={{
                            option: (styles, state) => ({
                                ...styles,
                                "&:hover": {
                                    backgroundColor: state.isSelected ? "" : "#2684FF",
                                    color: state.isSelected ? "" : "white",

                                }
                            })
                        }}
                    />
                </span>

            </span>

            <span className={`col-start-1 col-end-8 row-start-2 row-end-3 justify-self-start sm:justify-self-end self-center z-[100000000000] mx-4 sm:mt-0 mt-14  `}>

                <span className={`flex`}>
                    <p className={` text-[1em] font-medium font-serif text-[rgb(36,36,36)] dark:text-white my-auto mr-4`}>
                        Chart Type
                    </p>
                    <Select
                        instanceId={id}
                        className={`w-[250px] needsclick`}
                        value={type && type}
                        onChange={(v) => {
                            setType(v)
                        }}
                        name="Select Option"
                        options={groupedOptions}
                        formatGroupLabel={formatGroupLabel}
                        styles={{
                            option: (styles, state) => ({
                                ...styles,
                                "&:hover": {
                                    backgroundColor: state.isSelected ? "" : "#2684FF",
                                    color: state.isSelected ? "" : "white",

                                }
                            })
                        }}
                    />
                </span>

            </span>

            <div className={`col-start-1 col-end-8 sm:col-start-1 sm:col-end-4 row-start-3 row-end-4 mx-4 max-w-[1100px] `}>
                <DynamicMap activeYear={activeYear?.value} />

            </div>

            <div className={`col-start-1 col-end-8 sm:col-start-4 sm:col-end-8 row-start-4 row-end-5 sm:row-start-3 sm:row-end-4 mx-4 max-w-[1100px]`}>
                <LineGraph activeYear={activeYear?.value} type={type && type} />

            </div>

            <div className={`col-start-1 col-end-8  row-start-5 row-end-6 sm:row-start-4 sm:row-end-5 m-10 max-w-[2000px] `}>
                <Table activeYear={activeYear?.value} toggle={toggle} />

            </div>

        </div>
    )
}
export default Home;