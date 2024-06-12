import Weather from './Weather'

const Country = ({ country }) => {
    return (
        <div>
            <h1>{country.name.official}</h1>
            <div>capital {country.capital}</div>
            <div>population {country.population}</div>
            <h2>languages</h2>
            <ul>
                {Object.values(country.languages).map(language => (
                    <li key={language}>{language}</li>
                ))}
            </ul>
            <img src={country.flags.png} alt={`${country.name.official} flag`}/>

            <Weather country={country} />
        </div>
    )
}

export default Country