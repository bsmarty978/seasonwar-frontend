import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SeasonWar.css"; // Use external CSS for styling

const seasons = [
  { name: "Spring", svgPath: `${process.env.PUBLIC_URL}/icons/spring.svg` },
  { name: "Summer", svgPath: `${process.env.PUBLIC_URL}/icons/summer.svg` },
  { name: "Monsoon", svgPath: `${process.env.PUBLIC_URL}/icons/monsoon.svg` },
  { name: "Autumn", svgPath: `${process.env.PUBLIC_URL}/icons/autumn.svg` },
  { name: "Winter", svgPath: `${process.env.PUBLIC_URL}/icons/winter.svg` }
];

function SeasonWar() {
  const [votes, setVotes] = useState(seasons.map(season => ({ ...season, votes: 0 })));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoverSeason, setHoverSeason] = useState(null); // State for the hovered season
  const [clickedSeason, setClickedSeason] = useState(null); // State to track clicked season for animation

  useEffect(() => {
    fetchVotes();
    const interval = setInterval(() => {
      setVotes(prevVotes => prevVotes.map(season => ({
        ...season,
        randomFactor: Math.random() // For random grow/shrink effect
      })));
    }, 2000); // Adjust interval as needed

    return () => clearInterval(interval); // Cleanup on unmount
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
      element.classList.add("animate");
      setTimeout(() => {
        element.classList.remove("animate");
      }, 1000);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="season-war-container">
      {votes.map((season) => {
        const flexGrow = season.randomFactor ? 1 + season.randomFactor * 0.5 : 1; // Adjust size based on random factor

        return (
          <div
            key={season.name}
            className={`season-section ${season.name.toLowerCase()} ${hoverSeason === season.name.toLowerCase() ? 'hover' : ''}`} // Apply hover class
            style={{ flexGrow }} // Dynamically set flex-grow
            onMouseEnter={() => setHoverSeason(season.name.toLowerCase())}
            onMouseLeave={() => setHoverSeason(null)}
          >
            <div className="content">
              <div className="season-icon">
                <img 
                  src={season.svgPath} 
                  alt={season.name} 
                  width="80" 
                  height="80" 
                  className={`season-svg ${clickedSeason === season.name ? 'clicked' : ''}`} 
                  onClick={() => {
                    handleVote(season.name.toLowerCase());
                    setClickedSeason(season.name); // Set clicked season for animation
                    setTimeout(() => setClickedSeason(null), 300); // Reset after animation duration
                  }} 
                  style={{ cursor: 'pointer' }} // Change cursor to pointer
                />
              </div>
              <h2>{season.name}</h2>
              <p className="vote-count">Votes: {season.votes}</p>
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
