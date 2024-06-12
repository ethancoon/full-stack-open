import { useState } from 'react'
import Country from './Country' 

const CountryConcise = ({ country }) => {
    const [show, setShow] = useState(false)

    if (!show) {
        return (
            <div>
                {country.name.official}
                <button onClick={() => setShow(true)}>show</button>
            </div>
        )
    }
    
    return (
        <Country country={country} />
    )
}

export default CountryConcise