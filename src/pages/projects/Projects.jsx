import React, { useEffect, useState } from 'react';
import StepOne from './step-one';
import StepTwo from './step-two';
import StepThree from './step-three';
import StepFour from './step-four';
import StepFive from './step-five';
import { masterClient } from '../../utils/httpClient';
import Loader from '../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { setProject, reset } from '../../store/slices/ProjectManagementSlice';
const Projects = () => {
  const userData = useSelector((state) => state.user.userData);
  const project = useSelector((state) => state.projectManagement.project);
  const selectedPurchaseId = project?.purchase_id;
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('')
  const [subType, setSubType] = useState('')

  const [buyPackages, setBuyPackages] = useState([]);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleReset = () => {
    setType('');
    setSubType('');
    setCurrentStep(0);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    dispatch(reset());
    getPurchasedPackages();
  }, [])


  const getPurchasedPackages = async () => {
    setLoading(true)
    let res;
    try {
      res = await masterClient.get(`userPurchaseDetails/${userData.id}`)
      if (res?.data?.status && res?.data?.data.length > 0) {
        const data = res?.data?.data.filter((list) => list.listing_type === 'Premium Listing')
        setBuyPackages(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }


  let componentStep;
  switch (currentStep) {
    case 1:
      componentStep = <StepOne nextStep={handleNext} prevStep={handlePrev} currentStep={currentStep} setType={setType} setSubType={setSubType} />;
      break;
    case 2:
      componentStep = <StepTwo nextStep={handleNext} prevStep={handlePrev} type={type} subType={subType} />;
      break;
    case 3:
      componentStep = <StepThree nextStep={handleNext} prevStep={handlePrev} type={type} subType={subType} />;
      break;
    case 4:
      componentStep = <StepFour nextStep={handleNext} prevStep={handlePrev} type={type} subType={subType} />;
      break;
    case 5:
      componentStep = <StepFive prevStep={handlePrev} type={type} subType={subType} stepOne={handleReset} />;
      break;
    default:
      break;
  }

  const handleListing = (e, listing_id) => {
    if (selectedPurchaseId === listing_id) {
      dispatch(reset());
    } else {
      const selectedListing = buyPackages.find(pack => pack?.purchase_id === listing_id);

      let listing = {
        totalListings: selectedListing?.total_listings,
        availableLisings: selectedListing?.available_listings,
        package_id: selectedListing?.package_id,
        purchase_id: listing_id
      }
      dispatch(setProject(listing))
    }
  }

  return (
    <>
      {loading && <Loader />}
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            {/* <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item">
                        <a>Terraterri</a>
                      </li>
                      <li className="breadcrumb-item active"> Projects</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div> */}
            {currentStep === 0 &&
              <>
                <div className="row">
                  <div className="col-12">
                    <div className="page-title-box d-flex align-items-center justify-content-between">
                      <div className="page-title-right"><h4 className="mb-0">Premimum Listings</h4></div>
                      <div className="page-title-right"><h4 className="mb-0">Post New Project</h4></div>
                    </div>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-12">
                    <div className='builder_projcts'>
                      <div className="col-md-10 text-center mt-0 mb-3 m-auto">
                        <div className="packSection mb-5">
                          <h4 className="ActiveHead">Select the Package to list the Project</h4>
                          <table className="activeTable mt-4 mb-0">
                            <thead>
                              <tr>
                                <th className="ActTh">S.No </th>
                                <th className="ActTh">Package</th>
                                <th className="ActTh">Active On</th>
                                <th className="ActTh">Expires By</th>
                                <th className="ActTh">Package Listings</th>
                                <th className="ActTh">Available Listings</th>
                                <th className="ActTh">Select Package</th>
                              </tr>
                            </thead>
                            <tbody className="ActTBody">
                              {buyPackages.length > 0 ?

                                buyPackages.map((item, index) => (
                                  <tr key={index}>
                                    <td className="ActTd">
                                      {index + 1}
                                    </td>
                                    <td className="ActTd">
                                      {item.package_type} Premium <span> {item?.city_code}</span>
                                    </td>
                                    <td className="ActTd">{item?.activated_date}</td>
                                    <td className="ActTd">{item?.deactivate_date}</td>
                                    <td className="ActTd" >{item?.total_listings}</td>
                                    <td className="ActTd">{item?.available_listings}</td>
                                    <td className="ActTd">
                                      {item?.available_listings > 0 && (
                                        <label className="custom-radio">
                                          <input
                                            type="checkbox"
                                            disabled={item?.available_listings < 1}
                                            name="standardPrice"
                                            checked={selectedPurchaseId === item.purchase_id}
                                            onChange={(e) => handleListing(e, item.purchase_id)}
                                          />
                                          <span className="radio-icon"></span>
                                        </label>
                                      )}
                                    </td>
                                  </tr>
                                ))

                                :
                                <tr className='m-3'>
                                  <td colSpan={8}><h5>Please Purchase Package</h5></td>
                                </tr>
                              }
                            </tbody>
                          </table>
                          {selectedPurchaseId && (
                            <div className="mt-4 text-center">
                              <button className="btn customBtn" onClick={handleNext}>
                                Next
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            }
            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className='builder_projcts'>
                  {currentStep > 0 && componentStep}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
