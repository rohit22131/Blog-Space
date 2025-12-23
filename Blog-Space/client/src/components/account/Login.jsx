import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Box,
  Button,
  Typography,
  styled,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API } from "../../service/api";
import { DataContext } from "../../context/DataProvider";
import logo from "../../assets/blog_space_3-removebg-preview.png";

/* ================= STYLES ================= */

const OuterWrapper = styled(Box)`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f0f0, #dbdbdb);
`;

const Card = styled(Paper)`
  width: 380px;
  padding: 32px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
`;

const Logo = styled("img")({
  width: 220,
  display: "block",
  margin: "0 auto 8px auto",
});

const FieldWrapper = styled(Box)`
  display: flex;
  flex-direction: column;

  & > div {
    margin-top: 18px;
  }

  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: #e63946;
  }
  .MuiInputLabel-root.Mui-focused {
    color: #e63946;
  }
`;

const LoginBtn = styled(Button)`
  margin-top: 28px;
  padding: 12px;
  background: #e63946;
  color: white;
  text-transform: none;
  border-radius: 10px;
  font-weight: 600;

  &:hover {
    background: #d62828;
  }
`;

const SwitchBtn = styled(Button)`
  margin-top: 18px;
  padding: 12px;
  text-transform: none;
  border-radius: 10px;
  font-weight: 600;
  border: 1.5px solid #e63946;
  color: #e63946;

  &:hover {
    background: rgba(230, 57, 70, 0.08);
  }
`;

const ErrorText = styled(Typography)`
  margin-top: 8px;
  font-size: 12px;
  color: #e63946;
  text-align: center;
`;

/* ================= LOGIC ================= */

const loginInitial = { username: "", password: "" };
const signupInitial = { name: "", username: "", password: "" };

const Login = ({ setIsAuthenticated }) => {
  const [login, setLogin] = useState(loginInitial);
  const [signup, setSignup] = useState(signupInitial);
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");

  const { setAccount } = useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    setError("");
  }, [login, signup]);

  const onLoginChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const onSignupChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  /* ================= LOGIN ================= */
const loginUser = async () => {
  try {
    const response = await API.userLogin(login);

    if (response.isSuccess) {
      setAccount(response.data);
      setIsAuthenticated(true);
      toast.success("Login Successful!");
      navigate("/", { replace: true });
      return;
    }

    toast.error("Invalid username or password");
  } catch {
    toast.error("Invalid username or password");
  }
};

  /* ================= SIGNUP ================= */
  const signupUser = async () => {
    try {
      const response = await API.userSignup(signup);
      if (response.isSuccess) {
        toast.success("Account created successfully!");
        setMode("login");
      } else {
        setError("Something went wrong. Try again!");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <OuterWrapper>
      <Card>
        <Logo src={logo} alt="logo" />

        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: 700, mb: 2 }}
        >
          {mode === "login" ? "Welcome Back" : "Create Account"}
        </Typography>

        {/* LOGIN */}
        {mode === "login" && (
          <>
            <FieldWrapper>
              <TextField
                label="Username"
                name="username"
                value={login.username}
                onChange={onLoginChange}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                value={login.password}
                onChange={onLoginChange}
                fullWidth
              />
            </FieldWrapper>

            {error && <ErrorText>{error}</ErrorText>}

            <LoginBtn fullWidth onClick={loginUser}>
              Login
            </LoginBtn>

            <SwitchBtn fullWidth onClick={() => setMode("signup")}>
              Create an Account
            </SwitchBtn>
          </>
        )}

        {/* SIGNUP */}
        {mode === "signup" && (
          <>
            <FieldWrapper>
              <TextField
                label="Full Name"
                name="name"
                onChange={onSignupChange}
                fullWidth
              />
              <TextField
                label="Username"
                name="username"
                onChange={onSignupChange}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                onChange={onSignupChange}
                fullWidth
              />
            </FieldWrapper>

            {error && <ErrorText>{error}</ErrorText>}

            <LoginBtn fullWidth onClick={signupUser}>
              Sign Up
            </LoginBtn>

            <SwitchBtn fullWidth onClick={() => setMode("login")}>
              Already have an account?
            </SwitchBtn>
          </>
        )}
      </Card>
    </OuterWrapper>
  );
};

export default Login;
