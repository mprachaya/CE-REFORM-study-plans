import React, { useEffect, useState } from 'react'

import { Btn, CircleLoading, Selection, TextSearch } from 'src/components'
import { Box, Grid, Hidden, Typography, alpha, MenuItem, Popper } from '@mui/material'

import { ChevronRight, ChevronDown } from 'mdi-material-ui'
import { TreeItem, TreeView, treeItemClasses } from '@mui/x-tree-view'
import Fade from '@mui/material/Fade'

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

  const [anchorEl, setAnchorEl] = useState(null)
  const handleMoreInfo = event => {
    setAnchorEl(anchorEl ? null : event.target)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'test-popper' : undefined

  const recursionContinueSubjects = nodes => {
    return (
      <TreeItem
        aria-describedby={id}
        onClick={handleMoreInfo}
        sx={{
          mb: 2,
          ml: nodes?.level !== 1 && { xs: 1, sm: 1, lg: 4 },
          position: 'relative',
          '&:before': {
            pointerEvents: 'none',
            content: '""',
            position: 'absolute',
            width: { xs: 29, sm: 29, lg: 42 },
            left: { xs: -29, sm: -29, lg: -41 },
            top: 28,
            borderBottom:
              // only display if the TreeItem is not root node
              nodes?.level !== 1 ? `1px dashed #000` : 'none'
          },

          [`& .${treeItemClasses.group}`]: {
            marginLeft: 4,
            paddingLeft: 6,
            marginBottom: 4,
            borderLeft: `1px dashed #000`
          },
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
          width={{ xs: 300, md: 600 }}
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
                sx={{ flexGrow: 1, overflowY: 'auto', maxWidth: 800 }}
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
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        transition
      // transformOrigin={{ vertical: 'right', horizontal: 'right' }}
      // anchorOrigin={{
      //   vertical: 'left',
      //   horizontal: 'left'
      // }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Box
              sx={{
                bgcolor: 'background.default',
                boxShadow: 1,
                p: 3.5,
                borderRadius: 3,
                minWidth: 500,
                minHeight: 150
              }}
            >
              <Typography variant='body2'> More Information</Typography>
            </Box>
          </Fade>
        )}
      </Popper>
    </Box>
  )
}

export default curriculumtree
