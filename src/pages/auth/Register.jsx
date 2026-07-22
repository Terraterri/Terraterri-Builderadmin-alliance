'use strict';

import { useEffect, useState, useRef } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { PiBuildings } from 'react-icons/pi';
import { IoIosMail } from 'react-icons/io';
import { FaMobileAlt } from 'react-icons/fa';
import { GiModernCity } from 'react-icons/gi';
import { TbBuildingEstate } from 'react-icons/tb';
import { Link, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import Loader from '../../components/Loader';
import { toastError, toastSuccess } from '../../utils/toast';
import { authClient, masterClient, websiteClient, expoAdminClient } from '../../utils/httpClient';
import { Country, State, City } from 'country-state-city';
import { BsWhatsapp } from "react-icons/bs";


/**
 * Register component (refactored)
 *  - Fixes OTP countdown/timer & resend
 *  - Deduplicates API helpers
 *  - Aligns code style & validation
 */

const Register = () => {
  const navigate = useNavigate();
  const inputsRef = useRef([]);

  // ─── UI State ────────────────────────────────────────────────────────────────
  const [formType, setFormType] = useState('Builder');
  const [form, setForm] = useState({ role_id: 'Builder' });
  const [formError, setFormError] = useState({});
  const [loading, setLoading] = useState(false);

  // ─── Location Dropdowns & Expos ─────────────────────────────────────────────
  const [expos, setExpos] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // ─── OTP State ──────────────────────────────────────────────────────────────
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [otpSent, setOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // ─── Constants ──────────────────────────────────────────────────────────────
  const registerAs = [
    { id: 6, name: 'Builder' },
    // { id: 7, name: 'Exclusive Sales Partner' },
    // { id: 8, name: 'Agent' },
    // { id: 9, name: 'Owner' },
  ];

  // ─────────────────────────────────────────────────────────────────────────────
  // Lifecycle Hooks
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchExposAndLocations = async () => {
      const allCountries = Country.getAllCountries();
      try {
        let expoList = [];
        const res = await expoAdminClient.get('/NewExpo/get.php?type=ongoing');
        if (res?.data?.status && Array.isArray(res.data.data) && res.data.data.length > 0) {
          expoList = res.data.data;
        } else {
          const resFallback = await expoAdminClient.get('/NewExpo/get.php');
          if (resFallback?.data?.status && Array.isArray(resFallback.data.data)) {
            expoList = resFallback.data.data;
          }
        }

        setExpos(expoList);

        if (expoList.length > 0) {
          const filteredCountries = allCountries.filter((c) =>
            expoList.some((e) => {
              const countryVal = e.expoCountry || e.country || e.country_code;
              return (
                countryVal &&
                (countryVal.toLowerCase() === c.isoCode.toLowerCase() ||
                  countryVal.toLowerCase() === c.name.toLowerCase())
              );
            })
          );
          setCountries(filteredCountries.length > 0 ? filteredCountries : allCountries);
        } else {
          setCountries(allCountries);
        }
      } catch (err) {
        console.error('Error fetching expos for registration locations:', err);
        setCountries(allCountries);
      }
    };

    fetchExposAndLocations();
  }, []);

  /**
   * Countdown for OTP – runs whenever an OTP is sent and not yet verified.
   * Uses functional setState to avoid stale closures.
   */
  useEffect(() => {
    let intervalId;
    if (otpSent && !isOtpVerified && otpTimer > 0) {
      intervalId = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            clearInterval(intervalId);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [otpSent, isOtpVerified, otpTimer > 0]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Helpers – API
  // ─────────────────────────────────────────────────────────────────────────────
  const api = {
    requestOtp: (data) => websiteClient.post('otp/request-otp', data),
    verifyOtp: (data) => websiteClient.post('otp/verify-otp', data),
    registerRequestOtp: (data) => websiteClient.post('otp/register-request-otp', data),

    register: (data) => authClient.post('register', data),
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers – Form & Tabs
  // ─────────────────────────────────────────────────────────────────────────────
  const handleTabs = (e) => {
    const role = e.target.innerHTML;
    if (formType !== role) {
      setFormType(role);
      setForm({ role_id: role });
      setFormError({});
      setStates([]);
      setCities([]);
      setOtp(Array(6).fill(''));
      setOtpSent(false);
      setIsOtpVerified(false);
    }
  };

  // ─── Location Matching Helpers ────────────────────────────────────────────────
  const isCityMatch = (c, expoCityStr) => {
    if (!c || !expoCityStr) return false;
    const cName = c.name.toLowerCase();
    const eCity = expoCityStr.toLowerCase().trim();

    if (cName === eCity || cName.startsWith(eCity) || eCity.startsWith(cName)) return true;
    if (eCity.length >= 3 && cName.startsWith(eCity.substring(0, 3))) return true;

    const cityCodeMap = {
      hyd: ['hyderabad'],
      vja: ['vijayawada'],
      viz: ['visakhapatnam', 'vizag'],
      vzg: ['visakhapatnam', 'vizag'],
      blr: ['bengaluru', 'bangalore'],
      che: ['chennai'],
      maa: ['chennai'],
      bom: ['mumbai'],
      mum: ['mumbai'],
      del: ['delhi', 'new delhi'],
      ccu: ['kolkata'],
      kol: ['kolkata'],
      pnq: ['pune'],
      pun: ['pune'],
      ahd: ['ahmedabad'],
      amd: ['ahmedabad'],
    };

    if (cityCodeMap[eCity] && cityCodeMap[eCity].some((alias) => cName.includes(alias))) {
      return true;
    }

    return false;
  };

  const isExpoInState = (e, countryCode, s) => {
    const countryVal = e.expoCountry || e.intCountry || e.country || e.country_code;
    const selectedCountryObj = Country.getAllCountries().find((c) => c.isoCode === countryCode);
    const matchCountry =
      !countryCode ||
      (countryVal &&
        (countryVal.toLowerCase() === countryCode.toLowerCase() ||
          (selectedCountryObj && countryVal.toLowerCase() === selectedCountryObj.name.toLowerCase())));

    if (!matchCountry) return false;

    const stateVal = e.expoState || e.state || e.state_code;
    if (stateVal) {
      return (
        stateVal.toLowerCase() === s.isoCode.toLowerCase() ||
        stateVal.toLowerCase() === s.name.toLowerCase()
      );
    }

    const expoCityStr = e.expoCity || e.intCity || e.city || e.city_code;
    if (expoCityStr) {
      const citiesInState = City.getCitiesOfState(countryCode, s.isoCode);
      return citiesInState.some((c) => isCityMatch(c, expoCityStr));
    }

    return true;
  };

  const isExpoInCity = (e, countryCode, stateCode, c) => {
    const selectedCountryObj = Country.getAllCountries().find((co) => co.isoCode === countryCode);
    const selectedStateObj = State.getStatesOfCountry(countryCode).find((st) => st.isoCode === stateCode);

    const countryVal = e.expoCountry || e.intCountry || e.country || e.country_code;
    const matchCountry =
      !countryCode ||
      (countryVal &&
        (countryVal.toLowerCase() === countryCode.toLowerCase() ||
          (selectedCountryObj && countryVal.toLowerCase() === selectedCountryObj.name.toLowerCase())));

    if (!matchCountry) return false;

    const stateVal = e.expoState || e.state || e.state_code;
    if (stateVal) {
      const matchState =
        stateVal.toLowerCase() === stateCode.toLowerCase() ||
        (selectedStateObj && stateVal.toLowerCase() === selectedStateObj.name.toLowerCase());
      if (!matchState) return false;
    }

    const expoCityStr = e.expoCity || e.intCity || e.city || e.city_code;
    if (expoCityStr) {
      return isCityMatch(c, expoCityStr);
    }

    return true;
  };

  const handleForm = (e) => {
    const { name, value, checked, type } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm((prev) => ({ ...prev, [name]: val }));

    if (name === 'country_code') {
      const st = State.getStatesOfCountry(value);
      let filteredStates = st;
      if (expos.length > 0) {
        filteredStates = st.filter((s) => expos.some((expo) => isExpoInState(expo, value, s)));
      }

      setStates(filteredStates.length > 0 ? filteredStates : st);
      setCities([]);
      setForm((prev) => ({ ...prev, state_code: '', city_code: '' }));
    }

    if (name === 'state_code') {
      const ct = City.getCitiesOfState(form.country_code, value);
      let filteredCities = ct;
      if (expos.length > 0) {
        filteredCities = ct.filter((c) => expos.some((expo) => isExpoInCity(expo, form.country_code, value, c)));
      }

      setCities(filteredCities.length > 0 ? filteredCities : ct);
      setForm((prev) => ({ ...prev, city_code: '' }));
    }
  };

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const error = {};
    let ok = true;

    if (formType !== 'Owner' && !form.company_name) {
      error.company_name = 'Company is required';
      ok = false;
    }
    if (!form.mobile) {
      error.mobile = 'Mobile is required';
      ok = false;
    } else if (form.mobile.length !== 10) {
      error.mobile = 'Mobile must be 10 digits';
      ok = false;
    }
    if (!form.email) {
      error.email = 'Email is required';
      ok = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      error.email = 'Email is invalid';
      ok = false;
    }
    if (!form.country_code) {
      error.country_code = 'Country is required';
      ok = false;
    }
    if (!form.state_code) {
      error.state_code = 'State is required';
      ok = false;
    }
    if (!form.city_code) {
      error.city_code = 'City is required';
      ok = false;
    }
    if (!isOtpVerified) {
      error.otp = 'Please verify your mobile number';
      ok = false;
    }
    if (!form.terms) {
      error.terms = 'Please agree to the terms';
      ok = false;
    }

    setFormError(error);
    return ok;
  };

  // ─── OTP Handlers ───────────────────────────────────────────────────────────
  const handleGetOTP = async () => {
    if (!form.mobile || form.mobile.length !== 10) {
      setFormError((prev) => ({ ...prev, mobile: 'Valid mobile is required' }));
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.registerRequestOtp({ mobile: form.mobile });
      if (data?.code === 200) {
        toastSuccess('OTP sent to your mobile number');
        setOtpSent(true);
        setOtp(Array(6).fill(''));
        setIsOtpVerified(false);
        setOtpTimer(60);
        setCanResend(false);
        inputsRef.current[0]?.focus();
      } else {
        toastError(data?.message || 'Failed to send OTP');
      }
    } catch (err) {
      toastError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setFormError((prev) => ({ ...prev, otp: 'Please enter 6‑digit OTP' }));
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.verifyOtp({ mobile: form.mobile, otp: otpValue });
      if (data?.success || data?.code === 200) {
        toastSuccess('OTP verified successfully!');
        setIsOtpVerified(true);
      } else {
        toastError(data?.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      toastError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!form.mobile) return;
    try {
      setLoading(true);
      const { data } = await api.requestOtp({ mobile: form.mobile });
      if (data?.code === 200) {
        toastSuccess('New OTP sent successfully!');
        setOtp(Array(6).fill(''));
        setIsOtpVerified(false);
        setOtpTimer(60);
        setCanResend(false);
        inputsRef.current[0]?.focus();
      } else {
        toastError(data?.message || 'Failed to resend OTP');
      }
    } catch (err) {
      toastError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── OTP Input Interaction ──────────────────────────────────────────────────
  const handleOtpChange = (e, idx) => {
    const value = e.target.value.replace(/\D/, '');

    // Only allow single digit input
    if (value && value.length > 1) return;

    const updated = [...otp];
    updated[idx] = value;
    setOtp(updated);

    // Move focus to next input if a digit was entered
    if (value && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, idx) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      // If current input is empty, move to previous input
      if (!otp[idx] && idx > 0) {
        inputsRef.current[idx - 1]?.focus();
      }
      // Clear current input
      const updated = [...otp];
      updated[idx] = '';
      setOtp(updated);
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
    const paste = e.clipboardData.getData('text')
      .slice(0, 6)
      .replace(/\D/g, '')
      .split('');

    if (paste.length === 6) {
      const updated = [...otp];
      paste.forEach((d, i) => (updated[i] = d));
      setOtp(updated);
      inputsRef.current[5]?.focus(); // Focus last input after paste
    }
  };


  // ─── Submit Registration ────────────────────────────────────────────────────
  const handleSubmit = async () => {

    if (!validate()) {
      toastError('Please fill all required fields correctly');
      return;
    }

    const roleId = 12;
    const payload = { ...form, role_id: roleId };

    try {
      setLoading(true);
      const { data } = await api.register(payload);
      if (data?.status) {
        toastSuccess('Registered Successfully! Please login to continue');
        navigate('/login');
      } else {
        toastError(data?.message || 'Registration failed');
      }
    } catch (err) {
      if (err?.response?.data?.data) {
        const errors = err.response?.data?.data || {};
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
    }
    finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // JSX
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {loading && <Loader />}
      <main className="main advrt_out">
        <div className="container">
          <div className="bg_logns">
            <img src="/assets/images/houseBg.webp" alt="background" />
          </div>

          <div className="login-bg login-area pt-120 pb-120">
            <Link to="https://terraterri.com/">
              <h2>Builder Logo</h2>            </Link>

            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-7">
                  <Carousel className="text-center advt-ads">
                    {[
                      {
                        text: '"Maximize Your Property\'s Exposure"',
                        small: '– Register and List Now!',
                        class: 'metclr1',
                      },
                      {
                        text: '"List Your Property in the Metaverse "',
                        small: '– Let Buyers Immerse, Explore, and Connect Directly!',
                        class: 'metclr2',
                      },
                      {
                        text: '"Discover the NextGen property Marketplace."',
                        small: ' – Innovative Listings, Immersive Experiences!',
                        class: 'metclr3',
                      },
                    ].map((s, i) => (
                      <Carousel.Item key={i} className={s.class}>
                        <p className="slide">
                          {s.text}
                          <br />
                          <span className="small-txt">{s.small}</span>
                        </p>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>

                <div className="col-md-5 ">
                  <div className='tabHome'>
                    <div className="titls-log">
                      <h4 className="formhed">
                        Listing your properties <span>or</span> <span className="bookyousl">Booking your expo stall</span>{' '}
                      </h4>
                      <h4>Register here.</h4>
                      {/* <p>Are You a</p> */}
                    </div>

                    <Tabs>
                      <TabList onClick={handleTabs} className="tablistRegister mb-3">
                        {registerAs.map((role) => (
                          <Tab key={role.id} className="tablists">
                            {role.name}
                          </Tab>
                        ))}
                      </TabList>

                      <div className="registr_out">
                        {registerAs.map((role) => (
                          <TabPanel key={role.id} className="tabpanelRegister">
                            {formType === role.name && (
                              <div className="row">
                                {/* Company Name – not required for Owner */}
                                {role.name !== 'Owner' && (
                                  <div className="form-group col-md-12">
                                    <input
                                      type="text"
                                      className={`form-control formContoler ${formError.company_name ? 'is-invalid' : ''}`}
                                      placeholder="Company Name"
                                      name="company_name"
                                      value={form.company_name || ''}
                                      onChange={handleForm}
                                    />
                                    <PiBuildings className="pibuilding" />
                                    {formError.company_name && (
                                      <div className="invalid-feedback">{formError.company_name}</div>
                                    )}
                                  </div>
                                )}

                                {/* Country */}
                                <div className="form-group col-md-4 pr-0">
                                  <span className="down-arw"></span>
                                  <select
                                    className={`form-control formContoler ${formError.country_code ? 'is-invalid' : ''}`}
                                    name="country_code"
                                    value={form.country_code || ''}
                                    onChange={handleForm}
                                  >
                                    <option value="">Country</option>
                                    {countries.map((c) => (
                                      <option key={c.isoCode} value={c.isoCode}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </select>
                                  <TbBuildingEstate className="pibuilding" />
                                  {formError.country_code && <div className="invalid-feedback">{formError.country_code}</div>}
                                </div>

                                {/* State */}
                                <div className="form-group col-md-4 pr-0">
                                  <span className="down-arw"></span>
                                  <select
                                    className={`form-control formContoler ${formError.state_code ? 'is-invalid' : ''}`}
                                    name="state_code"
                                    value={form.state_code || ''}
                                    onChange={handleForm}
                                    disabled={!form.country_code}
                                  >
                                    <option value="">State</option>
                                    {states.map((s) => (
                                      <option key={s.isoCode} value={s.isoCode}>
                                        {s.name}
                                      </option>
                                    ))}
                                  </select>
                                  <TbBuildingEstate className="pibuilding" />
                                  {formError.state_code && <div className="invalid-feedback">{formError.state_code}</div>}
                                </div>

                                {/* City */}
                                <div className="form-group col-md-4">
                                  <span className="down-arw"></span>
                                  <select
                                    className={`form-select ${formError.city_code ? 'is-invalid' : ''}`}
                                    name="city_code"
                                    value={form.city_code || ''}
                                    onChange={handleForm}
                                    disabled={!form.state_code}
                                  >
                                    <option value="">City / Town</option>
                                    {cities.map((c, idx) => (
                                      <option key={c.name || idx} value={c.name}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </select>
                                  <GiModernCity className="pibuilding" />
                                  {formError.city_code && <div className="invalid-feedback">{formError.city_code}</div>}
                                </div>

                                {/* Email */}
                                <div className="form-group col-md-12">
                                  <input
                                    type="email"
                                    className={`form-control formContoler ${formError.email ? 'is-invalid' : ''}`}
                                    placeholder="Email"
                                    name="email"
                                    value={form.email || ''}
                                    onChange={handleForm}
                                  />
                                  <IoIosMail className="pibuilding" />
                                  {formError.email && <div className="invalid-feedback">{formError.email}</div>}
                                </div>

                                {/* Mobile & OTP */}
                                <div className="form-group row align-items-center mb-0">
                                  <div className="col-md-8">
                                    <input
                                      type="tel"
                                      className={`form-control formContoler ${formError.mobile ? 'is-invalid' : ''}`}
                                      placeholder="Mobile"
                                      name="mobile"
                                      value={form.mobile || ''}
                                      onChange={handleForm}
                                      maxLength={10}
                                      disabled={otpSent}
                                    />
                                    <BsWhatsapp className="pibuilding" />
                                  </div>
                                  <div className="col-md-4">
                                    {!otpSent ? (
                                      <button
                                        type="button"
                                        className="gt-otp"
                                        onClick={handleGetOTP}
                                        disabled={loading || !form.mobile || form.mobile.length !== 10}
                                      >
                                        {loading ? 'Sending…' : 'Get OTP'}
                                      </button>
                                    ) : (
                                      <div className="verified-badge">
                                        {isOtpVerified ? '✓ Verified' : '✓ Sent'}
                                      </div>
                                    )}
                                  </div>

                                  {formError.mobile && <div className="invalid-feedback">{formError.mobile}</div>}
                                </div>

                                {/* OTP Inputs */}
                                {otpSent && !isOtpVerified && (
                                  <div className="form-group col-md-12">
                                    <label className='white mt-3 mb-2'>Enter OTP</label>
                                    <div className="row">
                                      <div className="col-md-8">
                                        <div className="d-flex gap-2 " onPaste={handleOtpPaste}>
                                          {otp.map((d, idx) => (
                                            <input
                                              key={idx}
                                              type="text"
                                              maxLength="1"
                                              className={`form-control text-center p-0 pl-0 ${formError.otp ? 'is-invalid' : ''}`}
                                              value={d}
                                              onChange={(e) => handleOtpChange(e, idx)}
                                              onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                                              ref={(el) => (inputsRef.current[idx] = el)}
                                              style={{ width: '40px', height: '40px' }}
                                            />
                                          ))}
                                        </div>
                                        {formError.otp && <div className="invalid-feedback d-block">{formError.otp}</div>}
                                      </div>
                                      <div className="col-md-4 d-flex justify-content-center align-items-center">
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-primary "
                                          onClick={handleVerifyOtp}
                                          disabled={loading || otp.join('').length !== 6}
                                        >
                                          {loading ? 'Verifying…' : 'Verify OTP'}
                                        </button>
                                      </div>
                                    </div>
                                    <div className="d-flex justify-content-between mt-2">
                                      {otpTimer > 0 ? (
                                        <span className="white">Resend OTP in {otpTimer}s</span>
                                      ) : (
                                        <button
                                          type="button"
                                          className="btn btn-sm btn-link"
                                          onClick={handleResendOTP}
                                          disabled={!canResend || loading}
                                        >
                                          Resend OTP
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Terms */}
                                <div className="mb-3 col-md-12 mt-2">
                                  <div className="chk-notification">
                                    <input
                                      type="checkbox"
                                      id="chk-whatsapp"
                                      name="terms"
                                      checked={!!form.terms}
                                      onChange={handleForm}
                                      className={formError.terms ? 'is-invalid' : ''}
                                    />
                                    <label htmlFor="chk-whatsapp" className="ml-10">
                                      I Agree to Terraterri' <Link to="/">T&amp;C</Link>,{' '}
                                      <Link to="/">Privacy Policy</Link> &amp; <Link to="/">Cookie Policy</Link>
                                    </label>
                                    {formError.terms && <div className="invalid-feedback d-block">{formError.terms}</div>}
                                  </div>
                                </div>

                                {/* Submit */}
                                <div className="d-flex align-items-center col-md-12 m-auto">
                                  <button
                                    type="button"
                                    className="theme-btn"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                  >
                                    {loading ? 'Processing…' : 'Register'}
                                  </button>
                                </div>
                                <p className="text-center mt-3 alreadyaccount">
                                  Have an account already? <Link to="/login">Sign in</Link>
                                </p>
                              </div>
                            )}
                          </TabPanel>
                        ))}
                      </div>
                    </Tabs>
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

export default Register;
