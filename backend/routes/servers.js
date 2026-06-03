const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// Get user servers
router.get('/', authMiddleware, async (req, res) => {
  try {
    const connection = await db.getConnection();
    
    const [servers] = await connection.query(
      'SELECT * FROM servers WHERE user_id = ?',
      [req.user.userId]
    );

    connection.release();

    res.json(servers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch servers' });
  }
});

// Create new server
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { server_name } = req.body;
    
    if (!server_name) {
      return res.status(400).json({ error: 'Server name is required' });
    }

    const connection = await db.getConnection();
    const serverId = uuidv4();
    const port = Math.floor(Math.random() * (30000 - 25565 + 1)) + 25565;

    const [result] = await connection.query(
      'INSERT INTO servers (id, user_id, server_name, port, status) VALUES (?, ?, ?, ?, ?)',
      [serverId, req.user.userId, server_name, port, 'stopped']
    );

    connection.release();

    res.status(201).json({
      message: 'Server created successfully',
      server: {
        id: serverId,
        server_name,
        port,
        status: 'stopped'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create server' });
  }
});

// Start server
router.post('/:serverId/start', authMiddleware, async (req, res) => {
  try {
    const { serverId } = req.params;
    const connection = await db.getConnection();

    // Verify server belongs to user
    const [servers] = await connection.query(
      'SELECT * FROM servers WHERE id = ? AND user_id = ?',
      [serverId, req.user.userId]
    );

    if (servers.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Server not found' });
    }

    // Update status
    await connection.query(
      'UPDATE servers SET status = ? WHERE id = ?',
      ['running', serverId]
    );

    connection.release();

    res.json({
      message: 'Server started',
      status: 'running'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to start server' });
  }
});

// Stop server
router.post('/:serverId/stop', authMiddleware, async (req, res) => {
  try {
    const { serverId } = req.params;
    const connection = await db.getConnection();

    const [servers] = await connection.query(
      'SELECT * FROM servers WHERE id = ? AND user_id = ?',
      [serverId, req.user.userId]
    );

    if (servers.length === 0) {
      connection.release();
      return res.status(404).json({ error: 'Server not found' });
    }

    await connection.query(
      'UPDATE servers SET status = ? WHERE id = ?',
      ['stopped', serverId]
    );

    connection.release();

    res.json({
      message: 'Server stopped',
      status: 'stopped'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to stop server' });
  }
});

module.exports = router;