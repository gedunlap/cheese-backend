///////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env var
require('dotenv').config()
// get port and mongo from .env
const {PORT = 3000, MONGODB_URL} = process.env
// import express
const express = require('express')
// create app object
const app = express()
// import mongoose for mongo
const mongoose = require('mongoose')
// import middleware
const cors = require('cors')
const morgan = require('morgan')


///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// establish connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
// connection events
mongoose.connection
    .on('open', () => console.log('You are connected to mongoose'))
    .on('close', () => console.log('You are disconnected from mongoose'))
    .on('error', (error) => console.log(error))

///////////////////////////////
// MODELS
////////////////////////////////
const CheeseSchema = new mongoose.Schema ({
    name: String,
    countryOfOrigin: String,
    image: String,
})

const Cheese = mongoose.model("Cheese", CheeseSchema)


///////////////////////////////
// MiddleWare
////////////////////////////////

app.use(cors()) //prevent cors errors
app.use(morgan('dev')) // logging
app.use(express.json())


///////////////////////////////
// ROUTES
////////////////////////////////
// test route
app.get('/', async (req, res) => {
    res.send('Hello Cheese Head')
})

// cheese index
app.get('/cheese', async (req, res) => {
    try{
        res.json(await Cheese.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})

// cheese create
app.post('/cheese', async (req, res) => {
    try{
        res.json(await Cheese.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

// cheese update
app.put('/cheese/:id', async (req, res) => {
    try{
        res.json(await Cheese.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
})

app.delete('/cheese/:id', async (req, res) => {
    try{
        res.json(await Cheese.findByIdAndRemove(req.params.id))
    } catch (error) {
        res.status(400).json(error)
    }
})

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))