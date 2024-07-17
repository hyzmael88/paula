import "@/styles/globals.css";
import {Providers} from './Providers';
export default function App({ Component, pageProps }) {
  return(
    <Providers>

    <Component {...pageProps} />
    </Providers>
  ) 
}
