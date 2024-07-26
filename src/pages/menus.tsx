import { FaProductHunt, FaUser } from 'react-icons/fa'
import { FaPeopleGroup } from 'react-icons/fa6'
import Collections from './collections'
import Users from './users'
import Products from './products'

export default [
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
