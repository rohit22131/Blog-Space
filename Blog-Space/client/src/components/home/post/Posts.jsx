import { Grid, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { API } from '../../../service/api';
import Post from './Post';

const Posts = ({ category }) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            let response;

            if (category) {
                // A specific category is selected
                response = await API.getAllPosts({ category });
            } else {
                // No filter -> load all posts
                response = await API.getAllPosts({});
            }

            if (response.isSuccess) {
                const sorted = response.data.sort(
                    (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
                );
                setPosts(sorted);
            }
        };

        fetchData();
    }, [category]);

    return (
        <Grid container spacing={3}>
            {posts.length ? (
                posts.map(post => (
                    <Grid item xs={12} key={post._id}>
                        <Post post={post} />
                    </Grid>
                ))
            ) : (
                <Box style={{ color: '#6b7280', fontSize: 20, marginTop: 40 }}>
                    No posts found in this category.
                </Box>
            )}
        </Grid>
    );
};

export default Posts;
