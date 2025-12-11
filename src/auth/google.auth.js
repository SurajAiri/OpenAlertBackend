import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// const googleAuthController = async (req, res) => {
//   const { token } = req.body;
//     console.log('Received token:', token);
//   if (!token) {
//     return res.status(400).json({ message: 'Token is required' });
//   }

//   try {
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
//     });

//     const payload = ticket.getPayload();
//     const { email, name, picture, sub: googleId } = payload;

//     // Here you can create or update the user in your database
//     // For example:
//     // const user = await UserService.findOrCreate({ googleId, email, name, picture });

//     // Generate a JWT token for your application
//     const jwtToken = jwt.sign({ googleId, email }, process.env.JWT_SECRET, {
//       expiresIn: '1h',
//     });

//     return res.status(200).json({
//       message: 'Authentication successful',
//       token: jwtToken,
//       user: { id: googleId, email, name, picture },
//     });
//   } catch (error) {
//     console.error('Google authentication error:', error);
//     return res.status(500).json({ message: 'Authentication failed', error });
//   }
// }

// you are supposed to check for validations and error handling in the controller
// Function to verify Google ID token and return user information
export default async function googleAuthProvider(idToken) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return {
    email: payload.email,
    name: payload.name,
    picture: payload.picture,
    uid: payload.sub,
    username: payload.email.split("@")[0],
    provider: "google",
  };
}
