
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './App.css';

const LoanForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    loanAmount: "",
    purpose: "House",
    tenure: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!formData.fullName.trim()) {
      validationErrors.fullName = "Full Name is required";
    }

    const amount = parseFloat(formData.loanAmount);
    if (isNaN(amount) || amount < 1000 || amount > 1000000) {
      validationErrors.loanAmount = "Loan Amount must be between 1000 and 1000000";
    }

    const tenure = parseInt(formData.tenure);
    if (isNaN(tenure) || tenure < 1 || tenure > 30) {
      validationErrors.tenure = "Tenure must be between 1 and 30 years";
    }

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      navigate("/welcome");
    } else {
      navigate("/error");
    }
  };

  return (
    <div>
      <h1 className="header">Bank Loan Form</h1>
      <form onSubmit={handleSubmit} className="form">
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <p className="error">{errors.fullName}</p>}
        </div>

        <div>
          <label>Loan Amount:</label>
          <input
            type="number"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
          />
          {errors.loanAmount && <p className="error">{errors.loanAmount}</p>}
        </div>

        <div>
          <label>Purpose of Loan:</label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
          >
            <option value="House">House</option>
            <option value="Car">Car</option>
            <option value="Personal">Personal</option>
            <option value="Education">Education</option>
          </select>
        </div>

        <div>
          <label>Tenure (in years):</label>
          <input
            type="number"
            name="tenure"
            value={formData.tenure}
            onChange={handleChange}
          />
          {errors.tenure && <p className="error">{errors.tenure}</p>}
        </div>

        <button type="submit">Apply</button>
      </form>
    </div>
  );
};

export default LoanForm;
