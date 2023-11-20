import React from 'react'
import { useSettings } from 'src/@core/hooks/useSettings'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import VerticalLayout from 'src/@core/layouts/VerticalLayout'
// import VerticalAppBarContent from './components/vertical/AppBarContent'
import VerticalAppBarContent from '../../../../../src/layouts/components/vertical/AppBarContent'
import useMediaQuery from '@mui/material/useMediaQuery'
import { surveysNavigation } from 'src/navigation/vertical'

function interestsurveysPage() {
  const { settings, saveSettings } = useSettings()
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  return (
    <VerticalLayout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      verticalNavItems={surveysNavigation()} // Navigation Items
      // afterVerticalNavMenuContent={UpgradeToProImg}
      verticalAppBarContent={(
        props // AppBar Content
      ) => (
        <VerticalAppBarContent
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
          toggleNavVisibility={props.toggleNavVisibility}
        />
      )}
    >
      test
      {/* <UpgradeToProButton /> */}
    </VerticalLayout>
  )
}
interestsurveysPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default interestsurveysPage
