import BookOutline from 'mdi-material-ui/BookOutline'
import Domain from 'mdi-material-ui/Domain'

const navigation = () => {
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
      title: 'Faculty',
      icon: Domain,
      path: '/pages/masterdata/faculty'
      // openInNewTab: true
    },
    // {
    //   title: 'Subject',
    //   icon: Domain,
    //   path: '/pages/masterdata/subjects'
    //   // openInNewTab: true
    // },

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
    },
    {
      title: 'Curriculum Tree',
      icon: Domain,
      path: '/pages/masterdata/curriculumtree'
      // openInNewTab: true
    }
  ]
}

export default navigation
