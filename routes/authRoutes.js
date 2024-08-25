const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken')

const SECRET_KEY = 'your_jwt_secret_key';

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);
    const checkUserExists = `SELECT username FROM users WHERE username=?`;
    db.get(checkUserExists, [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        if (row) {
            return res.status(400).json({ error: 'Username already exists' });
        }
        const insertUser = `INSERT INTO users (id, username, password) VALUES (?, ?, ?)`;
        db.run(insertUser, [id, username, hashedPassword], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(201).json({ message: 'User registered successfully', userId: id });
        });
    });
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM USERS WHERE username=?`;
    db.get(query, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving user' });
        }
        if (!user) {
            return res.status(401).json({ message: 'User Not registered' });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords' });
            }
            if (!result) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign({username}, SECRET_KEY);
            res.status(201).json({token})
        });
    });
});


module.exports = router;
