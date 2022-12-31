const mongoose = require('mongoose')
//const validator = require('validator')

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true
})

// const User = mongoose.model('User', {
//     name : {
//         type: String,
//         required: true,
//         trim: true
//     },
//     age:{
//         type: Number,
//         default: 0,
//         validate(value) {
//             if(value < 0){
//                 throw new Error('Age must be a positive number')
//             }
//         }
//     },
//     email:{
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error('Email is invalid')
//             }
//         }
//     },
//     password:{
//         type : String,
//         required: true,
//         trim: true,
//         minlength: 7,
//         validate(value) {
//             if(value.toLowerCase().includes('password')){
//                 throw new Error('Password cannot not contain "password" ')
//             }
//         }
//     }
// })

// const Task = mongoose.model('Task',{
//     description: {
//         type: String,
//         trim: true,
//         required: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const me = new User({
//     name: 'Pruthvi',
//     age: 22,
//     password: '   Password123 '
// })

// const t = new Task({
//     description: 'This is my last task       ',
//     completed: false
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log('Error!',error)
// })

// t.save().then(() => {
//     console.log(t)
// }).catch((error) => {
//     console.log('Error!', error)
// })