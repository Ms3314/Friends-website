const express = require('express');
const mongoose = require('mongoose');
const User = require("./schema/userSchema")
const cors = require('cors');
const app = express();
require('dotenv').config();
// Use CORS middleware to allow requests from a specific origin
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`, // Allow only your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));
// Create the Express app
// shit 

emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i;

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/FriendsApp';
mongoose.connect(mongoURI)
.catch(err => console.log(err));

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
// Form data
app.post('/api/data', async (req, res) => {
  let { name, email, animal, food, drink, desserts, football, anime, superpower } = req.body;
  
  
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  const user = await User.findOne({ email: email });
  
  if (user) {
    return res.status(500).json({ message: 'Email already exists' }); // Add `return` here
  }

  try {
    const newUser = new User({
      name,
      email,
      choice: [animal, food, drink, desserts, football, anime, superpower]
    });
    
    // Save the user to the database
    await newUser.save();
    
    res.status(200).json({ user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Route to fetch user data and find similar users
app.get('/api/users/:email', async (req, res) => {
 try {
   const { email } = req.params;
  if(!emailRegex.test(email)){
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
    for (let i = 0  ; i < matchingUser.choice.length ; i ++ ) {
      const isMatch = matchingUser.choice[i] == user.choice[i]
      if (matchingUser.choice[i] == user.choice[i])
        {
          score += 1;
          if (score > 0 ) {
          match.push(matchingUser.choice[i])
          }
        }
    }
     return {
       user: matchingUser,
       score ,
       match
     }
   });

   // Sort matches by score in descending order
   matches.sort((a, b) => b.score - a.score);
   matches.slice(0, 5);
   res.json({ user, matches });
 } catch (error) {
   res.status(500).json({ message: error.message });
 }
});


// Start the server
const PORT =  5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));