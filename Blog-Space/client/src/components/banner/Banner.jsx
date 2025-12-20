import { styled, Box, Typography } from '@mui/material';
import bgbanner from "../../assets/blog-banner.jpg";

const Image = styled(Box)(({ theme }) => ({
    width: "100%",
    height: "47vh",
    background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)),
                 url(${bgbanner}) center/cover no-repeat`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "0 20px",

    [theme.breakpoints.down("md")]: {
        height: "45vh",
    },
    [theme.breakpoints.down("sm")]: {
        height: "40vh",
        padding: "0 10px",
    }
}));

const Heading = styled(Typography)(({ theme }) => ({
    fontSize: "80px",
    fontWeight: 700,
    background: "linear-gradient(90deg, #ffffff, #d1d1d1)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    letterSpacing: "5px",

    [theme.breakpoints.down("md")]: {
        fontSize: "55px",
        letterSpacing: "3px",
    },
    [theme.breakpoints.down("sm")]: {
        fontSize: "38px",
        letterSpacing: "2px",
    },
    [theme.breakpoints.down("xs")]: {
        fontSize: "32px",
        letterSpacing: "1px",
    }
}));

const Tagline = styled(Typography)(({ theme }) => ({
    marginTop: "20px",
    fontSize: "22px",
    color: "#f1f1f1",
    maxWidth: "650px",
    lineHeight: 1.5,

    [theme.breakpoints.down("md")]: {
        fontSize: "18px",
        maxWidth: "500px",
    },
    [theme.breakpoints.down("sm")]: {
        fontSize: "16px",
        maxWidth: "90%",
    }
}));

const SubHeading = styled(Typography)(({ theme }) => ({
    marginTop: "35px",
    padding: "8px 20px",
    background: "#ffffff",
    borderRadius: "6px",
    fontSize: "18px",
    fontWeight: 600,
    color: "#222",

    [theme.breakpoints.down("sm")]: {
        fontSize: "15px",
        padding: "6px 16px",
        marginTop: "20px",
    }
}));

const Banner = () => {
    return (
        <Image>
            <Heading>BLOG SPACE</Heading>

            <Tagline>
                Ideas, stories, coding guides, tech breakdowns, and everything
                that inspires a developer’s journey.
            </Tagline>
        </Image>
    );
}

export default Banner;
