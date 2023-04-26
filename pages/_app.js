import '@/styles/globals.css'
import { DataProvider } from '../DataFetcher'
import { Analytics }
    from

    '@vercel/analytics/react'
    ;

export default function App({ Component, pageProps }) {
    return (
        <DataProvider>
            <Component {...pageProps} />
            <Analytics />
        </DataProvider>
    )
}
