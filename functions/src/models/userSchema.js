import { mongoose } from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z- ]+$/.test(v);
      },
      message: (props) =>
        `should only contain letters. No special characters or numbers.`,
    },
    minlength: 1,
    maxlength: [20, "Cannot be longer than 20 characters."],
  },
  lastName: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z- ]+$/.test(v);
      },
      message: (props) =>
        `should only contain letters. No special characters or numbers.`,
    },
    minlength: 1,
    maxlength: [20, "Cannot be longer than 20 characters."],
  },
  email: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: [30, "Cannot be longer than 30 characters."],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },

  bio: {
    type: String,
    minlength: 1,
    maxlength: [200, "Cannot be longer than 200 characters."],
  },
  location: {
    type: String,
  },

  category: {
    type: String,
  },

  skills: {
    type: [String],
  },
  avatarUrl: {
    type: String,
  },
});

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
