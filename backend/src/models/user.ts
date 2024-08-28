import mongoose from "mongoose";
import bcrypt from "bcryptjs";
export type UserType = { //this is moslty for intellisense in frontend
    _id :string; 
    email: string;
    password:string;
    firstName : string;
    lastName : string;
}

const userSchema = new mongoose.Schema({ //the id is added by the shema
    email: {type : String //in typescript "string" is lower case, but in mongoose schema it is capital!
        , required:true, unique: true }, //cant have duplicate mails 
    password:{ type:String, required:true},
    firstName:{ type:String, required:true},
    lastName:{ type:String, required:true},
    dateOfBirth : {type: Date, required : false}
});


//Mongodb middleware to hash passwords
userSchema.pre("save", async function(next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
})

const User = mongoose.model<UserType>("User", userSchema);



export default User;