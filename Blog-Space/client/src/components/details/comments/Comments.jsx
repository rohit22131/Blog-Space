// Comments.js
import { useState, useEffect, useContext } from 'react';
import { Box, TextareaAutosize, Button, styled, Avatar } from '@mui/material';

import { DataContext } from '../../../context/DataProvider';
import { API } from '../../../service/api';
import Comment from './Comment';

const CommentCard = styled(Box)`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: flex-start;
`;

const InputBox = styled(TextareaAutosize)`
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  border: 1px solid #cfcfcfff; 
  font-size: 16px;
  font-family: inherit;
  outline: none;
  resize: none;
  background: #ffffffff;
`;

const CommentsWrapper = styled(Box)`
  margin-top: 40px;
`;

const initialValue = {
  name: '',
  postId: '',
  date: new Date(),
  comments: ''
};

const Comments = ({ post }) => {
  const [comment, setComment] = useState(initialValue);
  const [comments, setComments] = useState([]);
  const [toggle, setToggle] = useState(false);

  const { account } = useContext(DataContext);

  // Load all comments + sort by latest first
  useEffect(() => {
    const fetch = async () => {
      const response = await API.getAllComments(post._id);
      if (response.isSuccess) {
        const sorted = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setComments(sorted);
      }
    };
    fetch();
  }, [post, toggle]);

  const handleChange = (e) => {
    setComment({
      ...comment,
      name: account.username,
      postId: post._id,
      comments: e.target.value
    });
  };

  const addComment = async () => {
    if (!comment.comments.trim()) return; // prevent empty posts

    await API.newComment(comment);

    setComment(initialValue);
    setToggle(prev => !prev);
  };

  return (
    <CommentsWrapper>

      {/* Add Comment Section */}
      <CommentCard>
        <Avatar
          src="https://static.thenounproject.com/png/12017-200.png"
          sx={{ width: 48, height: 48 }}
        />

        <InputBox
          minRows={4}
          placeholder="Write your comment here..."
          onChange={handleChange}
          value={comment.comments}
        />
      </CommentCard>

      <Button
        variant="contained"
        sx={{
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          background: '#e63946',
          color: '#fff',
          px: 3,
          py: 1,
          '&:hover': { background: '#d62828' },
          mb: 3
        }}
        onClick={addComment}
      >
        Post Comment
      </Button>

      {/* Display Comments */}
      <Box mt={4}>
        {comments?.map((c, i) => (
          <Comment key={i} comment={c} setToggle={setToggle} />
        ))}
      </Box>
    </CommentsWrapper>
  );
};

export default Comments;
