import express, { Request, Response } from 'express';
const router = express.Router();
import axios from 'axios';
import multer from 'multer';
import { supabase } from "../config/supabase";
import { nanoid } from 'nanoid';
import {ImagesDao} from '../DAO'
import { decode } from 'base64-arraybuffer';
import  {AuthenticatedRequest}  from '../types';
import { ensureAuthenticated } from '../middlewares/authUser';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/combined-densenet', ensureAuthenticated, upload.single("file"), async (req: Request, res: Response) => {
    try {
        const { user } = req as AuthenticatedRequest;
        console.log("combined", user);
        const file = req.file;

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
        const existingUser = await ImagesDao.createUserImages(image.publicUrl );

        const response = await axios.post('http://localhost:5000/similarity', {
            image_url: image.publicUrl 
        });
        res.status(200).json({result: response.data, image_url: image.publicUrl });
       
      }catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Server Error' });
      }
});

export default router;