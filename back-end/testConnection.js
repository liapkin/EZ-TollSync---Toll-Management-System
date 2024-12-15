const { Sequelize } = require('sequelize');

// Εδώ βάζεις τα δεδομένα σύνδεσης με τη βάση δεδομένων
const sequelize = new Sequelize('database_development', 'root', 'Apaixtos001!', {
  host: 'localhost',
  dialect: 'postgres'
});

async function testConnection() {
  try {
    await sequelize.authenticate();  // Προσπαθεί να συνδεθεί στη βάση δεδομένων
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();  // Καλεί τη συνάρτηση για να ελέγξει τη σύνδεση
