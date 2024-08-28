//At the moment shows all expenses in a single scroll,
//implement "show more" button

import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useAppContext } from '../contexts/AppContext';
import { fetchExpenses, fetchUsers } from '../api-client';
import { ExpenseType } from '../../../backend/src/models/expense';
import { Link, useNavigate } from "react-router-dom";
import Select from 'react-select';

const ExpensesPage: React.FC = () => {
    const { showToast } = useAppContext();
    const navigate = useNavigate();
    const [loadingUsers, setLoadingUsers] = useState<boolean>(true);
    const [usersError, setUsersError] = useState<string | null>(null);
    const [userOptions, setUserOptions] = useState<{ value: string; label: string }[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedMonth, setSelectedMonth] = useState<string>('');
    const [selectedUser, setSelectedUser] = useState<{ value: string; label: string } | null>(null);

    const fetchExpensesData = async () => {
        const expenses: ExpenseType[] = await fetchExpenses(searchQuery, (selectedYear.length === 4) ? selectedYear : "", (0 < parseInt(selectedMonth) && parseInt(selectedMonth) < 13) ? selectedMonth : "");
        let filteredExpenses = expenses;
        // Apply filtering on the frontend based on the selected user
        if (!!selectedUser) {
            filteredExpenses= expenses.filter(expense =>
                expense.payer === selectedUser.value || expense.others.some(other => other.email === selectedUser.value)
            );
        }

        //backend does not support search for query and date, so we implement it here

        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filteredExpenses = filteredExpenses.filter(expense =>
                expense.name.toLowerCase().includes(lowerCaseQuery) ||
                expense.category.toLowerCase().includes(lowerCaseQuery)
            );
        }
        return filteredExpenses;
    };

    const { data: expenses, error, isLoading } = useQuery<ExpenseType[]>(
        ['expenses', searchQuery, selectedYear, selectedMonth, selectedUser],
        fetchExpensesData,
        {
            keepPreviousData: true,
        }
    );

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const options = await fetchUsers();
                setUserOptions(options);
            } catch (error) {
                setUsersError("Failed to load users");
                console.error('Error fetching users:', error);
            } finally {
                setLoadingUsers(false);
            }
        };
        loadUsers();
    }, []);

    if (isLoading) {
        return <div>Loading expenses...</div>;
    }
    if (loadingUsers) {
        return <div>Loading users...</div>;
    }

    if (error) {
        showToast({ message: "Failed to load expenses", type: 'ERROR' });
        setSearchQuery("");
        setSelectedMonth("");
        setSelectedYear("")
        return <div>We are sorry, there was an error loading the expenses. If this page does not reload on its own, plese go back to the homepage.</div>;
    }

    if (usersError) {
        showToast({ message: "Failed to load users", type: 'ERROR' });
        return <div>Error loading users. Please refresh tha page and contact the administrator if this does not go away.</div>;
    }

    const userNameFromEmail = (email: string) => {
        const candidate = userOptions.find(option => option.value === email);
        return candidate ? candidate.label : null;
    };

    return (
        <div className="space-y-4 mx-2">
            <h1 className="text-2xl font-bold">Your Expenses</h1>
            <div className="input-fields flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mx-2">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div className="flex flex-1 space-x-0">
                    <input
                        type="number"
                        placeholder="Year"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="border p-2 rounded-l w-full"
                    />
                    <input
                        type="number"
                        placeholder="Month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="border p-2 rounded-r w-full"
                    />
                </div>
                <div className="flex-1">
                    <Select
                        value={selectedUser}
                        onChange={(selectedOption) => setSelectedUser(selectedOption)}
                        options={userOptions}
                        isClearable
                        placeholder="Select a user"
                        className="w-full"
                    />
                </div>
            </div>

            {expenses && expenses.length > 0 ? (
                <ul className="space-y-4 ">
                    {expenses.map(expense => (
                        <li key={expense._id} className="border p-6 rounded-lg shadow-lg t ">
                            <h2 className="text-2xl font-bold mb-4 text-wrap break-words">{expense.name}</h2>
                            <div className="flex flex-wrap gap-4 mb-4">
                                <span className="whitespace-nowrap">Date: {new Date(expense.date).toLocaleDateString()}</span>
                                <span className="whitespace-nowrap">Category: {expense.category}</span>
                                <span className="whitespace-nowrap">Payed by: {userNameFromEmail(expense.payer)}</span>
                            </div>
                            <table className="table-fixed w-full mb-4">
                                <tbody>
                                    {expense.others.map(other => (
                                        <tr key={other.email} className="border-t">
                                            <td className="py-2">{userNameFromEmail(other.email)}</td>
                                            <td className="py-2 text-right">€{other.amount.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t">
                                        <td className="py-2 font-bold">Total</td>
                                        <td className="py-2 text-right font-bold">€{expense.total.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                            <div className='lg:flex lg:flex-row lg:justify-end'>
                            <button
                                onClick={() => navigate(`/update-expense/${expense._id}`, { state: expense })}
                                className="mt-2 bg-blue-500 text-white p-2 rounded "
                            >
                                Edit
                            </button></div>
                        </li>
                    ))}
                </ul>
            ) : (
                <span className="flex flex column justify-between">
                    <p>No expenses found. </p>
                    <Link className="underline text-blue-600 hover:text-blue-200" to="/add-expense">Add another expense right now!</Link>
                </span>
            )}
        </div>
    );
};

export default ExpensesPage;
