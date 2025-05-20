const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./database/db');
const initSocket = require('./socket');
const authRoutes = require('./routes/auth');
const userAuthRoutes = require('./routes/userauth');
const app = express();
const server = http.createServer(app);


app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.json());


connectDB();

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/userauth', userAuthRoutes); 


initSocket(server);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
