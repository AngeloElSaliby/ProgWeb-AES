import User from "./models/user";  
import Expense from "./models/expense";  

// Courtesy of chatgpt :)
const users = [
    {
        email: "john123",
        password: "password123",
        firstName: "John",
        lastName: "Doe",
    },
    {
        email: "jane456",
        password: "password123",
        firstName: "Jane",
        lastName: "Smith",
    },
    {
        email: "alice789",
        password: "password123",
        firstName: "Alice",
        lastName: "Johnson",
    },
    {
        email: "bob321",
        password: "password123",
        firstName: "Bob",
        lastName: "Brown",
    },
    {
        email: "charlie654",
        password: "password123",
        firstName: "Charlie",
        lastName: "Green",
    },
    {
        email: "diana987",
        password: "password123",
        firstName: "Diana",
        lastName: "White",
    },
    {
        email: "edward123",
        password: "password123",
        firstName: "Edward",
        lastName: "Black",
    },
    {
        email: "fiona456",
        password: "password123",
        firstName: "Fiona",
        lastName: "Grey",
    },
];

// Prefixed categories on frontend
const categories = ["Food", "Transportation", "Entertainment", "Utilities", "Healthcare", "Other"];

const expenses = [
    {
        payer: "john123",
        name: "Groceries",
        others: [
            { email: "john123", amount: 10 },
            { email: "jane456", amount: 10 },
            { email: "alice789", amount: 10 }
        ],
        total: 30,
        date: new Date("2021-01-15"),
        category: "Food",
        lastUpdated: new Date()
    },
    {
        payer: "jane456",
        name: "Dinner Out",
        others: [
            { email: "jane456", amount: 20 },
            { email: "bob321", amount: 15 },
            { email: "charlie654", amount: 15 }
        ],
        total: 50,
        date: new Date("2022-02-25"),
        category: "Food",
        lastUpdated: new Date()
    },
    {
        payer: "bob321",
        name: "Gas",
        others: [
            { email: "bob321", amount: 7 },
            { email: "john123", amount: 7 },
            { email: "alice789", amount: 6 }
        ],
        total: 20,
        date: new Date("2022-03-10"),
        category: "Transportation",
        lastUpdated: new Date()
    },
    {
        payer: "alice789",
        name: "Movie Tickets",
        others: [
            { email: "alice789", amount: 8 },
            { email: "diana987", amount: 8 },
            { email: "edward123", amount: 8 }
        ],
        total: 24,
        date: new Date("2021-08-15"),
        category: "Entertainment",
        lastUpdated: new Date()
    },
    {
        payer: "john123",
        name: "Electric Bill",
        others: [
            { email: "john123", amount: 25 },
            { email: "fiona456", amount: 25 },
            { email: "jane456", amount: 25 }
        ],
        total: 75,
        date: new Date("2020-11-05"),
        category: "Utilities",
        lastUpdated: new Date()
    },
    {
        payer: "charlie654",
        name: "Doctor Visit",
        others: [
            { email: "charlie654", amount: 40 },
            { email: "bob321", amount: 40 },
            { email: "diana987", amount: 40 }
        ],
        total: 120,
        date: new Date("2023-07-06"),
        category: "Healthcare",
        lastUpdated: new Date()
    },
    {
        payer: "diana987",
        name: "Gym Membership",
        others: [
            { email: "diana987", amount: 20 },
            { email: "fiona456", amount: 20 },
            { email: "charlie654", amount: 20 }
        ],
        total: 60,
        date: new Date("2021-09-07"),
        category: "Healthcare",
        lastUpdated: new Date()
    },
    {
        payer: "fiona456",
        name: "Rent",
        others: [
            { email: "fiona456", amount: 400 },
            { email: "alice789", amount: 400 },
            { email: "john123", amount: 400 }
        ],
        total: 1200,
        date: new Date("2024-08-08"),
        category: "Other",
        lastUpdated: new Date()
    },
    {
        payer: "edward123",
        name: "Train Tickets",
        others: [
            { email: "edward123", amount: 10 },
            { email: "jane456", amount: 15 },
            { email: "bob321", amount: 15 }
        ],
        total: 40,
        date: new Date("2020-08-09"),
        category: "Transportation",
        lastUpdated: new Date()
    },
    {
        payer: "fiona456",
        name: "Concert",
        others: [
            { email: "fiona456", amount: 20 },
            { email: "diana987", amount: 20 },
            { email: "john123", amount: 20 }
        ],
        total: 60,
        date: new Date("2023-08-10"),
        category: "Entertainment",
        lastUpdated: new Date()
    },
    {
        payer: "bob321",
        name: "Water Bill",
        others: [
            { email: "bob321", amount: 20 },
            { email: "alice789", amount: 20 },
            { email: "jane456", amount: 20 }
        ],
        total: 60,
        date: new Date("2022-10-11"),
        category: "Utilities",
        lastUpdated: new Date()
    },
    {
        payer: "alice789",
        name: "Medication",
        others: [
            { email: "alice789", amount: 10 },
            { email: "charlie654", amount: 15 },
            { email: "john123", amount: 15 }
        ],
        total: 40,
        date: new Date("2023-08-12"),
        category: "Healthcare",
        lastUpdated: new Date()
    },
    {
        payer: "jane456",
        name: "Bus Pass",
        others: [
            { email: "jane456", amount: 7 },
            { email: "edward123", amount: 7 },
            { email: "bob321", amount: 6 }
        ],
        total: 20,
        date: new Date("2021-08-13"),
        category: "Transportation",
        lastUpdated: new Date()
    },
    {
        payer: "diana987",
        name: "Netflix Subscription",
        others: [
            { email: "diana987", amount: 5 },
            { email: "alice789", amount: 5 },
            { email: "john123", amount: 4 }
        ],
        total: 14,
        date: new Date("2020-08-14"),
        category: "Entertainment",
        lastUpdated: new Date()
    },
    {
        payer: "charlie654",
        name: "Groceries",
        others: [
            { email: "charlie654", amount: 25 },
            { email: "bob321", amount: 25 },
            { email: "fiona456", amount: 25 }
        ],
        total: 75,
        date: new Date("2024-08-15"),
        category: "Food",
        lastUpdated: new Date()
    },
    {
        payer: "edward123",
        name: "Cell Phone Bill",
        others: [
            { email: "edward123", amount: 20 },
            { email: "diana987", amount: 20 },
            { email: "alice789", amount: 20 }
        ],
        total: 60,
        date: new Date("2021-08-16"),
        category: "Utilities",
        lastUpdated: new Date()
    },
    {
        payer: "john123",
        name: "Dinner Out",
        others: [
            { email: "john123", amount: 20 },
            { email: "charlie654", amount: 20 },
            { email: "bob321", amount: 20 }
        ],
        total: 60,
        date: new Date("2022-05-01"),
        category: "Food",
        lastUpdated: new Date()
    },
    {
        payer: "fiona456",
        name: "Taxi Fare",
        others: [
            { email: "fiona456", amount: 10 },
            { email: "edward123", amount: 15 },
            { email: "jane456", amount: 15 }
        ],
        total: 40,
        date: new Date("2023-06-12"),
        category: "Transportation",
        lastUpdated: new Date()
    },
    {
        payer: "bob321",
        name: "Movie Night",
        others: [
            { email: "bob321", amount: 15 },
            { email: "diana987", amount: 15 },
            { email: "alice789", amount: 10 }
        ],
        total: 40,
        date: new Date("2021-07-20"),
        category: "Entertainment",
        lastUpdated: new Date()
    },
    {
        payer: "diana987",
        name: "Yoga Classes",
        others: [
            { email: "diana987", amount: 20 },
            { email: "jane456", amount: 20 },
            { email: "fiona456", amount: 20 }
        ],
        total: 60,
        date: new Date("2023-03-15"),
        category: "Healthcare",
        lastUpdated: new Date()
    },
    {
        payer: "alice789",
        name: "Groceries",
        others: [
            { email: "alice789", amount: 25 },
            { email: "john123", amount: 25 },
            { email: "edward123", amount: 25 }
        ],
        total: 75,
        date: new Date("2020-09-21"),
        category: "Food",
        lastUpdated: new Date()
    },
    {
        payer: "charlie654",
        name: "Utility Bill",
        others: [
            { email: "charlie654", amount: 30 },
            { email: "fiona456", amount: 30 },
            { email: "jane456", amount: 30 }
        ],
        total: 90,
        date: new Date("2022-12-30"),
        category: "Utilities",
        lastUpdated: new Date()
    },
    {
        payer: "john123",
        name: "Hotel Stay",
        others: [
            { email: "john123", amount: 50 },
            { email: "bob321", amount: 50 },
            { email: "charlie654", amount: 50 }
        ],
        total: 150,
        date: new Date("2021-11-11"),
        category: "Other",
        lastUpdated: new Date()
    },
    {
        payer: "jane456",
        name: "Birthday Dinner",
        others: [
            { email: "jane456", amount: 40 },
            { email: "diana987", amount: 40 },
            { email: "bob321", amount: 40 }
        ],
        total: 120,
        date: new Date("2024-01-14"),
        category: "Food",
        lastUpdated: new Date()
    },
    {
        payer: "edward123",
        name: "Museum Tickets",
        others: [
            { email: "edward123", amount: 15 },
            { email: "fiona456", amount: 15 },
            { email: "john123", amount: 15 }
        ],
        total: 45,
        date: new Date("2022-06-22"),
        category: "Entertainment",
        lastUpdated: new Date()
    },
    {
        payer: "bob321",
        name: "Bike Repair",
        others: [
            { email: "bob321", amount: 20 },
            { email: "charlie654", amount: 20 },
            { email: "edward123", amount: 20 }
        ],
        total: 60,
        date: new Date("2024-03-08"),
        category: "Transportation",
        lastUpdated: new Date()
    },
    {
        payer: "diana987",
        name: "Spa Day",
        others: [
            { email: "diana987", amount: 40 },
            { email: "jane456", amount: 40 },
            { email: "fiona456", amount: 40 }
        ],
        total: 120,
        date: new Date("2020-04-12"),
        category: "Healthcare",
        lastUpdated: new Date()
    },
    {
        payer: "alice789",
        name: "Concert Tickets",
        others: [
            { email: "alice789", amount: 25 },
            { email: "edward123", amount: 25 },
            { email: "john123", amount: 25 }
        ],
        total: 75,
        date: new Date("2021-10-03"),
        category: "Entertainment",
        lastUpdated: new Date()
    },
    {
        payer: "charlie654",
        name: "Dinner Party",
        others: [
            { email: "charlie654", amount: 40 },
            { email: "bob321", amount: 40 },
            { email: "diana987", amount: 40 }
        ],
        total: 120,
        date: new Date("2023-09-05"),
        category: "Food",
        lastUpdated: new Date()
    },
    {
        payer: "fiona456",
        name: "Internet Bill",
        others: [
            { email: "fiona456", amount: 25 },
            { email: "alice789", amount: 25 },
            { email: "charlie654", amount: 25 }
        ],
        total: 75,
        date: new Date("2024-05-13"),
        category: "Utilities",
        lastUpdated: new Date()
    },
    {
        payer: "edward123",
        name: "Car Maintenance",
        others: [
            { email: "edward123", amount: 50 },
            { email: "john123", amount: 50 },
            { email: "bob321", amount: 50 }
        ],
        total: 150,
        date: new Date("2023-02-18"),
        category: "Transportation",
        lastUpdated: new Date()
    },
    {
        payer: "john123",
        name: "Medical Checkup",
        others: [
            { email: "john123", amount: 30 },
            { email: "jane456", amount: 30 },
            { email: "fiona456", amount: 30 }
        ],
        total: 90,
        date: new Date("2021-01-25"),
        category: "Healthcare",
        lastUpdated: new Date()
    },
    {
        payer: "jane456",
        name: "Weekend Getaway",
        others: [
            { email: "jane456", amount: 50 },
            { email: "alice789", amount: 50 },
            { email: "charlie654", amount: 50 }
        ],
        total: 150,
        date: new Date("2022-10-30"),
        category: "Other",
        lastUpdated: new Date()
    },
    {
        payer: "bob321",
        name: "Furniture",
        others: [
            { email: "bob321", amount: 60 },
            { email: "john123", amount: 60 },
            { email: "alice789", amount: 60 }
        ],
        total: 180,
        date: new Date("2020-05-28"),
        category: "Other",
        lastUpdated: new Date()
    },
    {
        payer: "diana987",
        name: "Dog Grooming",
        others: [
            { email: "diana987", amount: 15 },
            { email: "jane456", amount: 15 },
            { email: "fiona456", amount: 15 }
        ],
        total: 45,
        date: new Date("2024-07-14"),
        category: "Other",
        lastUpdated: new Date()
    },
    {
        payer: "alice789",
        name: "Cab Fare",
        others: [
            { email: "alice789", amount: 10 },
            { email: "john123", amount: 10 },
            { email: "edward123", amount: 10 }
        ],
        total: 30,
        date: new Date("2021-11-18"),
        category: "Transportation",
        lastUpdated: new Date()
    },
    {
        payer: "charlie654",
        name: "Electronics",
        others: [
            { email: "charlie654", amount: 50 },
            { email: "bob321", amount: 50 },
            { email: "fiona456", amount: 50 }
        ],
        total: 150,
        date: new Date("2024-06-22"),
        category: "Other",
        lastUpdated: new Date()
    },
];


// Populate the database if no users exist
export const populateDB = async () => {
    try {
        // Check if users exist; if not, add them
        const existingUsers = await User.find({});
        if (existingUsers.length === 0) {
            for (const user of users) {
                const newUser = new User(user);
                await newUser.save(); // Ensure encryption of password
            }
            console.log("Users added to the database.");
        } else {
            console.log("Users already exist in the database.");
        }

        // Add expenses
        await Expense.insertMany(expenses);
        console.log("Expenses added to the database.");
        const allUsesrs = await User.find({});
        console.log(allUsesrs);
        return true
    } catch (error) {
        console.error("Error populating the database:", error);
        return false
    }
};

