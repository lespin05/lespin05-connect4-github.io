// Variables needed to establish logic and simplification.
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log('Sever is running at http://localhost:${PORT}');
});
