const Notification = ({ message, messageType }) => {
    if (message === null) {
      return null
    }

    if (messageType === 'error') {
      return (
        <div className='error'>
          {message}
        </div>
      )
    } else if (messageType === 'info') {
      return (
        <div className='info'>
          {message}
        </div>
      )
    }

    return null
}

export default Notification