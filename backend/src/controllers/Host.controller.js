import Host from "../models/host.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

export const RegisterHost = async (req, res) => {
  try {
    const { name, email, password, village, address, phone } = req.body;

    // Validate all fields and uploaded images
    if (
      !name ||
      !email ||
      !password ||
      !village ||
      !address ||
      !phone ||
      !req.files ||
      !req.files.idProofImage ||
      !req.files.homestayImages
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields including ID proof and homestay images are required.",
      });
    }

    // Check if host already exists
    const existingHost = await Host.findOne({ email });
    if (existingHost) {
      return res.status(400).json({
        success: false,
        message: "Host already registered with this email.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload ID Proof to Cloudinary
    const idProofBuffer = req.files.idProofImage[0].buffer;
    const idProofImageUrl = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "hosts/id_proofs" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );
      uploadStream.end(idProofBuffer);
    });

    // Upload multiple homestay images
    const homestayImagesBuffers = req.files.homestayImages;
    const homestayImagesUrls = await Promise.all(
      homestayImagesBuffers.map((file, index) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "hosts/homestays" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          uploadStream.end(file.buffer);
        });
      })
    );

    // Create new host
    const newHost = new Host({
      name,
      email,
      phone,
      password: hashedPassword,
      village,
      address,
      idProofImage: idProofImageUrl,
      homestayImages: homestayImagesUrls,
    });

    await newHost.save();

    res.status(201).json({
      success: true,
      message: "Host registered successfully.",
      hostId: newHost._id,
    });
  } catch (err) {
    console.error("Host registration error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error during host registration.",
    });
  }
};

// user login
export const LoginHost = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    // Check if host exists
    const host = await Host.findOne({ email });
    if (!host) {
      return res.status(400).json({
        success: false,
        message: "Invalid login credentials.",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, host.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid login credentials.",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        _id: host._id,
        email: host.email,
        name: host.name,
        role:host.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set secure cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    // Prepare host data for response (without password)
    const hostData = host.toObject();
    delete hostData.password;

    res.status(200).json({
      success: true,
      message: "Login successful.",
      host: hostData,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login.",
    });
  }
};

// user logout
export const LogoutHost = async (req, res) => {
  try {
    res.clearCookie("jwt");

    res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    console.log("Error in logout controller ", error.message);
    req.status(500).json({ message: "Internal server error" });
  }
};
