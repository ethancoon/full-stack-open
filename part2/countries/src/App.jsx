import { useState, useEffect } from "react";
import axios from "axios";
import Display from "./components/Display";

const App = () => {
  const [countryFilter, setCountryFilter] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [countryListFiltered, setCountryListFiltered] = useState([]);

  useEffect(() => {
		axios.get("https://restcountries.com/v3.1/all").then(response => {
			setCountryList(response.data);
      setCountryListFiltered(response.data);
		});
	}, []);

  const handleFilterChange = (event) => {
    let filter = event.target.value
    setCountryFilter(filter)
    let filteredCountries = countryList.filter(country => country.name.official.toLowerCase().includes(filter.toLowerCase()))
    setCountryListFiltered(filteredCountries)
  }

  return (
    <div>
      <form>
        find countries <input onChange={handleFilterChange} />
      </form>
      <Display countries={countryListFiltered} />
    </div>
  )
}

export default App