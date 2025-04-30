const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
  const attributes = {
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    position: { type: DataTypes.STRING, allowNull: false },
    department: { type: DataTypes.STRING, allowNull: false },
    hireDate: { type: DataTypes.DATE, allowNull: false },
    salary: { type: DataTypes.FLOAT, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  };
  const options = {
    timestamps: false
};

return sequelize.define('employee', attributes, options);

}