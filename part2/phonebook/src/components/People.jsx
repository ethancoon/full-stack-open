const People = ({ listShown, handlePersonDelete }) => {
    return (
        <div>
            {listShown.map(person => <Person key={person.id} id={person.id} name={person.name} number={person.number} handlePersonDelete={handlePersonDelete}/>
                )}
        </div>
    )
    }

const Person = ({ id, name, number, handlePersonDelete }) => {
    return (
        <div>
            {name} {number}
            <button onClick={() => handlePersonDelete(id)}>delete</button>
        </div>

    )
}

export default People