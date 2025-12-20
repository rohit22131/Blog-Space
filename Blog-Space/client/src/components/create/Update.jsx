import React, { useState, useEffect } from 'react';
import {
    styled,
    Box,
    TextareaAutosize,
    Button,
    InputBase,
    Select,
    MenuItem,
    Typography
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { API } from '../../service/api';
import { categories } from '../../constants/data';
import blogImg from '../../assets/blog1.jpg';

const ACCENT = "#ef4444";

/* -------------------- Styled Components -------------------- */

const Container = styled(Box)(({ theme }) => ({
    maxWidth: '1000px',
    margin: '60px auto',
    padding: '20px',
    background: '#fff',
    [theme.breakpoints.down('sm')]: { margin: '20px 16px', padding: '16px' }
}));

const Heading = styled(Typography)`
    font-weight: 700;
    font-size: 1.8rem;
    margin-bottom: 24px;
    text-align: center;
`;

const ImagePreview = styled("img")(({ theme }) => ({
    width: "80%",
    maxHeight: "60vh",
    height: "auto",
    objectFit: "cover",
    display: "block",
    margin: "0 auto 20px auto",
    borderRadius: "12px",
    transition: "all 0.3s ease",

    [theme.breakpoints.down("lg")]: {
        width: "90%",
        maxHeight: "55vh",
    },
    [theme.breakpoints.down("md")]: {
        width: "95%",
        maxHeight: "50vh",
        borderRadius: "10px",
    },
    [theme.breakpoints.down("sm")]: {
        width: "100%",
        maxHeight: "240px",
        height: "50vh",
        borderRadius: "6px",
    },
}));

const InputText = styled(InputBase)(({ theme }) => ({
    width: '100%',
    fontSize: '22px',
    fontWeight: 600,
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    marginBottom: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    background: '#fff',
    [theme.breakpoints.down('sm')]: { fontSize: '18px', padding: '10px 12px' }
}));

const TextArea = styled(TextareaAutosize)(({ theme }) => ({
    width: '100%',
    minHeight: '250px',
    padding: '14px',
    fontSize: '16px',
    borderRadius: '12px',
    border: '1px solid #e0e0e0',
    background: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    resize: 'vertical',
    fontFamily: 'Roboto, sans-serif',
    marginBottom: '24px',
    '&:focus-visible': { outline: 'none', borderColor: ACCENT },
    [theme.breakpoints.down('sm')]: { minHeight: '150px' }
}));

const CategorySelect = styled(Select)(({ theme }) => ({
    borderRadius: '12px',
    background: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    marginBottom: '24px'
}));

const UpdateButton = styled(Button)(({ theme }) => ({
    width: '150px',
    padding: '10px',
    fontWeight: 600,
    fontSize: '16px',
    display: 'block',
    marginLeft: 'auto',
    borderRadius: '12px',
    textTransform: 'none',
    background: '#ef4444',
    color: '#fff',
    '&:hover': {
        background: '#e03030ff',
        boxShadow: '0 4px 12px rgba(214,40,40,0.35)'
    }
}));

/* -------------------- Component -------------------- */

const initialPost = {
    title: '',
    description: '',
    picture: '',
    username: 'codeforinterview',
    categories: 'General',
    createdDate: new Date()
};

const Update = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [post, setPost] = useState(initialPost);
    const defaultURL = blogImg;

    useEffect(() => {
        const fetchPost = async () => {
            const response = await API.getPostById(id);
            if (response.isSuccess) {
                setPost(response.data);
            }
        };
        fetchPost();
    }, [id]);

    const handleChange = e =>
        setPost({ ...post, [e.target.name]: e.target.value });

    const updateBlogPost = async () => {
        await API.updatePost({
            id: post._id,
            data: {
                title: post.title,
                description: post.description
            }
        });
        navigate(`/details/${id}`);
    };

    return (
        <Container>
            <Heading>Edit Blog</Heading>

            <ImagePreview src={post.picture || defaultURL} alt="preview" />


            <InputText
                value={post.title}
                name="title"
                placeholder="Blog Title..."
                onChange={handleChange}
            />

            <CategorySelect value={post.categories} disabled fullWidth>
                {categories.map(cat => (
                    <MenuItem key={cat.id} value={cat.type}>
                        {cat.type}
                    </MenuItem>
                ))}
            </CategorySelect>

            <TextArea
                placeholder="Write your story..."
                name="description"
                value={post.description}
                onChange={handleChange}
            />

            <UpdateButton onClick={updateBlogPost}>Edit</UpdateButton>
        </Container>
    );
};

export default Update;
