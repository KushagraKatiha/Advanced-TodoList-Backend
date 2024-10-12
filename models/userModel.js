import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    }, 

    email:{
        type: String,
        required: true,
        trim: true
    },

    type:{
        type: String, 
        required: true,
        enum: ['student', 'teacher'],
        default: 'student'
    }, 

    password:{
        type: String,
        required: true,
        minLength: [6, 'Password must be at least 6 characters long'],
        select: false
    },

    profileImg:{
        type: String,   // cloudinary url
        default: null
    },

    forgetPasswordToken:{
        type: String,
        default: null
    },
    
    forgetPasswordTokenExpiry:{
        type: Date,
        default: null
    }

}, { timestamps: true })

// Encrypt password before saving to database
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) next()
    
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

// generate a method to create forgetPasswordToken
userSchema.methods.generateForgetPasswrodToken = async function(){
    const forgetPasswordToken = uuidv4()
    const salt = await bcrypt.genSalt(10)
    const hashedToken = await bcrypt.hash(forgetPasswordToken, salt)

    this.forgetPasswordToken = hashedToken
    this.forgetPasswordTokenExpiry = Date.now() + 10 * 60 * 1000 // 10 minutes
}

// Create a method to compare the password entered by the user with the hashed password in the database
userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

export default mongoose.model('User', userSchema)