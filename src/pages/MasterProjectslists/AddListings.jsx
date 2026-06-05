import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StepOne from './stepOne';
import StepTwo from './stepTwo';
import StepThree from './stepThree'
import StepFour from './stepFour';
import Loader from '../../components/Loader';
import StepFive from './stepFive'

const AddListings = () => {
    
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('')
    const [subType, setSubType] = useState('')
    const [isSale, setIsSale] = useState(true);
    const [isRent, setIsRent] = useState(false);
    const [listingType, setListingType] = useState(false);
    const [packageType, setPackagetype] = useState('')

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

    return (
        <>
            {loading && <Loader />}
            <div className="main-content metaverse_clrs">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-md-12">

                                {currentStep == 0 &&
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
                                                            name="paragon"
                                                            required
                                                            onChange={handleListing}
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
                                                            name="builderBox"
                                                            required
                                                            onChange={handleListing}
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
                                                            name="combo"
                                                            required
                                                            onChange={handleListing}
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
                                }

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
