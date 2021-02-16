const  mongoose=require('mongoose');

const StorySchema=mongoose.Schema({
    title:{
        type:String,
        trim:true
    },
    status:{
        type:String,
        default:'public',
        enum:['public','private']//list of possible values ,basically it is a validator
    },
    body:{
        type:String,
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,//to map stories with its user
        ref:'User'
    },

    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Story=new mongoose.model('Story',StorySchema);
module.exports=Story;