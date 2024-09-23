const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {


    // first check request headers has authorization or not
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({error: "Token Not Found"});


    // Extract the jwt token from the request headers
    const token = req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error: 'Unauthorized'});

    try{
        //Verify the JWT Token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user inofrmation to the request object
        req.user = decoded;
        // req.jwtPayload = decoded;  // Same thing like above

        next();
    }catch(err){
        console.error(err);
        res.status(401).json({error: "Invalid token"});
    }
}



// Function to generate JWT token
const generateToken = (userData) => {
    //Generate a new JWT token using user data
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 30000}); //30 means 30 seconds
}


module.exports = {jwtAuthMiddleware, generateToken};