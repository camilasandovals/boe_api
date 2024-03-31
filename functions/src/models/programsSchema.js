import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ProgramSchema = new Schema({
  description: {
    type: String,
    required: true
  },
  school: {
    type: Schema.Types.ObjectId,
    ref: 'Member', // This assumes your school is a 'Member' document
    required: true
  },
  name: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  cost: {
    type: String,
  },
  financing: {
    type: String,
  },
  location: {
    type: String,
    required: true
  }
});

const ProgramModel = model('Program', ProgramSchema);

export default ProgramModel;
