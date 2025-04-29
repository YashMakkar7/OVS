// Candidate Routes
import { Router, Request, Response } from "express";
import { adminMiddleware } from "../Middleware/middleware";
import { Candidate } from "../db";
const candidateRouter = Router();

// add multiple candidates at once
candidateRouter.post("/addcandidates/:electionId", adminMiddleware, async(req: Request, res: Response) => {
    try {
        const { electionId } = req.params;
        const { candidates } = req.body;
        
        // Validate request body
        if (!Array.isArray(candidates) || candidates.length === 0) {
            res.status(400).json({
                success: false,
                msg: "Invalid input: 'candidates' must be a non-empty array"
            });
            return;
        }
        
        // Prepare candidates data with election ID
        const candidatesWithElectionId = candidates.map(candidate => ({
            ...candidate,
            electionId
        }));
        
        // Insert many candidates at once
        const result = await Candidate.insertMany(candidatesWithElectionId);
        
        res.status(201).json({
            success: true,
            msg: `${result.length} candidates added successfully`,
            candidates: result
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            msg: "Failed to add candidates",
            error: error.message || "Unknown error"
        });
    }
});

// get all candidates
candidateRouter.get("/:electionId",async(req:Request,res:Response)=>{
    try { 
        const {electionId} = req.params;
        const candidates = await Candidate.find({electionId});
        res.status(200).json({msg:"candidates",candidates});
    } catch (e) {
        res.status(500).json({msg:"unable to get candidates"});
    }
})

// delete candidate
candidateRouter.delete("/delete/:electionId/:candidateId",adminMiddleware,async(req:Request,res:Response)=>{
    try { 
        const {electionId,candidateId} = req.params;
        const candidate = await Candidate.findOneAndDelete({_id:candidateId,electionId});
        if(!candidate){
            res.status(404).json({msg:"candidate not found"});
            return;
        }
        res.status(200).json({msg:"candidate deleted",candidate});
    } catch (e) {
        res.status(500).json({msg:"unable to delete candidate"});
    }
})  

export default candidateRouter;