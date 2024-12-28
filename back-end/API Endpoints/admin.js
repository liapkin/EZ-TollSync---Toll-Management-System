const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const { sequelize, models } = require('../models');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 1. /admin/healthcheck
router.get('/healthcheck', async (req, res) => {
    try {
        await sequelize.authenticate();
        const nStations = await models.TollStation.count();
        const nTags = await models.Tag.count();
        const nPasses = await models.Pass.count();

        res.status(200).json({
            status: "OK",
            dbconnection: sequelize.config.database,
            n_stations: nStations,
            n_tags: nTags,
            n_passes: nPasses,
        });
    } catch (error) {
        res.status(401).json({
            status: "failed",
            dbconnection: sequelize.config.database,
        });
    }
});

// router.get('/test-operators', async (req, res) => {
//     try {
//         // Query the operator table for "neaodos"
//         const operator = await models.Operator.findOne({
//             where: { name: 'neaodos' }, // Search for the operator named "neaodos"
//         });

//         if (!operator) {
//             console.error('Operator "neaodos" not found.');
//             return res.status(404).json({ status: 'failed', info: 'Operator "neaodos" not found.' });
//         }

//         // Log the operator's ID to the console
//         console.log('Operator "neaodos" ID:', operator.id);

//         // Respond with the operator's ID
//         res.json({ status: 'OK', operatorId: operator.id });
//     } catch (error) {
//         console.error('Error testing operators:', error);
//         res.status(500).json({ status: 'failed', info: error.message });
//     }
// });

// 2. /admin/resetstations
router.post('/resetstations', async (req, res) => {
    const filePath = '../data/tollstations2024.csv'; // Update the path as needed

    try {
        if (!fs.existsSync(filePath)) {
            return res.status(400).json({
                status: "failed",
                info: "File not found",
            });
        }

        const transaction = await sequelize.transaction(); // Start transaction
        const stations = []; // Collect rows to be inserted

        try {
            // Clear the TollStation table within the transaction
            await models.TollStation.destroy({ where: {} }, { transaction });

            // Array to hold all database queries
            const promises = [];

            // Read and process the CSV file
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (row) => {
                    // Add a promise for each asynchronous operation
                    promises.push(
                        (async () => {
                            // Find operatorId for the given Operator name
                            const operator = await models.Operator.findOne({
                                where: { name: row['Operator'] }, // Match 'operator' column (lowercase)
                                transaction,
                            });

                            if (!operator) {
                                throw new Error(`Operator "${row['Operator']}" not found in the database.`);
                            }

                            // Extract necessary columns and include operatorId
                            stations.push({
                                name: row['Name'],
                                locality: row['Locality'],
                                road: row['Road'],
                                lat: parseFloat(row['Lat']),
                                long: parseFloat(row['Long']),
                                price1: parseFloat(row['Price1']),
                                price2: parseFloat(row['Price2']),
                                price3: parseFloat(row['Price3']),
                                price4: parseFloat(row['Price4']),
                                operatorId: operator.id, // Set operatorId from the database
                            });
                        })()
                    );
                })
                .on('end', async () => {
                    try {
                        // Wait for all asynchronous operations to complete
                        await Promise.all(promises);

                        // Insert all stations into the database
                        await models.TollStation.bulkCreate(stations, { transaction });

                        // Commit the transaction after all queries
                        await transaction.commit();
                        res.json({ status: "OK" });
                    } catch (error) {
                        await transaction.rollback(); // Rollback transaction on error
                        console.error('Error processing CSV:', error);
                        res.status(500).json({ status: "failed", info: error.message });
                    }
                })
                .on('error', async (err) => {
                    await transaction.rollback(); // Rollback transaction on CSV error
                    console.error('Error reading CSV:', err);
                    res.status(500).json({ status: "failed", info: "Error reading CSV file" });
                });
        } catch (error) {
            await transaction.rollback(); // Rollback transaction on error
            res.status(500).json({ status: "failed", info: error.message });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ status: "failed", info: "Server error" });
    }
});

// 3. /admin/resetpasses
router.post('/resetpasses', async (req, res) => {
    try {
        // Delete all passes, tags
        await models.Pass.destroy({ where: {} });
        await models.Tag.destroy({ where: {} });

        res.json({ status: "OK" });
    } catch (error) {
        res.status(500).json({ status: "failed", info: error.message });
    }

    // ToDo: create admin account ? All should be called only by admin

});

// 4. /admin/addpasses 
router.post('/addpasses', upload.single('file'), async (req, res) => {
    // ToDo
    const file = req.file;

    if (!file || file.mimetype !== 'text/csv') {
        return res.status(400).json({
            status: "failed",
            info: "Invalid file format",
        });
    }

    try {
        const passes = [];
        fs.createReadStream(file.path)
            .pipe(csvParser())
            .on('data', (data) => passes.push(data))
            .on('end', async () => {
                await models.Pass.bulkCreate(passes);
                fs.unlinkSync(file.path); // Clean up the uploaded file
                res.json({ status: "OK" });
            });
    } catch (error) {
        res.status(500).json({ status: "failed", info: error.message });
    }
});

module.exports = router;
