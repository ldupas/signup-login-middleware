const connection = require("../db-config");
const router = require("express").Router();
const Joi = require('joi');
const argon2 = require('argon2');
const { generateJwt } = require('../utils/auth');
const checkJwt = require('../middlewares/checkJwt')

const { findUserByEmail, insertUser } = require('../models/users');

router.get('/', checkJwt, (req, res) => {
    connection.query('SELECT * FROM users', (err, result) => {
      if (err) {
        res.status(500).send('Error retrieving users from database');
      } else {
        res.json(result);
      }
    });
  });

router.get('/:id', (req, res) => {
  const userId = req.params.id;
  connection.query(
    'SELECT * FROM users WHERE id = ?',
    [userId],
    (err, results) => {
      if (err) {
        res.status(500).send('Error retrieving user from database');
      } else {
        if (results.length) res.json(results[0]);
        else res.status(404).send('User not found');
      }
    }
  );
});  

const userSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
})

router.post('/', async (req, res) => {
    // recup donnees requete
    const { value, error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json(error);
    }

    // verifie si user existe
    // await permet d'etre sur d'avoir un retour de verif user
    const [[existingUser]] = await findUserByEmail(value.email);
    if (existingUser) {
        return res.status(409).json({
            message: "l'utilisateur existe deja",
        })
    }

    // etape de l'encryptage
    const hashedPassword = await argon2.hash(value.password);
    await insertUser(value.email, hashedPassword, 'ROLE_USER');

    const jwtKey = generateJwt(value.email, 'ROLE_USER');
    return res.json({
        credentials: jwtKey,
    })

    // return res.json({
    //     message: "l'utilisateur a bien ete cree"
    // })

})

router.post('/login', async (req, res) => {
  // on reprend ici les verif de donnees utilisateur dans le formulaire
  const { value, error } = userSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json(error);
  }

  const [[existingUser]] = await findUserByEmail(value.email);

  if (!existingUser) {
    return res.status(403).json({
      message: 'utilisateur no trouve ou le mot de passe ne correspond au compte'
    })
  }

  const verified = await argon2.verify(existingUser.password, value.password)

  if (!verified) {
    return res.status(403).json({
      message: 'utilisateur non trouve ou le mot de passe ne correspond au compte'
    })
  }

  const jwtKey = generateJwt(value.email, 'ROLE_USER');
  return res.json({
    credentials: jwtKey
  })
})


module.exports = router;
// router.get('/', (req, res) => {
//     connection.query('SELECT * FROM users', (err, result) => {
//       if (err) {
//         res.status(500).send('Error retrieving users from database');
//       } else {
//         res.json(result);
//       }
//     });
//   });

// router.get('/:id', (req, res) => {
//   const userId = req.params.id;
//   connection.query(
//     'SELECT * FROM users WHERE id = ?',
//     [userId],
//     (err, results) => {
//       if (err) {
//         res.status(500).send('Error retrieving user from database');
//       } else {
//         if (results.length) res.json(results[0]);
//         else res.status(404).send('User not found');
//       }
//     }
//   );
// });

// router.get('/:id/posts', (req, res) => {
//   const userId = req.params.id;
//   connection.query(
//     'SELECT * FROM posts JOIN users ON users.id=posts.user_id WHERE users.id=?',
//     [userId],
//     (err, results) => {
//       if (err) {
//         res.status(500).send('Error retrieving user from database');
//       } else {
//         if (results.length) res.json(results[0]);
//         else res.status(404).send('User not found');
//       }
//     }
//   );
// });

// router.post('/', (req, res) => {
//   const { username, password, email } = req.body;
//   connection.query(
//     'INSERT INTO users (username, password, email) VALUES (?, ?, ?)',
//     [username, password, email],
//     (err, result) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Error saving the user');
//       } else {
//         const id = result.insertId;
//         const createdUser = { id, username, password, email };
//         res.status(201).json(createdUser);
//       }
//     }
//   );
// });

// router.put('/:id', (req, res) => {
//   const userId = req.params.id;
//   const db = connection.promise();
//   let existingUser = null;
//   db.query('SELECT * FROM users WHERE id = ?', [userId])
//     .then(([results]) => {
//       existingUser = results[0];
//       if (!existingUser) return Promise.reject('RECORD_NOT_FOUND');
//       return db.query('UPDATE users SET ? WHERE id = ?', [req.body, userId]);
//     })
//     .then(() => {
//       res.status(200).json({ ...existingUser, ...req.body });
//     })
//     .catch((err) => {
//       console.error(err);
//       if (err === 'RECORD_NOT_FOUND')
//         res.status(404).send(`User with id ${userId} not found.`);
//       else res.status(500).send('Error updating a user');
//     });
// });

// router.delete('/:id', (req, res) => {
//   connection.query(
//     'DELETE FROM users WHERE id = ?',
//     [req.params.id],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.status(500).send('Error deleting an user');
//       } else {
//         if (result.affectedRows) res.status(200).send('🎉 User deleted!');
//         else res.status(404).send('User not found.');
//       }
//     }
//   );
// });