module.exports = function(sequelize, DataTypes) {
  var Riffs = sequelize.define(
    "Riffs",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1],
          // custom validation to ensure that value is a string
          isValidString: function(value) {
            if (!(typeof value === "string")) {
              throw new Error("title field must be a string!");
            } else {
              return true;
            }
          }
        }
      },
      sequence: {
        type: DataTypes.STRING(1234),
        allowNull: false,
        validate: {
          len: [1],
          isValidString: function(value) {
            if (!(typeof value === "string")) {
              throw new Error("sequence field must be a string!");
            } else {
              return true;
            }
          },
          // custom validation to ensure that the value is a
          // string representation of an array
          isStringifiedArray: function(value) {
            try {
              if (JSON.parse(value) instanceof Array) {
                return true;
              }
            } catch (error) {
              throw new Error("sequence field must be a stringified array!");
            }
          }
        }
      },
      tempo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          len: [2, 3],
          // minimum of 10 bpm and maximum of 300bpm
          min: 10,
          max: 300,
          // custom validation that ensures value is numeric
          // (string representations of numbers can be inputted
          // otherwise, which could cause bugs)
          isNotString: function(value) {
            if (typeof value === "string") {
              throw new Error("tempo field cannot be a string");
            } else {
              return true;
            }
          }
        },
        defaultValue: 120
      },
      beat_division: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          len: [1, 2],
          // limit options to only quarter, 8th, or 16th note
          isIn: [[4, 8, 16]],
          isNotString: function(value) {
            if (typeof value === "string") {
              throw new Error("beat_division field cannot be a string");
            } else {
              return true;
            }
          }
        },
        defaultValue: 8
      },
      display: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      freezeTableName: true
    }
  );

  Riffs.associate = function(models) {
    // Associating Author with Posts
    // When an Author is deleted, also delete any associated Posts
    Riffs.belongsTo(models.Users, {
      onDelete: "CASCADE"
    });

    Riffs.hasMany(models.Favorites, {
      onDelete: "CASCADE"
    });
  };
  // RELATIONSHIPS GO here
  //Riffs.belongsTo(Users);

  return Riffs;
};

// in Authors model
// Author.hasMany(Riff);
