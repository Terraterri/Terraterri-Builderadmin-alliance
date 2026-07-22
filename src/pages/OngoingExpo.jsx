import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FaRegEdit } from "react-icons/fa";
import { GoEye } from "react-icons/go";
import { expoApiClient } from '../utils/httpClient';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';
const OngoingExpo = () => {
  const userData = useSelector(state => state.user.userData);
  const [futureExpos, setFutureExpos] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFutureExpos = async () => {
    setLoading(true);
    try {
      const response = await expoApiClient.get(`/stallBooking/getBuilderOngoingStalls.php?builderId=${userData.id}`);
      if (response?.data?.status) {
        setFutureExpos(response.data?.data);
      }
    } catch (error) {
      console.error('fetchFutureExpos -> error', error);
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchFutureExpos();
  }, []);

  return (
    <>
      {loading && <Loader />}
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
                      <li className="breadcrumb-item active">Future Expos</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Future Expo</h3>
                    <div className="mb-0 d-flex">

                      <select className='form-select ml-2'>
                        <option>
                          Select City
                        </option>
                        <option>
                          Hyderabad
                        </option>
                        <option>
                          Andra Pradesh
                        </option>
                        <option>
                          Chennai
                        </option>
                      </select>
                      <select className='form-select ml-2'>
                        <option>
                          Expo Type
                        </option>
                        <option>
                          Residential
                        </option>
                      </select>
                      <button type="Sumit" className="btn btn-info ml-2">Search</button>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>S.no</th>
                            <th>Expo Code</th>
                            <th>Expo Type</th>
                            <th>Stall Type</th>
                            <th>Stall Number</th>
                            <th>City</th>
                            <th>Month</th>
                            <th>Year</th>
                            <th>Edit</th>
                            <th>View</th>
                          </tr>
                        </thead>
                        <tbody>
                          {futureExpos.length > 0 ? futureExpos.map((expo, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{expo.expoUnqCode}</td>
                              <td>{expo.expoType}</td>
                              <td>{expo.stallType}</td>
                              <td>{expo.stallNumber}</td>
                              <td>{expo.expoCity}</td>
                              <td>{expo.fromDate}</td>
                              <td>{expo.toDate}</td>
                              <td>
                                <Link to={`/stall/management/${expo.stallInfoId}`}>
                                  <FaRegEdit />
                                </Link>
                              </td>
                              <td>
                                <Link to={`/expo/details/${expo.expoUnqCode}/${expo.stallInfoId}`}>
                                  <span className='sta_iconn'>
                                    <GoEye />
                                  </span>
                                </Link>
                              </td>
                            </tr>
                          ))
                            :
                            <tr>
                              <td colSpan="7" className="text-center">No Data Found</td>
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
      </div>
    </>
  )
}

export default OngoingExpo