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
      // Fetch updated votes from the backend
      fetchVotes();
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
    <div>
      <h1>Season War</h1>
      <Pie data={data} />

      <div style={{ marginTop: '20px' }}>
        <button onClick={() => handleVote("spring")} disabled={loading}>Vote Spring</button>
        <button onClick={() => handleVote("summer")} disabled={loading}>Vote Summer</button>
        <button onClick={() => handleVote("autumn")} disabled={loading}>Vote Autumn</button>
        <button onClick={() => handleVote("winter")} disabled={loading}>Vote Winter</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Reset Votes</h2>
        <button onClick={() => handleReset()}>Reset All Seasons</button>
        <button onClick={() => handleReset(["spring", "summer"])}>Reset Spring & Summer</button>
      </div>
    </div>
  );
}

export default SeasonWar;
