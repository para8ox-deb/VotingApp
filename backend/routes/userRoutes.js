const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtAuthMiddleware, generateToken} = require('./../jwt');


// POST route to add a person
router.post('/signup', async (req,res) =>{

    try{
        const data = req.body  // Assuming the request body contains the User data

        // Create a new User document using the Mongoose model
        const newUser = new User(data);
        

        // Below method is also right and is used to save data but if we have many fields so it is very slow, that's why we can directly pass data to person like done above.

        // newPerson.name = data.name; 
        // newPerson.age = data.age;
        // newPerson.mobile = data.mobile;


        // Save the new user to the database

        const response = await newUser.save()
        console.log('data saved');

        // we are sending only id in payload, not aadhar coz if someone get token than he can find his/her aadhar no
        const payload = {
            id: response.id,    // this id is the unique id of mongodb
        }


        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token is: ",token);


        res.status(200).json({response: response, token: token});

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }

})



// Login Route

router.post('/login', async(req,res)=>{
    try{
        // Extract aadharCardNumber and password from request body
        const {aadharCardNumber, password} = req.body;

        //Find the user by aadharCardNumber
        const user = await User.findOne({aadharCardNumber: aadharCardNumber});
        // console.log(user);
        //If user does not exist or password does not match, return error
        if( !user || !(await user.comparePassword(password))){
            return res.status(401).json({error: 'Invalid username or password'});
        }

        // Generate token
        const payload = {
            id : user.id,
        };

        const token = generateToken(payload);

        //return token as response
        res.json({token});
    }catch(err){
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
})


/* FROM CHATGPT WAALA
router.post('/login', async (req, res) => {
    try {
        // Log the entire request body
        console.log('Request Body:', req.body);

        // Extract username and password from request body
        const { username, password } = req.body;
        console.log('Login attempt with username:', username);

        // Find the user by username
        const user = await Person.findOne({ username: username });
        console.log('User found:', user);

        // If user does not exist or password does not match, return error
        if (!user || !(await user.comparePassword(password))) {
            console.log('Invalid username or password');
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate token
        const payload = {
            id: user.id,
            username: user.username
        };

        const token = generateToken(payload);

        // Return token as response
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
*/




// Profile route
router.get('/profile',jwtAuthMiddleware, async(req,res)=>{
    try{
        const userData = req.user;
        // console.log("User Data", userData);

        const userId = userData.id;
        const user = await User.findById(userId);

        res.status(200).json({user});
    }catch(err){
        console.error(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
} )





// Update Operation
// Which record to update and what exactly to update

// For update we can use any PUT or PATCH, we will use PUT

// In our collection, the most unique is _id or document id or id that mongo automatically puts with each field or data


router.put('/profile/password',jwtAuthMiddleware, async (req,res)=>{
    try{
        const userId = req.user.id; //Extract the id from the token
        
        const {currentPassoword, newPassoword} = req.body; //Extract current and new password from request body

         //Find the user by user id
         const user = await User.findById(userId);
        
         //If password does not match, return error
        if(!(await user.comparePassword(currentPassoword))){
            return res.status(401).json({error: 'Invalid username or password'});
        }
    

        //update the user's password

        user.password = newPassoword;
        await user.save();


        console.log('password updated');
        res.status(200).json({message: "Password updated"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// NOTE - above /:id so here id is variable, in which the client will send the data and it will be stored in this id, so instead of id we can use any name like aakash, person_id anything.




module.exports = router;