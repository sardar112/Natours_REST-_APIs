const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        trim:true,
        required:[true,"A tour must have a name"],
    },
    ratingsAverage:{
        type:Number,
        default:3.5
    },
    ratingQuantity:{
        type:Number,
        default:0
    },
    price:{
        type:Number ,
         required:[true,"A tour  must have a price"],
    },
    priceDiscount:{
        type:Number ,
    },
    duration:{
        type:Number,
        required:[true,"A tour  must have duration"]
    },
    maxGroupSize:{
        type:Number,
        required:[true,"A tour must have  group size"],
    },
    difficulty:{
        type:String,
        required:[true,"A tour must have difficulty"],
    },
   summary:{
        type:String,
        trim:true,
        required:[true,"A tour must have summary"],

    },
    description:{
        type:String,
        trim:true,
    },
    createdAt:{
       type:Date,
       default:Date.now(),
    },
    startDates:[Date],
    imageCover:[String],
    
});

const Tour = mongoose.model("Tour",tourSchema);
module.exports = Tour;