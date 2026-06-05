import React,{useState} from 'react';
import { Link } from 'react-router-dom';

const Activerentpackage = () => {

  const [ActiveBox, setActiveBox] = useState(true);
  const [ExpiredBox, setExpiredBox] = useState(false);
  const [FutureBox, setFutureBox] = useState(false);

  
  const handleActive = () => {
    setActiveBox(true);
    setExpiredBox(false);
    setFutureBox(false);
  };
  const handleExpired = () => {
    setActiveBox(false);
    setExpiredBox(true);
    setFutureBox(false);
  };
  const handleFuture = () => {
    setActiveBox(false);
    setExpiredBox(false);
    setFutureBox(true);
  };


  return (
    <div className="main-content">
    <div className="page-content">
      <div className="container">
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active">Active Rent Packages</li>
              </ol>
            </div>
          </div>
        </div>  
            </div>
            
            <div className="card cardd">
           {" "}
      <div className="profile-det-titls">
        {/* <h5 className="PremiumAccount mb-4">PREMIUM LISTINGS</h5> */}
        <h3 className="PremiumAccount1"> Buy Packages</h3>
      </div>
      
      <div class="col-md-12 text-center mt-3 mb-4">
  <div class="row mt-2 mb-5">
    <div class="col-md-6 col-lg-4">
      <button type="button" class="handleActive" onClick={handleActive} >
      <div
                    className={
                      ActiveBox
                        ? "dashboard-widget-color-active dashboard-widget1"
                        : "dashboard-widget1 dashboard-widget-color-1"
                    }
                  >
          <div class="dashboard-widget-info">
            <h2 class="card__title">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" class="iconCheck" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M416 64H96c-17.7 0-32 14.3-32 32v320c0 17.7 14.3 32 32 32h320c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm4 348c0 4.4-3.6 8-8 8H100c-4.4 0-8-3.6-8-8V100c0-4.4 3.6-8 8-8h312c4.4 0 8 3.6 8 8v312z"></path>
                <path d="M363.6 192.9L346 174.8c-.7-.8-1.8-1.2-2.8-1.2-1.1 0-2.1.4-2.8 1.2l-122 122.9-44.4-44.4c-.8-.8-1.8-1.2-2.8-1.2-1 0-2 .4-2.8 1.2l-17.8 17.8c-1.6 1.6-1.6 4.1 0 5.7l56 56c3.6 3.6 8 5.7 11.7 5.7 5.3 0 9.9-3.9 11.6-5.5h.1l133.7-134.4c1.4-1.7 1.4-4.2-.1-5.7z"></path>
              </svg>55&nbsp; <span class="card__titlee">Active Packages</span>
            </h2>
          </div>
        </div>
      </button>
    </div>
    <div class="col-md-6 col-lg-4">
      <button type="button" class="handleActive" onClick={handleFuture}>
        <div className={
                      FutureBox
                        ? "dashboard-widget-color-1-active dashboard-widget1"
                        : "dashboard-widget1 dashboard-widget-color-3"
                    }>
          <div class="dashboard-widget-info">
            <h2 class="card__title3">
              <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="iconCheck" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9 11l3 3l8 -8"></path>
                <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9"></path>
              </svg> 79&nbsp; <span class="card__titlee3">Future Packages</span>
            </h2>
          </div>
        </div>
      </button>
    </div>
    <div class="col-md-6 col-lg-4">
      <button type="button" class="handleActive" onClick={handleExpired}>
        <div className={
                      ExpiredBox
                        ? "dashboard-widget-color-2-active dashboard-widget1"
                        : "dashboard-widget1 dashboard-widget-color-2"
                    } >
          <div class="dashboard-widget-info">
            <h2 class="card__title2">
              <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="iconCheck" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM5 5V19H19V5H5ZM7 11H17V13H7V11Z"></path>
              </svg>49&nbsp; <span class="card__titlee2">Expired Packages</span>
            </h2>
          </div>
        </div>
      </button>
    </div>
  </div>

  {ActiveBox && (
              <div className="packSection">
                <h4 className="ActiveHead">Active Packages</h4>
                <table className="activeTable mt-4 mb-5">
                  <thead>
                    <tr>
                      <th className="ActTh">S.No </th>
                      <th className="ActTh">Package</th>
                      <th className="ActTh">Active On</th>
                      <th className="ActTh">Expires By</th>
                      <th className="ActTh">Package Listings</th>
                      <th className="ActTh">Available Listings</th>
                    </tr>
                  </thead>
                  <tbody className="ActTBody">
                    <tr>
                      <td className="ActTd">
                       01
                      </td>
                      <td className="ActTd">
                        Gold Premium <span> HYD</span>
                      </td>
                      <td className="ActTd">11-11-2023</td>
                      <td className="ActTd">11-11-2023</td>
                      <td className="ActTd" >10</td>
                      <td className="ActTd">10</td>
                    </tr>
                  
                    <tr>
                      <td className="ActTd">
                      02
                      </td>
                      <td className="ActTd">
                        Gold Premium <span> HYD</span>
                      </td>
                      <td className="ActTd">11-11-2023</td>
                      <td className="ActTd">11-11-2023</td>
                      <td className="ActTd" >10</td>
                      <td className="ActTd">10</td>
                    </tr>
                  
                    <tr>
                      <td className="ActTd">
                        03
                      </td>
                      <td className="ActTd">
                        Gold Premium <span> HYD</span>
                      </td>
                      <td className="ActTd">11-11-2023</td>
                      <td className="ActTd">11-11-2023</td>
                      <td className="ActTd" >10</td>
                      <td className="ActTd">10</td>
                    </tr>
                  
                  </tbody>
                </table>
              </div>
            )}

            {ExpiredBox && (
              <div className="packSection">
                <h4 className="ExpiredHead">Expired Packages</h4>
                <table className="ExpiredTable mt-4 mb-5">
                  <thead>
                    <th className="ExpiredTh">Package</th>
                    <th className="ExpiredTh">Active On</th>
                    <th className="ExpiredTh">Expires By</th>
                    <th className="ExpiredTh">Package Listings</th>
                    <th className="ExpiredTh">Available Listings</th>
                  </thead>
                  <tbody className="ExpiredBody">
                    <tr>
                      <td className="ExpiredTd">
                        Gold Premium <span> HYD</span>
                      </td>
                      <td className="ExpiredTd">11-11-2023</td>
                      <td className="ExpiredTd">11-11-2023</td>
                      <td className="ExpiredTd">10</td>
                      <td className="ExpiredTd">10</td>
                    </tr>
                    
                  </tbody>
                </table>
              </div>
            )}

            {FutureBox && (
              <div className="packSection">
                <h4 className="FutureHead">Future Packages</h4>
                <table className="FutureTable mt-4 mb-5">
                  <thead>
                    <th className="FutureTh">Package</th>
                    <th className="FutureTh">Active On</th>
                    <th className="FutureTh">Expires By</th>
                    <th className="FutureTh">Package Listings</th>
                    <th className="FutureTh">Available Listings</th>
                  </thead>
                  <tbody className="FutureTBody">
                    <tr>
                      <td className="FutureTd">
                        Gold Premium <span> HYD</span>
                      </td>
                      <td className="FutureTd">11-11-2023</td>
                      <td className="FutureTd">11-11-2023</td>
                      <td className="FutureTd">01</td>
                      <td className="FutureTd">01</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}


    <div className='package_dt'>
        <div class="row mt-4 pt-0 pacRow">
          <div class="col-md-4">
            <h4 class="Package">Package : 1</h4>
            <p class="Package1">Gold Premium Hyd</p>
          </div>
          <div class="col-md-8 ActiveExpires">
            <span class="mr-3">
              <b>Active On:</b> 11-11-2023 </span>
            <span>
              <b>Expires By: </b>11-11-2023 </span>
          </div>
        </div>
        <div class="table_out mb-5 pb-2">
          <table class="table">
            <thead>
              <tr>
                <th>Listings</th>
                <th>Responses</th>
                <th>Requested Visits</th>
                <th>Scheduled Visits</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              <tr class="listTBody">
                <td>
                  <p class="list_data mb-2">Project Name / Apartment / BHK / SFT / Price / Location / City</p>
                  <div class="d-flex">
                    <p class="mb-0 mr-5 highlighted">
                      <b>ID</b> : 123456
                    </p>
                    <p class="highlighted">
                      <b>Posted On</b>: 11-11-2023
                    </p>
                  </div>
                </td>
                <td class="highlighted40"><Link to="/package/responses">40</Link></td>
                <td class="highlighted40"><Link to="/package/responses">20</Link></td>
                <td class="highlighted40"><Link to="/package/responses">20</Link></td>
                <td>
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="edit" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                  </svg>
                </td>
              </tr>
              <tr class="listTBody">
                <td>
                  <p class="list_data mb-2">Project Name / Apartment / BHK / SFT / Price / Location / City</p>
                  <div class="d-flex">
                    <p class="mb-0 mr-5 highlighted">
                      <b>ID</b> : 123456
                    </p>
                    <p class="highlighted">
                      <b>Posted On</b>: 11-11-2023
                    </p>
                  </div>
                </td>
                <td class="highlighted40"><Link to="/package/responses">40</Link></td>
                <td class="highlighted40"><Link to="/package/responses">20</Link></td>
                <td class="highlighted40"><Link to="/package/responses">20</Link></td>
                <td>
                  <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="edit" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" d="M0 0h24v24H0z"></path>
                    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>
  {/* <div class="row mt-4 pacRow">
    <div class="col-md-4">
      <h4 class="Package">Package : 2</h4>
      <p class="Package1">Gold Premium Hyd</p>
    </div>
    <div class="col-md-8 ActiveExpires">
      <span class="mr-3">
        <b>Active On:</b> 11-11-2023 </span>
      <span>
        <b>Expires By: </b>11-11-2023 </span>
    </div>
  </div>
  <div class="table_out">
    <table class="table">
      <thead>
        <tr>
          <th>Listings</th>
          <th>Responses</th>
          <th>Requested Visits</th>
          <th>Scheduled Visits</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody>
        <tr class="listTBody">
          <td>
            <p class="list_data mb-2">Project Name / Apartment / BHK / SFT / Price / Location / City</p>
            <div class="d-flex">
              <p class="mb-0 mr-5 highlighted">
                <b>ID</b> : 123456
              </p>
              <p class="highlighted">
                <b>Posted On</b>: 11-11-2023
              </p>
            </div>
          </td>
          <td>40</td>
          <td>10</td>
          <td>10</td>
          <td>
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" class="edit" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
            </svg>
          </td>
        </tr>
      </tbody>
    </table>
  </div> */}
</div>

               </div>
      </div>
    </div>
  </div>
  )
}

export default Activerentpackage


