import './error.css'

const Error = ({ errorMessage }) => {
  return (
    <div className="error-fade">
      <div className="error">
        <div className="error-message">{errorMessage}</div>
        <button
          className="error-button"
          onClick={() => {
            window.location.reload()
          }}
        >
          Перезагрузить
        </button>
      </div>
    </div>
  )
}

export default Error
