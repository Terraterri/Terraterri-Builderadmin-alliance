import React,{useState,useEffect} from 'react';
// import Loader from '../../../components/Loader'; 
import { MdWhatsapp } from "react-icons/md";
import { RiCustomerService2Line } from "react-icons/ri";
import { RiMessage2Fill } from "react-icons/ri";
import { RiFilePdfLine } from "react-icons/ri";
import { PiNote } from "react-icons/pi";
import { FaFileDownload } from "react-icons/fa";
import { GoEye } from "react-icons/go";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Executivedashboard = () => {

    const [show, setShow] = useState(false);
  const [WhatsappShow, setWhatsappShow] = useState(false);
  const [EnquiryShow, setEnquiryShow] = useState(false);
  const [CommentShow, setCommentShow] = useState(false);
  const [DropMessageShow, setDropMessageShow] = useState(false);

  const handleClose = () => {setShow(false); setWhatsappShow(false); setEnquiryShow(false); setCommentShow(false);  setDropMessageShow(false);} 
  
  const handleShow = () => setShow(true);
  const handleWhatsapp = () => setWhatsappShow(true);




  return (
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
                  <li className="breadcrumb-item active">Executive Dashboard</li>
                </ol>
              </div>
              {/* <div className="page-title-right">
                <button className="btn btn-info">Add States</button>
              </div> */}
            </div>
          </div>
        </div>


     
     <div className="row justify-content-center">
       <div className="col-md-12">
         <div className="card">
           <div className="card-header">
             <h3 className="card-title">Executive E1</h3>
             <h3 className="card-title">Day-1 (20-07-2024)</h3>
             <h3 className="card-title">Executive Name</h3>
            
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
                     <th>Time Spent</th>
                     <th>Activity</th>
                     <th>Comments</th>
                    

                   </tr>
                 </thead>
                 <tbody>
                <tr>
                 <td>1</td>
                 <td>Satyanarayana</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                 <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                 
                </tr>
                <tr>
                 <td>1</td>
                 <td>Satyanarayana</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                 <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                 
                </tr>
                <tr>
                 <td>1</td>
                 <td>Satyanarayana</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                 <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                 
                </tr>
                <tr>
                 <td>1</td>
                 <td>Satyanarayana</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                 <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                 
                </tr>
                <tr>
                 <td>1</td>
                 <td>Satyanarayana</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                 <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                 
                </tr>
                <tr>
                 <td>1</td>
                 <td>Satyanarayana</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                 <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                 
                </tr>
                <tr>
                 <td>1</td>
                 <td>Satyanarayana</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                 <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                 
                </tr>
            
              
                 </tbody>
               </table>
             </div>
           </div>
         </div>
       </div>
     </div>
     <div className="row justify-content-center mt-4">
       <div className="col-md-12">
         <div className="card">
           <div className="card-header">
             <h3 className="card-title">Executive E1</h3>
             <h3 className="card-title">Day-2 (20-07-2024)</h3>
             <h3 className="card-title">Executive Name</h3>
            
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
                     <th>Time Spent</th>
                     <th>Activity</th>
                     <th>Comments</th>
                    

                   </tr>
                 </thead>
                 <tbody>
                 <tr>
                 <td>1</td>
                 <td>Nagendra</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                </tr>
                 <tr>
                 <td>1</td>
                 <td>Nagendra</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                </tr>
                 <tr>
                 <td>1</td>
                 <td>Nagendra</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                </tr>
                 <tr>
                 <td>1</td>
                 <td>Nagendra</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                </tr>
                 <tr>
                 <td>1</td>
                 <td>Nagendra</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                </tr>
                 <tr>
                 <td>1</td>
                 <td>Nagendra</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                </tr>
                 <tr>
                 <td>1</td>
                 <td>Nagendra</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                </tr>
                 <tr>
                 <td>1</td>
                 <td>Nagendra</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                </tr>
                 <tr>
                 <td>1</td>
                 <td>Nagendra</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                </tr>
                 <tr>
                 <td>1</td>
                 <td>Nagendra</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                </tr>
                 <tr>
                 <td>1</td>
                 <td>Nagendra</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                </tr>
                 <tr>
                 <td>1</td>
                 <td>Nagendra</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                </tr>
                 <tr>
                 <td>1</td>
                 <td>Nagendra</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                </tr>
                 <tr>
                 <td>1</td>
                 <td>Nagendra</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                </tr>
              
                 </tbody>
               </table>
             </div>
           </div>
         </div>
       </div>
     </div>
 {/* ///////////////////////////////////////////////////// */}

 {/* <div className="row justify-content-center mt-4">
       <div className="col-md-12">
         <div className="card">
           <div className="card-header card-header-e2">
             <h3 className="card-title">Executive E2</h3>
             <h3 className="card-title">Day-1 (21-07-2024)</h3>
             <h3 className="card-title">Executive Name</h3>
            
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
                     <th>Time Spent</th>
                     <th>Activity</th>
                     <th>Comments</th>
                    

                   </tr>
                 </thead>
                 <tbody>
                 <tr>
                 <td>1</td>
                 <td>Santosh</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                </tr>
              
                 </tbody>
               </table>
             </div>
           </div>
         </div>
       </div>
     </div>
     <div className="row justify-content-center mt-4">
       <div className="col-md-12">
         <div className="card">
           <div className="card-header card-header-e2 ">
             <h3 className="card-title">Executive E2</h3>
             <h3 className="card-title">Day-2 (21-07-2024)</h3>
             <h3 className="card-title">Executive Name</h3>
            
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
                     <th>Time Spent</th>
                     <th>Activity</th>
                     <th>Comments</th>
                    

                   </tr>
                 </thead>
                 <tbody>
                 <tr>
                 <td>1</td>
                 <td>Murali</td>
                 <td>0987654321</td>
                 <td>test@gmail.com</td>
                 <td>2 Hours</td>
                <td><span className='icons_list'><Button variant="primary" onClick={handleShow} className='listin_btn'><FaFileDownload /></Button> <Button variant="primary" onClick={handleWhatsapp} className='listin_btn'><MdWhatsapp /></Button> <Button variant="primary" onClick={setEnquiryShow} className='listin_btn'><PiNote /></Button>  <Button variant="primary" onClick={setDropMessageShow} className='listin_btn'><RiMessage2Fill /></Button></span> </td>
                 <td> <span className='sta_iconn'><Button variant="primary" onClick={setCommentShow} className='listin_btn'><GoEye /></Button></span></td>
                </tr>
              
                 </tbody>
               </table>
             </div>
           </div>
         </div>
       </div>
     </div> */}

     {/* ///////////////////////////////////////// */}


 
 
{/*-------- Broucher-popup starts-------- */}


<Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
           
          </Modal.Header>
         
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
          <Modal.Header closeButton>
           
          </Modal.Header>
         
          <div className='popup'>
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Whatsup Callss

                  </h3>
                 
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
          <Modal.Header closeButton>
           
          </Modal.Header>
         
          <div className='popup'>
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Enqiry

                  </h3>
                 
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
          <Modal.Header closeButton>
           
          </Modal.Header>
         
          <div className='popup'>
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header justify-content-center">
                  <h3 className="card-title">Drop Message

                  </h3>
                 
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
          <Modal.Header closeButton>
           
          </Modal.Header>
         
          <div className='popup'>
          <div className="row justify-content-center">
            <div className="col-md-12">
              <div className="card">
                <div className="card-header justify-content-center">
                  <h3 className="card-title">Comment Message

                  </h3>
                 
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
  )
}

export default Executivedashboard