import express from 'express';
import mediaProcessor from '../utils/mediaProcessor.js';

const router = express.Router();

/**
 * POST /api/info
 * Get video information
 */
router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const info = await mediaProcessor.getVideoInfo(url);
    res.json(info);
  } catch (error) {
    res.status(400).json({ 
      error: error.message || 'Failed to fetch video info'
    });
  }
});

export default router;
