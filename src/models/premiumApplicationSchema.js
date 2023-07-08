import { mongoose } from "mongoose"

const premiumApplicationSchema = new mongoose.Schema({
  
  firstName: {
    type: String,
    required: [true, "Please enter first name"],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z-. ]+$/.test(v);
      },
      message: (props) =>
        `should only contain letters, spaces, or dashes (-). No special characters or numbers.`,
    },
  },
  lastName: {
    type: String,
    required: [true, "Please enter last name"],
    validate: {
      validator: function (v) {
        return /^[a-zA-Z-. ]+$/.test(v);
      },
      message: (props) =>
        `should only contain letters, spaces, or dashes (-). No special characters or numbers.`,
    },
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
  },
  
  resume: String,
  additionalComments: {
    type: String,
    required: false,
    maxlength: [1000, "Cannot be longer than 1000 characters."],
  },
  program: {
    type: String,
    required: true,
  },
  school: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const PremiumApplication = mongoose.model(
  "PremiumApplication",
  premiumApplicationSchema
);

export default PremiumApplication;
