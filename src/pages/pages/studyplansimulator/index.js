import React, { useEffect, useState } from 'react'
import {
  Typography,
  Tabs,
  Tab,
  Box,
  Grid,
  Hidden,
  Card,
  Button,
  TablePagination,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material'
import { grey } from '@mui/material/colors'
import { mdiClose, mdiTrashCan, mdiBookEducation, mdiAccount } from '@mdi/js'
import Icon from '@mdi/react'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import { CircleLoading, Selection, TextSearch } from 'src/components'
import { url } from 'src/configs/urlConfig'
import { useFetch, useSearchText as UseSearchText } from 'src/hooks'

function StudyPlanSimulatorPage() {
  const [SubjectsTemp, setSubjectsTemp] = useState([])

  const [categoriesSubject, setCategoriesSubject] = useState([])
  const [typesSubject, setTypesSubject] = useState([])
  const [groupsSubject, setGroupsSubject] = useState([])

  const [categoriesSelected, setCategoriesSelected] = useState(0)
  const [typesSelected, setTypesSelected] = useState(0)
  const [groupsSelected, setGroupsSelected] = useState(0)

  const [subjectSelected, setSubjectSelected] = useState([])
  const [openDetails, setOpenDetails] = useState(false)

  const [openResult, setOpenResult] = useState(true)

  const [totalCredit, setTotalCredit] = useState(0)

  const [dialogStatus, setDialogStatus] = useState(0) // if 0 show Details, 1 show alert when subject has parent

  const URL_GET_SUBJECTS_BY_CURRICURUM = `${url.BASE_URL}/subjects-by-curriculum/`
  const URL_GET_SUBJECTS_RELATIONS = `${url.BASE_URL}/continue-subjects-subject/`
  const URL_GET_CURRICULUM_STRUCTURES = `${url.BASE_URL}/curriculum-structures-v2/`

  const {
    error: SubjectsError,
    data: Subjects,
    setData: setSubjects,
    loading: SubjectsLoading,
    reFetch: reFetchSubjects
  } = useFetch(URL_GET_SUBJECTS_BY_CURRICURUM + 2) // 1 for ce 60 curriculum, 2 for se 66

  const {
    error: SubjectsRelationsError,
    data: SubjectsRelations,
    setData: setSubjectsRelations,
    loading: SubjectsRelationsLoading,
    reFetch: reFetchSubjectsRelations
  } = useFetch(URL_GET_SUBJECTS_RELATIONS + subjectSelected.subject_id) // 1 for ce 60 curriculum

  const {
    error: CurriculumStructuresError,
    data: CurriculumStructures,
    setData: setCurriculumStructures,
    loading: CurriculumStructuresLoading,
    reFetch: reFetchCurriculumStructures
  } = useFetch(URL_GET_CURRICULUM_STRUCTURES + 2)

  const handleOpenDetails = subject => {
    if (!subject) return

    setSubjectSelected(subject)
    setOpenDetails(true)
  }

  const handleOpenResult = () => {
    setOpenResult(true)
  }

  const handleCheckLimitCredit = term => {
    const currentTerm = term
    console.log('currentTerm', currentTerm)
    const simInterm = simSubjects?.filter(s => s.term === currentTerm)

    const creditTotal = simInterm.reduce((accumulator, currentValue) => {
      // Adding the 'value' property of each object to the accumulator
      return accumulator + currentValue.subject_credit
    }, 0)
    setTotalCredit(creditTotal)
    console.log('term ' + currentTerm + ' total credit is :', creditTotal)
  }

  const handleCheckPreviousSubject = subject => {
    if (!subject) return
    if (subject?.continue_subjects[0]?.parent_id !== undefined && subject?.continue_subjects[0]?.parent_id !== null) {
      const checkParentInSim = simSubjects?.find(
        s => s.subject_id === subject?.continue_subjects[0]?.parent_id && value + 1 > s.term
      )
      if (checkParentInSim === undefined) {
        console.log('checkParentInSim', checkParentInSim)
        setDialogStatus(1)
        setOpenDetails(true)
        setSubjectSelected(subject)

        return 1
      }
      return 0

      // has parent
    }
    setDialogStatus(0)
    setOpenDetails(false)

    return 0 // is not has parent
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

  useEffect(() => {
    console.log('categoriesSelected', categoriesSelected)
  }, [categoriesSelected])

  useEffect(() => {
    console.log('typesSelected', typesSelected)
  }, [typesSelected])

  useEffect(() => {
    console.log('groupsSelected', groupsSelected)
  }, [groupsSelected])

  const searchSubjectColumns = ['subject_code', 'subject_name_th', 'subject_name_en']

  const [page, setPage] = useState(0)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const [simSubjects, setSimSubjects] = useState([])
  const [curriculumScope, setCurriculumScope] = useState([])
  const [isHovered, setIsHovered] = useState([])

  const handleMouseEnter = index => {
    setIsHovered(prevStates => {
      const newStates = [...prevStates]
      newStates[index] = true

      return newStates
    })
  }

  const handleMouseLeave = index => {
    setIsHovered(prevStates => {
      const newStates = [...prevStates]
      newStates[index] = false

      return newStates
    })
  }

  const handleAddSimSubjects = (subject, checkParent = true) => {
    if (!subject) {
      return
    }

    // if (subject.continue_subjects.length === 0) {
    if (checkParent) {
      const hasParent = handleCheckPreviousSubject(subject)

      // console.log('hasParent', hasParent)
      if (!hasParent) {
        if (
          !simSubjects.find(s => s.subject_id === subject?.subject_id) &&
          subject?.subject_credit + totalCredit <= 25
        ) {
          const newObject = {
            term: value + 1,
            subject_id: subject?.subject_id,
            subject_code: subject?.subject_code,
            subject_name_th: subject?.subject_name_th,
            subject_name_en: subject?.subject_name_en,
            subject_credit: subject?.subject_credit,
            subject_group_id: subject?.subjectGroup?.subject_group_id,
            subject_group_name: subject?.subjectGroup?.subject_group_name
          }
          const results = [...simSubjects, newObject]
          setSimSubjects(results)
          console.log('added sim subject', results)
        } else if (simSubjects.find(s => s.subject_id === subject?.subject_id)) {
          alert('this subject already in simulator')
        } else if (subject?.subject_credit + totalCredit >= 25) {
          alert('this total credit is overflow (total credit must lest than 25 or equal)')
        }
      }
    } else {
      if (!simSubjects.find(s => s.subject_id === subject?.subject_id) && subject?.subject_credit + totalCredit <= 25) {
        const newObject = {
          term: value + 1,
          subject_id: subject?.subject_id,
          subject_code: subject?.subject_code,
          subject_name_th: subject?.subject_name_th,
          subject_name_en: subject?.subject_name_en,
          subject_credit: subject?.subject_credit,
          subject_group_id: subject?.subjectGroup?.subject_group_id,
          subject_group_name: subject?.subjectGroup?.subject_group_name
        }
        const results = [...simSubjects, newObject]
        setSimSubjects(results)
        console.log('added sim subject', results)
      } else if (subject?.subject_credit + totalCredit >= 25) {
        alert('this total credit is overflow (total credit must lest than 21 or equal)')
      } else if (simSubjects.find(s => s.subject_id === subject?.subject_id)) {
        alert('this subject already in simulator')
      }
    }

    // }
    // else {
    //   alert(
    //     'Please add ' +
    //       subject.continue_subjects[0].parent?.subject_code +
    //       ' ' +
    //       subject.continue_subjects[0].parent?.subject_name_en +
    //       ' Before.'
    //   )
    // }
  }
  useEffect(() => {
    handleCheckLimitCredit(value + 1)
  }, [simSubjects])

  const handleRemoveSimSubject = subjectId => {
    // Filter out the subject with the given subject_id
    const updatedSimSubjects = simSubjects.filter(subject => subject.subject_id !== subjectId)

    // Update the state with the filtered array
    setSimSubjects(updatedSimSubjects)
  }

  useEffect(() => {
    console.log(simSubjects)
  }, [simSubjects])

  const [displaySubjects, setDisplaySubjects] = useState(true)
  const [displayScope, setDisplayCompetencies] = useState(false)

  const handleChangeDisplay = () => {
    if (displaySubjects) {
      setDisplaySubjects(!displaySubjects)
      setDisplayCompetencies(true)
    } else {
      setDisplayCompetencies(!displayScope)
      setDisplaySubjects(true)
    }
  }

  // console.log('SubjectsRelations', SubjectsRelations)

  const [tabs, setTabs] = useState(['Term 1'])

  // for current tab value
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    handleCheckLimitCredit(value)
    console.log('Term :', value)
    setValue(newValue)
  }

  const [searchText, setSearchText] = useState('')

  const handleSearchChange = text => {
    setSearchText(text)
  }

  const handleClickSearch = () => {
    UseSearchText(searchText, setSubjects, setSearchText, SubjectsTemp, searchSubjectColumns)
  }

  const handleAddTab = () => {
    const newTabIndex = tabs.length + 1
    const newTabLabel = `Term ${newTabIndex}`
    console.log('newTabIndex :', newTabIndex)
    handleCheckLimitCredit(newTabIndex)
    setTabs([...tabs, newTabLabel])
    setValue(newTabIndex - 1) // Switch to the newly added tab
  }

  const handleRemoveTab = indexToRemove => {
    if (indexToRemove < 0 || indexToRemove >= tabs.length) {
      // Ensure the index is within the valid range
      return
    }

    const checkSubjectInterm = simSubjects.filter(s => s.term === indexToRemove + 1)
    if (checkSubjectInterm.length > 0) {
      let result = window.confirm(
        'Still Have Subject In This Term ' + parseInt(indexToRemove + 1) + ' Confirm To Delete?'
      )
      if (result) {
        const updateSimSubject = simSubjects.filter(s => s.term !== indexToRemove + 1)
        setSimSubjects(updateSimSubject)

        // Create a new array without the tab to be removed
        const updatedTabs = tabs.filter((_, index) => index !== indexToRemove)

        // Rename the remaining tabs based on their new indices
        const renamedTabs = updatedTabs.map((label, index) => `Term ${index + 1}`)

        // Set the updated tabs and adjust the value if needed
        setTabs(renamedTabs)

        // If the removed tab was the last one, adjust the value to select the previous tab
        const newValue = Math.min(value, renamedTabs.length - 1)
        setValue(newValue)
      }
    } else {
      // Create a new array without the tab to be removed
      const updatedTabs = tabs.filter((_, index) => index !== indexToRemove)

      // Rename the remaining tabs based on their new indices
      const renamedTabs = updatedTabs.map((label, index) => `Term ${index + 1}`)

      // Set the updated tabs and adjust the value if needed
      setTabs(renamedTabs)

      // If the removed tab was the last one, adjust the value to select the previous tab
      const newValue = Math.min(value, renamedTabs.length - 1)
      setValue(newValue)
    }
  }

  useEffect(() => {
    if (!SubjectsLoading) {
      setSubjectsTemp(Subjects)
      console.log('Subjects', Subjects)

      // Use Set to store unique values
      const uniqueCategories = new Set()
      const uniqueTypes = new Set()
      const uniqueGroups = new Set()

      const subjectStructure = Subjects?.map(v => v.subject_structures)

      console.log('subjectStructure', subjectStructure)

      //   // Iterate over the array and populate the sets
      Object.values(subjectStructure)?.forEach(subject => {
        uniqueCategories.add(subject[0]?.subjectCategory?.subject_category_name)
        uniqueTypes.add(subject[0]?.subjectType?.subject_type_name)
        uniqueGroups.add(subject[0]?.subjectGroup?.subject_group_name)
      })

      // Convert sets to arrays if needed
      const uniqueCategoriesArray = Array.from(uniqueCategories)
      const uniqueTypesArray = Array.from(uniqueTypes)
      const uniqueGroupsArray = Array.from(uniqueGroups)

      setCategoriesSubject(uniqueCategoriesArray)
      setTypesSubject(uniqueTypesArray)
      setGroupsSubject(uniqueGroupsArray)

      console.log('Unique Subject Categories:', uniqueCategoriesArray)
      console.log('Unique Subject Types:', uniqueTypesArray)
      console.log('Unique Subject Groups:', uniqueGroupsArray)
    } else {
      return
    }
  }, [SubjectsLoading, SubjectsTemp])

  return (
    <>
      <Hidden smDown>
        <Grid container sx={{ m: 2 }}>
          <Grid container item sm={6} md={8} lg={8} sx={{ height: '100%' }}>
            {/* Filter */}
            <Grid item sm={12} md={6} lg={8}>
              <TextSearch
                onChange={e => handleSearchChange(e.target.value)}
                onClick={() => handleClickSearch()}
                buttoninside={1}
                placeholder='Subject Code, Name'
              />
            </Grid>
            <Grid item sm={12} md={4} lg={4}>
              {/* Pagination */}
              <TablePagination
                rowsPerPageOptions={[]}
                component='div'
                size='small'
                count={Subjects.length}
                rowsPerPage={24}
                page={page}
                onPageChange={handleChangePage}

                // onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Grid>
            <Grid container item sm={12} lg={8} spacing={2}>
              <Grid item sm={12} md={6} lg={4}>
                <Selection
                  disabled={categoriesSubject[0] === undefined}
                  label={'Category'}
                  height={40}
                  width={'100%'}
                  selectionValue={categoriesSelected}
                  firstItemText={'แสดงทั้งหมด'}
                  handleChange={e => {
                    setCategoriesSelected(e.target.value)
                  }}
                  Items={Object.values(categoriesSubject).map(menu => (
                    <MenuItem key={menu} value={menu}>
                      {menu}
                    </MenuItem>
                  ))}
                />
              </Grid>
              <Grid item sm={12} md={4} lg={4}>
                <Selection
                  disabled={typesSubject[0] === undefined}
                  label={'Type'}
                  height={40}
                  width={'100%'}
                  selectionValue={typesSelected}
                  firstItemText={'แสดงทั้งหมด'}
                  handleChange={e => setTypesSelected(e.target.value)}
                  Items={Object.values(typesSubject).map(menu => (
                    <MenuItem key={menu} value={menu}>
                      {menu}
                    </MenuItem>
                  ))}
                />
              </Grid>
              <Grid item sm={12} md={4} lg={4}>
                <Selection
                  disabled={groupsSubject[0] === undefined}
                  label={'Group'}
                  height={40}
                  width={'100%'}
                  selectionValue={groupsSelected}
                  firstItemText={'แสดงทั้งหมด'}
                  handleChange={e => setGroupsSelected(e.target.value)}
                  Items={Object.values(groupsSubject).map(menu => (
                    <MenuItem key={menu} value={menu}>
                      {menu}
                    </MenuItem>
                  ))}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ height: 600, mt: 6 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  {/* {Array.from({ length: 24 }, (_, index) => index).map(value => ( */}
                  {SubjectsLoading ? (
                    <Box sx={{ width: '100%', height: 200, m: 12 }}>
                      <CircleLoading />
                    </Box>
                  ) : (
                    // Subjects.slice(page * 24, page * 24 + 24).map(value => (
                    Subjects.filter(
                      f =>
                        // case 1 select all filters
                        (f.subject_structures[0]?.subjectCategory?.subject_category_name === categoriesSelected &&
                          f.subject_structures[0]?.subjectType?.subject_type_name === typesSelected &&
                          f.subject_structures[0]?.subjectGroup?.subject_group_name === groupsSelected) ||
                        // case 2 select two of three
                        // category and type
                        (f.subject_structures[0]?.subjectCategory?.subject_category_name === categoriesSelected &&
                          f.subject_structures[0]?.subjectType?.subject_type_name === typesSelected &&
                          !groupsSelected) ||
                        // category and group
                        (f.subject_structures[0]?.subjectCategory?.subject_category_name === categoriesSelected &&
                          f.subject_structures[0]?.subjectGroup?.subject_group_name === groupsSelected &&
                          !typesSelected) ||
                        // type and group
                        (f.subject_structures[0]?.subjectType?.subject_type_name === typesSelected &&
                          f.subject_structures[0]?.subjectGroup?.subject_group_name === groupsSelected &&
                          !categoriesSelected) ||
                        // case 3 select only one of three
                        // only category
                        (f.subject_structures[0]?.subjectCategory?.subject_category_name === categoriesSelected &&
                          !typesSelected &&
                          !groupsSelected) ||
                        // only type
                        (f.subject_structures[0]?.subjectType?.subject_type_name === typesSelected &&
                          !categoriesSelected &&
                          !groupsSelected) ||
                        // only group
                        (f.subject_structures[0]?.subjectGroup?.subject_group_name === groupsSelected &&
                          !categoriesSelected &&
                          !typesSelected) ||
                        (!categoriesSelected && !typesSelected && !groupsSelected)
                    )
                      .slice(page * 24, page * 24 + 24)

                      .map(value => (
                        <Grid item sm={12} md={6} lg={4} key={value.subject_id}>
                          <Card sx={{ height: 65, background: 'white' }}>
                            <Box
                              sx={{
                                height: 30,
                                background: simSubjects.find(v => v.subject_id === value.subject_id)
                                  ? 'white'
                                  : 'lightgray',
                                display: 'flex',
                                justifyContent: 'space-between'
                              }}
                            >
                              <Typography
                                variant='body2'
                                sx={{
                                  m: 1,
                                  ml: 2,
                                  fontWeight: 'bold',
                                  color: simSubjects.find(v => v.subject_id === value.subject_id) && 'gray',
                                  display: 'inline' // Ensure inline display
                                }}
                              >
                                {value.subject_code}
                                <Typography
                                  variant='caption'
                                  color={'gray'}
                                  component='span' // Use span as the component to render inline
                                  sx={{
                                    display: 'inline' // Ensure inline display
                                  }}
                                >
                                  {simSubjects.find(v => v.subject_id === value.subject_id) &&
                                    '(TERM ' + simSubjects.find(v => v.subject_id === value.subject_id).term + ')'}
                                </Typography>
                              </Typography>
                              {simSubjects.find(v => v.subject_id === value.subject_id) ? null : (
                                <Button
                                  onClick={() =>
                                    !simSubjects.find(v => v.subject_id === value.subject_id) &&
                                    handleAddSimSubjects(value)
                                  }
                                  sx={{
                                    color: 'white',
                                    m: 1,
                                    mx: -2
                                  }}
                                >
                                  +
                                </Button>
                              )}
                            </Box>
                            <Box
                              onClick={() => handleOpenDetails(value)}
                              sx={{
                                height: 35,
                                ml: 1.5,
                                p: 1,
                                display: 'flex',
                                direction: 'column',
                                cursor: 'pointer'
                              }}
                            >
                              <Typography
                                variant='body2'
                                color={simSubjects.find(v => v.subject_id === value.subject_id) && 'lightgray'}
                                noWrap
                              >
                                {/* Subject ................................................................... */}
                                {value.subject_name_en}
                              </Typography>
                            </Box>
                          </Card>
                        </Grid>
                      ))
                  )}
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Grid item sm={6} md={4} lg={4}>
            <Box
              sx={{
                // background: 'lightGray',
                height: '100vh',
                p: { sm: 2, md: 2, lg: 5 },
                pr: { sm: 3, md: 3, lg: 7 },
                pt: { sm: 6, md: 6, lg: 0 }
              }}
            >
              <Box sx={{ pt: 6, display: 'flex', flexDirection: 'row' }}>
                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                  Simulator :{' '}
                </Typography>
                <Typography variant='h6' sx={{ ml: 2, color: 'gray' }}>
                  SE 2566
                </Typography>
              </Box>
              <Box>
                <Box sx={{ overflowX: 'auto' }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    variant={'scrollable'}

                    // centered={tabs.length <= 3}
                  >
                    {tabs.map((tabLabel, index) => (
                      <Tab
                        key={index}
                        label={
                          <span>
                            {tabLabel}
                            {value === index &&
                              tabs.length !== 1 && ( // Only show IconButton for tabs other than the first one
                                <IconButton
                                  sx={{ color: 'gray', borderRadius: 1, ml: 2 }}
                                  onClick={() => handleRemoveTab(index)}
                                >
                                  <Icon path={mdiClose} size={0.5} />
                                </IconButton>
                              )}
                          </span>
                        }
                        sx={{ fontSize: 12 }}
                      />
                    ))}
                    {tabs.length >= 12 ? null : (
                      <IconButton
                        sx={{ color: 'gray', borderRadius: 1, borderTopRightRadius: 24, m: 1, width: 48 }}
                        onClick={handleAddTab}
                      >
                        +
                      </IconButton>
                    )}
                  </Tabs>
                </Box>
                {tabs.map((tabLabel, index) => (
                  <Box
                    key={index}
                    role='tabpanel'
                    hidden={value !== index}
                    id={`tabpanel-${index}`}
                    aria-labelledby={`tab-${index}`}
                    sx={{ width: '100%', display: value === index ? 'block' : 'none' }}
                  >
                    {/* Content for each tab */}

                    <Box sx={{ m: 2, width: '100%', minHeight: 600 }}>
                      <Box sx={{ width: '100%', my: 2 }}>
                        <Button
                          sx={{
                            fontSize: 12,
                            width: '49%',
                            background: displaySubjects ? 'lightgray' : null,
                            color: displaySubjects ? 'white' : null,
                            border: 2,
                            borderColor: grey[300]
                          }}
                          onClick={handleChangeDisplay}
                        >
                          Subjects
                        </Button>
                        <Button
                          sx={{
                            ml: '1%',
                            fontSize: 12,
                            width: '49%',
                            background: displayScope ? 'lightgray' : null,
                            color: displayScope ? 'white' : null,
                            border: 2,
                            borderColor: grey[300]
                          }}
                          onClick={handleChangeDisplay}
                        >
                          Scope
                        </Button>
                      </Box>
                      {displaySubjects && (
                        <div style={{ textAlign: 'right' }}>
                          <Typography variant='body2' sx={{ mr: 4 }}>
                            {'Total Credit : ' + totalCredit}
                          </Typography>
                        </div>
                      )}

                      {displaySubjects &&
                        simSubjects
                          .filter(s => s.term === value + 1)
                          .map((subjectInterm, index) => (
                            <Box
                              key={subjectInterm.subject_id}
                              onMouseEnter={() => handleMouseEnter(index)}
                              onMouseLeave={() => handleMouseLeave(index)}
                              sx={{
                                width: '100%',
                                display: 'flex',
                                p: 3.5,
                                mt: 2,
                                mr: 3.5,
                                borderRadius: 2,

                                background: 'white',
                                position: 'relative' // Add relative positioning
                              }}
                            >
                              <Typography variant='caption' sx={{ m: 2, maxWidth: 30, color: 'lightgray' }}>
                                {index + 1}.
                              </Typography>
                              <Box sx={{ justifyContent: 'space-between', display: 'flex', width: '100%' }}>
                                <Typography variant='caption' sx={{ minWidth: 100, maxWidth: 300, m: 2 }}>
                                  {subjectInterm.subject_code} {subjectInterm.subject_name_en}
                                </Typography>
                                <Typography sx={{ m: 2, mr: 7 }} variant='caption'>
                                  {subjectInterm.subject_credit}
                                </Typography>
                              </Box>
                              <IconButton
                                size='small'
                                color='error'
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  zIndex: 1,
                                  opacity: isHovered[index] ? 0.9 : 0, // Show or hide based on hover state
                                  transition: 'opacity 0.3s ease'
                                }}
                                onClick={() => {
                                  // Add your remove logic here
                                  handleRemoveSimSubject(subjectInterm.subject_id)
                                }}
                              >
                                <Icon path={mdiTrashCan} size={0.7} />
                              </IconButton>
                            </Box>
                          ))}
                      {displayScope && (
                        <Grid item xs={12}>
                          <Box sx={{ width: '100%' }}>
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
                                    <Box
                                      key={categoryHasCreditResult.curriculum_structures_v2_id}
                                      sx={{ display: 'flex', justifyContent: 'space-between', mr: 2 }}
                                    >
                                      <Typography variant='body1'>
                                        {categoryHasCreditResult?.subjectCategory?.subject_category_name}
                                      </Typography>
                                      <Typography>{' ' + categoryHasCreditResult?.credit_total + ' credit'}</Typography>
                                    </Box>
                                  ))
                                ) : (
                                  <Typography variant='body1' key={categoryHeader}>
                                    {categoryHeader}
                                  </Typography>
                                )}

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
                                        <Typography variant='body2'>
                                          {case1Result.subjectType?.subject_type_name}
                                        </Typography>
                                        <Typography variant='body2'>
                                          {' ' + case1Result.credit_total + ' credit'}
                                        </Typography>
                                      </Box>
                                    ) : (
                                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mx: 2 }}>
                                        <Typography variant='body2'>
                                          {case1Result.subjectGroup?.subject_group_name}
                                        </Typography>
                                        <Typography variant='body2'>
                                          {' ' + case1Result.credit_total + ' credit'}{' '}
                                        </Typography>
                                      </Box>
                                    )}
                                  </Box>
                                ))}

                                {UniqueTypes.filter(
                                  filterType => filterType.subject_category_name === categoryHeader
                                ).map(typeHeader => (
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
                                        {case1Duplicate.subjectType.subject_type_name !==
                                          typeHeader.subject_type_name && (
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
                                          <Typography variant='body2'>
                                            {case2Result.subjectGroup?.subject_group_name}
                                          </Typography>
                                          <Typography variant='body1'>
                                            {' ' + case2Result.credit_total + ' credit'}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    ))}
                                  </Box>
                                ))}
                              </Box>
                            ))}
                          </Box>
                        </Grid>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
              <Button variant='contained' sx={{ width: '100%' }} onClick={handleOpenResult}>
                Simulation Results
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Hidden>
      <Hidden smUp>
        <Box sx={{ height: '100vh', width: '100%', background: 'gray' }}>
          <Typography>Not Support Too Small Screen</Typography>
        </Box>
      </Hidden>
      <Hidden smDown>
        <Dialog
          open={openDetails}
          onClose={() => {
            setOpenDetails(false)
            setSubjectSelected([])
            setDialogStatus(0)
          }}
          fullWidth
          maxWidth={'md'}
        >
          {dialogStatus === 0 ? (
            <>
              <DialogTitle
                sx={{
                  background: 'lightgray',
                  display: 'flex',
                  justifyContent: 'space-between',
                  pr: 6,
                  borderBottom: 1,
                  borderColor: grey[500]
                }}
              >
                <Typography variant='h6'>Subject Details</Typography>
                <Typography variant='h5'>{subjectSelected.subject_code}</Typography>
              </DialogTitle>
              <DialogContent sx={{ minHeight: 600, background: grey[200], p: 10 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', mt: 6 }}>
                  <Typography variant='h3'>{subjectSelected.subject_credit}</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', ml: 4, mt: 1.5 }}>
                    <Typography variant='body2' sx={{ color: 'gray' }}>
                      {subjectSelected.subject_name_en}
                    </Typography>
                    <Typography variant='body2' sx={{ color: grey[800] }}>
                      {subjectSelected.subject_name_th}
                    </Typography>
                  </Box>
                </Box>
                <Grid container sx={{ display: 'flex', flexDirection: 'row', mt: 10 }} spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant='body2' sx={{ color: 'gray' }}>
                      Previous Subject
                    </Typography>
                    {SubjectsRelationsLoading && 'Loading...'}
                    <Typography variant='body2' sx={{ fontWeight: 'bold' }} noWrap>
                      {SubjectsRelations[0]?.parent
                        ? SubjectsRelations[0]?.parent?.subject_code +
                          ' ' +
                          SubjectsRelations[0]?.parent?.subject_name_en
                        : !SubjectsRelationsLoading && 'No Previous Subject'}
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant='body2' sx={{ color: 'gray' }}>
                      Continue Subject
                    </Typography>
                    {SubjectsRelationsLoading && 'Loading...'}
                    {SubjectsRelations[0]?.children.length > 0
                      ? SubjectsRelations[0]?.children.map(ch => (
                          <div
                            key={ch.subject_id}
                            style={{
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              '&:hover': {
                                backgroundColor: '#e0e0e0' // Add your desired background color on hover
                              }
                            }}
                          >
                            <div style={{ marginRight: '8px' }}>•</div> {/* Bullet-like character */}
                            <Typography
                              variant='body2'
                              sx={{ color: grey[700], fontWeight: 'bold', display: 'inline' }}
                              noWrap
                            >
                              {ch.subjects.subject_code + ' ' + ch.subjects.subject_name_en}
                            </Typography>
                          </div>

                          // </li>
                        ))
                      : !SubjectsRelationsLoading && (
                          <Typography variant='body2' sx={{ color: grey[700], fontWeight: 'bold', display: 'inline' }}>
                            No Continue Subject
                          </Typography>
                        )}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant='body2' sx={{ color: 'gray', mt: 8 }}>
                      Subject Description
                    </Typography>
                    <Typography variant='body2' sx={{ color: grey[700] }} textAlign='justify'>
                      {subjectSelected.subject_description}
                    </Typography>
                  </Grid>
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={12} sx={{ mb: 2 }}>
                      <Typography variant='body2' sx={{ color: 'gray', mt: 8 }}>
                        Project Related
                      </Typography>
                    </Grid>
                    {[1, 2, 3, 4].map((item, index) => (
                      <Grid key={item} item sm={12} md={6} lg={4}>
                        <Card sx={{ height: 65, background: 'white' }}>
                          <Box
                            sx={{
                              height: 30,
                              background: 'lightgray',
                              display: 'flex',
                              justifyContent: 'end'
                            }}
                          >
                            <Button
                              sx={{
                                color: 'white',
                                m: 1,
                                mx: -2
                              }}
                            >
                              ...
                            </Button>
                          </Box>
                          <Box
                            sx={{
                              height: 35,
                              ml: 1.5,
                              p: 1,
                              display: 'flex',
                              direction: 'column'
                            }}
                          >
                            <Typography variant='body2' noWrap>
                              Application something
                            </Typography>
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </DialogContent>
            </>
          ) : (
            <>
              <DialogTitle
                sx={{
                  background: 'lightgray',
                  display: 'flex',
                  justifyContent: 'space-between',
                  pr: 6,
                  borderBottom: 1,
                  borderColor: grey[500]
                }}
              >
                <Typography variant='h6'>Subject Details</Typography>
                <Typography variant='h5'>{subjectSelected.subject_code}</Typography>
              </DialogTitle>
              <DialogContent sx={{ minHeight: 600, background: grey[200], p: 10 }}>
                <Box sx={{ mt: 6 }}>
                  <Typography variant='body2'>
                    this subject has parent please add this subject before, or you add this subject in a wrong term{' '}
                  </Typography>
                </Box>
                {SubjectsRelationsLoading ? (
                  <Box sx={{ m: 6 }}>Loading...</Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'row', mt: 6 }}>
                    <Typography variant='h3'>{SubjectsRelations[0]?.parent?.subject_credit}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 4, mt: 1.5 }}>
                      <Typography variant='body2' sx={{ color: 'gray' }}>
                        {SubjectsRelations[0]?.parent?.subject_name_en}
                      </Typography>
                      <Typography variant='body2' sx={{ color: grey[800] }}>
                        {SubjectsRelations[0]?.parent?.subject_name_th}
                      </Typography>
                    </Box>
                    <IconButton
                      sx={{ color: grey[400], borderRadius: 1, m: 1, width: 48, ml: 6 }}
                      onClick={() => {
                        handleAddSimSubjects(SubjectsRelations[0]?.parent, false)
                        setOpenDetails(false)
                      }}
                    >
                      +
                    </IconButton>
                  </Box>
                )}
              </DialogContent>
            </>
          )}
        </Dialog>
        <Dialog
          open={openResult}
          onClose={() => {
            setOpenResult(false)
            // setOpenDetails(false)
            // setSubjectSelected([])
            // setDialogStatus(0)
          }}
          fullWidth
          maxWidth={'md'}
        >
          <DialogTitle
            sx={{
              background: 'lightgray',
              display: 'flex',
              justifyContent: 'space-between',
              pr: 6,
              borderBottom: 1,
              borderColor: grey[500]
            }}
          >
            <Typography variant='h6'>Interested In</Typography>
            <IconButton
              sx={{ p: 0, color: grey[700], borderRadius: 1, m: 1, ml: 6 }}
              onClick={() => setOpenResult(false)}
            >
              <Icon path={mdiClose} size={1} />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ minHeight: 400, background: grey[200], p: 10 }}>
            <Grid container sx={{ mt: 4 }} spacing={0}>
              <Grid item xs={6} sx={{ pl: 12, pr: 6 }}>
                <Card
                  sx={{
                    mt: 3,
                    height: 220,
                    borderRadius: 4,
                    borderBottomRightRadius: 0,
                    transition: 'background-color 0.3s',
                    backgroundColor: grey[100],
                    '&:hover': {
                      backgroundColor: 'white', // Change the background color on hover
                      boxShadow: 6
                    },
                    cursor: 'pointer'
                  }}
                >
                  <Box sx={{ p: 8, textAlign: 'center' }}>
                    <Box sx={{ p: 2 }}>
                      <Icon path={mdiBookEducation} size={3} />
                    </Box>
                    <Typography variant='h6' color={grey[600]} sx={{ mt: 2 }}>
                      Subject
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={6} sx={{ pl: 6, pr: 12 }}>
                <Card
                  sx={{
                    mt: 3,
                    height: 220,
                    borderRadius: 4,
                    borderBottomRightRadius: 0,
                    transition: 'background-color 0.3s',
                    backgroundColor: grey[100],
                    '&:hover': {
                      backgroundColor: 'white', // Change the background color on hover
                      boxShadow: 6
                    },
                    cursor: 'pointer'
                  }}
                >
                  <Box sx={{ p: 8, textAlign: 'center' }}>
                    <Box sx={{ p: 2 }}>
                      <Icon path={mdiAccount} size={3} />
                    </Box>
                    <Typography variant='h6' color={grey[600]} sx={{ mt: 2 }}>
                      Job
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              <Grid item xs={12} textAlign={'center'} sx={{ mt: 12 }}>
                <Typography color={grey[500]}>**Please Select One**</Typography>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </Hidden>
    </>
  )
}
StudyPlanSimulatorPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default StudyPlanSimulatorPage
