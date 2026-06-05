import React, { useEffect, useState } from 'react';
import StepOne from './step-one';
import StepTwo from './step-two';
import StepThree from './step-three';
import StepFour from './step-four';
import StepFive from './step-five';
import Loader from '../../components/Loader';
const EditProject = () => {
    const [currentStep, setCurrentStep] = useState(0);
    //Dynamic Data States
    const [loading, setLoading] = useState(false);
    const [type, setType] = useState('')
    const [subType, setSubType] = useState('')
    const [isSale, setIsSale] = useState(true);
    const [isRent, setIsRent] = useState(false);

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
    }, []);

    let componentStep;
    switch (currentStep) {
        case 0:
            componentStep = <StepOne nextStep={handleNext} prevStep={handlePrev} currentStep={currentStep} setType={setType} setSubType={setSubType} isRent={isRent} isSale={isSale} setIsRent={setIsRent} setIsSale={setIsSale} />;
            break;
        case 1:
            componentStep = <StepTwo nextStep={handleNext} prevStep={handlePrev} type={type} subType={subType} />;
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
            {loading && <Loader />}
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item">
                                                <a>Unimakler</a>
                                            </li>
                                            <li className="breadcrumb-item active"> Edit Project</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                {componentStep}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EditProject;
