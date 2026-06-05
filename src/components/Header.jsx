import React, { useState } from 'react';
import { AiOutlineLogout } from "react-icons/ai";
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import { HiMiniBars3 } from "react-icons/hi2";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/slices/UserSlice';
const Header = () => {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    dispatch(clearUser());
    navigate('/');
  };

  return (
    <>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="navbar-logo-box">
            <span className="logo-sm">
              <Link to="/dashboard">
                <img src="/assets/images/logo.png" alt="logos" width={100} />
              </Link>
            </span>
          </div>
          <div className='log_ot d-flex'>
            <Link to="#">
              <button onClick={handleLogout}>Logout <AiOutlineLogout /></button>
            </Link>
            <div className="mobile-toggle d-none">
              <HiMiniBars3 onClick={() => setShow(true)} />
            </div>
          </div>
        </div>
      </header>


      <Offcanvas show={show} onHide={() => setShow(false)}>
        <Offcanvas.Header closeButton>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className='side_out'>
            <Sidebar />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
