module.exports = function(sequelize, DataTypes) {
  var Favorites = sequelize.define(
    "Favorites",
    {},
    {
      freezeTableName: true
    }
  );

  Favorites.associate = function(models) {
    Favorites.belongsTo(models.Riffs, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
    Favorites.belongsTo(models.Users, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Favorites;
};
