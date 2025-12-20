import { Grid, Box, Typography, styled, Select, MenuItem, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

// components
import Categories from './Categories';
import Posts from './post/Posts';
import { categories } from "../../constants/data";

const Wrapper = styled(Box)(({ theme }) => ({
    padding: "30px 40px",
    background: "#f4f6f8",
    minHeight: "100vh",
    [theme.breakpoints.down("sm")]: { padding: "20px" }
}));

const SidebarBox = styled(Box)(({ theme }) => ({
    background: "#ffffff",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { padding: "16px" }
}));

const Title = styled(Typography)`
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 18px;
    color: #111827;
`;

const TrendingCard = styled(Box)`display: flex; flex-direction: column; gap: 12px;`;
const TrendingItem = styled(Box)`
    padding: 12px 0;
    border-bottom: 1px solid #e5e7eb;
    cursor: pointer;
    transition: 0.3s ease;
    &:hover { padding-left: 6px; color: #e63946; }
`;

const CreateButton = styled(Button)`
    background: #e63946;
    color: #fff;
    padding: 10px 20px;
    font-weight: 600;
    margin-top: 18px;
    border-radius: 10px;
    width: 100%;
    text-transform: none;
    &:hover { background: #d62828; }
`;

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Initialize category from URL or empty (All)
    const queryCategory = new URLSearchParams(location.search).get('category') || '';
    const [selectedCategory, setSelectedCategory] = useState(queryCategory);

    // Update URL when category changes
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category) {
            navigate(`/?category=${category}`);
        } else {
            navigate(`/`);
        }
    };

    return (
        <>
            <Wrapper>
                <Grid container spacing={4}>

                    {/* LEFT SIDEBAR */}
                    <Grid item xs={12} md={3} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
                        <SidebarBox>
                            {/* CREATE BUTTON FOR DESKTOP */}
                            <CreateButton onClick={() => navigate("/create")} style={{ marginBottom: "20px", width: "200px", display: "block", marginLeft: "auto", marginRight: "auto" }}>
                                ➕ Create Blog
                            </CreateButton>

                            <Categories
                                selectedCategory={selectedCategory}
                                onSelectCategory={handleCategoryChange}
                            />
                        </SidebarBox>
                    </Grid>


                    {/* MOBILE DROPDOWN */}
                    <Grid item xs={12} sx={{ display: { xs: "block", md: "none" } }}>
                        <SidebarBox>
                            <Title>Select Category</Title>
                            <Select
                                fullWidth
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                displayEmpty
                                sx={{ borderRadius: "10px" }}
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                {categories.map((item) => (
                                    <MenuItem key={item.id} value={item.type}>
                                        {item.type}
                                    </MenuItem>
                                ))}
                            </Select>
                            <CreateButton onClick={() => navigate("/create")}>➕ Create Blog</CreateButton>
                        </SidebarBox>
                    </Grid>

                    {/* MAIN POSTS */}
                    <Grid item xs={12} md={6} lg={6}>
                        <Posts category={selectedCategory} />
                    </Grid>

                    {/* RIGHT SIDEBAR */}
                    <Grid item xs={12} md={3} lg={3}>
                        <SidebarBox>
                            <Title>🔥 Trending Posts</Title>
                            <TrendingCard>
                                <TrendingItem># React Best Practices 2025</TrendingItem>
                                <TrendingItem># Mastering MERN Auth</TrendingItem>
                                <TrendingItem># JavaScript Under The Hood</TrendingItem>
                                <TrendingItem># Node.js Scaling Guide</TrendingItem>
                                <TrendingItem># How to Grow as a Developer</TrendingItem>
                            </TrendingCard>
                        </SidebarBox>

                        <SidebarBox>
                            <Title>✨ Suggested Topics</Title>
                            <TrendingCard>
                                <TrendingItem>Frontend Development</TrendingItem>
                                <TrendingItem>Machine Learning</TrendingItem>
                                <TrendingItem>UI/UX Design</TrendingItem>
                                <TrendingItem>Cloud Deployment</TrendingItem>
                                <TrendingItem>Cybersecurity</TrendingItem>
                            </TrendingCard>
                        </SidebarBox>
                    </Grid>

                </Grid>
            </Wrapper>
        </>
    );
};

export default Home;
