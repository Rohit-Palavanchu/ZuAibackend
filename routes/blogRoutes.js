const express = require('express');
const router = express.Router();
const db = require('../models/db'); 
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_jwt_secret_key';

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token not provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }

        req.user = user;
        next();
    });
}

// Middleware to check post ownership
function checkPostOwnership(req, res, next) {
    const { id } = req.params;
    const username = req.user.username;

    const query = `SELECT username FROM BLOGS WHERE id = ?`;

    db.get(query, [id], (err, post) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!post) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        if (post.username !== username) {
            return res.status(403).json({ error: 'You are not authorized to update or delete this post' });
        }

        next();
    });
}

// Routes

router.get('/posts', (req, res) => {
    const query = `SELECT * FROM BLOGS ORDER BY created_at DESC;`;
    db.all(query, (err, blogs) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(blogs);
    });
});

router.get('/userposts', authenticateToken, (req, res) => {
    const username = req.user.username;
    const query = `SELECT * FROM BLOGS WHERE username = ?`;
    db.all(query, [username], (err, blogs) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ blogs });
    });
});

router.post('/posts', authenticateToken, (req, res) => {
    const { title, content } = req.body;
    const username = req.user.username;
    const id = uuidv4();

    const query = `
        INSERT INTO BLOGS (id, username, title, content, created_at, last_modified)
        VALUES (?, ?, ?, ?, DATETIME('now'), DATETIME('now'))
    `;

    db.run(query, [id, username, title, content], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ postId: id });
    });
});

router.get('/posts/:id', (req, res) => {
    const { id } = req.params;

    const query = `SELECT * FROM BLOGS WHERE id = ?`;

    db.get(query, [id], (err, blog) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!blog) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        res.json(blog);
    });
});

router.delete('/posts/:id', authenticateToken, checkPostOwnership, (req, res) => {
    const { id } = req.params;
    const query = `DELETE FROM BLOGS WHERE id = ?`;
    db.run(query, [id], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Deleted the post" });
    });
});

router.put('/posts/:id', authenticateToken, checkPostOwnership, (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
    }

    const query = `UPDATE BLOGS SET title = ?, content = ?, last_modified = DATETIME('now') WHERE id = ?`;

    db.run(query, [title, content, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        res.status(200).json({ message: 'Updated successfully' });
    });
});

module.exports = router;
