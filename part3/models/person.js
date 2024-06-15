const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
    })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3
    },
    number: {
        type: String,
        minlength: 8,
        validate: {
            validator: function(v) {
              if (v.length < 8) return false;

              const parts = v.split('-');
              if (parts.length !== 2) return false;
      
              if (parts[0].length < 2 || parts[0].length > 3) return false;
      
              if (!parts.every(part => part.split('').every(char => '0123456789'.includes(char)))) return false;
      
              return true;
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})
  
module.exports = mongoose.model('Person', personSchema)