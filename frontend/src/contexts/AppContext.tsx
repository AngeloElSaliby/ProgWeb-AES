//The context is a collection of properties we want to expose to our components

import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";


type ToastMessage ={
    message: string;
    type: "SUCCESS" | "ERROR";
}

type AppContext = {
    showToast : (toastMessage: ToastMessage) => void;
    isLoggedIn : boolean;
}

const appContext = React.createContext<AppContext | undefined> (undefined);

//Wrapper to give access to other componets
export const AppContextProvider = ({children} : {children: React.ReactNode}) =>{
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);

    const {isError} = useQuery("validateToken", apiClient.validateToken, { //errors in the validateToken function are thrown to isError thanks to react-query
        retry: false
    });
    
    return (
        <appContext.Provider 
         value={{
            showToast: (toastMessage) => {
                setToast(toastMessage);
                },
            isLoggedIn: !isError,
            
    
                }}>
            {toast && ( //render only if there is a toast
                <Toast 
                 message={toast.message}
                 type ={toast.type}
                 onClose = {() => setToast(undefined)}/>)} 
            {children}
        </appContext.Provider>
    )
}

export const useAppContext = () =>{ //hook for the components to access the context
    const context = useContext(appContext);
    return context as AppContext
}