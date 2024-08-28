// balance/, balance/:user  api endpoints

import express, { Request, Response } from "express";
import Expense, { ExpenseType } from "../models/expense";
import User from "../models/user";
import verifyToken from "../middleware/auth";

const router = express.Router();


const calculateBalance = (expenses: ExpenseType[], userEmail: string, otherUser: string) => {
    let owedToUser = 0;
    let owedByUser = 0;

    for (const expense of expenses) {
        if (expense.payer === userEmail) {
            // User is the creator of the expense
            for (const participant of expense.others) {
                if (participant.email !== userEmail) {
                    if (otherUser === "" || otherUser === participant.email) {
                        owedToUser += participant.amount;
                    }
                }
            }
        } else {
            // User is a participant in the expense
            const participant = expense.others.find(p => p.email === userEmail);
            if (participant && (otherUser === "" || expense.payer === otherUser)) {
                owedByUser += participant.amount;
            }
        }
    }

    return {
        owedToUser: owedToUser.toFixed(2),
        owedByUser: owedByUser.toFixed(2)
    };
};



// Get balance
router.get("/:email", verifyToken, async (req: Request, res: Response) => {
    try {
        const userEmail = req.email;
        const { email } = req.params;

        const paidByMe = await Expense.find({ $and: [{ payer: userEmail }, { "others.email": email }] });

        const paidByThem = await Expense.find({
            $and: [
                { payer: email }, // Creator is someone else
                { "others.email": userEmail }      // Logged-in user is in the "others" array
            ]
        });

        const balance = calculateBalance([...paidByMe, ...paidByThem], userEmail, email)

        res.status(200).json(balance).send();
    }
    catch (e) {
        console.error(`Error fetching balance against ${req.params.email}`, e);
        res.status(500).json({ message: `Something went wrong fetching the balance against ${req.params.email}` });
    }

})

router.get("/", verifyToken, async (req: Request, res: Response) => {
    try {
        const userEmail = req.email;

        // Find expenses where the logged-in user is the creator
        const paidByMe = await Expense.find({ payer: userEmail });

        // Find expenses where the logged-in user is a participant
        const paidByOthers = await Expense.find({
            $and: [
                { payer: { $ne: userEmail } }, // Creator is someone else
                { "others.email": userEmail }      // Logged-in user is in the "others" array
            ]
        });



        // Find all users that have at least one expense with the logged-in user
        const otherUsersIds = new Set([...paidByMe.flatMap(exp => [exp.payer, ...exp.others.map(o => o.email)]), //flatMap to merge all the arrays we get back
        ...paidByOthers.flatMap(exp => [exp.payer, ...exp.others.map(o => o.email)])]);
        otherUsersIds.delete(userEmail); // Remove the current user from the list, it is always in the others array

        const users = await User.find({ email: { $in: Array.from(otherUsersIds) } });

        // Calculate balance for each user
        const userBalances = await Promise.all(users.map(async (user) => { //Wait for all the promises to resolve
            const otherUser = user.email;

            const balance = calculateBalance([...paidByMe, ...paidByOthers], userEmail, otherUser);

            return {
                with: user.email,
                balance
            };
        }));

        // Calculate global balance
        let globalBalance = { owedToUser: 0, owedByUser: 0 };
        for (const userBalance of userBalances) {
            const owedToUser = parseFloat(userBalance.balance.owedToUser);
            const owedByUser = parseFloat(userBalance.balance.owedByUser);
            if (owedToUser - owedByUser > 0) { //User is owed 
                globalBalance.owedToUser += owedToUser - owedByUser
            } else {
                globalBalance.owedByUser += owedByUser - owedToUser
            }
        }



        // Add global balance to the response
        userBalances.push({
            with: 'all',
            balance: { owedByUser: globalBalance.owedByUser.toFixed(2), owedToUser: globalBalance.owedToUser.toFixed(2) }
        });

        // Return the computed balances
        res.status(200).json(userBalances);
    } catch (e) {
        console.error("Error fetching balances:", e);
        res.status(500).json({ message: "Something went wrong fetching the balances" });
    }
});

export default router;
