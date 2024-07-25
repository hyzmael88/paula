import "@/styles/globals.css";
import { Providers } from "../components/Providers";
import Footer from "@/components/Footer";
import SideBarRight from "@/components/SideBarRight";
import SideBarLeft from "@/components/SideBarLeft";
import { useRouter } from "next/router";
import { DefaultSeo } from "next-seo";
import SEO from "../../next-seo.config";;


export default function App({ Component, pageProps }) {
  const router = useRouter();
  const shouldShowSidebar =
    router.pathname !== "/" && !router.pathname.startsWith("/Auth");

  return (
    <Providers>
      <div className="w-full h-full flex justify-between">
        {shouldShowSidebar && <SideBarLeft />}
        <DefaultSeo {...SEO} />
        <Component {...pageProps} />

        {shouldShowSidebar && <SideBarRight />}
      </div>
      <Footer />
    </Providers>
  );
}
