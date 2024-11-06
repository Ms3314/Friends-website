import Form from "./components/Form"
import Match from "./components/Match"
const check = localStorage.getItem("form")
function App() {
  return (
    <div>
      {check ? 
      <Match form={JSON.parse(check)} />
      : 
      <Form />
      }
    </div>
  )
}

export default App
