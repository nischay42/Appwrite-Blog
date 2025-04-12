import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import appwriteService from '../appwrite/config'
import { Container, PostCard } from '../components/index'


function Home() {
    const state = useSelector((state) => state.auth.status)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        if(state){
            const getPost = JSON.parse(sessionStorage.getItem('activePost'))
        
        if (getPost) {
            setPosts(getPost);
        } else{
            appwriteService.getPosts().then((posts) => {
              setPosts(posts.documents)
          })
        }
    }
      }, [])

    if(!state){
        return (
            <div className='w-full py-8 mt-4 text-center'>
                <Container>
                    <div className='flex flex-wrap'>
                        <div className='p-2 w-full'>
                            <h1 className='text-2xl my-[13vh] font-bold hover:text-gray-500'>
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
    <div className='w-full py-8'>
        <Container>
            <div className='columns-2 sm:columns-3 lg:columns-4 gap-2 lg:gap-4 sm:gap-4'>
                {state && posts.map((post) => (
                <div key={post.$id} className='mb-4 w-full break-inside-avoid'>
                    <PostCard {...post} />
                    </div>
                ))}
            </div>
        </Container>
      
    </div>
  )
}

export default Home