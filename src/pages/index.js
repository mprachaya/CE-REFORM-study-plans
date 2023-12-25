import React from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Grid'

/////////////Icon///////////////////
import {
  mdiFolderOpenOutline,
  mdiAccountMultipleOutline,
  mdiAccountCardOutline,
  mdiFileTableOutline,
  mdiFileAccount
} from '@mdi/js'

import BlankLayout from 'src/@core/layouts/BlankLayout'
import CardMenu from 'src/components/CardMenu'
import { OnHover, Visible } from 'src/components/Motion'
import { useRouter } from 'next/router'

const MasterData = () => {
  const router = useRouter()

  return (
    <Box m={12} mb={20}>
      <Grid container sx={{ mb: 10 }}>
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Typography variant='h5'>BackOffice Menu</Typography>
        </Grid>
      </Grid>

      {/* --------------------------------------Grid ใหญ่------------------------------------------ */}
      <Grid container spacing={8} sx={{ justifyContent: 'center' }}>
        {/* -------------------------------------- Grid ลูกที่ 1---------------------------------------------------- */}

        <Grid item xs={12} md={5} lg={4.2} sx={{ justifyContent: 'center' }}>
          <Visible>
            <OnHover>
              <CardMenu
                handleclick={() => router.push('/pages/masterdata/curriculums')}
                MenuIcon={mdiFolderOpenOutline}
                MenuName={'Master Data'}
              />
            </OnHover>
          </Visible>
        </Grid>

        {/* -------------------------------------- Grid ลูกที่ 2---------------------------------------------------- */}

        <Grid item xs={12} md={5} lg={4.2} sx={{ justifyContent: 'center' }}>
          <Visible>
            <OnHover>
              <CardMenu
                handleclick={() => router.push('/pages/surveys/interestsurveys')}
                MenuIcon={mdiAccountCardOutline}
                MenuName={'Surveys & Forms'}
              />
            </OnHover>
          </Visible>
        </Grid>

        {/* -------------------------------------- Grid ลูกที่ 3---------------------------------------------------- */}

        <Grid item xs={12} md={5} lg={4.2} sx={{ justifyContent: 'center' }}>
          <Visible>
            <OnHover>
              <CardMenu
                handleclick={() => router.push('/pages/job-subjectrelated')}
                MenuIcon={mdiFileAccount}
                MenuName={'Job & Subjects Related'}
              />
            </OnHover>
          </Visible>
        </Grid>

        {/* -------------------------------------- Grid ลูกที่ 4---------------------------------------------------- */}

        <Grid item xs={12} md={5} lg={4.2} sx={{ justifyContent: 'center' }}>
          <Visible>
            <OnHover>
              <CardMenu handleclick={() => console.log('Report')} MenuIcon={mdiFileTableOutline} MenuName={'Reports'} />
            </OnHover>
          </Visible>
        </Grid>
      </Grid>
    </Box>
  )
}
MasterData.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default MasterData
