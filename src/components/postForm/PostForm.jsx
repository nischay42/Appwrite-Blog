import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        if(post){
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null
            if(file){
            appwriteService.deleteFile(post.featuredImage)
            }            

            const dbPost =  await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            appwriteService.getPosts(userData.$id).then((posts) => {
                sessionStorage.setItem('userPost', JSON.stringify(posts.documents))
            })
            appwriteService.getPost().then((posts) => {
                sessionStorage.setItem('allPost', JSON.stringify(posts.documents))
            })

            setTimeout(() =>{
                if(dbPost) {
                    navigate(`/post/${dbPost.$id}`)
                }  
            }, '1000')

        } 
      
        else{

            if(data.image[0] &&  userData) {
                const file = await appwriteService.uploadFile(data.image[0]);
                const fileId = file.$id
                data.featuredImage = fileId
                const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id,});

                appwriteService.getPosts(userData.$id).then((posts) => {
                    sessionStorage.setItem('userPost', JSON.stringify(posts.documents))
                })
                appwriteService.getPost().then((posts) => {
                    sessionStorage.setItem('allPost', JSON.stringify(posts.documents))
                })
                
                if(dbPost){
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }
    }

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-")
                .slice(0, 25);

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                const characters = 'abcdefghijklmnopqrstuvwxyz123456789';
                
                let titleSlug = slugTransform(value.title);
    
                let randomSuffix = Array.from({ length: 10 }, () =>
                    characters[Math.floor(Math.random() * characters.length)]
                ).join('');
    
                let uniqueSlug = `${titleSlug}-${randomSuffix}`;
    
                setValue("slug", uniqueSlug, { shouldValidate: true });
            }
        });
        
        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/4 md:w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
            </div>
            <div className="w-2/4 md:w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {/* {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )} */}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
            <div className="w-full md:w-3/4">
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
        </form>
    );
}