import { useState } from 'react';

import { GetStaticProps } from 'next';
import Link from 'next/link';
import Head from 'next/head';

import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { FiCalendar, FiUser } from 'react-icons/fi';

import Header from '../components/Header';
import { getPrismicClient } from '../services/prismic';
import styles from './home.module.scss';
import commonStyles from '../styles/common.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
  preview: boolean;
}

export default function Home({
  postsPagination,
  preview,
}: HomeProps): JSX.Element {
  const [postsPages, setPostsPages] = useState(postsPagination);

  function handleLoadPosts(): void {
    fetch(postsPages.next_page)
      .then(res => res.json())
      .then(data =>
        setPostsPages({
          next_page: data.next_page,
          results: postsPages.results.concat(data.results),
        })
      );
  }

  return (
    <>
      <Head>
        <title>Posts | spacetravelling.</title>
      </Head>

      <Header />

      <main className={`${styles.postContainer} ${commonStyles.container}`}>
        {postsPages.results.map(post => (
          <Link key={post.uid} href={`/post/${post.uid}`}>
            <a>
              <strong>{post.data.title}</strong>
              <p>{post.data.subtitle}</p>
              <article>
                <FiCalendar className={styles.icon} />
                <time>
                  {format(
                    new Date(post.first_publication_date),
                    'dd MMM yyyy',
                    { locale: ptBR }
                  )}
                </time>
                <FiUser className={styles.icon} />
                <span>{post.data.author}</span>
              </article>
            </a>
          </Link>
        ))}

        {postsPages.next_page && (
          <button type="button" onClick={handleLoadPosts}>
            Carregar mais posts
          </button>
        )}

        {preview && (
          <aside className={commonStyles.previewModeContainer}>
            <Link href="/api/exit-preview">
              <a>Sair do modo Preview</a>
            </Link>
          </aside>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 1,
      ref: previewData?.ref ?? null,
    }
  );

  return {
    props: {
      postsPagination: postsResponse,
      preview,
    },
  };
};
