import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';

import { GoEye } from "react-icons/go";
import { FaRegEdit } from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";


const OngoingExpo = () => {

  const [show, setShow] = useState(false);

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
               <li className="breadcrumb-item active">Ongoing Expos</li>
             </ol>
           </div>
           <div className="page-title-right">
             <button  className="btn btn-info" onClick={()=>setShow(true)}>
             Ongoing Expos
             </button>
           </div>
         </div>
       </div>
     </div>
       
       <div className="row justify-content-center">
       <div className="col-md-12">
         <div className="card">
           <div className="card-header">
             <h3 className="card-title">Ongoing Expos</h3>
             <div className="mb-0 d-flex">
             {/* <select className='form-select'>
                     <option>
                       Select Country
                     </option>
                     <option>
                       India
                     </option>
                     <option>
                       Dubai
                     </option>
                     </select> */}
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
             <input type="Sumit" className="btn  ml-2" value="Search" />
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
                     <th>From Date</th>
                     <th>To Date</th>
                     <th>Action</th>
                   
                   </tr>
                 </thead>
                 <tbody>
                      
             <tr >
                       <td>1</td>   
                       <td>INHYDJAN08-2024</td>   
                       <td>Residential</td>   
                       <td>Hyderabad</td>   
                       <td>02-02-2024</td>   
                       <td>03-02-2024 </td>   
                       <td> <Link to="/expo/details" className='ml-2'><span className='sta_iconn'> <FaRegEdit />
                       </span></Link>
                        <Link to="/expo/details"><span className='sta_iconn'><GoEye />
                       </span></Link> 
                       </td>    
           </tr>
            
        
                    
           
                 </tbody>
               </table>
             </div>
           </div>
         </div>
       </div>
     </div>

     <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
       <Offcanvas.Header closeButton></Offcanvas.Header>
       <Offcanvas.Body>
         <div className="card">
           <div className="card-header">
             <h3 className="card-title">Create Package</h3>
           </div>
           <div className="card-body">
             <form className="custom-validation">
               <div className="mb-3">
               <div className="form-floating">
                   
                   <select className='form-select'>
                    
                     <option>
                       Select Country
                     </option>
                     <option>
                       India
                     </option>
                     <option>
                       Dubai 
                     </option>
                     <option>
                       Australia 
                     </option>
                     <option>
                       England 
                     </option>
                   </select>
                       
                 </div>
               </div>
               <div className="mb-3">
               <div className="form-floating">
                   
                   <select className='form-select'>
                    
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
                       
                 </div>
               </div>
               <div className="mb-3">
               <div className="form-floating">
                   
                   <select className='form-select'>
                    
                     <option>
                       Expo Type
                     </option>
                     <option>
                       Residential
                     </option>
                     <option>
                       Commercial
                     </option>
                     <option>
                       City
                     </option>
                     <option>
                       Amount
                     </option>
                    
                   </select>
                       
                 </div>
               </div>
               <div className="mb-3">
               <div className="form-floating">
                   
                   <select className='form-select'>
                    
                     <option>
                       Package Tenure
                     </option>
                     <option>
                       1 Expo
                     </option>
                     <option>
                       3 Expos
                     </option>
                     <option>
                       6 Expo
                     </option>
                    
                    
                   </select>
                       
                 </div>
               </div>

                   <div className="mb-3">
                 <div className="form-floating">
                     <input
                       type="text"
                     
                       className="form-control"
                       name="amount"
                           placeholder="Amount "
                    
                     />
                     <label for="project-type" className="fw-normal">
                       Amount
                         </label>
                         
                   </div>
                 </div>
               <div className="col-12">
                 <button className="btn btn-primary" type="button" >
                   Save
                 </button>
               </div>
             </form>
           </div>
         </div>
       </Offcanvas.Body>
     </Offcanvas>
    
     </div>
   </div>
 </div>
   </>
  )
}

export default OngoingExpo