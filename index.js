const express = require('express');
const helmet = require('helmet');

const knex = require('knex');
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

server.get('/api/zoos', async (req, res) => {
  try {
    const zoos = await db('zoos')
    
    res.status(200).json(zoos);
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the zoos',
      // message: error.message,
    });
  }
  
});

server.post('/api/zoos', async (req, res) => {
  const zoo = req.body;

  try {
    const ids = await db('zoos').insert(zoo)
    
    res.status(201).json(ids[0]);
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error adding the zoos',
      // message: error.message,
    });
  }
});

server.get('/api/zoos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const zoo = await db('zoos').where({ id }).first()
    
    if (zoo) {
      res.status(200).json(zoo);
    } else {
      res.status(404).json({ message: 'zoo not found' });
    }  
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({ error: 'Error retrieving the user'});
  }
});

server.delete('/api/zoos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const count = await db('zoos').where({ id }).del()
    
    if (count) {
      res.json(count);
    } else {
      res.status(404).json({ message: 'zoo not found' });
    } 
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({ error: 'Error removing the user'});
  }
});


server.put('/api/zoos/:id', async (req, res) => {
  const changes = req.body;
  const { id } = req.params;  

  if(Object.keys(changes).length === 0){
    return res.status(400).json({message: "missing post data"});
  }

  try {
    const count = await db('zoos').where({ id }).update(changes)
    
    if (count) {
      res.json(count);
    } else {
      res.status(404).json({ message: 'zoo not found' });
    } 
  } catch (error) {
    // log error to server
    console.log(error);
    res.status(500).json({ error: 'Error updating the zoo'});
  }
});

const port = 5001;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
