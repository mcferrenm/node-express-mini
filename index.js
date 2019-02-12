const express = require('express');
const db = require('./data/db');
const cors = require('cors')

const server = express();

server.use(express.json())
server.use(cors())

server.post('/api/users', (req, res) => {
  const newUser = req.body;

  if (!newUser.name || !newUser.bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  }

  db.insert(newUser)
    .then(({ id }) => {
      db.findById(id)
        .then(user => {
          if (user) {
            res.status(201).json(user)
          } else {
            res.status(404).json({ error: "The user information could not be retrieved." })
          }
        })
        .catch(({ code }) => {
          res.status(code).json({
            error: "There was an error while saving the user to the database"
          })
        });
    })
    .catch(() => {
      res.status(500).json({ error: "There was an error while saving the user to the database" })
    });
});

server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(({ code }) => {
      res.status(code).json({ error: "The users information could not be retrieved." })
    })

});

server.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  db.findById(userId)
    .then(user => {
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
      }
    })
    .catch(({ code }) => {
      res.status(code).json({
        error: "The user information could not be retrieved."
      })
    });
});

server.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;

  db.findById(userId)
    .then(user => {
      if (user) {
        db.remove(userId)
          .then(id => {
            res.status(204).end();
          })
          .catch(({ code }) => {
            res.status(code).json({ message: "The user could not be removed" })
          });
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
      }
    })
    .catch(({ code }) => {
      res.status(code).json({
        error: "The user information could not be retrieved."
      })
    });
});

server.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const changes = req.body;

  if (!changes.name || !changes.bio) {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  }

  db.update(userId, changes)
    .then(() => {

      db.findById(userId)
        .then(user => {
          if (user) {
            res.status(200).json(user)
          } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." })
          }
        })
        .catch(({ code }) => {
          res.status(code).json({
            error: "The user information could not be modified."
          })
        });
    })
    .catch(({ code }) => {
      res.status(code).json({ error: "The user information could not be modified." })
    });
});

server.listen(4000, (req, res) => {
  console.log('\n\n*** Now listening on port 4000 ***\n')
})