import "@/styles/globals.css";
import Navbar from "../components/shared/navbar";
import Footer from "@/components/shared/footer";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}
