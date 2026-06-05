import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { expoApiClient } from '../utils/httpClient';
import Loader from '../components/Loader';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const PendingExpo = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userData);
  const [expoStalls, setExpoStalls] = useState([]);
  const [loading, setLoading] = useState(true);

  const goToAddExecutive = (expoCode, stallCode, newStallId) => {
    navigate("/stall/create", {
      state: { expoCode: expoCode, stallCode: stallCode, newStallId: newStallId }
    });
  };


  const getExpoStalls = async () => {
    setLoading(true)
    try {
      const response = await expoApiClient.get(
        `/stallBooking/getBuilderStallBookings.php?builderId=${user.id}`
      );
      if (response?.data?.status === 'Success') {
        setExpoStalls(response.data?.data);
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getExpoStalls();
  }, [])

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
                      <li className="breadcrumb-item active">Pending Expos</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">	Customize Your Stall</h3>
                    <div className="mb-0 d-flex">
                      <select className='form-select ml-2'>
                        <option>Select City</option>
                        <option>Hyderabad</option>
                        <option>Andra Pradesh</option>
                        <option>Chennai</option>
                      </select>
                      <select className='form-select ml-2'>
                        <option>Expo Type</option>
                        <option>Residential</option>
                      </select>
                      <input type="Sumit" className="btn  ml-2" />
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
                            <th>City</th>
                            <th>Month</th>
                            <th>Year</th>
                            <th>Stall No</th>
                            <th className='text-center'>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expoStalls.length > 0 ?
                            expoStalls.map((ele, idx) => (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>
                                  {ele.expoUnqCode} <br></br>
                                </td>
                                <td>{ele.expoType}</td>
                                <td>{ele.expoCity}</td>
                                <td>{ele.fromDate}</td>
                                <td>{ele.toDate}</td>
                                <td>{ele.stallNumber} </td>
                                <td className='text-center'>
                                  <span className='sta_icon' onClick={() => goToAddExecutive(ele.expoUnqCode, ele.stallNumber, ele.newStallId)}>
                                    <button> Customize Stall</button>
                                  </span>
                                </td>
                              </tr>
                            ))
                            :
                            <tr>
                              <td colSpan={8}>No Stalls Found</td>
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

export default PendingExpo