import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { MdWhatsapp } from "react-icons/md";
import { RiCustomerService2Line } from "react-icons/ri";
import { RiMessage2Fill } from "react-icons/ri";
import { RiFilePdfLine } from "react-icons/ri";
import { PiNote } from "react-icons/pi";
import { FaFileDownload } from "react-icons/fa";
import { GoEye } from "react-icons/go";
import { Link, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { expoApiClient } from '../../utils/httpClient';
import moment from 'moment';
const NoofExecutive = () => {
  const { expoUnqCode, stallId } = useParams()
  const [loading, setLoading] = useState(false)
  const [analyticsData, setAnalyticsData] = useState([])

  const [show, setShow] = useState(false);
  const [WhatsappShow, setWhatsappShow] = useState(false);
  const [EnquiryShow, setEnquiryShow] = useState(false);
  const [CommentShow, setCommentShow] = useState(false);
  const [DropMessageShow, setDropMessageShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setWhatsappShow(false);
    setEnquiryShow(false);
    setCommentShow(false);
    setDropMessageShow(false);
  }

  const handleShow = () => setShow(true);
  const handleWhatsapp = () => setWhatsappShow(true);


  const getExpoStallAnalytics = async () => {
    setLoading(true)
    try {
      const res = await expoApiClient.get(`expoAnalytics/getStallCustomers.php?expoCode=${expoUnqCode}&stallId=${stallId}`)
      if (res?.data?.success) {
        setAnalyticsData(res?.data?.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getExpoStallAnalytics()
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
                      <li className="breadcrumb-item active">No of Visitors Executive </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {Object.keys(analyticsData).length === 0 ? (
              <div className="text-center mt-4">

                      <div className="card-body">
                          <div className="table-responsive-md">
                            <table className="table text-nowrap mb-0">
                              <thead>
                                <tr>
                                  <th>S.no</th>
                                  <th>Visitor Name</th>
                                  <th>Mobile Number</th>
                                  <th>Email Id</th>
                                  <th>Joined At</th>
                                  <th>Activity</th>
                                  <th>Comments</th>
                                </tr>
                              </thead>
                              {/* <tbody>
                                {exec.users.length === 0 ? (
                                  <tr>
                                    <td colSpan="7" className="text-center">No users found</td>
                                  </tr>
                                ) : (
                                  exec.users.map((user, idx) => (
                                    <tr key={user.userId}>
                                      <td>{idx + 1}</td>
                                      <td>{user.name}</td>
                                      <td>{user.number}</td>
                                      <td>{user.email}</td>
                                      <td>{moment(user.joined_at, "HH:mm:ss").format("hh:mm A")}</td>
                                      <td>
                                        <span className='icons_list'>
                                          <Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button>
                                          <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button>
                                          <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>
                                          <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button>
                                        </span>
                                      </td>
                                      <td>
                                        <span className='sta_iconn'>
                                          <Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button>
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody> */}
                            </table>
                          </div>
                        </div>
                <h5 className="text-center mt-5" >No data available</h5>
              </div>
            ) : (
              Object.entries(analyticsData).map(([date, executives], dayIndex) =>
                executives.map((exec, execIndex) => (
                  <div className="row justify-content-center mt-4" key={`${date}-${exec.executiveId}`}>
                    <div className="col-md-12">
                      <div className="card">
                        <div className="card-header card-header-e2">
                          <h3 className="card-title">Table - {exec.tableId}</h3>
                          <h3 className="card-title">
                            Day-{dayIndex + 1} ({new Date(date).toLocaleDateString('en-GB')})
                          </h3>
                          <h3 className="card-title">{exec.executive_name}</h3>
                        </div>
                        <div className="card-body">
                          <div className="table-responsive-md">
                            <table className="table text-nowrap mb-0">
                              <thead>
                                <tr>
                                  <th>S.no</th>
                                  <th>Visitor Name</th>
                                  <th>Mobile Number</th>
                                  <th>Email Id</th>
                                  <th>Joined At</th>
                                  <th>Activity</th>
                                  <th>Comments</th>
                                </tr>
                              </thead>
                              {/* <tbody>
                                {exec.users.length === 0 ? (
                                  <tr>
                                    <td colSpan="7" className="text-center">No users found</td>
                                  </tr>
                                ) : (
                                  exec.users.map((user, idx) => (
                                    <tr key={user.userId}>
                                      <td>{idx + 1}</td>
                                      <td>{user.name}</td>
                                      <td>{user.number}</td>
                                      <td>{user.email}</td>
                                      <td>{moment(user.joined_at, "HH:mm:ss").format("hh:mm A")}</td>
                                      <td>
                                        <span className='icons_list'>
                                          <Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button>
                                          <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button>
                                          <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>
                                          <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button>
                                        </span>
                                      </td>
                                      <td>
                                        <span className='sta_iconn'>
                                          <Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button>
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody> */}
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )
            )}



            {/*-------- Broucher-popup starts-------- */}
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton></Modal.Header>
              <div className='popup'>
                <div className="row justify-content-center">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">Ebroucher</h3>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive-md">
                          <table className="table text-nowrap mb-0">
                            <thead>
                              <tr>
                                <th>Ebroucher</th>
                                <th>Project Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>Maa Srinivasan</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>

            {/*-------- Whatsapp-popup starts-------- */}
            <Modal show={WhatsappShow} onHide={handleClose}>
              <Modal.Header closeButton></Modal.Header>
              <div className='popup'>
                <div className="row justify-content-center">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">Whatsup Callss</h3>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive-md">
                          <table className="table text-nowrap mb-0">
                            <thead>
                              <tr>
                                <th>S.no</th>
                                <th>Executive</th>
                                <th>Name</th>
                                <th>Contacted Time</th>
                                <th>Duration</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>WE1</td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>

            {/*-------- Enquiry-popup starts-------- */}
            <Modal show={EnquiryShow} onHide={handleClose}>
              <Modal.Header closeButton></Modal.Header>
              <div className='popup'>
                <div className="row justify-content-center">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header">
                        <h3 className="card-title">Enqiry</h3>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive-md">
                          <table className="table text-nowrap mb-0">
                            <thead>
                              <tr>
                                <th>S.No</th>
                                <th>Project Name</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>Maa Srinivasan</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>

            {/*-------- drop-popup starts-------- */}
            <Modal show={DropMessageShow} onHide={handleClose}>
              <Modal.Header closeButton></Modal.Header>
              <div className='popup'>
                <div className="row justify-content-center">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header justify-content-center">
                        <h3 className="card-title">Drop Message</h3>
                      </div>
                      <div className="card-body">
                        <div className='drop_text w-50 m-auto text-justify'>
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sapien neque, euismod suscipit eleifend quis, mollis in ante. Donec imperdiet risus quis lorem lobortis, vel euismod justo dictum. Vestibulum congue mattis interdum. Praesent sit amet diam a velit consequat commodo quis placerat eros.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>

            {/*-------- Comment-popup starts-------- */}
            <Modal show={CommentShow} onHide={handleClose}>
              <Modal.Header closeButton></Modal.Header>
              <div className='popup'>
                <div className="row justify-content-center">
                  <div className="col-md-12">
                    <div className="card">
                      <div className="card-header justify-content-center">
                        <h3 className="card-title">Comment Message</h3>
                      </div>
                      <div className="card-body">
                        <div className='drop_text w-50 m-auto text-justify'>
                          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sapien neque, euismod suscipit eleifend quis, mollis in ante. Donec imperdiet risus quis lorem lobortis, vel euismod justo dictum. Vestibulum congue mattis interdum. Praesent sit amet diam a velit consequat commodo quis placerat eros.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>

          </div>
        </div>
      </div>
    </>
  )
}

export default NoofExecutive