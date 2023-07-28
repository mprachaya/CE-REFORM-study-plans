import React from 'react'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Grid'

/////////////Icon///////////////////
import { mdiFolderOpenOutline } from '@mdi/js'
import { mdiAccountMultipleOutline } from '@mdi/js'
import { mdiAccountCardOutline } from '@mdi/js'
import { mdiFileTableOutline } from '@mdi/js'

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
      <Grid container spacing={8} sx={{ display: 'flex', justifyContent: 'center' }}>
        {/* -------------------------------------- Grid ลูกที่ 1---------------------------------------------------- */}

        <Grid item sm={12} md={5} lg={4.2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Visible>
            <OnHover>
              <CardMenu
                handleClick={() => router.push('/pages/masterdata/curriculums')}
                MenuIcon={mdiFolderOpenOutline}
                MenuName={'Master Data'}
                Content={
                  <React.Fragment>
                    <Typography variant='body2' letterSpacing={0}>
                      - Faculty
                    </Typography>
                    <Typography variant='body2' letterSpacing={0}>
                      - Student Groups
                    </Typography>
                    <Typography variant='body2' letterSpacing={0}>
                      - Curriculums
                    </Typography>
                    <Typography variant='body2' letterSpacing={0}>
                      - Job Positions
                    </Typography>
                  </React.Fragment>
                }
              />
            </OnHover>
          </Visible>
        </Grid>

        {/* -------------------------------------- Grid ลูกที่ 2---------------------------------------------------- */}

        <Grid item xs={12} md={5} lg={4.2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Visible>
            <OnHover>
              <CardMenu
                handleClick={() => console.log('Recommendation')}
                MenuIcon={mdiAccountCardOutline}
                MenuName={'Recommendation'}
                Content={
                  <React.Fragment>
                    <Typography variant='body2' letterSpacing={0}>
                      - Study Plans
                    </Typography>
                    <Typography variant='body2' letterSpacing={0}>
                      - Actual Study
                    </Typography>
                    <Typography variant='body2' letterSpacing={0}>
                      - Recommend Plans
                    </Typography>
                  </React.Fragment>
                }
              />
            </OnHover>
          </Visible>
        </Grid>

        {/* -------------------------------------- Grid ลูกที่ 3---------------------------------------------------- */}

        <Grid item xs={12} md={5} lg={4.2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Visible>
            <OnHover>
              <CardMenu
                handleClick={() => console.log('Student Syst.')}
                MenuIcon={mdiAccountMultipleOutline}
                MenuName={'Student Syst.'}
                Content={
                  <React.Fragment>
                    <Typography variant='body2' letterSpacing={0}>
                      - Assessment Forms
                    </Typography>
                    <Typography variant='body2' letterSpacing={0}>
                      - Feedback Forms
                    </Typography>
                  </React.Fragment>
                }
              />
            </OnHover>
          </Visible>
        </Grid>

        {/* -------------------------------------- Grid ลูกที่ 4---------------------------------------------------- */}

        <Grid item xs={12} md={5} lg={4.2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Visible>
            <OnHover>
              <CardMenu handleClick={() => console.log('Report')} MenuIcon={mdiFileTableOutline} MenuName={'Report'} />
            </OnHover>
          </Visible>
        </Grid>
      </Grid>
    </Box>
  )
}
MasterData.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default MasterData
