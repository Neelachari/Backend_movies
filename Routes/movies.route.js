const express = require('express')
const MoviesRoute = express.Router()
const MoviesModal = require('../Model/Movies.model')
const SubscriptionModel = require('../Model/Subscription.model')
const {auth}=require("../Middleware/auth.middleware")

MoviesRoute.get('/movie', auth, async (req, res) => {
    try {
        const userId = req.body.userID;
        const subscription = await SubscriptionModel.findOne({ userId, active: true, endDate: { $gt: new Date() } });
        if(!subscription) {
            return res.status(403).send({error: 'Subscription required to view movies'});
        }
        let Post= await MoviesModal.find()
        res.status(200).send(Post)
       
      } catch (error) {
          res.status(400).send({error:error.message})
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
    try {
        let UpdatePost = await MoviesModal.updateOne({ _id: req.params.id }, req.body)
        res.send({ message: "The Post has been updated Successfully", UpdatePost })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})


MoviesRoute.delete('/movie/:id', async (req, res) => {
    try {
        let deletePost = await MoviesModal.deleteOne({ _id: req.params.id })
        res.send({ message: "The Post has been deleted Successfully", deletePost })
    } catch (error) {
        res.status(400).send({ error: error.message })
    }
})





module.exports = MoviesRoute