import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
const BuilderDashboard = () => {
  const userData = useSelector((state) => state.user.userData)
  const userRole = useSelector((state) => state.user.role)
  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <div className="card">
            <div className="ad-v2-hom-info">
              <div className="ad-v2-hom-info-inn">
                <ul className="Homesb1">
                  <div className="profile-det-titls d-flex justify-content-between">
                    <h3 className="PremiumAccount1 mb-4"><span className='rol_name'>{userRole}</span> {" "} DASHBOARD</h3>
                    <h3 className="PremiumAccount1 mb-4"><span className='rol_name'>{userRole} Name</span> : {userData?.company_name}</h3>
                  </div>


<div className="row justify-content-center">
                      <li className="col-md-4 mb-4">
                        <div className="ad-hom-box ad-hom-box-1">
                          <div className="ad-hom-view-com">
                            <Link to="/packages/sale-active">
                              <p> Airpropx <br></br>LISTINGS</p>
                              <h3>30</h3>
                            </Link>
                          </div>
                        </div>
                      </li>
                      <li className="col-md-4 mb-4">
                        <div className="ad-hom-box ad-hom-box-1">
                          <div className="ad-hom-view-com">
                            <Link to="/packages/sale-active">
                              <p> Model House<br></br>LISTINGS</p>
                              <h3>30</h3>
                            </Link>
                          </div>
                        </div>
                      </li>
                      <li className="col-md-4 mb-4">
                        <div className="ad-hom-box ad-hom-box-1">
                          <div className="ad-hom-view-com">
                            <Link to="/packages/sale-active">
                              <p> Model Office <br></br>LISTINGS</p>
                              <h3>30</h3>
                            </Link>
                          </div>
                        </div>
                      </li>
                      </div>
                  
                  {/* {userRole !== 'Owner' ?
                    <div className="row justify-content-center">
                      <li className="col-md-4 mb-4">
                        <div className="ad-hom-box ad-hom-box-1">
                          <div className="ad-hom-view-com">
                            <Link to="/packages/sale-active">
                              <p> PREMIUM PROJECT <br></br>LISTINGS</p>
                              <h3>30</h3>
                            </Link>
                          </div>
                        </div>
                      </li>

                      {userRole !== 'Agent' &&
                        <li className="col-md-4 mb-4">
                          <div className="ad-hom-box ad-hom-box-1">
                            <div className="ad-hom-view-com">
                              <Link to="/packages/sale-active">
                                <p>METAVERSE <br></br>LISTINGS</p>
                                <h3>15</h3>
                              </Link>
                            </div>
                          </div>
                        </li>
                      }

                      <li className="col-md-4 mb-4">
                        <div className="ad-hom-box ad-hom-box-1">
                          <div className="ad-hom-view-com">
                            <Link to="/packages/sale-active">
                              <p>AIRPROPX <br></br>EXPO</p>
                              <h3>28</h3>
                            </Link>
                          </div>
                        </div>
                      </li>
                    </div>
                    :
                    <div className="row justify-content-center">
                      <li className="col-md-4 mb-4">
                        <div className="ad-hom-box ad-hom-box-1">
                          <div className="ad-hom-view-com">
                            <Link to="/packages/sale-active">
                              <p> PROPERTY LISTINGS</p>
                              <h3>30</h3>
                            </Link>
                          </div>
                        </div>
                      </li>
                    </div>
                  } */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuilderDashboard