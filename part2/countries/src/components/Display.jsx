import Country from './Country'
import CountryConcise from './CountryConcise'

const Display = ({ countries }) => {    
    if (countries.length >= 10) {
        return (
        <div>
            Too many matches, specify another filter
        </div>
        )
    } else if (countries.length === 1) {
        return (
        <Country country={countries[0]} />
        )
    } else {
        return (
        <div>
            {countries.map(country => (
            <CountryConcise key={country.name.official} country={country}/>
            ))}
        </div>
        )
    }
}

export default Display