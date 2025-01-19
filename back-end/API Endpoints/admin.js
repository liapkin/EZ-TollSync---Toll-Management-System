const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const { sequelize, models } = require('../models');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Object.keys(require.cache).forEach((key) => {
//     delete require.cache[key];
// });

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

// 2. /admin/resetstations
router.post('/resetstations', async (req, res) => {
    const filePath = '../data/tollstations2024.csv';

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
                                tollid: row['TollID']
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

// router.post('/resetstations', async (req, res) => {
//     const filePath = '../data/tollstations2024.csv'; // Ensure correct path resolution

//     try {
//         if (!fs.existsSync(filePath)) {
//             return res.status(400).json({ status: "failed", info: "File not found" });
//         }

//         const transaction = await sequelize.transaction(); // Start transaction
//         const stations = []; // Collect rows to be inserted

//         try {
//             // Step 1: Clear the TollStation table within the transaction
//             await models.TollStation.destroy({ where: {} }, { transaction });

//             // Step 2: Process CSV file
//             await new Promise((resolve, reject) => {
//                 fs.createReadStream(filePath)
//                     .pipe(csvParser())
//                     .on('data', async (row) => {
//                         try {
//                             // Find operatorId for the given Operator name
//                             let operator = await models.Operator.findOne({
//                                 where: { name: row['Operator'] }, 
//                                 transaction
//                             });

//                             if (!operator) {
//                                 console.warn(`Warning: Operator "${row['Operator']}" not found.`);
//                                 return; // Skip this row instead of throwing an error
//                             }

//                             // Extract necessary columns and include operatorId
//                             stations.push({
//                                 name: row['Name'],
//                                 locality: row['Locality'],
//                                 road: row['Road'],
//                                 lat: parseFloat(row['Lat']),
//                                 long: parseFloat(row['Long']),
//                                 price1: parseFloat(row['Price1']),
//                                 price2: parseFloat(row['Price2']),
//                                 price3: parseFloat(row['Price3']),
//                                 price4: parseFloat(row['Price4']),
//                                 operatorId: operator.id, // Set operatorId from the database
//                                 tollid: row['TollID']
//                             });
//                         } catch (error) {
//                             console.error(`Error processing row ${JSON.stringify(row)}:`, error.message);
//                         }
//                     })
//                     .on('end', resolve)
//                     .on('error', reject);
//             });

//             // Step 3: Insert all collected stations in a single bulk insert
//             if (stations.length > 0) {
//                 await models.TollStation.bulkCreate(stations, { transaction });
//             } else {
//                 console.warn('No valid stations found to insert.');
//             }

//             // Step 4: Commit transaction if everything went well
//             await transaction.commit();
//             res.json({ status: "OK", message: `${stations.length} toll stations inserted successfully` });

//         } catch (error) {
//             await transaction.rollback(); // Rollback transaction on error
//             console.error('Error processing CSV:', error);
//             res.status(500).json({ status: "failed", info: error.message });
//         }
//     } catch (error) {
//         console.error('Server error:', error);
//         res.status(500).json({ status: "failed", info: "Server error" });
//     }
// });


// 3. /admin/resetpasses
router.post('/resetpasses', async (req, res) => {
    try {
        // Delete all passes, tags
        await models.Pass.destroy({ where: {} });
        await models.Tag.destroy({ where: {} });

        // ToDo: create admin account 
        
        res.json({ status: "OK" });
    } catch (error) {
        res.status(500).json({ status: "failed", info: error.message });
    }

});

// 4. /admin/addpasses 
// router.post('/addpasses', upload.single('file'), async (req, res) => {
//     const filePath = '../data/passes-sample.csv';

//     try {
//         if (!fs.existsSync(filePath)) {
//             return res.status(400).json({
//                 status: "failed",
//                 info: "File not found",
//             });
//         }

//         const transaction = await sequelize.transaction(); // Start transaction
//         const passes = []; // Collect rows to be inserted

//         try {

//             // Array to hold all database queries
//             const promises = [];

//             // Read and process the CSV file
//             fs.createReadStream(filePath)
//                 .pipe(csvParser())
//                 .on('data', (row) => {
//                     // Add a promise for each asynchronous operation
//                     promises.push(
//                         (async () => {
//                             // Find operatorId for the given Operator name
//                             const operator = await models.Operator.findOne({
//                                 where: { name: row['Operator'] }, // Match 'operator' column (lowercase)
//                                 transaction,
//                             });
//                             if (!operator) {
//                                 throw new Error(`Operator "${row['Operator']}" not found in the database.`);
//                             }

//                             // const tag = await models.Operator.findOne({
//                             //     where: { name: row['Operator'] }, // Match 'operator' column (lowercase)
//                             //     transaction,
//                             // });
//                             // if (!tag) {
//                             //     throw new Error(`Operator "${row['Operator']}" not found in the database.`);
//                             // }
//                             const tollstation = await models.Τollstation.findOne({
//                                 where: { tollid: row['TollID'] }, // Match 'operator' column (lowercase)
//                                 transaction,
//                             });
//                             if (!tollstation) {
//                                 throw new Error(`Τollstation "${row['TollID']}" not found in the database.`);
//                             }

//                             // Extract necessary columns and include operatorId
//                             passes.push({
//                                 timestamp: row['Timestamp'],
//                                 charge: row['Charge'],
//                                 tagid: tag.id,
//                                 tollstationid: tollstation.id,
//                             });
//                         })()
//                     );
//                 })
//                 .on('end', async () => {
//                     try {
//                         // Wait for all asynchronous operations to complete
//                         await Promise.all(promises);

//                         // Insert all passes into the database
//                         await models.Pass.bulkCreate(passes, { transaction });

//                         // Commit the transaction after all queries
//                         await transaction.commit();
//                         res.json({ status: "OK" });
//                     } catch (error) {
//                         await transaction.rollback(); // Rollback transaction on error
//                         console.error('Error processing CSV:', error);
//                         res.status(500).json({ status: "failed", info: error.message });
//                     }
//                 })
//                 .on('error', async (err) => {
//                     await transaction.rollback(); // Rollback transaction on CSV error
//                     console.error('Error reading CSV:', err);
//                     res.status(500).json({ status: "failed", info: "Error reading CSV file" });
//                 });
//         } catch (error) {
//             await transaction.rollback(); // Rollback transaction on error
//             res.status(500).json({ status: "failed", info: error.message });
//         }
//     } catch (error) {
//         console.error('Server error:', error);
//         res.status(500).json({ status: "failed", info: "Server error" });
//     }
    
// });

//  .............................................
router.post('/addpasses', async (req, res) => {
    const filePath = '../data/passes-sample.csv';

    try {
        if (!fs.existsSync(filePath)) {
            return res.status(400).json({
                status: "failed",
                info: "File not found",
            });
        }

        const transaction = await sequelize.transaction();
        const passes = []; // collect rows to be inserted
        const promises = []; // Store async operations
    
        try {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (row) => {
                    promises.push(
                        (async () => {
                            try {
                                // Find TollStation ID
                                // const tollStation = await models.TollStation.findOne({
                                //     where: { tollid: row['TollID'] },
                                //     transaction,
                                // });

                                // if (!tollStation) {
                                //     throw new Error(`Toll Station with TollID "${row['TollID']}" not found.`);
                                // }

                                // Find or insert Tag ID
                                // let tag = await models.Tag.findOne({
                                //     where: { tagRef: row['TagRef'] },
                                //     transaction,
                                // });

                                // if (!tag) {
                                //     const operator = await models.Operator.findOne({
                                //         where: { code: row['TagHomerID'] },
                                //         transaction,
                                //     });

                                //     if (!operator) {
                                //         throw new Error(`Operator with code "${row['TagHomerID']}" not found.`);
                                //     }

                                //     tag = await models.Tag.create(
                                //         { tagRef: row['TagRef'], operatorId: operator.id },
                                //         { transaction }
                                //     );
                                // }

                                // Collect pass data
                                passes.push({
                                    timestamp: row['Timestamp'],
                                    charge: parseFloat(row['Charge']),
                                    // tagId: tag.id,
                                    // tollStationId: tollStation.id,
                                });
                            } catch (err) {
                                console.error('Error processing row:', err.message);
                            }
                        })()
                    );
                })
                .on('end', async () => {
                    try {
                        // Wait for all async operations to complete
                        await Promise.all(promises);

                        // Insert all collected passes
                        await models.Pass.bulkCreate(passes, { transaction });

                        // Commit transaction
                        await transaction.commit();
                        res.json({ status: "OK" });
                    } catch (error) {
                        await transaction.rollback();
                        console.error('Error processing CSV:', error);
                        res.status(500).json({ status: "failed", info: error.message });
                    }
                })
                .on('error', async (err) => {
                    await transaction.rollback();
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

module.exports = router;
