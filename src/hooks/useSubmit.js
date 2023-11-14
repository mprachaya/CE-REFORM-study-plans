//useFetch.js
import axios from 'axios'

export default function useSubmit(url, state, closemodal, refetch, isDone) {
  if (state) {
    isDone && isDone(false)
    axios
      .post(url, state)
      .then(res => {
        console.log(res.data)
        if (res.data.status === 201) {
          closemodal()
          refetch()
          isDone && isDone(null)
        }
      })

      .catch(err => {
        console.log('An error occurred. Awkward.. : ', err)
        alert('Status: ' + err.response.data.status + ' ' + err.response.data.message)
      })
  } else {
    return false
  }
}
