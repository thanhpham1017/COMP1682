const monggose = require('mongoose');
const {Schema, model} = monggose;
const UserSvhema = new Schema({
    username: {type: 'string', required: true, min:4, unique: true},
    password: {type: 'string', required: true}
});
const UserModel = model('User', UserSvhema)
module.exports = UserModel;
