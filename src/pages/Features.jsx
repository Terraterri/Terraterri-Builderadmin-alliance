import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaAnglesRight } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";


const Features = () => {
  return (
    <div className="main-content featured-main">
        <div className="page-content">
          <div className="container-fluid px-0">
         

            <div className="cardd featured-bg">
              <div className="container-fluid">
                <div className="titles_lne  text-center mb-4">
                  <h4>AN EXCLUSIVE VIRTUAL REALESTATE EXPO</h4>
                  <p>Choose the perfect stall to showcase your projects</p>
                  
                </div>

                    <div className="row flex-wrpp">

                    <div className="col-md-3">
                          
                          <div className="card sponcers_ot daimond-clr">
                              <h4>
                                  Diamond Stall
                              </h4>
                              <span>Sponsor</span>
                              <h6>No.Of Stalls in Expo : 1</h6>
                              <ul>
                                  <li><GoDotFill /> Premium Stall</li>
                                  <li><GoDotFill /> Brand Promotion in World Wide</li>
                                  <li><GoDotFill /> Expo Interior Branding</li>
                                  <li><GoDotFill /> Expo Exterior Branding</li>
                                  <li><GoDotFill /> Total Visitor Database</li>
                                  <li><GoDotFill /> Visitor Analytics</li>
                                  <li><GoDotFill /> 4 Project base Promotion</li>
                                  <li><GoDotFill /> Complementory 5 Project Listing in Terraterri.com <br/>(3months Validity)</li>
                                  <li><GoDotFill /> 2 Paragon Meta Listings<br></br>(3 Months Validity)</li>
                              </ul>
                              <h5>Starts at : 6,00,000</h5>
                              {/* <Link to="/book-a-stall"><button>View More</button></Link> */}
                          </div>
                      
                  </div>

                        
                       
                        <div className="col-md-3">
                          
                                <div className="card sponcers_ot platinum-clr">
                                    <h4>
                                        Platinum Stall
                                    </h4>
                                    <span>Sponsor</span>
                                    <h6>No.Of Stalls in Expo : 2</h6>
                                    <ul>
                                        <li><GoDotFill /> Premium Stall</li>
                                        <li><GoDotFill /> Brand Promotion in Country Wide</li>
                                        <li><GoDotFill /> Expo Interior Branding</li>
                                        <li><GoDotFill /> Expo Exterior Branding</li>
                                        <li><GoDotFill /> Domestic Visitor Database</li>
                                        <li><GoDotFill /> Visitor Analytics</li>
                                        <li><GoDotFill /> 3 Project base Promotion</li>
                                        <li><GoDotFill /> Complementory 3 Project Listing in Terraterri.com <br/>(3months Validity)</li>
                                        <li><GoDotFill /> l Paragon Meta Listing<br></br>(3 Months Validity)</li>
                                    </ul>
                                    <h5>Starts at : 4,00,000</h5>
                                    {/* <Link to="/book-a-stall"><button>View More</button></Link> */}
                                </div>
                            
                        </div>
                        <div className="col-md-3">
                          
                                <div className="card sponcers_ot gold-clr">
                                    <h4>
                                        Gold Stall
                                    </h4>
                                    <span>Sponsor</span>
                                    <h6>No.Of Stalls in Expo : 4</h6>
                                    <ul>
                                        <li><GoDotFill /> Premium Stall</li>
                                        <li><GoDotFill /> Brand Promotion in City Wide</li>
                                        <li><GoDotFill /> Expo Interior Branding</li>
                                        <li><GoDotFill /> -----</li>
                                        <li><GoDotFill /> City Visitor Database</li>
                                        <li><GoDotFill /> Visitor Analytics</li>
                                        <li><GoDotFill /> 1 Project base Promotion</li>
                                        <li><GoDotFill /> Complementory 2 Project Listing in Terraterri.com <br/>(3months Validity)</li>
                                        <li className='empty-spr'><GoDotFill /> -----</li>
                                    </ul>
                                    <h5>Starts at : 2,00,000</h5>
                                    
                                </div>
                            
                        </div>
                        <div className="col-md-3">
                          
                                <div className="card sponcers_ot standrd-clr">
                                    <h4>
                                    Standard Stall
                                    </h4>
                                    <span></span>
                                    <h6>No.Of Stalls in Expo : 16</h6>
                                    <ul>
                                        <li><GoDotFill /> Standard Stall</li>
                                        <li><GoDotFill /> -----</li>
                                        <li><GoDotFill /> -----</li>
                                        <li><GoDotFill /> -----</li>
                                        <li><GoDotFill /> Stall Visitor Data base</li>
                                        <li><GoDotFill /> -----</li>
                                        <li><GoDotFill /> -----</li>
                                        <li><GoDotFill /> Complementory 1 Project Listing in Terraterri.com <br/>(3months Validity)</li>
                                        <li className='empty-spr'><GoDotFill /> -----</li>
                                    </ul>

                                    <h5>Starts at : 40,000</h5>

                   
                                </div>
                            
                        </div>

                      
                    </div>
                    <div className="row">
                    <div className="col-md-12 text-center mt-4 book_out">
                        <Link to="/book-a-stall"><button className='button'>Book Your Stall Now</button></Link>
                        </div>
                    </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default Features