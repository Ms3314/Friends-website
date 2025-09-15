const express = require('express');
const mongoose = require('mongoose');
const User = require("./schema/userSchema")
const cors = require('cors');
const app = express();
require('dotenv').config();

// In-memory storage for demo purposes (fallback when MongoDB is unavailable)
let inMemoryUsers = [
  {
    _id: "1",
    name: "Alice Johnson",
    email: "alice@example.com",
    choice: ["Cats", "Biriyani", "Chai", "Ice cream", "love Messi", "watches Anime", "Flying"]
  },
  {
    _id: "2", 
    name: "Bob Smith",
    email: "bob@example.com",
    choice: ["Dogs", "Haleem", "Coffee", "Chocolate", "love Ronaldo", "doest watch Anime", "Mind-reading"]
  },
  {
    _id: "3",
    name: "Carol Wilson", 
    email: "carol@example.com",
    choice: ["Cats", "Biriyani", "Coffee", "Ice cream", "love Messi", "watches Anime", "Teleporting"]
  },
  {
    _id: "4",
    name: "David Brown",
    email: "david@example.com", 
    choice: ["Dogs", "Biriyani", "Chai", "Chocolate", "cricket fan", "doesnt have a life", "Super strength"]
  }
];

// Use CORS middleware to allow requests from a specific origin
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`, // Allow only your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i;

// Connect to MongoDB with error handling
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/FriendsApp';
let useInMemory = false;

mongoose.connect(mongoURI, { 
  serverSelectionTimeoutMS: 5000, // 5 second timeout
  connectTimeoutMS: 5000 
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => {
  console.log('MongoDB connection failed, using in-memory storage:', err.message);
  useInMemory = true;
});

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

  try {
    let user;
    
    if (useInMemory) {
      // Check if user exists in memory
      const existingUser = inMemoryUsers.find(u => u.email === email);
      if (existingUser) {
        return res.status(500).json({ message: 'Email already exists' });
      }
      
      // Create new user in memory
      user = {
        _id: Date.now().toString(),
        name,
        email,
        choice: [animal, food, drink, desserts, football, anime, superpower]
      };
      inMemoryUsers.push(user);
    } else {
      // Use MongoDB
      const existingUser = await User.findOne({ email: email });
      if (existingUser) {
        return res.status(500).json({ message: 'Email already exists' });
      }

      const newUser = new User({
        name,
        email,
        choice: [animal, food, drink, desserts, football, anime, superpower]
      });
      
      user = await newUser.save();
    }
    
    res.status(200).json({ user });
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
    
    let user, matchingUsers;
    
    if (useInMemory) {
      // Find user in memory
      user = inMemoryUsers.find(u => u.email === email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Find matching users in memory
      matchingUsers = inMemoryUsers.filter(u => u.email !== email);
    } else {
      // Use MongoDB
      user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      matchingUsers = await User.find({
        email: { $ne: email },
      }).exec();
    }
    
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
    const topMatches = matches.slice(0, 5);
    res.json({ user, matches: topMatches });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Start the server
const PORT =  5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));