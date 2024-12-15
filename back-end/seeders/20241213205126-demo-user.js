'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Εισαγωγή ενός νέου χρήστη στη βάση
    await queryInterface.bulkInsert('Users', [{
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down(queryInterface, Sequelize) {
    // Διαγραφή του χρήστη αν χρειαστεί
    await queryInterface.bulkDelete('Users', { email: 'john.doe@example.com' }, {});
  }
};
