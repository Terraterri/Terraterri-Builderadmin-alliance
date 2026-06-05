import { Button } from 'bootstrap';
import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Link } from 'react-router-dom';
// import { Link } from 'react-router-dom';
const Dashboard = () => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 4 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };
  return (
    <>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12 homeBox">
                {/* <div className="row">
                  <div className="col-12">
                    <div className="page-title-box d-flex align-items-center justify-content-between">
                      <div className="page-title-right">
                        <ol className="breadcrumb m-0">
                          <li className="breadcrumb-item">
                            <a href="/">Home</a>
                          </li>
                          <li className="breadcrumb-item active">Airpropex DashBoard</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="cardd dashbrd-main">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="dashbrd-hme">
                        <h3>DISCOVER YOUR DREAM PROPERTY AT</h3>
                        <h2>HYDERABAD MEGA METAVERSE PROPERTY EXPO</h2>
                        <p>Discover other cities for exhibiting your projects in AirPropX</p>

                        <div className="row slet_out">
                          <div className="col-md-4 stateBox">
                            <div className="sel_blo">
                              <span>Select Country:</span>
                              <select className="form-select formcontrol" name="city">
                                <option value="" selected="">
                                  Select
                                </option>
                                <option value="Bang">INDIA</option>
                                <option value="HYD">DUBAI</option>
                                <option value="PUNE">AUSTRALIA</option>
                                <option value="PUNE">ENGLAND</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-4 stateBox">
                            <div className="sel_blo">
                              <span>Select City:</span>
                              <select className="form-select formcontrol" name="city">
                                <option value="" selected="">
                                  Select
                                </option>
                                <option value="Bang">BANGALURU</option>
                                <option value="HYD">HYDERABAD</option>
                                <option value="PUNE">MUMBAI</option>
                                <option value="PUNE">CHENNAI</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="sel_blo">
                              <span>Expo Type:</span>
                              <select className="form-select formcontrol" name="type">
                                <option value="" selected="">
                                  Select
                                </option>
                                <option value="R">RESIDENTIAL</option>
                                <option value="C">COMMERCIAL</option>
                                <option value="I">INTERIOR</option>
                                <option value="B">BANKING</option>
                              </select>
                            </div>
                          </div>

                          {/* <div className="col-md-4">
                    <div className="d-flex sel_blo sel_bloo">
                      <span>Expo Date:</span>
                      <select className="form-select formcontrol" name="type">
                        <option value="" selected="">
                          Select
                        </option>
                        <option value="R">28-SEP-2024</option>
                        <option value="R">26-OCT-2024</option>
                        <option value="R">27-OCT-2024</option>
                        <option value="R">30-NOV-2024</option>
                        <option value="R">28-DEC-2024</option>
                        <option value="R">29-DEC-2024</option>
                        <option value="R">25-JAN-2025</option>
                        <option value="R">26-JAN-2025</option>
                        <option value="R">22-FEB-2025</option>
                        <option value="R">23-FEB-2025</option>
                        <option value="R">29-MAR-2025</option>
                        <option value="R">30-MAR-2025</option>
                      </select>
                    </div>
                  </div> */}
                        </div>


                        <p className="view_all">
                          <span>Explore </span> All AirPropx Real Estate Expos in Hyderabad
                        </p>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="slots_dates">
                        <h2>METAVERSE EXPO DATES</h2>
                        <h3>HYDERABAD - RESIDENTIAL</h3>
                        <div className="slot_list">
                          <div className="date_out">27-July-2024</div>
                          <div className="book_out">
                            <button>Book a Slot</button>
                          </div>
                        </div>
                        <div className="slot_list">
                          <div className="date_out">27-July-2024</div>
                          <div className="book_out">
                            <button>Book a Slot</button>
                          </div>
                        </div>
                        <div className="slot_list">
                          <div className="date_out">27-July-2024</div>
                          <div className="book_out">
                            <button>Book a Slot</button>
                          </div>
                        </div>
                        <div className="slot_list">
                          <div className="date_out">27-July-2024</div>
                          <div className="book_out">
                            <button>Book a Slot</button>
                          </div>
                        </div>
                        <div className="slot_list">
                          <div className="date_out">27-July-2024</div>
                          <div className="book_out">
                            <button>Book a Slot</button>
                          </div>
                        </div>
                        <div className="slot_list">
                          <div className="date_out">27-July-2024</div>
                          <div className="book_out">
                            <button>Book a Slot</button>
                          </div>
                        </div>
                        <div className="slot_list">
                          <div className="date_out">27-July-2024</div>
                          <div className="book_out">
                            <button>Book a Slot</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="feature_expos card mt-4">
                  <div className="row">
                    <div className="col-md-12">
                      <h3>Cities Showcasing AirPropx Metaverse Expos</h3>
                    </div>
                    {/* <div className="col-md-4">
                        <div> <img src="/assets/images/builder/hyderabad-01.jpg" alt="expo" width={390} /></div>
                      </div>
                      <div className="col-md-4">
                        <div> <img src="/assets/images/builder/hyderabad-02.jpg" alt="expo" width={390} /></div>
                      </div>
                      <div className="col-md-4">
                        <div> <img src="/assets/images/builder/hyderabad-03.jpg" alt="expo" width={390} /></div>
                      </div> */}
                  </div>
                  <Carousel responsive={responsive}>
                    <div className="col">
                      <Link to="/listing-expos">
                        {' '}
                        <img src="/assets/images/builder/city-01.png" alt="expo" width={290} />
                      </Link>
                    </div>
                    <div className="col">
                      <div>
                        {' '}
                        <img src="/assets/images/builder/city-05.png" alt="expo" width={290} />
                      </div>
                    </div>
                    <div className="col">
                      <div>
                        {' '}
                        <img src="/assets/images/builder/city-01.png" alt="expo" width={290} />
                      </div>
                    </div>
                    <div className="col">
                      <div>
                        {' '}
                        <img src="/assets/images/builder/city-05.png" alt="expo" width={290} />
                      </div>
                    </div>
                    <div className="col">
                      <div>
                        {' '}
                        <img src="/assets/images/builder/city-01.png" alt="expo" width={290} />
                      </div>
                    </div>
                    <div className="col">
                      <div>
                        {' '}
                        <img src="/assets/images/builder/city-05.png" alt="expo" width={290} />
                      </div>
                    </div>
                    <div className="col">
                      <div>
                        {' '}
                        <img src="/assets/images/builder/city-01.png" alt="expo" width={290} />
                      </div>
                    </div>


                  </Carousel>

                  <div className="row mt-5">
                    <div className="col-md-12">
                      <h3>AIRPROPX EXPOS IN HYDERABAD</h3>

                      <h4>Residential Real estate Expos</h4>
                    </div>
                    <div className="col-md-4">
                      <div>
                        {' '}
                        <img src="/assets/images/builder/hyderabad-01.jpg" alt="expo" width={390} />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div>
                        {' '}
                        <img src="/assets/images/builder/hyderabad-02.jpg" alt="expo" width={390} />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div>
                        {' '}
                        <img src="/assets/images/builder/hyderabad-03.jpg" alt="expo" width={390} />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-md-12">
                      <h4>Commercial Real estate Expos</h4>
                    </div>
                    <div className="col-md-4">
                      <div>
                        {' '}
                        <img src="/assets/images/builder/hyderabad-01.jpg" alt="expo" width={390} />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div>
                        {' '}
                        <img src="/assets/images/builder/hyderabad-02.jpg" alt="expo" width={390} />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div>
                        {' '}
                        <img src="/assets/images/builder/hyderabad-03.jpg" alt="expo" width={390} />
                      </div>
                    </div>
                  </div>
                  <div>
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

export default Dashboard;
