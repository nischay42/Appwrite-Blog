import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store  from './store/store.js'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import {Home, Signup, MyPosts, AddPost, EditPost, Post, Login, InactivePost} from './pages/index.js'
import { AuthLayout } from './components/index.js'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>

        <Route path='/'  element={<Home />} />

        <Route path='/login' element={(
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        )} />

        <Route path='/signup' element={(
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        )} />

        <Route path='/my-posts' element={(
          <AuthLayout authentication>
            {" "}
            <MyPosts />
          </AuthLayout>
        )} >
        </Route>

        <Route path='/inactive-posts' element={(
          <AuthLayout authentication>
            {" "}
            <InactivePost />
          </AuthLayout>
        )} >
        </Route>

        <Route path='/add-post' element={(
          <AuthLayout authentication>
            {" "}
            <AddPost />
          </AuthLayout>
        )} />

        <Route path='/edit-post/:slug' element={(
          <AuthLayout authentication>
            {" "}
            <EditPost />
          </AuthLayout>
        )} />

        <Route path='/post/:slug' element={<Post />} />
      
    </Route>
  )
)

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//     children: [
//         {
//             path: "/",
//             element: <Home />,
//         },
//         {
//             path: "/login",
//             element: (
//                 <AuthLayout authentication={false}>
//                     <Login />
//                 </AuthLayout>
//             ),
//         },
//         {
//             path: "/signup",
//             element: (
//                 <AuthLayout authentication={false}>
//                     <Signup />
//                 </AuthLayout>
//             ),
//         },
//         {
//             path: "/all-posts",
//             element: (
//                 <AuthLayout authentication>
//                     {" "}
//                     <AllPost />
//                 </AuthLayout>
//             ),
//         },
//         {
//             path: "/add-post",
//             element: (
//                 <AuthLayout authentication>
//                     {" "}
//                     <AddPost />
//                 </AuthLayout>
//             ),
//         },
//         {
//             path: "/edit-post/:slug",
//             element: (
//                 <AuthLayout authentication>
//                     {" "}
//                     <EditPost />
//                 </AuthLayout>
//             ),
//         },
//         {
//             path: "/post/:slug",
//             element: <Post />,
//         },
//     ],
// },
// ])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
