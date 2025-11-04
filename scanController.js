
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();

exports.recognizeArtwork = async (req, res) => {
  try {
    const buffer = req.file.buffer;

    const [result] = await client.labelDetection({ image: { content: buffer } });
    const labels = result.labelAnnotations?.map(label => label.description);

    res.json({
      title: labels[0] || 'Unknown',
      artist: 'Detected by Vision API',
      year: 'N/A',
      description: `Detected labels: ${labels.join(', ')}`,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Vision API failed' });
  }
};
