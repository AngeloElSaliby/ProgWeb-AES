import { useAppContext } from "../contexts/AppContext";




const Hero = () => {
    const { isLoggedIn } = useAppContext();
    return (
      <div className="bg-blue-800 pb-16 my-1">
        <div className="container mx-auto flex flex-col gap-2 px-4">
          <h1 className="text-4xl text-white font-bold">Expenses made easy!</h1>
          <p className="text-2xl text-white">
            There are those who forget, and those who Splittify
          </p>
          {!isLoggedIn && <p className="text-s text-gray-200">For a demo, login with username: john123 and password: password123. See Docker console log for other available usernames to use with the same password.</p>}
        </div>
      </div>
    );
  };
  
  export default Hero;