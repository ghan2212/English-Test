const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
    question :{
        type: String,
        require : true
    },
    options :{
        type:[String],
        require:true
    },
    correctAnswer:{
        type:String ,
        required:true
    }
})

module.exports = mongoose.model("Question",QuestionSchema)