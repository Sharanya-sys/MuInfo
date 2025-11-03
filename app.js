const express = require('express');
const app = express();
const scanRoute = require('./routes/scan');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api/scan', scanRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));