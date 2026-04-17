const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const supabase = require('../config/supabase')
const jwt = require('jsonwebtoken')

// POST register a new user
router.post('/register', async (req , res , next) =>{
    try {
        const name = req.body.name?.trim()
        const email = req.body.email?.trim()
        const password = req.body.password?.trim()

        // validation
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are required'})
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        //save to database
        const {data, error} = await supabase
            .from('users')
            .insert({name, email, password: hashedPassword})
            .select('id, name, email, created_at')
            .single()

        // check any error from supabase
        if (error) {
            if (error.code === '23505') {  // PostgreSQL unique violation code
                return res.status(409).json({ error: 'Email already registered' })
            }
            return next(error)
        }

        res.status(201).json(data)

    } catch (err) {
        return next(err)
    }
})

// POST login
router.post('/login', async (req, res, next)=> {
    try {
        const email = req.body.email?.trim()
        const password = req.body.password?.trim()

        // validation
        if (!email || !password) return res.status(400).json({error:'Email and password are required'})

        // gate 1 - does this email exist?
        const {data: user, error} = await supabase
            .from('users')
            .select('id, name, email, password')
            .eq('email', email)
            .single()

        if (error || !user) return res.status(401).json({error:'Invalid credentials'})
        
        //gate 2 - does the password match?
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) return res.status(401).json({error:'Invalid credentials'})

        // generate JWT
        const token = jwt.sign(
            {id: user.id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        )

        res.status(200).json({token})

    } catch (err) {
       return next (err)
    }
})

module.exports =router