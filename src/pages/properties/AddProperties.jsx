import React, { useState, useEffect } from 'react';
import StepOne from './stepOne';
import StepTwo from './stepTwo';
import StepThree from './stepThree';
import StepFour from './stepFour';
import StepFive from './stepFive';
import { masterClient } from '../../utils/httpClient';
import Loader from '../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { setProject } from '../../store/slices/ProjectManagementSlice';


const Properties = () => {

  const userData = useSelector((state) => state.user.userData);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('');
  const [subType, setSubType] = useState('');
  const [isSale, setIsSale] = useState(true);
  const [isRent, setIsRent] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [buyPackages, setBuyPackages] = useState([]);

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  const handleStep = () => {
    setCurrentStep(0)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    getPurchasedPackages();
  }, [])

  const getPurchasedPackages = async () => {
    setLoading(true)
    let res;
    try {
      res = await masterClient.get(`userPurchaseDetails/${userData.id}`)
      if (res?.data?.status) {
        setBuyPackages(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }


  let componentStep;
  switch (currentStep) {
    case 0:
      // componentStep = <StepZero nextStep={handleNext} />
      componentStep = <StepOne nextStep={handleNext} prevStep={handlePrev} currentStep={currentStep} setType={setType} setSubType={setSubType} subType={subType} setIsRent={setIsRent} setIsSale={setIsSale} isRent={isRent} isSale={isSale} />;
      break;
    case 1:
      componentStep = <StepTwo nextStep={handleNext} prevStep={handlePrev} type={type} subType={subType} isSale={isSale} isRent={isRent} />;
      break;
    case 2:
      componentStep = <StepThree nextStep={handleNext} prevStep={handlePrev} type={type} subType={subType} />;
      break;
    case 3:
      componentStep = <StepFour nextStep={handleNext} prevStep={handlePrev} type={type} subType={subType} />;
      break;
    case 4:
      componentStep = <StepFive prevStep={handlePrev} type={type} subType={subType} stepOne={handleStep} />;
      break;
    default:
      break;
  }

  return (
    <>
      <div className="main-content">
        <div className="page-content">
          <div className='builder_projcts'>
            <div className="container-fluid">

              {currentStep == 0 &&
                <>
                  <div className="row">
                    <div className="col-12">
                      <div className="page-title-box d-flex align-items-center justify-content-between">
                        <div className="page-title-right">
                          <ol className="breadcrumb m-0">
                            <li className="breadcrumb-item">
                              <a>Terraterri</a>
                            </li>
                            <li className="breadcrumb-item active"> Properties</li>
                          </ol>
                        </div>
                        <div className="page-title-right">
                          <button className="btn btn-info">Add Properties</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row justify-content-center">
                    <div className="col-md-12">
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
                                      <label className="custom-radio">
                                        <input
                                          type="checkbox"
                                          disabled={item?.available_listings < 1}
                                          name="standardPrice"
                                          onClick={(e) => handleListing(e, item.package_id)}
                                        />
                                        <span className="radio-icon"></span></label>
                                    </td>
                                  </tr>
                                ))
                                :
                                <tr>
                                  <td colSpan={8}>No Packages Found</td>
                                </tr>
                              }
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              }
              {componentStep}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Properties;