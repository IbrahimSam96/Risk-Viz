import '@/styles/globals.css'
import { DataProvider } from '../DataFetcher'

export default function App({ Component, pageProps }) {
    return (
        <DataProvider>
            <Component {...pageProps} />
        </DataProvider>
    )
}
