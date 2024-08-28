import React, { useState, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';
import Select from 'react-select';
import { useFormContext} from 'react-hook-form'; 
import { ExpenseFormData } from './ManageExpenseForm'; // Import the form data type
import { fetchUsers, whoami } from '../../api-client';



interface UserShare {
    email: string;
    amount: number;
}

const AmountShareSection: React.FC = () => {
    const { setValue, getValues, watch} = useFormContext<ExpenseFormData>(); // Use useFormContext to access form methods
    const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [myUserId, setMyUserId] = useState<string>("")
    
    //retrieve logged in user id
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                
                const data = await whoami();
                setMyUserId(data.email);
                
            } catch (error) {
                setError('Failed to fetch user ID');
            }
        };

        fetchUserId();
    }, []);
    const [shares, setShares] = useState<UserShare[]>([{ email: myUserId, amount: getValues("total") }]);
    //retrieve user list

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const options = await fetchUsers(); // Options are already formatted
                setUserOptions(options);
            } catch (error) {
                setError('Failed to fetch users');
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        loadUsers();
    }, []);

    const total= watch("total")

    //Automatically update self share if only user
    useEffect(() => {
        if(shares.length === 1){
            setShares([{ email: myUserId, amount: getValues("total") }]);
        }
    }, [myUserId, total, getValues, shares.length]);

    const handleAddUser = () => {
        setShares([...shares, { email: '', amount: 0 }]);
    };

    const handleChangeAmount = (index: number, value: number) => {
        const updatedShares = [...shares];
        
        // Update the amount for the specified index
        updatedShares[index].amount = value;
        setShares(updatedShares);
        
        setValue("others", updatedShares); // Update others in form state
    };

    const handleSelectUser = (index: number, selectedOption: any) => {
        const updatedShares = [...shares];
        updatedShares[index].email = selectedOption ? selectedOption.value : '';
        updatedShares[0].email= myUserId;
        setShares(updatedShares);

        if(updatedShares[index].email !== ''){ //Update others in formState only if user was selected
        setValue("others", updatedShares); }
    };

    const handleRemoveUser = (index: number) => {
        const updatedShares = shares.filter((_, i) => i !== index);
        setShares(updatedShares);

        setValue("others", updatedShares); // Update others in form state
    };

    const handleTotalAmountChange = (value: number) => {
        const updatedShares = [...shares];
        // Only update the current user's share if no other users are added
        if (shares.length === 1) {
            updatedShares[0].amount = value;
        }
        setShares(updatedShares);
        setValue("total", value); // Update the total in form state
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Total and shares*/}
            <label className="text-gray-700 text-sm font-bold flex-1">
                Total Amount
                <NumericFormat
                    value={getValues("total") || 0}
                    onValueChange={({ floatValue }) => {
                        handleTotalAmountChange(floatValue ?? 0); 
                    }}
                    className="border rounded w-full py-1 px-2 font-normal"
                    thousandSeparator={true}
                    prefix={'€'}
                    allowNegative={false}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    placeholder="€0.00"
                />
            </label>

            {error && <div className="text-red-500">{error}</div>}

            {/* Shares */}
            {shares.map((share, index) => (
                <div key={index} className="flex gap-4 items-center relative">
                    {/* Remove User Button */}
                    {index !== 0 && (
                        <button
                            type="button"
                            onClick={() => handleRemoveUser(index)}
                            className="text-red-500 font-bold px-2"
                        >
                            X
                        </button>
                    )}

                    {/* User selection, first user is unchangeable*/}
                    {index === 0 ? (
                        <input
                            type="text"
                            className="border rounded w-full py-1 px-2 font-normal"
                            value="Your share"
                            disabled
                        />
                    ) : (
                        <Select
                            options={userOptions}
                            onChange={(selectedOption) =>
                                handleSelectUser(index, selectedOption)
                            }
                            isClearable
                            placeholder="Select User"
                            className="w-full"
                            isDisabled={shares[index].email !== ''}
                        />
                    )}

                      {/* Share amount*/}
                    <NumericFormat
                        value={share.amount}
                        onValueChange={({ floatValue }) => {
                            handleChangeAmount(index, floatValue ?? 0);
                        }}
                        className="border rounded w-full py-1 px-2 font-normal"
                        thousandSeparator={true}
                        prefix={'€'}
                        allowNegative={true}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        placeholder="€0.00"
                    />

                    {/* Add user button only on last share */}
                    {index === shares.length - 1 && (
                        <button
                            type="button"
                            onClick={handleAddUser}
                            className="px-3 py-1 bg-blue-500 text-white rounded"
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? 'Loading...' : 'Add User'}
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AmountShareSection;
