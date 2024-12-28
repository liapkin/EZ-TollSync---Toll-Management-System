const express = require('express');
const adminRoutes = require('./admin');

const app = express();
app.use(express.json());

// Mount admin routes
app.use('/admin', adminRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
