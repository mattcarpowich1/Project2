module.exports = function(sequelize, DataTypes) {
  var Riff = sequelize.define("Riff", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    sequence: {
      type: DataTypes.STRING,
      allowNull: false,
      // Maybe 32? To account for octaves (C1D2E0, etc)
      // Maybe 48? To account for Sharp/Flat/Natural (C1#D2bE0n, etc)
      // Maybe another format entirely to account for repetative notes?
      // C1#x3 = C1# x3 consecutive notes? "C1#x3,D2bx1,E0nx4"
      len: [16],
      defaultValue: "CCCCCCCCCCCCCCCC"
    },
    tempo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [2, 3]
      },
      defaultValue: 120
    },
    beat_division: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1, 2]
      },
      defaultValue: 8
    },
    num_steps: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1, 2]
      },
      defaultValue: 16
    },
    theme: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      },
      defaultValue: "default"
    },
    sound: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      },
      defaultValue: "Synth"
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      },
      defaultValue: "C"
    },
    num_voices: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      },
      defaultValue: 1
    },
    num_favorites: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      },
      defaultValue: 0
    },
    play_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        len: [1]
      },
      defaultValue: 0
    }
  });

  // RELATIONSHIPS GO here
  // Riff.belongsTo(Author);

  return Riff;
};

// in Authors model
// Author.hasMany(Riff);
