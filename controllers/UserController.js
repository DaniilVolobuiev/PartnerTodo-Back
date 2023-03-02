import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      { expiresIn: '30d' },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Not possible to register',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return req.status(404).json({
        message: 'User did not found',
      });
    }
    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
    if (!isValidPass) {
      return res.status(404).json({
        message: 'Wrong login or password',
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      { expiresIn: '30d' },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};
export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (error) {
    console.log(err);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};

export const assignPartnerName = async (req, res) => {
  try {
    const userMeId = req.userId;
    const { partnerName } = req.body;

    const userPartner = await UserModel.findOne({ fullName: partnerName });
    const userMe = await UserModel.findOne({ _id: userMeId });
    if (!userPartner || !userMe) {
      throw new Error(`Not possible to assign the user`);
    }
    userMe.partnerName = userPartner._id;
    await userMe.save();
    res.status(200).json({
      message: 'Partner name assigned successfully',
      userPartner,
      userMe,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
