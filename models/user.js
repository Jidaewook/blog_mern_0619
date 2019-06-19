const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema: 데이터를 담는 그릇. 
//스키마는 각 항목들을 가리킨다고 볼 수 있고, users라는 컬렉션 안에 스키마라는 각 그릇들이 담기는 상황.

const userSchema = new Schema({
    name: {
        type: String, 
        required: true
    }, 
    email: {
        type: String,
        required: true

    },
    password: {
        type: String,
        required: true
    }, 
    avatar: {
        type: String,
        required: true
    }, 
    date: {
        type: String,
        default: Date.now
    }
});

module.exports = User = mongoose.model('users', userSchema);