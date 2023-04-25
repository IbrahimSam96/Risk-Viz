
import dynamic from 'next/dynamic'
import Table from '../components/Tables';
import Chart from '../components/Chart';
import Chart2 from '../components/Chart2';
import Chart3 from '../components/Chart3';

const DynamicMap = dynamic(() => import('../components/Map'), {
    ssr: false,
});

const Home = () => {


    return (
        <div className={`h-full w-full min-h-screen grid grid-cols-[repeat(7,1fr)] grid-rows-[50px,650px,250px,auto] bg-[white] `} >
            {/* <div className={`col-start-1 col-end-4 row-start-2 row-end-3 `}>
                <DynamicMap />
                
            </div> */}

            <div className={`col-start-4 col-end-8 row-start-2 row-end-3 `}>
                <Chart />
                
            </div>

            <div className={`col-start-1 col-end-4 row-start-2 row-end-3 `}>
                <Chart2 />
                
            </div>

            <div className={`col-start-1 col-end-8 row-start-3 row-end-4 mx-4 my-4 `}>
                <Chart3 />
                
            </div>

        </div>
    )
}
export default Home;