const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
  const attributes = {
    type: {
      type: DataTypes.ENUM('onboarding', 'transfer', 'termination', 'leave', 'other'),
      allowNull: false
    },
    employeeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'employees',
        key: 'id'
      }
    },
    status: {
      type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
      allowNull: false,
      defaultValue: 'Pending'
    }
  };

  const options = {
    timestamps: true 
  };

  return sequelize.define('workflow', attributes, options);
}
