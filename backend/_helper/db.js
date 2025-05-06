const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // Create the database if it doesn't already exist
    const { host, port, user, password, database } = config.database;
    const connection = await mysql.createConnection({ host, port, user, password });
    
    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    // Close the connection after database creation
    await connection.end();

    // Now connect to the database
    const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    // Initialize models and add them to the exported db object
    db.Account = require('../accounts/account.model')(sequelize);
    db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);
    db.Department = require('../departments/department.model')(sequelize);
    db.Employee = require('../employees/employee.model')(sequelize);

    // Define relationships between models
    db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
    db.Account.hasOne(db.Employee, { foreignKey: 'accountId', onDelete: 'CASCADE' });
    db.Employee.belongsTo(db.Account, { foreignKey: 'accountId' });

    db.Department.hasMany(db.Employee, { foreignKey: 'departmentId' });
    db.Employee.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'department' });

    db.RefreshToken.belongsTo(db.Account);

    // Sync all models with the database (alter tables to match model changes)
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully.");
}
