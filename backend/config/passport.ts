import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import User, { IUser } from '../models/User';
import Logger from '../utils/logger';
import { UserSession } from '../interface/UserSession';


passport.serializeUser((user: UserSession, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    if (user) {
      const sessionUser: UserSession = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        googleId: user.googleId,
      };
      done(null, sessionUser);
    } else {
      done(null, null);
    }
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
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      const userSession: UserSession = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        googleId: user.googleId,
      };

      return done(null, userSession);
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
          const userSession: UserSession = {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            googleId: user.googleId,
          };
          return done(null, userSession);
        }

        // If not, create new user
        user = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0].value,
          avatar: profile.photos?.[0].value,
        });

        const userSession: UserSession = {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          googleId: user.googleId,
        };

        done(null, userSession);
      } catch (err) {
        Logger.error(`Error in Google Strategy: ${err}`);
        done(err, undefined);
      }
    }
  )
);

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { COOKIE_NAME } from '../utils/cookieUtils';

// ... existing imports ...

// JWT Strategy
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Extract JWT from cookie with fallback to Authorization header
const cookieExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[COOKIE_NAME];
  }
  // Fallback to Authorization header for backward compatibility
  if (!token && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      token = parts[1];
    }
  }
  return token;
};

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload.userId);

        if (user) {
          const userSession: UserSession = {
            id: user._id.toString(),
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            googleId: user.googleId,
          };
          return done(null, userSession);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export default passport;
