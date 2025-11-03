const axios = require('axios');

exports.recognizeArtwork = async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    // Send to Google Cloud Vision or mock response
    const result = {
      title: 'Starry Night',
      artist: 'Vincent van Gogh',
      year: 1889,
      description: 'A famous post-impressionist painting.',
    };
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Recognition failed' });
  }
};