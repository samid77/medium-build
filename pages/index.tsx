import type { NextPage } from 'next'
import Head from 'next/head'
import Header from '../components/Header'
import Banner from '../components/Banner'
import {sanityClient, urlFor} from '../sanity';
import { Post } from '../typings';
import Link from 'next/link';
import { url } from 'inspector';

interface Props {
  posts: Post[],
}

export default function Home({posts}: Props) {
  return (
    <div className='max-w-7xl mx-auto'>
      <Head>
        <title>Medium Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Banner />
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6'>
        { posts !== undefined && posts !== null 
          ? posts.map((p, idx) => (
              <Link 
                key={p._id}
                href={`/post/${p.slug.current}`}>
                  <div className='border rounded-lg group cursor-pointer overflow-hidden'>
                    {
                      p.mainImage && <img
                      className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out'
                      src={urlFor(p.mainImage).url()!}
                      alt='Post Image'
                    />
                    }
                  </div>
                  <div className='flex justify-between p-5 bg-white'>
                    <div>
                      <p className='text-lg font-bold'>{p.title}</p>
                      <p className='text-xs'>{p.description} by {p.author.name}</p>
                    </div>
                    <img 
                      className='h-12 w-12 rounded-full'
                      src={urlFor(p.author.image).url()!}
                      alt={'Author Picture'}
                    />
                  </div>
              </Link>
          ))
          : <div><h1>No Post Data</h1></div>
        }
      </div>
    </div>
  )
}

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    author->{
      name,
      image
    },
    description,
    mainImage,
    slug
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    }
  }
};
