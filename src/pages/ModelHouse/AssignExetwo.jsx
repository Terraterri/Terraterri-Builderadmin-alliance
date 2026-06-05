import React,{useState,useEffect} from 'react';



const AssignExetwo = () => {

   
  
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
                      <li className="breadcrumb-item active">No of Visitors Executive </li>
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
                         <th>Visited Date/ Time</th>
                         <th>Executive Attend</th>
                         <th>Comments</th>
                        
    
                       </tr>
                     </thead>
                     <tbody>
                    <tr>
                     <td>1</td>
                     <td>Satyanarayana</td>
                     <td>0987654321</td>
                     <td>test@gmail.com</td>
                     <td>2/12/2025<br></br>
                     6:30pm
                     </td>
                                   
                    </tr>
                
                  
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
    )
  }
  

export default AssignExetwo
