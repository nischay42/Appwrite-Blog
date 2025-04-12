import React, { useEffect, useState } from 'react'
import {useDispatch} from 'react-redux'
import authService from './appwrite/auth'
import appwriteService from './appwrite/config'
import { login, logout } from './store/authSlice'
import { Header, Footer } from './components'
import { Outlet } from 'react-router-dom'

function App() {

  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if(userData){
        dispatch(login({userData}))
      } else{
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  },[])

  
  useEffect(() => {
    // Fetch and set activePost
    appwriteService.getPosts().then((posts) => {
      sessionStorage.setItem('activePost', JSON.stringify(posts.documents));
    });

    // Fetch and set allPost
    appwriteService.getPost([]).then((posts) => {
      sessionStorage.setItem('allPost', JSON.stringify(posts.documents));
    });
  }, []);


  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block '>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : null
  
}

export default App
