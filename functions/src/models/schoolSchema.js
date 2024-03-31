import { mongoose } from "mongoose";

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  number: {
    type: String,
  },
  email: {
    type: String,
  },
  contactUrl: {
    type: String,
  },
});

const LocationSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
});

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
  },
  logoUrl: {
    type: String,
    minlength: 1,
  },
  website: {
    type: String,
    required: true,
    minlength: 1,
  },
  industry: {
    type: String,
    required: true,
    minlength: 1,
  },
  applyUrl: {
    type: String,
    minlength: 1,
  },
  type: {
    type: String,
    minlength: 1,
  },
  description: {
    type: String,
    minlength: 1,
  },
  email: {
    type: String,
    required: true,
    minlength: 1,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
  
  location: LocationSchema,
  pointOfContact: ContactSchema,
  program: {
    type: String,
  },
  premiumMembership: Boolean,
});

const MemberModel = mongoose.model("Member", MemberSchema);

export default MemberModel;
