const mongoose = require('mongoose');

const convertEmail = (email) => (email.toLowerCase());

const Users = mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String, unique: true, required: true, set: convertEmail,
  },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], required: true },
  status: { type: Boolean, default: true },
  picture: { type: String, default: '' },
  external_id: { type: String, default: '' },
}, {
  timestamps: true,
});

Users.index({ email: 1, role: 1 }, { unique: true });

const ignoredFields = {
  password: 0,
  __v: 0,
};

module.exports = { UsersModel: mongoose.model('users', Users), ignoredFields };
