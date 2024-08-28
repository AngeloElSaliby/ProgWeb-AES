import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

const SignOutButton = () =>{
    const {showToast}= useAppContext();
    const navigate = useNavigate();
    const queryClient = useQueryClient();



    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken"); //forces the validateToken to run again
            showToast({message: "Come back soon!", type: "SUCCESS"});
            navigate("/");

        },
        onError: (error: Error) =>{
            showToast({message: error.message, type: "ERROR"});
        }
    });
    

    const handleClick = () =>{
        mutation.mutate();
    }
    
    return(
        <button onClick={handleClick} className="flex items-center text-blue-600 px-3 font-bold bg-white hover:bg-gray-300">Sign Out</button>
    )
}

export default SignOutButton;