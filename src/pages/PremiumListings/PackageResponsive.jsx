import React, { useState, useEffect } from 'react'

import Loader from '../../components/Loader';
import { masterClient } from '../../utils/httpClient';

import { useParams } from 'react-router-dom';

const PackageResponsive = () => {

  const [userResponse, setUserResponse] = useState({});
  const [loading, setLoading] = useState(false);

  const { id } = useParams()

  const getProjectResponses = async () => {
    setLoading(true);
    let res;
    try {
      res = await masterClient.get(`/responses/${id}`);
      if (res?.data?.status) {
        setUserResponse(res?.data?.data)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getProjectResponses();
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
                    <h4 class="mb-0">Package Response</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="card cardd">
              {" "}
              <div className="profile-det-titls">
                <h5>Project Name / Apartment / BHK / SFT / Price / Location / City</h5>
              </div>

              <div class="col-md-12 text-center mt-3 mb-4">

                <div class="table_out">
                  <table class="table table_nw propertyTable">
                    <thead>
                      <tr>
                        <th>Customer Name</th>
                        <th>Mobile number </th>
                        <th>Mail id</th>
                        <th>Enquired Date</th>
                        <th>Scheduled Visits	</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userResponse.length > 0 ?

                        userResponse.map((item, index) => (
                          <tr key={index}>
                            <td>{item.name} </td>
                            <td>{item.mobile}</td>
                            <td>{item.email}</td>
                            <td>{item.contacted_date}</td>
                            <td>29-09-2024| 09:30am</td>
                          </tr>
                        ))
                        :
                        <tr>
                          <td colSpan={5}>No Responses Found</td>
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
    </>
  )
}

export default PackageResponsive