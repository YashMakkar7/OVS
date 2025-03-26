import mongoose ,{Schema, model} from 'mongoose';
const Status = ['inactive', 'active', 'completed'];

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
    creator: {type:mongoose.Types.ObjectId, ref:'User'},
    title : String,
    description : String,
    startDate : Date,
    endDate : Date,
    createdAt : {
        type : Date,
        default : () => new Date().toISOString().split('T')[0]
    },
    candidates:[
        {
            name : String,
            votes : {type:Number, default:0},
            description : {type:String, default:''}
        }
    ]
    ,
    totalVotes : {type:Number, default:0},
    status : {type:String, enum:Status, default:'inactive'}
})

const VoteSchema = new Schema({
    electionId : {type:mongoose.Types.ObjectId, ref:'Election'},
    userId : {type:mongoose.Types.ObjectId, ref:'User'},
    candidateName : {type:String},
    votedAt : {type:Date}
})


export const User = model('UserModel', UserSchema);
export const Election = model('ElectionModel', ElectionSchema);
export const Vote = model('VoteModel', VoteSchema);

