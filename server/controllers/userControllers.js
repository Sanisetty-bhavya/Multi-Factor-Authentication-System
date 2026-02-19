const users = require("../models/userSchemas");
const userotp = require("../models/userOtp");
const nodemailer = require("nodemailer");
const bcrypt = require('bcrypt');
const KYC = require("../models/kycModel");


// email config
const tarnsporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


exports.userregister = async (req, res) => {
    const { fname, email, password, number } = req.body;

    if (!fname || !email || !password || !number) {
        return res.status(400).json({ error: "Please Enter All Input Data" });
    }

    try {
        const preuser = await users.findOne({ email });

        if (preuser) {
            return res.status(400).json({ error: "This User Already Exists in our database" });
        } else {
            const userregister = new users({
                fname, email, password, number
            });

            // Here you can add password hashing if required

            const storeData = await userregister.save();
            res.status(200).json(storeData);
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error });
    }
};


// user send otp


exports.userOtpSend = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Please provide both email and password" });
    }

    try {
        const user = await users.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Compare provided password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Generate OTP
        const OTP = Math.floor(100000 + Math.random() * 900000);
        const existingOTP = await userotp.findOne({ email });

        if (existingOTP) {
            await userotp.findByIdAndUpdate(existingOTP._id, { otp: OTP });
        } else {
            await userotp.create({ email, otp: OTP });
        }

        // Send OTP via email
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Sending Email For OTP Validation",
            text: `Your OTP: ${OTP}`
        };

        tarnsporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                return res.status(400).json({ error: "Failed to send OTP email" });
            } else {
                console.log("Email sent:", info.response);
                return res.status(200).json({ message: "OTP email sent successfully" });
            }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.userLogin = async(req,res)=>{
    const {email,otp} = req.body;

    if(!otp || !email){
        res.status(400).json({ error: "Please Enter Your OTP and email" })
    }

    try {
        const otpverification = await userotp.findOne({email:email});

        if(otpverification.otp === otp){
            const preuser = await users.findOne({email:email});

            // token generate
            const token = await preuser.generateAuthtoken();
           res.status(200).json({message:"User Login Succesfully Done",userToken:token});

        }else{
            res.status(400).json({error:"Invalid Otp"})
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }
}

exports.MobileVerification = async(req,res)=>{
    const {email,phoneno} = req.body;

    const user = await users.findOne({ email });

    // console.log(user);
    if(!email){
        res.status(400).json({ error: "Please Enter Your OTP and email" })
    }
    
    try {
        const mobile_no = user.number;
        console.log(mobile_no,phoneno);
        if(mobile_no !=  phoneno ){
            res.status(400).json({ error: "Mobile mismatch" });
            const token = await preuser.generateAuthtoken();
        }
        else{
            res.status(200).json({message:"User Login Succesfully Done",userToken:token});
        }
        
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }

}
exports.KYCdetails = async (req, res) => {
    const { fname, email, dob, gender, nationality, address } = req.body;

    if (!fname || !email || !dob || !gender || !nationality || !address) {
        return res.status(400).json({ error: "Please Enter All Required Fields" });
    }

    try {
        const newKYC = new KYC({
            fname, email, dob, gender, nationality, address
        });

        const savedKYC = await newKYC.save();
        res.status(200).json(savedKYC);
    } catch (error) {
        res.status(400).json({ error: "Failed to save KYC details", error });
    }
};