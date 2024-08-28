import mongoose from "mongoose";

export type ExpenseType = {
    _id: string;
    payer: string;
    name: string;
    others: {email: string, amount: number}[];
    total : number;
    date: Date;
    category : string;
    lastUpdated:  Date;
}

const expenseSchema = new mongoose.Schema<ExpenseType>({
    payer : {type : String, required : true},
    name : {type : String, required : true},
    others : {type : [{email: String, amount : Number}], required : true},
    total: {type:Number, required : true, min: 0},
    date: {type : Date, required: true},
    category: {type: String, required : true},
    lastUpdated: {type: Date, required : true}

})

const Expense = mongoose.model<ExpenseType>("Expense", expenseSchema)

export default Expense;