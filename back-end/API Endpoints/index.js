const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Initialize Express app
const app = express();
app.use(express.json());

// PostgreSQL Connection Pool
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'test_db',
  password: 'root',
  port: 5432, // Default PostgreSQL port
});

// Configure file upload with multer
const upload = multer({ dest: 'uploads/' });


// Testing endpoint
// app.get('/admin/dbcheck', async (req, res) => {
//   try {
//     // Query to check if the database connection works
//     const result = await pool.query('SELECT 1');
    
//     // If successful, return confirmation
//     res.status(200).json({
//       status: 'OK',
//       message: 'Successfully connected to the database!',
//     });
//   } catch (err) {
//     console.error('Database connection error:', err.message);
    
//     // If connection fails, return failure response
//     res.status(500).json({
//       status: 'failed',
//       message: 'Error connecting to the database',
//       error: err.message,
//     });
//   }
// });


// Route 1: Healthcheck
app.get('/admin/healthcheck', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) FROM toll_stations');
    const n_stations = result.rows[0].count;

    const stats = await pool.query('SELECT COUNT(*) AS n_passes, COUNT(DISTINCT tag_id) AS n_tags FROM passes');

    res.status(200).json({
      status: 'OK',
      dbconnection: 'successful',
      n_stations: parseInt(n_stations),
      n_tags: parseInt(stats.rows[0].n_tags),
      n_passes: parseInt(stats.rows[0].n_passes),
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({
      status: 'failed',
      dbconnection: 'error connecting to database',
    });
  }
});

// Route 2: Reset Stations
app.post('/admin/resetstations', async (req, res) => {
  const filePath = path.join(__dirname, 'tollstations2024.csv'); // Adjust path as needed
  try {
    // Step 1: Clear existing data
    await pool.query('TRUNCATE TABLE toll_stations RESTART IDENTITY');

    const headers = [
      'OpID', 'Operator', 'TollID', 'Name', 'PM',
      'Locality', 'Road', 'Lat', 'Long', 'Email',
      'Price1', 'Price2', 'Price3', 'Price4'
    ];

    // Step 2: Read and insert data from CSV
    const stream = fs.createReadStream(filePath)
      // .pipe(csv({ headers: true })) // Ensure the first row is treated as headers
      .pipe(csv({ headers: headers, skipEmptyLines: true })) // Force header definition
      .on('data', async (row) => {
        try {
          await pool.query(
            `INSERT INTO toll_stations 
            (operator, toll_id, name, pm, locality, road, latitude, longitude, email, price1, price2, price3, price4) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
            [
              row['Operator'],  // Mapping CSV columns to table fields
              row['TollID'],
              row['Name'],
              row['PM'],
              row['Locality'],
              row['Road'],
              parseFloat(row['Lat']),  // Convert to float for DECIMAL fields
              parseFloat(row['Long']),
              row['Email'],
              parseFloat(row['Price1']),
              parseFloat(row['Price2']),
              parseFloat(row['Price3']),
              parseFloat(row['Price4']),
            ]
          );
        // } catch (err) {
        //   console.error('Error inserting row:', row, err.message);
        // }
        } catch (insertErr) {
          console.error(`Error inserting row: ${JSON.stringify(row)} - ${insertErr.message}`);
        }
      })
      .on('end', () => {
        res.json({ status: 'OK' });
      });

  } catch (err) {
    console.error('Error resetting toll stations:', err.message);
    res.status(500).json({ status: 'failed', info: 'Error resetting toll stations' });
  }
});


// Route 3: Reset Passes
app.post('/admin/resetpasses', async (req, res) => {
  const { username, password } = req.body;
  if (username !== 'admin' || password !== 'freepasses4all') {
    return res.json({ status: 'failed', info: 'Invalid credentials' });
  }
  try {
    await pool.query('TRUNCATE TABLE passes, tags CASCADE RESTART IDENTITY');
    res.json({ status: 'OK' });
  } catch (err) {
    console.error(err);
    res.json({ status: 'failed', info: 'Error resetting passes and tags' });
  }
});

// Route 4: Add Passes
app.post('/admin/addpasses', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.json({ status: 'failed', info: 'No file uploaded' });
  }

  const filePath = req.file.path;
  try {
    const stream = fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        await pool.query(
          'INSERT INTO passes (pass_id, tag_id, station_id, timestamp) VALUES ($1, $2, $3, $4)',
          [row.pass_id, row.tag_id, row.station_id, row.timestamp]
        );
      })
      .on('end', () => {
        res.json({ status: 'OK' });
        fs.unlinkSync(filePath); // Clean up uploaded file
      });
  } catch (err) {
    console.error(err);
    res.json({ status: 'failed', info: 'Error adding passes from file' });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});