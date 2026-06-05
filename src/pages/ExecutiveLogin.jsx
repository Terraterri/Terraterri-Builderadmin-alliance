import React, { useEffect, useState } from 'react';
// import Loader from "../components/Loader";
import { useNavigate } from 'react-router-dom';
import { FaUserAlt } from 'react-icons/fa';
import { Button } from 'bootstrap';

const ExecutiveLogin = () => {
  return (
    <div class="container-fluid authentication-bg overflow-hidden">
    <div class="bg-overlay"></div>
    <div class="row align-items-center justify-content-center min-vh-100">
      <div class="col-10 col-md-6 col-lg-6 col-xxl-4 px-4">
        <div class="card otp_out mb-0">
          <div class="card-body">
            <div class="text-left mb-4">
              <a class="logo-dark">
                <img
                  src="assets/images/logo.png"
                  alt=""
                  width="100"
                  class="auth-logo logo-dark mx-auto"
                />
              </a>
            </div>
            <div class="otp_boxes">
              <form>
                <label>
                  Kindly input your WhatsApp number, and you will be sent a 4 Digit-Passcode for
                  verification.
                </label>
                <div class="input-group auth-form-group-custom mb-3">
                  <span
                    class="input-group-text bg-primary bg-opacity-10 fs-16"
                    id="basic-addon1">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 512 512"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg">
                      <path d="M256 288c79.5 0 144-64.5 144-144S335.5 0 256 0 112 64.5 112 144s64.5 144 144 144zm128 32h-55.1c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16H128C57.3 320 0 377.3 0 448v16c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48v-16c0-70.7-57.3-128-128-128z"></path>
                    </svg>
                  </span>
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter Mobile Number"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    name="mobile"
                  />
                </div>
                <div>
                  <p class="err"></p>
                </div>
                <div class="pt-3 text-center">
                  <button class="btn btn-primary w-xl waves-effect waves-light" type="button">
                    Continue
                  </button>
                </div>
                <div></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ExecutiveLogin