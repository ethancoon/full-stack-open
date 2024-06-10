const People = ({ listShown }) => {
    return (
        <div>
            {listShown.map(person => <Person key={person.name} name={person.name} number={person.number} />)}
        </div>
    )
    }

const Person = ({ name, number }) => {
    return (
        <p>{name} {number}</p>
    )
}

export default People