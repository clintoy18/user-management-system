const config = require('../config');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    try {
        // Create the database if it doesn't already exist
        const { host, port, user, password, database } = config.database;
        console.log('Attempting to connect to database...', { host, port, database, user });
        
        const connection = await mysql.createConnection({ host, port, user, password});
        console.log('Initial connection successful');
        
        // Create the database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        console.log('Database creation/verification successful');

        // Close the connection after database creation
        await connection.end();
        // Now connect to the database with additional configuration
        const sequelize = new Sequelize(database, user, password, { 
            host,
            dialect: 'mysql'
        });

        // Test the connection
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Initialize models and add them to the exported db object
        db.Account = require('../accounts/account.model')(sequelize);
        db.RefreshToken = require('../accounts/refresh-token.model')(sequelize);
        db.Department = require('../departments/department.model')(sequelize);
        db.Employee = require('../employees/employee.model')(sequelize);
        db.Workflow = require('../workflows/workflows.model')(sequelize);
        db.Request = require('../requests/request.model')(sequelize);
        db.RequestItem = require('../requests/request-item.model')(sequelize);

        // Define relationships between models
        db.Account.hasMany(db.RefreshToken, { onDelete: 'CASCADE' });
        db.Account.hasOne(db.Employee, { foreignKey: 'accountId', onDelete: 'CASCADE' });
        db.Employee.belongsTo(db.Account, { foreignKey: 'accountId' });

        //employee to department
        db.Department.hasMany(db.Employee, { foreignKey: 'departmentId'});
        db.Employee.belongsTo(db.Department, { foreignKey: 'departmentId', as: 'department' });

        //Employee to workflow
        db.Workflow.belongsTo(db.Employee, { foreignKey: 'employeeId', as: 'employee' });
        db.Employee.hasMany(db.Workflow, { foreignKey: 'employeeId', as: 'workflows' });

        // Request associations
        db.Request.belongsTo(db.Employee, { foreignKey: 'employeeId', as: 'Employee' });
        db.Employee.hasMany(db.Request, { foreignKey: 'employeeId', as: 'Requests' });
        
        // RequestItem associations
        db.Request.hasMany(db.RequestItem, {  foreignKey: 'requestId',  as: 'RequestItems',onDelete: 'CASCADE' });
        db.RequestItem.belongsTo(db.Request, { foreignKey: 'requestId', as: 'Request' });

        db.RefreshToken.belongsTo(db.Account);

        // Sync all models with the database (alter tables to match model changes)
        await sequelize.sync({ force: true });
        console.log("Database synced successfully.");
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        // Don't throw the error, just log it and let the application continue
        // This allows the application to start even if the database is temporarily unavailable
    }
}
