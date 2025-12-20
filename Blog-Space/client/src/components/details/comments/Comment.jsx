// Comments.js
import { useContext } from 'react';
// Comment.js
import { Box, Typography, styled, IconButton, Avatar } from "@mui/material";
import { Delete } from '@mui/icons-material';

import { API } from '../../../service/api';
import { DataContext } from "../../../context/DataProvider";

// Main comment box
const CommentBox = styled(Box)`
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 18px;
  display: flex;
  gap: 15px;
  border: 1px solid #edededff;
  box-shadow: 0 2px 6px rgba(98, 98, 98, 0.02);

  @media (max-width: 600px) {
    padding: 12px;
    gap: 12px;
  }
`;

// Content wrapper
const CommentContent = styled(Box)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// Header: Name and Date
const CommentHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
`;

const CommentName = styled(Typography)`
  font-weight: 600;
  color: #111;
`;

const CommentDate = styled(Typography)`
  color: #777;
  font-size: 0.85rem;

  @media (max-width: 600px) {
    font-size: 0.8rem;
  }
`;

// Comment text
const CommentText = styled(Typography)`
  font-size: 1rem;
  color: #1f1f1f;
  white-space: pre-line;
  line-height: 1.6;
`;

// Footer for delete button
const CommentFooter = styled(Box)`
  display: flex;
  justify-content: flex-end;
`;

const Comment = ({ comment, setToggle }) => {
  const { account } = useContext(DataContext);

  const deleteComment = async () => {
    await API.deleteComment(comment._id);
    setToggle(prev => !prev);
  };

  const lines = comment.comments.split('\n');

  return (
    <CommentBox>
      <Avatar sx={{ bgcolor: '#eb1b1bff', width: 42, height: 42, fontWeight: 600 }}>
        {comment.name?.charAt(0)?.toUpperCase()}
      </Avatar>

      <CommentContent>

        {/* Top row: Name left, time right */}
        <CommentHeader>
          <CommentName>{comment.name}</CommentName>
          <CommentDate>{new Date(comment.date).toLocaleString()}</CommentDate>
        </CommentHeader>

        {/* Comment text — line separated */}
        <CommentText>
          {lines.map((line, idx) => (
            <span key={idx}>
              {line}
              <br />
            </span>
          ))}
        </CommentText>

        {/* Delete button bottom-right */}
        {comment.name === account.username && (
          <CommentFooter>
            <IconButton onClick={deleteComment} size="small">
              <Delete fontSize="small" sx={{ color: "#e00e0eff" }} />
            </IconButton>
          </CommentFooter>
        )}
      </CommentContent>
    </CommentBox>
  );
};

export default Comment;
