import React, { useState, useEffect } from "react";
import Sidebar from "../../Layout/Sidebar";

function ChallengesPage() {
  const [userData, setUserData] = useState({
    username: "",
    role: "student",
    section: "",
    semester: "",
    branch: "",
    avatar: "",
  });

  const [challenges, setChallenges] = useState([]);
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newChallenge, setNewChallenge] = useState({
    description: "",
    type: "daily",
    rewardAura: 0,
    rewardCredits: 0,
    deadline: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/profile", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setUserData(data.user);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchUserData();
  }, []);

  const userRole = userData.role || "student";

  const fetchChallenges = async () => {
    try {
      const res = await fetch("http://localhost:3000/challenges", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch challenges");
      const data = await res.json();
      setChallenges(data.challenges);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedChallenges = async () => {
    try {
      const res = await fetch("http://localhost:3000/challenges/completed", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch completed challenges");
      const data = await res.json();
      setCompletedChallenges(data.challenges);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchChallenges();
    fetchCompletedChallenges();
  }, []);

  const handleComplete = async (challengeId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/challenges/${challengeId}/complete`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to complete challenge");
      const data = await res.json();
      // Refresh the challenges lists
      fetchChallenges();
      fetchCompletedChallenges();
      alert(data.message);
    } catch (err) {
      alert(err.message);
    }
  };

  // handleAddChallenge for teachers to add new challenges
  const handleAddChallenge = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/challenges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(newChallenge),
      });
      if (!res.ok) {
        throw new Error("Failed to add challenge");
      }
      const data = await res.json();
      alert(data.message || "Challenge added successfully");
      // Refresh the challenges list to include the new challenge
      fetchChallenges();
      // Reset the form fields
      setNewChallenge({
        description: "",
        type: "daily",
        rewardAura: 0,
        rewardCredits: 0,
        deadline: "",
      });
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) return <div style={styles.loading}>Loading challenges...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <Sidebar/>
      <h1 style={styles.title}>Daily & Weekly Challenges</h1>

      {userRole === "teacher" && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Add New Challenge</h2>
          <form onSubmit={handleAddChallenge} style={styles.form}>
            <label style={styles.label}>Challenge Description</label>
            <input
              type="text"
              name="description"
              placeholder="Enter challenge description"
              value={newChallenge.description}
              onChange={(e) =>
                setNewChallenge({ ...newChallenge, description: e.target.value })
              }
              required
              style={styles.input}
            />

            <label style={styles.label}>Challenge Type</label>
            <select
              name="type"
              value={newChallenge.type}
              onChange={(e) =>
                setNewChallenge({ ...newChallenge, type: e.target.value })
              }
              style={styles.input}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>

            <label style={styles.label}>Reward Aura</label>
            <input
              type="number"
              name="rewardAura"
              placeholder="Enter reward aura"
              value={newChallenge.rewardAura}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  rewardAura: parseInt(e.target.value) || 0,
                })
              }
              style={styles.input}
            />

            <label style={styles.label}>Reward Credits</label>
            <input
              type="number"
              name="rewardCredits"
              placeholder="Enter reward credits"
              value={newChallenge.rewardCredits}
              onChange={(e) =>
                setNewChallenge({
                  ...newChallenge,
                  rewardCredits: parseInt(e.target.value) || 0,
                })
              }
              style={styles.input}
            />

            <label style={styles.label}>Deadline</label>
            <input
              type="date"
              name="deadline"
              value={newChallenge.deadline}
              onChange={(e) =>
                setNewChallenge({ ...newChallenge, deadline: e.target.value })
              }
              required
              style={styles.input}
            />

            <button type="submit" style={styles.button}>
              Add Challenge
            </button>
          </form>
        </div>
      )}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Available Challenges</h2>
        {challenges.length === 0 ? (
          <p style={styles.infoText}>No challenges available.</p>
        ) : (
          challenges.map((challenge) => (
            <div key={challenge._id} style={styles.challengeCard}>
              <h3 style={styles.challengeTitle}>{challenge.description}</h3>
              <p style={styles.challengeInfo}>Type: {challenge.type}</p>
              <p style={styles.challengeInfo}>
                Deadline: {new Date(challenge.deadline).toLocaleDateString()}
              </p>
              <p style={styles.challengeInfo}>
                Rewards: {challenge.rewardAura} Aura, {challenge.rewardCredits} Credits
              </p>
              {userRole === "student" && (
                <button
                  onClick={() => handleComplete(challenge._id)}
                  style={styles.completeButton}
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {userRole !== "teacher" && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Completed Challenges</h2>
          {completedChallenges.length === 0 ? (
            <p style={styles.infoText}>No completed challenges yet.</p>
          ) : (
            completedChallenges.map((challenge) => (
              <div key={challenge._id} style={styles.completedCard}>
                <h3 style={styles.challengeTitle}>{challenge.description}</h3>
                <p style={styles.challengeInfo}>
                  Completed before: {new Date(challenge.deadline).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "50px 40px",
    maxWidth: "950px",
    margin: "50px auto",
    background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    borderRadius: "12px",
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "40px",
    marginBottom: "40px",
    color: "#333",
    fontWeight: "700",
  },
  section: {
    marginBottom: "40px",
    padding: "25px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
  },
  sectionTitle: {
    fontSize: "32px",
    marginBottom: "20px",
    color: "#444",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  label: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#555",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  button: {
    padding: "14px 24px",
    fontSize: "18px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  challengeCard: {
    padding: "25px",
    border: "1px solid #e0e0e0",
    marginBottom: "20px",
    borderRadius: "12px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  completedCard: {
    padding: "25px",
    backgroundColor: "#e6ffe6",
    marginBottom: "20px",
    borderRadius: "12px",
    border: "1px solid #c2e8c2",
  },
  challengeTitle: {
    fontSize: "22px",
    marginBottom: "12px",
    color: "#333",
  },
  challengeInfo: {
    fontSize: "18px",
    margin: "6px 0",
    color: "#555",
  },
  completeButton: {
    padding: "12px 20px",
    fontSize: "18px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "15px",
    transition: "background-color 0.3s ease, transform 0.2s ease",
  },
  loading: {
    textAlign: "center",
    padding: "40px",
    fontSize: "20px",
    color: "#555",
  },
  error: {
    textAlign: "center",
    padding: "40px",
    color: "#d8000c",
    fontWeight: "bold",
    fontSize: "20px",
  },
  infoText: {
    fontSize: "18px",
    color: "#777",
    textAlign: "center",
  },
};

export default ChallengesPage;
