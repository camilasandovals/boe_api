import { hashSync } from "bcrypt"
import { ObjectId } from "mongodb";
import User from "../models/user.js";
// import jwt from "jsonwebtoken"
import dotenv from "dotenv";
dotenv.config();
// const secretKey  = process.env.secretKey;
const salt  = process.env.salt;
// --------------------Users 
export async function getUser(req, res) {
  const { id } = req.query;
  const thisUser = await User.findOne({id});
  res.status(200).send(thisUser);
}

export async function signUp(req, res) {
  try {
    const { email, password, uid } = req.body;
  
    if (!email || (password && password.length < 8)) {
      res.status(400).send({
        message:
          "Email and password are required. Password must be 8 characters or long",
      });
      return;
    }

    const doc = await User.findOne({ email: email.toLowerCase() })
    if (doc) {
        res.status(401).send({message: "Email already exists. Please try logging in instead"})
        return;
    }

    let hashedPassword = null
      
    if (password) hashedPassword = hashSync(password, salt)
    
    const newUser = new User({
      uid,
      _id: new ObjectId(uid),
      email: email.toLowerCase(),
      hashedPassword: hashedPassword || null,
    });

    const addUser = await newUser.save();

    res.status(201).send(addUser);
  } 
  catch (error) {
    res.status(500).json({
      error: [error.message],
      message: "an error",
    });
  }
}

export async function login(req, res) {
  const {email, password} = req.body
  if(!email || !password) {
    res.status(400).send({message: 'Email and password both required'})
    return
  }
  const hashedPassword = hashSync(password, salt)
  let user = await User.findOne({email: email.toLowerCase(), hashedPassword: hashedPassword})
  if(!user) {
    res.status(401).send({message: "Invalid email or password"})
    return
  }
  delete user.hashedPassword
  res.send(user)
}

export async function addUserInfo(req, res) {
  const { id } = req.query;
  try {
    const filter = { id };
    const update = { $set: req.body };
    const options = { returnOriginal: false };
    const updatedUser = await User.findOneAndUpdate(filter, update, options);
    await getUsers(req, res);
  } catch (error) {
    res.status(500).send({ message: "Error updating user" });
  }
}
