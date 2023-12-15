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
  DialogContent,
  Divider
} from '@mui/material'
import { grey } from '@mui/material/colors'
import { mdiClose, mdiTrashCan, mdiBookEducation, mdiAccount, mdiChevronLeft } from '@mdi/js'
import Icon from '@mdi/react'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import { CircleLoading, Selection, TextSearch } from 'src/components'
import { url } from 'src/configs/urlConfig'
import { useFetch, useSearchText as UseSearchText } from 'src/hooks'
import axios from 'axios'

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

  const [openResult, setOpenResult] = useState(false)

  const [totalCredit, setTotalCredit] = useState(0)

  const [dialogStatus, setDialogStatus] = useState(0) // if 0 show Details, 1 show alert when subject has parent

  const [resultSelected, setResultSelected] = useState(99) // 99  Default, 0 Subject, 1 Job ,2 Final Result

  const [resultSubjectList, setResultSubjectList] = useState([])
  const [resultJobSelected, setresultJobSelected] = useState([])

  const URL_GET_SUBJECTS_BY_CURRICURUM = `${url.BASE_URL}/subjects-by-curriculum/`
  const URL_GET_SUBJECTS_RELATIONS = `${url.BASE_URL}/continue-subjects-subject/`
  const URL_GET_CURRICULUM_STRUCTURES = `${url.BASE_URL}/curriculum-structures-v2/`
  const URL_SIM_RESULT_SUBJECT = `${url.BASE_URL}/simulation-result-subject/`

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
      // has parent and parent not in simulator
      if (checkParentInSim === undefined) {
        console.log('checkParentInSim', checkParentInSim)
        setDialogStatus(1)
        setOpenDetails(true)
        setSubjectSelected(subject)

        return 1
      }
      return 0
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

  const UniqueTypes = getUniqueMultiValues(
    CurriculumStructures,
    'subjectCategory.subject_category_name',
    'subjectType.subject_type_name',
    'subject_category_name',
    'subject_type_name'
  )

  // useEffect(() => {
  //   console.log('categoriesSelected', categoriesSelected)
  // }, [categoriesSelected])

  // useEffect(() => {
  //   console.log('typesSelected', typesSelected)
  // }, [typesSelected])

  // useEffect(() => {
  //   console.log('groupsSelected', groupsSelected)
  // }, [groupsSelected])

  const searchSubjectColumns = ['subject_code', 'subject_name_th', 'subject_name_en']

  const [page, setPage] = useState(0)

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const [simSubjects, setSimSubjects] = useState([])

  const [simSubjectsForSearch, setSimSubjectsForSearch] = useState([])

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
    // console.log('Subject', subject)
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
            subject_structures: subject?.subject_structures
          }
          const results = [...simSubjects, newObject]
          setSimSubjects(results)
          // console.log('added sim subject', results)

          // update count scope
          const fintoUpdateScope = CurriculumStructures.filter(
            scope =>
              scope.subjectGroup?.subject_group_id === subject?.subject_structures[0]?.subjectGroup?.subject_group_id
          ).map(pre => ({
            ...pre,
            countScope:
              pre.countScope !== undefined && !isNaN(pre.countScope)
                ? pre.countScope + subject?.subject_credit
                : subject?.subject_credit
          }))
          if (fintoUpdateScope) {
            const tempStructure = CurriculumStructures.filter(
              old =>
                old.subjectGroup?.subject_group_id !== subject?.subject_structures[0]?.subjectGroup?.subject_group_id
            )
            const newUpdate = [fintoUpdateScope[0], ...tempStructure]
            // console.log('newUpdate', newUpdate)
            setCurriculumStructures(
              newUpdate.sort(
                (a, b) =>
                  a.countScope - b.countScope &&
                  a.subjectCategory?.subject_category_id - b.subjectCategory?.subject_category_id
              )
            )
          }
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
          subject_structures: subject?.subject_structures
        }
        const results = [...simSubjects, newObject]
        setSimSubjects(results)
        // console.log('added sim subject', results)

        // update count scope with parent
        const fintoUpdateScope = CurriculumStructures.filter(
          scope => scope.subjectGroup?.subject_group_id === subject?.subject_structures[0]?.subject_group_id
        ).map(pre => ({
          ...pre,
          countScope:
            pre.countScope !== undefined && !isNaN(pre.countScope)
              ? pre.countScope + subject?.subject_credit
              : subject?.subject_credit
        }))
        if (fintoUpdateScope) {
          const tempStructure = CurriculumStructures.filter(
            old => old.subjectGroup?.subject_group_id !== subject?.subject_structures[0]?.subject_group_id
          )
          const newUpdate = [fintoUpdateScope[0], ...tempStructure]
          console.log('newUpdate', newUpdate)
          setCurriculumStructures(
            newUpdate.sort(
              (a, b) =>
                a.countScope - b.countScope &&
                a.subjectCategory?.subject_category_id - b.subjectCategory?.subject_category_id
            )
          )
        }
      } else if (subject?.subject_credit + totalCredit >= 25) {
        alert('this total credit is overflow (total credit must lest than 21 or equal)')
      } else if (simSubjects.find(s => s.subject_id === subject?.subject_id)) {
        alert('this subject already in simulator')
      }
    }
  }

  // useEffect(() => {
  //   console.log('CurriculumStructures', CurriculumStructures)
  // }, [CurriculumStructures])

  useEffect(() => {
    handleCheckLimitCredit(value + 1)
  }, [simSubjects])

  const handleRemoveSimSubject = subject => {
    // Filter out the subject with the given subject_id
    const updatedSimSubjects = simSubjects.filter(s => s.subject_id !== subject?.subject_id)
    // update count scope
    // console.log('subject', subject)
    if (subject?.subject_structures[0]?.subjectGroup !== undefined) {
      const finetoUpdateScope = CurriculumStructures.filter(
        scope => scope.subjectGroup?.subject_group_id === subject?.subject_structures[0]?.subjectGroup?.subject_group_id
      ).map(pre => ({
        ...pre,
        countScope:
          pre.countScope !== undefined && !isNaN(pre.countScope)
            ? pre.countScope - subject?.subject_credit
            : subject?.subject_credit
      }))
      if (finetoUpdateScope) {
        const tempStructure = CurriculumStructures.filter(
          old => old.subjectGroup?.subject_group_id !== subject?.subject_structures[0]?.subjectGroup?.subject_group_id
        )
        const newUpdate = [finetoUpdateScope[0], ...tempStructure]
        // console.log('newUpdate', newUpdate)
        setCurriculumStructures(
          newUpdate.sort(
            (a, b) =>
              a.countScope - b.countScope &&
              a.subjectCategory?.subject_category_id - b.subjectCategory?.subject_category_id
          )
        )
      }

      // Update the state with the filtered array
      setSimSubjects(updatedSimSubjects)
    } else {
      const finetoUpdateScope = CurriculumStructures.filter(
        scope => scope.subjectGroup?.subject_group_id === subject?.subject_structures[0]?.subject_group_id
      ).map(pre => ({
        ...pre,
        countScope:
          pre.countScope !== undefined && !isNaN(pre.countScope)
            ? pre.countScope - subject?.subject_credit
            : subject?.subject_credit
      }))
      if (finetoUpdateScope) {
        const tempStructure = CurriculumStructures.filter(
          old => old.subjectGroup?.subject_group_id !== subject?.subject_structures[0]?.subject_group_id
        )
        const newUpdate = [finetoUpdateScope[0], ...tempStructure]
        console.log('newUpdate', newUpdate)
        setCurriculumStructures(
          newUpdate.sort(
            (a, b) =>
              a.countScope - b.countScope &&
              a.subjectCategory?.subject_category_id - b.subjectCategory?.subject_category_id
          )
        )
      }

      // Update the state with the filtered array
      setSimSubjects(updatedSimSubjects)
    }
  }

  // useEffect(() => {
  //   console.log(simSubjects)
  //   // handleUpdateScope()
  // }, [simSubjects])

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

  const [tabs, setTabs] = useState(['Term 1'])

  // for current tab value
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    handleCheckLimitCredit(newValue + 1)
    console.log('Term :', newValue + 1)
    setValue(newValue)
  }

  const [searchText, setSearchText] = useState('')

  const [jobsByResult, setJobsByResult] = useState([])

  const handleSearchChange = text => {
    setSearchText(text)
  }

  const handleAddResultSubjectList = subject => {
    // console.log('before add result', resultSubjectList)
    if (!resultSubjectList[0]) {
      // console.log('first add')
      const simResult = Array(resultSubjectList)
      simResult[0] = subject
      setResultSubjectList(simResult)
      // console.log('simResult', simResult)

      const updateSimSubjectsForSearch = simSubjectsForSearch.filter(s => s.subject_id !== subject.subject_id)
      setSimSubjectsForSearch(updateSimSubjectsForSearch)
      return
    } else {
      // console.log('more than 1 add')
      const simResult = resultSubjectList
      simResult[simResult.length] = subject
      setResultSubjectList(simResult)
      const updateSimSubjectsForSearch = simSubjectsForSearch.filter(s => s.subject_id !== subject.subject_id)
      setSimSubjectsForSearch(updateSimSubjectsForSearch)
    }
  }

  const handleRemoveResultSubjectList = subject => {
    // console.log('more than 1 add')
    const simResult = resultSubjectList.filter(rs => rs.subject_id !== subject?.subject_id)
    setResultSubjectList(simResult)
    const updateSimSubjectsForSearch = simSubjectsForSearch
    updateSimSubjectsForSearch = [{ ...subject }, ...simSubjectsForSearch]
    setSimSubjectsForSearch(updateSimSubjectsForSearch)
  }

  const handleCloseResultDialog = () => {
    setOpenResult(false)
    handleClickSearch(99)
    setTimeout(() => {
      setResultSelected(99)
      setResultSubjectList([])
    }, 300)
  }

  const handleSubmitResult = () => {
    // result type subject
    if (resultSelected === 0) {
      if (resultSubjectList?.length !== 3) {
        return
      } else {
        const subjectIdArray = resultSubjectList?.map(obj => obj.subject_id)
        console.log('array subject Id', subjectIdArray)
        if (subjectIdArray.length === 3) {
          axios
            .post(URL_SIM_RESULT_SUBJECT, { subject_id: subjectIdArray })
            .then(res => {
              if (res.data?.data?.length > 0) {
                console.log(res.data)
                setJobsByResult(res.data.data)
                setResultSelected(2)
              } else {
                console.log('no result ')
                setJobsByResult([])
                setResultSelected(2)
              }
            })
            .catch(err => {
              console.log('err from fething result type subjecrt', err)
            })
        }
      }
    }
    // result type job
    else if (resultSelected === 1) {
    }
  }

  // useEffect(() => {
  //   console.log('resultSubjectList', resultSubjectList)
  // }, [resultSubjectList])

  const handleClickSearch = reset => {
    if (reset === 99) {
      setSearchText('')
      UseSearchText('', setSubjects, setSearchText, SubjectsTemp, searchSubjectColumns)
    } else {
      setCategoriesSelected(0)
      setTypesSelected(0)
      setGroupsSelected(0)
      UseSearchText(searchText, setSubjects, setSearchText, SubjectsTemp, searchSubjectColumns)
    }
  }
  const handleClickSearchResult = reset => {
    // console.log(simSubjectsForSearch)
    if (reset === 99) {
      setSearchText('')
      UseSearchText('', setSimSubjectsForSearch, setSearchText, simSubjects, searchSubjectColumns)
    } else {
      UseSearchText(searchText, setSimSubjectsForSearch, setSearchText, simSubjects, searchSubjectColumns)
    }
  }

  const handleAddTab = () => {
    const newTabIndex = tabs.length + 1
    const newTabLabel = `Term ${newTabIndex}`
    // console.log('newTabIndex :', newTabIndex)
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
    // console.log('checkSubjectInterm', checkSubjectInterm)
    if (checkSubjectInterm.length > 0) {
      let result = window.confirm(
        'Still Have Subject In This Term ' + parseInt(indexToRemove + 1) + ' Confirm To Delete?'
      )
      if (result) {
        // update all scope in remove tab
        // const subjectsInterm = simSubjects.filter(s => s.term === indexToRemove + 1)
        const newUpdates = []
        checkSubjectInterm?.map(s => {
          // console.log(s)
          if (s?.subject_structures[0]?.subjectGroup !== undefined) {
            const finetoUpdateScope = CurriculumStructures.filter(
              scope => scope.subjectGroup?.subject_group_id === s?.subject_structures[0]?.subjectGroup?.subject_group_id
            ).map(pre => ({
              ...pre,
              // countScope: pre.countScope !== s?.subject_credit ? pre.countScope - s?.subject_credit : s?.subject_credit
              countScope: s?.subject_credit
            }))
            if (finetoUpdateScope) {
              const newUpdate = finetoUpdateScope[0]
              // console.log('newUpdate1', newUpdate)
              newUpdates.push(newUpdate)
            }
          } else {
            const finetoUpdateScope = CurriculumStructures.filter(
              scope => scope.subjectGroup?.subject_group_id === s?.subject_structures[0]?.subject_group_id
            ).map(pre => ({
              ...pre,
              // countScope: pre.countScope !== s?.subject_credit ? pre.countScope - s?.subject_credit : s?.subject_credit
              countScope: s?.subject_credit
            }))
            if (finetoUpdateScope) {
              const newUpdate = finetoUpdateScope[0]
              // console.log('newUpdate2', newUpdate)
              newUpdates.push(newUpdate)
            }
          }
        })
        // console.log('All newUpdate', newUpdates)
        // Create a map to store the sum of countScope for each curriculum_structures_v2_id in newUpdates
        const sumMap = {}

        // Count occurrences of each curriculum_structures_v2_id in newUpdates
        const occurrencesMap = {}

        // Sum countScope for each curriculum_structures_v2_id in newUpdates
        newUpdates.forEach(update => {
          const curriculumStructuresV2Id = parseInt(update.curriculum_structures_v2_id)
          // console.log('update.countScope', update.countScope)
          // Accumulate countScope for each unique curriculum_structures_v2_id
          sumMap[curriculumStructuresV2Id] = (sumMap[curriculumStructuresV2Id] || 0) + update.countScope

          // Count occurrences of each curriculum_structures_v2_id
          occurrencesMap[curriculumStructuresV2Id] = (occurrencesMap[curriculumStructuresV2Id] || 0) + 1
        })

        // Create an array with unique curriculum_structures_v2_id and set countScope to corresponding sums or keep original countScope
        const uniqueNewUpdates = Object.keys(sumMap).map(curriculumStructuresV2Id => {
          const matchingCurriculumStructure = newUpdates.find(
            structure => structure.curriculum_structures_v2_id === parseInt(curriculumStructuresV2Id)
          )

          if (matchingCurriculumStructure) {
            return {
              ...matchingCurriculumStructure,
              countScope: sumMap[curriculumStructuresV2Id]
            }
          } else {
            // Handle the case where there is no matching structure (optional)
            console.warn(
              `No matching CurriculumStructure found for curriculum_structures_v2_id ${curriculumStructuresV2Id}`
            )
            return null // or provide default values
          }
        })

        // Log the updated newUpdates array
        // console.log('Updated newUpdates array with unique curriculum_structures_v2_id:', uniqueNewUpdates)

        // Update curriculumStructures state based on uniqueNewUpdates
        const updatedCurriculumStructures = CurriculumStructures.map(item => {
          const curriculumStructuresV2Id = item.curriculum_structures_v2_id
          // console.log('curriculumStructuresV2Id', curriculumStructuresV2Id)

          // Find the corresponding entry in uniqueNewUpdates
          const uniqueUpdate = uniqueNewUpdates.find(
            update => update.curriculum_structures_v2_id === curriculumStructuresV2Id
          )
          if (uniqueUpdate) {
            // console.log('uniqueUpdate', uniqueUpdate)
            // console.log('item', item)
            // console.log(' item.countScope:', item.countScope)
            // console.log(' uniqueUpdate.countScope:', uniqueUpdate?.countScope)
            // console.log(' item.countScope - uniqueUpdate.countScope :', item.countScope - uniqueUpdate?.countScope)
          }
          // Update countScope based on the difference
          return {
            ...item,
            countScope:
              uniqueUpdate && item.countScope - uniqueUpdate.countScope > 0
                ? item.countScope - uniqueUpdate.countScope
                : uniqueUpdate && item.countScope - uniqueUpdate.countScope < 0
                ? 0
                : 0
          }
        })

        // Log the updated curriculumStructures array
        // console.log('Updated curriculumStructures array:', updatedCurriculumStructures)
        setCurriculumStructures(updatedCurriculumStructures)

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

  const SelectResultTypeDisplay = (
    <Grid container sx={{ mt: 4 }} spacing={0}>
      <Grid
        item
        xs={6}
        sx={{ pl: { xs: 2, lg: 12 }, pr: { xs: 2, lg: 6 }, display: 'flex', justifyContent: 'flex-end' }}
      >
        <Card
          onClick={() => {
            handleClickSearch(99)
            setResultSelected(0)
            setSimSubjectsForSearch(simSubjects)
          }}
          sx={{
            mt: 3,
            height: 220,
            width: 400,
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
            <Typography color={grey[600]} sx={{ mt: 2 }}>
              Subject
            </Typography>
          </Box>
        </Card>
      </Grid>
      <Grid
        item
        xs={6}
        sx={{ pr: { xs: 2, lg: 12 }, pl: { xs: 2, lg: 6 }, display: 'flex', justifyContent: 'flex-start' }}
      >
        <Card
          onClick={() => setResultSelected(1)}
          sx={{
            mt: 3,
            height: 220,
            width: 400,
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
            <Typography color={grey[600]} sx={{ mt: 2 }}>
              Job
            </Typography>
          </Box>
        </Card>
      </Grid>

      <Grid item xs={12} textAlign={'center'} sx={{ mt: 12 }}>
        <Typography color={grey[500]}>**Please Select One**</Typography>
      </Grid>
    </Grid>
  )

  const ResultSubjectDisplay = (
    <>
      <Grid container sx={{ mt: 4 }} spacing={0}>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          sx={{ paddingTop: 0, paddingRight: { xs: 0, md: 6 }, paddingLeft: { xs: 0, md: 32 }, mb: { xs: 6, md: 0 } }}
        >
          {/* subject list and search bar */}
          <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
            <Box sx={{ mb: 2 }}>
              <TextSearch
                onChange={e => handleSearchChange(e.target.value)}
                onClick={() => handleClickSearchResult()}
                buttoninside={1}
                placeholder='Subject Code, Name'
              />
            </Box>
            {simSubjectsForSearch?.map(s => (
              <Card
                key={s.subject_id}
                sx={{
                  m: 1,
                  p: 2,
                  height: 60
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      my: 2.5,
                      ml: 2,
                      minWidth: { xs: 200, md: 200 },
                      maxWidth: { xs: 350, md: 650 }
                    }}
                    noWrap
                  >
                    <Typography variant='body2' sx={{ fontWeight: 'bold', mr: 2 }}>
                      {s.subject_code}
                    </Typography>
                    <Typography variant='body2' noWrap>
                      {s.subject_name_en}
                    </Typography>
                  </Box>
                  <IconButton
                    sx={{
                      cursor: resultSubjectList?.length <= 2 ? 'pointer' : 'default',
                      borderRadius: 2,
                      width: 60,
                      opacity: resultSubjectList?.length <= 2 ? 1 : 0.2
                    }}
                    onClick={() => (resultSubjectList?.length <= 2 ? handleAddResultSubjectList(s) : null)}
                  >
                    +
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          sx={{ paddingTop: 0, paddingLeft: { xs: 0, md: 6 }, paddingRight: { xs: 0, md: 32 }, mb: { xs: 6, md: 0 } }}
        >
          {/* subject is selected */}
          <Box sx={{ width: '100%', minHeight: 600, backgroundColor: grey[50], position: 'relative' }}>
            <Typography
              variant='body2'
              sx={{
                width: '100%',
                textAlign: 'center',
                p: 2,
                fontWeight: 'bold',
                backgroundColor: 'lightgray'
              }}
            >
              Subject List ({resultSubjectList?.length}/3)
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {resultSubjectList.length > 0 &&
                resultSubjectList?.map((resultSubject, index) => (
                  <Grid item xs={12} key={resultSubject.subject_id}>
                    <Card sx={{ p: 2, display: 'flex', mx: 2, position: 'relative' }}>
                      <Typography variant='h6' sx={{ p: 4.5, color: grey[500] }}>
                        {index + 1}.
                      </Typography>
                      <Box sx={{ p: 3.5, pr: 12 }}>
                        <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                          {resultSubject.subject_code}
                        </Typography>
                        <Typography variant='body2' sx={{ maxWidth: { xs: 400, md: 400 } }} noWrap>
                          {resultSubject.subject_name_en}
                        </Typography>
                        <IconButton
                          size='large'
                          color='error'
                          sx={{
                            position: 'absolute',
                            top: { xs: 8, md: 22.5 },
                            right: { xs: 15, md: 25 },
                            zIndex: 1,
                            background: 'white',
                            borderRadius: 2
                          }}
                          onClick={() => {
                            handleRemoveResultSubjectList(resultSubject)
                          }}
                        >
                          <Icon path={mdiTrashCan} size={0.8} />
                          <Typography variant='body2' color={grey[500]} sx={{ ml: 2 }}>
                            Remove
                          </Typography>
                        </IconButton>
                      </Box>
                    </Card>
                  </Grid>
                ))}
            </Grid>

            <Button
              disabled={resultSubjectList?.length <= 2}
              variant='contained'
              sx={{ width: '100%', bottom: 0, position: 'absolute' }}
              onClick={() => {
                handleSubmitResult()
              }}
            >
              Recommendation Result
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid item xs={12} textAlign={'center'} sx={{ mt: 12 }}>
        <Typography color={grey[500]}>**Please Select 3 Subjects**</Typography>
      </Grid>
    </>
  )

  const FinalResultDisplay = (
    <>
      <Grid container sx={{ mt: 4 }} spacing={0}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={3}
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ pt: 6, display: 'flex', flexDirection: 'row', mb: 8 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', fontSize: { xs: 16, md: 22 } }}>
              Simulator :
            </Typography>
            <Typography variant='h6' sx={{ ml: 2, color: 'gray', fontSize: { xs: 16, md: 22 } }}>
              SE 2566
            </Typography>
          </Box>
          <Grid container spacing={0}>
            <Grid
              item
              xs={12}
              sx={{
                backgroundColor: grey[300],
                p: 2,
                mb: 2,
                fontSize: { xs: 14, md: 22 },
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant='body2' sx={{ ml: 2 }}>
                {simSubjects?.length} Subjects
              </Typography>
              <Typography variant='body2' sx={{ ml: 2 }}>
                {simSubjects?.reduce((sum, subject) => sum + subject.subject_credit, 0)} Total Credit
              </Typography>
            </Grid>
            <Box
              sx={{
                width: '100%',
                maxHeight: { xs: 260, md: 600 },
                overflow: 'auto',
                borderRadius: 2,
                pb: 24
              }}
            >
              {tabs?.map((tabLabel, index) => (
                <Grid item xs={12} sx={{ p: 6, px: 4, backgroundColor: 'white', pb: 12 }}>
                  <Typography variant='body2' sx={{ fontWeight: 'bold', mb: 4 }}>
                    {tabLabel}
                  </Typography>
                  {simSubjects
                    .filter(filterSubject => filterSubject.term === index + 1)
                    .map((s, index2) => (
                      <Box
                        key={s.subject_id}
                        sx={{
                          width: '100%',
                          position: 'relative'
                        }}
                      >
                        {index2 === 0 && (
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex' }}>
                              <Typography sx={{ fontSize: { xs: 12, md: 14 }, minWidth: 100, color: grey[600] }}>
                                Code
                              </Typography>
                              <Typography sx={{ fontSize: { xs: 12, md: 14 }, color: grey[600] }}>Subject</Typography>
                            </Box>
                            <Typography sx={{ fontSize: { xs: 12, md: 14 }, color: grey[600] }}>Credit</Typography>
                          </Box>
                        )}
                        <Divider />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Box sx={{ display: 'flex', minWidth: { xs: 100, md: 300 } }}>
                            <Typography
                              sx={{
                                fontWeight:
                                  jobsByResult[0]?.subjects?.find(f => f.subject_id === s.subject_id) && 'bold',
                                // fontWeight: 'bold',
                                fontSize: { xs: 12, md: 14 },
                                minWidth: 100
                              }}
                            >
                              {s.subject_code}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: { xs: 12, md: 14 },
                                color: 'gray',
                                fontWeight:
                                  jobsByResult[0]?.subjects?.find(f => f.subject_id === s.subject_id) && 'bold'
                              }}
                              noWrap
                            >
                              {s.subject_name_en}
                            </Typography>
                          </Box>
                          <Typography sx={{ fontSize: { xs: 12, md: 14 }, minWidth: 20 }}>
                            {s.subject_credit}
                          </Typography>
                        </Box>
                        {index2 + 1 ===
                          simSubjects?.filter(filterSubject => filterSubject.term === index + 1).length && <Divider />}
                        {index2 + 1 ===
                          simSubjects?.filter(filterSubject => filterSubject.term === index + 1).length && (
                          <Typography
                            sx={{
                              fontSize: 14,
                              fontWeight: 'bold',
                              position: 'absolute',
                              bottom: -30,
                              right: 10
                            }}
                          >
                            {simSubjects
                              ?.filter(filterSubject => filterSubject.term === index + 1)
                              .reduce((sum, subject) => sum + subject.subject_credit, 0)}
                          </Typography>
                        )}
                        {index2 + 1 ===
                          simSubjects?.filter(filterSubject => filterSubject.term === index + 1).length && (
                          <Divider absolute={true} sx={{ bottom: -45 }} />
                        )}
                      </Box>
                    ))}
                </Grid>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Grid
          item
          container
          xs={12}
          sm={12}
          md={12}
          lg={9}
          sx={{ p: { xs: 0, md: 0, lg: 16 }, pt: { xs: 24, md: 24 }, display: 'flex', justifyContent: 'flex-start' }}
          spacing={0}
        >
          {/* job1 section */}
          {jobsByResult?.map((job, index) =>
            index === 0 ? (
              <Grid key={job.job_position_id} item xs={12} sx={{ mt: index !== 0 && 6 }}>
                <Typography variant={'body2'}>ตำแหน่งงานแนะนำ</Typography>
                <Divider />
                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                  {job.job_position_name}
                </Typography>
                <Typography variant='caption'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.
                </Typography>
                <Grid container item xs={12} sx={{ mt: 3.5 }} spacing={6}>
                  {job?.subjects?.map(subject => (
                    <Grid key={subject.subject_id} item xs={6} md={4} lg={3}>
                      <Card
                        sx={{
                          height: 65,
                          background: 'white',
                          border: simSubjects?.find(s => s.subject_id === subject.subject_id) ? 1 : 0
                        }}
                      >
                        <Box
                          sx={{
                            height: 30,
                            background: 'lightgray',
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
                              color: 'gray',
                              display: 'inline' // Ensure inline display
                            }}
                          >
                            {subject.subject_code}
                          </Typography>
                        </Box>
                        <Box
                          // onClick={() => handleOpenDetails(value)}
                          sx={{
                            height: 35,
                            ml: 1.5,
                            p: 1,
                            display: 'flex',
                            direction: 'column',
                            cursor: 'pointer'
                          }}
                        >
                          <Typography variant='body2' noWrap>
                            {/* Subject ................................................................... */}
                            {subject.subject_name_en}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            ) : (
              <Grid key={job.job_position_id} item xs={12} sx={{ mt: index !== 0 && 6 }}>
                {index === 1 && <Typography variant={'body2'}> ตำแหน่งงานที่เกี่ยวข้อง</Typography>}
                <Divider />
                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                  {job.job_position_name}
                </Typography>
                <Typography variant='caption'>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.
                </Typography>
                <Grid container item xs={12} sx={{ mt: 3.5 }} spacing={6}>
                  {job?.subjects?.map(subject => (
                    <Grid key={subject.subject_id} item xs={6} md={4} lg={3}>
                      <Card
                        sx={{
                          height: 65,
                          background: 'white',
                          border: simSubjects?.find(s => s.subject_id === subject.subject_id) ? 1 : 0
                        }}
                      >
                        <Box
                          sx={{
                            height: 30,
                            background: 'lightgray',
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
                              color: 'gray',
                              display: 'inline' // Ensure inline display
                            }}
                          >
                            {subject.subject_code}
                          </Typography>
                        </Box>
                        <Box
                          // onClick={() => handleOpenDetails(value)}
                          sx={{
                            height: 35,
                            ml: 1.5,
                            p: 1,
                            display: 'flex',
                            direction: 'column',
                            cursor: 'pointer'
                          }}
                        >
                          <Typography variant='body2' noWrap>
                            {/* Subject ................................................................... */}
                            {subject.subject_name_en}
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )
          )}
          {jobsByResult?.length === 0 && (
            <Box sx={{ width: '100%', mb: 6 }}>
              <Typography variant='body2' sx={{ fontWeight: 'bold' }}>
                ไม่มีตำแหน่งงานแนะนำจากรายวิชาที่เกี่ยวข้อง
              </Typography>
              <Divider />
            </Box>
          )}
          {/* project section */}
          <Grid item xs={12} sx={{ mt: jobsByResult?.length !== 0 && 12 }}>
            <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
              Project Related
            </Typography>
            <Grid container item xs={12} sx={{ mt: 2 }} spacing={6}>
              {Array.from({ length: 6 }, (_, index) => (
                <Grid key={index} item xs={12} md={6} lg={6}>
                  <Card sx={{ height: 200, background: 'white' }}>
                    <Box
                      sx={{
                        height: 30,
                        background: 'lightgray',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    ></Box>
                    <Box
                      // onClick={() => handleOpenDetails(value)}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          backgroundColor: grey[200],
                          p: 2,
                          pl: 1.5
                        }}
                      >
                        <Typography
                          variant='body2'
                          sx={{
                            maxWidth: 300,
                            ml: 1.5,
                            fontWeight: 'bold',
                            color: 'gray',
                            display: 'inline' // Ensure inline display
                          }}
                          noWrap
                        >
                          Project Name Project Name Project Name
                        </Typography>
                        <Typography
                          variant='caption'
                          sx={{
                            minWidth: 80,
                            color: 'gray',
                            display: 'inline' // Ensure inline display
                          }}
                        >
                          2023-07-16
                        </Typography>
                      </Box>
                      <Box sx={{ m: 2, ml: 1.5, p: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='caption' sx={{ display: 'inline', fontWeight: 'bold' }}>
                          ENGCEXX
                          <Typography variant='caption' sx={{ display: 'inline', ml: 6 }}>
                            Subject Name...........................
                          </Typography>
                        </Typography>

                        <Typography variant='caption' sx={{ display: 'inline', fontWeight: 'bold' }}>
                          ENGCEXX
                          <Typography variant='caption' sx={{ display: 'inline', ml: 6 }}>
                            Subject Name...........................
                          </Typography>
                        </Typography>
                      </Box>
                      <Button
                        variant={'contained'}
                        sx={{
                          mx: 24,
                          mt: 2,
                          letterSpacing: 2,
                          fontSize: 12,
                          backgroundColor: 'black'
                        }}
                      >
                        Details
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )

  // const ResultJobDisplay = ();

  useEffect(() => {
    if (!SubjectsLoading) {
      setSubjectsTemp(Subjects)
      // console.log('Subjects', Subjects)

      // Use Set to store unique values
      const uniqueCategories = new Set()
      const uniqueTypes = new Set()
      const uniqueGroups = new Set()

      const subjectStructure = Subjects?.map(v => v.subject_structures)

      // console.log('subjectStructure', subjectStructure)

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

      // console.log('Unique Subject Categories:', uniqueCategoriesArray)
      // console.log('Unique Subject Types:', uniqueTypesArray)
      // console.log('Unique Subject Groups:', uniqueGroupsArray)
    } else {
      return
    }
  }, [SubjectsLoading, SubjectsTemp])

  return (
    <>
      {/* <Hidden smDown> */}
      <Grid container sx={{ m: { xs: 0, lg: 2 }, p: { xs: 6, lg: 0 } }} spacing={2}>
        <Grid container item xs={12} sm={12} md={6} lg={7} sx={{ height: { sm: 800, lg: '100%' } }} spacing={6}>
          {/* Filter */}
          <Grid item xs={12} sm={12} md={6} lg={8} sx={{ px: { xs: 6, sm: 6, lg: 2 } }}>
            <TextSearch
              onChange={e => handleSearchChange(e.target.value)}
              onClick={() => handleClickSearch()}
              buttoninside={1}
              placeholder='Subject Code, Name'
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={4}>
            {/* Pagination */}
            <TablePagination
              rowsPerPageOptions={[]}
              component='div'
              size='small'
              count={
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
                ).length
              }
              rowsPerPage={24}
              page={page}
              onPageChange={handleChangePage}
            />
          </Grid>
          <Grid container item xs={12} sm={12} lg={8} spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={4}>
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
            <Grid item xs={12} sm={12} md={12} lg={4}>
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
            <Grid item xs={12} sm={12} md={12} lg={4}>
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
            <Box sx={{ height: { xs: 300, sm: 400, lg: 600 }, mt: 6, overflow: 'auto' }}>
              <Grid container spacing={6} sx={{ p: 2 }}>
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
                      <Grid item xs={12} sm={12} md={6} lg={4} key={value.subject_id}>
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
        <Grid item xs={12} sm={12} md={6} lg={5}>
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
                Simulator :
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
                            index === tabs.length - 1 &&
                            index !== 0 && ( // Only show IconButton for tabs other than the first one
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

                  <Box sx={{ m: { xs: 0, lg: 2 }, width: '100%', minHeight: 600 }}>
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
                              height: { xs: 100, sm: 60 },
                              display: 'flex',
                              p: { xs: 2, sm: 3.5 },
                              pt: { xs: 8, sm: 3.5 },
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

                            <Typography
                              variant='caption'
                              sx={{ width: { xs: 60, sm: 60, md: 60, lg: 100 }, m: 2, fontWeight: 'bold' }}
                            >
                              {subjectInterm.subject_code}
                            </Typography>

                            <Typography
                              variant='caption'
                              sx={{ maxWidth: { xs: 300, sm: 600, md: 200, lg: 300 }, m: 2 }}
                              noWrap
                            >
                              {subjectInterm.subject_name_en}
                            </Typography>
                            <Typography
                              sx={{
                                position: 'absolute',
                                right: 0,
                                m: 2,
                                mr: { sm: 12, md: 12, lg: 6 },
                                fontWeight: 'bold',
                                minWidth: 20
                              }}
                              variant='caption'
                            >
                              {subjectInterm.subject_credit}
                            </Typography>

                            <IconButton
                              size='small'
                              color='error'
                              sx={{
                                position: 'absolute',
                                top: 6,
                                right: 8,
                                zIndex: 1,
                                opacity: isHovered[index] ? 0.9 : 0, // Show or hide based on hover state
                                transition: 'opacity 0.3s ease'
                              }}
                              onClick={() => {
                                // Add your remove logic here
                                handleRemoveSimSubject(subjectInterm)
                              }}
                            >
                              <Icon path={mdiTrashCan} size={0.7} />
                            </IconButton>
                          </Box>
                        ))}
                    {displayScope && (
                      <Grid item xs={12}>
                        <Box sx={{ width: '100%', textAlign: 'end' }}>
                          <Typography sx={{ mr: { xs: 6, sm: 6, lg: 2 } }} variant='body2'>
                            Credit
                          </Typography>
                        </Box>
                        <Box sx={{ width: '100%', px: 4 }}>
                          {UniqueCategories.map(categoryHeader => (
                            <Box key={categoryHeader} maxWidth={{ sm: 1200, lg: 600 }} sx={{ mb: 3 }}>
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
                                    <Typography variant='body2' sx={{ display: 'inline' }}>
                                      {categoryHasCreditResult.countScope > categoryHasCreditResult?.credit_total && (
                                        <Typography variant='body2' color={'error'} sx={{ display: 'inline', mr: 2 }}>
                                          (overflow)
                                        </Typography>
                                      )}
                                      {categoryHasCreditResult.countScope
                                        ? categoryHasCreditResult.countScope +
                                          ' of ' +
                                          categoryHasCreditResult?.credit_total
                                        : '0 of ' + categoryHasCreditResult?.credit_total}
                                    </Typography>
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
                                      <Typography variant='body2' display='inline'>
                                        {case1Result.countScope > case1Result.credit_total && (
                                          <Typography variant='body2' color={'error'} sx={{ display: 'inline', mr: 2 }}>
                                            (overflow)
                                          </Typography>
                                        )}
                                        {/* {'0' + ' of ' + case1Result.credit_total} */}
                                        {case1Result.countScope
                                          ? case1Result.countScope + ' of ' + case1Result?.credit_total
                                          : '0 of ' + case1Result?.credit_total}
                                      </Typography>
                                    </Box>
                                  ) : (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mx: 2 }}>
                                      <Typography variant='body2'>
                                        {case1Result.subjectGroup?.subject_group_name}
                                      </Typography>
                                      <Typography variant='body2' display='inline'>
                                        {case1Result.countScope > case1Result.credit_total && (
                                          <Typography variant='body2' color={'error'} sx={{ display: 'inline', mr: 2 }}>
                                            (overflow)
                                          </Typography>
                                        )}

                                        {case1Result.countScope
                                          ? case1Result.countScope + ' of ' + case1Result?.credit_total
                                          : '0 of ' + case1Result?.credit_total}
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
                                        <Typography variant='body1' display='inline'>
                                          {case2Result.countScope > case2Result.credit_total && (
                                            <Typography
                                              variant='body2'
                                              color={'error'}
                                              sx={{ display: 'inline', mr: 2 }}
                                            >
                                              (overflow)
                                            </Typography>
                                          )}

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
            {/* <Button
                disabled={simSubjects?.length === 0}
                onClick={() => {
                  setResultSelected(2)
                  setTimeout(() => {
                    setOpenResult(true)
                  }, 100)
                }}
                variant='contained'
                sx={{ width: '100%', mb: 2 }}
              >
                Open test
              </Button> */}
            <Button variant='contained' sx={{ width: '100%' }} onClick={handleOpenResult}>
              Simulation Results
            </Button>
          </Box>
        </Grid>
      </Grid>
      {/* </Hidden> */}
      {/* <Hidden smUp>
        <Box sx={{ height: '100vh', width: '100%', background: 'gray' }}>
          <Typography>Not Support Too Small Screen</Typography>
        </Box>
      </Hidden> */}
      {/* <Hidden smDown> */}
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
                      ? SubjectsRelations[0]?.parent?.subject_code + ' ' + SubjectsRelations[0]?.parent?.subject_name_en
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
                    <Grid key={item} item xs={12} sm={12} md={6} lg={4}>
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
          handleCloseResultDialog()
        }}
        fullWidth
        fullScreen
        maxWidth={resultSelected === 99 ? 'md' : resultSelected === 0 ? 'lg' : 'lg'}
      >
        <DialogTitle
          sx={{
            height: 70,
            width: '100%',
            background: 'lightgray',
            pr: 6,
            borderBottom: 1,
            borderColor: grey[500],
            position: 'relative'
          }}
        >
          {resultSelected !== 2 && (
            <Typography sx={{ pt: 2, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
              {resultSelected === 99
                ? 'What Do You Pay Attention To? '
                : resultSelected === 0
                ? 'Subjects You Pay Attention'
                : resultSelected === 1
                ? 'Job You Pay Attention'
                : null}
            </Typography>
          )}
          <IconButton
            sx={{
              p: 0,
              color: grey[700],
              borderRadius: 1,
              m: 1,
              ml: 6,
              fontSize: 16,
              p: 2,
              position: 'absolute',
              right: resultSelected !== 2 ? 18 : null,
              left: resultSelected === 2 ? 18 : null,
              top: 12
            }}
            onClick={() => {
              handleCloseResultDialog()
            }}
          >
            {resultSelected !== 2 && <Icon path={mdiClose} size={1} />}
            {resultSelected === 2 && <Icon path={mdiChevronLeft} size={1.1} />}
            {resultSelected === 2 && 'Back To Simulator'}
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ minHeight: 400, background: grey[200], p: 10 }}>
          {resultSelected === 99 && SelectResultTypeDisplay}
          {/* choose subject */}
          {resultSelected === 0 && ResultSubjectDisplay}
          {/* choose job */}
          {resultSelected === 1 && (
            <Grid container sx={{ mt: 4 }} spacing={0}>
              <Grid item xs={6} sx={{ pl: 12, pr: 6 }}>
                test job
              </Grid>
            </Grid>
          )}
          {resultSelected === 2 && FinalResultDisplay}
        </DialogContent>
      </Dialog>
      {/* </Hidden> */}
    </>
  )
}
StudyPlanSimulatorPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default StudyPlanSimulatorPage
