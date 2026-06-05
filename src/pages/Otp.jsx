import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { FaRegEdit } from "react-icons/fa";
import { Button } from 'bootstrap';


const Otp = () => {
  return (
   <>
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
                <div className='opt_main'>
            <h4>Verify Your Number</h4>
                                        <h3>+91 9063754321  <button
                className="btn btn-primary w-xl waves-effect waves-light"
                type="button"
                ><FaRegEdit /></button></h3>
                                      
            <p>Haven't received the passcode yet? <Link to="#">Resend Passcode</Link></p>
            <div className='otp_btns'>
            <button
                className="btn btn-primary w-xl waves-effect waves-light"
                type="button"
                
            >
                Verify & Continue
            </button>
           
            </div>
        </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
   </>
  )
}

export default Otp