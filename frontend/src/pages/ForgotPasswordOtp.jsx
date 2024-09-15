import React, { useState, useEffect } from 'react';
import { useVerifyForgotOtpMutation, useResendOtpMutation } from '../store/userApiSlice';
import { useNavigate } from 'react-router-dom';
import {useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import emaillogo from '../assets/download.png';


const ForgotPasswordOtp = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(null);
    const [timer, setTimer] = useState(30);
    const [showResend, setShowResend] = useState(false);
    const [verifyOtp, { isLoading }] = useVerifyForgotOtpMutation();
    const [resendOtp, { isLoading: resendLoading }] = useResendOtpMutation();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate('/');
        }
    }, [navigate, userInfo]);

    useEffect(() => {
        if (timer > 0) {
            const countdown = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(countdown);
        } else {
            setShowResend(true);
        }
    }, [timer]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await verifyOtp({ otp }).unwrap();
            toast.success('OTP Verified! Redirecting to reset password...');
            navigate('/reset-password');
        } catch (err) {
            setError(err.data?.error || 'Invalide OTP');
        }
    };

    const handleResendOtp = async () => {
        try {
            await resendOtp().unwrap();
            toast.success('OTP has been resent to your email.');
            setTimer(30);
            setShowResend(false);
        } catch (err) {
            toast.error('Failed to resend OTP');
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center min-vh-50">
            <div className="card text-center">
                <div className="card-header p-5">
                    <img src={emaillogo} alt="Logo" className='w-25' />
                    <h5 className="mb-2">OTP VERIFICATION</h5>
                    <div>
                        <small>Code has been sent to your email</small>
                    </div>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div id="otpForm" className="form-control border-0 input-container d-flex flex-row justify-content-center mt-2">
                        <input
                            type="text"
                            className="text-center form-control rounded w-50"
                            name="otp"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                    </div>

                    <div className="resend mt-3">
                        <small>
                            Didn't get the OTP?
                            {showResend ? (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="btn btn-link text-decoration-none p-0"
                                    disabled={resendLoading}
                                >
                                    Resend
                                </button>
                            ) : (
                                <span id="timer">
                                    Resend after {timer} seconds
                                </span>
                            )}
                        </small>
                    </div>

                    <div className="mt-3 mb-5">
                        <button className="btn btn-success px-4" type="submit" disabled={isLoading}>
                            Verify
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPasswordOtp;
