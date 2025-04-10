import { Router, Request, Response } from "express";
import { adminMiddleware, authMiddleware } from "../Middleware/middleware";
import { Election , Vote , Candidate } from "../db";
const electionRouter = Router();
// Election Routes

// get all elections
electionRouter.get("/",async(req:Request,res:Response)=>{
    const elections = await Election.find({creator:req.body.userId});
    res.status(200).json({msg:"elections",elections});
})

// create election
electionRouter.post("/create",adminMiddleware,async(req: Request, res: Response) => {
    const { title, description} = req.body;

    try {
     await Election.create({
        creator : req.body.userId,
        title,
        description,
      })
      res.json({msg : "election created"});
    } catch (e) {
      res.json({ msg: "unable to create election" });
    }
  }
);

// start election
electionRouter.put("/status/start/:electionId",adminMiddleware,async(req:Request,res:Response)=>{
  try { 
    const {electionId} = req.params;
    const election = await Election.findOneAndUpdate(
        {_id:electionId,creator:req.body.userId},
        {status:"active"},
        {new:true}
    );
    if(!election){
        res.status(404).json({msg:"election not found"});
        return;
    }
    res.status(200).json({msg:"election status",status:election.status});
  } catch (e) {
    res.status(500).json({msg:"unable to start election"});
  }
})

// stop election
electionRouter.put("/status/stop/:electionId",adminMiddleware,async(req:Request,res:Response)=>{
  try { 
    const {electionId} = req.params;
    const election = await Election.findOneAndUpdate(
        {_id:electionId,creator:req.body.userId},
        {status:"inactive"},
        {new:true}
    );
    if(!election){
        res.status(404).json({msg:"election not found"});
        return;
    }
    res.status(200).json({msg:"election status",status:election.status});
  } catch (e) {
    res.status(500).json({msg:"unable to inactivate election"});
  }
})

// complete election
electionRouter.put("/status/complete/:electionId",adminMiddleware,async(req:Request,res:Response)=>{
  try { 
    const {electionId} = req.params;
    const election = await Election.findOneAndUpdate(
        {_id:electionId,creator:req.body.userId},
        {status:"completed"},
        {new:true}
    );
    if(!election){
        res.status(404).json({msg:"election not found"});
        return;
    }
    res.status(200).json({msg:"election status",status:election.status});
  } catch (e) {
    res.status(500).json({msg:"unable to complete election"});
  }
})

// delete election
electionRouter.delete("/delete/:electionId",adminMiddleware,async(req:Request,res:Response)=>{
  try { 
    const {electionId} = req.params;
    const election = await Election.findOneAndDelete({_id:electionId,creator:req.body.userId});
    if(!election){
        res.status(404).json({msg:"election not found"});
        return;
    }
    res.status(200).json({msg:"election deleted"});
  } catch (e) {
    res.status(500).json({msg:"unable to delete election"});
  }
})

// get election details with candidates
electionRouter.get("/details/:electionId",async(req:Request,res:Response)=>{
  try {
    const {electionId} = req.params;
    const election = await Election.findOne({_id:electionId,creator:req.body.userId});
    if(!election){
        res.status(404).json({msg:"election not found"});
        return;
    }
    const candidates = await Candidate.find({electionId});
    res.status(200).json({msg:"election details",election,candidates});
  } catch (error) {
    res.status(500).json({msg:"unable to get election details"});
  }
})

// cast a vote
electionRouter.post("/vote/:electionId",authMiddleware,async(req:Request,res:Response)=>{
  try {
    const {electionId} = req.params;
    const {candidateId} = req.body;
    const election = await Election.findOne({_id:electionId});
    if(!election){
        res.status(404).json({msg:"election not found"});
        return;
    }
    if(election.status !== "active"){
        res.status(400).json({msg:"election is not active"});
        return;
    }
    
    // check if user has already voted
    const hasVoted = await Vote.findOne({electionId,userId:req.body.userId});

    if(hasVoted){
        res.status(400).json({msg:"user has already voted"});
        return;
    }

    const candidate = await Candidate.findOne({_id:candidateId});
    if(!candidate){
        res.status(404).json({msg:"candidate not found"});
        return;
    }

    // create a vote record
    await Vote.create({
        electionId,
        userId:req.body.userId,
        candidateId,
        votedAt:new Date()
    })

    // update candidate votes
    await Candidate.findOneAndUpdate(
        {_id:candidateId},
        {$inc:{votes:1}}
    )
    // update election total votes
    await Election.findOneAndUpdate(
        {_id:electionId},
        {$inc:{totalVotes:1}}
    )
    res.status(200).json({msg:"vote casted successfully"});

  } catch (error) {
    res.status(500).json({msg:"unable to cast vote"});
  }
})


// get election results
electionRouter.get("/:electionId/results",async(req:Request,res:Response)=>{
  try {
    const {electionId} = req.params;
    const election = await Election.findOne({_id:electionId});
    if(!election){
        res.status(404).json({msg:"election not found"});
        return;
    }
    if(election.status !== "completed"){
        res.status(400).json({msg:"election is not completed"});
        return;
    }
    const candidates = await Candidate.find({electionId}).select("name description votes").sort({votes:-1});

    const results = candidates.map((candidate)=>({
        name:candidate.name,
        description:candidate.description,
        votes:candidate.votes,
        percentage:((candidate.votes/election.totalVotes)*100).toFixed(2)
    }))
    res.status(200).json({totalVotes:election.totalVotes,results});
  } catch (error) {
    res.status(500).json({msg:"unable to get election results"});
  }
})
export default electionRouter;
