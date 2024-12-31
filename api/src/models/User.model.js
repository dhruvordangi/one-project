import mongoose, { Schema } from "mongoose";

const userSchema=new Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    aura_points:{
        type:Number,
        default:0
    },
    avatar:{
        type:String,
    },
    Assignments:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Assignment',
        }
    ],

},{timestamps:true})

// Ensure default empty array for Assignments
userSchema.path('Assignments').default(() => []);


export const User=mongoose.model("User",userSchema);