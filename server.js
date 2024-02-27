const express = require('express');
const consultaRoutes = require('./src/routes/consultaRoutes');

const app = express();
app.use(express.json());

app.use('/api/query', consultaRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
