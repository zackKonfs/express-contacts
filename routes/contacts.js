const express = require('express')
const router = express.Router()
const supabase = require('../config/supabase')
const authenticateToken = require('../middleware/auth')

router.use(authenticateToken)

// GET all contacts
router.get('/', async (req, res, next) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')

    if (error) { return next(error) }

    res.json(data)
  } catch (err) {
    next (err)
  }

})

// GET one contact by ID
router.get('/:id', async (req, res, next)=> {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) { return next(error) }

    res.json(data)
  } catch (err) {
    next (err)
  }
})

// POST create a contact
router.post('/', async (req, res, next) => {
  try {
    const { name, phone, email, project_type } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Name is required'})
    }

    const { data, error } = await supabase
      .from('contacts')
      .insert({ name, phone, email, project_type })
      .select()
      .single()

    if (error) { return next(error) }

    res.status(201).json(data)
  } catch (err) {
    next (err)
  }
})

// PUT update a contact
router.put('/:id', async (req, res, next) =>{
  try {
    const { id } = req.params
    const { name, phone, email, project_type } = req.body

    if (!name) {
      return res.status(400).json({ error: 'Name is required' })
    }

    const { data, error } = await supabase
      .from('contacts')
      .update({ name, phone, email, project_type })
      .eq('id', id)
      .select()
      .single()

    if (error) { return next(error) }

    res.json(data)
  } catch (err) {
    next (err)
  }
})

// DELETE a contact
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)

    if (error) { return next(error) }

    res.json({ message: 'Contact deleted' })
  } catch (err) {
    next (err)
  }
})

module.exports = router
