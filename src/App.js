import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SeasonWar.css"; // Use external CSS for styling

const seasons = [
  { name: "Spring", icon: "🌸" },
  { name: "Summer", icon: "☀️" },
  { name: "Monsoon", icon: "💧" },
  { name: "Autumn", icon: "🍂" },
  { name: "Winter", icon: "❄️" }
];

function SeasonWar() {
  const [votes, setVotes] = useState(seasons.map(season => ({ ...season, votes: 0 })));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current votes from the backend on component load
  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/votes`);
      setVotes((prevVotes) =>
        prevVotes.map((season) => ({
          ...season,
          votes: response.data[season.name.toLowerCase()] || 0
        }))
      );
      setLoading(false);
    } catch (error) {
      console.error("Error fetching votes:", error);
      setError("Error fetching votes");
      setLoading(false);
    }
  };

  const handleVote = async (seasonName) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/vote`, { season: seasonName });
      fetchVotes(); // Fetch updated votes
      triggerVoteAnimation(seasonName);
    } catch (error) {
      console.error("Error voting:", error);
      setError("Error voting");
    }
  };

  const triggerVoteAnimation = (seasonName) => {
    const element = document.getElementById(`vote-confirmation-${seasonName}`);
    if (element) {
      element.textContent = "+1";
      element.style.opacity = "1";
      setTimeout(() => {
        element.style.opacity = "0";
      }, 1000);
    }
  };

  const totalVotes = votes.reduce((total, season) => total + season.votes, 0);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="season-war-container">
      {votes.map((season) => {
        // Calculate the flex-grow value based on votes (more votes = larger section)
        const flexGrow = totalVotes === 0 ? 1 : (season.votes / totalVotes) * 10; // Scale to make the effect noticeable

        return (
          <div
            key={season.name}
            className={`season-section ${season.name.toLowerCase()}`}
            style={{ flexGrow }} // Dynamically set flex-grow
          >
            <div className="content">
              <div className="season-icon">{season.icon}</div>
              <h2>{season.name}</h2>
              <p className="vote-count">Votes: {season.votes}</p>
              <button
                className="vote-button"
                onClick={() => handleVote(season.name.toLowerCase())}
              >
                Vote
              </button>
              <div
                id={`vote-confirmation-${season.name}`}
                className="vote-confirmation"
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default SeasonWar;
