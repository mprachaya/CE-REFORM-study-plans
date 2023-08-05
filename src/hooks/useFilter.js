function useFilter(value, columnName, setState, dataList) {
  var searchState = []
  const id = String(value)

  if (id !== '0') {
    const search = Object.values(dataList)?.filter(data => String(data[columnName]) === String(id))
    if (search.length === 0) {
      setState([])
    } else {
      searchState = search
      setState(searchState)
      console.log(searchState)
    }
  } else {
    setState(dataList)
  }
}

export default useFilter
