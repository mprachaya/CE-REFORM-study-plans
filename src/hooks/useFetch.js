//useFetch.js
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function useFetch(url, header) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    if (header) {
      axios
        .get(url, header)
        .then(response => response.data)
        .then(res => {
          setLoading(false)

          res.data && setData(res.data.data)
        })
        .catch(err => {
          setLoading(false)
          setError('An error occurred. Awkward..')
          console.log(err)
        })
    } else {
      axios
        .get(url)
        .then(res => {
          setLoading(false)

          res.data && setData(res.data.data)
        })
        .catch(err => {
          setLoading(false)
          setError('An error occurred. Awkward.. :', err)
          console.log(error)
        })
    }
  }, [url])

  const reFetch = () => {
    setLoading(true)
    if (header) {
      axios
        .get(url, header)
        .then(response => response.data)
        .then(res => {
          setLoading(false)

          res.data && setData(res.data.data)
        })
        .catch(err => {
          setLoading(false)
          setError('An error occurred. Awkward..')
          console.log(err)
        })
    } else {
      setLoading(true)
      axios
        .get(url)
        .then(res => {
          setLoading(false)

          res.data && setData(res.data.data)
        })
        .catch(err => {
          setLoading(false)
          setError('An error occurred. Awkward.. :', err)
          console.log(error)
        })
    }
  }

  return { data, setData, loading, setLoading, error, reFetch }
}
