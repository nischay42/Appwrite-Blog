import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import { Container, PostCard } from "../components/index";

function MyPosts() {
  const userData = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(15); 
  const [offset, setOffset] = useState(0);
  const [postAvailable, setPostAvailable] = useState(true)

  useEffect(() => {
    const getPost = sessionStorage.getItem("userPost");
    if (getPost != 'undefined' && getPost) {
      setPosts(JSON.parse(getPost));
    } else {
      appwriteService.getPosts(userData.$id).then((posts) => {
        setPosts(posts.documents);
      });
    }
  }, []);

    // load new posts
   
    const loadPost = (lim, offse) => {

      const newLimit = limit + lim
      const newOffset = offset + offse

      appwriteService.getPosts(userData.$id, lim, newOffset).then((newPost) =>{
        if (newPost.documents) {
          const updatedPosts = [...posts, ...newPost.documents];
          setPosts(updatedPosts); // Update posts state
          sessionStorage.setItem("userPost", JSON.stringify(updatedPosts)); // Update sessionStorage
          
          if(updatedPosts.length < newLimit){
            setPostAvailable(false)
          }
          
        }
      })
      setLimit(newLimit)
      setOffset(newOffset)
    }
 
return(
  <div className="w-full py-8">
    <Container>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 lg:gap-4 sm:gap-4">
        {posts.map((post) => {
              if (post.status === 'active' && post.userId === userData.$id) {
                  return (
                <div key={post.$id} className="mb-4 w-full break-inside-avoid">
                  <PostCard {...post} />
                </div>
              );
            }
            return null;
          })}
      </div>
    </Container>
    {postAvailable && <div className='flex relative justify-center align-bottom my-6 '>
            <button onClick={() => loadPost(15, 15)} className='bg-green-600 hover:bg-green-500 px-2 py-1 rounded-xl text-white absolute top-1.5 cursor-pointer'>
              load post...
            </button>
          </div>}
  </div>
);
}

export default MyPosts;
