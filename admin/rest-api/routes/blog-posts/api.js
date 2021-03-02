const moment = require("moment");
const randomstring = require("randomstring");

const BlogPostModel = require("../../models/post.js");

/// API ENDPOINT CODE HERE
module.exports = {

    /// GET ALL BLOG POST ACTIVE AND UPCOMING
    getAllBlogPosts: function (callback) {
        const now = moment().unix();

        BlogPostModel.find( { dateTimestamp: { $lte: now } }, "title id dateTimestamp tags")
            .sort({ dateTimestamp: -1 })
            .exec(function (activePostsError, activePosts) {
                if (activePostsError) {
                    callback({ getDataError: true });
                } else {
                    BlogPostModel.find( { dateTimestamp: { $gte: now } }, "title id dateTimestamp tags")
                        .sort({ dateTimestamp: -1 })
                        .exec(function (upcomingPostsError, upcomingPosts) {
                            if (upcomingPostsError) {
                                callback({ getDataError: true });
                            } else {
                                callback({
                                    success: true,
                                    activePosts: activePosts,
                                    upcomingPosts: upcomingPosts,
                                });
                            }
                        });
                }
            });
    },

    /// CREATE NEW POST
    createNewBlogPost: function (title, urlTitle, dateTimestamp, tags, thumbnailImageUrl, markdownContent, seoTitleTag, seoMetaDescription, callback) {
        BlogPostModel
            .findOne({ $or: [{ title: title }, { urlTitle: urlTitle }] })
            .exec(function (error, post) {
                if (error) {
                    callback({submitError: true});
                } else if (post) {
                    callback({alreadyExistsError: true});
                } else {
                    const arrayOfTags = tags.split(",").map(tag => tag.trim());

                    const newBlogPost = new BlogPostModel({
                        id: randomstring.generate(12),
                        title,
                        urlTitle,
                        dateTimestamp,
                        tags: arrayOfTags,
                        thumbnailImageUrl,
                        markdownContent,
                        seoTitleTag,
                        seoMetaDescription,
                        callback,
                    });

                    newBlogPost.save(error => {
                        if (error) {
                            callback({submitError: true});
                        } else {
                            callback({success: true});
                        }
                    })
                }
            });
    },

};
