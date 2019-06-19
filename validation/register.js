const Validatior = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data){
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    if(!Validatior.isLength(data.name, {min: 2, max: 30})){
        errors.name = 'Name must be between 2 and 30 characters';
    }

    if(Validatior.isEmpty(data.name)){
        errors.name = 'Name field is required';
    }

    if(Validatior.isEmpty(data.email)){
        errors.email = 'Email field is required';
    }

    if(!Validatior.isEmail(data.email)){
        errors.email = 'Email is invalid';
    }

    if(Validatior.isEmpty(data.password)){
        errors.password = 'Password field is required';
    }

    if(!Validatior.isLength(data.password, {min: 6, max: 30})){
        errors.password = 'Password must be at least 6 characters';
    }

    if(Validatior.isEmpty(data.password2)){
        errors.password2 = 'Confirm Password field is required';
    }

    if(!Validatior.equals(data.password, data.password2)){
        errors.password2 = 'Passwords do not match';
    }

    return {
        errors, 
        isValid: isEmpty(errors)
    };
};