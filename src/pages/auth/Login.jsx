import 'react-tabs/style/react-tabs.css';
import React, { useReducer, useCallback, useEffect, useRef } from "react";
import Loader from "../../components/Loader";
import { authClient, websiteClient } from "../../utils/httpClient";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from '../../utils/toast';
import { FaMobileAlt } from 'react-icons/fa';
import { IoKeySharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { BsWhatsapp } from "react-icons/bs";

// useReducer to manage form state
const initialState = {
  loginForm: { mobile: "", otp: "" },
  formErrors: {},
  loader: false,
  user: {},
  otpSent: false,
  isOtpVerified: false,
  otpTimer: 60,
  canResend: false,
  otpDigits: Array(6).fill('')
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FORM":
      return { ...state, loginForm: { ...state.loginForm, [action.field]: action.value } };
    case "SET_ERRORS":
      return { ...state, formErrors: action.errors };
    case "SET_USER":
      return { ...state, user: action.user };
    case "SET_LOADER":
      return { ...state, loader: action.loader };
    case "SET_OTP_SENT":
      return { ...state, otpSent: action.value };
    case "SET_OTP_VERIFIED":
      return { ...state, isOtpVerified: action.value };
    case "SET_OTP_TIMER":
      return { ...state, otpTimer: action.value };
    case "SET_CAN_RESEND":
      return { ...state, canResend: action.value };
    case "SET_OTP_DIGITS":
      return { ...state, otpDigits: action.value };
    case "DECREMENT_OTP_TIMER": {
      const nextTimer = state.otpTimer - 1;
      return { ...state, otpTimer: nextTimer, canResend: nextTimer <= 0 };
    }
    default:
      return state;
  }
};

