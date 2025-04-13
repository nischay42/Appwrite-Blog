import React from 'react'
import {Container, Logo, LogoutBtn} from '../index'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'


function Header() {
    const authStatus = useSelector((state) => state.auth.status)
    const navigate = useNavigate()

    const navItems = [
        {
            name: 'Home',
            slug: '/',
            active: true
        },
        {
            name: 'Login',
            slug: '/login',
            active: !authStatus
        },
        {
            name: 'Signup',
            slug: '/signup',
            active: !authStatus
        },
        {
            name: 'All Posts',
            slug: '/all-posts',
            active: authStatus
        },
        {
            name: 'Add Post',
            slug: '/add-post',
            active: authStatus
        }
    ]
  return (
   <header className='py-3 shadow sticky top-0 z-30 bg-gray-500'>
    <Container>
        <nav className='flex'>
            <div className='mr-2 md:mr-4'>
                <Link to='/'>
                    <Logo  width='70px'/>

                </Link>
            </div>
            <ul className='flex ml-auto'>
                {navItems.map((item) => 
                item.active ? (
                    <li key={item.name}>
                        <button
  onClick={() => {
    // Reset scroll manually for only Home and All Posts
    if (item.slug === '/' || item.slug === '/all-posts') {
      sessionStorage.setItem('manualScrollReset', 'true');
    }
    navigate(item.slug);
  }}
  className='inline-block px-[1.9vw] py-2 md:px-6 duration-200 hover:bg-blue-100 rounded-full'
>
  {item.name}
</button>

                    </li>
                ) : null
                )}
                { authStatus &&(
                    <li>
                        <LogoutBtn />
                    </li>
                )}
            </ul>
        </nav>
    </Container>
   </header>
  )
}

export default Header