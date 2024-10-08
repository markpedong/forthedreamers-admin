import { CgWebsite } from 'react-icons/cg'
import { FaProductHunt, FaUser } from 'react-icons/fa'
import { FaPeopleGroup } from 'react-icons/fa6'
import Collections from './collections'
import Products from './products'
import Users from './users'
import Website from './website'

export default [
  {
    path: '/app/website',
    name: 'Website',
    element: <Website />,
    icon: <CgWebsite />
  },
  {
    path: '/app/collections',
    name: 'Collections',
    element: <Collections />,
    icon: <FaPeopleGroup />
  },
  {
    path: '/app/products',
    name: 'Products',
    element: <Products />,
    icon: <FaProductHunt />
  },
  {
    path: '/app/users',
    name: 'Users',
    element: <Users />,
    icon: <FaUser />
  }
]
