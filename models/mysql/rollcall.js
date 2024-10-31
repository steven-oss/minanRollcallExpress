const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rollcall', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    gender: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isAdult: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    memberId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    check: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    notes: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'rollcall',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
