const express = require('express');
const router = express.Router();
const Candidate = require('../models/candidate');
const {jwtAuthMiddleware, generateToken} = require('../jwt');
const User = require('../models/user');



const checkAdminRole = async (userID) => {
    try{
        const user = await User.findById(userID);
        if(user.role === 'admin'){            
            return true;
        }
    }catch(err){
        return false;
    }
}


// POST route to add a candidate
router.post('/',jwtAuthMiddleware, async (req,res) =>{

    try{
        if(! await checkAdminRole(req.user.id))
            return res.status(403).json({message: "user does not have admin role"});
        
        const data = req.body  // Assuming the request body contains the candidate data

        // Create a new User document using the Mongoose model
        const newCandidate = new Candidate(data);
        

        // Below method is also right and is used to save data but if we have many fields so it is very slow, that's why we can directly pass data to person like done above.

        // newPerson.name = data.name; 
        // newPerson.age = data.age;
        // newPerson.mobile = data.mobile;


        // Save the new user to the database

        const response = await newCandidate.save()
        console.log('data saved');

        res.status(200).json({response: response});

    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }

})




// Update Operation
// Which record to update and what exactly to update

// For update we can use any PUT or PATCH, we will use PUT

// In our collection, the most unique is _id or document id or id that mongo automatically puts with each field or data


router.put('/:candidateID',jwtAuthMiddleware, async (req,res)=>{

    
    try{

        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: "user does not have admin role"});

        
        const candidateID = req.params.candidateID; //Extract the id from the URL paramter
        const updatedCandidateData = req.body; // Extract the data which client sends for updation

        const response = await Person.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true, //return the updated document 
            runValidators: true, //run mongoose validation 
        });

        if(!response){
            return res.status(404).json({error: "Candidate not found"});
        }

        console.log('candidate data updated');
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// NOTE - above /:id so here id is variable, in which the client will send the data and it will be stored in this id, so instead of id we can use any name like aakash, person_id anything.




router.delete('/:candidateID',jwtAuthMiddleware, async (req,res)=>{

    
    try{

        if(!checkAdminRole(req.user.id))
            return res.status(403).json({message: "user does not have admin role"});

        
        const candidateID = req.params.candidateID; //Extract the id from the URL paramter

        const response = await Person.findByIdAndDelete(candidateID);


        if(!response){
            return res.status(404).json({error: "Candidate not found"});
        }

        console.log('candidate deleted');
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})








// LET's START VOTING

// router.post('/vote/:candidateID', jwtAuthMiddleware, async (req,res)=>{

//     // no admin can vote
//     // user can only vote once

//     candidateID = req.params.candidateID;
//     userId = req.user.id;

//     try{
//         // Find the candidate document with the specified candidateID

//         const candidate = await Candidate.findById(candidateID);
//         if(!candidate){
//             return res.status(404).json({message: "Candidate not found"});
//         }

//         const user = await User.findById(userId);
//         if(!user){
//             return res.status(404).json({message: "User not found"});
//         }

//         if(user.isVoted){
//             res.status(400).json({message: "You have already voted"});
//         }

//         if(user.role === 'admin'){
//             res.status(403).json({message: "Admin is not allowed"});
//         }

//         //Update the candidate document to record the vote
//         candidate.votes.push({user: userId})
//         candidate.voteCount++;

//         await candidate.save();


//         //update the user document
//         user.isVoted = true;
//         await user.save();


//         res.status(200).json({message : "Vote recorded successfully"});


//     }catch(err){
//         console.log(err);
//         res.status(500).json({error: 'Internal Server Error'});
//     }

// });







// GPT WALA


router.post('/vote/:candidateID', jwtAuthMiddleware, async (req, res) => {
    const candidateID = req.params.candidateID;
    const userId = req.user.id;

    try {
        // Find the candidate document with the specified candidateID
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVoted) {
            return res.status(400).json({ message: "You have already voted" }); // Add return here
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: "Admin is not allowed" }); // Add return here
        }

        // Update the candidate document to record the vote
        candidate.votes.push({ user: userId });
        candidate.voteCount++;

        await candidate.save();

        // Update the user document
        user.isVoted = true;
        await user.save();

        return res.status(200).json({ message: "Vote recorded successfully" }); // Add return here
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Internal Server Error' }); // Add return here
    }
});







//vote count
router.get('/vote/count', async (req,res)=>{
    try{
        // Find all candidates and sort them by votecount in desc order
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

        // Map the candidates to only return their name and voteCount
        const voteRecord = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });
    
        return res.status(200).json(voteRecord);

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});





// Get List of all candidates, including _id, name, and party
router.get('/', async (req, res) => {
    try {
        // Find all candidates and select only the _id, name, and party fields
        const candidates = await Candidate.find({}, '_id name party');

        // Return the list of candidates
        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});







module.exports = router;