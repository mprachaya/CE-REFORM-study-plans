import {
  Dialog,
  Typography,
  DialogContent,
  Grid,
  TextField,
  DialogActions,
  Box,
  Button,
  InputAdornment,
  List,
  ListItem,
  DialogTitle,
  DialogContentText
} from '@mui/material'
import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { CircleLoading } from 'src/components'
import SnackbarStyled from 'src/components/SnackbarStyled'
import { url } from 'src/configs/urlConfig'
import { useFetch } from 'src/hooks'
// import Selection from 'src/components/Selection'
// import { handleChangeEN, handleChangeNumber, handleChangeTH } from 'src/hooks/useValidation'

function AddContinueSubjects({ open, handleClose, subject, subjects, setSubjects }) {
  // const [competencieName, setCompetencieName] = useState('')
  // const [competencieSubName, setCompetencieSubName] = useState([])
  // const [competencieSubName, setCompetencieSubName] = useState('')
  // const [subjectSelection, setsubjectSelection] = useState(subject.subject_id)
  // const [delay, setDelay] = useState(false)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [snackMassage, setSnackMassage] = useState('')
  // const [openDescription, setOpenDescription] = useState(false)

  // const [mainRow, setMainRow] = useState([])
  // const [subRow, setSubRow] = useState([])

  // const URL_GET_SUBJECT_COMPETENCIES_BY_ID = `${url.BASE_URL}/subjects/${subject.subject_id}`
  // const URL_GET_MAIN_COMPETENCIES = `${url.BASE_URL}/competencies/`
  // const URL_SUB_COMPETENCIES = `${url.BASE_URL}/competency-subs/`

  // const {
  //   error: CompetenciesError,
  //   data: Competencies,
  //   setData: setCompetencies,
  //   reFetch: reFetchCompetencies,
  //   loading: CompetenciesLoading
  // } = useFetch(URL_GET_SUBJECT_COMPETENCIES_BY_ID)

  // const [MainBySubject, setMainBySubject] = useState([])
  // const [CompetenciesTemp, setCompetencyTemp] = useState([])

  // useEffect(() => {
  //   if (!CompetenciesLoading) {
  //     console.log('Competencies', Competencies)
  //     setCompetencyTemp(Competencies)
  //   }
  // }, [CompetenciesLoading])

  // useEffect(() => {
  //   if (CompetenciesTemp) {
  //     const DetectMainCom = CompetenciesTemp.competencies?.length
  //     if (DetectMainCom > 0) {
  //       // console.log('DetectMainCom', DetectMainCom)
  //       // const newArraySubName = Array.from(DetectMainCom, (_, i) => ({ index: i, subName: '' }))
  //       const newArraySubName = Object.values(CompetenciesTemp.competencies)?.map((data, i) => ({
  //         index: i,
  //         subName: ''
  //       }))
  //       setCompetencieSubName(newArraySubName)
  //       // console.log(newArraySubName)
  //     }
  //   }
  // }, [CompetenciesTemp])

  // useEffect(()=>{
  //   if(CompetenciesTemp){
  //     const newNameArray = Competencies.competencies?.map((data) => )
  //     setCompetencieSubName()
  //   }
  // },[CompetenciesTemp])

  // const updateComSubjects = com => {
  //   let obj = subject
  //   if (obj) {
  //     const removeById = subjects.filter(data => {
  //       return data.subject_id !== obj.subject_id
  //     })
  //     obj.competencies = com
  //     const mainTemp = [...removeById, obj]
  //     setSubjects(mainTemp)
  //   }
  // }

  // const submitMain = comName => {
  //   let obj = {
  //     competency_id: 0,
  //     competency_name: comName,
  //     competency_sub: []
  //   }
  //   axios
  //     .post(URL_GET_MAIN_COMPETENCIES, { subject_id: subject.subject_id, competency_name: comName })
  //     .then(res => {
  //       obj.competency_id = res.data.data.competency_id
  //       const mainTemp = [...CompetenciesTemp.competencies, obj]
  //       console.log(mainTemp)
  //       updateComSubjects(mainTemp)
  //       setCompetencyTemp(pre => ({ ...pre, competencies: [...CompetenciesTemp.competencies, obj] }))
  //       setSnackMassage('Insert Success!')
  //     })
  //     .catch(err => setSnackMassage(err))
  //     .finally(() => {
  //       setOpenSnackbar(true)
  //       setCompetencieName('')
  //     })
  // }
  // const submitSub = (mainId, comName) => {
  //   if (mainId && comName) {
  //     let obj = {
  //       competency_sub_id: 0,
  //       competency_id: mainId,
  //       competency_sub_name: comName,
  //       competency_sub_description: null
  //     }
  //     axios
  //       .post(URL_SUB_COMPETENCIES, {
  //         competency_id: mainId,
  //         competency_sub_name: comName,
  //         competency_sub_description: null
  //       })
  //       .then(res => {
  //         obj.competency_sub_id = res.data.data.competency_sub_id
  //         const findMainById = CompetenciesTemp.competencies?.filter(data => {
  //           return data.competency_id === mainId
  //         })
  //         findMainById[0].competency_sub = [...findMainById[0].competency_sub, obj]

  //         setSnackMassage('Insert Success!')
  //       })
  //       .catch(err => setSnackMassage(err))
  //       .finally(() => {
  //         setOpenSnackbar(true)

  //         const DetectMainCom = CompetenciesTemp.competencies?.length
  //         if (DetectMainCom > 0) {
  //           // console.log('DetectMainCom', DetectMainCom)
  //           // const newArraySubName = Array.from(DetectMainCom, (_, i) => ({ index: i, subName: '' }))
  //           const newArraySubName = Object.values(CompetenciesTemp.competencies)?.map((data, i) => ({
  //             index: i,
  //             subName: ''
  //           }))
  //           setCompetencieSubName(newArraySubName)
  //           // console.log(newArraySubName)
  //         }
  //         // setCompetencieSubName(clearSubName)
  //       })
  //   }
  // }
  // const deleteMain = id => {
  //   let result = window.confirm('Confirm to Delete?')
  //   if (result) {
  //     axios
  //       .delete(URL_GET_MAIN_COMPETENCIES + id)
  //       .then(res => {
  //         setSnackMassage('Delete Success!')
  //         const obj = CompetenciesTemp.competencies
  //         const removeById = obj.filter(data => {
  //           return data.competency_id !== id
  //         })
  //         setCompetencyTemp(pre => ({ ...pre, competencies: removeById }))
  //         updateComSubjects(removeById)
  //       })
  //       .catch(err => setSnackMassage(err))
  //       .finally(() => {
  //         setOpenSnackbar(true)
  //       })
  //   } else {
  //   }
  // }

  // const deleteSub = (mainId, subId) => {
  //   let result = window.confirm('Confirm to Delete?')
  //   // if (result) {
  //   //   const obj = CompetenciesTemp.competencies?.filter(mData => mData.competency_id === mainId)
  //   //   const removeSubById = obj[0].competency_sub?.filter(data => {
  //   //     return data.competency_sub_id !== subId
  //   //   })
  //   //   // console.log('obj', obj[0])
  //   //   // console.log('removeSubById', removeSubById)
  //   //   obj[0].competency_sub = removeSubById
  //   //   const preCompetencies = CompetenciesTemp.competencies?.filter(pData => pData.competency_id !== mainId)
  //   //   const updateObj = [...preCompetencies, obj[0]]
  //   //   // console.log(obj)
  //   //   console.log(updateObj)
  //   //   setCompetencyTemp(pre => ({
  //   //     ...pre,
  //   //     competencies: updateObj.sort((a, b) => (a.competency_id > b.competency_id ? 1 : -1))
  //   //   }))
  //   //   // updateComSubjects(removeById)
  //   // }
  //   if (result) {
  //     axios
  //       .delete(URL_SUB_COMPETENCIES + subId)
  //       .then(res => {
  //         setSnackMassage('Delete Success!')
  //         const obj = CompetenciesTemp.competencies?.filter(mData => mData.competency_id === mainId)
  //         const removeSubById = obj[0].competency_sub?.filter(data => {
  //           return data.competency_sub_id !== subId
  //         })
  //         // console.log('obj', obj[0])
  //         // console.log('removeSubById', removeSubById)
  //         obj[0].competency_sub = removeSubById
  //         const preCompetencies = CompetenciesTemp.competencies?.filter(pData => pData.competency_id !== mainId)
  //         const updateObj = [...preCompetencies, obj[0]]
  //         // console.log(obj)
  //         console.log(updateObj)
  //         setCompetencyTemp(pre => ({
  //           ...pre,
  //           competencies: updateObj.sort((a, b) => (a.competency_id > b.competency_id ? 1 : -1))
  //         }))
  //       })
  //       .catch(err => setSnackMassage(err))
  //       .finally(() => {
  //         setOpenSnackbar(true)
  //       })
  //   }
  // }

  // const handleOpenSubDesc = (mainRow, subRow) => {
  //   setOpenDescription(true)
  //   setMainRow(mainRow)
  //   setSubRow(subRow)
  // }

  // const updateSubDesc = () => {
  //   // console.log(tempObj)

  //   axios
  //     .put(URL_SUB_COMPETENCIES + subRow.competency_sub_id, {
  //       competency_sub_name: subRow?.competency_sub_name,
  //       competency_sub_description: subRow?.competency_sub_description
  //     })
  //     .then(res => {
  //       // console.log(res.data)
  //       if (res.data.status !== 404) {
  //         const tempObj = mainRow
  //         const mainObj = CompetenciesTemp.competencies?.filter(m => m.competency_id !== mainRow.competency_id)
  //         const removeSub = tempObj.competency_sub?.filter(sub => sub.competency_sub_id !== subRow.competency_sub_id)
  //         tempObj.competency_sub = [...removeSub, subRow]
  //         console.log(tempObj)
  //         // updateComSubjects([...mainObj, tempObj])
  //         setSnackMassage('Insert Success!')
  //       }
  //     })
  //     .catch(err => setSnackMassage(err))
  //     .finally(() => {
  //       setOpenSnackbar(true)
  //       setOpenDescription(false)
  //       // setSubRow([])
  //     })
  // }

  // // for main competencies
  // const updateById = (e, id) => {
  //   const findById = CompetenciesTemp.competencies.filter(data => {
  //     return data.competency_id === id
  //   })
  //   findById[0].competency_name = e.target.value

  //   const sortState = findById.sort((a, b) => (a.competency_id > b.competency_id ? 1 : -1))
  //   setCompetencyTemp(pre => ({ ...pre, sortState }))
  // }
  // // for sub competencies
  // const updateSubById = (e, mainId, subId) => {
  //   const findMainById = CompetenciesTemp.competencies?.filter(data => {
  //     return data.competency_id === mainId
  //   })
  //   const findSubById = findMainById[0].competency_sub?.filter(data => {
  //     return data.competency_sub_id === subId
  //   })

  //   // console.log('main', findMainById)
  //   // console.log('sub', findSubById)
  //   findSubById[0].competency_sub_name = e.target.value
  //   // console.log(findSubById[0])
  //   const sortState = findSubById.sort((a, b) => (a.competency_sub_id > b.competency_sub_id ? 1 : -1))
  //   setCompetencyTemp(pre => ({ ...pre, sortState }))
  // }

  // const confirmUpdateMain = (id, value) => {
  //   if (value !== '') {
  //     axios
  //       .put(URL_GET_MAIN_COMPETENCIES + id, { competency_name: value })
  //       .then(res => setSnackMassage('Update Success'))
  //       .catch(err => setSnackMassage(err))
  //       .finally(() => {
  //         setOpenSnackbar(true)
  //         // reFetchCom()
  //       })
  //   } else {
  //     alert('Value can not be null')
  //   }
  // }
  // const confirmUpdateSub = (id, name, description) => {
  //   if (name !== '') {
  //     axios
  //       .put(URL_SUB_COMPETENCIES + id, { competency_sub_name: name, competency_sub_description: description })
  //       .then(res => setSnackMassage('Update Success'))
  //       .catch(err => setSnackMassage(err))
  //       .finally(() => {
  //         setOpenSnackbar(true)
  //         // reFetchCom()
  //       })
  //   } else {
  //     alert('Value can not be null')
  //   }
  // }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'lg'} fullWidth>
      <DialogContent sx={{ minHeight: 450 }}>
        {/* {CompetenciesLoading ? (
          <Box sx={{ width: '100%', height: '100%', mt: 12 }}>
            <CircleLoading />
          </Box>
        ) : ( */}
        <React.Fragment>
          <DialogContent></DialogContent>
        </React.Fragment>
        {/* )} */}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Cancel
        </Button>
        {/* <Button onClick={() => !checkIsEmpty(state) && handleSubmit(state)}>Submit</Button> */}
        {/* <Button onClick={() => !checkIsEmpty(state) && handleSubmit(state)}>Submit</Button> */}
      </DialogActions>
      {/* <SnackbarStyled open={openSnackbar} handleClose={() => setOpenSnackbar(false)} massage={snackMassage} /> */}
      {/* <Dialog open={openDescription} onClose={() => setOpenDescription(false)} fullWidth maxWidth='md'>
        <DialogTitle id='alert-dialog-title'>{'Description'}</DialogTitle> */}
      {/* <DialogContent> */}
      {/* <DialogContentText>test</DialogContentText> */}
      {/* <TextField
            multiline
            rows={4}
            fullWidth
            value={subRow.competency_sub_description || ''}
            onChange={e => setSubRow(pre => ({ ...pre, competency_sub_description: e.target.value }))}
          /> */}
      {/* </DialogContent> */}
      {/* <DialogActions>
          <Button
            onClick={() => {
              // setOpenDescription(false)
              // setSnackMassage('test')
              // setOpenSnackbar(true)
              subRow.competency_sub_description !== '' && updateSubDesc()
            }}
          >
            Update
          </Button>
          <Button onClick={() => setOpenDescription(false)} autoFocus>
            Close
          </Button>
        </DialogActions> */}
      {/* </Dialog> */}
    </Dialog>
  )
}

export default AddContinueSubjects
