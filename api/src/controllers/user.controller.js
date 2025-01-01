import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.model.js";
import { Assignment } from "../models/Assignment.model.js";
import bcrypt from 'bcryptjs'
import jwt from "jsonwebtoken"
import cookieParser from 'cookie-parser'



const salt = bcrypt.genSaltSync(10);
const secret = "jn4k5n6n5nnn6oi4n";



const registerUser= asyncHandler( async (req,res) =>{
    console.log(req.body);
        
        const { username, password } = req.body;
        try {
          const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
          });
          res.json(userDoc);
        } catch (error) {
          res.status(400).json(error);
        }
})

const header=asyncHandler( async (req,res) =>{
    const { token } = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if (err) throw err;
        res.json(info);
    });
})

const loginUser=asyncHandler( async (req,res) =>{
    const { username, password } = req.body;
    try {
        const userDoc = await User.findOne({ username });
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if (passOk) {
        // logged in
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json({
            id: userDoc._id,
            username,
            });
        });
        } else {
        res.status(400).json("wrong credentials");
        }
    } catch (error) {
        res.status(500).json(error);
    }
})

const logoutUser= asyncHandler( async (req,res) =>{
    res.cookie("token", "").json("ok you are logout");
})

const postAssignment= asyncHandler( async (req,res) =>{
    const { token } = req.cookies;
        jwt.verify(token, secret, {}, async(err, info) => {
          if (err) throw err;
          const {title, description,dueDate,aura_point} = req.body
          const assignmnetDoc= await Assignment.create({
            title,
            description,
            dueDate,
            aura_point,
            author:info.id,
          })
          res.json(assignmnetDoc)
        })
})

const getAssignment= asyncHandler( async (req, res) =>{
        const assignments = await Assignment.find()
      .populate("author",['username'])
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(assignments);
})

const getAssignmentById= asyncHandler( async (req,res) =>{
    const {id} = req.params;
    const assignmentDoc = await Assignment.findById(id).populate('author',['username'])
    res.json(assignmentDoc)
})

const editAssignment = asyncHandler( async (req,res) =>{
    const { token } = req.cookies;
      jwt.verify(token, secret, {}, async (err, info) => {
          if (err) throw err;
          const {id, title, description,dueDate,aura_point} = req.body
          const assignmentDoc = await Assignment.findById(id);
          const isAuthor= JSON.stringify(assignmentDoc.author)===JSON.stringify(info.id)
          if( !isAuthor ){
              return res.status(400).json('you are not the author');
          }
    
          await assignmentDoc.updateOne({title, description,dueDate,aura_point})
    
          res.json(assignmentDoc);
       });
})


export { registerUser, loginUser, logoutUser, getAssignment, getAssignmentById, postAssignment, header, editAssignment}