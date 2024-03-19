import { useGlobalContext } from 'providers/GlobalProvider';
import { saveUser } from 'providers/actionCreators';
import React, { useState } from 'react';
import API from 'services/APIService';
import { User } from 'types';

export default function AddEditProfile() {
    const { user, dispatch } = useGlobalContext();
    const [formData, setFormData] = useState<User>({
        ID: user.ID,
        NAME: user.NAME,
        EMAIL: user.EMAIL,
        MOBILE: user.MOBILE || '',
        ADDRESS: user.ADDRESS || '',
        ZIPCODE: user.ZIPCODE || '',
        ROLE: user.ROLE || '',
    });
    const [errors, setErrors] = useState<Partial<User>>({});

    const validateForm = () => {
        const newErrors: Partial<User> = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobileRegex = /^\d{10}$/;

        if (!formData.NAME) {
            newErrors.NAME = "Name is required";
        }
        if (!formData.EMAIL) {
            newErrors.EMAIL = "Email is required";
        } else if (!emailRegex.test(formData.EMAIL)) {
            newErrors.EMAIL = "Email is not in valid format";
        }
        if (!formData.ADDRESS) {
            newErrors.ADDRESS = "Address is required";
        }
        if (!formData.MOBILE) {
            newErrors.MOBILE = "Mobile is required";
        } else if (!mobileRegex.test(formData.MOBILE)) {
            newErrors.MOBILE = "Mobile must be a 10-digit number";
        }
        if (!formData.ZIPCODE) {
            newErrors.ZIPCODE = "Zipcode is required";
        }
        setErrors({ ...newErrors });
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdateDetails = async () => {
        if (validateForm()) {
            try {
                const { ID, EMAIL, NAME, ROLE, ...rest } = formData;
                const response = await API.getInstance().post("/user/profile", {
                    ...rest
                });
                if (response?.data?.status) {
                    alert("Profile Saved Successfully");
                    dispatch(saveUser(response.data.user as User));
                }
                console.log("Updating details:", formData);
            } catch (error) {
                // Handle error
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="card w-xxl-90 w-xl-90 w-lg-70 w-md-90 mx-auto">
            <div className="card-body">
                <h2 className="card-title">Profile</h2>
                <form>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="name" className="form-label d-flex">Name</label>
                            <input type="text" className="form-control" id="name" name="NAME" value={formData.NAME} onChange={handleChange} readOnly />
                            {errors.NAME && <div className="text-danger">{errors.NAME}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="email" className="form-label d-flex">Email</label>
                            <input type="email" className="form-control" id="email" name="EMAIL" value={formData.EMAIL} onChange={handleChange} readOnly />
                            {errors.EMAIL && <div className="text-danger">{errors.EMAIL}</div>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="mobile" className="form-label d-flex">Mobile</label>
                            <input type="text" className="form-control" id="mobile" name="MOBILE" value={formData.MOBILE || ''} onChange={handleChange} />
                            {errors.MOBILE && <div className="text-danger">{errors.MOBILE}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="address" className="form-label d-flex">Address</label>
                            <input type="text" className="form-control" id="address" name="ADDRESS" value={formData.ADDRESS || ''} onChange={handleChange} />
                            {errors.ADDRESS && <div className="text-danger">{errors.ADDRESS}</div>}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="zipcode" className="form-label d-flex">Zipcode</label>
                            <input type="text" className="form-control" id="zipcode" name="ZIPCODE" value={formData.ZIPCODE || ''} onChange={handleChange} />
                            {errors.ZIPCODE && <div className="text-danger">{errors.ZIPCODE}</div>}
                        </div>
                    </div>
                </form>
            </div>
            <div className="card-footer">
                <button type="button" className="btn btn-primary" onClick={handleUpdateDetails}>Update Details</button>
            </div>
        </div>
    );
}
