import React from 'react';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import DetailsSection from './DetailsSection';
import { submitExpense } from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';

export type ExpenseFormData = {
    name: string;
    others: { email: string; amount: number }[];
    total: number;
    date: string; // Using string for date in ISO format
    category: string;
};

const ManageExpenseForm = () => {
    const formMethods = useForm<ExpenseFormData>({
        defaultValues: {
            name: '',
            others: [],
            total: 0,
            date: new Date().toISOString().split('T')[0], // Default to today's date
            category: '',
        },
    });

    const { handleSubmit, reset } = formMethods;
    const { showToast } = useAppContext();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const mutation = useMutation(submitExpense, {
        onSuccess: async () => {
            showToast({ message: 'Expense created successfully', type: 'SUCCESS' });
            await queryClient.invalidateQueries('expenses'); 
            reset(); // Reset the form after successful submission
            navigate('/expenses'); // Navigate to the homepage
            
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: 'ERROR' });
        },
    });

    const onSubmit: SubmitHandler<ExpenseFormData> = (data) => {


        // Sum the 'amount' values from the 'others' array
        const shares_total = data.others.reduce((sum, currentValue) => {
            return sum + currentValue.amount;
            }, 0); // Initial value is 0
    
            // Validate total
            if (shares_total !== data.total) {
                showToast({ message: "Sum of shares does not match total", type: 'ERROR' });
                return
            }

            //Others must be non-empty
            if (data.others.length === 0){
                showToast({ message: 'Add at least one user', type: 'ERROR' });
                return;
            }
    
            // Validate duplicate users
            const uniqueUserIds = new Set(data.others.map((share) => share.email));
            if (uniqueUserIds.size !== data.others.length) {
                showToast({ message: 'Duplicate users are not allowed in the shares', type: 'ERROR' });
                return;
            }
    
            // Validate that no user ID is empty
            const hasEmptyUserId = data.others.some((share) => !share.email || share.email.trim() === '');
            if (hasEmptyUserId) {
                showToast({ message: 'All users must be selected; empty user IDs are not allowed', type: 'ERROR' });
                return;
            }
            

            //Validate category
            if(data.category===""){
                showToast({ message: 'Please select a category', type: 'ERROR' });
                return;
            }

        mutation.mutate(data);
    };

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mx-2">
                <DetailsSection />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Submit Expense
                </button>
            </form>
        </FormProvider>
    );
};

export default ManageExpenseForm;
