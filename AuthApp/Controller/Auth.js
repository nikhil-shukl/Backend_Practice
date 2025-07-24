const bcrypt = require('bcrypt');
const User = require("../Models/User");
const jwt = require("jsonwebtoken")

require("dotenv").config()

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({email});

        if(existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists",
            })
        }

        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);

        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            })
        }

        let user = await User.create({
            name,email,password:hashedPassword,role
        });

        return res.status(200).json({
            success : true,
            message : "User Created Successfully",
            data : user
        });
    }
    catch(err) {
        console.error(err)
        return res.status(500).jason({
            success:false,
            message:"user cannot be register, please try again later",
        })
    }
}

//Login
exports.login = async (req,res) => {
    try
    {
        const {email,password} = req.body;
        if(!email || !password)
        {
            return res.status(400).json({
                success:false,
                message: "please fill all the datails carefully",
            })
        }

        let user = await User.findOne({email});
        if(!user)
        {
            return res.status(401).json({
                success : false,
                message : "User does not exist",
            });
        }

        const payload = {
            email : user.email,
            id : user._id,
            role : user.role,
        };

        if(await bcrypt.compare(password,user.password)) {
            // password match
            let token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn : "2h",
            });

            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expires : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly : true,
            }

           res.cookie("token",token,options).status(200).json({
                success : true,
                token,
                user,
                message:"User logged in successfully"
            });

            res.status(200).json({
                success : true,
                token,
                user,
                message:"User loged in successfully"
                
            });
        }

        else {
            // password not match
            return res.status(403).json({
                success : false,
                password : "password not match",
            })
        }
    }
    catch(err){
        console.error(err)
        return res.status(500).json({
            success : false,
            message : "Login false"
        })
    }
}