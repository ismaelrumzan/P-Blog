const express = require("express");

const api = require("./api.js");

const authAdminUser = require("../../middlewares/index.js").authAdminUser;

const app = express.Router();


/// BLOG-POSTS ROUTES (define route -> call api -> return callback)
/*
    - IMPORTANT: ??
*/

/// GET ALL POSTS ROUTE
app.get("/blog-posts/get-all", authAdminUser, function(req, res) {
    if (!res.locals.authSuccess) {
        res.json({authSuccess: false});
    } else {
        api.getAllBlogPosts((apiResponse) => {
            apiResponse.authSuccess = true;
            res.json(apiResponse);
        })
    }
});

/// CREATE NEW POST ROUTE
app.post("/blog-posts/create-new", authAdminUser, function (req, res) {
    if (
        !req.body.title ||
        !req.body.urlTitle ||
        !req.body.dateTimestamp ||
        !req.body.tags ||
        !req.body.thumbnailImageUrl ||
        !req.body.markdownContent ||
        !req.body.seoTitleTag ||
        !req.body.seoMetaDescription
    ) {
        res.json({ submitError: false });
    } else if (!res.locals.authSuccess) {
        res.json({ authSuccess: false });
    } else {
        api.createNewBlogPost(
            req.body.title,
            req.body.urlTitle,
            req.body.dateTimestamp,
            req.body.tags,
            req.body.thumbnailImageUrl,
            req.body.markdownContent,
            req.body.seoTitleTag,
            req.body.seoMetaDescription,
            function (apiResponse) {
                apiResponse.authSuccess = true;
                res.json(apiResponse);
            }
        );
    }
});


module.exports = app;
