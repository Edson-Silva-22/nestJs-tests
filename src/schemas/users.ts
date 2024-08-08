import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    age: Number
}, {timestamps: true})

const User = mongoose.model('User', userSchema)
export default User