import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Form from './components/Form'
import People from './components/People'
import peopleService from './services/people'

const App = () => {
  const [persons, setPersons] = useState([])
  const [listShown, setListShown] = useState(persons)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  useEffect(() => {
    peopleService
      .getAll()
      .then(initialPeople => {
        setPersons(initialPeople)
        setListShown(initialPeople)
      })
  }, [])

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

    peopleService
      .create(personObject)
      .then(returnedPerson => {
        const newPersons = persons.concat(returnedPerson)
        setPersons(newPersons)
        const filteredPersons = newPersons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
        setListShown(filteredPersons)
        setNewName('')
        setNewNumber('')
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    let filterName = event.target.value
    setNewFilter(filterName)
    let filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
    setListShown(filteredPersons)
  }

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