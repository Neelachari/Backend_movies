const express = require('express')
const MoviesRoute = express.Router()
const MoviesModal = require('../Model/Movies.model')
const {auth}=require("../Middleware/auth.middleware")

MoviesRoute.get('/movie', async (req, res) => {
    try {
        let Post= await MoviesModal.find()
        res.status(200).send(Post)
       
      } catch (error) {
          res.status(400).send({error:err.message})
      }
})


MoviesRoute.post('/Manymovies', async (req, res) => {
    try {
        const ArrayData= req.body
        const SaveData=await MoviesModal.insertMany(ArrayData)
        res.status(200).send({ postData: SaveData, message: "Movie is added  Many Successfully" })
    } catch (error) {

        res.status(400).send({ error: error, message: "Movie is Not Posted" })
    }
   
})

MoviesRoute.post('/movie', async (req, res) => {
    try {
       let postData =new MoviesModal(req.body)
       console.log(postData)
       await postData.save()
       res.status(200).send({ postData: postData, message: "Movie is added Successfully" })
    } catch (error) {

        res.status(400).send({ error: error, message: "Movie is Not Posted" })
    }
    
})


MoviesRoute.patch('/movie/:id', async (req, res) => {
    let UpdatePost = await MoviesModal.updateOne({ _id: req.params.id }, req.body)

    res.send({ message: "The Post has been updated Successfully", UpdatePost })
})


MoviesRoute.delete('/movie/:id', async (req, res) => {
    let deletePost = await MoviesModal.deleteOne({ _id: req.params.id })
    
    res.send({ message: "The Post has been deleted Successfully", deletePost })
})





module.exports = MoviesRoute