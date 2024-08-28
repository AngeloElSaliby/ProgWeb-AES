import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useQuery } from 'react-query';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

interface UserBalance {
    with: string;
    balance: {
        owedToUser: string;
        owedByUser: string;
    };
}

const fetchBalanceData = async () => {
    const response = await fetch('/api/balance');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

const Balance: React.FC = () => {
    const { data, error, isLoading } = useQuery('balanceData', fetchBalanceData);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    const globalBalance = data.find((item: UserBalance) => item.with === 'all')?.balance || { owedToUser: '0', owedByUser: '0' };

    const userBalances = data.filter((item: UserBalance) => item.with !== 'all');

    const hasOwedToOthersData = parseFloat(globalBalance.owedByUser) > 0 || parseFloat(globalBalance.owedToUser) > 0;
    const hasOwedToOthersByUserData = userBalances.some((item: UserBalance) => parseFloat(item.balance.owedByUser) > 0);
    const hasOwedByOthersByUserData = userBalances.some((item: UserBalance) => parseFloat(item.balance.owedToUser) > 0);

    // Prepare data for the charts
    const chartDataOwedToOthers = {
        labels: ['Owed to Me', 'Owed to Others'],
        datasets: [
            {
                label: 'Total Balance',
                data: [parseFloat(globalBalance.owedToUser), parseFloat(globalBalance.owedByUser)],
                backgroundColor: ['green', 'red'],
            },
        ],
    };
    
    //Unique colors for users in graphs to improve 
    const colorMap: Record<string, string> = {};
    const getColor = (user: string) => {
        if (!colorMap[user]) {
            colorMap[user] = `#${Math.floor(Math.random() * 16777215).toString(16)}`; //max RGB
        }
        return colorMap[user];
    };

    const chartDataOwedByOthersByUser = {
        labels: userBalances.filter((item: UserBalance) => parseFloat(item.balance.owedToUser) > 0).map((item: UserBalance) => item.with),
        datasets: [
            {
                label: 'Owed by',
                data: userBalances.filter((item: UserBalance) => parseFloat(item.balance.owedToUser) > 0).map((item: UserBalance) => parseFloat(item.balance.owedToUser)),
                backgroundColor: userBalances.filter((item: UserBalance) => parseFloat(item.balance.owedToUser) > 0).map((item:UserBalance) => getColor(item.with)), //rescaling to max rgb
            },
        ],
    };

    const chartDataOwedToOthersByUser = {
        labels: userBalances.filter((item: UserBalance) => parseFloat(item.balance.owedByUser) > 0).map((item: UserBalance) => item.with),
        datasets: [
            {
                label: 'Owed to',
                data: userBalances.filter((item: UserBalance) => parseFloat(item.balance.owedByUser) > 0).map((item: UserBalance) => parseFloat(item.balance.owedByUser)),
                backgroundColor: userBalances.filter((item: UserBalance) => parseFloat(item.balance.owedByUser) > 0).map((item:UserBalance) => getColor(item.with)),
            },
        ],
    };
    const DouStyle = 'mx-auto lg:w-1/2 '
    const CardStyle = "flex-1 border lg:p-6 sm:p-1 md:p-3 rounded-lg shadow-lg"
    return (
        <div className="space-y-8 p-4 lg:w-3/4 mx-auto">
            <h1 className="text-2xl font-bold">Balance Breakdown</h1>

            <div className="flex flex-col space-y-8">
                <div className={CardStyle}>
                    <h2 className="text-xl font-semibold mb-2">Total Balance</h2>
                    <h3 className="text-l font-semibold">You owe: €{globalBalance.owedByUser}, you are owed €{globalBalance.owedToUser}</h3>
                    {hasOwedToOthersData ? (
                        <div className={DouStyle}>
                            <Doughnut data={chartDataOwedToOthers} />
                        </div>
                    ) : (
                        <p>You owe no one, and no one owes you.</p>
                    )}
                </div>

                <div className={CardStyle}>
                    <h2 className="text-xl font-semibold mb-2">Owed to Me (by Others)</h2>
                    {hasOwedByOthersByUserData ? (
                        <>
                            <div className={DouStyle}>
                            <Doughnut data={chartDataOwedByOthersByUser} />
                            </div>
                            <table className="mt-4 w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 p-2 text-left">User</th>
                                        <th className="border border-gray-300 p-2 text-right">Owes you</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userBalances
                                        .filter((item: UserBalance) => parseFloat(item.balance.owedToUser) > 0)
                                        .map((item: UserBalance, index: number) => (
                                            <tr key={index}>
                                                <td className="border border-gray-300 p-2">{item.with}</td>
                                                <td className="border border-gray-300 p-2 text-right">{item.balance.owedToUser}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <p>No one owes you.</p>
                    )}
                </div>

                <div className={CardStyle}>
                    <h2 className="text-xl font-semibold mb-2">Owed by Me (to Others)</h2>
                    {hasOwedToOthersByUserData ? (
                        <>
                            <div className={DouStyle}>
                            <Doughnut data={chartDataOwedToOthersByUser} />
                            </div>
                            <table className="mt-4 w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 p-2 text-left">To</th>
                                        <th className="border border-gray-300 p-2 text-right">You owe</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userBalances
                                        .filter((item: UserBalance) => parseFloat(item.balance.owedByUser) > 0)
                                        .map((item: UserBalance, index: number) => (
                                            <tr key={index}>
                                                <td className="border border-gray-300 p-2">{item.with}</td>
                                                <td className="border border-gray-300 p-2 text-right">{item.balance.owedByUser}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </>
                    ) : (
                        <p>You owe no one.</p>
                    )}
                </div>
            </div>
        </div>
        
    );
};

export default Balance;
