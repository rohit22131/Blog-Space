import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Grid,
  Paper,
  styled,
  Dialog,
  DialogContent,
  TextField,
  IconButton
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import PostAddIcon from "@mui/icons-material/PostAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { API } from "../../service/api";
import placeholder from "../../assets/blog1.jpg";
import { DataContext } from "../../context/DataProvider";

/* ================= STYLES ================= */

const ProfileContainer = styled(Box)`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const TopSection = styled(Paper)`
  display: flex;
  gap: 40px;
  padding: 36px;
  border-radius: 24px;
  margin-bottom: 40px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);

  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
  }
`;

const AvatarWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EditBtn = styled(Button)`
  margin-top: 16px;
  padding: 8px 16px;
  background: #e02635;
  color: #ffffff;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: none;
  border-radius: 8px;

  &:hover {
    background: #cb1b1b;
  }
`;

const LogoutBtn = styled(Button)`
  margin-top: 24px;
  width: 120px;
  border: 2px solid #e63946;
  color: #e63946;
  font-weight: 600;
  text-transform: none;
  border-radius: 10px;

  &:hover {
    background: #e63946;
    color: white;
  }
`;

const UserInfo = styled(Box)`
  flex: 1;
`;

const StatsContainer = styled(Box)`
  display: flex;
  gap: 20px;
  margin-top: 24px;

  @media (max-width: 600px) {
    justify-content: space-between;
  }
`;

const StatBox = styled(Box)`
  flex: 1;
  background: white;
  border-radius: 16px;
  padding: 14px;
  text-align: center;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
`;

const PostCard = styled(Paper)`
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.16);
  }
`;

const PostImage = styled("img")`
  width: 100%;
  height: 250px;
  object-fit: cover;
`;

const PostContent = styled(Box)`
  padding: 16px 18px 18px;

  .post-title {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
`;

/* ================= COMPONENT ================= */

const Profile = () => {
  const navigate = useNavigate();
  const { username: paramUsername } = useParams();
  const { account, setAccount } = useContext(DataContext);

  const isMyProfile = !paramUsername || paramUsername === account.username;
  const profileUsername = paramUsername || account.username;

  const [user, setUser] = useState({
    name: "",
    username: "",
    bio: "",
    followers: 0,
    following: 0,
    posts: 0
  });

  const [posts, setPosts] = useState([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

  /* -------- FETCH PROFILE -------- */

  useEffect(() => {
    if (isMyProfile && account?.username) {
      setUser({
        name: account.name,
        username: account.username,
        bio: account.bio || "",
        followers: 0,
        following: 0,
        posts: 0
      });
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await API.getUserProfile(profileUsername);

        if (response?.isSuccess) {
          setUser({
            name: response.data.name,
            username: response.data.username,
            bio: response.data.bio || "",
            followers: response.data.followers?.length || 0,
            following: response.data.following?.length || 0,
            posts: 0
          });
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, [profileUsername, account, isMyProfile]);

  /* -------- FETCH POSTS -------- */

  useEffect(() => {
    if (!profileUsername) return;

    const fetchPosts = async () => {
      try {
        const response = await API.getAllPosts({ username: profileUsername });

        if (response?.isSuccess) {
          setPosts(response.data);
          setUser(prev => ({ ...prev, posts: response.data.length }));
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, [profileUsername]);

  /* -------- EDIT PROFILE -------- */

  useEffect(() => {
    if (editOpen) {
      setEditName(user.name);
      setEditBio(user.bio || "");
    }
  }, [editOpen, user]);

  const handleProfileUpdate = async () => {
    const response = await API.updateUserProfile({
      name: editName,
      bio: editBio
    });

    if (response.isSuccess) {
      setUser(prev => ({ ...prev, name: editName, bio: editBio }));
      setAccount(prev => ({ ...prev, name: editName, bio: editBio }));
      setEditOpen(false);
    }
  };

  /* -------- LOGOUT -------- */

  const handleLogout = async () => {
    try {
      await API.logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("user");
      navigate("/account");
    }
  };

  /* ================= UI ================= */

  return (
    <ProfileContainer>
      <TopSection>
        <AvatarWrapper>
          <Avatar sx={{ width: 125, height: 125, bgcolor: "#d62828", fontSize: 48 }}>
            {user.name?.[0]}
          </Avatar>

          {isMyProfile && (
            <EditBtn startIcon={<EditIcon />} onClick={() => setEditOpen(true)}>
              Edit Profile
            </EditBtn>
          )}
        </AvatarWrapper>

        <UserInfo>
          <Typography variant="h4" fontWeight={800}>{user.name}</Typography>
          <Typography color="text.secondary">@{user.username}</Typography>

          <Typography my={2} color="#555">
            {user.bio || "No bio added yet"}
          </Typography>

          <StatsContainer>
            <StatBox>
              <PostAddIcon />
              <Typography fontWeight={600}>{user.posts}</Typography>
              <Typography variant="caption">Posts</Typography>
            </StatBox>

            <StatBox>
              <PeopleIcon />
              <Typography fontWeight={600}>{user.followers}</Typography>
              <Typography variant="caption">Followers</Typography>
            </StatBox>

            <StatBox>
              <PersonAddIcon />
              <Typography fontWeight={600}>{user.following}</Typography>
              <Typography variant="caption">Following</Typography>
            </StatBox>
          </StatsContainer>

          {isMyProfile && <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>}
        </UserInfo>
      </TopSection>

      {/* POSTS */}
      <Typography variant="h5" fontWeight={700} mb={3}>
        {isMyProfile ? "My Posts" : "Posts"}
      </Typography>

      <Grid container spacing={3}>
        {posts.map(post => (
          <Grid item xs={12} sm={6} md={4} key={post._id}>
            <PostCard onClick={() => navigate(`/details/${post._id}`)}>
              <PostImage src={post.picture || placeholder} />
              <PostContent>
                <Typography className="post-title" fontWeight={700}>
                  {post.title}
                </Typography>
              </PostContent>
            </PostCard>
          </Grid>
        ))}
      </Grid>

      {/* EDIT PROFILE MODAL */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 50px rgba(0,0,0,0.18)",
            overflow: "hidden"
          }
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            px: 3,
            py: 2,
            background: "linear-gradient(135deg, #e63946, #d62828)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <Typography fontWeight={600} fontSize={18}>
            Edit Profile
          </Typography>

          <IconButton
            onClick={() => setEditOpen(false)}
            sx={{
              color: "#fff",
              "&:hover": {
                background: "rgba(255,255,255,0.15)"
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* CONTENT */}
        <DialogContent
          sx={{
            px: 4,
            py: 3,
            background: "#fafafa"
          }}
        >
          <TextField
            label="Full Name"
            fullWidth
            value={editName}
            onChange={e => setEditName(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2
              }
            }}
          />

          <TextField
            label="Bio"
            fullWidth
            multiline
            rows={4}
            value={editBio}
            onChange={e => setEditBio(e.target.value)}
            sx={{
              mb: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2
              }
            }}
          />

          {/* ACTION */}
          <Button
            variant="contained"
            onClick={handleProfileUpdate}
            sx={{
              ml: "auto",
              display: "block",
              background: "#e63946",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: 2,
              "&:hover": {
                background: "#d62828"
              }
            }}
          >
            Save Changes
          </Button>
        </DialogContent>
      </Dialog>

    </ProfileContainer>
  );
};

export default Profile;