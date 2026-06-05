import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link, useParams } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { GoEye } from "react-icons/go";
import Loader from '../components/Loader';
import { expoAdminClient } from '../utils/httpClient';

const ViewDetails = () => {
  const { expoUnqCode, stallId } = useParams();

  const [loading, setLoading] = useState(false);
  const [expoDetails, setExpoDetails] = useState({});
  const [VisitorsCount, setVisitorsCount] = useState(0)


  const getExpo = async () => {
    setLoading(true)
    try {
      const res = await expoAdminClient.get(`NewExpo/getByUnqCode.php?expoCode=${expoUnqCode}&stallId=${stallId}`)
      if (res?.data?.status) {
        setExpoDetails(res?.data?.data)
        setVisitorsCount(res?.data?.noOfVisitors)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    getExpo()
  }, [], [expoUnqCode])

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
                      <li className="breadcrumb-item active">View Details</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="cardd">
              <div className="row">
                <div className="col-md-6">
                  <div className='details_ot details_ot1'>
                    <ul>
                      <li><span>ID</span> : {expoDetails?.newExpoId}</li>
                      <li><span>Expo Code </span> : {expoDetails?.expoUnqCode}</li>
                      <li><span>City </span> : {expoDetails?.expoCity}</li>
                      <li><span>Date From </span> : {expoDetails?.fromDate}</li>
                      <li><span>Date To	 </span> : {expoDetails?.toDate}	</li>
                      <li><span>Expo Type	</span> : {expoDetails?.expoType} </li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className='details_ot details_ot2'>
                    <ul>
                      <li>
                        <span>Stall Management</span>&nbsp;:&nbsp;
                        <Link to={`/stall/management/${stallId}`}>
                          <GoEye />
                        </Link>
                      </li>
                      <li>
                        <span>No of Visitors Executive Wise</span>&nbsp;:&nbsp;
                        <Link to={`/noofexecutiveswise/${expoUnqCode}/${stallId}`}>
                          {VisitorsCount}
                        </Link>
                      </li>
                      <li>
                        <span>E-Broucher Download</span>&nbsp;:&nbsp;
                        <Link to="/ebroucher">3000</Link>
                      </li>
                      <li>
                        <span>Enquiry</span>&nbsp;:&nbsp;
                        <Link to="/enquirylist">21</Link>
                      </li>
                    </ul>
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

export default ViewDetails