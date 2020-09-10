const express = require('express')
const app = express()
const mongoose = require('mongoose')
const User = require('./users')
const e = require('express')

mongoose.connect('mongodb://localhost/pagination',  { useUnifiedTopology: true, useNewUrlParser: true })

const db = mongoose.connection
db.once('open', async () => {

    if(await User.countDocuments().exec() > 0 ) return

    Promise.all([
        User.create({name: 'User 1'}),
        User.create({name: 'User 2'}),
        User.create({name: 'User 3'}),
        User.create({name: 'User 4'}),
        User.create({name: 'User 5'}),
        User.create({name: 'User 6'}),
        User.create({name: 'User 7'}),
        User.create({name: 'User 8'}),
        User.create({name: 'User 9'}),
        User.create({name: 'User 10'}),
        User.create({name: 'User 11'}),
        User.create({name: 'User 12'}),
        User.create({name: 'User 13'}),
    ]).then(() => console.log('Added Users'))

})

/*
const users = [
    {id: 1, name: 'User 1'},
    {id: 2, name: 'User 2'},
    {id: 3, name: 'User 3'},
    {id: 4, name: 'User 4'},
    {id: 5, name: 'User 5'},
    {id: 6, name: 'User 6'},
    {id: 7, name: 'User 7'},
    {id: 8, name: 'User 8'},
    {id: 9, name: 'User 9'},
    {id: 10, name: 'User 10'},
    {id: 11, name: 'User 11'},
    {id: 12, name: 'User 12'},
    {id: 13, name: 'User 13'},
]*/

app.get('/users', paginatedResults(User), (req, res) => {

    res.json(res.paginatedResults)
   
});

function paginatedResults(model){

    return async (req, res, next) => {

        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
    
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        
        console.log('start',startIndex, 'end',endIndex, 'lenght', model.length)
    
        const results = {}

        
        //paginación con array 
        //let total_registros = model.length
        //paginacion con modelo bd
        let total_registros = await model.countDocuments().exec()
    
        if(endIndex < total_registros){
            results.next = {
                page: page + 1,
                limit: limit
            }
        }
        
    
        if(startIndex > 0){
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }

        //paginación con array
        //results.results = model.slice(startIndex, endIndex)
        //paginación con modelo de bd
        try{
           results.results = await model.find().limit(limit).skip(startIndex).exec() 
           res.paginatedResults = results
           next()
        }catch(e) {
            res.status(500).json({
                message: e.message
            })
        };
        
    
       

    }


}


app.listen(3000)