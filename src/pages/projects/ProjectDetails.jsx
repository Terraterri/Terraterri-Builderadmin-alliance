import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const ProjectDetails = () => {
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
                      <li className="breadcrumb-item">
                        <a href="javascript: void(0);">Terraterri</a>
                      </li>
                      <li className="breadcrumb-item active">Project Details</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center">
{/*--------------------> title & types<-------------------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Property Title & Type </h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Title & Type</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>testing name
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Property Type</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>Residential
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>SubProperty Type</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>Residential Plot
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
{/*------------------->  project locations<---------------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Project Location</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Country</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>India
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>City/Town</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>Rajahmundry
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>State</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>Andhra Pradesh
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Locality</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>A S rao nagar
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Sub Locality</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>Temple Street
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Address</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>indrapalem,kakinada
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
{/*--------------------> Approvals<------------------------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Approvals</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Approval Authority</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>HDMA
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Approval Of Year</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>22-1-01-2024
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Approval Number</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>1234567890
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Upload Document</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>.pdf
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
{/*-------------------->project Details<-------------------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Project Details</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Total Project Land Area</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>2000
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Total Number Blocks</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>5
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6> Sq Ft</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>ACR
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Number Of Floors/Blocks</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>03
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Number Of Units/Blocks</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>04
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Upload Document</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>.pdf
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Total Number Of Unit</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>06
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Upload Document</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>.pdf
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
{/*-------------------->water sources<---------------------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Water Source</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Number Of Borewells</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>10
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Ground Water Depth</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>10
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
{/*------------------>unit details<-----------------------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Unit Details</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Saleable Area Representation</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>super Builup Area
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Super Bulit Up Area</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>test area
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Size Rep</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>sq meter
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Carpet Area</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>1000
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Studio</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>04
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Facing</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>.pdf
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Floor Numbers</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>06
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Car Parking</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>.pdf
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Open</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>10
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Covered</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>10
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Balconies</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>10
                            </p>
                          </div>
                        </div>
                      </div>
                      <h5>Bath Rooms</h5>
                      <hr />
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Full</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>10
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Half</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>10
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>UDS</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>10
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>UDS Unit</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>10
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Property Floor Plane</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>10
                            </p>
                          </div>
                        </div>
                      </div>

                      <h5>Furnished Status</h5>
                      <hr />
                      <div className="row">
                        <div className="col-md-6">
                          <h6>Furnished Status</h6>
                        </div>
                        <div className="col-md-6">
                          <p>
                            <span className="me-3">:</span>Furnished
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
{/*------------------->Special Features<--------------------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Special Features</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <h5>Other Rooms:</h5>
                    <div className="row">
                      <div className="col-md-4 feature_types">
                        <h6>Pooja Room</h6>
                      </div>
                      <div className="col-md-4 feature_types">
                        <h6>Study Room</h6>
                      </div>
                      <div className="col-md-4 feature_types">
                        <h6>Servant Room</h6>
                      </div>
                    </div>
                    <hr />
                    <h5>Property Overlooking:</h5>
                    <div className="row">
                      <div className="col-md-4 feature_types">
                        <h6>Pool</h6>
                      </div>
                      <div className="col-md-4 feature_types">
                        <h6>Garden/Park</h6>
                      </div>
                      <div className="col-md-4 feature_types">
                        <h6>Club House</h6>
                      </div>
                    </div>
                    <hr />
                    <h5>Ownership:</h5>
                    <div className="row">
                      <div className="col-md-4 feature_types">
                        <h6>Free Hold</h6>
                      </div>
                      <div className="col-md-4 feature_types">
                        <h6>Lease Hold</h6>
                      </div>
                      <div className="col-md-4 feature_types">
                        <h6>Co-Operative Socity</h6>
                      </div>
                    </div>
                    <hr />
                    <h5>Types Of Flooring:</h5>
                    <div className="row">
                      <div className="col-md-4 feature_types">
                        <h6>Marble</h6>
                      </div>
                      <div className="col-md-4 feature_types">
                        <h6>Granite</h6>
                      </div>
                      <div className="col-md-4 feature_types">
                        <h6>Vertified</h6>
                      </div>
                    </div>
                    <hr />
                    <h5>Furnishing:</h5>
                    <div className="row">
                      <div className="col-md-4 feature_types">
                        <h6>Furnishing</h6>
                      </div>
                      <div className="col-md-4 feature_types">
                        <h6>Semi Furnishing</h6>
                      </div>
                      <div className="col-md-4 feature_types">
                        <h6>Un Furnished</h6>
                      </div>
                    </div>
                    <hr />
                    <h5>Pet Friendly:</h5>
                    <div className="row">
                      <div className="col-md-4 feature_types">
                        <h6>Pet Friendly</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

{/*------------------->Estimated Other Chargers<-------------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Estimated Other Chargers</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Base Price</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>5800
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Total Base Price</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>75,00,00
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

{/*------------------->Amenities<----------------------------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Amenities</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Car Parkings</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>2000/-
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Maintenance Charges</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>3000/-
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Corpus Fund</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>6000/-
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>For Month</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>7000/-
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Legal Charges</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>10000/-
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
{/*------------------>Preferred Location Charges (PLC)<---------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Preferred Location Charges PLC</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Floor Raising PLC</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>2000/-
                            </p>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Corner PLC</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>3000/-
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Facing PLC</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>6000/-
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
{/*------------------->RegistrationCharges<--------------------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Registration Charges</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>GST Taxes</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>2000/-
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Registration Charges</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>6000/-
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
{/*--------------------->Possession<--------------------------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Possession</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Possession Status</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>Ready To Move
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  {/*--------------->Gallary<---------------------------------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Gallary</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-3">
                        <div className="gallery_image">
                          <img src="../../../public/assets/images/auth-bg.jpg" alt="" />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="gallery_image">
                          <img src="../../../public/assets/images/auth-bg.jpg" alt="" />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="gallery_image">
                          <img src="../../../public/assets/images/auth-bg.jpg" alt="" />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="gallery_image">
                          <img src="../../../public/assets/images/auth-bg.jpg" alt="" />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="gallery_image">
                          <img src="../../../public/assets/images/auth-bg.jpg" alt="" />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="gallery_image">
                          <img src="../../../public/assets/images/auth-bg.jpg" alt="" />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="gallery_image">
                          <img src="../../../public/assets/images/auth-bg.jpg" alt="" />
                        </div>
                      </div>
                      <div className="col-md-3">
                        <div className="gallery_image">
                          <img src="../../../public/assets/images/auth-bg.jpg" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  {/*----------------------> Unit Gallary<---------------------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Gallary</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <Tabs
                        defaultActiveKey="profile"
                        id="uncontrolled-tab-example"
                        className="mb-3">
                        <Tab eventKey="Bed Rooms" title="Bed Rooms">
                          <div className="row">
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                        </Tab>
                        <Tab eventKey="Living Room" title="Living Room">
                          <div className="row">
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                        </Tab>
                        <Tab eventKey="Bath Rooms" title="Bath Rooms">
                          <div className="row">
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                        </Tab>
                        <Tab eventKey="Kitchen" title="Kitchen">
                          <div className="row">
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                        </Tab>
                        <Tab eventKey="Dinning Room" title="Dinning Room">
                          <div className="row">
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                        </Tab>
                        <Tab eventKey="Pooja Room" title="Pooja Room">
                          <div className="row">
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                        </Tab>
                        <Tab eventKey="Balcony" title="Balcony">
                          <div className="row">
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                        </Tab>
                        <Tab eventKey="Interior Photos" title="Interior Photos">
                          <div className="row">
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="tabs_image">
                                <img
                                  src="../../../public/assets/images/auth-bg.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                        </Tab>
                      </Tabs>
                    </div>
                  </div>
                </div>
              </div>

  {/*------------------------>videos<-------------------------*/}

              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Videos</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Video URL 1</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>2000/-
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Video URL 2</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>6000/-
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Street View URL</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>6000/-
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>Drone View URL</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>6000/-
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>E-Broucher</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>6000/-
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  {/*---------------------->contact<-------------------------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Contact Time</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>From</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>13-04-2024
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6">
                            <h6>To</h6>
                          </div>
                          <div className="col-md-6">
                            <p>
                              <span className="me-3">:</span>15-04-2024
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  {/*---------------------------->Amenities<-------------------------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Amenities</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <h5>Club House:</h5>
                    <div className="row">
                      <div className="col-md-4 Amenities_types">
                        <h6>Entrance Lounge / Reception</h6>
                      </div>
                      <div className="col-md-4 Amenities_types">
                        <h6>Bar / Lounge</h6>
                      </div>
                      <div className="col-md-4 Amenities_types">
                        <h6>Saloon And Spa</h6>
                      </div>
                    </div>
                    <hr />
                    <h5>Fitness:</h5>
                    <div className="row">
                      <div className="col-md-4 Amenities_types">
                        <h6>Pool</h6>
                      </div>
                      <div className="col-md-4 Amenities_types">
                        <h6>Garden/Park</h6>
                      </div>
                      <div className="col-md-4 Amenities_types">
                        <h6>Club House</h6>
                      </div>
                    </div>
                    <hr />
                    <h5>Convinience:</h5>
                    <div className="row">
                      <div className="col-md-4 Amenities_types">
                        <h6>Free Hold</h6>
                      </div>
                      <div className="col-md-4 Amenities_types">
                        <h6>Lease Hold</h6>
                      </div>
                      <div className="col-md-4 Amenities_types">
                        <h6>Co-Operative Socity</h6>
                      </div>
                    </div>
                    <hr />
                    <h5>Saftey & Security:</h5>
                    <div className="row">
                      <div className="col-md-4 Amenities_types">
                        <h6>Marble</h6>
                      </div>
                      <div className="col-md-4 Amenities_types">
                        <h6>Granite</h6>
                      </div>
                      <div className="col-md-4 Amenities_types">
                        <h6>Vertified</h6>
                      </div>
                    </div>
                    <hr />
                    <h5>Others:</h5>
                    <div className="row">
                      <div className="col-md-4 Amenities_types">
                        <h6>Furnishing</h6>
                      </div>
                      <div className="col-md-4 Amenities_types">
                        <h6>Semi Furnishing</h6>
                      </div>
                      <div className="col-md-4 Amenities_types">
                        <h6>Un Furnished</h6>
                      </div>
                    </div>
                    <hr />
                    <h5>LandScaping:</h5>
                    <div className="row">
                      <div className="col-md-4 Amenities_types">
                        <h6>Pet Friendly</h6>
                      </div>
                    </div>
                    <hr />
                    <h5>Network & Connectivity:</h5>
                    <div className="row">
                      <div className="col-md-4 Amenities_types">
                        <h6>Pet Friendly</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
  {/*------------------------>Approved banks loand<-------------------*/}
              <div className="col-md-10">
                <div className="card">
                  <div className="card-header  content_header">
                    <h3 className="card-title">Approved banks loand</h3>
                    <i className="fas fa-edit"></i>
                  </div>
                  <div className="card-body">
                    <h5>Approved banks loand:</h5>
                    <div className="row">
                      <div className="col-md-4 Amenities_types">
                        <h6>AXIS BANK</h6>
                      </div>
                      <div className="col-md-4 Amenities_types">
                        <h6>HDFC</h6>
                      </div>
                      <div className="col-md-4 Amenities_types">
                        <h6>ICICI</h6>
                      </div>
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

export default ProjectDetails;
