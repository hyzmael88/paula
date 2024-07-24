import "@/styles/globals.css";
import {Providers} from '../components/Providers';
import Footer from "@/components/Footer";
export default function App({ Component, pageProps }) {
  return(
    <Providers>

    <Component {...pageProps} />
    <Footer/>
    </Providers>
  ) 
}
