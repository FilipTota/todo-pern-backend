import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import pool from "../database.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CLIENT_CALLBACK,
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, done) {
      try {
        const { id, displayName, emails } = profile;

        // Check if the user exists in the database
        const { rows } = await pool.query(
          'SELECT * FROM "user" WHERE google_id = $1',
          [id]
        );

        if (rows.length > 0) {
          // If the user exists, pass the user info
          return done(null, rows[0]);
        }

        // If the user doesn't exist, create a new record
        const newUser = await pool.query(
          'INSERT INTO "user" (google_id, username, email) VALUES ($1, $2, $3) RETURNING *',
          [id, displayName, emails[0].value]
        );

        return done(null, newUser.rows[0]);
      } catch (error) {
        console.error("Error during authentication:", error);
        return done(error);
      }
    }
  )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.google_id);
});

// Deserialize user from session
passport.deserializeUser(async (google_id, done) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM "user" WHERE google_id = $1',
      [google_id]
    );
    done(null, rows[0]);
  } catch (error) {
    done(error);
  }
});
