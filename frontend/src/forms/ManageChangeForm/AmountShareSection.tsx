import React, { useState, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';
import Select from 'react-select';
import { useFormContext } from 'react-hook-form';
import { updateFormData } from './ManageChangeForm'; 
import { fetchUsers, whoami } from '../../api-client';

interface UserShare {
    email: string; 
    amount: number;
}

const AmountShareSection: React.FC = () => {
    const { setValue, getValues } = useFormContext<updateFormData>();
    const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [myUserId, setMyUserId] = useState<string>('');
    const [shares, setShares] = useState<UserShare[]>([]);

    // Fetch the logged-in user's ID
    useEffect(() => {
        const fetchUserId = async () => { //Read "email" as "username" througout the project
            try {
                const data = await whoami();
                setMyUserId(data.email);
            } catch (error) {
                setError('Failed to fetch user email');
            }
        };

        fetchUserId();
    }, []);

    // Fetch the list of users and populate the Select options
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

    // Initialize the shares state with existing data or default values
    useEffect(() => {
        const initialShares = getValues("others") || [];
        if (initialShares.length > 0) {
            setShares(initialShares);
        } else if (myUserId) {
            setShares([{ email: myUserId, amount: getValues("total") || 0 }]);
        }
    }, [myUserId, getValues]);

    const handleAddUser = () => {
        setShares([...shares, { email: '', amount: 0 }]);
    };

    const handleChangeAmount = (index: number, value: number) => {
        const updatedShares = [...shares];
        updatedShares[index].amount = value;
        setShares(updatedShares);
        setValue("others", updatedShares);
    };

    const handleSelectUser = (index: number, selectedOption: any) => {
        const updatedShares = [...shares];
        updatedShares[index].email = selectedOption ? selectedOption.value : '';
        setShares(updatedShares);
        if(updatedShares[index].email !== ''){
        setValue("others", updatedShares); 
    }
    };

    const handleRemoveUser = (index: number) => {
        const updatedShares = shares.filter((_, i) => i !== index); //Underscore to avoid IDEs error message
        setShares(updatedShares);
        setValue("others", updatedShares);
    };

    const handleTotalAmountChange = (value: number) => {
        const updatedShares = [...shares];
        if (shares.length === 1) {
            updatedShares[0].amount = value;
        }
        setShares(updatedShares);
        setValue("total", value);
    };

    const userNameFromEmail = (email: string) => {  //Change api-client function to show full name instead of username
        let candidate = userOptions.find(option => option.value === email);
        return candidate ? candidate.label : null;
    };

    return (
        <div className="flex flex-col gap-4">
            
            {/* Total and shares*/}
            <div className='flex flex-row gap-2'>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Total Amount
                    <NumericFormat
                        value={getValues("total") || 0}
                        onValueChange={({ floatValue }) => handleTotalAmountChange(floatValue ?? 0)}
                        className="border rounded py-1 px-2 font-normal"
                        thousandSeparator={true}
                        prefix='€'
                        allowNegative={true}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        placeholder="€0.00"
                    />
                </label>
                <label className="text-gray-700 text-sm font-bold flex-1">
                    Payed by
                    <input
                        type="text"
                        className="border rounded py-1 px-2 font-normal"
                        value={userNameFromEmail(shares[0]?.email) || ""}
                        disabled
                    />
                </label>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            {/* Shares */}
            {shares.map((share, index) => (
                <div key={index} className="flex gap-4 items-center relative">
                    {/* Remove user button */}
                    {index !== 0 && (
                        <button
                            type="button"
                            onClick={() => handleRemoveUser(index)}
                            className="text-red-500 font-bold px-2"
                        >
                            X
                        </button>
                    )}

                    {/* User selection, payer is unchangeable*/}
                    {index === 0 ? (
                        <input
                            type="text"
                            className="border rounded py-1 px-2 font-normal"
                            value="Payer Share"
                            disabled
                        />
                    ) : (
                        <Select
                            options={userOptions}
                            onChange={(selectedOption) => handleSelectUser(index, selectedOption)}
                            isClearable
                            placeholder="Select User"
                            className="w-full"
                            value={userOptions.find(option => option.value === share.email) || null}
                        />
                    )}

                    {/* Share amount*/}
                    <NumericFormat
                        value={share.amount}
                        onValueChange={({ floatValue }) => handleChangeAmount(index, floatValue ?? 0)}
                        className="border rounded py-1 px-2 font-normal w-24" // Width issues on small screens
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
                            disabled={loading}
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
