import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Form from './components/Form'
import People from './components/People'
import Notification from './components/Notification'
import peopleService from './services/people'

const App = () => {
  const [persons, setPersons] = useState([])
  const [listShown, setListShown] = useState(persons)
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState({})

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
    if (persons.some(person => person.name === newName && person.number === newNumber)) {
      alert(`${newName} is already added to the phonebook`)
      return
    } else if (persons.some(person => person.name === newName)) {
        if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
          const person = persons.find(person => person.name === newName)
          const changedPerson = { ...person, number: newNumber }
          peopleService
            .update(person.id, changedPerson)
            .then(returnedPerson => {
              const newPersons = persons.map(person => person.id !== returnedPerson.id ? person : returnedPerson)
              setPersons(newPersons)
              const filteredPersons = newPersons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
              setListShown(filteredPersons)
              setNewName('')
              setNewNumber('')
              setMessage({
                content: `Number for ${newName} changed`,
                type: 'success'
              })
              setTimeout(() => {
                setMessage({})
              }, 5000)
      
            })
            .catch(error => {
              setMessage({
                content: `Error changing number for ${newName}: ${error.response.data.error}`,
                type: 'error'
              })
              setTimeout(() => {
                setMessage({})
              }, 5000)
              const newPersons = persons.filter(existingPerson => existingPerson.id !== person.id)
              setPersons(newPersons)
              const filteredPersons = newPersons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
              setListShown(filteredPersons)
            })
          return
        } else {
          return
        }
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
        setMessage({
          content: `Added ${newName}`,
          type: 'success'
        })
        setTimeout(() => {
          setMessage({})
        }, 5000)
      })
      .catch(error => {
        setMessage({
          content: `Error adding ${newName}: ${error.response.data.error}`,
          type: 'error'
        })
        setTimeout(() => {
          setMessage({})
        }, 5000)
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handlePersonDelete = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      peopleService
        .deletePerson(id)
        .then(() => {
          const newPersons = persons.filter(person => person.id !== id)
          setPersons(newPersons)
          const filteredPersons = newPersons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
          setListShown(filteredPersons)
        })
        .catch(error => {
          setMessage({
            content: `Information of ${person.name} has already been removed from the server`,
            type: 'error'
          })
          setTimeout(() => {
            setMessage({})
          }, 5000)
          const newPersons = persons.filter(person => person.id !== id)
          setPersons(newPersons)
          const filteredPersons = newPersons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
          setListShown(filteredPersons)
        })
    }
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

      <Notification 
        message={message.content} 
        messageType={message.type} 
      />

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
      <People 
        listShown={listShown} 
        handlePersonDelete={handlePersonDelete}
      />
    </div>
  )
}

export default App