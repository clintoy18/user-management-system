const config = require('../config');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

// Synchronously create sequelize instance and models
const { host, port, user, password, database } = config.database;
const sequelize = new Sequelize(database, user, password, { host, dialect: 'mysql' });

// Define models
const Account = require('../accounts/account.model')(sequelize);
const RefreshToken = require('../accounts/refresh-token.model')(sequelize);
const Department = require('../departments/department.model')(sequelize);
const Employee = require('../employees/employee.model')(sequelize);
const Workflow = require('../workflows/workflows.model')(sequelize);
const Request = require('../requests/request.model')(sequelize);
const RequestItem = require('../requests/request-item.model')(sequelize);

// Define relationships
Account.hasMany(RefreshToken, { onDelete: 'CASCADE' });
Account.hasOne(Employee, { foreignKey: 'accountId', onDelete: 'CASCADE' });
Employee.belongsTo(Account, { foreignKey: 'accountId' });

Department.hasMany(Employee, { foreignKey: 'departmentId' });
Employee.belongsTo(Department, { foreignKey: 'departmentId', as: 'department' });

Workflow.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' });
Employee.hasMany(Workflow, { foreignKey: 'employeeId', as: 'workflows' });

Request.belongsTo(Employee, { foreignKey: 'employeeId', as: 'Employee' });
Employee.hasMany(Request, { foreignKey: 'employeeId', as: 'Requests' });

Request.hasMany(RequestItem, { foreignKey: 'requestId', as: 'RequestItems', onDelete: 'CASCADE' });
RequestItem.belongsTo(Request, { foreignKey: 'requestId', as: 'Request' });

RefreshToken.belongsTo(Account);

// Export everything synchronously
module.exports = {
  sequelize,
  Sequelize,
  Account,
  RefreshToken,
  Department,
  Employee,
  Workflow,
  Request,
  RequestItem,
};

// Async DB creation and sync (optional, for dev)
(async () => {
  try {
    // Create DB if not exists
    const connection = await mysql.createConnection({ host, port, user, password });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.end();

    // Sync models
    await sequelize.sync({ alter: true });
    console.log('Database synced successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
