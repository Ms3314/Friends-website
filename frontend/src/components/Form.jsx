import axios from "axios"
import { useState } from "react";
const server =  import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
import {toast , Toaster} from "react-hot-toast";

function Form() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    setIsLoading(true);

    // Collect form data and log it directly
    const data = {
      name: e.target.username.value,
      email: e.target.email.value,
      animal: e.target.animal.value,
      food: e.target.food.value,
      drink : e.target.drink.value,
      desserts : e.target.desserts.value,
      football : e.target.football.value,
      anime : e.target.anime.value,
      superpower: e.target.superpower.value,
    };

    axios.post(`${server}/api/data`, data)
    .then(()=>{
      toast.success("Let's meet your new friends !!")
      localStorage.setItem("form" , JSON.stringify(data))
      setTimeout(() => {
        window.location.reload()
      }, 1000);
      
    })
    .catch(()=>{
      toast.error("Something went wrong, please try using another email")
    })
    .finally(() => {
      setIsLoading(false);
    })

  };

  const handleViewMatches = () => {
    const email = prompt("Enter your email to view your matches:");
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      // Simulate form data for existing user
      const userData = { email: email, name: "Returning User" };
      localStorage.setItem("form", JSON.stringify(userData));
      window.location.reload();
    } else if (email) {
      toast.error("Please enter a valid email address");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-300 flex flex-col justify-center items-center p-4">
      <Toaster position="top-center" />
      
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="font-mono text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
          💙 Fraaands Game 💙
        </h1>
        <p className="text-lg text-white/80 font-medium">
          Find your perfect friend match based on your preferences!
        </p>
      </div>

      {/* View Matches Button for Returning Users */}
      <button 
        onClick={handleViewMatches}
        className="mb-6 bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg"
      >
        🔍 Already have an account? View Your Matches
      </button>

      {/* Form Container */}
      <div className="w-full max-w-md">
        <form 
          onSubmit={handleSubmit} 
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20"
        >
          
          {/* Personal Info Section */}
          <div className="space-y-4 mb-6">
            <input 
              type="text" 
              name="username" 
              className="w-full py-3 px-4 bg-white/20 border border-white/30 rounded-xl placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300" 
              placeholder="✨ Your awesome name" 
              required 
            />
            <input 
              type="email" 
              name="email" 
              className="w-full py-3 px-4 bg-white/20 border border-white/30 rounded-xl placeholder-white/70 text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300" 
              placeholder="📧 Your email address" 
              required 
            />
          </div>

          {/* Questions Section */}
          <div className="space-y-6">
            
            <div>
              <label htmlFor="animal" className="block text-white font-semibold mb-2 text-center">
                🐾 What do you prefer more?
              </label>
              <select 
                name="animal" 
                required 
                className="w-full py-3 px-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
              >
                <option value="" disabled>Choose your furry friend</option>
                <option value="Cats" className="text-gray-800">🐱 Cats</option>
                <option value="Dogs" className="text-gray-800">🐶 Dogs</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="food" className="block text-white font-semibold mb-2 text-center">
                🍽️ What makes your taste buds dance?
              </label>
              <select 
                name="food" 
                required 
                className="w-full py-3 px-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
              >
                <option value="" disabled>Choose your favorite</option>
                <option value="Biriyani" className="text-gray-800">🍛 Biryani</option>
                <option value="Haleem" className="text-gray-800">🍲 Haleem</option>
              </select>
            </div>

            <div>
              <label htmlFor="drink" className="block text-white font-semibold mb-2 text-center">
                ☕ Your go-to comfort drink?
              </label>
              <select 
                name="drink" 
                required 
                className="w-full py-3 px-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
              >
                <option value="" disabled>Pick your potion</option>
                <option value="Chai" className="text-gray-800">🍵 Chai</option>
                <option value="Coffee" className="text-gray-800">☕ Coffee</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="desserts" className="block text-white font-semibold mb-2 text-center">
                🍨 Sweet tooth satisfaction?
              </label>
              <select 
                name="desserts" 
                required 
                className="w-full py-3 px-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
              >
                <option value="" disabled>Choose your sweet escape</option>
                <option value="Ice cream" className="text-gray-800">🍦 Ice cream</option>
                <option value="Chocolate" className="text-gray-800">🍫 Chocolate</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="football" className="block text-white font-semibold mb-2 text-center">
                ⚽ Your sporting hero?
              </label>
              <select 
                name="football" 
                required 
                className="w-full py-3 px-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
              >
                <option value="" disabled>Choose your GOAT</option>
                <option value="love Messi" className="text-gray-800">🐐 Messi</option>
                <option value="love Ronaldo" className="text-gray-800">👑 Ronaldo</option>
                <option value="cricket fan" className="text-gray-800">🏏 Virat Kohli!!</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="anime" className="block text-white font-semibold mb-2 text-center">
                🎌 Are you into anime?
              </label>
              <select 
                name="anime" 
                required 
                className="w-full py-3 px-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
              >
                <option value="" disabled>Reveal your anime status</option>
                <option value="doest watch Anime" className="text-gray-800">❌ Not my thing</option>
                <option value="watches Anime" className="text-gray-800">✨ YES, I love it!</option>
                <option value="doesnt have a life" className="text-gray-800">🌸 Anime IS life!</option>
              </select>
            </div>

            <div>
              <label htmlFor="superpower" className="block text-white font-semibold mb-2 text-center">
                🦸‍♀️ If you had a superpower?
              </label>
              <select 
                name="superpower" 
                required 
                className="w-full py-3 px-4 bg-white/20 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
              >
                <option value="" disabled>Choose your power</option>
                <option value="Flying" className="text-gray-800">🕊️ Flying</option>
                <option value="Mind-reading" className="text-gray-800">🧠 Mind-reading</option>
                <option value="Super strength" className="text-gray-800">💪 Super strength</option>
                <option value="Teleporting" className="text-gray-800">⚡ Teleporting</option>
              </select>
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-8 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Finding your friends...
              </span>
            ) : (
              "🚀 Find My Friends!"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;

