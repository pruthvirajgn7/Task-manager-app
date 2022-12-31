const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const {sendWelcomeEmail,sendCancellationEmail} = require('../emails/account')
const sharp = require('sharp')

const upload = multer({
    limits : {
        fieldSize : 1000000,
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload a image file'))
        }

        cb(undefined , true)
    }
})

router.post('/users/me/avatar',auth , upload.single('avatar'),async (req,res)=> {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
},(error,req,res,next) => {
    console.log(error)
    res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar',auth,async (req,res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req,res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    }catch (e) {
        res.status(404).send()
    }
})

router.post('/users' ,async (req,res) => {
    const user = new User(req.body)
    
     try{
        await user.save()
        sendWelcomeEmail(user.email,user.name)
         const token = await user.generateAuthToken()
         res.send({user,token})
     }catch(e) {
         res.status(400).send()
     }
     
 })


router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/logout',auth,async (req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    }catch (e) {
        //console.log(e)
        res.status(500).send()
    }
})

router.post('/users/logoutAll',auth,async (req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()

        res.send()
    }catch (e) {
        //console.log(e)
        res.status(500).send()
    }
})





 router.get('/users/me',auth ,async (req,res) => {
    res.send(req.user)
})



router.patch('/users/me',auth, async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValid = updates.every((update) => allowedUpdates.includes(update)) 

    if(!isValid){
        return res.status(400).send( {error : 'Invalid updates' })
    }

    try{
        //to make middleware work
        const user = req.user
        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me',auth, async (req,res) => {
    try{
        await req.user.remove()
        sendCancellationEmail(req.user.email,req.user.name)
        res.send(req.user)
    }catch(e){
        res.status(400).send()
    }
})

module.exports = router