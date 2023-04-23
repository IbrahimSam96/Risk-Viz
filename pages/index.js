
import dynamic from 'next/dynamic'

const DynamicMap = dynamic(() => import('../components/Map'), {
    ssr: false,
});

const Home = () => {


    return (
        <div className={`h-full w-full min-h-screen grid grid-cols-[repeat(7,1fr)] grid-rows-[50px,650px,250px,auto] bg-[white] `} >
            <div className={`col-start-1 col-end-4 row-start-2 row-end-3 `}>
                <DynamicMap />
                
            </div>

        </div>
    )
}
export default Home;