const express = require('express');

const blogController = require('../controllers/blogController');
const router = express.Router();


// Route to create attendance record
router.post('/createBlog', blogController.createBlog);
router.post('/blog/:blogId/addComment', blogController.addComment);

router.delete('/blog/:blogId/comment/:commentId',blogController.deleteComment);

// router.delete('/comment/:commentId', blogController.deleteComment);
// Route to get attendance for a specific date
router.get('/getBlogs', blogController.getBlogs);

router.get('/blog/:id/comments', blogController.getBlogComments);


module.exports = router;
