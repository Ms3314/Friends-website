const express = require('express');
const mongoose = require('mongoose');
const User = require("./schema/userSchema")
// Create the Express app
const app = express();

// Connect to MongoDB
const mongoURI = 'mongodb://localhost:27017/FriendsApp';
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
app.post('/api/data' ,async ()=> {
 let {name , email , rollno , animals , food , color , prefer1 , prefer2 } = req.body;
   // Create a new user
   try {
    const newUser = new User({
     name,
     email,
     rollno,
     animals,
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

   // Find the user
   const user = await User.findOne({ email });
   if (!user) {
     return res.status(404).json({ message: 'User not found' });
   }

   // Find matching users
   const matchingUsers = await User.find({
     email: { $ne: email },
     animals: { $in: user.animals },
     food: { $in: user.food },
     color: { $in: user.color },
     prefer1: { $in: [user.prefer1, user.prefer2] },
     prefer2: { $in: [user.prefer1, user.prefer2] }
   }).exec();

   // Calculate match scores
   const matches = matchingUsers.map((matchingUser) => {
     let score = 0;
     if (matchingUser.animals.some(item => user.animals.includes(item))) score += 10;
     if (matchingUser.food.some(item => user.food.includes(item))) score += 10;
     if (matchingUser.color.some(item => user.color.includes(item))) score += 10;
     if (matchingUser.prefer1.some(item => user.prefer1.includes(item))) score += 10;
     if (matchingUser.prefer2.some(item => user.prefer2.includes(item))) score += 10;
     return { user: matchingUser, score };
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