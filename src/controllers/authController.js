import User from '../models/user.js';
import { Session } from '../models/session.js';

import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { createSession, setSessionCookies } from '../services/auth.js';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ ...req.body, password: hashPassword });

  const session = await createSession(newUser._id);
  setSessionCookies(res, session);

  res.status(201).json({
    status: 201,
    message: 'User registered successfully',
    data: newUser,
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'User not found');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await Session.deleteMany({ userId: user._id });
  const session = await createSession(user._id);
  setSessionCookies(res, session);

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;
  res.status(200).json({
    status: 200,
    message: 'User logged in successfully',
    data: {
      user: userWithoutPassword,
      accessToken: session.accessToken,
    },
  });
};

export const refreshUserSession = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Session or refresh token not found');
  }
  const session = await Session.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionExpired) {
    await Session.deleteOne({ _id: sessionId, refreshToken });
    res.clearCookie('sessionId');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    throw createHttpError(401, 'Session expired');
  }

  await Session.deleteOne({ _id: sessionId, refreshToken });

  const newSession = await createSession(session.userId);
  setSessionCookies(res, newSession);

  res.status(200).json({
    status: 200,
    message: 'Session refreshed',
    data: {
      accessToken: newSession.accessToken,
    },
  });
};

export const logoutUser = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }

  res.clearCookie('sessionId');
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
