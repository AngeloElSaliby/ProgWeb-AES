//Using react-hook-form
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
    firstName: string;
    lastName: String;
    email: string;
    password: string;
    confirmPassword: string
}

const Register = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { showToast } = useAppContext();

    const { register, watch, handleSubmit, formState: { errors } } = useForm<RegisterFormData>(); //cool double destructuring: first formState from useForm() and then errors from it

    const mutation = useMutation(apiClient.register, { //Using react-query to take care of the states
        onSuccess: async () => {
            showToast({ message: "Registration Successfull!", type: "SUCCESS" }) //the toast is in context, so this will remain visible even as we navigate through pages
            await queryClient.invalidateQueries("validateToken"); //forces the validateToken to run again
            navigate("/");
        },
        onError: (error: Error) => {
            console.error(error)
            console.error(error.message)
            showToast({ message: error.message, type: "ERROR" })
        }
    })

    const onSubmit = handleSubmit((data) => { //called when we submit the form. It passes the form data to handleSubmit, our validator. If the validator approves our function passed as a parameter gets called

        mutation.mutate(data); //in this case calls the apiClient.register, and passes "data" to it

    });
    return <form className="flex flex-col gap-5 px-5 " onSubmit={onSubmit}>
        <h2 className="3xl font-bold">Create an account</h2>
        <div className="flex flex-col md:flex-row gap-5 ">
            <label className="text-gray-700 text-sm font-bold flex-1">
                First Name
                <input className="border rounded w-full py-1 px-2 font-normal" {...register("firstName", { required: "This field is required" })}></input>
                {errors.firstName && ( //the "&&" renders the second argument if the first is true. Pay attention: if the left argument is a number (e.g. 0) it will render the number 0. If the first is false, the whole expression is false and react renders nothing
                    <span className="text-xs text-red-400 ">
                        {errors.firstName.message}
                    </span>)}

            </label>

            <label className="text-gray-700 text-sm font-bold flex-1">
                Last Name
                <input className="border rounded w-full py-1 px-2 font-normal" {...register("lastName", { required: "This field is required" })}></input>
                {errors.lastName && ( //the "&&" renders the second argument if the first is true. Pay attention: if the left argument is a number (e.g. 0) it will render the number 0. If the first is false, the whole expression is false and react renders nothing
                    <span className="text-xs text-red-400 ">
                        {errors.lastName.message}
                    </span>)}
            </label>
        </div>
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
        <label className="text-gray-700 text-sm font-bold flex-1">
            Confirm password
            <input type="password" className="border rounded w-full py-1 px-2 font-normal" {...register("confirmPassword", {
                validate: (val) => {
                    if (!val) {
                        return "This field is required"
                    } else if (watch("password") !== val) {
                        return "Passwords do not match"
                    }
                }
            })}></input>
            {errors.confirmPassword && ( //the "&&" renders the second argument if the first is true. Pay attention: if the left argument is a number (e.g. 0) it will render the number 0. If the first is false, the whole expression is false and react renders nothing
                <span className="text-xs text-red-400 ">
                    {errors.confirmPassword.message}
                </span>)}
        </label>
        <span>
            <button type="submit" className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">
                Create Account
            </button>
        </span>
    </form>
}

export default Register;
