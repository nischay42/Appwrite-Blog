import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Container, Button } from "../components/index";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

function Post() {
  const [post, setPost] = useState(null);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  let NotInLocal = true;

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (slug) {
      const getPost = sessionStorage.getItem("allPost");
      if (getPost != 'undefined' && getPost) {
        JSON.parse(getPost).forEach((post) => {
          if (post.$id === slug) {
            NotInLocal = false;
            setPost(post);
          }
        });
      }
      if (NotInLocal) {
        appwriteService.getSlugPost(slug).then((post) => {
          if (post)setPost(post);
            else{ navigate("/");
        }
          
        });
      }
    } else navigate("/");
  }, [slug, navigate]);

  const deletePost = () => {
    appwriteService.deletePost(post.$id).then((status) => {
      if (status) {
        appwriteService.deleteFile(post.featuredImage);
        appwriteService.getPosts().then((posts) => {
          sessionStorage.setItem("userPost", JSON.stringify(posts.documents));
          navigate("/");
        });
        appwriteService.getPost().then((posts) => {
          sessionStorage.setItem("allPost", JSON.stringify(posts.documents));
        });
      }
    });
  };


  return post ? (
    <div className="w-full py-8">
      <Container>
        {isImageZoomed && (
          <div
            className="fixed inset-0  bg-[#000000c2] flex justify-center items-center z-50"
            onClick={() => setIsImageZoomed(false)} 
          >
            <div className="max-w-[90vw] max-h-[90vh] z-60 rounded-lg transform scale-110 transition-transform duration-300 cursor-pointer overflow-hidden">
              <img
                src={appwriteService.getFilePreview(post.featuredImage)}
                alt={post.title}
                className="max-w-[80vw] max-h-[80vh]"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
              />
            </div>
          </div>
        )}

        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
          <img
            src={appwriteService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="rounded-xl max-h-[26rem] cursor-pointer"
            onClick={() => setIsImageZoomed(true)} 
          />
        </div>
        <div className="w-full mb-6  inline-flex place-content-between">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          {isAuthor && (
            <div>
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500" className="mr-3">
                  Edit
                </Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>
        <div className="browser-css">{parse(post.content)}</div>
      </Container>
    </div>
  ) : null;
}

export default Post;
