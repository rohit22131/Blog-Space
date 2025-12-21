import React, { useState, useEffect, useContext } from 'react';
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
import { AddCircle as Add } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../service/api';
import { categories } from '../../constants/data';
import { DataContext } from '../../context/DataProvider';
import axios from 'axios';
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

    // Large screens
    [theme.breakpoints.down("lg")]: {
        width: "90%",
        maxHeight: "55vh",
    },

    // Medium screens
    [theme.breakpoints.down("md")]: {
        width: "95%",
        maxHeight: "50vh",
        borderRadius: "10px",
    },

    // Small screens
    [theme.breakpoints.down("sm")]: {
        width: "100%",
        maxHeight: "240px",
        height: "50vh",
        borderRadius: "6px",
    },
}));


const FileUpload = styled(Box)(({ theme }) => ({
    border: '2px dashed #e0e0e0',
    borderRadius: '12px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: ACCENT,
    marginBottom: '20px',
    transition: 'all 0.2s',
    '&:hover': {
        borderColor: ACCENT,
        background: '#fff5f5'
    }
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

const PublishButton = styled(Button)(({ theme }) => ({
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
    username: '',
    categories: '',
    createdDate: new Date()
};

const CreatePost = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { account } = useContext(DataContext);

    const [post, setPost] = useState(initialPost);
    const [file, setFile] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(
        location.search?.split('=')[1] || 'All'
    );

    const url = post.picture || blogImg;

    useEffect(() => {
        const uploadImage = async () => {
            try {
                if (!file) return;

                const data = new FormData();
                data.append('file', file);

                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/file/upload`,
                    data,
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'multipart/form-data' }
                    }
                );

                setPost(prev => ({ ...prev, picture: response.data }));
            } catch (error) {
                console.error("Image upload failed:", error);
                toast.error("Image upload failed. Please try again.");
            }
        };


        uploadImage();
        setPost(prev => ({
            ...prev,
            categories: selectedCategory,
            username: account.username
        }));
    }, [file, selectedCategory, account.username]);

    const handleChange = e => setPost({ ...post, [e.target.name]: e.target.value });

    const savePost = async () => {
        if (!post.title.trim() || !post.description.trim()) {
            toast.error("Please fill Title and Description!");
            return;
        }
        await API.createPost(post);
        navigate('/');
    };

    return (
        <Container>
            <Heading>Create a New Blog</Heading>

            {url && <ImagePreview src={url} alt="preview" />}

            <FileUpload onClick={() => document.getElementById('fileInput').click()}>
                <Add fontSize="large" sx={{ mr: 1 }} />
                Upload Featured Image
            </FileUpload>
            <input
                type="file"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={e => setFile(e.target.files[0])}
            />

            <InputText
                placeholder="Blog Title..."
                name="title"
                value={post.title}
                onChange={handleChange}
            />

            <CategorySelect
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                fullWidth
            >
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

            <PublishButton onClick={savePost}>Publish</PublishButton>
        </Container>
    );
};

export default CreatePost;
