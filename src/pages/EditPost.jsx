import React, {useEffect, useState} from 'react'
import { Container, PostForm } from '../components/index'
import appwriteService from '../appwrite/config'
import { useNavigate, useParams } from 'react-router-dom'


function EditPost() {
    const [post, setPosts] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()
    let NotInLocal = true;

    useEffect(() => {
        if (slug) {
          const getPost = sessionStorage.getItem("userPost");
          if(getPost != 'undefined' && getPost){
            JSON.parse(getPost).forEach((post) => {
            if (post.$id === slug) {
              NotInLocal = false;
              setPosts(post);
            }
          });
        }
        if (NotInLocal) {
          appwriteService.getSlugPost(slug).then((post) => {
            if (post) setPosts(post);
            else navigate("/");
          });
        }
          
        } else navigate("/");
      }, [slug, navigate]);

  return post ? (
    <div  className='py-8'>
        <Container>
            <PostForm post={post} />
        </Container>
    </div>
  ) : null
}

export default EditPost