import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components/index'
import appwriteService from '../appwrite/config'
import { useSelector } from "react-redux";

function InuserPost() {
  const userData = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);

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
  
return(
  <div className="w-full py-8">
    <Container>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-2 lg:gap-4 sm:gap-4">
        {posts.map((post) => {
              if (post.status === 'inactive' && post.userId === userData.$id) {
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
  </div>
);
}

export default InuserPost