import React, { useState } from 'react';

const MultiStep = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);


  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div>
      {steps[currentStep].component}
      <div>
        {currentStep > 0 && (
          <button className="btn btn-primary m-3" onClick={handlePrev}>
            Previous
          </button>
        )}
        {currentStep < steps.length - 1 && (
          <button className="btn btn-primary m-3" onClick={handleNext}>
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiStep;
