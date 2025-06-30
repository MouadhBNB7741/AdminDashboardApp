import prisma from "../services/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/nodemailer";
import {
  registerSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  enable2FASchema,
  updateUserSchema,
  verify2FACodeSchema,
  verifyEmailSchema,
  adminCreateUserSchema,
} from "../validators/User";
import { randomBytes } from "crypto";
import speakeasy from "speakeasy";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

//TODO add logs as well
export const registerUser = async (req, res) => {
  try {
    const parsed = registerSchema.parse(req.body);

    const { email, phone, password, firstName, lastName, userType, language } =
      parsed;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        phone,
        password_hash: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        user_type: userType,
        language,
        status: "PENDING",
        dark_mode: false,
        email_verification_token: randomBytes(32).toString("hex"),
      },
    });

    const token = generateToken(newUser.id);

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${newUser.email_verification_token}`;

    try {
      await sendEmail({
        to: newUser.email,
        subject: "Verify Your Email Address",
        text: `Please click the following link to verify your email: ${verificationUrl}`,
        html: `<p>Please click the following link to verify your email:</p><a href="${verificationUrl}">Verify Email</a>`,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
    }

    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        userType: newUser.user_type,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        language: newUser.language,
        status: newUser.status,
        emailVerified: newUser.email_verified,
      },
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const { email, phone, password } = parsed;

    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone is required" });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    prisma.user
      .update({
        where: { id: user.id },
        data: { last_login: new Date() },
      })
      .catch((err) => {
        console.error("Failed to update last_login:", err);
      });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        userType: user.user_type,
        firstName: user.first_name,
        lastName: user.last_name,
        language: user.language,
        status: user.status,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }

    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        userType: user.user_type,
        firstName: user.first_name,
        lastName: user.last_name,
        language: user.language,
        status: user.status,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const parsed = forgotPasswordSchema.parse(req.body);
    const { email } = parsed;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const token = randomBytes(32).toString("hex");

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await prisma.passwordResetToken.create({
      data: {
        user_id: user.id,
        token,
        expires_at: expiresAt,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const message = `You are receiving this email because you (or someone else) have requested the reset of your password.\n\nPlease click on the following link, or paste it into your browser to complete the reset:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: message,
    });

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const parsed = resetPasswordSchema.parse(req.body);
    const { token, newPassword } = parsed;

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.used || new Date() > resetToken.expires_at) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: resetToken.user_id },
      data: { password_hash: hashedPassword },
    });

    await prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { used: true },
    });

    res.json({ message: "Password reset successful" });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const enableDisable2FA = async (req, res) => {
  try {
    const parsed = enable2FASchema.parse(req.body);
    const { userId, enable } = parsed;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (enable && !user.email_verified) {
      return res
        .status(400)
        .json({ error: "Email must be verified before enabling 2FA" });
    }

    let secretKey = user.User2FA?.secret_key;
    if (enable && !secretKey) {
      secretKey = speakeasy.generateSecret({ length: 20 }).base32;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        User2FA: enable
          ? {
              upsert: {
                create: { secret_key: secretKey },
                update: { is_enabled: true },
              },
            }
          : {
              update: { is_enabled: false },
            },
      },
      include: {
        User2FA: true,
      },
    });

    res.json({
      message: enable
        ? "2FA enabled successfully"
        : "2FA disabled successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        user_type: updatedUser.user_type,
        User2FA: {
          is_enabled: enable,
          hasSecret: !!updatedUser.User2FA?.secret_key,
        },
      },
      secretKey: enable ? secretKey : undefined,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const verify2FACode = async (req, res) => {
  try {
    const parsed = verify2FACodeSchema.parse(req.body);
    const { userId, code } = parsed;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { User2FA: true },
    });

    if (!user || !user.User2FA || !user.User2FA.is_enabled) {
      return res
        .status(400)
        .json({ error: "2FA is not enabled for this user" });
    }

    const isValid = speakeasy.totp.verify({
      secret: user.User2FA.secret_key,
      encoding: "base32",
      token: code,
    });

    if (!isValid) {
      return res.status(400).json({ error: "Invalid 2FA code" });
    }

    const token = generateToken(userId);

    res.json({
      message: "2FA verified successfully",
      token,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const parsed = verifyEmailSchema.parse(req.query);
    const { token } = parsed;

    const user = await prisma.user.findFirst({
      where: {
        email_verification_token: token,
        email_verified: false,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        email_verified: true,
        email_verification_token: null,
        status: "ACTIVE",
      },
    });

    res.json({
      message: "Email verified successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        emailVerified: updatedUser.email_verified,
        status: updatedUser.status,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
      },
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
        first_name: true,
        last_name: true,
        user_type: true,
        status: true,
        email_verified: true,
        created_at: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        first_name: true,
        last_name: true,
        user_type: true,
        status: true,
        email_verified: true,
        phone_verified: true,
        language: true,
        dark_mode: true,
        created_at: true,
        updated_at: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const parsed = updateUserSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...parsed,
      },
    });

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export const createUserByAdmin = async (req, res) => {
  try {
    const parsed = adminCreateUserSchema.parse(req.body);

    const {
      email,
      phone,
      password,
      firstName,
      lastName,
      userType,
      language,
      status,
      darkMode,
      customerProfile,
      supplierProfile,
    } = parsed;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email or phone already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      email,
      phone,
      password_hash: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      user_type: userType,
      language,
      status,
      dark_mode: darkMode,
    };

    if (userType === "CUSTOMER" && customerProfile) {
      userData.CustomerProfile = {
        create: customerProfile,
      };
    }

    if (userType === "SUPPLIER" && supplierProfile) {
      userData.SupplierProfile = {
        create: supplierProfile,
      };
    }

    const newUser = await prisma.user.create({
      userData,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        userType: newUser.user_type,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        status: newUser.status,
        language: newUser.language,
        ...(newUser.CustomerProfile && {
          customerProfile: newUser.CustomerProfile,
        }),
        ...(newUser.SupplierProfile && {
          supplierProfile: newUser.SupplierProfile,
        }),
      },
    });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Server error" });
  }
};
