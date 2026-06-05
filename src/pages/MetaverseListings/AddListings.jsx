import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StepOne from './stepOne';
import StepTwo from './stepTwo';
import StepThree from './stepThree'
import StepFour from './stepFour';
import Loader from '../../components/Loader';
import StepFive from './stepFive'

import { masterClient } from '../../utils/httpClient';
import { useDispatch, useSelector } from 'react-redux';
import { setProject } from '../../store/slices/ProjectManagementSlice';
const AddListings = () => {

    const userData = useSelector((state) => state.user.userData);
    const dispatch = useDispatch();

    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('')
    const [subType, setSubType] = useState('')
    const [isSale, setIsSale] = useState(true);
    const [isRent, setIsRent] = useState(false);
    const [listingType, setListingType] = useState(false);
    const [packageType, setPackagetype] = useState('')

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

    let componentStep;
    switch (currentStep) {
        case 0:
            componentStep = <StepOne nextStep={handleNext} prevStep={handlePrev} currentStep={currentStep} setType={setType} setSubType={setSubType} isRent={isRent} isSale={isSale} setIsRent={setIsRent} setIsSale={setIsSale} />;
            break;
        case 1:
            componentStep = <StepTwo nextStep={handleNext} prevStep={handlePrev} type={type} subType={subType} />;
            break;
        case 2:
            componentStep = <StepThree nextStep={handleNext} prevStep={handlePrev} type={type} subType={subType} packageType={packageType} />;
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

    const handleListing = async (e) => {
        setListingType(true)
        setPackagetype(e.target.name)
    }

    useEffect(() => {
        getPurchasedPackages();
    }, [])


    const getPurchasedPackages = async () => {
        setLoading(true)
        let res;
        try {
            res = await masterClient.get(`userPurchaseDetails/${userData.id}`)
            if (res?.data?.status && res?.data?.data?.length > 0) {
                const data = res?.data?.data.filter(pack => pack.listing_type === 'Meta Listing')
                setBuyPackages(data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }
    console.log('packtype ===>', packageType);

    return (
        <>
            {loading && <Loader />}
            <div className="main-content metaverse_clrs builder_projcts">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-md-12">
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
                                                                        <th className="ActTh">purchase id</th>
                                                                        <th className="ActTh">Select Package</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="ActTBody">
                                                                    {buyPackages.map((item, index) => (
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
                                                                            <td className="ActTd">{item?.purchase_id}</td>
                                                                            <td className="ActTd">
                                                                                <label className="custom-radio">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        disabled={item?.available_listings < 1}
                                                                                        name={item.package_type}
                                                                                        onClick={(e) => handleListing(e, item.purchase_id)}
                                                                                    />
                                                                                    <span className="radio-icon"></span></label>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                }
                                {/* {currentStep == 0 && packageType &&
                                    <div className='card'>
                                        <div className='card-header'>
                                            <h4 className='card-title'>Select Package Type</h4>
                                        </div>
                                        <div className='card-body'>
                                            <div className="row mb-3">
                                                <div className="col">
                                                    <div className="form-floating">
                                                        <h4>Paragon</h4>
                                                        <select
                                                            className="form-select"
                                                            name="Paragon"
                                                            required
                                                            onChange={handleListing}
                                                            disabled={packageType != "Paragon"}
                                                        >
                                                            <option value="default">Select</option>
                                                            <option value="dfs">One</option>
                                                            <option value="dfs">Two</option>
                                                            <option value="dfs">Three</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-floating">
                                                        <h4>Builder Box</h4>
                                                        <select
                                                            className="form-select"
                                                            name="Builder Box"
                                                            required
                                                            onChange={handleListing}
                                                            disabled={packageType != "Builder Box"}
                                                        >
                                                            <option value="default">Select</option>
                                                            <option value="dfs">One</option>
                                                            <option value="dfs">Two</option>
                                                            <option value="dfs">Three</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-floating">
                                                        <h4>Combo <span>(Paragon & Builder Box)</span></h4>
                                                        <select
                                                            className="form-select"
                                                            name="Combo"
                                                            required
                                                            onChange={handleListing}
                                                            disabled={packageType != "Combo"}
                                                        >
                                                            <option value="default">Select</option>
                                                            <option value="dfs">One</option>
                                                            <option value="dfs">Two</option>
                                                            <option value="dfs">Three</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                } */}

                                {listingType &&
                                    componentStep
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddListings;
