const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const authRouter = require('./routes/auth')
const contactsRouter = require('./routes/contacts')

const app = express()
app.use(express.json())
app.use('/auth', authRouter)
app.use('/contacts', contactsRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Zack here' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

//error handler
app.use((err, req, res, next) =>{
  console.error(err.message)
  res.status(500).json({error: err.message})
})