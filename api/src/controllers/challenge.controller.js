import { asyncHandler } from "../utils/asyncHandler.js";
import { Challenge } from "../models/Challenge.model.js";

import { User } from "../models/User.model.js";



const getAllChallenges = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Fetch all challenges
    const allChallenges = await Challenge.find({});

    // Filter out challenges that the user has already completed
    const userCompletedChallenges = user.challenges.map(ch => ch.description);
    const availableChallenges = allChallenges.filter(challenge => !userCompletedChallenges.includes(challenge.description));

    res.status(200).json({ success: true, challenges: availableChallenges });
  } catch (error) {
    console.error("Error fetching challenges:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


const addChallenge = asyncHandler(async (req, res) => {
  try {
    // Only allow teachers to add challenges
    if (req.user.role !== "teacher") {
      return res.status(403).json({ success: false, message: "Only teachers can add challenges" });
    }
    
    const { description, type, rewardAura, rewardCredits, deadline } = req.body;
    const newChallenge = new Challenge({
      description,
      type,
      rewardAura,
      rewardCredits,
      deadline,
      createdBy: req.user.id,
    });
    
    await newChallenge.save();
    
    res.status(201).json({ success: true, message: "Challenge added successfully", challenge: newChallenge });
  } catch (error) {
    console.error("Error adding challenge:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const completeChallenge = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { challengeId } = req.params;
    
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({ success: false, message: "Challenge not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if the challenge is already completed
    const existingChallenge = user.challenges.find(ch => ch.description === challenge.description);
    if (existingChallenge) {
      return res.status(400).json({ success: false, message: "Challenge already completed" });
    }

    // Add the completed challenge to user's challenges array
    user.challenges.push({
      description: challenge.description,
      type: challenge.type,
      completed: true,
      rewardAura: challenge.rewardAura,
      rewardCredits: challenge.rewardCredits,
      deadline: challenge.deadline,
    });

    // Update user points
    user.aura_points += challenge.rewardAura;
    user.credit_points += challenge.rewardCredits;

    await user.save();

    res.status(200).json({ success: true, message: "Challenge completed successfully", user });
  } catch (error) {
    console.error("Error completing challenge:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

const getCompletedChallenges = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user and fetch only completed challenges
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const completedChallenges = user.challenges.filter(ch => ch.completed);

    res.status(200).json({ success: true, challenges: completedChallenges });
  } catch (error) {
    console.error("Error fetching completed challenges:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


  export {
    getCompletedChallenges,
    getAllChallenges,
    addChallenge,
    completeChallenge,
  };
