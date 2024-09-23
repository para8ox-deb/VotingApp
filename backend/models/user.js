const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Define the user schema
const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        type: String,
        required: true
    },
    aadharCardNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    },
});




// this pre is a middleware function and it triggers just before the save operation in mongodb
userSchema.pre('save', async function(next){
    const person = this; // it denotes that for each record the data of person comes in this variable person

    // hash the password only if it has been modified (or it is new)
    if(!person.isModified('password')) return next();

    try{
        //hash password generation
        const salt = await bcrypt.genSalt(10);

        //hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);

        //Override the plain password with the hashed one
        person.password = hashedPassword;

        next(); // it's a callback function provided by mongoose and it gives a signal that all work are done, now you can save the data in db
    }catch(err){
        return next(err);
    }
})


userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        // Use bcrypt to compare the provided password with the hashed password

        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }catch(err){
        throw err;
    }
}


const User = mongoose.model('User', userSchema);
module.exports = User;