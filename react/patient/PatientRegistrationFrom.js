import React, { useState } from 'react';
import { addPatient } from './PatientService';
const PatientRegistrationForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    condition: '',
    lastVisit: '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.condition) newErrors.condition = 'Condition is required';
    if (!formData.lastVisit) newErrors.lastVisit = 'Last Visit is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await addPatient(formData);
    if (onRegister) onRegister(formData);

    setFormData({ name: '', age: '', gender: '', condition: '', lastVisit: '' });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Name" name="name" value={formData.name} onChange={handleChange} />
      {errors.name && <div>{errors.name}</div>}

      <input placeholder="Age" name="age" value={formData.age} onChange={handleChange} />
      {errors.age && <div>{errors.age}</div>}

      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      {errors.gender && <div>{errors.gender}</div>}

      <input placeholder="Condition" name="condition" value={formData.condition} onChange={handleChange} />
      {errors.condition && <div>{errors.condition}</div>}

      <input placeholder="Last Visit (YYYY-MM-DD)" name="lastVisit" value={formData.lastVisit} onChange={handleChange} />
      {errors.lastVisit && <div>{errors.lastVisit}</div>}

      <button type="submit">Register Patient</button>
    </form>
  );
};
export default PatientRegistrationForm;
