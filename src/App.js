import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

function SeasonWar() {
  const [votes, setVotes] = useState({ spring: 0, summer: 0, autumn: 0, winter: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current votes from the backend on component load
  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const response = await axios.get("/votes");
      setVotes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching votes:", error); // Log the error for debugging
      setError("Error fetching votes");
      setLoading(false);
    }
  };

  // Handle voting for a season
  const handleVote = async (season) => {
    try {
      await axios.post("/vote", { season });
      fetchVotes(); // Fetch updated votes after voting
    } catch (error) {
      console.error("Error voting:", error); // Log the error for debugging
      setError("Error voting");
    }
  };

  // Handle resetting votes for all or selected seasons
  const handleReset = async (seasons = null) => {
    try {
      await axios.post("/reset", { seasons });
      fetchVotes(); // Fetch updated votes after reset
    } catch (error) {
      console.error("Error resetting votes:", error); // Log the error for debugging
      setError("Error resetting votes");
    }
  };

  // Data for the Pie chart
  const data = {
    labels: ["Spring", "Summer", "Autumn", "Winter"],
    datasets: [{
      data: [votes.spring, votes.summer, votes.autumn, votes.winter],
      backgroundColor: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3"],
    }]
  };

  // Loading or error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Season War</h1>
      <div style={styles.chartContainer}>
        <Pie data={data} />
      </div>

      <div style={styles.buttonContainer}>
        {["spring", "summer", "autumn", "winter"].map((season) => (
          <button
            key={season}
            onClick={() => handleVote(season)}
            disabled={loading}
            style={styles.voteButton}
          >
            Vote {season.charAt(0).toUpperCase() + season.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.resetContainer}>
        <h2>Reset Votes</h2>
        <button onClick={() => handleReset()} style={styles.resetButton}>Reset All Seasons</button>
        <button onClick={() => handleReset(["spring", "summer"])} style={styles.resetButton}>Reset Spring & Summer</button>
      </div>
    </div>
  );
}

// Styles for the component
const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '20px',
  },
  chartContainer: {
    maxWidth: '100%',
    margin: '0 auto',
  },
  buttonContainer: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  voteButton: {
    padding: '10px 20px',
    margin: '5px',
    backgroundColor: '#66c2a5',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  resetContainer: {
    marginTop: '20px',
  },
  resetButton: {
    margin: '5px',
    padding: '10px 15px',
    backgroundColor: '#fc8d62',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

// Hover effects for buttons
const handleMouseOver = (e) => {
  e.currentTarget.style.backgroundColor = '#54b48d';
};

const handleMouseOut = (e) => {
  e.currentTarget.style.backgroundColor = '#66c2a5';
};

// Attach hover effects to vote buttons
document.querySelectorAll('.voteButton').forEach(button => {
  button.addEventListener('mouseover', handleMouseOver);
  button.addEventListener('mouseout', handleMouseOut);
});

export default SeasonWar;
