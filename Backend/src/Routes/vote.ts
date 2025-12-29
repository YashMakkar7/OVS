import { Router, Request, Response } from "express";
import { Vote, Election } from "../db";
import { adminMiddleware, authMiddleware } from "../Middleware/middleware";

const voteRouter = Router();

// GET voting history for a specific user (admin only)
voteRouter.get("/history/:userId", adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    // Get all elections
    const elections = await Election.find({});
    
    // Get votes by this user
    const userVotes = await Vote.find({ userId });
    
    // Create a map of electionId -> voteDetails
    const votedElectionsMap = new Map();
    
    for (const vote of userVotes) {
      if (vote.electionId) {
        votedElectionsMap.set(vote.electionId.toString(), {
          votedAt: vote.votedAt,
          candidateName: vote.candidateName
        });
      }
    }
    
    // Create detailed voting history array
    const votingHistory = elections.map(election => {
      const voteDetails = votedElectionsMap.get(election._id.toString());
      return {
        electionId: election._id,
        electionTitle: election.title,
        electionStatus: election.status,
        hasVoted: !!voteDetails,
        voteDetails: voteDetails || null
      };
    });
    
    res.status(200).json({
      success: true,
      votingHistory
    });
  } catch (error) {
    console.error("Error getting voting history:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to get voting history"
    });
  }
});

// GET voting history for the current logged-in user
voteRouter.get("/myhistory", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    
    // Get all elections
    const elections = await Election.find({});
    
    // Get votes by this user
    const userVotes = await Vote.find({ userId });
    
    // Create a map of electionId -> voteDetails
    const votedElectionsMap = new Map();
    
    for (const vote of userVotes) {
      if (vote.electionId) {
        votedElectionsMap.set(vote.electionId.toString(), {
          votedAt: vote.votedAt,
          candidateName: vote.candidateName
        });
      }
    }
    
    // Create detailed voting history array
    const votingHistory = elections.map(election => {
      const voteDetails = votedElectionsMap.get(election._id.toString());
      return {
        electionId: election._id,
        electionTitle: election.title,
        electionStatus: election.status,
        hasVoted: !!voteDetails,
        voteDetails: voteDetails || null
      };
    });
    
    res.status(200).json({
      success: true,
      votingHistory
    });
  } catch (error) {
    console.error("Error getting user voting history:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to get voting history"
    });
  }
});

// Check if user has voted in a specific election
voteRouter.get("/check/:electionId", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { electionId } = req.params;
    const userId = req.body.userId;
    
    const vote = await Vote.findOne({ electionId, userId });
    
    res.status(200).json({
      success: true,
      hasVoted: !!vote,
      voteDetails: vote ? {
        votedAt: vote.votedAt,
        candidateName: vote.candidateName
      } : null
    });
  } catch (error) {
    console.error("Error checking vote status:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to check vote status"
    });
  }
});

export default voteRouter; 