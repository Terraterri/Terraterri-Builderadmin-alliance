import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";


const InActiveProjects = () => {
  return (
    <>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                          <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                   
                      <li className="breadcrumb-item active"><h4 className="m-0 font-bold">InActive Projects</h4></li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Inactive Projects</h3>
                  </div>
                  <div className="card-body">
                    <form className="custom-validation" action="#">
                      <div className="mb-3">
                        <select className="form-select" name="subProperty" required>
                          <option value="default">Select Country</option>
                          <option value="">India</option>
                          <option value=""></option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <select className="form-select" name="propertyType" required>
                          <option value="default">Select Property Type</option>
                          <option value=""></option>
                          <option value=""></option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <select className="form-select" name="subPropertyType" required>
                          <option value="default">Select Sub Property Type</option>
                          <option value=""></option>
                          <option value=""></option>
                        </select>
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
            </div> */}

<div className="row justify-content-center ">
              <div className="col-md-10">
                <div className="cardd mb-4 cardd-input">
                  {/* <div className="card-header">
                    <h3 className="card-title">Search Projects</h3>
                  </div> */}
                  <div className="card-body">
                  <h3 className="card-title mb-3">Search Projects</h3>
                      <form className="custom-validation" action="#">
                    <div className="row">
                        <div className="col-md-2">
                      <div className="">
                        <select className="form-select" name="subProperty" required>
                          <option value="default">Select Country</option>
                          <option value="">India</option>
                          <option value="">Dubai</option>
                        </select>
                          </div>
                        </div>
                        <div className="col-md-2">
                      <div className="">
                        <select className="form-select" name="subProperty" required>
                          <option value="default">Select State</option>
                          <option value="">India</option>
                          <option value="">Dubai</option>
                        </select>
                          </div>
                          </div>
                        <div className="col-md-2">
                      <div className="">
                        <select className="form-select" name="subProperty" required>
                          <option value="default">Select City</option>
                          <option value="">Hyderabad</option>
                          <option value="">Dubai</option>
                        </select>
                          </div>
                        </div>
                      
                        <div className="col-md-2 w-20">
                      <div className="">
                      <select className="form-select" name="propertyType" required>
                          <option value="default">Select Property Type</option>
                          <option value="">Residential</option>
                          <option value="">Commercial</option>
                          <option value="">Industrial</option>
                        </select>

                          </div>
                          </div>
                        <div className="col-md-3 w-20">
                      <div className="">
                        <select className="form-select" name="projectStatus" required>
                          <option value="default">Select Sub Property Type</option>
                          <option value="">Apartment</option>
                          <option value="">Villa</option>
                          <option value="">Plots</option>
                        </select>
                          </div>
                          </div>
                        <div className="col-md-1">
                          <button className="btn btn-primary" type="submit">
                            Search
                          </button>
                          </div>
                      {/* <div className="col-12 text-center">
                        <button className="btn btn-primary" type="submit">
                          Save
                        </button>
                      </div> */}
                      </div>
                      </form>
                  </div>
                </div>
              </div>
            </div>
         

          <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Active Projects Lists</h3>
                    {/* <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by location"
                      />
                    </div> */}
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Project Name</th>
                            <th>Bulider Name</th>
                            <th>Country</th>
                            <th>State</th>
                            <th>City</th>
                            <th>Approved By</th>
                            {/* <th>Edit</th> */}
                            <th>Action  </th>
                          </tr>
                        </thead>
                        <tbody>
                          
                            <tr >
                              <td>1</td>
                              <td>Tranquil Tower </td>
                              <td>RNR Developers</td>
                              <td>India</td>
                              <td>Telangana</td>
                              <td>Hyderabad</td>
                              <td>Ganga</td>
                             
                              <td>
                              <Link to='/ProjectDetails'> <FaRegEdit /></Link> |  <Link to='/'>Active</Link> 
                              </td>
                            </tr>
                            <tr >
                              <td>2</td>
                              <td>Yuva City </td>
                              <td>Yuva Developers</td>
                              <td>India</td>
                              <td>Telangana</td>
                              <td>Hyderabad</td>
                              <td>Ganga</td>
                              <td>
                              <Link to='/ProjectDetails'><FaRegEdit /></Link> |  <Link to='/'>Active</Link> 
                              </td>
                            </tr>
                          
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default InActiveProjects;
