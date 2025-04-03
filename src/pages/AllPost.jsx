import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components/index'
import appwriteService from '../appwrite/config'

function AllPost() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
      const getPost = JSON.parse(localStorage.getItem('allPost'))
      if (getPost) {
          setPosts(getPost);
      } else{
          appwriteService.getPosts().then((posts) => {
            setPosts(posts.documents)
        })
      }
    }, [])

  return (
    <div  className='w-full py-8'>
        <Container>
          <div className='columns-2 sm:columns-3 lg:columns-4 gap-2 lg:gap-4 sm:gap-4'>
          {posts.map((post) => (
            <div key={post.$id } className='mb-4 w-full break-inside-avoid'>

                <PostCard {...post} />
            </div>
            ))}
          </div>
        </Container>
    </div>
  )
}

export default AllPost