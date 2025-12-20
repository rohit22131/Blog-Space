// DetailView.js
import { useState, useEffect, useContext, useRef } from 'react';
import {
  Box,
  Typography,
  styled,
  IconButton,
  Divider,
  Avatar,
  Button,
  Modal
} from '@mui/material';
import {
  Delete,
  Edit,
  Favorite,
  FavoriteBorder,
  Comment as CommentIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { API } from '../../service/api';
import { DataContext } from '../../context/DataProvider';

import Comments from './comments/Comments';
import image from '../../assets/blog1.jpg';

/* -------------------- Layout -------------------- */

const Container = styled(Box)(({ theme }) => ({
  maxWidth: '1000px',
  margin: '40px auto',
  padding: '20px',
  borderRadius: '8px',
  background: '#fff',
  boxShadow: '0 4px 20px rgba(230, 57, 70, 0.08)',
  [theme.breakpoints.down('md')]: {
    padding: '15px',
    margin: '10px'
  }
}));

/* -------------------- RESPONSIVE IMAGE -------------------- */

const ImageWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '24px',
}));

const Image = styled('img')(({ theme }) => ({
  width: '80%',
  maxHeight: '70vh',
  height: 'auto',
  objectFit: 'cover',
  display: 'block',
  borderRadius: '8px',

  [theme.breakpoints.down('lg')]: {
    width: '90%',
    maxHeight: '65vh',
  },

  [theme.breakpoints.down('md')]: {
    width: '95%',
    maxHeight: '60vh',
    borderRadius: '8px',
  },

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    maxHeight: '260px',
    height: '60vh',
    borderRadius: '6px',
  },
}));

/* -------------------- UI Elements -------------------- */

const ActionBar = styled(Box)`
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
  gap: 20px;
`;

const IconBtn = styled(IconButton)`
  border: 1px solid #282828ff;
  border-radius: 10px;
  margin-top: 10px;
  padding: 6px;
  &:hover {
    background: #ffe5e5;
  }
`;

const Heading = styled(Typography)`
  font-size: 36px;
  font-weight: 700;
  margin: 25px 0 18px 0;
  color: #222;
`;

const AuthorBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: '20px',
  color: '#666',
  flexWrap: 'wrap', // allows items to wrap only if really needed

  [theme.breakpoints.down('sm')]: {
    gap: '10px',
    justifyContent: 'flex-start', // keep left alignment
  }
}));

const AuthorLeft = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',

  [theme.breakpoints.down('sm')]: {
    gap: '8px',
    flex: 1, // take available space so date stays on the same line
  }
}));


const LikeBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 15px;
`;

const ActionItem = styled(Box)`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ActionText = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: '#444',
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const LikeCount = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  color: '#444',
  display: 'none',
  [theme.breakpoints.down('sm')]: {
    display: 'block',
    fontSize: '0.9rem',
  },
}));

/* -------------------- Share Modal -------------------- */

const CenterBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '350px',
  background: '#ffffff',
  borderRadius: '16px',
  padding: '25px',
  boxShadow: '0px 8px 32px rgba(0,0,0,0.2)',
  textAlign: 'center',
}));

/* -------------------- Component -------------------- */

