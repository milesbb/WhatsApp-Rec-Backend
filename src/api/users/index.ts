import express from 'express'
import createHttpError from 'http-errors'
import { JwtAuthenticationMiddleware, UserRequest } from './lib/jwtAuth'
import  UsersModel  from './model'
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";


const cloudinaryUploader = multer({
    storage: new CloudinaryStorage({
      cloudinary,
    }),
    limits: { fileSize: 1024 * 1024 },
  }).single("image");

const usersRouter = express.Router()

usersRouter.get("/:userName", JwtAuthenticationMiddleware, async(req,res,next) => {
    try {
        const user = await  UsersModel.find({
            userName: req.params.userName
        })
        if(user){
            res.status(200).send(user)
        }else{
            next(createHttpError(404,"there is no user with the userName provided"))
        }
        
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/:email", JwtAuthenticationMiddleware, async(req,res,next) => {
    try {
        const user = await  UsersModel.find({
            email: req.params.email
        })
        if(user){
            res.status(200).send(user)
        }else{
            next(createHttpError(404,"there is no user with the email provided"))
        }
        
    } catch (error) {
        next(error)
    }
})

usersRouter.get("/me", JwtAuthenticationMiddleware, async(req: UserRequest,res,next) => {
try {
    if(req.user){
        res.send(req.user)
    }else{
        createHttpError(404, "user not found")
    }
    
} catch (error) {
    next(error)
}
})

usersRouter.put("/me", JwtAuthenticationMiddleware, async (req: UserRequest, res, next) => {
    try {
      const updatedUser = await UsersModel.findByIdAndUpdate(req.user!._id, req.body, {
        new: true,
        runValidators: true,
      })
      res.send(updatedUser)
    } catch (error) {
      next(error)
    }
  })

  usersRouter.post("/me/avatar", JwtAuthenticationMiddleware, cloudinaryUploader, async(req, res ,next) => {
    try {
        const foundUser = await UsersModel.findByIdAndUpdate(
            req.params.userId,
            { imageUrl: req.file!.path },
            { new: true, runValidators: true }
          );
    
          res.status(201).send({ message: "User Pic Uploaded" });
    } catch (error) {
        next(error)
    }
  })

  usersRouter.get("/:userId", JwtAuthenticationMiddleware,async(req,res,next) => {
    try {
        const foundUser = await UsersModel.findById(req.params.userId)
        if(foundUser){
            res.status(200).send(foundUser)
        }else{
            createHttpError(404, `user with id ${req.params.userId} not found `)
        }
        
    } catch (error) {
        next(error)
    }
  })

usersRouter.post("/account", async(req,res,next) => {
    try {
        
        
    } catch (error) {
        next(error)
    }
})


export default usersRouter