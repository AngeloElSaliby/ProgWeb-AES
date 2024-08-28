// expenses api endpoints (/api/budget)
// post on  ./, delete, post on ./:year/:month/:id, get on ./search?q=query
// get on ./, ./:year, ./:year/:month, ./:year/:month/:id

import express, { Request, Response } from "express";
import Expense, { ExpenseType } from "../models/expense";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";
import User from "../models/user";

const router = express.Router();

//Maybe there is a way to integrate this in the mongoose schema?
const usersExist = async (others:{email:string, amount:number}[]) =>{
    for( const other of others){
        const exists = await User.findOne({email: other.email});
        if(!exists){
            return false
        }
    }
    return true
} 

router.post("/",
    verifyToken, [
        body("name").notEmpty().withMessage("Name is required"),
        body("total").notEmpty().isNumeric().withMessage("Total is required and must be a number"),
        body("date").notEmpty().withMessage("Date is required"),
        body("category").notEmpty().withMessage("Category is required"),
        body("others").notEmpty().withMessage("others array must at least contain creating user")
    ],
    async (req: Request, res: Response) => {
        try {
            let isDate = new Date()
            let parsedYear:number;
            try{
                isDate = new Date(req.body.date);
                parsedYear = parseInt(req.body.date.split("-")[0]);
                if(parsedYear < 1970 || parsedYear> 9999){
                    return res.status(400).json({message: "Year is invalid, must be between 1970 and 9999"})
                }
            }catch(e){
                return res.status(400).json({message : "Date is invalid. Provide YYYY-MM-DD and 999<YYYY<9999"})
            }

            const userAreValid = await usersExist(req.body.others)
            if(!userAreValid){
                return res.status(400).json({message:"Cannot add expense against unregistered users"})
            }
            const newExpense: ExpenseType = req.body;
            newExpense.lastUpdated = new Date();
            newExpense.payer = req.email;

            const expense = new Expense(newExpense);
            await expense.save();

            res.status(201).send(expense);

            //catch db errors and formulate response accordingly, now some invalid requests give a 500 status
        } catch (e) { 
            console.error("Error creating expense:", e);
            return res.status(500).json({ message: "Something went wrong creating the expense" });
        }
    }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const email = req.email;

        // Find expenses where requiring user is participating
        const expenses = await Expense.find({
            $or: [
                { payer: email }, // User is the primary user, this is actually useless at the momenth because payer is creating user and is always in the others array, but it could change
                { "others.email": email } // User is in the "others" array
            ]
        });

        return res.status(200).json(expenses);
    } catch (e) {
        console.error("Error fetching expenses:", e);
        return res.status(500).json({ message: "Something went wrong fetching the expenses" });
    }
});

router.get('/search', verifyToken, async (req: Request, res: Response) => {
    const {q} = req.query;

    // Error if no query parameter is provided
    if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Query parameter 'q' is required and must be a string." });
    }

    try {
        const userEmail = req.email;

        // Case insensitive
        const searchQuery = new RegExp(q, 'i');

        // Find expenses where the userId is part of the expense AND match for regexp
        const expenses = await Expense.find({
            $and: [
                {
                    $or: [
                        { payer: userEmail }, 
                        { "others.email": userEmail }
                    ]
                },
                {
                    $or: [
                        { name: searchQuery }, 
                        { category: searchQuery } 
                    ]
                }
            ]
        });

        return res.status(200).json(expenses);
    } catch (e) {
        console.error("Error searching expenses:", e);
        return res.status(500).json({ message: "Something went wrong searching the expenses" });
    }
});

router.get("/:year/:month/:id", verifyToken, async (req: Request, res: Response) => {
    const { year, month, id } = req.params;
    try {
        //Validate year and month
        let startDate = new Date();
        let endDate = new Date();
        try {
            startDate = new Date(parseInt(year), parseInt(month)-1) //Month index starts at 0... :(
            endDate = new Date(parseInt(year), parseInt(month))
            
        }catch (e){
            console.error(`Recieved as year: ${year}, as month: ${month}, as id:${id}. Computed: startDate:${startDate}, endDate: ${endDate}`);
            console.error(e);
            return res.status(400).json({message: "Year or month are invalid."});
        }
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({message: "Year or month are invalid."})
        }

        // Find the expense by ID and ensure it's in the correct month and year
        const expense = await Expense.findOne({
            _id: id,
            "others.email": req.email,  // Ensure requiring user is a participant
            date: {
                $gte: startDate,
                $lt: endDate // Ensure it's within the month
            }
        });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found for this month and year, or you are not a partecipating user in the expense' });
        }

        return res.status(200).json(expense);
    } catch (e) {
        console.error("Error fetching expenses:", e);
        return res.status(500).json({ message: "Something went wrong fetching the expenses" });
    }
});

