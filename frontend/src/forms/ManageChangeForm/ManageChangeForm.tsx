import React from 'react';
import { FormProvider, useForm, SubmitHandler } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import DetailsSection from './DetailsSection';
import { deleteExpense, updateExpense } from '../../api-client';
import { useAppContext } from '../../contexts/AppContext';
import { ExpenseType} from '../../../../backend/src/models/expense';

export type updateFormData = {
    _id: string
    name: string;
    others: { email: string; amount: number }[];
    total: number;
    date: string; // Using string for date in ISO format
    category: string;
    initialYear: string;
    initialMonth: string;
};
const ManageChangeForm = (initialData:ExpenseType) => {
    const date = typeof initialData.date === 'string' ? new Date(initialData.date) : initialData.date;
    console.log(initialData.date);

    const formMethods = useForm<updateFormData>({
        defaultValues: {
            _id: initialData._id,
            name: initialData.name,
            others: initialData.others,
            total: initialData.total,
            date: date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
            category: initialData.category,
            initialYear: date.toISOString().split('T')[0].split("-")[0],
            initialMonth: date.toISOString().split('T')[0].split("-")[1]
        }
    });

    const { handleSubmit, reset } = formMethods;
    const { showToast } = useAppContext();
    const navigate = useNavigate();
    const queryClient = useQueryClient();


    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            try {
                await deleteExpense({
                    _id: initialData._id,
                    name: initialData.name,
                    others: initialData.others,
                    total: initialData.total,
                    date: date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
                    category: initialData.category,
                    initialYear: date.toISOString().split('T')[0].split("-")[0],
                    initialMonth: date.toISOString().split('T')[0].split("-")[1]

                });
                showToast({ message: 'Expense deleted successfully', type: 'SUCCESS' });
                await queryClient.invalidateQueries('expenses'); 
                reset(); // Reset the form after successful submission
                navigate('/expenses'); // Navigate to previous page
            } catch (error) {
                console.error("Failed to delete expense:", error);
                showToast({ message: "Failed to delete expense", type: 'ERROR' });
            }
        }
    };

    const mutation = useMutation(updateExpense, {
        onSuccess: async () => {
            showToast({ message: 'Expense modified successfully', type: 'SUCCESS' });
            await queryClient.invalidateQueries('expenses'); 
            reset(); // Reset the form after successful submission
            navigate('/'); // Navigate to the homepage
        },
        onError: (error: Error) => {
            showToast({ message: error.message, type: 'ERROR' });
        },
    });

    const onSubmit: SubmitHandler<updateFormData> = (data) => {

        // Sum of shares
        const shares_total = data.others.reduce((sum, currentValue) => {
        return sum + currentValue.amount;
        }, 0); // Initial value is 0

        // Validate total
        if (shares_total !== data.total) {
            showToast({ message: "Sum of shares does not match total", type: 'ERROR' });
            return
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
            showToast({ message: 'All users must be selected; empty user emails are not allowed', type: 'ERROR' });
            return;
        }

        //Validate category
        if(!data.category){
            showToast({ message: 'Please select a category', type: 'ERROR' });
            return;
        }


        mutation.mutate(data);
    };

    return (
        <FormProvider {...formMethods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mx-2">
                <DetailsSection />
                <div className="flex flex-col gap-4">
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Submit Expense
                </button>
                <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1 bg-red-500 text-white rounded mt-4"
            >
                Delete Expense
            </button>
            </div></form>
        </FormProvider>
    );
};

export default ManageChangeForm;
