const mongoose=require('mongoose')

const MoviesSchema=mongoose.Schema({
    MovieID:{type:Number,required:true},
    Title:{type:String,required:true},
    Release_Date:{type:String,required:true},
    Description:{type:String,required:true},
    Poster_Image:{type:String,required:true},
    Average_Rating:{type:String,required:true},
    Trailer_URL:{type:String,required:true},
    Runtime:{type:String,required:true}

})

const moviesModel=mongoose.model('Movies_posts', MoviesSchema)

module.exports=moviesModel