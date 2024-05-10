const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const AdminSchema = new Schema({
   name: {type: String, required: false},
   dob: {type: Date, required: false},
   gender: {type: String, required: false},
   address: {type: String, required: false},
   image: {type: String, required: false},
   account:{type:Schema.Types.ObjectId, ref:'Account'},
});

const AdminModel = model('Admin', AdminSchema);

module.exports = AdminModel;