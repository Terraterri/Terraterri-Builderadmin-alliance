import React from 'react';
import { Link } from 'react-router-dom';
const AddProjectName = () => {
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
                    <li className="breadcrumb-item active">Add Project Name</li>
                  </ol>
                </div>
                <div className="page-title-right">
                  <Link to="/project/name">
                    <button className="btn btn-info">Project Names</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Create Project Name</h3>
                </div>
                <div className="card-body">
                  <form className="custom-validation" action="#">
                    <div className="mb-3">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="project-name"
                          className="form-control"
                          name="projectName"
                          placeholder="Insert your firstname"
                          required
                        />
                        <label for="project-name" className="fw-normal">
                          Enter Project Name
                        </label>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="form-floating">
                        <h6>Project Location</h6>
                      </div>
                    </div>
                    <div className="mb-3">
                      <select className="form-select" name="country" required>
                        <option value="default">Select Country</option>
                        <option value=""></option>
                        <option value=""></option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <select className="form-select" name="state" required>
                        <option value="default">Select State</option>
                        <option value=""></option>
                        <option value=""></option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <select className="form-select" name="city" required>
                        <option value="default">Select City</option>
                        <option value=""></option>
                        <option value=""></option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <div className="form-floating">
                        <h6>Builder Name</h6>
                      </div>
                    </div>
                    <div className="mb-3">
                      <select className="form-select" name="builderName" required>
                        <option value="default">Select Builder Name</option>
                        <option value=""></option>
                        <option value=""></option>
                      </select>
                    </div>
                    <div>
                      <h6> ........ By default City Name .......</h6>
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

export default AddProjectName;
