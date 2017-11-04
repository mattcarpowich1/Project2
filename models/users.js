module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
        // custom validation to ensure that value is a string
        isValidString: function(value) {
          if (!(typeof value === "string")) {
            throw new Error("username field must be a string!");
          } else {
            return true;
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8],
        // custom validation to ensure that value is a string
        isValidString: function(value) {
          if (!(typeof value === "string")) {
            throw new Error("password field must be a string!");
          } else {
            return true;
          }
        }
      }
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4],
        // custom validation to ensure that value is a string
        isValidString: function(value) {
          if (!(typeof value === "string")) {
            throw new Error("displayName field must be a string!");
          } else {
            return true;
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1],
        // custom validation to ensure that value is a string
        isValidString: function(value) {
          if (!(typeof value === "string")) {
            throw new Error("email field must be a string!");
          } else {
            return true;
          }
        }
      }
    }
  });

  Users.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    Users.hasMany(models.Riffs, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Users;
};

// in Authors model
// Author.hasMany(Riff);
