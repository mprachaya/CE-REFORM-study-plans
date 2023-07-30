//useFetch.js
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useSubmit(url, state, closemodal, refetch) {
  if (state) {
    axios
      .post(url, state)
      .then(response => response.data)
      .then(res => {
        console.log(res.data)
      })
      .finally(() => {
        closemodal()
        refetch()
      })
      .catch(err => {
        console.log('An error occurred. Awkward.. : ', err)
      })
  } else {
    return false
  }
}
