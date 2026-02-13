import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User';
import Logger from '../utils/logger';

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async (email: string, password: string, done: any) => {
    try {
      // Check for user
      const user = await User.findOne({ email }).select('+password');

      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      // Check if user has a password (might be OAuth only)
      if (!user.password) {
        return done(null, false, {
          message: 'Please log in with your social account',
        });
      }

      // Check password
      const isMatch = await (user as any).matchPassword(password);

      if (!isMatch) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      return done(null, user);
    } catch (err) {
      Logger.error(`Error in Local Strategy: ${err}`);
      return done(err);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:3000'}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // If not, create new user
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0].value,
          avatar: profile.photos?.[0].value,
        });

        done(null, user);
      } catch (err) {
        Logger.error(`Error in Google Strategy: ${err}`);
        done(err, undefined);
      }
    }
  )
);

export default passport;
