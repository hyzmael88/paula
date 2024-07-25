import "@/styles/globals.css";
import {Providers} from '../components/Providers';
import Footer from "@/components/Footer";
import SideBarRight from "@/components/SideBarRight";
import SideBarLeft from "@/components/SideBarLeft";
export default function App({ Component, pageProps }) {
  return(
    <Providers>
      <div className="w-full h-full flex justify-between">

      <SideBarLeft/>
    <Component {...pageProps} />
      <SideBarRight/>
      </div>
    <Footer/>
    </Providers>
  ) 
}
