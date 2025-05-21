import React from "react";
import "./Stepper.css";

const steps = [
  "Service",
  "Information",
  "Date & Time",
  "Payment",
  "Confirmation",
];

const Stepper = ({ currentStep }) => {
  return (
    <div className="stepper-container">
      {steps.map((label, idx) => {
        const stepNum = idx + 1;

        const isCompleted = currentStep > 5 || stepNum < currentStep;
        const isCurrent = currentStep <= 5 && stepNum === currentStep;

        return (
          <div
            key={label}
            className={`stepper-step ${isCompleted ? "completed" : ""} ${
              isCurrent ? "current" : ""
            }`}
          >
            <div
              className={`stepper-circle ${
                isCompleted ? "completed" : isCurrent ? "current" : ""
              }`}
            >
              {isCompleted ? "✓" : stepNum}
            </div>
            <div className="stepper-label">{label}</div>
            {idx !== steps.length - 1 && <div className="stepper-line"></div>}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
