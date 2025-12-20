import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../model/user.js';

dotenv.config();

export const signupUser = async (request, response) => {
  try {
    const hashedPassword = await bcrypt.hash(request.body.password, 10);

    const user = { username: request.body.username, name: request.body.name, password: hashedPassword }

    const existingUser = await User.findOne({ username: request.body.username });
    if (existingUser) {
      return response.status(400).json({ msg: "Username already exists" });
    }

    const newUser = new User(user);
    await newUser.save();

    return response.status(200).json({ msg: 'Signup successfull' });
  } catch (error) {
    return response.status(500).json({ msg: 'Error while signing up user' });
  }
}


export const loginUser = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).json({ msg: "Invalid username" });

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid password" });

  const accessToken = jwt.sign(
    { id: user._id, username: user.username },
    process.env.ACCESS_SECRET_KEY,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id, username: user.username },
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: "7d" }
  );


  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 15 * 60 * 1000
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.status(200).json({
    name: user.name,
    username: user.username,
    bio: user.bio,
    avatar: user.avatar,
    loggedIn: true
  });
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });

    return res.status(200).json({ msg: "Logout successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Logout failed" });
  }
};


export const checkAuth = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.json({ loggedIn: false });

  try {
    jwt.verify(token, process.env.ACCESS_SECRET_KEY);
    return res.json({ loggedIn: true });
  } catch {
    return res.json({ loggedIn: false });
  }
};

export const updateUserProfile = async (request, response) => {
  try {
    const { name, bio } = request.body;

    await User.updateOne(
      { username: request.user.username },
      { $set: { name, bio } }
    );

    response.status(200).json({ message: "Profile updated" });
  } catch (error) {
    response.status(500).json(error);
  }
};