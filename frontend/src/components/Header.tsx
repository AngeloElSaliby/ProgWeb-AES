import { Link } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton"; //Moved to not overcrowd header, might be better to use dropdown menu on small screens

const Header = () => {
    const { isLoggedIn } = useAppContext();

    return (
        <div className="bg-blue-800 rounded-lg shadow dark:bg-blue-900 py-6 m-2">
            <div className="container mx-auto flex flex-wrap justify-between px-4">
                <span className="text-3xl text-white font-bold tracking-tight">
                    <Link to="/">Splittify.com</Link>
                </span>
                <span className="flex space-x-3 mt-4 sm:mt-0 justify-evenly">
                    {isLoggedIn ? (
                        <>
                            
                            <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-700 rounded-md" to="/balance">Balance</Link>
                            <Link className="flex items-center text-white px-3 font-bold hover:bg-blue-700 rounded-md" to="/expenses">Expenses</Link>
                            <Link className="flex items-center text-blue-600 px-3 font-bold bg-white hover:bg-gray-300" to="/add-expense">Add Expense</Link>
                            
                        </>
                    ) : (
                        <Link to="/sign-in" className="flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-100 rounded-md">Sign In</Link>
                    )}
                </span>
            </div>
        </div>
    );
}

export default Header;