const DetailView = () => {
  const url = image;
  const [post, setPost] = useState({});
  const [shareOpen, setShareOpen] = useState(false);

  const { account } = useContext(DataContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const commentsRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const response = await API.getPostById(id);
      if (response.isSuccess) setPost(response.data);
    };
    fetchData();
  }, [id]);

  const deleteBlog = async () => {
    await API.deletePost(post._id);
    navigate('/');
  };

  const handleLike = async () => {
    const response = await API.toggleLike({ id: post._id });
    if (response.isSuccess) {
      setPost(prev => ({
        ...prev,
        likes: response.data.likes,
        likesCount: response.data.likesCount,
      }));
    }
  };

  const handleShareClick = () => {
    setShareOpen(true);
    navigator.clipboard.writeText(window.location.href);
  };

  const handleCommentClick = () => {
    commentsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const isLiked = post?.likes?.includes(account.username);
  const postUrl = window.location.href;
  const postTitle = post.title || '';

  return (
    <>
      <Container>

        {/* ✅ RESPONSIVE IMAGE */}
        <ImageWrapper>
          <Image src={post.picture || url} alt="post" />
        </ImageWrapper>

        <ActionBar>
          {account.username === post.username && (
            <>
              <Link to={`/update/${post._id}`}>
                <IconBtn>
                  <Edit sx={{ color: '#e63946' }} />
                </IconBtn>
              </Link>
              <IconBtn onClick={deleteBlog}>
                <Delete sx={{ color: '#d62828' }} />
              </IconBtn>
            </>
          )}
        </ActionBar>

        <Divider sx={{ my: 3 }} />

        <AuthorBox>
          <AuthorLeft>
            <Avatar sx={{ bgcolor: '#eb1b1bff' }}>
              {post.username?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Link to={`/?username=${post.username}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Typography fontSize="1.05rem" fontWeight={500}>
                {post.username}
              </Typography>
            </Link>
          </AuthorLeft>

          <Typography fontSize="0.9rem" color="#555" sx={{ whiteSpace: 'nowrap' }}>
            {new Date(post.createdDate).toDateString()}
          </Typography>
        </AuthorBox>


        <Divider sx={{ my: 3 }} />

        <Heading>{post.title}</Heading>

        <Typography sx={{ fontSize: '1.15rem', lineHeight: 1.8, color: '#444', whiteSpace: 'pre-line' }}>
          {post.description}
        </Typography>

        <Divider sx={{ my: 4 }} />

        <LikeBox>
          <ActionItem>
            <IconButton onClick={handleLike}>
              {isLiked ? <Favorite sx={{ color: '#e63946' }} /> : <FavoriteBorder sx={{ color: '#555' }} />}
            </IconButton>
            <ActionText>
              {post.likes?.length || 0} Likes
            </ActionText>
            <LikeCount>{post.likes?.length || 0}</LikeCount>
          </ActionItem>

          <ActionItem>
            <IconButton onClick={handleCommentClick}>
              <CommentIcon sx={{ color: '#555' }} />
            </IconButton>
            <ActionText>Comment</ActionText>
          </ActionItem>

          <ActionItem>
            <IconButton onClick={handleShareClick}>
              <ShareIcon sx={{ color: '#555' }} />
            </IconButton>
            <ActionText>Share</ActionText>
          </ActionItem>
        </LikeBox>

        <Divider sx={{ my: 4 }} />

        <Box ref={commentsRef}>
          <Comments post={post} />
        </Box>
      </Container>

      {/* SHARE MODAL */}
      <Modal open={shareOpen} onClose={() => setShareOpen(false)}>
        <CenterBox>
          <Typography variant="h6" mb={2} fontWeight={600}>Share Post</Typography>
          <Divider />

          <Box mt={3} display="flex" flexDirection="column" gap={2}>
            <Button variant="outlined" fullWidth onClick={() => navigator.clipboard.writeText(postUrl)}>
              🔗 Copy Link
            </Button>

            <Button variant="contained" sx={{ background: '#25D366' }} fullWidth
              onClick={() => window.open(`https://api.whatsapp.com/send?text=${postTitle} ${postUrl}`, '_blank')}>
              🟢 WhatsApp
            </Button>

            <Button variant="contained" sx={{ background: '#1DA1F2' }} fullWidth
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${postUrl}&text=${postTitle}`, '_blank')}>
              🔵 Twitter
            </Button>

            <Button variant="contained" sx={{ background: '#4267B2' }} fullWidth
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`, '_blank')}>
              🔵 Facebook
            </Button>
          </Box>
        </CenterBox>
      </Modal>
    </>
  );
};

export default DetailView;
