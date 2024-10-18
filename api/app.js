const ex = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connection = require('./database/db.js');
const authRoutes = require('./routes/authRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const serviceRouter = require('./routes/serviceRoutes.js');
const bookingRouter = require('./routes/bookingRoutes.js');

dotenv.config();

const app = ex();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connection();

// Use cors middleware
app.use(cors());
app.use(ex.json());
app.use(ex.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/service', serviceRouter);
app.use('/api/booking', bookingRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
