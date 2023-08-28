import { Box, Button, Divider, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import { Selection } from 'src/components'

function curriculumstructure() {
  const textSize = 14
  const detailColor = 'gray'

  const CurriculumDetails = () => (
    <Grid container mt={6} spacing={2}>
      <Grid item xs={3} sm={2}>
        <Typography fontSize={textSize}>Name(TH) :</Typography>
      </Grid>
      <Grid item xs={9} sm={4}>
        <Typography color={detailColor} fontSize={textSize}>
          sssssssssssssssss
        </Typography>
      </Grid>
      <Grid item xs={3} sm={2}>
        <Typography fontSize={textSize}>Name(EN) :</Typography>
      </Grid>
      <Grid item xs={9} sm={4}>
        <Typography color={detailColor} fontSize={textSize}>
          ssssssssssssssssssssss
        </Typography>
      </Grid>
      <Grid item xs={3} sm={2}>
        <Typography fontSize={textSize}>Faculty:</Typography>
      </Grid>
      <Grid item xs={9} sm={10}>
        <Typography color={detailColor} fontSize={textSize}>
          ssssssssssssssssssssss
        </Typography>
      </Grid>
      <Grid item xs={3} sm={2}>
        <Typography fontSize={textSize}>Student Group:</Typography>
      </Grid>
      <Grid item xs={9} sm={4}>
        <Typography color={detailColor} fontSize={textSize}>
          ssssssssssssssssssssss
        </Typography>
      </Grid>
      <Grid item xs={3} sm={2}>
        <Typography fontSize={textSize}>Curriculum Year:</Typography>
      </Grid>
      <Grid item xs={9} sm={4}>
        <Typography color={detailColor} fontSize={textSize}>
          256X
        </Typography>
      </Grid>
    </Grid>
  )

  return (
    <Box m={6}>
      <Typography variant='h6'>Curriculums Structure</Typography>
      <CurriculumDetails />

      <Grid container display={'flex'} my={6} ml={0}>
        <Grid item xs={12}>
          <Box mr={4} mb={2} mt={2} ml={0} display={'flex'} justifyContent={'space-between'}>
            <Typography sx={{ m: 2 }} fontSize={12}>
              Subject Group
            </Typography>

            <Box display='flex' width={170}>
              <Typography sx={{ m: 2 }} fontSize={12}>
                Total Credit
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mt: 2, mb: 4 }} />
          <Box mr={4} mb={2} mt={2} ml={0} display={'flex'} justifyContent={'space-between'}>
            <Typography sx={{ m: 2 }} variant='body1'>
              1. กลุ่มวิชาใดๆ
            </Typography>
            <Box display={'flex'} flexDirection={'row'}>
              <TextField sx={{ width: 80 }} size={'small'} fullWidth />
              <Button variant={'text'} sx={{ px: 9 }}>
                X
              </Button>
            </Box>
          </Box>
          <Box my={6} mr={4} mb={2} mt={2} ml={0} display={'flex'} justifyContent={'space-between'} minWidth={200}>
            <Selection label={'Subject Group'} width={200} />
            <Button variant={'contained'} sx={{ width: 160 }}>
              +
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} my={4}>
          <Box borderRadius={2} bgcolor={'AppWorkspace'} minHeight={500}></Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default curriculumstructure
