// Handle all API requests
import { ExpenseFormData } from "./forms/ManageExpenseForm/ManageExpenseForm";
import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { updateFormData } from "./forms/ManageChangeForm/ManageChangeForm";

const API_BASE_URL = "/api";

export const register = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        credentials: "include", // Telling the browser to keep and set the cookies
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
    });
    const responseBody = await response.json();
    console.log(responseBody);

    if (!response.ok) {
        throw new Error(responseBody.message); // We configured this so that all errors are in message property from backend
    }
};

export const signIn = async (formData: SignInFormData) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });

    const body = await response.json();

    if (!response.ok) {
        throw new Error(body.message);
    }

    return body;
};

export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/whoami`, { credentials: "include" });

    if (!response.ok) {
        throw new Error("Token invalid");
    }

    return response.json();
};

export const signOut = async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        credentials: "include",
        method: "POST"
    });

    if (!response.ok) {
        throw new Error("Error during sign out");
    }
};

export const whoami = async () => {
    try{
    const response = await fetch(`${API_BASE_URL}/auth/whoami`, {
        credentials: "include",
        method: "GET"
    });

    if (!response.ok) {
        throw new Error("Error during retrival of userId");
    }

    const res = await response.json()
    if (res.email === ""){
        throw new Error("Error during retrival of userId, got an empty response");
    }
    return res
    }
    catch (error){
        console.error('Error fetching user ID:', error);
        throw error;
    }
}

//Fetch the list of users
export const fetchUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        credentials: "include", // We will only allow this to authenticated users
        method: "GET"
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
    }

    return data.map((user: { firstName: string; email: string; lastName:string}) => ({
        value: user.email,
        label: user.email
    }));
};

export const submitExpense = async (formData: ExpenseFormData) => {
    console.log("In submitExpenses")
    console.log(`Fetching from : ${API_BASE_URL}/budget`)
    const response = await fetch(`${API_BASE_URL}/budget`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
    });

    if (!response.ok) {
        // Handle errors
        const errorText = await response.text();
        try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.message || 'Unknown error');
        } catch {
            throw new Error('Failed to parse error response');
        }
    }

    return response.json();
};

export const fetchExpenses = async (query: string = '', year: string = '', month: string = '') => {
    let url = `/api/budget/`;

    //By specifications we do not have an endpoint for simultaneous search of all three fields, and it was easier to filter client side for query
    //So query is disregarded in fetch request when year or year/month is present
    if (query) url = `/api/budget/search?q=${query}`;
    if (year) url = `/api/budget/${year}`;
    if (month && year) url = `/api/budget/${year}/${month}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });

    if (!response.ok) {
        const errorText = await response.text();
        try {
            const errorJson = JSON.parse(errorText);
            console.log(errorJson);
            throw new Error(errorJson.message || 'Unknown error');
        } catch {
            throw new Error('Failed to parse error response');
        }
    }

    return response.json();
};




export const updateExpense = async (updatedData: updateFormData): Promise<ExpenseFormData> => {
    const year = updatedData.initialYear;
    const month = updatedData.initialMonth;
    const response = await fetch(`/api/budget/${year}/${month}/${updatedData._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        console.log(response)
        throw new Error('Failed to update expense');
    }

    return response.json();
};

export const deleteExpense = async (updatedData: updateFormData): Promise<ExpenseFormData> => {
    const year = updatedData.date.split("-")[0];
    const month = updatedData.date.split("-")[1];
    const response = await fetch(`/api/budget/${year}/${month}/${updatedData._id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
        console.log(response)
        throw new Error('Failed to delete expense');
    }

    return response.json();
};

