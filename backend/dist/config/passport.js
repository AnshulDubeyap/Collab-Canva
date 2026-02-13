"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_local_1 = require("passport-local");
const User_1 = __importDefault(require("../models/User"));
const logger_1 = __importDefault(require("../utils/logger"));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await User_1.default.findById(id);
        done(null, user);
    }
    catch (err) {
        done(err, null);
    }
});
passport_1.default.use(new passport_local_1.Strategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
        // Check for user
        const user = await User_1.default.findOne({ email }).select('+password');
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
        return done(null, user);
    }
    catch (err) {
        logger_1.default.error(`Error in Local Strategy: ${err}`);
        return done(err);
    }
}));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let user = await User_1.default.findOne({ googleId: profile.id });
        if (user) {
            return done(null, user);
        }
        // If not, create new user
        user = await User_1.default.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value,
            avatar: profile.photos?.[0].value,
        });
        done(null, user);
    }
    catch (err) {
        logger_1.default.error(`Error in Google Strategy: ${err}`);
        done(err, undefined);
    }
}));
exports.default = passport_1.default;
