const { DataTypes } = require("sequelize");

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("blogs", "year", {
      type: DataTypes.INTEGER,
      allowNull: false,
    });

    await queryInterface.sequelize.query(`
    ALTER TABLE blogs
    ADD CONSTRAINT check_year
    CHECK (year >= 1991 AND year <= ${new Date().getFullYear()});
    `);
  },
  down: async ({ context: queryInterface }) => {
   await queryInterface.sequelize.query(`
      ALTER TABLE blogs
      DROP CONSTRAINT check_year;
    `);
    await queryInterface.removeColumn("blogs", "year");
  },
};
