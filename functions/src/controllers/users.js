import { hashSync } from "bcrypt"
import User from "../models/userSchema.js";
import { salt } from "../../env.js";


export async function signUp(req, res) {
  try {
    const { email, password, firstName, lastName} = req.body;
  
    if (!email || (password && password.length < 8)) {
      res.status(400).send({
        message:
          "Email and password are required. Password must be 8 characters or longer",
      });
      return;
    }

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

export async function addUserInfo(req, res) {
  const { email } = req.query;
  try {
    const filter = { email };
    const update = { $set: req.body };
    const options = { returnOriginal: false };
    const updatedUser = await User.findOneAndUpdate(filter, update, options);
    if (updatedUser) {
      res.send(updatedUser);
    } else {
      res.status(404).send({ message: "No user found with the provided email." });
    }
  } catch (error) {
    console.error(error); 
    res.status(500).send({ message: "Error updating user", error: error });
  }
}
