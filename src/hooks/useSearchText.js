function useSearchText(value, setState, setSearch, dataList, searchColumns) {
  var searchState = []
  const keyword = value

  if (keyword !== '') {
    searchColumns.forEach(function (value, i) {
      const search = Object.values(dataList)?.filter(data =>
        String(data[value]).toLowerCase().includes(String(keyword).toLowerCase())
      )
      if (search.length === 0) {
        return false
      } else {
        searchState = search
      }
    })
    setState(searchState)
  } else {
    setState(dataList)
  }
  setSearch(keyword)
}

export default useSearchText
