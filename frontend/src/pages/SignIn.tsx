import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useNavigate } from "react-router-dom";


export type SignInFormData = {
    email: string;
    password: string;
}


const SignIn = () =>{
    //it might be smart to create a different component for the commond pieces with the register component instead of this copy/paste

    const {showToast} = useAppContext();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {register, formState : {errors}, handleSubmit} = useForm<SignInFormData>();

    const mutation = useMutation(apiClient.signIn, {
    onSuccess: async (data, variables) => {
        // Show toast message
        showToast({ message: `Signed in as ${variables.email}`, type: "SUCCESS" });
        await queryClient.invalidateQueries("validateToken"); //forces the validateToken to run again
        // Navigate to home page
        navigate("/") //this is our homepage
    },
    onError: (error: Error) => {
        // Show error toast
        showToast({ message: error.message, type: "ERROR" });
    }
});


    const onSubmit = handleSubmit((data)=>{
        mutation.mutate(data) //calls sign in function given in the declaration of mutation
    })

    return (
        <form className="flex flex-col gap-5 px-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold ">Sign In</h2>

        
            <label className="text-gray-700 text-sm font-bold flex-1">
            Username
            <input
                type="text"
                className="border rounded w-full py-1 px-2 font-normal"
                {...register("email", { required: "This field is required", pattern: { value: /^[A-Za-z0-9]{3,15}$/, message: "Username must be alphanumeric of lenght between 3 and 15" } })}
            />
            {errors.email && ( //the "&&" renders the second argument if the first is true. Pay attention: if the left argument is a number (e.g. 0) it will render the number 0. If the first is false, the whole expression is false and react renders nothing
                <span className="text-xs text-red-400 ">
                    {errors.email.message}
                </span>)}
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
            Password
            <input type="password" className="border rounded w-full py-1 px-2 font-normal" {...register("password", { required: "This field is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}></input>
            {errors.password && ( //the "&&" renders the second argument if the first is true. Pay attention: if the left argument is a number (e.g. 0) it will render the number 0. If the first is false, the whole expression is false and react renders nothing
                    <span className="text-xs text-red-400 ">
                        {errors.password.message}
                    </span>)}
        </label>
        <span className="flex items-center justify-between">
            <span className="text-sm">You don't have an account yet? <Link className="underline text-blue-600 hover:text-blue-200" to="/register">Create a free account</Link></span>
            <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">
                Login
            </button>
            
        </span>
        </form>
    )
    

}

export default SignIn;