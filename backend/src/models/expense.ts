//Expense schema for mongoose validation

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
    lastUpdated: {type: Date, required : true} //Should add presave update of this field

})

//Did not have time to thoroughly test
// expenseSchema.pre("save", async function(next) {
//     if(this.isModified()) { //not suer isModified() checks all fields
//         this.lastUpdated = new Date();
//     }
//     next();
// })

const Expense = mongoose.model<ExpenseType>("Expense", expenseSchema)

export default Expense;