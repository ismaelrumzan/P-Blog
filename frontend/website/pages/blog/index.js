import { Component } from "react";
import moment from "moment";
import useSwr from "swr";
import Link from "next/link";
import Image from "next/image";

import Header from "../../components/header.js";
import Footer from "../../components/footer.js";
import HeadMetadata from "../../components/headMetadata";

import getAllBlogPost from "../../api/getAllBlogPosts";

const Posts = () => {
    const {data, error} = useSwr('/posts/get-all-blog-posts', getAllBlogPost, {revalidateOnFocus: false});

    if (error) {
        return <div>failed to load blog posts.</div>
    }

    if (!data) {
        return <div>loading...</div>
    }

    let posts =
        data.posts && !data.getDataError ?
        data.posts.map((post, index) => {
          return (
            <Link key={index} href={`/blog/${post.urlTitle}`}>
              <a>
                <div className="blog-posts-list-item">
                  <div className="blog-posts-thumbnail">
                    <Image src={post.thumbnailImageUrl} alt="dickbutt image unrelated to the post" height={65} width={65} quality={20}/>
                  </div>
                  <div className="blog-posts-list-item-title-and-date">
                    <h2>{post.title}</h2>
                    <div className="blog-posts-list-item-date">
                      <span>{moment.unix(post.dateTimestamp).format("MMMM Do, YYYY")}</span>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          )
        }) :
          <div className="blog-posts-get-data-error-msg">
            <span>An error occurred while fetching Posts.</span>
          </div>

    return (posts);
}

export default class extends Component {
    render() {
        return (
          <div className="layout-wrapper">
            <HeadMetadata
              title="Blog Posts | krehwell"
              metaDescription="List of all blog posts public on krehwell blog" />
            <Header />
            <div className="blog-posts-container">
              <h1>📰 Blog posts</h1>
              <div className="blog-posts-list">
                <Posts />
              </div>
            </div>
            <Footer />
          </div>
        );
    }
}
