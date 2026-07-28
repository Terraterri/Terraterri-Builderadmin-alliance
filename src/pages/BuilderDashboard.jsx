import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { expoApiClient } from '../utils/httpClient';
import Loader from '../components/Loader';

const BuilderDashboard = () => {
  const userData = useSelector((state) => state.user.userData);
  const userRole = useSelector((state) => state.user.role);

  const [visitedCount, setVisitedCount] = useState(0);
  const [enquiredCount, setEnquiredCount] = useState(0);
  const [onGoingExpo, setOnGoingExpo] = useState(0);
  const [completedExpo, setCompletedExpo] = useState(0);
  const [futureExpo, setFutureExpo] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchDashboardCounts = async () => {
    if (!userData?.id) return;
    setLoading(true);
    try {
      const response = await expoApiClient
        .get(`expoAnalytics/builderDashboardCounts.php?builderId=${userData.id}`)
        .catch(() => expoApiClient.get(`expoAnalytics/getBuilderDashboardCounts.php?builderId=${userData.id}`))
        .catch(() => expoApiClient.get(`expoAnalytics/builderDashboardCounts?builderId=${userData.id}`));

      const resData = response?.data || {};

      let vCount = resData?.visited?.count ?? 0;
      let eCount = resData?.enquiries?.count ?? 0;
      let onGoingExpo = resData?.stalls?.ongoing ?? 0;
      let completedExpo = resData?.stalls?.completed ?? 0;
      let futureExpo = resData?.stalls?.future ?? 0;

      setOnGoingExpo(onGoingExpo);
      setCompletedExpo(completedExpo);
      setFutureExpo(futureExpo);

      // Fallback: If top-level count is 0, check data array lengths or stalls array
      // if (!vCount && Array.isArray(resData?.visited?.data)) {
      //   vCount = resData.visited.data.length;
      // }
      // if (!eCount && Array.isArray(resData?.enquiries?.data)) {
      //   eCount = resData.enquiries.data.length;
      // }

      // if (!vCount && Array.isArray(resData?.stalls)) {
      //   vCount = resData.stalls.reduce((acc, stall) => acc + (stall?.visited?.count || stall?.visited?.data?.length || 0), 0);
      // }
      // if (!eCount && Array.isArray(resData?.stalls)) {
      //   eCount = resData.stalls.reduce((acc, stall) => acc + (stall?.enquiries?.count || stall?.enquiries?.data?.length || 0), 0);
      // }

      setVisitedCount(vCount);
      setEnquiredCount(eCount);
    } catch (error) {
      console.error('Error fetching builder dashboard counts:', error);
      setVisitedCount(0);
      setEnquiredCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardCounts();
  }, [userData?.id]);

  return (
    <>
      {loading && <Loader />}
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="card">
              <div className="ad-v2-hom-info">
                <div className="ad-v2-hom-info-inn">
                  <ul className="Homesb1">
                    <div className="profile-det-titls d-flex justify-content-between">
                      <h3 className="PremiumAccount1 mb-4">
                        <span className="rol_name">{userRole}</span> DASHBOARD
                      </h3>
                      <h3 className="PremiumAccount1 mb-4">
                        <span className="rol_name">{userRole} Name</span> : {userData?.company_name}
                      </h3>
                    </div>

                    <div className="row justify-content-center">
                      <li className="col-md-4 mb-4">
                        <div className="ad-hom-box ad-hom-box-1">
                          <div className="ad-hom-view-com">
                            <Link to="/stall-visited-users">
                              <p>
                                Visited <br></br>users
                              </p>
                              <h3>{visitedCount}</h3>
                            </Link>
                          </div>
                        </div>
                      </li>
                      {/* <li className="col-md-4 mb-4">
                        <div className="ad-hom-box ad-hom-box-1">
                          <div className="ad-hom-view-com">
                            <Link to="/stall-enquired-users">
                              <p>
                                Enquired<br></br>users
                              </p>
                              <h3>{enquiredCount}</h3>
                            </Link>
                          </div>
                        </div>
                      </li> */}

                      <li className="col-md-4 mb-4">
                        <div className="ad-hom-box ad-hom-box-1">
                          <div className="ad-hom-view-com">
                            <Link to="/expo/ongoing">
                              <p>
                                On-going<br></br>Expos
                              </p>
                              <h3>{onGoingExpo}</h3>
                            </Link>
                          </div>
                        </div>
                      </li>



                      <li className="col-md-4 mb-4">
                        <div className="ad-hom-box ad-hom-box-1">
                          <div className="ad-hom-view-com">
                            <Link to="/expo/future">
                              <p>
                                Future<br></br>Expos
                              </p>
                              <h3>{futureExpo}</h3>
                            </Link>
                          </div>
                        </div>
                      </li>

                      <li className="col-md-4 mb-4">
                        <div className="ad-hom-box ad-hom-box-1">
                          <div className="ad-hom-view-com">
                            <Link to="/expo/completed">
                              <p>
                                Completed<br></br>Expos
                              </p>
                              <h3>{completedExpo}</h3>
                            </Link>
                          </div>
                        </div>
                      </li>

                    </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BuilderDashboard;