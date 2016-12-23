const mongoose  = require('mongoose');
const BaseModel = require("./base_model");
const Schema    = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String},
  pass: { type: String },
  email: { type: String},
  picture: { type: String},
  github:{
      id:{type: String},
      name:{type: String},
      picture:{type: String},
      url: { type: String},
      bio:{type:String}
  }
});

UserSchema.plugin(BaseModel);

UserSchema.index({name: 1}, {unique: true});
UserSchema.index({email: 1}, {unique: true});

mongoose.model('User', UserSchema);
