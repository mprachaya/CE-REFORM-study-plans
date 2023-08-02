//useFetch.js
import axios from 'axios'

export default function useDelete(url, closemodal, refetch) {
  if (url) {
    axios
      .delete(url)
      .then(response => response.data)
      .then(res => {
        console.log(res.data)
      })
      .catch(err => {
        console.log('An error occurred. Awkward.. : ', err)
        alert('Status: ' + err.response.data.status + ' ' + err.response.data.message)
      })
      .finally(() => {
        closemodal()
        refetch()
      })
  } else {
    return false
  }
}
