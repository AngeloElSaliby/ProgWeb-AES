
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";

interface Props{
  children: React.ReactNode;
}

const Layout = ({children} : Props) => {
  return (

    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero/>
      <div className="w-full  md:w-3/4 lg:w-2/3 mx-auto lg:py-3 flex-1">{children}</div>
      <Footer/>
    </div>
  );
};

export default Layout;