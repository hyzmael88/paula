import "@/styles/globals.css";
import { Providers } from "../components/Providers";
import Footer from "@/components/Footer";
import SideBarRight from "@/components/SideBarRight";
import SideBarLeft from "@/components/SideBarLeft";
import { useRouter } from "next/router";
import { DefaultSeo } from "next-seo";
import SEO from "../../next-seo.config";import NavbarMovil from "@/components/NavbarMovil";
;


export default function App({ Component, pageProps }) {
  const router = useRouter();
  const shouldShowSidebar =
    router.pathname !== "/" && !router.pathname.startsWith("/Auth");

  return (
    <Providers>
      <div className="w-full max-w-[1440px] mx-auto h-full flex justify-between">
        {shouldShowSidebar && <SideBarLeft />}
        <DefaultSeo {...SEO} />
        <Component {...pageProps} />
        {shouldShowSidebar && <NavbarMovil />}

        {shouldShowSidebar && <SideBarRight />}
      </div>
      <Footer />
    </Providers>
  );
}
