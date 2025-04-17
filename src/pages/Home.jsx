import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components/index'
import appwriteService from '../appwrite/config'
import { useSelector } from 'react-redux'

function Home() {
  const state = useSelector((state) => state.auth.status);
  const [posts, setPosts] = useState([])
  const [limit, setLimit] = useState(15); 
  const [offset, setOffset] = useState(0);
  const [postAvailable, setPostAvailable] = useState(true)

    useEffect(() => {
      const getPost = sessionStorage.getItem('allPost')
      if (getPost != 'undefined' && getPost) {
          setPosts(JSON.parse(getPost));
        } else{
          appwriteService.getPost().then((posts) => {
            setPosts(posts.documents);
        })
      }
    }, [offset, limit])

    // load new posts
   
    const loadPost = (lim, offse) => {

      const newLimit = limit + lim
      const newOffset = offset + offse

      appwriteService.getPost(lim, newOffset).then((newPost) =>{
        if (newPost.documents) {
          const updatedPosts = [...posts, ...newPost.documents];
          setPosts(updatedPosts); // Update posts state
          sessionStorage.setItem("allPost", JSON.stringify(updatedPosts)); // Update sessionStorage
          
          if(updatedPosts.length < newLimit){
            setPostAvailable(false)
          }
        }
      })
      setLimit(newLimit)
      setOffset(newOffset)
    }

   if (!state) {
      return (
        <div className="w-full py-8 mt-4 text-center">
          <Container>
            <div className="flex flex-wrap">
              <div className="p-2 w-full">
                <h1 className="text-2xl my-[13vh] font-bold hover:text-gray-500">
                  Login to read posts
                </h1>
              </div>
            </div>
          </Container>
        </div>
      );
    }

  return (
    <div  className='w-full py-8'>
        <Container>
          <div className='columns-2 sm:columns-3 lg:columns-4 gap-2 lg:gap-4 sm:gap-4 '>
          {state && posts.map((post) => (
            <div key={post.$id } className='mb-4  break-inside-avoid w-full '>

                <PostCard {...post} />
            </div>
            ))}
          </div>
        </Container>
          {postAvailable && <div className='flex relative justify-center align-bottom my-6 '>
            <button onClick={() => loadPost(15, 15)} className='bg-green-600 hover:bg-green-500 px-2 py-1 rounded-xl text-white absolute top-1.5 cursor-pointer'>
              load post...
            </button>
          </div>}
    </div>
  )
}

export default Home
