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
  IconButton
} from '@mui/material'
import { mdiClose, mdiTrashCan } from '@mdi/js'
import Icon from '@mdi/react'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import { CircleLoading, Selection, TextSearch } from 'src/components'
import { url } from 'src/configs/urlConfig'
import { useFetch, useSearchText } from 'src/hooks'

function StudyPlanSimulatorPage() {
  const URL_GET_SUBJECTS_BY_CURRICURUM = `${url.BASE_URL}/subjects-by-curriculum/`

  const {
    error: SubjectsError,
    data: Subjects,
    setData: setSubjects,
    loading: SubjectsLoading,
    reFetch: reFetchSubjects
  } = useFetch(URL_GET_SUBJECTS_BY_CURRICURUM + 1) // 1 for ce 60 curriculum

  const [SubjectsTemp, setSubjectsTemp] = useState([])

  const [categoriesSubject, setCategoriesSubject] = useState([])
  const [typesSubject, setTypesSubject] = useState([])
  const [groupsSubject, setGroupsSubject] = useState([])

  const searchSubjectColumns = ['subject_code', 'subject_name_th', 'subject_name_en']

  const [page, setPage] = useState(0)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const [simSubjects, setSimSubjects] = useState([])
  const [simCompetencies, setCompetencies] = useState([])
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

  const handleAddSimSubjects = subject => {
    if (!subject) {
      return
    }
    const newObject = {
      term: value + 1,
      subject_id: subject?.subject_id,
      subject_code: subject?.subject_code,
      subject_name_th: subject?.subject_name_th,
      subject_name_en: subject?.subject_name_en,
      subject_credit: subject?.subject_credit
    }
    const results = [...simSubjects, newObject]
    setSimSubjects(results)
  }
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
  const [displayCompetencies, setDisplayCompetencies] = useState(false)

  const handleChangeDisplay = () => {
    if (displaySubjects) {
      setDisplaySubjects(!displaySubjects)
      setDisplayCompetencies(true)
    } else {
      setDisplayCompetencies(!displayCompetencies)
      setDisplaySubjects(true)
    }
  }

  const [tabs, setTabs] = useState(['Term 1'])

  // for current tab value
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const [searchText, setSearchText] = useState('')

  const handleSearchChange = text => {
    setSearchText(text)
  }

  const handleClickSearch = () => {
    useSearchText(searchText, setSubjects, setSearchText, SubjectsTemp, searchSubjectColumns)
  }

  const handleAddTab = () => {
    const newTabIndex = tabs.length + 1
    const newTabLabel = `Term ${newTabIndex}`
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
        uniqueCategories.add(subject[0].subjectCategory.subject_category_name)
        uniqueTypes.add(subject[0].subjectType.subject_type_name)
        uniqueGroups.add(subject[0].subjectGroup.subject_group_name)
      })

      // Convert sets to arrays if needed
      const uniqueCategoriesArray = Array.from(uniqueCategories)
      const uniqueTypesArray = Array.from(uniqueTypes)
      const uniqueGroupsArray = Array.from(uniqueGroups)

      setCategoriesSubject(uniqueCategoriesArray)
      setTypesSubject(uniqueTypesArray)
      setGroupsSubject(uniqueGroupsArray)

      // console.log('Unique Subject Categories:', uniqueCategoriesArray)
      // console.log('Unique Subject Types:', uniqueTypesArray)
      // console.log('Unique Subject Groups:', uniqueGroupsArray)
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
                handleSearchButton={handleClickSearch}
                buttonInside={true}
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
                  label={'Category'}
                  height={40}
                  width={'100%'}
                  selectionValue={0}
                  firstItemText={'แสดงทั้งหมด'}
                  // handleChange={e => setCurriculumSelected(e.target.value)}
                  Items={Object.values(categoriesSubject).map(menu => (
                    <MenuItem key={menu} value={menu}>
                      {menu}
                    </MenuItem>
                  ))}
                />
              </Grid>
              <Grid item sm={12} md={4} lg={4}>
                <Selection
                  label={'Type'}
                  height={40}
                  width={'100%'}
                  selectionValue={0}
                  firstItemText={'แสดงทั้งหมด'}
                  // handleChange={e => setCurriculumSelected(e.target.value)}
                  Items={Object.values(typesSubject).map(menu => (
                    <MenuItem key={menu} value={menu}>
                      {menu}
                    </MenuItem>
                  ))}
                />
              </Grid>
              <Grid item sm={12} md={4} lg={4}>
                <Selection
                  label={'Group'}
                  height={40}
                  width={'100%'}
                  selectionValue={0}
                  firstItemText={'แสดงทั้งหมด'}
                  // handleChange={e => setCurriculumSelected(e.target.value)}
                  Items={Object.values(groupsSubject).map(menu => (
                    <MenuItem key={menu} value={menu}>
                      {menu}
                    </MenuItem>
                  ))}
                />
              </Grid>
            </Grid>
            <Grid xs={12}>
              <Box sx={{ height: 600, mt: 6 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  {/* {Array.from({ length: 24 }, (_, index) => index).map(value => ( */}
                  {SubjectsLoading ? (
                    <Box sx={{ width: '100%', height: 200, m: 12 }}>
                      <CircleLoading />
                    </Box>
                  ) : (
                    Subjects.slice(page * 24, page * 24 + 24).map(value => (
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
                            sx={{
                              height: 35,
                              ml: 1.5,
                              p: 1,
                              display: 'flex',
                              direction: 'column'
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
                  CE 60
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

                    <IconButton
                      sx={{ color: 'gray', borderRadius: 1, borderTopRightRadius: 24, m: 1, width: 48 }}
                      onClick={handleAddTab}
                    >
                      +
                    </IconButton>
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

                    <Box sx={{ m: 2, widht: '100%' }}>
                      <Box sx={{ width: '100%', my: 2 }}>
                        <Button
                          sx={{
                            fontSize: 12,
                            width: '45%',
                            background: displaySubjects ? 'lightgray' : null,
                            color: displaySubjects ? 'white' : null
                          }}
                          onClick={handleChangeDisplay}
                        >
                          Subjects
                        </Button>
                        <Button
                          sx={{
                            fontSize: 12,
                            width: '45%',
                            background: displayCompetencies ? 'lightgray' : null,
                            color: displayCompetencies ? 'white' : null
                          }}
                          onClick={handleChangeDisplay}
                        >
                          Competencies
                        </Button>
                      </Box>
                      {displaySubjects &&
                        simSubjects
                          .filter(s => s.term === value + 1)
                          .map((subjectInterm, index) => (
                            <Box
                              key={subjectInterm.subject_id}
                              onMouseEnter={() => handleMouseEnter(index)}
                              onMouseLeave={() => handleMouseLeave(index)}
                              sx={{
                                display: 'flex',
                                p: 3.5,
                                m: 2,
                                borderRadius: 2,
                                justifyContent: 'space-between',
                                maxWidth: 375,
                                background: 'white',
                                position: 'relative' // Add relative positioning
                              }}
                            >
                              <Typography variant='caption' sx={{ m: 2, maxWidth: 20, color: 'lightgray' }}>
                                {index + 1}.
                              </Typography>

                              <Typography variant='caption' sx={{ minWidth: 100, maxWidth: 200 }}>
                                {subjectInterm.subject_code} {subjectInterm.subject_name_en}
                              </Typography>
                              <Typography sx={{ m: 2, mr: 7 }} variant='caption'>
                                {subjectInterm.subject_credit}
                              </Typography>

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
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Hidden>
      <Hidden smUp>
        <Box sx={{ height: '100vh', width: '100%', background: 'gray' }}>
          <Typography>Not Support Too Small Screen</Typography>
        </Box>
      </Hidden>
    </>
  )
}
StudyPlanSimulatorPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default StudyPlanSimulatorPage
