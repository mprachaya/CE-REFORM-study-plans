import React, { useEffect, useState } from 'react'

import { Btn, CircleLoading, Selection, TextSearch } from 'src/components'
import { Box, Grid, Hidden, Typography, alpha, MenuItem } from '@mui/material'

import { ChevronRight, ChevronDown } from 'mdi-material-ui'
import { TreeItem, TreeView } from '@mui/x-tree-view'
import { url } from 'src/configs/urlConfig'
import { useFetch } from 'src/hooks'

const curriculumtree = () => {
  const URL_GETALL_CONTINUE_SUBJECTS = `${url.BASE_URL}/continue-subjects-curriculum/`
  const URL_GET_CURRICULUM = `${url.BASE_URL}/curriculums/`

  const {
    error: CurriculumError,
    data: Curriculums,
    setData: setCurriculums,
    loading: CurriculumLoading,
    reFetch: reFetchCurriculums
  } = useFetch(URL_GET_CURRICULUM)

  const [curriculumSelected, setCurriculumSelected] = useState(0)

  const {
    error: ContinueSubjectsError,
    data: ContinueSubjects,
    setData: setContinueSubjects,
    loading: ContinueSubjectsLoading,
    reFetch: reFetchContinueSubjects
  } = useFetch(URL_GETALL_CONTINUE_SUBJECTS + curriculumSelected)

  const [expandedNodes, setExpandedNodes] = useState([])

  const recursionContinueSubjects = nodes => {
    return (
      <TreeItem
        sx={{
          mb: 2,
          ml: nodes?.level !== 1 && { xs: 1, sm: 1, lg: 12 },
          ['& .MuiTreeItem-content']: {
            border: 1,
            borderRadius: 1,
            borderColor: alpha('#000', 0.3),
            paddingX: { xs: 2, sm: 2, lg: 6 },
            marginBottom: 2
          },
          ['& .MuiTreeItem-label']: { marginX: 2, marginY: 0, padding: 2 }
        }}
        key={String(nodes?.continue_subject_id)}
        nodeId={String(nodes?.continue_subject_id)}
        label={
          <Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
              <Typography
                variant='body1'
                sx={{
                  fontWeight: 'bold',
                  mr: 1,
                  fontSize: { xs: 12, sm: 12, lg: 14 },
                  lineHeight: 1
                }}
              >
                {nodes?.subjects?.subject_code}
              </Typography>
              <Typography sx={{ fontSize: { xs: 12, sm: 12, lg: 14 }, letterSpacing: 0.5, lineHeight: 1 }}>
                Level:{nodes?.level}
              </Typography>
            </Box>
            <Hidden lgUp>
              <Typography variant='caption' sx={{ lineHeight: 0 }}>
                {nodes?.subjects?.subject_name_th}
              </Typography>
            </Hidden>
            <Hidden lgDown sx={{ lineHeight: 1 }}>
              <Typography variant='body2'>{nodes?.subjects?.subject_name_th}</Typography>
            </Hidden>
          </Typography>
        }
      >
        {nodes.children ? Object.values(nodes?.children).map(node => recursionContinueSubjects(node)) : null}
      </TreeItem>
    )
  }

  useEffect(() => {
    if (Curriculums.length > 0) {
      const findMaxId = Curriculums?.reduce(
        (max, current) => (current.curriculum_id > max.curriculum_id ? current : max),
        Curriculums[0]
      )
      // console.log(findMaxId)
      setCurriculumSelected(findMaxId.curriculum_id)
    }
  }, [Curriculums])

  useEffect(() => {
    if (ContinueSubjects) {
      const dummy = []
      const getNodeID = recursionGetNodeID(dummy, ContinueSubjects)
      setExpandedNodes(...getNodeID)
      console.log(...getNodeID)
      // console.log(...getNodeID)
    }
  }, [ContinueSubjects])

  useEffect(() => {
    if (curriculumSelected) {
      // setCurriculumLoading(true)
      reFetchContinueSubjects()
    }
  }, [curriculumSelected])

  const recursionGetNodeID = (store, nodes) => {
    return Object.values(nodes)?.map(item => {
      store.push(String(item?.continue_subject_id))

      if (item.children && item.children.length > 0) {
        recursionGetNodeID(store, item.children)
      }
      return store
    })
  }
  // if (ContinueSubjectsLoading) {
  //   return (
  //     <Box sx={{ height: 120, m: 12 }}>
  //       <CircleLoading />
  //     </Box>
  //   )
  // }

  return (
    <Box>
      <Box display={'flex'} flexDirection={'row'}>
        <Typography variant='h6' sx={{ mr: 2 }}>
          Curriculum Tree
        </Typography>
        <Selection
          label={'Curriculum'}
          height={40}
          width={270}
          // firstItemText={'แสดงทั้งหมด'}
          selectionValue={curriculumSelected}
          handleChange={e => setCurriculumSelected(e.target.value)}
          Items={Object.values(Curriculums)?.map(curri => (
            <MenuItem key={curri.curriculum_id} value={curri.curriculum_id}>
              {curri.curriculum_name_th + ' ' + curri.curriculum_year}
            </MenuItem>
          ))}
        />
      </Box>
      {ContinueSubjectsLoading || curriculumSelected === 0 ? (
        <Box sx={{ height: 120, m: 12 }}>
          <CircleLoading />
        </Box>
      ) : ContinueSubjects.length > 0 && curriculumSelected !== 0 ? (
        <>
          <Grid container spacing={6} sx={{ mt: 5 }}></Grid>
          <Grid item xs={12} sx={{ m: 2 }}>
            {expandedNodes && (
              <TreeView
                expanded={expandedNodes} // expand node by nodeId
                defaultCollapseIcon={<ChevronDown />}
                defaultExpandIcon={<ChevronRight />}
                sx={{ flexGrow: 1, overflowY: 'auto', maxWidth: 700 }}
              >
                {ContinueSubjects?.length !== 0 &&
                  Object.values(ContinueSubjects).map(nodes => recursionContinueSubjects(nodes))}
              </TreeView>
            )}
          </Grid>
        </>
      ) : (
        <Typography sx={{ mt: 6 }}>this curriculum have no continue subject</Typography>
      )}
      {/* <Grid container>
        <Grid item xs={12} sm={12} lg={12} mt={6}>
          {STUDENT_GROUPS.length !== 0 || !StudentGroupsLoading ? (
            <DataGridTable rows={STUDENT_GROUPS} columns={columns} uniqueKey={'collegian_group_id'} />
          ) : (
            <Typography>ยังไม่มีข้อมูลกลุ่มนักศึกษาอยู่ในระบบ</Typography>
          )}
        </Grid>
      </Grid>
      <Grid container>
        <AddStudentGroupsModal open={open} handleClose={handleClose} handleSubmit={handleSubmit} />
      </Grid>

      <Grid container>
        <EditStudentGroupModal
          state={editState}
          open={openEdit}
          handleClose={handleCloseEdit}
          handleUpdate={handleUpdate}
          openConfirmDelete={handleOpenConfirmDelete}
        />
      </Grid>

      <Grid container>
        <ConfirmModal
          title={`DELETE Student Groups`}
          text={`Are you sure you want to delete ${editState.collegian_group_name_th}?`}
          displayIcon={mdiAlertRhombus}
          submitLabel={'DELETE'}
          open={openConfirmDelete}
          handleClose={handleCloseConfirmDelete}
          handleSubmit={handleDelete}
        />
      </Grid> */}
    </Box>
  )
}

export default curriculumtree
