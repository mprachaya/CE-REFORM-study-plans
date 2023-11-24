import BookOutline from 'mdi-material-ui/BookOutline'
import Domain from 'mdi-material-ui/Domain'

export const masterNavigation = () => {
  return [
    {
      sectionTitle: 'MasterData'
    },
    {
      title: 'Curriculums',
      icon: BookOutline,
      path: '/pages/masterdata/curriculums'
    },
    {
      title: 'Curriculum Tree',
      icon: Domain,
      path: '/pages/masterdata/curriculumtree'
      // openInNewTab: true
    },
    {
      title: 'Curriculum Structures',
      icon: Domain,
      path: '/pages/masterdata/curriculumstructure'
      // openInNewTab: true
    },
    {
      title: 'Subject Structures',
      icon: Domain,
      path: '/pages/masterdata/subjectstructures'
      // openInNewTab: true
    },
    {
      title: 'Faculty',
      icon: Domain,
      path: '/pages/masterdata/faculty'
      // openInNewTab: true
    },

    {
      title: 'Subject Categories',
      icon: Domain,
      path: '/pages/masterdata/subjectcategories'
      // openInNewTab: true
    },
    {
      title: 'Subject Types',
      icon: Domain,
      path: '/pages/masterdata/subjecttypes'
      // openInNewTab: true
    },
    {
      title: 'Subject Groups',
      icon: Domain,
      path: '/pages/masterdata/subjectgroups'
      // openInNewTab: true
    },
    {
      title: 'Student Groups',
      icon: Domain,
      path: '/pages/masterdata/studentgroups'
      // openInNewTab: true
    }
  ]
}
export const surveysNavigation = () => {
  return [
    {
      sectionTitle: 'Surveys'
    },
    {
      title: 'Interest Surveys',
      icon: BookOutline,
      path: '/pages/surveys/interestsurveys'
    },
    {
      title: 'Feedbacks',
      icon: BookOutline,
      path: '/pages/surveys/feedbacks'
    }
  ]
}
