

import { createUser } from '../repositories/UserRepository.js';

const verifyOtp = async (req) => {
    const { otp } = req.body;
    const otpValue = typeof otp === 'object' ? otp.otp : otp;

    if (req.session.otp === otpValue) {
        req.session.otp = null;
        const { email, username, password } = req.session.userData;

        const newUser = await createUser({ email, username, password });

        return {
            success: true,
            user: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role,
            },
            message: 'User registered successfully'
        };
    } else {
        console.error('Invalid OTP:', req.session.otp, otp, otpValue);
        return { success: false, error: 'Invalid OTP' };
    }
};
const verifyForgotOtp = async (req) => {
    const { otp } = req.body;
    const otpValue = typeof otp === 'object' ? otp.otp : otp;
    
    if (req.session.forgototp == otpValue) {
        req.session.forgototp = null;
        return {
            success: true,
            message: 'User registered successfully'
        };
    } else {
        console.error('Invalid OTP1:', req.session.forgototp, otpValue);
        return { success: false, error: 'Invalid OTP' };
    }
};

export { verifyOtp ,verifyForgotOtp};
