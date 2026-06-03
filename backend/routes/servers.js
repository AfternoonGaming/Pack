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

// Create new server (generates Colab notebook URL)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { server_name } = req.body;
    
    if (!server_name) {
      return res.status(400).json({ error: 'Server name is required' });
    }

    const connection = await db.getConnection();
    const serverId = uuidv4();
    const port = Math.floor(Math.random() * (30000 - 25565 + 1)) + 25565;
    const colabNotebookUrl = `https://colab.research.google.com/notebook#create=true&import=https%3A%2F%2Fraw.githubusercontent.com%2FAfternoonGaming%2FPack%2Fmain%2Fcolab-setup%2Fsetup-notebook.ipynb`;

    const [result] = await connection.query(
      'INSERT INTO servers (id, user_id, server_name, port, status, colab_url) VALUES (?, ?, ?, ?, ?, ?)',
      [serverId, req.user.userId, server_name, port, 'stopped', colabNotebookUrl]
    );

    connection.release();

    res.status(201).json({
      message: 'Server created successfully. Open the notebook link to start!',
      server: {
        id: serverId,
        server_name,
        port,
        status: 'stopped',
        colab_url: colabNotebookUrl,
        instructions: 'Click the Colab link to open the notebook, enter your ngrok token, and run the cells!'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create server' });
  }
});

// Update server status (called from Colab)
router.post('/:serverId/update-status', async (req, res) => {
  try {
    const { serverId } = req.params;
    const { status, public_url } = req.body;
    
    const connection = await db.getConnection();

    await connection.query(
      'UPDATE servers SET status = ?, ip_address = ?, updated_at = NOW() WHERE id = ?',
      [status, public_url || null, serverId]
    );

    connection.release();

    res.json({
      message: `Server status updated to ${status}`,
      status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update server status' });
  }
});

// Get server details with Colab link
router.get('/:serverId', authMiddleware, async (req, res) => {
  try {
    const { serverId } = req.params;
    const connection = await db.getConnection();

    const [servers] = await connection.query(
      'SELECT * FROM servers WHERE id = ? AND user_id = ?',
      [serverId, req.user.userId]
    );

    connection.release();

    if (servers.length === 0) {
      return res.status(404).json({ error: 'Server not found' });
    }

    res.json(servers[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch server' });
  }
});

module.exports = router;