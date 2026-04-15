const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const supabase = require('../config/supabase')

// POST register a new user
router.post('/register', async (req , res , next) =>{
    try {
        const {name, email, password} = req.body

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

module.exports =router