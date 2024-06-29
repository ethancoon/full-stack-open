import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const Filter = () => {
    const dispatch = useDispatch()

    const handleFilterChange = (event) => {
        const newFilter = event.target.value
        dispatch(filterChange(newFilter))
    }
    const style = {
      marginBottom: 10
    }
  
    return (
      <div style={style}>
        filter <input onChange={handleFilterChange} />
      </div>
    )
}
  
export default Filter