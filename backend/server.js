const express = require('express');
const mongoose = require('mongoose');
const User = require("./schema/userSchema")
const cors = require('cors');
const app = express();
require('dotenv').config();
// Use CORS middleware to allow requests from a specific origin
app.use(cors());
// Create the Express app


emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i;

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/FriendsApp';
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
// Form data
app.post('/api/data' ,async (req , res)=> {
 let {name , email ,  animal , food , color , prefer1 , prefer2 } = req.body;
   // Create a new user
   if(emailRegex.test(email)){
    console.log("email is valid")
  }else{
    console.log("email is invalid")
    return res.status(400).json({ message: 'Invalid email format' });
  }
  const user = await User.findOne( {email : email})
  if(user) {
     res.status(500).json({ message: 'Email already exists' });
  }
   try {
    const newUser = new User({
     name,
     email,
     animal,
     food,
     color,
     prefer1,
     prefer2
   });
   await newUser.save();
   res.status(200).json({user: newUser })
   } catch (error) {
    res.status(500).json({error: error.message })
   }
    
})

// Route to fetch user data and find similar users
app.get('/api/users/:email', async (req, res) => {
 try {
   const { email } = req.params;
  if(emailRegex.test(email)){
    console.log(emailRegex.test(email))
    console.log("email is valid")
  }else{
    console.log(emailRegex.test(email))
    console.log("email is invalid")
    return res.status(400).json({ message: 'Invalid email format' });
  }
   // Find the user
   const user = await User.findOne({ email });
   if (!user) {
     return res.status(404).json({ message: 'User not found' });
   }
   

   // Find matching users
   const matchingUsers = await User.find({
     email: { $ne: email },
   }).exec();

   // Calculate match scores
   const matches = matchingUsers.map((matchingUser) => {
     let score = 0;
     let match = []
     if (matchingUser.animals == user.animals) {
       score += 1;
       match.push(matchingUser.animals)
     }
     if (matchingUser.food == user.food) {
       score += 1;
       match.push(matchingUser.food)
     }
     if (matchingUser.color == user.color) {
       score += 1;
       match.push(matchingUser.color)
     }
     if (matchingUser.prefer1 == user.prefer1) {
       score += 1;
       match.push(matchingUser.prefer1)
     }
     if (matchingUser.prefer2 == user.prefer2) {
       score += 1;
      match.push(matchingUser.prefer2)
     }
     return {
       user: matchingUser,
       score ,
       match
     }
   });

   // Sort matches by score in descending order
   matches.sort((a, b) => b.score - a.score);

   res.json({ user, matches });
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));