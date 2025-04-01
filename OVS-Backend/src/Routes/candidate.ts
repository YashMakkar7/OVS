// Candidate Routes
import { Router, Request, Response } from "express";
import { authMiddleware } from "../Middleware/middleware";
import { Candidate } from "../db";
const candidateRouter = Router();

// add candidate
candidateRouter.post("/add/:electionId",authMiddleware,async(req:Request,res:Response)=>{
    try { 
        const {electionId} = req.params;
        const {name,description} = req.body;

        const candidate = await Candidate.create({
            electionId,
            name,
            description
        });

        res.status(200).json({msg:"candidate added",candidate});
    } catch (e) {
        res.status(500).json({msg:"unable to add candidate"});
    }
})

// get all candidates
candidateRouter.get("/:electionId",authMiddleware,async(req:Request,res:Response)=>{
    try { 
        const {electionId} = req.params;
        const candidates = await Candidate.find({electionId});
        res.status(200).json({msg:"candidates",candidates});
    } catch (e) {
        res.status(500).json({msg:"unable to get candidates"});
    }
})

// delete candidate
candidateRouter.delete("/delete/:electionId/:candidateId",authMiddleware,async(req:Request,res:Response)=>{
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