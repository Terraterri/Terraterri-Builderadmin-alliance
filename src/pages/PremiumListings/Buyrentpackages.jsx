import React from 'react'

const Buyrentpackages = () => {
    return (
      
    <div className="main-content">
    <div className="page-content">
      <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <div className="page-title-right">
              <h4 className='mb-0'>Buy Rent Packages</h4>
            </div>
          </div>
        </div>  
            </div>
            
            <div className="card cardd">
           {" "}
      <div className="profile-det-titls">

        <h3 className="PremiumAccount1">PREMIUM LISTING PACKAGES</h3>
      </div>
      <div className="pakcblo_title">
       
        <h3 className="mb-0">Choose the Right plan for your Real Estate</h3>
      </div>
      <div className="row">
        <div className="col-md-12 text-center mt-3">
          <div className="d-flex sel_blo listing_tbs justify-content-center">
            {/* <button className="actv">Premium Listing Packages</button> */}
            {/* <button>Metaverse Listings</button>
                        <button>AirPropx Expo</button> */}
          </div>
        </div>
      </div>
     
      <div className="row slet_out">
        <div className="col-md-4">
          <div className="d-flex sel_blo">
            <span>Select City:</span>
            <select className="form-control formcontrol">
              <option value="575">Hyderabad</option>
              <option value="579">Vishakapatnam</option>
              <option value="580">Bengaluru</option>
              <option value="581">Mumbai</option>
              <option value="583">Pune</option>
              <option value="586">Vijayawada</option>
              <option value="588">Delhi</option>
              <option value="597">Sangareddy</option>
              <option value="598">Ahmedabad</option>
              <option value="599">Kolkata</option>
              <option value="600">Chennai</option>
              <option value="601">Surat</option>
              <option value="602">Kochi</option>
              <option value="603">Trivendrum</option>
              <option value="604">Agra</option>
              <option value="605">Mysore</option>
              <option value="606">Patna</option>
              <option value="607">Amritsar</option>
              <option value="608">Nagpur</option>
              <option value="609">Bhopal</option>
              <option value="610">Rajkot</option>
              <option value="611">Ranchi</option>
              <option value="612">Goa</option>
            </select>
          </div>
          {/* Didn't find your city in the dropdown? Select Others */}
        </div>
        <div className="col-md-8  ">
          <div className="d-flex sel_blo justify-content-end listi-blo">
            <span>Select No of Listings: </span>
            <select className="form-control formcontrol">
              <option value="575">1</option>
              <option value="579">2</option>
            </select>
          </div>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-md-4">
          <div className="bg-color1">
            <div className="pricing-item text-center">
              <h2 className="gold">GOLD</h2>
              <h6>15 Days</h6>
              <h3>₹ 999</h3>
              <ul>
                <li>Listings: 1</li>
              </ul>
              <button className="purchage-btn">Purchase</button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-color2">
            <div className="pricing-item text-center">
              <h2 className="gold">PLATINUM</h2>
              <h6>90 Days</h6>
              <h3>₹ 1,750</h3>
              <ul>
                <li>Listings: 1</li>
              </ul>
              <button className="purchage-btn">Purchase</button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-color3">
            <div className="pricing-item text-center">
              <h2 className="gold">DIAMOND</h2>
              <h6>90 Days</h6>
              <h3>₹ 3,000</h3>
              <ul>
                <li>Listings: 1</li>
              </ul>
              <button className="purchage-btn">Purchase</button>
            </div>
          </div>
        </div>
      </div>

               </div>
      </div>
    </div>
  </div>
  )
}

export default Buyrentpackages
