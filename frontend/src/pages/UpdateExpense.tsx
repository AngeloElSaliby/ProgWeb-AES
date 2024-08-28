import React from 'react';
import { useLocation } from 'react-router-dom';
import ManageChangeForm from "../forms/ManageChangeForm/ManageChangeForm";
import { ExpenseType } from '../../../backend/src/models/expense';

const UpdateExpense = () => {
    // Using React Router's useLocation to retrieve the state passed via the edit button
    const location = useLocation();
    const initialData = location.state as ExpenseType;

    return (
        <div>
            {/* Passing the initial data as a prop to the ManageExpenseForm */}
            {initialData ? (
                <ManageChangeForm {...initialData} />
            ) : (
                <p>Loading...</p> // Fallback if initialData is not available
            )}
        </div>
    );
};

export default UpdateExpense;
