import React, { useState, useEffect } from 'react';
import { masterClient, projectClient } from '../../utils/httpClient'
import Loader from '../../components/Loader'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MdEdit } from "react-icons/md";

const Activepakage = () => {
  const userData = useSelector((state) => state.user.userData)
  const [loading, setLoading] = useState(false);

  const [ActiveBox, setActiveBox] = useState(true);
  const [ExpiredBox, setExpiredBox] = useState(false);
  const [FutureBox, setFutureBox] = useState(false);

  const [activePackages, setActivePackages] = useState([]);
  const [futurePackages, setFuturePackages] = useState([]);
  const [expiredPackges, setExpiredPackages] = useState([]);

  const [activePackageCount, setAPCount] = useState(0)
  const [futurePackageCount, setFPCount] = useState(0)
  const [expiredPackageCount, setEPCount] = useState(0)

  const [projects, setProjects] = useState({});
  const [selectedPackage, setSelectedPackage] = useState({});
  const [packageNumber, setPackageNumber] = useState(1)

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

  useEffect(() => {
    getPurchasedPackages();
  }, [])

  const getPurchasedPackages = async () => {
    const date = new Date();
    const today = `${date.getDate()}-${date.getMonth() + 1
      }-${date.getFullYear()}`;
    setLoading(true)
    let res;
    try {
      res = await masterClient.get(`userPurchaseDetails/${userData.id}`)
      if (res?.data?.status) {
        const activepack = res?.data?.data.filter(
          (pack) =>
            pack.listing_type === 'Meta Listing'
            && pack.deactivate_date < today
        );

        const futurePack = res?.data?.data.filter((pack) => pack.listing_type === 'Meta Listing'
          && pack.activated_date > today);

        const expriredPack = res?.data?.data.filter((pack) => pack.listing_type === 'Meta Listing'
          && pack.deactivate_date > today);

        // to save packages data
        setFuturePackages(futurePack);
        setExpiredPackages(expriredPack);

        // to save packages data and count
        if (activepack.length > 0) {
          setActivePackages(activepack);
          setAPCount(activepack.length);
        }

        if (futurePack.length > 0) {
          setFuturePackages(futurePack);
          setFPCount(futurePack.length)
        }

        if (expriredPack.length > 0) {
          setExpiredPackages(expriredPack);
          setEPCount(expriredPack.length)
        }

        setSelectedPackage(res?.data?.data[0])
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  const getProjectsByPackage = async (packageId) => {
    setLoading(true)
    const body = {
      'package_id': packageId,
      'user_id': userData?.id,
      'user_role': userData?.role_id
    }
    let res;
    try {
      res = await projectClient.post(`/getProject`, body)
      if (res?.data?.status) {
        setProjects(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  const handlePackage = async (packagee, index) => {
    setPackageNumber(index + 1)
    setSelectedPackage(packagee)
    getProjectsByPackage(packagee?.package_id)
  }

  return (
    <>
      {loading && <Loader />}
      <div className="main-content">
        <div className="page-content">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item"><a href="/">Home</a></li>
                      <li className="breadcrumb-item active">Active Packages</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="card cardd">
              {" "}
              <div className="profile-det-titls">
                <h3 className="PremiumAccount1"> Buy Packages</h3>
              </div>

              <div className="col-md-12 text-center mt-3 mb-4">
                <div className="row mt-2 mb-5">
                  <div className="col-md-6 col-lg-4">
                    <button type="button" className="handleActive" onClick={handleActive} >
                      <div
                        className={
                          ActiveBox
                            ? "dashboard-widget-color-active dashboard-widget1"
                            : "dashboard-widget1 dashboard-widget-color-1"
                        }
                      >
                        <div className="dashboard-widget-info">
                          <h2 className="card__title">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="iconCheck" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                              <path d="M416 64H96c-17.7 0-32 14.3-32 32v320c0 17.7 14.3 32 32 32h320c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm4 348c0 4.4-3.6 8-8 8H100c-4.4 0-8-3.6-8-8V100c0-4.4 3.6-8 8-8h312c4.4 0 8 3.6 8 8v312z"></path>
                              <path d="M363.6 192.9L346 174.8c-.7-.8-1.8-1.2-2.8-1.2-1.1 0-2.1.4-2.8 1.2l-122 122.9-44.4-44.4c-.8-.8-1.8-1.2-2.8-1.2-1 0-2 .4-2.8 1.2l-17.8 17.8c-1.6 1.6-1.6 4.1 0 5.7l56 56c3.6 3.6 8 5.7 11.7 5.7 5.3 0 9.9-3.9 11.6-5.5h.1l133.7-134.4c1.4-1.7 1.4-4.2-.1-5.7z"></path>
                            </svg>{activePackageCount}&nbsp; <span className="card__titlee">Active Packages</span>
                          </h2>
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <button type="button" className="handleActive" onClick={handleFuture}>
                      <div className={
                        FutureBox
                          ? "dashboard-widget-color-1-active dashboard-widget1"
                          : "dashboard-widget1 dashboard-widget-color-3"
                      }>
                        <div className="dashboard-widget-info">
                          <h2 className="card__title3">
                            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="iconCheck" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                              <path d="M9 11l3 3l8 -8"></path>
                              <path d="M20 12v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h9"></path>
                            </svg> {futurePackageCount}&nbsp; <span className="card__titlee3">Future Packages</span>
                          </h2>
                        </div>
                      </div>
                    </button>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <button type="button" className="handleActive" onClick={handleExpired}>
                      <div className={
                        ExpiredBox
                          ? "dashboard-widget-color-2-active dashboard-widget1"
                          : "dashboard-widget1 dashboard-widget-color-2"
                      } >
                        <div className="dashboard-widget-info">
                          <h2 className="card__title2">
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="iconCheck" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                              <path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM5 5V19H19V5H5ZM7 11H17V13H7V11Z"></path>
                            </svg>{expiredPackageCount}&nbsp; <span className="card__titlee2">Expired Packages</span>
                          </h2>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {ActiveBox && (
                  <div className="packSection">
                    <h4 className="ActiveHead">Active Packages</h4>

                    <h5 className="platform_out mt-4">Platform Package</h5>
                    <table className="activeTable mt-2 mb-5">
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
                        {activePackages.length > 0 ?
                          activePackages.map((item, index) => (
                            <tr key={index} onClick={() => handlePackage(item, index)}>
                              <td className="ActTd">
                                {index + 1}
                              </td>
                              <td className="ActTd">
                                {item.package_type} Premium <span> {item?.city_code}</span>
                              </td>
                              <td className="ActTd">{item?.activated_date}</td>
                              <td className="ActTd">{item?.deactivate_date}</td>
                              <td className="ActTd" >{item?.total_listings}</td>
                              <td className="ActTd">{item?.available_listings}</td>
                            </tr>
                          ))
                          :
                          <tr>
                            <td colSpan={6}>No Packages Found</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                )}


                {FutureBox && (
                  <div className="packSection">
                    <h4 className="FutureHead">Future Packages</h4>
                    <h5 className="platform_out mt-4">Platform Package</h5>
                    <table className="FutureTable mt-4 mb-5">
                      <thead>
                        <tr>
                          <th className="FutureTh">S.no</th>
                          <th className="FutureTh">Package</th>
                          <th className="FutureTh">Active On</th>
                          <th className="FutureTh">Expires By</th>
                          <th className="FutureTh">Package Listings</th>
                          <th className="FutureTh">Available Listings</th>
                        </tr>
                      </thead>
                      <tbody className="ExpiredBody">
                        {futurePackages.length > 0 ?
                          futurePackages.map((item, index) => (
                            <tr key={index} onClick={() => handlePackage(item, index)}>
                              <td className="FutureTd">
                                {index + 1}
                              </td>
                              <td className="FutureTd">
                                {item.package_type} Premium <span> {item?.city_code}</span>
                              </td>
                              <td className="FutureTd">{item?.activated_date}</td>
                              <td className="FutureTd">{item?.deactivate_date}</td>
                              <td className="FutureTd" >{item?.total_listings}</td>
                              <td className="FutureTd">{item?.available_listings}</td>
                            </tr>
                          ))
                          :
                          <tr>
                            <td className="FutureTd" colSpan={6}>No Packages Found</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                    {/* <h5 className="platform_out mt-2">Promotion  Package</h5>
                    <table className="activeTable mt-2  mb-5">

                      <thead>
                        <tr>
                          <th className="FutureTh">Package</th>
                          <th className="FutureTh">Project</th>
                          <th className="FutureTh">Package Type</th>
                          <th className="FutureTh">Purchase On</th>
                          <th className="FutureTh">Active On</th>
                          <th className="FutureTh">Expires By</th>
                        </tr>
                      </thead>
                      <tbody className="ActTBody">
                        <tr>
                          <td className="FutureTd">
                            PARAGON
                          </td>
                          <td className="FutureTd">SINGNATURE FORTIUS</td>
                          <td className="FutureTd">Generator</td>
                          <td className="FutureTd">11-11-2023</td>
                          <td className="FutureTd">11-11-2023</td>
                          <td className="FutureTd">11-11-2023</td>
                        </tr>
                        <tr>
                          <td className="FutureTd">
                            COMBO
                          </td>
                          <td className="FutureTd">VAISHNAVI HYUDINI</td>
                          <td className="FutureTd">Enhancer</td>
                          <td className="FutureTd">11-11-2023</td>
                          <td className="FutureTd">11-11-2023</td>
                          <td className="FutureTd">11-11-2023</td>
                        </tr>
                        <tr>
                          <td className="FutureTd">
                            BUILDER
                          </td>
                          <td className="FutureTd">MAA SRINIVASAM</td>
                          <td className="FutureTd">Turbo Charger</td>
                          <td className="FutureTd">11-11-2023</td>
                          <td className="FutureTd">11-11-2023</td>
                          <td className="FutureTd">11-11-2023</td>
                        </tr>
                      </tbody>
                    </table> */}
                  </div>
                )}


                {ExpiredBox && (
                  <div className="packSection">
                    <h4 className="ExpiredHead">Expired Packages</h4>

                    <h5 className="platform_out mt-4">Platform Package</h5>
                    <table className="ExpiredTable mt-4 mb-5">
                      <thead>
                        <tr>
                          <th className="ExpiredTh">S.no</th>
                          <th className="ExpiredTh">Package</th>
                          <th className="ExpiredTh">Active On</th>
                          <th className="ExpiredTh">Expires By</th>
                          <th className="ExpiredTh">Package Listings</th>
                          <th className="ExpiredTh">Available Listings</th>
                        </tr>
                      </thead>
                      <tbody className="ExpiredBody">
                        {expiredPackges.length > 0 ?
                          expiredPackges.map((item, index) => (
                            <tr key={index} onClick={() => handlePackage(item, index)}>
                              <td className="ExpiredTd">
                                {index + 1}
                              </td>
                              <td className="ExpiredTd">
                                {item.package_type} Premium <span> {item?.city_code}</span>
                              </td>
                              <td className="ExpiredTd">{item?.activated_date}</td>
                              <td className="ExpiredTd">{item?.deactivate_date}</td>
                              <td className="ExpiredTd" >{item?.total_listings}</td>
                              <td className="ExpiredTd">{item?.available_listings}</td>
                            </tr>
                          ))
                          :
                          <tr>
                            <td className='ExpiredTd' colSpan={6}>No Packages Found</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>

                )}


                <div className='package_dt'>
                  {selectedPackage != null &&
                    <div className="row mt-4 pt-5 pacRow">
                      <div className="col-md-4">
                        <h4 className="Package">Package : {packageNumber}</h4>
                        <p className="Package1">{selectedPackage.package_type} {selectedPackage.city_code}</p>
                      </div>
                      <div className="col-md-8 ActiveExpires">
                        <span className="mr-3">
                          <b>Active On:</b> {selectedPackage?.activated_date}
                        </span>
                        <span>
                          <b>Expires By: </b> {selectedPackage?.deactivate_date}
                        </span>
                      </div>
                    </div>
                  }
                  <div className="table_out mb-5 pb-2">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Listings</th>
                          <th>Responses</th>
                          <th>Requested Visits</th>
                          <th>Scheduled Visits</th>
                          <th>Visited</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {projects.length > 0 ?
                          projects.map((item, index) => (
                            <tr className="listTBody" key={index}>
                              <td>
                                <p className="list_data mb-2">{item?.name} / {item?.sub_type} / {item?.property_min_size} - {item.property_max_size} SFT / Price {item?.total_base_price} / {item?.city_code}</p>
                                <div className="d-flex">
                                  <p className="mb-0 mr-5 highlighted">
                                    <b>ID</b> : {item?.propertyId}
                                  </p>
                                  <p className="highlighted">
                                    <b>Posted On</b>: 11-11-2023
                                  </p>
                                </div>
                              </td>
                              <td className="highlighted40"><Link to={`/package/responses/${item?.id}`}>40</Link></td>
                              <td className="highlighted40"><Link to={`/package/responses/${item?.id}`}>20</Link></td>
                              <td className="highlighted40"><Link to={`/package/responses/${item?.id}`}>20</Link></td>
                              <td>
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="edit" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                  <path fill="none" d="M0 0h24v24H0z"></path>
                                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"></path>
                                </svg>
                              </td>
                            </tr>

                          ))
                          :
                          <tr>
                            <td colSpan={5}>No Listings Found</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Activepakage
