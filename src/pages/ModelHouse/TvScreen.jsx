
import React, { useState, useEffect } from 'react';


const TvScreen = () => {
    // const userData = useSelector((state) => state.user.userData)    
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
                      <a href="/">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Model House</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className="cardd daimnd-stall">
            {/* <h2 className='mb-0'>Daimond Stall</h2> */}
            <div className='stall-gapp'>
              <div className='stal-ent'>
                <div className="col-md-12">
                  <h5>Paragon</h5>
                </div>

              </div>


              <div className="row mb-3">
                <div className="col-md-12">
                  <h5 className='mt-3'>Model</h5>
                </div>


                <div className="col-md-4 pr-5">
                  <h6 className="BuildNameCom mb-2">Name :</h6>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    id='builder'
                    name='name'
                 
                  />
                </div>
                <div className="col-md-4">
                  <h6 className="BuildNameCom mb-2">Flat Size:</h6>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Size"
                    id='builder'
                    name='phone'
                  
                  />
                </div>
                <div className="col-md-4">
                  <h6 className="BuildNameCom mb-2">Builder Number :</h6>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Phone Number"
                    id='builder'
                    name='phone'
                  
                  />
                </div>
              </div>
          


<div className='stal-ent'>
        <div className="col-md-12">
            <h5>Inside House</h5>
            </div>
      
  </div>
  
              <div className="row mb-3">
                <div className="col-md-12">
                  <h5 className='mt-2'>TV Screen</h5>
                </div>


                <div className="col-md-4">
                  <h6 className="BuildNameCom mb-2">Video 1</h6>
                  <input
                    type="file"
                    className="form-control"
                    placeholder=" Name"
                  />
                </div>
             
              </div>

     <div className='row'>
     <div className="col-md-4 pr-5">
                  <h6 className="BuildNameCom mb-2">Name :</h6>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    id='builder'
                    name='name'
                 
                  />
                </div>
                <div className="col-md-4">
                  <h6 className="BuildNameCom mb-2">Flat Size:</h6>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Size"
                    id='builder'
                    name='phone'
                  
                  />
                </div>
                <div className="col-md-4">
                  <h6 className="BuildNameCom mb-2">Builder Number :</h6>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Phone Number"
                    id='builder'
                    name='phone'
                  
                  />
                </div>
     </div>

            </div>

           
          
            <div className="button-subb mt-4">
              <button type="submit" className="sub-btn1">
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default TvScreen