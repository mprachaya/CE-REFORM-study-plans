import React, { useEffect, useState } from 'react'
import {
  Typography,
  Grid,
  Box,
  Autocomplete,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material'
import { mdiPen, mdiTrashCan } from '@mdi/js'
import axios from 'axios'
import Icon from '@mdi/react'
import { url } from 'src/configs/urlConfig'
import { Btn, DataGridTable, Selection } from 'src/components'
import { useFetch } from 'src/hooks'
import { handleChangeNumber } from 'src/hooks/useValidation'

function curriculumstructure() {
  const URL_GET_CURRICULUM = `${url.BASE_URL}/curriculums/`
  const URL_GET_CURRICULUM_STRUCTURES = `${url.BASE_URL}/curriculum-structures-v2/`
  const URL_GET_CATEGORIES = `${url.BASE_URL}/subject-categories/`
  const URL_GET_TYPES = `${url.BASE_URL}/subject-types/`
  const URL_GET_GROUPS = `${url.BASE_URL}/subject-groups/`
  const [curriculumSelected, setCurriculumSelected] = useState(0)

  const [categorySelected, setCategorySelected] = useState(1)
  const [typeSelected, setTypeSelected] = useState(0)
  const [groupSelected, setGroupSelected] = useState(0)
  const [creditTotal, setCreditTotal] = useState(3)

  const [groupedStructure, setGroupedStructrue] = useState([])

  const [open, setOpen] = useState(false)
  const [openPreview, setOpenPreview] = useState(false)

  const [showDefaultCategory, setShowDefaultCategory] = useState([])

  // 0 -> insert , 1 -> edit
  const [formType, setFormType] = useState(0)
  const initialState = {
    curriculum_id: 0,
    subject_category_id: null,
    subject_type_id: null,
    subject_group_id: null,
    csv2_credit_total: 1
  }
  const [state, setState] = useState(initialState)
  const [curriculumStructuresId, setCurriculumStructuresId] = useState(0)

  const {
    error: CurriculumError,
    data: Curriculums,
    setData: setCurriculums,
    loading: CurriculumLoading,
    reFetch: reFetchCurriculums
  } = useFetch(URL_GET_CURRICULUM)
  const {
    error: CategoriesError,
    data: Categories,
    setData: setCategories,
    loading: CategoriesLoading,
    reFetch: reFetchCategories
  } = useFetch(URL_GET_CATEGORIES)
  const {
    error: TypesError,
    data: Types,
    setData: setTypes,
    loading: TypesLoading,
    reFetch: reFetchTypes
  } = useFetch(URL_GET_TYPES)
  const {
    error: GroupsError,
    data: Groups,
    setData: setGroups,
    loading: GroupsLoading,
    reFetch: reFetchGroups
  } = useFetch(URL_GET_GROUPS)

  const {
    error: CurriculumStructuresError,
    data: CurriculumStructures,
    setData: setCurriculumStructures,
    loading: CurriculumStructuresLoading,
    reFetch: reFetchCurriculumStructures
  } = useFetch(URL_GET_CURRICULUM_STRUCTURES + curriculumSelected)

  const handleOpenForm = (type, structureId, sjCategory, sjType, sjGroup, totalCredit) => {
    if (type === 0) {
      // insert
      setState(pre => ({ ...pre, curriculum_id: curriculumSelected }))
      setFormType(0)
      setOpen(true)
      setCreditTotal(1)
      setCategorySelected(null)
      setGroupSelected(null)
      setTypeSelected(null)
    } else {
      // edit
      if (sjCategory) {
        setState({
          curriculum_id: curriculumSelected,
          subject_category_id: sjCategory?.subject_category_id,
          subject_type_id: sjType?.subject_type_id || null,
          subject_group_id: sjGroup?.subject_group_id || null,
          csv2_credit_total: totalCredit
        })
        setFormType(1)
        setOpen(true)
        setCreditTotal(totalCredit)
        setCategorySelected(sjCategory)
        setTypeSelected(sjType)
        setGroupSelected(sjGroup)
      }
      if (structureId) setCurriculumStructuresId(structureId)
    }
  }

  const findCategory = () => {
    console.log('CurriculumStructures', CurriculumStructures);
    const categoryByStructer = Object.values(CurriculumStructures)?.filter(
      categoryDuplicate =>
        categoryDuplicate.subject_category_id !== null &&
        categoryDuplicate.subject_type_id === null &&
        categoryDuplicate.subject_group_id === null
    )
    console.log('findCategory', findCategory);
    if (categoryByStructer?.length > 0) {
      const unDuplicateCagetory = Object.values(UniqueCategories)?.filter(d => d !== categoryByStructer?.find(s => s.subjectCategory?.subject_category_name))
      setShowDefaultCategory(unDuplicateCagetory)
    }



  }

  const handleSubmit = () => {
    if (
      state.csv2_credit_total !== undefined &&
      state.subject_category_id !== 0 &&
      state.subject_category_id !== null
    ) {
      console.log(state)
      axios
        .get(URL_GET_CURRICULUM_STRUCTURES + curriculumSelected)
        .then(res => {
          if (res.data) {
            const duplicate = Object.values(res.data.data)?.find(
              d => d.subjectGroup?.subject_group_id === state.subject_group_id
            )
            if (duplicate) {
              alert('this subject group is already exist in curriculum!')
            } else {
              axios
                .post(URL_GET_CURRICULUM_STRUCTURES, state)
                .then(res => {
                  if (res.data) {
                    setState(initialState)
                    setOpen(false)
                    reFetchCurriculumStructures()
                  }
                })
                .catch(err => console.log('error from insert new curriculum structure: ', err))
            }
          }
        })
        .catch(err => console.log('error from check duplicate:', err))
    } else {
      alert('Please Select Category')
    }
  }

  const handleUpdate = () => {
    if (
      state.csv2_credit_total !== undefined &&
      state.subject_category_id !== 0 &&
      state.subject_category_id !== null
    ) {
      console.log(state)
      axios.get(URL_GET_CURRICULUM_STRUCTURES + curriculumSelected).then(res => {
        if (res.data) {
          const duplicate = Object.values(res.data.data)?.find(
            d => d.subjectGroup?.subject_group_id === state.subject_group_id
          )
          if (duplicate) {
            alert('this subject group is already exist in curriculum!')
          } else {
            axios
              .put(URL_GET_CURRICULUM_STRUCTURES + curriculumStructuresId, state)
              .then(res => {
                if (res.data) {
                  setState(initialState)
                  setOpen(false)
                  reFetchCurriculumStructures()
                }
              })
              .catch(err => console.log('error from update curriculum structure: ', err))
          }
        }
      })
    } else {
      alert('Please Select Category')
    }
  }
  const handleDelete = id => {
    let result = window.confirm('Confirm to Delete?')
    if (result) {
      axios
        .delete(URL_GET_CURRICULUM_STRUCTURES + id)
        .then(res => {
          if (res.data) {
            setState(initialState)
            setOpen(false)
            reFetchCurriculumStructures()
            console.log(res.data)
          }
        })
        .catch(err => console.log('error from delete curriculum structure', err))
    }
  }

  // function groupByKeys(data) {
  //   return data.reduce((result, item) => {
  //     const { subject_category_id, subject_type_id, subject_group_id } = item

  //     result[subject_category_id] ??= {
  //       subject_category_name: item.subjectCategory.subject_category_name,
  //       grouped: {}
  //     }

  //     result[subject_category_id].grouped[subject_type_id] ??= {
  //       subject_type_name: item.subjectType.subject_type_name,
  //       grouped: {}
  //     }

  //     result[subject_category_id].grouped[subject_type_id].grouped[subject_group_id] ??= []
  //     result[subject_category_id].grouped[subject_type_id].grouped[subject_group_id].push(item)

  //     return result
  //   }, {})
  // }
  function groupByKeys(data) {
    return data.reduce((result, item) => {
      const { subject_category_id, subject_type_id, subject_group_id } = item

      result[subject_category_id] ??= {
        id: subject_category_id,
        subject_category_name: item.subjectCategory?.subject_category_name,
        grouped: {}
      }

      result[subject_category_id].grouped[subject_type_id] ??= {
        id: subject_type_id,
        subject_type_name: item.subjectType?.subject_type_name,
        grouped: {}
      }

      result[subject_category_id].grouped[subject_type_id].grouped[subject_group_id] ??= {
        id: subject_group_id,
        items: []
      }

      result[subject_category_id].grouped[subject_type_id].grouped[subject_group_id].items.push(item)

      return result
    }, {})
  }

  function getUniqueValues(arr, propertyPath) {
    const uniqueValuesSet = new Set()

    arr.forEach(obj => {
      // Use propertyPath to access nested properties
      const nestedProperties = propertyPath.split('.')
      let propertyValue = obj

      for (let prop of nestedProperties) {
        if (propertyValue && propertyValue.hasOwnProperty(prop)) {
          propertyValue = propertyValue[prop]
        } else {
          // Handle cases where the nested property doesn't exist
          propertyValue = undefined
          break
        }
      }

      // Add the value to the Set
      uniqueValuesSet.add(propertyValue)
    })

    // Convert the Set back to an array and return it
    const uniqueValuesArray = Array.from(uniqueValuesSet)
    return uniqueValuesArray
  }
  const getUniqueMultiValues = (arr, propertyPath1, propertyPath2, outputName1, outputName2) => {
    const uniqueValuesSet = new Set()

    arr.forEach(obj => {
      const nestedProperties1 = propertyPath1.split('.')
      const nestedProperties2 = propertyPath2.split('.')
      let propertyValue1 = obj
      let propertyValue2 = obj

      for (let prop of nestedProperties1) {
        if (propertyValue1 && propertyValue1.hasOwnProperty(prop)) {
          propertyValue1 = propertyValue1[prop]
        } else {
          propertyValue1 = undefined
          break
        }
      }

      for (let prop of nestedProperties2) {
        if (propertyValue2 && propertyValue2.hasOwnProperty(prop)) {
          propertyValue2 = propertyValue2[prop]
        } else {
          propertyValue2 = undefined
          break
        }
      }

      const uniqueObject = {
        [outputName1]: propertyValue1,
        [outputName2]: propertyValue2
      }

      uniqueValuesSet.add(JSON.stringify(uniqueObject))
    })

    const uniqueValuesArray = Array.from(uniqueValuesSet).map(str => JSON.parse(str))
    return uniqueValuesArray
  }

  const UniqueCategories = getUniqueValues(CurriculumStructures, 'subjectCategory.subject_category_name')
  // const UniqueTypes = getUniqueValues(CurriculumStructures, 'subjectType.subject_type_name')
  const UniqueTypes = getUniqueMultiValues(
    CurriculumStructures,
    'subjectCategory.subject_category_name',
    'subjectType.subject_type_name',
    'subject_category_name',
    'subject_type_name'
  )

  console.log('UniqueCategories', UniqueCategories)
  console.log('UniqueTypeByCategory', UniqueTypes)

  useEffect(() => {
    if (Curriculums.length > 0) {
      const findMaxId = Curriculums?.reduce(
        (max, current) => (current.curriculum_id < max.curriculum_id ? current : max),
        Curriculums[0]
      )
      // console.log(findMaxId)
      setCurriculumSelected(findMaxId.curriculum_id)
    }
  }, [Curriculums])
  useEffect(() => {
    if (state) {
      console.log(state)
    }
  }, [state])

  console.log(CurriculumStructures)

  useEffect(() => {
    if (CurriculumStructures) {
      const groupedData = groupByKeys(CurriculumStructures)
      console.log('groupedData: ', groupedData)
      // console.log(Object(JSON.stringify(groupedData, null, 2)))
      setGroupedStructrue(groupedData)
    } else {
      setGroupedStructrue([])
    }
  }, [CurriculumStructures])

  const columns = [
    {
      field: 'credit_total',
      headerName: 'Credit Total',
      width: 180,
      valueGetter: params => params?.row?.csv2_credit_total,
      align: 'center',
      headerAlign: 'center'
    },
    {
      field: 'subject_category',
      headerName: 'Category',
      width: 220,
      valueGetter: params => params.row?.subjectCategory?.subject_category_name
    },
    {
      field: 'subject_type',
      headerName: 'Type',
      width: 220,
      valueGetter: params => (params.row?.subjectType ? params.row?.subjectType?.subject_type_name : '-')
    },
    {
      field: 'subject_group',
      headerName: 'Group',
      width: 220,
      valueGetter: params => (params.row?.subjectGroup ? params.row?.subjectGroup?.subject_group_name : '-')
    },

    {
      field: 'E/D',
      width: 250,
      align: 'right',
      headerAlign: 'right',
      renderCell: params => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
              <Button
                size='small'
                color='secondary'
                variant='outlined'
                onClick={() =>
                  handleOpenForm(
                    1,
                    params?.row?.curriculum_structures_v2_id,
                    params.row?.subjectCategory,
                    params.row?.subjectType,
                    params.row?.subjectGroup,
                    params.row?.csv2_credit_total
                  )
                }
              >
                <Icon path={mdiPen} size={1} />
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'row-reverse' }}>
              <Button
                size='small'
                color='error'
                variant='outlined'
                onClick={() => handleDelete(params?.row?.curriculum_structures_v2_id)}
              >
                <Icon path={mdiTrashCan} size={1} />
              </Button>
            </Box>
          </Grid>
        </Grid>
      )
    }
  ]

  useEffect(() => {
    if (CurriculumStructures) {
      findCategory()
    }
  }, [CurriculumStructures])

  return (
    <Box sx={{ m: 6 }}>
      <Typography variant='h6'>Curriculums Structure</Typography>
      <Grid container spacing={6} sx={{ mt: 5 }}>
        <Grid item xs={12} md={8}>
          <Selection
            label={'Curriculum'}
            height={40}
            width={'100%'}
            selectionValue={curriculumSelected}
            handleChange={e => setCurriculumSelected(e.target.value)}
            Items={Object.values(Curriculums)
              ?.sort((a, b) => b.curriculum_id - a.curriculum_id)
              .map(curri => (
                <MenuItem key={curri.curriculum_id} value={curri.curriculum_id}>
                  {curri.curriculum_name_th + ' ' + curri.curriculum_year}
                </MenuItem>
              ))}
          />
        </Grid>
        <Grid item xs={12} md={4} lg={2.5}>
          <Btn width={'100%'} handleclick={() => handleOpenForm(0)} label={'+ Add New'} />
        </Grid>
        <Grid item xs={12} md={4} lg={1.5}>
          <Button variant='outlined' sx={{ width: '100%' }} onClick={() => setOpenPreview(true)}>
            Preview
          </Button>
        </Grid>
        <Grid item xs={12}>
          {CurriculumStructures.length > 0 ? (
            <DataGridTable
              rowHeight={80}
              rows={Object.values(CurriculumStructures).sort((a, b) => a.subject_structure_id - b.subject_structure_id)}
              columns={columns}
              uniqueKey={'curriculum_structures_v2_id'}
              isLoading={CurriculumStructuresLoading === null ? true : CurriculumStructuresLoading}
            />
          ) : (
            <Typography sx={{ m: 6 }}> this curriculum has no structure yet</Typography>
          )}
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={() => {
          setState(initialState)
          setOpen(false)
        }}
        fullWidth
        maxWidth={'md'}
      >
        <DialogTitle>Form Curriculum Structures</DialogTitle>
        <DialogContent sx={{ minHeight: 450 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ my: 2 }}>
              <Autocomplete
                value={categorySelected}
                size='small'
                disablePortal
                fullWidth
                freeSolo
                options={Categories || []}
                getOptionLabel={option => option?.subject_category_name || ''}
                renderInput={params => <TextField {...params} label='Subject Category' />}
                onChange={(e, value) => {
                  if (value !== null) {
                    setCategorySelected(value)
                    setState(pre => ({ ...pre, subject_category_id: value.subject_category_id }))
                  } else {
                    setCategorySelected([])
                    setState(pre => ({ ...pre, subject_category_id: null }))
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ my: 2 }}>
              <Autocomplete
                value={typeSelected}
                size='small'
                disablePortal
                fullWidth
                freeSolo
                // options={Jobs?.filter(sj => sj.subject_id !== subject.subject_id)}
                options={Types || []}
                getOptionLabel={option => option?.subject_type_name || ''}
                renderInput={params => <TextField {...params} label='Subject Type' />}
                onChange={(e, value) => {
                  if (value !== null) {
                    setTypeSelected(value)
                    setState(pre => ({ ...pre, subject_type_id: value.subject_type_id }))
                  } else {
                    setTypeSelected([])
                    setState(pre => ({ ...pre, subject_type_id: null }))
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sx={{ my: 2 }}>
              <Autocomplete
                value={groupSelected}
                size='small'
                disablePortal
                fullWidth
                freeSolo
                options={
                  // only uniqe subject group name
                  Groups.filter((obj, index, arr) => {
                    const firstIndex = arr.findIndex(item => item.subject_group_name === obj.subject_group_name)
                    return index === firstIndex
                  }) || []
                }
                getOptionLabel={option => option?.subject_group_name || ''}
                renderInput={params => <TextField {...params} label='Subject Group' />}
                onChange={(e, value) => {
                  if (value !== null) {
                    setGroupSelected(value)
                    setState(pre => ({ ...pre, subject_group_id: value.subject_group_id }))
                  } else {
                    setGroupSelected([])
                    setState(pre => ({ ...pre, subject_group_id: null }))
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name='csv2_credit_total'
                type='number'
                value={state?.csv2_credit_total || 1}
                onChange={e => {
                  handleChangeNumber(e, setState)
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              formType === 0 ? handleSubmit() : handleUpdate()
            }}
            variant='contained'
          >
            {formType === 0 ? 'Submit' : 'Update'}
          </Button>
          <Button
            onClick={() => {
              setState(initialState)
              setOpen(false)
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} fullWidth maxWidth={'md'}>
        <DialogTitle>Structure Preview</DialogTitle>
        <DialogContent sx={{ minHeight: 450 }}>
          <Grid sx={{ ml: 6, pb: 12 }} container xs={12}>
            <Grid item xs={12}>
              <Box sx={{ width: '100%' }}>
                {/* {Object.values(groupedStructure)?.map(category => (
                  <Typography key={category.subject_category_name}>
                    {category.subject_category_name}
                    {Object.values(category.grouped)?.map(ty => (
                      <Typography key={ty.subject_type_name} sx={{ ml: 3.5 }}>
                        {ty.subject_type_name}
                        {Object.values(ty.grouped).map(g => (
                          <Typography key={g?.curriculum_structures_v2_id}>{g.curriculum_structures_v2_id}</Typography>
                        ))}
                      </Typography>
                    ))}
                  </Typography>
                ))} */}
                {/* <DisplayGroupedData groupedData={groupedStructure} /> */}
                {/* {Object.values(CurriculumStructures)?.map(data => PreviewStructures(data))} */}
                {UniqueCategories.map(categoryHeader => (
                  <Box key={categoryHeader} maxWidth={600} sx={{ mb: 3 }}>

                    {CurriculumStructures?.filter(
                      categoryHasCredit =>
                        categoryHasCredit.subject_category_id !== null &&
                        categoryHasCredit.subject_type_id === null &&
                        categoryHasCredit.subject_group_id === null &&
                        categoryHasCredit.subjectCategory?.subject_category_name === categoryHeader
                    ).length > 0 ? (
                      CurriculumStructures?.filter(
                        categoryHasCredit =>
                          categoryHasCredit.subject_category_id !== null &&
                          categoryHasCredit.subject_type_id === null &&
                          categoryHasCredit.subject_group_id === null &&
                          categoryHasCredit.subjectCategory?.subject_category_name === categoryHeader
                      ).map(categoryHasCreditResult => (
                        <Box key={categoryHasCreditResult.curriculum_structures_v2_id} sx={{ display: 'flex', justifyContent: 'space-between', mr: 2 }}>
                          <Typography variant='h6'>{categoryHasCreditResult?.subjectCategory?.subject_category_name}</Typography>
                          <Typography> {' ' + categoryHasCreditResult?.csv2_credit_total + ' credit'}</Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography key={categoryHeader} variant='h6'>{categoryHeader}</Typography>
                    )}


                    {/* {CurriculumStructures?.filter(
                      categoryDuplicate =>
                        // condition category && type
                        categoryDuplicate.subject_category_id !== null &&
                        categoryDuplicate.subject_type_id === null &&
                        categoryDuplicate.subject_group_id === null
                    ).map(categoryDuplicateResult => (
                      <Box key={categoryDuplicateResult.curriculum_structures_v2_id}>
                        {categoryDuplicateResult.subjectCategory.subject_category_name !== categoryHeader && (
                          <Typography variant='h6'>{categoryHeader}</Typography>
                        )}
                      </Box>
                    ))} */}

                    {/* case 1 */}
                    {CurriculumStructures?.filter(
                      case1 =>
                        // condition category && type or category && group
                        (case1.subject_category_id !== null &&
                          case1.subject_type_id !== null &&
                          case1.subjectCategory?.subject_category_name === categoryHeader &&
                          case1.subject_group_id === null) ||
                        (case1.subject_category_id !== null &&
                          case1.subject_group_id !== null &&
                          case1.subjectCategory?.subject_category_name === categoryHeader &&
                          case1.subject_type_id === null)
                    ).map(case1Result => (
                      <Box key={case1Result.curriculum_structures_v2_id}>
                        {case1Result.subject_type_id !== null ? (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mx: 2 }}>
                            <Typography>{case1Result.subjectType?.subject_type_name}</Typography>
                            <Typography> {' ' + case1Result.csv2_credit_total + ' credit'}</Typography>
                          </Box>
                        ) : (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mx: 2 }}>
                            <Typography>{case1Result.subjectGroup?.subject_group_name}</Typography>
                            <Typography> {' ' + case1Result.csv2_credit_total + ' credit'} </Typography>
                          </Box>
                        )}
                      </Box>
                    ))}
                    {UniqueTypes.filter(filterType => filterType.subject_category_name === categoryHeader).map(
                      typeHeader => (
                        <Box key={typeHeader.subject_type_name} sx={{ ml: 3 }}>
                          {/* {typeHeader.subject_type_name} */}
                          {CurriculumStructures?.filter(
                            case1 =>
                              // condition category && type
                              case1.subject_category_id !== null &&
                              case1.subject_type_id !== null &&
                              case1.subject_group_id === null
                          ).map(case1Duplicate => (
                            <Box key={case1Duplicate.curriculum_structures_v2_id}>
                              {case1Duplicate.subjectType.subject_type_name !== typeHeader.subject_type_name && (
                                <Typography>{typeHeader.subject_type_name}</Typography>
                              )}
                            </Box>
                          ))}
                          {/* <Typography>{typeHeader.subject_type_name}</Typography> */}

                          {/* case 2 */}
                          {CurriculumStructures?.filter(
                            case2 =>
                              // condition category && type && group
                              case2.subject_category_id !== null &&
                              case2.subject_type_id !== null &&
                              case2.subject_group_id !== null &&
                              case2.subjectCategory?.subject_category_name === categoryHeader &&
                              case2.subjectType?.subject_type_name === typeHeader.subject_type_name
                          ).map(case2Result => (
                            <Box key={case2Result.curriculum_structures_v2_id} sx={{ ml: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mx: 2 }}>
                                <Typography variant='body2'>{case2Result.subjectGroup?.subject_group_name}</Typography>
                                <Typography variant='body1'>
                                  {' ' + case2Result.csv2_credit_total + ' credit'}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )
                    )}
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default curriculumstructure
