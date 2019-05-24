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
  db('zoos')
  .then(zoos => {
    res.json(zoos)
  })
  .catch(err => {
    res.status(500).json({ error: "Error retrieving the zoos" });
  });
});

server.post('/api/zoos', (req, res) => {
  const zoo = req.body;

  db('zoos')
    .insert(zoo)
    .then(ids => {
      res.status(201).json(ids[0]);
    })
    .catch(err => {
      res.status(500).json({ error: "Error adding the zoo" });
    });
});

server.get('/api/zoos/:id', async (req, res) => {
  const { id } = req.params;

  db('zoos')
    .where({ id })
    .first()
    .then(zoo => {

      if (zoo) {
        res.status(200).json(zoo);
      } else {
        res.status(404).json({ message: 'zoo not found' });
      }      
    })
    .catch(err => {
      res.status(500).json({ error: 'Error retrieving the user'});
    });
});

const port = 5001;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
