import express from 'express';

import mongoose from 'mongoose';
import multer from 'multer';

import cors from 'cors';

import { loginValidation, registerValidation } from './validations.js';
import { postCreateValidation } from './validations.js';

import checkAuth from './utils/checkAuth.js';

import * as UserController from './controllers/UserController.js';
import * as PostController from './controllers/PostController.js';
import handleValidationError from './utils/handleValidationError.js';

mongoose
  .connect(
    'mongodb+srv://admin:qwerty123@cluster0.nbkqbmp.mongodb.net/blog?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('DB');
  })
  .catch((err) => console.log('DB error', err));

const app = express();
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());

app.post('/auth/login', loginValidation, handleValidationError, UserController.login);

app.post('/auth/register', registerValidation, handleValidationError, UserController.register);

app.put('/user/partner', checkAuth, UserController.assignPartnerName);

app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `uploads/${req.file.originalname}`,
  });
});

app.get('/posts', PostController.getAll);
// app.get('/posts/:id', PostController.getOne);
app.get('/posts/:user', PostController.getItemsByUser);
app.post('/posts', checkAuth, postCreateValidation, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, PostController.patchCard);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server OK');
});
