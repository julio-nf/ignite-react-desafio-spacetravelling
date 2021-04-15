/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-danger */
/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-await-sync-query */
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';

import { ptBR } from 'date-fns/locale';
import { format } from 'date-fns';

import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const { isFallback } = useRouter();

  if (isFallback) {
    return <h1>Carregando...</h1>;
  }

  const readTime = Math.ceil(
    post.data.content.reduce((acc, curr) => {
      return (
        acc +
        (curr.heading ? curr.heading.split(' ').length : 0) +
        curr.body.reduce(
          (acc2, curr2) => acc2 + curr2.text.split(' ').length,
          0
        )
      );
    }, 0) / 200
  );

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetravelling.</title>
      </Head>

      <Header />

      <main className={commonStyles.container}>
        <img
          className={styles.bannerImage}
          src={post.data.banner.url}
          alt={post.data.title}
        />

        <article className={styles.postContainer}>
          <header>
            <h1>{post.data.title}</h1>
            <div>
              <FiCalendar className={styles.icon} />
              <time>
                {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </time>

              <FiUser className={styles.icon} />
              <span>{post.data.author}</span>

              <FiClock className={styles.icon} />
              <span>{readTime} min</span>
            </div>
          </header>

          <div>
            {post.data.content.map(content => (
              <section key={content.heading}>
                <h2>{content.heading}</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: RichText.asHtml(content.body),
                  }}
                />
              </section>
            ))}
          </div>
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.uid'],
      pageSize: 10,
    }
  );

  return {
    paths: posts.results.map(post => ({
      params: { slug: post.uid },
    })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', String(slug), {});

  return {
    props: {
      post: response,
    },
  };
};