const Login = () => {
  const navigation = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const inputsRef = useRef([]);

  // OTP Countdown Timer
  useEffect(() => {
    let intervalId;
    if (state.otpSent && !state.isOtpVerified && state.otpTimer > 0) {
      intervalId = setInterval(() => {
        dispatch({ type: "DECREMENT_OTP_TIMER" });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [state.otpSent, state.isOtpVerified, state.otpTimer > 0]);

  const handleChange = useCallback((e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    dispatch({ type: "SET_FORM", field: e.target.name, value });
  }, []);

  const validateForm = () => {
    const errors = {};
    let formIsValid = true;

    if (!state.loginForm.mobile || state.loginForm.mobile.length !== 10) {
      formIsValid = false;
      errors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!state.isOtpVerified) {
      formIsValid = false;
      errors.otp = "Please verify your OTP before proceeding";
    }

    dispatch({ type: "SET_ERRORS", errors });
    return formIsValid;
  };


  // OTP Handlers
  const handleGetOTP = async () => {
    if (!state.loginForm.mobile || state.loginForm.mobile.length !== 10) {
      dispatch({
        type: "SET_ERRORS",
        errors: { mobile: 'Valid mobile number is required' }
      });
      return;
    }

    try {
      dispatch({ type: "SET_LOADER", loader: true });
      const { data } = await websiteClient.post('otp/request-otp', {
        mobile: state.loginForm.mobile
      });

      if (data?.code === 200) {
        toastSuccess('OTP sent to your mobile number');
        dispatch({ type: "SET_OTP_SENT", value: true });
        dispatch({ type: "SET_OTP_DIGITS", value: Array(6).fill('') });
        dispatch({ type: "SET_OTP_VERIFIED", value: false });
        dispatch({ type: "SET_OTP_TIMER", value: 60 });
        dispatch({ type: "SET_CAN_RESEND", value: false });
        inputsRef.current[0]?.focus();
      } else {
        toastError(data?.message || 'Failed to send OTP');
      }
    } catch (err) {
      toastError('Failed to send OTP. Please try again.');
    } finally {
      dispatch({ type: "SET_LOADER", loader: false });
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = state.otpDigits.join('');
    if (otpValue.length !== 6) {
      dispatch({
        type: "SET_ERRORS",
        errors: { otp: 'Please enter 6-digit OTP' }
      });
      return;
    }

    try {
      dispatch({ type: "SET_LOADER", loader: true });
      const { data } = await websiteClient.post('otp/verify-otp', {
        mobile: state.loginForm.mobile,
        otp: otpValue
      });

      if (data?.success || data?.code === 200) {
        toastSuccess('OTP verified successfully!');
        dispatch({ type: "SET_OTP_VERIFIED", value: true });
        dispatch({ type: "SET_FORM", field: 'otp', value: otpValue });
      } else {
        toastError(data?.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      toastError('Failed to verify OTP. Please try again.');
    } finally {
      dispatch({ type: "SET_LOADER", loader: false });
    }
  };

  const handleResendOTP = async () => {
    if (!state.loginForm.mobile) return;

    try {
      dispatch({ type: "SET_LOADER", loader: true });
      const { data } = await websiteClient.post('otp/request-otp', {
        mobile: state.loginForm.mobile
      });

      if (data?.code === 200) {
        toastSuccess('New OTP sent successfully!');
        dispatch({ type: "SET_OTP_DIGITS", value: Array(6).fill('') });
        dispatch({ type: "SET_OTP_VERIFIED", value: false });
        dispatch({ type: "SET_OTP_TIMER", value: 60 });
        dispatch({ type: "SET_CAN_RESEND", value: false });
        inputsRef.current[0]?.focus();
      } else {
        toastError(data?.message || 'Failed to resend OTP');
      }
    } catch (err) {
      toastError('Failed to resend OTP. Please try again.');
    } finally {
      dispatch({ type: "SET_LOADER", loader: false });
    }
  };

  // OTP Input Interaction
  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/\D/, '');

    // Only allow single digit input
    if (value && value.length > 1) return;

    const updated = [...state.otpDigits];
    updated[idx] = value;
    dispatch({ type: "SET_OTP_DIGITS", value: updated });

    // Move focus to next input if a digit was entered
    if (value && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      // If current input is empty, move to previous input
      if (!state.otpDigits[idx] && idx > 0) {
        inputsRef.current[idx - 1]?.focus();
      }
      // Clear current input
      const updated = [...state.otpDigits];
      updated[idx] = '';
      dispatch({ type: "SET_OTP_DIGITS", value: updated });
    }

    // Handle left arrow
    if (e.key === 'ArrowLeft' && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }

    // Handle right arrow
    if (e.key === 'ArrowRight' && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');

    if (paste.length === 6) {
      dispatch({ type: "SET_OTP_DIGITS", value: paste });
      inputsRef.current[5]?.focus();
    }
  };


  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch({ type: "SET_LOADER", loader: true });
      try {
        const response = await authClient.post('/builderLogin', {
          mobile: state.loginForm.mobile,
          otp: state.otpDigits.join('')
        });

        if (response.data.status) {
          toastSuccess('Logged in successfully!');
          localStorage.setItem('adminToken', response.data.data.token);
          window.dispatchEvent(new Event("tokenChanged"));
          dispatch({ type: "SET_USER", user: response.data.data });
          navigation('/dashboard');
        } else {
          localStorage.removeItem('adminToken');
          toastError("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.log('Error logging in:', error);
        if (error?.response?.data?.data) {
          const errors = error.response?.data?.data || {};
          const errorMessages = [];

          for (const key in errors) {
            if (Array.isArray(errors[key])) {
              errorMessages.push(...errors[key]);
            } else {
              errorMessages.push(errors[key]);
            }
          }

          errorMessages.forEach((message) => { toastError(message) });
        }
      } finally {
        dispatch({ type: "SET_LOADER", loader: false });
      }
    } else {
      toastError("Please fix the validation errors.");
    }
  }, [state.loginForm, state.otpDigits, state.isOtpVerified, navigation]);

  return (
    <>
      {state.loader && <Loader />}
      <main className="main">
        <div className="container">
          <div className='bg_logns'>
            <img src="/assets/images/houseBg.webp" alt="background" />
          </div>
          <div className="login-bg">
            <Link to="https://terraterri.com/">
<h2>Builder Logo</h2>
            </Link>
            <div className="loginInner">
              <div className="row align-items-center justify-content-center">
                <div className='col-md-5'>
                  <div className="buyr_login_txt">
                    <h2>Welcome! Time to manage your listings and reach more buyers.</h2>
                  </div>
                </div>
                <div className="col-md-5 tabHome">
                  <div className='adlogin_out'>
                    <div className="log" id="demo">
                      <h5 className='text-center'> Allience Builder Sign In</h5>
                      {/* <h6 className="SignUp">Sign In</h6> */}
                      <h2 className="anyTab">
                        <form className="formForm text-center" onSubmit={handleSubmit}>
                          <div className="form-group col-md-12">
                            <div className='row'>
                              <div className="col-md-8">
                                <input
                                  type="tel"
                                  inputMode="numeric"
                                  pattern="[0-9]{10}"
                                  maxLength={10}
                                  className={`form-control p-relative formContoler mt-2 ${state.formErrors.mobile ? 'is-invalid' : ''}`}
                                  placeholder="Mobile"
                                  name="mobile"
                                  value={state.loginForm.mobile || ''}
                                  onChange={handleChange}
                                  disabled={state.otpSent}
                                />
                                <BsWhatsapp className="pibuilding ic" />
                              </div>
                              <div className="col-md-4">
                                {!state.otpSent ? (
                                  <button
                                    type="button"
                                    className={`${state.loader || !state.loginForm.mobile || state.loginForm.mobile.length !== 10 ? 'cursor-not-allowed' : 'cursor-pointer'} gt-otp`}
                                    onClick={handleGetOTP}
                                    disabled={state.loader || !state.loginForm.mobile || state.loginForm.mobile.length !== 10}
                                  >
                                    {state.loader ? 'Sending...' : 'Get OTP'}
                                  </button>
                                ) : (
                                  <div className="verified-badge">
                                    {state.isOtpVerified ? '✓ Verified' : '✓ Sent'}
                                  </div>
                                )}
                              </div>
                            </div>
                            {state.formErrors.mobile && (
                              <div className="invalid-feedback d-block">{state.formErrors.mobile}</div>
                            )}
                          </div>

                          {state.otpSent && !state.isOtpVerified && (
                            <div className="form-group col-md-12">
                              <label className='white mt-3 mb-2 f-18 d-flex justify-content-start'>Enter OTP</label>
                              <div className="row align-items-center ">
                                <div className="col-md-8">
                                  <div className="d-flex gap-2 " onPaste={handleOtpPaste}>
                                    {state.otpDigits.map((d, idx) => (
                                      <input
                                        key={idx}
                                        type="text"
                                        maxLength="1"
                                        className={`form-control text-center p-0 pl-0 ${state.formErrors.otp ? 'is-invalid' : ''}`}
                                        value={d}
                                        onChange={(e) => handleOtpChange(e, idx)}
                                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                                        ref={(el) => (inputsRef.current[idx] = el)}
                                        style={{ width: '40px', height: '40px' }}
                                      />
                                    ))}
                                  </div>
                                  {state.formErrors.otp && (
                                    <div className="invalid-feedback d-block">{state.formErrors.otp}</div>
                                  )}
                                </div>
                                <div className="col-md-4 d-flex justify-content-center align-items-center">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-primary "
                                    onClick={handleVerifyOtp}
                                    disabled={state.loader || state.otpDigits.join('').length !== 6}
                                  >
                                    {state.loader ? 'Verifying...' : 'Verify OTP'}
                                  </button>
                                </div>
                              </div>
                              <div className="d-flex justify-content-between mt-2">
                                {state.otpTimer > 0 ? (
                                  <span className="white f-18">Resend OTP in {state.otpTimer}s</span>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-link p-0"
                                    onClick={handleResendOTP}
                                    disabled={!state.canResend || state.loader}
                                  >
                                    Resend OTP
                                  </button>
                                )}
                              </div>
                            </div>
                          )}

                          <button
                            className={`theme-btn ${!state.isOtpVerified ? 'cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={state.loader || !state.isOtpVerified}
                          >
                            {state.loader ? 'Signing In...' : 'Sign In'}
                          </button>
                          <p className="text-center mt-5 alreadyaccount">
                            New to Terraterri? -
                            <Link to="/">Sign up</Link>
                          </p>
                        </form>
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;