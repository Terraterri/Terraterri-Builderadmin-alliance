import React,{useState,useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Link } from 'react-router-dom';
import { IoSearch } from "react-icons/io5";
import { GoEye } from "react-icons/go";

const FeatureDetails = () => {
    
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
                  <li className="breadcrumb-item active">Future Expos</li>
                </ol>
              </div>
              {/* <div className="page-title-right">
                <button className="btn btn-info">Add States</button>
              </div> */}
            </div>
          </div>
        </div>
{/*            
       
      */}
     <div className="cardd">

       <div className="row">
         <div className="col-md-6">
             <div className='details_ot details_ot1'>
               <ul>
                 <li><span>ID</span> : 01</li>
                 <li><span>Expo Code </span> : INHYD12APR24-R</li>
                 <li><span>City </span> : HYD</li>
                 <li><span>Date From </span> : 2024-06-11</li>
                 <li><span>Date To	 </span> : 2024-04-13	</li>
                 <li><span>Expo Type	</span> : R </li>
               </ul>

             </div>
         </div>
         <div className="col-md-6">
         <div className='details_ot details_ot2 align-items-baseline'>
               <ul>
                 <li><span>Stall Customize</span>	 : <Link to="/stallmanagement"><GoEye /></Link></li>
                 {/* <li><span>E-Broucher Download</span>	 : <Link to="/ebroucher">3000</Link></li>
                 <li><span>Enquiry</span>	 : <Link to="/enquirylist">21</Link></li>
                 <li><span>Whatsapp Call</span>	 : <Link to="/whatsappcall">21</Link></li>
                 <li><span>Drop Message</span>	 : <Link to="/dropmessage">21</Link></li> */}

             
                 
               </ul>

             </div>
         </div>
       </div>


     </div>

      </div>
    </div>


  </div>
  )
}

export default FeatureDetails