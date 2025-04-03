import React, {useCallback, useEffect, useState} from 'react'
import { useForm } from 'react-hook-form'
import { RTE, Button, Select, Input } from '../index'
import appwriteService from '../../appwrite/config'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostForm({post}) {
   
    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
         defaultValues: {
            title: post?.title || '',
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active',
         },
    })
    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData)
    const [imagePreview, setImagePreview] = useState(null)

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

            appwriteService.getPosts().then((posts) => {
                localStorage.setItem('activePost', JSON.stringify(posts.documents))
            })
            appwriteService.getPost([]).then((posts) => {
                localStorage.setItem('allPost', JSON.stringify(posts.documents))
            })

                if(dbPost) {
                    navigate(`/post/${dbPost.$id}`)
                }    
        } else{

            
            if(data.image[0] &&  userData) {
                const file = await appwriteService.uploadFile(data.image[0]);
                const fileId = file.$id
                data.featuredImage = fileId
                const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id,});
                appwriteService.getPosts().then((posts) => {
                    localStorage.setItem('activePost', JSON.stringify(posts.documents))
                })
                appwriteService.getPost([]).then((posts) => {
                    localStorage.setItem('allPost', JSON.stringify(posts.documents))
                })
                if(dbPost){
                    navigate(`/post/${dbPost.$id}`)
                }
            }
        }
    }

    // const handleImageChange = (event) => {
    //     const file = event.target.file[0]

    //     if (file) {
    //         const previewUrl = URL.createObjectURL(file)
    //         setImagePreview(previewUrl)
    //     }
    // }

    const slugTransform = useCallback((value) => {
        if(value && typeof value === 'string')
            return value
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z\d\s]+/g, "-")
            .replace(/\s/g, "-");

            return ''
    }, [])

    useEffect(() => {
        const subscription = watch((value, {name}) => {
            if(name == 'title') {
                setValue('slug', slugTransform(value.title, {shouldValidate: true}));
            }
        });

        return () => {
            subscription.unsubscribe();
        }
    }, [watch, slugTransform, setValue])

  return (
    <form onSubmit={handleSubmit(submit)} className='flex flex-wrap'>
        <div className='w-2/3 px-2'>
            <Input 
                label='Title :'
                placeholder='Title'
                className='mb-4'
                {...register('title', {required: true})}
            />
            <Input 
                label='Slug :'
                placeholder='slug'
                className="mb-4"
                {...register('slug', {required: true})}
                onInput={(e) => {
                    setValue('slug', slugTransform(e.currentTarget.value), {shouldValidate: true})
                }}
            />
            <RTE
                label='Content :'
                name='content'
                control={control}
                defaultValue={getValues('content')}
            />
        </div>
        <div className='w-1/3 px-2'>
            <Input 
                label='Featured Image :'
                placeholder='Choose file'
                type='file'
                className='mb-4'
                accept='image/png, image/jpg, image/jpeg, image/gif'
                onInput={(e) => {
                    setImagePreview(URL.createObjectURL(e.target.file))
                }}
                {...register('image', {required: !post})}
            />
            {imagePreview && (
                <div className='w-full mb-4'>
                    <img 
                    src={imagePreview} 
                    alt={post.title} 
                    className='rounded-lg'
                    />
                </div>
            )}
            <Select 
                options={['active', "inactive"]}
                label='Status'
                className='mb-4'
                {...register('status', {required: true})}
            />
            <Button
                type='submit'
                bgColor={post ? 'bg-green-500' : undefined}
                className='w-full'
            >
                {post ? 'Update' : 'Submit'}
            </Button>
        </div>
    </form>
  )
}

export default PostForm