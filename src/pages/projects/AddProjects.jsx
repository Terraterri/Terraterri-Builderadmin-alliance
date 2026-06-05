import React from 'react';
import { Link } from 'react-router-dom';
const AddProjects = () => {
  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="javascript: void(0);">Terraterri</a>
                    </li>
                    <li className="breadcrumb-item active">Add Projects</li>
                  </ol>
                </div>
                <div className="page-title-right">
                  <Link to="/projects/add">
                    <button className="btn btn-info">Projects</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Add Projects</h3>
                </div>
                <div className="card-body">
                  <form className="custom-validation" action="#">
                    <div className="mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="first-name"
                          className="form-control"
                          name="firstName"
                          placeholder="Insert your firstname"
                          required
                        />
                        <label for="first-name" className="fw-normal">
                          First name
                        </label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="last-name"
                          className="form-control"
                          name="lastName"
                          placeholder="Insert your lastname"
                          required
                        />
                        <label for="last-name" className="fw-normal">
                          Last name
                        </label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <input
                        type="number"
                        className="form-control"
                        name="age"
                        placeholder="Please enter your age"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <select className="form-select" name="gender" required>
                        <option value="default">Select your gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <div className="input-group">
                        <div className="input-group-text">
                          <i className="fa fa-envelope"></i>
                        </div>
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          placeholder="Please enter your email"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text">Homepage</span>
                        <input
                          type="text"
                          className="form-control"
                          name="homepage"
                          placeholder="https://example.me"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        name="password1"
                        placeholder="please provide your password"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        className="form-control"
                        name="password2"
                        placeholder="Please insert again your password"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="agreement"
                          name="agreement"
                          required
                        />
                        <label className="form-check-label fw-medium" for="agreement">
                          Accepts the agreement
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button className="btn btn-primary" type="submit">
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProjects;
