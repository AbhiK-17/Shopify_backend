const express = require('express');
const app = express();
const {User} = require('./model/User');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan');



//Connectiong to database
mongoose.connect('mongodb://127.0.0.1:27017/ShopifyEcom')
.then(()=>{
    console.log('Connected to database');
}).catch((err)=>{
    console.log('database is not connected', err);

})



//middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

//task-1 -> create a register route
app.post('/register', async (req, res) => {
    try {
        const {name, email, password} = req.body;

        //check if any field is missing
        if (!name || !email || !password) {
            return res.status(400).json({message:'Some fields are missing'});
        }

        //check if the user already exists
        const isuserAlreadyExists = await User.findOne({email});
        if (isuserAlreadyExists) {
            return res.status(400).json({message:'User already exists'});
        }else{

            //hashing the password
            const salt = await bcrypt.genSaltSync(10);
            const hashedPassword = await bcrypt.hashSync(password, salt);

            //jwt token
            const token = jwt.sign({email},'supersecrete',{expiresIn:'365d'});

            //creating a new user
            await User.create({
                name,
                email,
                password:hashedPassword,
                token,
                role:'user'
            })
            return res.status(201).json({message:'User create successfully'});

        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Internal server error'});
    }
})

//task-2 -> Creating a login route
app.post('/login',async(req,res)=>{
try{
    const {email, password} = req.body;

    //check if any field is missing
    if(!email || !password ){
        return res.status(400).json({message:'Some fields are missing'});
    }

    //user exists or not
    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message:'User does not exists.Please register first'});
    }

    //compare the entered password with the hashed password
    const isPasswordMatched = await bcrypt.compareSync(password,user.password);
    is(!isPasswordMatched);{
        return res.status(400).json({message:'Password is incorrect'});
    }

    //successfully loged in
    return res.status(200).json({
        message:'user logged in successfully',
        id:user._id,
        name:user.name,
        email:user.email,
        token:user.token,
        role:user.role
    })
}catch(err){
    console.log(err);
    return res.status(500).json({message:'Internal server error'});
}
})



const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is connected to port ${PORT}.`);
})