import { hashSync } from "bcrypt"
import User from "../models/userSchema.js";
import dotenv from "dotenv";
dotenv.config();

const salt  = process.env.salt;


// --------------------Users 
export async function getUser(req, res) {
  const {_id} = req.body;
  const thisUser = await User.findOne({_id});
  res.status(200).send(thisUser);
}

export async function signUp(req, res) {
  try {
    const { email, password, firstName, lastName} = req.body;
  
    if (!email || (password && password.length < 8)) {
      res.status(400).send({
        message:
          "Email and password are required. Password must be 8 characters or long",
      });
      return;
    }

    // if (!firstName || !lastName) {
    //   res.status(400).send({
    //     message:
    //       "Full name is required",
    //   });
    //   return;
    // }

    const doc = await User.findOne({ email: email.toLowerCase() })
    if (doc) {
        res.status(401).send({message: "Email already exists. Please try logging in instead"})
        return;
    }

    
    const hashedPassword = hashSync(password, salt)
    
    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword || null,
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
  let user = await User.findOne({email: email.toLowerCase(), password: hashedPassword})
  if(!user) {
    res.status(401).send({message: "Invalid email or password"})
    return
  }
  res.send(user)
}

// export async function addUserInfo(req, res) {
//   const { id } = req.query;
//   try {
//     const filter = { id };
//     const update = { $set: req.body };
//     const options = { returnOriginal: false };
//     const updatedUser = await User.findOneAndUpdate(filter, update, options);
//     await getUsers(req, res);
//   } catch (error) {
//     res.status(500).send({ message: "Error updating user" });
//   }
// }
