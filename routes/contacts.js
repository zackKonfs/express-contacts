const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')

// GET all contacts
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json(data)
})

// GET one contact by ID
router.get('/:id', async (req, res)=> {
  const { id } = req.params

  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return res.status(404).json({ error: 'Contact not found'})
  }

  res.json(data)
})

// POST create a contact
router.post('/', async (req, res) => {
  const { name, phone, email, project_type } = req.body

  if (!name) {
    return res.status(400).json({ error: 'Name is required'})
  }

  const { data, error } = await supabase
    .from('contacts')
    .insert({ name, phone, email, project_type })
    .select()
    .single()

  if (error) {
    return res.status(500).json({ error: error.message})
  }

  res.status(201).json(data)
})

module.exports = router
