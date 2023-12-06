import React, { useState } from 'react'
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

import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Selection, TextSearch } from 'src/components'

function StudyPlanSimulatorPage() {
  // const router = useRouter()
  // useEffect(() => {
  //   router.push('/pages/masterdata/curriculums')
  // }, [])

  const [tabs, setTabs] = useState(['Term 1'])

  const dropdownOptions = [
    { value: 0, label: 'Option 1' },
    { value: 1, label: 'Option 2' },
    { value: 2, label: 'Option 3' }
    // Add more objects as needed
  ]

  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleAddTab = () => {
    const newTabIndex = tabs.length + 1
    const newTabLabel = `Term ${newTabIndex}`
    setTabs([...tabs, newTabLabel])
    setValue(newTabIndex - 1) // Switch to the newly added tab
  }

  return (
    <>
      <Hidden smDown>
        <Grid container sx={{ m: 2 }}>
          <Grid container item sm={6} md={8} lg={8} sx={{ height: '100%' }}>
            {/* Filter */}
            <Grid item sm={12} md={6} lg={8}>
              <TextSearch buttonInside={true} placeholder='Subject Code, Name' />
            </Grid>
            <Grid item sm={12} md={4} lg={4}>
              {/* Pagination */}
              <TablePagination
                rowsPerPageOptions={[]}
                component='div'
                size='small'
                count={88}
                rowsPerPage={24}
                page={0}
                // onPageChange={handleChangePage}
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
                  // handleChange={e => setCurriculumSelected(e.target.value)}
                  Items={Object.values(dropdownOptions).map(menu => (
                    <MenuItem key={menu.value} value={menu.value}>
                      {menu.label}
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
                  // handleChange={e => setCurriculumSelected(e.target.value)}
                  Items={Object.values(dropdownOptions).map(menu => (
                    <MenuItem key={menu.value} value={menu.value}>
                      {menu.label}
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
                  // handleChange={e => setCurriculumSelected(e.target.value)}
                  Items={Object.values(dropdownOptions).map(menu => (
                    <MenuItem key={menu.value} value={menu.value}>
                      {menu.label}
                    </MenuItem>
                  ))}
                />
              </Grid>
            </Grid>
            <Grid xs={12}>
              <Box sx={{ height: 600, mt: 6 }}>
                <Grid container spacing={2} sx={{ p: 2 }}>
                  {Array.from({ length: 24 }, (_, index) => index).map(value => (
                    <Grid item sm={12} md={6} lg={4} key={value}>
                      <Card sx={{ height: 65, background: 'white' }}>
                        <Box
                          sx={{ height: 30, background: 'lightgray', display: 'flex', justifyContent: 'space-between' }}
                        >
                          <Typography variant='body2' sx={{ m: 1, fontWeight: 'bold' }}>
                            ENGCEXX
                          </Typography>
                          <Button sx={{ color: 'white', m: 1 }}>+</Button>
                        </Box>
                        <Box
                          sx={{
                            height: 35,

                            p: 1,
                            display: 'flex',
                            direction: 'column'
                          }}
                        >
                          <Typography variant='body2' noWrap>
                            Subject ...................................................................
                          </Typography>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
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
                  SE 66
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
                      <Tab key={index} label={tabLabel} sx={{ fontSize: 12 }} />
                    ))}
                    <IconButton
                      sx={{ color: 'gray', borderRadius: 1, borderTopRightRadius: 24, m: 1, width: 48 }}
                      onClick={handleAddTab}
                    >
                      +
                    </IconButton>
                  </Tabs>

                  <Box sx={{ width: '100%', m: 2, mt: 3 }}>
                    <Button sx={{ fontSize: 12, width: '45%' }}>Subjects</Button>
                    <Button sx={{ fontSize: 12, width: '45%' }}>Competencies</Button>
                  </Box>
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

                    <Box sx={{ m: 2, widht: '100%' }}>{`Content for ${tabLabel}`}</Box>
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
