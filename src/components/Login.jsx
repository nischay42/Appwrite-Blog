import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {login as authLogin} from '../store/authSlice'
import {Logo, Button, Input} from './index'
import authService from '../appwrite/auth'
import appwriteService from '../appwrite/config'
import {useForm} from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { FaTimes } from "react-icons/fa";

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState('')
    
    const login = async(data) => {
        setError('')
        try{
            const session = await authService.login(data)
            if(session){

            const userData = await authService.getCurrentUser()

            if(userData){

             localStorage.setItem('UserData', JSON.stringify(userData))
             
             dispatch(authLogin(userData)); 

             appwriteService.getPosts(userData.$id).then((posts) => {
                 sessionStorage.setItem('userPost', JSON.stringify(posts.documents))
             })
             appwriteService.getPost().then((posts) => {
                 sessionStorage.setItem('allPost', JSON.stringify(posts.documents))
             })
            }
            
                navigate('/')
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div className='flex items-center justify-center w-full'>
        <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
        <div className='text-2xl flex justify-end m-[0.8rem]'>
            <button
            onClick={() => navigate('/')}
            className='cursor-pointer'
            >
            <FaTimes className='mt-[-1.9rem] mr-[-1.9rem]' />
            </button>
        </div>
            <div className='mb-2 flex justify-center'>
                <span className='inline-block w-full max-w-[100px]'>
                    <Logo width='100%' />
                </span>
            </div>
            <h2 className='text-center text-2xl font-bold leading-tight'>
                Sign in to your account
            </h2>
            <p className='mt-2 text-center text-base text-black/60'>
                Don&apos;t have any account?&nbsp;
                <Link
                to='/signup'
                className='font-medium text-primary transition-all duration-200 hover:underline'
                >
                    Sign Up
                </Link>
            </p>
            {error && <p className='text-red-600 mt-8 text-center'>{error}</p>}
            <form onSubmit={handleSubmit(login)}
            className='mt-8'
            >
                <div className='space-y-5'>
                    <Input 
                    label='Email: '
                    placeholder='Enter your email'
                    type='email'
                    {...register('email', {
                        required: true,
                        validate: {
                            matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Email address must be a valid address",
                        }
                    })}
                    />
                    <Input
                    label='Password'
                    placeholder='Enter your password'
                    type='password'
                    {...register('password', {
                        required: true,
                    })}
                    />
                    <Button
                    type='submit'
                    className='w-full'
                    >Sign in</Button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login