// import googleAuthProvider from "../auth/google.auth.js";
import bcrypt from "bcryptjs";
import UserService from "../services/user.service.js";
import jwtService from "../services/jwt.service.js";
import { userCreationValidator } from "../validators/user.validator.js";

const UserAuthController = {
  async emailRegister(req, res) {
    const { email, password, username, firstName, lastName } = req.body;

    // if (!email || !password || !username || !firstName || !lastName) {
    //   return res.sendResponse(400, "All fields are required");
    // }

    try {
      // validate input
      const { error } = userCreationValidator.validate({
        email,
        password,
        username,
        firstName,
        lastName,
      });
      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.sendResponse(400, errorMessages);
      }
      // check if user already exists
      const existingUser = await UserService.getByEmail(email);
      if (existingUser) {
        return res.sendResponse(409, "User with this email already exists");
      }

      // create new user
      const newUser = await UserService.create({
        email,
        username,
        firstName,
        lastName,
        passwordHash: password,
      });

      if (!newUser) {
        return res.sendResponse(500, "Failed to create user");
      }

      return res.sendResponse(201, newUser, "User registered successfully");
    } catch (error) {
      console.error("User registration error:", error);
      return res.sendResponse(500, "User registration failed", error);
    }
  },
  async emailLogin(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendResponse(400, "email and password are required");
    }
    try {
      const user = await UserService.getByEmail(email);
      if (!user) {
        return res.sendResponse(404, "User not found");
      }

      // verify passwordHash (using bcrypt)
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        return res.sendResponse(401, "Invalid password");
      }
      // generate jwt token
      const jwtToken = jwtService.generateJWT(user);
      if (!jwtToken) {
        return res.sendResponse(500, "Failed to generate JWT token");
      }

      return res.sendResponse(
        200,
        { data: user, accessToken: jwtToken },
        "User logged in successfully"
      );
    } catch (error) {
      return res.sendResponse(500, "User login failed", error);
    }
  },

  async googleAuthCallback(req, res) {
    console.log("Google auth callback hit: ", req.body);
    return res.sendResponse(200, "Google auth callback hit");
  },

  async googleAuth(req, res) {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "ID token is required" });
    }

    try {
      const googleResponse = await googleAuthProvider(idToken);
      if (!googleResponse) {
        return res.status(401).json({ message: "Invalid ID token" });
      }

      // check if user exists in database
      let existingUser = await UserService.getByEmail(googleResponse.email);

      // if not create a new user (also check if email taken by developer)
      if (!existingUser) {
        // create a new user
        const newUser = await UserService.create({
          email: googleResponse.email,
          username: googleResponse.username,
          firstName: googleResponse.name.split(" ")[0],
          lastName: googleResponse.name.split(" ")[1] || "",
          isVerified: true,
        });
        if (!newUser) {
          return res.sendResponse(500, "Failed to create user");
        }
        existingUser = { ...newUser._doc, auth: "registered" };
      } else {
        existingUser = { ...existingUser._doc, auth: "login" };
      }

      // create jwt token for the user
      const jwtToken = jwtService.generateJWT(existingUser);
      if (!jwtToken) {
        return res.sendResponse(500, "Failed to generate JWT token");
      }

      return res.sendResponse(
        201,
        { data: existingUser, accessToken: jwtToken },
        "User authenticated successfully"
      );
    } catch (error) {
      // console.error("Google authentication error:", error);
      return res.sendResponse(401, "Invalid ID token", "Authentication failed");
    }
  },

  async logout(req, res) {
    // Since JWT is stateless, logout can be handled on the client side by deleting the token.
    // Optionally, you can implement token blacklisting on the server side if needed.
    return res.sendResponse(200, "User logged out successfully");
  },

  async refreshAccessToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.sendResponse(400, "Refresh token is required");
    }

    try {
      // Verify the refresh token
      const decoded = jwtService.verifyJWT(refreshToken);
      if (!decoded) {
        return res.sendResponse(401, "Invalid refresh token");
      }

      // Fetch the user from the database
      const user = await UserService.getById(decoded.id);
      if (!user) {
        return res.sendResponse(404, "User not found");
      }
      // todo: check if refresh token is valid in db
      // todo: create & update refresh token in db

      // Generate a new access token
      const newAccessToken = jwtService.generateJWT(user);
      if (!newAccessToken) {
        return res.sendResponse(500, "Failed to generate new access token");
      }

      return res.sendResponse(
        200,
        { accessToken: newAccessToken },
        "Access token refreshed successfully"
      );
    } catch (error) {
      return res.sendResponse(500, "Failed to refresh access token", error);
    }
  },

  async dummyLogin(req, res) {
    try {
      if (
        process.env.NODE_ENV !== "development" ||
        process.env.ENVIRONMENT !== "development"
      ) {
        return res.sendResponse(
          403,
          "Dummy login is only allowed in development mode"
        );
      }
      const { userId } = req.body;
      const user = await UserService.getById(userId);
      if (!user) {
        return res.sendResponse(404, "Dummy user not found");
      }
      const jwtToken = jwtService.generateJWT(user);
      if (!jwtToken) {
        return res.sendResponse(500, "Failed to generate JWT token");
      }
      return res.sendResponse(
        200,
        { data: user, accessToken: jwtToken },
        "Dummy user logged in successfully"
      );
    } catch (error) {
      return res.sendResponse(500, "Dummy login failed", error);
    }
  },
};

export default UserAuthController;
