import { useState, useEffect } from "react";
import axios from "axios";

const server =  import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

function Match({ form }) {
  const [similiar, setSimiliar] = useState([]);
  const [loading, setLoading] = useState(true);
  const email = form.email;
  
  const handleRefresh = () => {
    if (email) {
      setLoading(true);
      axios.get(`${server}/api/users/${email}`)
        .then((response) => {
          setSimiliar(response.data.matches);
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }
  
  useEffect(() => {
    handleRefresh()
  }, []); 

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-300 to-pink-300 p-6">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
          🪽 Your Friend Matches! 👋
        </h1>
        <p className="text-lg text-white/80 font-medium mb-6">
          Discover people who share your interests and preferences
        </p>
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            className="bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg"
            onClick={handleRefresh}
            disabled={loading}
          >
            {loading ? "🔄 Loading..." : "🔄 Refresh Matches"}
          </button>
          <button 
            className="bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-full border border-white/30 hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-lg"
            onClick={() => {
              localStorage.removeItem("form");
              window.location.reload()
            }}
          >
            🏠 Start Over
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Finding your perfect matches...</p>
          </div>
        </div>
      ) : (
        /* Matches Grid */
        <div className="max-w-6xl mx-auto">
          {similiar.filter(data => data.score > 3).length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">🔍 No Close Matches Found</h2>
              <p className="text-white/80 mb-6">
                Don't worry! Try refreshing or invite more friends to join the platform.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similiar.map((data, key) => (
                data.score > 3 && <FriendCard data={data} key={key} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const FriendCard = ({ data }) => {
  const { user: { name }, score, match } = data;
  
  const getScoreColor = (score) => {
    if (score >= 6) return "from-green-400 to-emerald-500";
    if (score >= 5) return "from-blue-400 to-cyan-500";
    return "from-purple-400 to-pink-500";
  };

  const getScoreEmoji = (score) => {
    if (score >= 6) return "🎯";
    if (score >= 5) return "⭐";
    return "✨";
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:transform hover:scale-105 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <div className={`bg-gradient-to-r ${getScoreColor(score)} px-3 py-1 rounded-full flex items-center`}>
          <span className="text-white font-semibold text-sm">
            {getScoreEmoji(score)} {score}/7
          </span>
        </div>
      </div>
      
      {/* Shared Interests */}
      <div className="mb-4">
        <p className="text-white/90 font-medium mb-3">🤝 Shared Interests:</p>
        <div className="flex flex-wrap gap-2">
          {match.map((interest, index) => (
            interest && (
              <span
                key={index}
                className="bg-white/20 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full border border-white/30"
              >
                {interest}
              </span>
            )
          ))}
        </div>
      </div>
      
      {/* Match Quality */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-center">
          <span className="text-white/80 text-sm font-medium">
            {score >= 6 ? "🔥 Perfect Match!" : 
             score >= 5 ? "💫 Great Match!" : 
             "✨ Good Match!"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Match;
