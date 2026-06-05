import React from 'react';
import FormWizard from 'react-form-wizard-component';
import 'react-form-wizard-component/dist/style.css';
import StepOne from './step-one';
import StepTwo from './step-two';
import StepThree from './step-three';
import StepFour from './step-four';
import StepFive from './step-five';
import StepZero from './StepZero';
import { useDispatch, useSelector } from 'react-redux';
import { setProject } from '../../store/slices/ProjectManagementSlice';
import { toastError } from '../../utils/toast';

const AddListings = () => {

    const formState = useSelector((state) => state.projectManagement['project']);
    const dispatch = useDispatch();
    // handling form completion

    const checkValidation = () => {
        if (!formState.listing_type_id) {
            console.log('false triggered');
            return false
        }
        else {
            console.log('true triggered');
            return true
        }
    }

    const displayError = (message) => {
        toastError(message);
    }


    const handleComplete = () => {
        console.log('Form completed!');
    };
    return (
        <>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <>
                                    <FormWizard
                                        stepSize="xs"
                                        onComplete={handleComplete}
                                        color="#221c5d"
                                        onTabChange={() => {
                                            window.scrollTo(0, 0);
                                            // checkValidation();
                                        }}
                                    >
                                        <FormWizard.TabContent title="Listing Type" icon="ti-bookmark" isValid={checkValidation}>
                                            <StepZero />
                                        </FormWizard.TabContent>
                                        <FormWizard.TabContent title="Listing Address" icon="ti-bookmark">
                                            <StepOne />
                                        </FormWizard.TabContent>
                                        <FormWizard.TabContent title="Listing Size and Units" icon="ti-ruler-pencil">
                                            <StepTwo />
                                        </FormWizard.TabContent>
                                        <FormWizard.TabContent title="Amenities" icon="ti-view-grid">
                                            <StepThree />
                                        </FormWizard.TabContent>

                                        <FormWizard.TabContent title="Gallery" icon="ti-clip">
                                            <StepFour />
                                        </FormWizard.TabContent>
                                        <FormWizard.TabContent title="Timings" icon="ti-time">
                                            <StepFive />
                                        </FormWizard.TabContent>
                                    </FormWizard>
                                    {/* add style */}
                                    <style>{`
        @import url("https://cdn.jsdelivr.net/gh/lykmapipo/themify-icons@0.1.2/css/themify-icons.css");
      `}</style>
                                </>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddListings;
