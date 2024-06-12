import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Form from './components/Form'
import People from './components/People'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [listShown, setListShown] = useState(persons)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to the phonebook`)
      return
    }
    const newPersons = persons.concat(personObject)
    setPersons(newPersons)
    const filteredPersons = newPersons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
    setListShown(filteredPersons)
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    let filterName = event.target.value
    console.log(filterName)
    setNewFilter(filterName)
    let filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
    setListShown(filteredPersons)
  }

  useEffect(() => {
    const eventHandler = response => {
      console.log('promise fulfilled')
      setPersons(response.data)
    }

    const promise = axios.get('http://localhost:3001/persons')
    promise.then(eventHandler)
  })

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter 
      newFilter={newFilter} 
      handleFilterChange={handleFilterChange} 
      />
      
      <h3>add a new</h3>

      <Form 
      addPerson={addPerson} 
      newName={newName}
      handleNameChange={handleNameChange}
      newNumber={newNumber}
      handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <People listShown={listShown} />
    </div>
  )
}

export default App