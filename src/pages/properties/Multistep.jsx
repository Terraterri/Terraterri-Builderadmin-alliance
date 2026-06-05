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
    <div >
      {steps[currentStep].component}
      <div className="btnParent">
        {currentStep > 0 && (
          <button className='btn customBtn' onClick={handlePrev}>Previous</button>
        )}
        {currentStep < steps.length - 1 && (
          <button className='btn customBtn' onClick={handleNext}>Next</button>
        )}
      </div>
    </div>
  );
};

export default MultiStep;
