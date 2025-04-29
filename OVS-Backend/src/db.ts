import mongoose ,{Schema, model} from 'mongoose';
const Status = ['upcoming', 'active', 'completed'];

const UserSchema = new Schema({
    username : {type:String, required:true, unique:true},
    email : {type:String, required:true, unique:true},
    password : {type:String, required:true},
    adharId : {type:String, required:true, unique:true},
    createdAt : {
        type : Date,
        default : () => new Date().toISOString().split('T')[0]
    }
})

const ElectionSchema = new Schema({
    creator: {type:mongoose.Types.ObjectId, ref:'User',require:true},
    title : String,
    description : String,
    startDate : Date,
    endDate : Date,
    createdAt : {
        type : Date,
        default : () => new Date().toISOString().split('T')[0]
    }
    ,
    totalVotes : {type:Number, default:0},
    status : {type:String, enum:Status, default:'upcoming'}
})

const VoteSchema = new Schema({
    electionId : {type:mongoose.Types.ObjectId, ref:'Election'},
    userId : {type:mongoose.Types.ObjectId, ref:'User'},
    candidateName : {type:String},
    votedAt : {type:Date}
})

const CandidateSchema = new Schema({
    electionId : {type:mongoose.Types.ObjectId, ref:'Election'},
    name : {type:String},
    description : {type:String},
    votes : {type:Number, default:0}
})

export const User = model('UserModel', UserSchema);
export const Election = model('ElectionModel', ElectionSchema);
export const Vote = model('VoteModel', VoteSchema);
export const Candidate = model('CandidateModel', CandidateSchema);

