const mongoose = require ("mongoose");

const ResultSchema = new mongoose.Schema({
    userId :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    score :Number,
    total :Number,
    createdAt:{
        type:Date,
        default:Date.now
    }
});

module.exports= mongoose.model("Result",ResultSchema)