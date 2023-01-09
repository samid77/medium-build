import { GetStaticProps } from 'next';
import React, { useState } from 'react'
import Header from '../../components/Header';
import { sanityClient, urlFor } from '../../sanity';
import { Post } from '../../typings';
import PortableText from 'react-portable-text';
import {useForm, SubmitHandler} from 'react-hook-form';

interface IFormInput {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

interface Props {
    post: Post;
}

export default function PostPage({post}: Props) {
    const [submitted, setSubmitted] = useState(false);
    const {register, handleSubmit, formState: {errors}} = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        console.log(`submit: ${JSON.stringify(data, undefined, 2)}`)
        await fetch('/api/createComment', {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(() => {
            console.log(`res: ${JSON.stringify(data, undefined, 2)}`)
            setSubmitted(true)
        }).catch((err) => {
            console.log(err)
            setSubmitted(false)
        })
    }

    return (
        <main>
            <Header />
            <img 
                src={urlFor(post.mainImage).url()!}
                alt={'Article Cover Image'}
                className='w-full h-40 object-cover'
            />
            <article className='max-w-3xl mx-auto p-5'>
                <h1 className='text-3xl mt-10 mb-3'>{post.title}</h1>
                <h2 className='text-xl font-light text-gray-500 mb-2'>{post.description}</h2>
                <div className='flex items-center space-x-2'>
                    <img 
                        src={urlFor(post.author.image).url()!}
                        alt='Author Image'
                        className='h-10 w-10 rounded-full'
                    />
                    <p className='font-extralight text-sm'>Blog Post By <span className='text-green-600'>{post.author.name}</span> - Published at {new Date(post._createdAt).toLocaleString()}</p>
                </div>
                <div className='mt-10'>
                    <PortableText 
                        className=''
                        serializers={
                            {
                                h1: (props: any) => (
                                    <h1 className='text-2xl font-bold my-5' {...props}/>
                                ),
                                h2: (props: any) => (
                                    <h2 className='text-xl font-bold my-5' {...props}/>
                                ),
                                li: ({children} : any) => (
                                    <li className='ml-4 list-disc'>{children}</li>
                                ),
                                link: ({href, children} : any) => (
                                    <a href={href} className='text-blue-500 hover:underline'>{children}</a>
                                )
                            }
                        }
                        content={post.body}
                        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                    />
                </div>
            </article>

            <hr className='max-w-lg my-5 mx-auto border border-yellow-500'/>

            {submitted ? (
                <div className='flex flex-col p-10 my-10 bg-yellow-500 text-white max-w-2xl mx-auto'>
                    <h2 className='text-3xl font-bold'>Thank you for submitting your email</h2>
                    <p>Once it has been approved. It will appear on the comment section</p>
                </div>
            ): (
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-10 my-10 max-w-2xl mx-auto'>
                    <h3 className='text-sm text-yellow-500'>Enjoyed this article ?</h3>
                    <h4 className='text-3xl font-bold'>Leave a comment below!</h4>
                    <hr className='py-2 mt-2'/>

                    <input 
                        type='hidden'
                        {...register('_id')}
                        name='_id'
                        value={post._id}
                    />

                    <label className='block mb-5'>
                        <span className='text-gray-700'>Name</span>
                        <input 
                            type='text' 
                            {...register('name', {required: true})}
                            className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring' 
                            placeholder='John Doe'/>
                    </label>
                    <label className='block mb-5'>
                        <span className='text-gray-700'>Email</span>
                        <input 
                            type='email' 
                            {...register('email', {required: true})}
                            className='shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring' 
                            placeholder='john.doe@mail.com'/>
                    </label>
                    <label className='block mb-5'>
                        <span className='text-gray-700'>Comment</span>
                        <textarea 
                            {...register('comment', {required: true})}
                            className='shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring' 
                            rows={8} 
                            placeholder='This is a very great post!'/>
                    </label>
                    <div className='flex flex-col p-5'>
                        {errors.name && (
                            <span className='text-red-500'>The Name field is required</span>
                        )}
                        {errors.email && (
                            <span className='text-red-500'>The Email field is required</span>
                        )}
                        {errors.comment && (
                            <span className='text-red-500'>The Comment field is required</span>
                        )}
                    </div>
                    <input
                        className='bg-yellow-500 hover:bg-yellow-400 
                        focus:shadow-outline focus:outline-none text-white font-bold px-4 py-4 rounded cursor-pointer'    
                        type='submit'
                    />
                    
                </form>
             )
            }
        </main>
    )
}

export const getStaticPaths = async () => {
    const query = `*[_type == "post"]{
        _id,
        slug {
            current
        }
    }`

    const posts = await sanityClient.fetch(query);
    const paths = posts.map((p: Post) => ({
        params: {
            slug: p.slug.current
        }
    }))
    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author-> {
            name,
            image,
        },
        'comments': *[
            _type == "comment" &&
            post._ref == ^._id &&
            approved == true],
        description,
        mainImage,
        slug,
        body
    }`

    const post = await sanityClient.fetch(query, {
        slug: params?.slug,
    })
    if(!post) {
        return {
            notFound: true
        }
    }
    return {
        props: {
            post,
        },
        revalidate: 60, //after 60 seconds, it will update the old cached version
    }

}
