import { decode } from "base64-arraybuffer";
import express, { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { supabase } from "../config/supabase";
import { nanoid } from 'nanoid';
import {ImagesDao} from '../DAO'
import { ensureAuthenticated } from '../middlewares/authUser';
import { AuthenticatedRequest}  from '../types';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
router.post("/images",ensureAuthenticated, upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    const { user } = req as AuthenticatedRequest;
      
    if (!user) {
      return res.status(401).json({ error: '인증되지 않음' });
    }
    if (!file) {
      res.status(400).json({ message: "Please upload a file" });
      return;
    }

    const fileBase64 = decode(file.buffer.toString("base64"));
    let filename=nanoid(10)
    const { data, error } = await supabase.storage
      .from("images")
      .upload(filename, fileBase64, {
        contentType: "image/*",
      });

    if (error) {
      throw error;
    }

    const { data: image } = supabase.storage
      .from("images")
      .getPublicUrl(data.path);
    await ImagesDao.createUserImages(image.publicUrl );
    console.log(file);
    res.status(200).json({ image: image.publicUrl });
   
  }catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;