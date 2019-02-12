const express = require('express');
const db = require('./data/db');
const cors = require('cors');

const server = express();

server.use(express.json());
server.use(cors());

server.get('/users', (req, res) => {
  db.find()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(error => {
      res.status(error.code).json({ message: "Error" })
    });
});

server.get('/users/:id', (req, res) => {
  const userId = req.params.id;

  db.findById(userId)
    .then(user => {
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ message: "Not found" })
      }
    })
    .catch(error => {
      res.status(error.code).json({ message: "Error" })
    });
});

server.post('/users', (req, res) => {
  const newUser = req.body

  if(!newUser.name || !newUser.bio) {
    res.status(400).json({ message: Send both name and bio })
  }

  db.insert(newUser)
    .then(({ id }) => {
      db.findById(id)
        .then(user => {
          if (user) {
            res.status(200).json(user)
          } else {
            res.status(404).json({ message: "Not found" })
          }
        })
        .catch(error => {
          res.status(error.code).json({ message: "Error" })
        });
    })
    .catch(error => {
      res.status(error.code).json({ message: "Error" })
    });
});

server.delete('/users/:id', (req, res) => {
  const userId = req.params.id

  db.findById(userId)
    .then(user => {
      if (user) {
        db.delete(userId)
          .then()
          .catch(error => {
            res.status(error.code).json({ message: "Error" })
          });
      } else {
        res.status(404).json({ message: "Not found" })
      }
    })
    .catch(error => {
      res.status(error.code).json({ message: "Error" })
    });
});

server.put('/users/:id', (req, res) => {
  const userId = req.params.id
  const changes = req.body

  if(!changes.name || !changes.bio) {
    res.status(400).json({ message: Send both name and bio })
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
    .catch(error => {
      res.status(error.code).json({ message: "Error" })
    });
});

server.listen(4000, () => {
  console.log("\n\n*** Listening on port 4000 ***\n")
})