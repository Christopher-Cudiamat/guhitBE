const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  //tell if its local google or fb login method
  method: {
    type: String,
    enum: ['local','google','facebook'],
    required: true
  },
  local: {
    email: {
      type: String,
      lowercase:true,
    },
    password: {
      type: String,
    },
    avatar: {
      type: String,
    }
  },
  google: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercaSe: true,
    }
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercaSe: true,
    }
  },

});


UserSchema.pre('save', async function(next){
  try {

    if(this.method !== 'local') {
      next();
    }

    //Generate a salt password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(this.local.password, salt);
    this.local.password = passwordHash;
    next();
  } catch (error) {
    next(error);
  }
})

UserSchema.methods.isValidPassword = async function(newPassword){
  try {
    //return a boolean
    return await bcrypt.compare(newPassword, this.local.password);
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = User = mongoose.model('user', UserSchema);