router.get("/:year/:month", verifyToken, async (req: Request, res: Response) => {
    const { year, month } = req.params;

    try {
        let startDate = new Date();
        let endDate = new Date();
        try {
            startDate = new Date(parseInt(year), parseInt(month)-1) //Month index starts at 0... :(
            endDate = new Date(parseInt(year), parseInt(month))
        }catch (e){
            console.error("Error fetching expense. ", e)
             
            
        }

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({message: "Year or month are invalid."})
        }
        // Find the expense by ID and ensure it's in the correct month and year
        const expenses = await Expense.find({
            "others.email": req.email,  // Ensure the expense belongs to the logged-in user
            date: {
                $gte: startDate,
                $lte: endDate
            }
        });

        return res.status(200).json(expenses);
    } catch (e) {
        console.error(`Error fetching expenses at ${req.protocol}://${req.get('host')}${req.originalUrl}. Got the following error:`, e);
        return res.status(500).json({ message: "Something went wrong fetching the expenses" });
    }
});


router.get("/:year", verifyToken, async (req: Request, res: Response) => {
    const { year } = req.params;

    try {
        // Validate and parse the year
        const parsedYear = parseInt(year);
        if (isNaN(parsedYear) || parsedYear < 1000 || parsedYear > 9999) {
            return res.status(400).json({ message: "Year is invalid. Range is 1000-9999." });
        }

        // Set startDate to January 1st of the given year
        const startDate = new Date(parsedYear, 0, 1); // January is month 0

        // Set endDate to December 31st of the given year
        const endDate = new Date(parsedYear+1,0,0); // December is month 11

        // Find expenses for the entire year
        const expenses = await Expense.find({
            "others.email": req.email, // Ensure the expense belongs to the logged-in user
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        return res.status(200).json(expenses);
    } catch (e) {
        console.error(`Error fetching expenses:`, e);
        return res.status(500).json({ message: "Something went wrong fetching the expenses" });
    }
});


router.put('/:year/:month/:id', verifyToken, async (req: Request, res: Response) => {
    const { year, month, id } = req.params;
    const { name, others, total, date, category } = req.body;

    try {
        //validate year and month
        let startDate = new Date();
        let endDate = new Date();
        let parsedYear :number;
        try {
            startDate = new Date(parseInt(year), parseInt(month)-1) //Month index starts at 0... :(
            endDate = new Date(parseInt(year), parseInt(month))
            parsedYear = parseInt(date.split("-")[0]);
            if(parsedYear < 1970 || parsedYear >9999){
                return res.status(400).json({message: "Year is invalid, must be between 1970 and 9999"})
            }
            
        }catch (e){
            return res.status(400).json({message: "Year or month are invalid."})
            console.error("Error fetching expense. ", e)
            console.error(`startDate:${startDate}, endDate: ${endDate}`);
        }
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({message: "Year or month are invalid."})
        }

        // Find the expense by ID and ensure it's in the correct month and year
        const expense = await Expense.findOne({
            _id: id,
            "others.email": req.email,  // Ensure the expense belongs to the logged-in user
            date: {
                $gte: startDate,
                $lt: endDate 
            }
        });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found for this month and year, or you are not a partecipating user. Cannot modify expense' });
        }

        // Update the fields with the new data, if provided
        expense.name = name || expense.name;
        expense.others = others || expense.others;
        expense.total = total || expense.total;
        expense.date = date ? new Date(date) : expense.date; 
        expense.category = category || expense.category;

        // Update the lastUpdated field, could be useless after implementation in mongoose schema
        expense.lastUpdated = new Date();  

        // Save the updated expense
        await expense.save();

        return res.status(200).json(expense);
    } catch (e) {
        console.error('Error updating expense:', e);
        return res.status(500).json({ message: 'Something went wrong updating the expense' });
    }
});

// DELETE request to delete an expense
router.delete("/:year/:month/:id", verifyToken, async (req: Request, res: Response) => {
    const { year, month, id } = req.params;

    try {
        //validate year and month
        let startDate = new Date();
        let endDate = new Date();
        try {
            startDate = new Date(parseInt(year), parseInt(month)-1) //Month index starts at 0... :(
            endDate = new Date(parseInt(year), parseInt(month))
            
        }catch (e){
            console.error("Error fetching expense. ")
            console.error(`startDate:${startDate}, endDate: ${endDate}`);
            return res.status(400).json({message: "Year or month are invalid."})
            
        }
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({message: "Year or month are invalid."})
        }
        
        // Find the expense by ID and ensure it's in the correct month and year
        const expense = await Expense.findOneAndDelete({
            _id: id,
            "others.email": req.email, // Ensure the expense belongs to the logged-in user
            date: {
                $gte: startDate,
                $lt: endDate, // Ensure it's within the year-month provided
            },
        });

        if (!expense) {
            return res.status(404).json({ message: "Expense not found or already deleted" });
        }

        return res.status(200).json({ message: "Expense deleted successfully" });
    } catch (e) {
        console.error("Error deleting expense:", e);
        return res.status(500).json({ message: "Something went wrong deleting the expense" });
    }
});






export default router;
