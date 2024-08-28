import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { updateFormData } from './ManageChangeForm'; 
import AmountShareSection from './AmountShareSection';

const DetailsSection: React.FC = () => {
    const { register, control, formState: { errors } } = useFormContext<updateFormData>();

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold mb-3">Update Expense</h1>

            <label className="text-gray-700 text-sm font-bold flex-1">
                Expense Name
                <input
                    type="text"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("name", { required: "This field is required" })}
                />
                {errors.name && (
                    <span className="text-xs text-red-400">
                        {errors.name.message}
                    </span>
                )}
            </label>

            <div className="flex gap-4">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Date
                    <input
                        type="date"
                        className="border rounded w-full py-1 px-2 font-normal"
                        {...register("date", { required: "This field is required" })}
                    />
                    {errors.date && (
                        <span className="text-xs text-red-400">
                            {errors.date.message}
                        </span>
                    )}
                </label>

                <label className="text-gray-700 text-sm font-bold flex-1">
                    Category
                    <Controller
                        control={control}
                        name="category"
                        rules = { {required : true} }
                        render={({ field }) => (
                            <select {...field} className="border rounded w-full py-1 px-2 font-normal">
                                <option value="">Select a category</option>
                                <option value="Food">Food</option>
                                <option value="Transportation">Transportation</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value ="Other">Other</option>
                            </select>
                        )}
                    />
                    {errors.category && (
                        <span className="text-xs text-red-400">
                            {errors.category.message}
                        </span>
                    )}
                </label>
            </div>

            <AmountShareSection />
        </div>
    );
};

export default DetailsSection;
