const Blog = require('../models/blogModel'); // Import the Blog model
const Comment = require('../models/commentModel'); 
// Create a new blog
const createBlog = async (req, res) => {
  try {
    const { title, author, content } = req.body; // Destructure request body

    // Validation
    if (!title || !author || !content) {
      return res.status(400).json({ message: 'Title, author, and content are required.' });
    }

    // Create the blog record
    const newBlog = await Blog.create({ title, author, content });

    return res.status(201).json({
      message: 'Blog created successfully!',
      blog: newBlog,
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// Fetch all blogs


const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [{ model: Comment, as: 'comments' }],
    });

    return res.status(200).json({ blogs });
  } catch (error) {
    console.error('Error fetching blogs with comments:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


const getBlogComments = async (req, res) => {
  const blogId = req.params.id; // Get the blogId from the request parameters

  try {
    const blog = await Blog.findOne({
      where: { id: blogId }, // Find the blog by ID
      include: [{ model: Comment, as: 'comments' }], // Include associated comments
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' }); // Return 404 if blog is not found
    }

    // Return the blog with its associated comments
    return res.status(200).json({
      blog: {
        title: blog.title,
        author: blog.author,
        content: blog.content,
        comments: blog.comments, // Return comments as part of the response
      },
    });
  } catch (error) {
    console.error('Error fetching blog comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const addComment = async (req, res) => {
  try {
    const { blogId, content } = req.body;

    if (!blogId || !content) {
      return res.status(400).json({ message: 'Blog ID and content are required.' });
    }

    const blog = await Blog.findByPk(blogId);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }

    const comment = await Comment.create({ blogId, content });

    return res.status(201).json({
      message: 'Comment added successfully!',
      comment,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


// Delete a comment by commentId
// const deleteComment = async (req, res) => {
//   const { commentId } = req.params; // Get the commentId from the route parameters

//   try {
//     // Find the comment by its ID
//     const comment = await Comment.findByPk(commentId);

//     if (!comment) {
//       return res.status(404).json({ message: 'Comment not found.' });
//     }

//     // Delete the comment
//     await comment.destroy();

//     return res.status(200).json({ message: 'Comment deleted successfully.' });
//   } catch (error) {
//     console.error('Error deleting comment:', error);
//     return res.status(500).json({ message: 'Internal server error.' });
//   }
// };
const deleteComment = async (req, res) => {
  const { commentId } = req.params; // Get the commentId from the route parameters

  try {
    // Find the comment by its ID
    const comment = await Comment.findByPk(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found.' });
    }

    // Delete the comment
    await comment.destroy();

    // Respond with a success message and the deleted commentId
    return res.status(200).json({
      message: 'Comment deleted successfully.',
      deletedCommentId: commentId,
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};


module.exports = { createBlog, getBlogs ,addComment,deleteComment,getBlogComments};
