import { styled, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import image from '../../../assets/blog1.jpg';

const Container = styled(Box)`
  border-radius: 8px;
  margin-bottom: 30px;
  background: #ffffff;
  padding: 20px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  transition: 0.3s ease;
  &:hover {
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  }
`;

const Image = styled('img')({
  width: '100%',
  height: 'auto',
  display: 'block',
});

const Content = styled(Box)`
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Category = styled(Typography)`
  font-size: 12px;
  font-weight: 600;
  color: #e63946;
  text-transform: uppercase;
`;

const Title = styled(Typography)`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
`;

const Description = styled(Typography)`
  color: #374151;
  font-size: 14px;
  line-height: 1.5;
`;

const Author = styled(Typography)`
  color: #6b7280;
  font-size: 13px;
  margin-top: 12px;   /* adds space below description */
  align-self: flex-end; /* moves the author to the right */
`;

const Post = ({ post }) => {
    const url = post.picture || image;
    const addEllipsis = (str, limit) => str.length > limit ? str.substring(0, limit) + '...' : str;

    return (
        <Link to={`/details/${post._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Container>
                <Image src={url} alt="post" />
                <Content>
                    <Category>{post.categories}</Category>
                    <Title>{addEllipsis(post.title, 50)}</Title>
                    <Description>{addEllipsis(post.description, 180)}</Description>
                    <Author>By {post.username}</Author>
                </Content>
            </Container>
        </Link>
    );
};

export default Post;
