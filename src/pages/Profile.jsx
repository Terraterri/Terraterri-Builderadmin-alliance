import React, { useState, useEffect } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';
import { masterClient } from '../utils/httpClient';
import { handleImages3 } from '../utils/S3Handler';
import { toastError, toastSuccess } from '../utils/toast';
import { updateUserData } from '../store/slices/UserSlice';

const Profile = () => {
  let userData = useSelector((state) => state.user.userData)
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ logo_path: userData?.logo_path });
  const [formError, setFormError] = useState({});
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [editForm, setEditForm] = useState(userData);

  // Dynamic locations for "add" mode
  const [locations, setLocations] = useState([{ id: Date.now(), country_code: '', state_code: '', city: '', mobile: '', email: '', address: '', contact_person_name: '' }]);
  // Dynamic locations for "edit" mode
  const [editLocations, setEditLocations] = useState([]);
  // Per-location dropdown data (keyed by location id)
  const [locationStates, setLocationStates] = useState({});
  const [locationCities, setLocationCities] = useState({});

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();


  const handleForm = async (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear field error on change
    if (formError[name]) {
      setFormError((prev) => { const next = { ...prev }; delete next[name]; return next; });
    }

    if (name === 'country_code') {
      getStatesByCountry(value)
    }
    if (name === 'state_code') {
      getCitiesByState(value)
    }
  }

  // --- Dynamic location handlers (add mode) ---
  const handleLocationChange = async (locId, field, value) => {
    setLocations(prev => prev.map(loc => loc.id === locId ? { ...loc, [field]: value } : loc));
    if (field === 'country_code') {
      try {
        const res = await masterClient.get(`state/${value}`);
        if (res?.data?.status) setLocationStates(prev => ({ ...prev, [locId]: res.data.data }));
      } catch (e) { console.log(e); }
    }
    if (field === 'state_code') {
      try {
        const res = await masterClient.get(`city/${value}`);
        if (res?.data?.status) setLocationCities(prev => ({ ...prev, [locId]: res.data.data }));
      } catch (e) { console.log(e); }
    }
  };
  const addLocation = () => setLocations(prev => [...prev, { id: Date.now(), country_code: '', state_code: '', city: '', mobile: '', email: '', address: '', contact_person_name: '' }]);
  const removeLocation = (locId) => { if (locations.length > 1) setLocations(prev => prev.filter(l => l.id !== locId)); };

  // --- Dynamic location handlers (edit mode) ---
  const handleEditLocationChange = async (locId, field, value) => {
    setEditLocations(prev => prev.map(loc => loc.id === locId ? { ...loc, [field]: value } : loc));
    if (field === 'country_code') {
      try {
        const res = await masterClient.get(`state/${value}`);
        if (res?.data?.status) setLocationStates(prev => ({ ...prev, [`edit_${locId}`]: res.data.data }));
      } catch (e) { console.log(e); }
    }
    if (field === 'state_code') {
      try {
        const res = await masterClient.get(`city/${value}`);
        if (res?.data?.status) setLocationCities(prev => ({ ...prev, [`edit_${locId}`]: res.data.data }));
      } catch (e) { console.log(e); }
    }
  };
  const addEditLocation = () => setEditLocations(prev => [...prev, { id: Date.now(), country_code: '', state_code: '', city: '', address: '', contact_person_name: '', email: '', mobile: '' }]);
  const removeEditLocation = (locId) => { if (editLocations.length > 1) setEditLocations(prev => prev.filter(l => l.id !== locId)); };

  const handleImage = async (e, type) => {
    setLoading(true);
    let resFromMiddleware = await handleImages3(e);
    setLoading(false);
    if (resFromMiddleware.clientStatus) {
      if (type === 'add') {
        setForm((prev) => ({
          ...prev,
          [e.target.name]: resFromMiddleware.data.original_image_url
        }));
      } else {
        setEditForm((prev) => ({
          ...prev,
          [e.target.name]: resFromMiddleware.data.original_image_url
        }))
      }

    } else {
      toastError(resFromMiddleware.data);
    }
  }

  const handleEditForm = async (e) => {
    setEditForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (formError[e.target.name]) {
      setFormError(prev => { const next = { ...prev }; delete next[e.target.name]; return next; });
    }
  }

  useEffect(() => {
    getCountries()
    getBuilderData();
  }, [])

  const getCountries = async () => {
    let res;
    setLoading(true)
    try {
      res = await masterClient.get('/country');
      if (res?.data.status) {
        setCountries(res?.data?.data)
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  //   getAll States
  const getStatesByCountry = async (param) => {
    setLoading(true);
    try {
      const res = await masterClient.get(`state/${param}`);
      if (res?.data?.status) {
        setStates(res?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  //   getAll Cities
  const getCitiesByState = async (param) => {
    setLoading(true);
    try {
      const res = await masterClient.get(`city/${param}`);
      if (res?.data?.status) {
        setCities(res?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setFormError({});
    setLoading(true)
    const payload = { ...form, userid: userData.id, name: userData.company_name };
    
    payload.locations = locations.map((loc) => ({
      country: loc.country_code,
      state: loc.state_code,
      city: loc.city,
      address: loc.address || "",
      contact_person_name: loc.contact_person_name || "",
      contact_person_phone_number: loc.mobile,
      contact_person_mail: loc.email || ""
    }));
    try {
      let res = await masterClient.post('builder', payload)
      if (res?.data.status) {
        toastSuccess('Profile Added Successfully');
        getBuilderData();
      } else {
        toastError('Failed!, Please try again')
      }
    } catch (err) {
      // Map 422 validation errors to formError state
      if (err?.response?.status === 422 && err?.response?.data?.data) {
        const apiErrors = err.response.data.data;
        const mapped = {};
        Object.keys(apiErrors).forEach(key => {
          mapped[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
        });
        setFormError(mapped);
        toastError(err?.response?.data?.message || 'Validation failed');
      } else {
        toastError('Something went wrong, please try again');
      }
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  const getBuilderData = async () => {
    setLoading(true)
    let res;
    try {
      res = await masterClient.get(`builder/${userData?.id}`)
      if (res?.data?.status) {
        dispatch(updateUserData(res?.data?.data))
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    setFormError({});
    setLoading(true)
    const payload = { ...editForm, userid: editForm.id };
    
    payload.locations = editLocations.map((loc) => ({
      id: loc.id,
      country: loc.country_code || "",
      state: loc.state_code || "",
      city: loc.city || "",
      address: loc.address || "",
      contact_person_name: loc.contact_person_name || "",
      contact_person_phone_number: loc.mobile || "",
      contact_person_mail: loc.email || ""
    }));
    try {
      const res = await masterClient.patch(`builder/${editForm.id}`, payload);
      if (res?.data?.status) {
        toastSuccess('Updated Successfully')
        setShow(false)
        getBuilderData();
      } else {
        toastError('Please Try Again')
      }
    } catch (err) {
      if (err?.response?.status === 422 && err?.response?.data?.data) {
        const apiErrors = err.response.data.data;
        const mapped = {};
        Object.keys(apiErrors).forEach(key => {
          mapped[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
        });
        setFormError(mapped);
        toastError(err?.response?.data?.message || 'Validation failed');
      } else {
        toastError('Something went wrong, please try again');
      }
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  // Sync editForm and editLocations when offcanvas opens or userData changes
  useEffect(() => {
    if (userData) {
      // Always refresh editForm with latest userData
      setEditForm(userData);
      setForm(prev => ({ ...prev, logo_path: userData?.logo_path }));

      // Build editLocations from userData location fields
      let locs = [];
      if (userData.locations && Array.isArray(userData.locations)) {
        locs = userData.locations.map(loc => ({
          id: loc.id,
          country_code: loc.country || '',
          state_code: loc.state || '',
          city: loc.city || '',
          address: loc.address || '',
          contact_person_name: loc.contact_person_name || '',
          mobile: loc.contact_person_phone_number || '',
          email: loc.contact_person_mail || loc.email || ''
        }));
      } else {
        const suffixes = ['one', 'two', 'three'];
        suffixes.forEach((s, i) => {
          if (userData[`location_${s}`]) {
            locs.push({ id: i + 1, city: userData[`location_${s}`], email: userData[`location_${s}_email`] || '', mobile: userData[`location_${s}_mobile`] || '' });
          }
        });
        // Also check numbered locations beyond 3
        let idx = 4;
        while (userData[`location_${idx}`]) {
          locs.push({ id: idx, city: userData[`location_${idx}`], email: userData[`location_${idx}_email`] || '', mobile: userData[`location_${idx}_mobile`] || '' });
          idx++;
        }
      }
      if (locs.length > 0) setEditLocations(locs);
      else setEditLocations([{ id: Date.now(), country_code: '', state_code: '', city: '', address: '', contact_person_name: '', mobile: '', email: '' }]);
    }
  }, [userData, show])

  useEffect(() => {
    getBuilderData()
  }, [])

  return (
    <>
      {loading && <Loader />}
      <div className="main-content">
        <div className="page-content profile-page">

          <div className="container">
            {/* <div className="row">
            <div className="col-12">
              <div className="page-title-box d-flex align-items-center justify-content-between">
                <div className="page-title-right">
                  <ol className="breadcrumb m-0">
                    <li className="breadcrumb-item">
                      <a href="/">Home</a>
                    </li>
                    <li className="breadcrumb-item active">Profile</li>
                  </ol>
                </div>
               
              </div>
            </div>
          </div> */}

            <div className='mt-3'>
              <div className='row justify-content-center'>
                {/* <div className='col-md-3'></div> */}
                <div className='col-md-12'>
                  <div className='builder_data'>

                    <div className='builder-hdr'>
                      <h4 className='sect-title mb-4 mt-0'>Builder Profile</h4>
                      <div className='row align-items-center '>
                        <div className='col-md-9'>
                          <div className="d-flex align-items-center">
                            {form?.logo_path == null ?
                              <div className="text-center" style={{ minWidth: '150px' }}>
                                <label htmlFor="logo_upload" className="d-flex flex-column align-items-center justify-content-center"
                                  style={{ cursor: 'pointer', border: '2px dashed #c4d8f8', borderRadius: '8px', padding: '15px 10px', background: '#f8f9fc' }}>
                                  <i className="mdi mdi-cloud-upload" style={{ fontSize: '28px', color: '#4199d8' }}></i>
                                  <span style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>Upload Avatar</span>
                                </label>
                                <input
                                  id="logo_upload"
                                  type="file"
                                  className="form-control formContoler"
                                  name='logo_path'
                                  onChange={(e) => handleImage(e, 'add')}
                                  style={{ display: 'none' }}
                                />
                              </div>
                              :
                              <div className='companylogo '>
                                <img src={form?.logo_path} alt="logos" width={150} />
                              </div>
                            }
                            <div className='w-100 details_addrss'>


                              {userData.company_name &&

                                <h5>{userData.company_name} </h5>

                              }

                              <div className='addre_out'>

                                {userData.headoffice_location == null ?
                                  <textarea
                                    className={`form-control formContoler ${formError.headoffice_location ? 'is-invalid' : ''}`}
                                    name="headoffice_location"
                                    onChange={handleForm}
                                    placeholder='Enter Address'
                                  >
                                  </textarea>
                                  :
                                  <>
                                    <span>{userData.headoffice_location}</span>
                                  </>
                                }
                                {formError.headoffice_location && <p className='text-danger err mb-0' style={{ fontSize: '12px' }}>{formError.headoffice_location}</p>}
                              </div>


                            </div>

                          </div>

                        </div>
                        <div className='col-md-3 text-right d-flex justify-content-end'>


                          <div className="page-title-right">
                            <button className="btn btn-info" onClick={() => { setEditForm(userData); setFormError({}); setShow(true); }}>
                              Edit Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className='builder-hdr'>
                      <div className='row'>

                        <div className='col-md-6 mb-3'>
                          <div>
                            <div className='d-flex'>
                              <label>MD Name: </label>
                              {userData.md_name == null ?
                                <input
                                  type="text"
                                  name='md_name'
                                  className={`form-control formContoler ${formError.md_name ? 'is-invalid' : ''}`}
                                  placeholder='Enter Md Name'
                                  onChange={handleForm}
                                />
                                :
                                <>
                                  <span>{userData?.md_name}</span>
                                </>
                              }
                            </div>
                            {formError.md_name && <p className='text-danger err mb-0' style={{ fontSize: '12px' }}>{formError.md_name}</p>}
                          </div>
                        </div>

                        <div className='col-md-6 mb-3'>
                          <div>
                            <div className='d-flex'>
                              <label>MD Phone Number : </label>
                              {userData.md_phone_number == null ?
                                <input
                                  type="number"
                                  className={`form-control formContoler ${formError.md_phone_number ? 'is-invalid' : ''}`}
                                  name='md_phone_number'
                                  placeholder='Enter'
                                  onChange={handleForm}
                                />
                                :
                                <span>{userData.md_phone_number}</span>
                              }
                            </div>
                            {formError.md_phone_number && <p className='text-danger err mb-0' style={{ fontSize: '12px' }}>{formError.md_phone_number}</p>}
                          </div>
                        </div>

                        <div className='col-md-6 px-0'>
                          <div className='d-flex'>
                            <label>MD Email : </label>
                            {userData.md_email == null ?
                              <input
                                type="text"
                                className="form-control formContoler"
                                name='md_email'
                                placeholder='Enter Email'
                                onChange={handleForm}
                              />
                              :
                              <span>{userData.md_email}</span>
                            }
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className='builder-hdr'>

                      <div className='row'>
                        <div className='col-md-6 mb-3'>
                          <div className='d-flex'>
                            <label>Company Email :</label>
                            {userData.company_email == null ?
                              <input
                                type="text"
                                className="form-control formContoler"
                                name='company_email'
                                placeholder='Enter Company Email'
                                onChange={handleForm}
                              />
                              :
                              <span>{userData.company_email}</span>
                            }
                          </div>
                        </div>
                        <div className='col-md-6 mb-3'>
                          <div className='d-flex'>
                            <label>Company Contact :</label>
                            {userData.company_contact == null ?
                              <input
                                type="text"
                                className="form-control formContoler"
                                name='company_contact'
                                placeholder='Enter Company Contact'
                                onChange={handleForm}
                              />
                              :
                              <span>{userData.company_contact}</span>
                            }
                          </div>
                        </div>
                        <div className='col-md-6 mb-3'>
                          <div>
                            <div className='d-flex'>
                              <label>Manager Name :</label>
                              {userData.cp_manager_name == null ?
                                <input
                                  type="text"
                                  className={`form-control formContoler ${formError.cp_manager_name ? 'is-invalid' : ''}`}
                                  name='cp_manager_name'
                                  placeholder='Manager Name'
                                  onChange={handleForm}
                                />
                                :
                                <span>{userData.cp_manager_name}</span>
                              }
                            </div>
                            {formError.cp_manager_name && <p className='text-danger err mb-0' style={{ fontSize: '12px' }}>{formError.cp_manager_name}</p>}
                          </div>
                        </div>

                        <div className='col-md-6 mb-3'>
                          <div>
                            <div className='d-flex'>
                              <label>Company Manager Number :</label>
                              {userData.cp_manager_phone_number == null ?
                                <input
                                  type="text"
                                  className={`form-control formContoler ${formError.cp_manager_phone_number ? 'is-invalid' : ''}`}
                                  name='cp_manager_phone_number'
                                  placeholder='Manager Number'
                                  onChange={handleForm}
                                />
                                :
                                <span>{userData.cp_manager_phone_number}</span>
                              }
                            </div>
                            {formError.cp_manager_phone_number && <p className='text-danger err mb-0' style={{ fontSize: '12px' }}>{formError.cp_manager_phone_number}</p>}
                          </div>
                        </div>

                        <div className='col-md-6 px-0'>
                          <div className='d-flex'>
                            <label>Company Manger Email : </label>
                            {userData.cp_manager_email == null ?
                              <input
                                type="text"
                                className="form-control formContoler"
                                name='cp_manager_email'
                                placeholder='Manager Email'
                                onChange={handleForm}
                              />
                              :
                              <span>{userData.cp_manager_email}</span>
                            }
                          </div>
                        </div>
                      </div>

                    </div>

                    <div className='builder-hdr'>

                      <div className='row'>



                        <div className='col-md-6 mb-3'>
                          <div className='d-flex'>
                            <label>Company  Pan : </label>
                            {userData.cp_manager_email == null ?
                              <input
                                type="text"
                                className="form-control formContoler"
                                name='cp_company_pan'
                                placeholder='Company Pan'
                                onChange={handleForm}
                              />
                              :
                              <span>{userData.cp_company_pan}</span>
                            }

                          </div>
                        </div>

                        <div className='col-md-6 mb-3'>
                          <div className='d-flex'>
                            <label>Company GST Number : </label>
                            {userData.cp_gst_number == null ?
                              <input
                                type="text"
                                className="form-control formContoler"
                                name='cp_gst_number'
                                placeholder='Enter GST Number'
                                onChange={handleForm}
                              />
                              :
                              <span>{userData.cp_gst_number}</span>
                            }
                          </div>
                        </div>
                        <div className='col-md-6 px-0'>
                          <div className='d-flex'>
                            <label>RERA Number : </label>
                            {/* {userData.cp_gst_number == null ?
                              <input
                                type="text"
                                className="form-control formContoler"
                                name='cp_gst_number'
                                placeholder='Enter GST Number'
                                onChange={handleForm}
                              />
                              :
                              <span>{userData.cp_gst_number}</span>
                            } */}
                          </div>
                        </div>


                      </div>

                    </div>
                    <div className='builder-hdr'>

                      <div className='row'>
                        <div className='col-md-12 mb-1 d-flex justify-content-between align-items-center'>
                          <h4>contact number & Mail id to be displayed for Customer Enquiries.</h4>
                          {userData.headoffice_location == null &&
                            <button className="btn btn-success btn-sm" onClick={addLocation} style={{ whiteSpace: 'nowrap' }}>
                              + Add Location
                            </button>
                          }
                        </div>
                      </div>

                      {/* Dynamic locations */}
                      {locations.map((loc, idx) => {
                        const suffix = idx === 0 ? 'one' : idx === 1 ? 'two' : idx === 2 ? 'three' : `${idx + 1}`;
                        const locKey = `location_${suffix}`;
                        // Check if this location already exists in userData
                        const existingLoc = userData.locations && userData.locations[idx];
                        const existingCity = existingLoc ? existingLoc.city : userData[locKey];
                        const existingMobile = existingLoc ? existingLoc.contact_person_phone_number : userData[`${locKey}_mobile`];
                        const existingEmail = existingLoc ? (existingLoc.contact_person_mail || existingLoc.email) : userData[`${locKey}_email`];

                        return (
                          <div className={`row py-2 px-3 ${idx % 2 !== 0 ? 'bg-gray' : ''}`} key={loc.id} style={{ borderBottom: '1px solid #eee', marginBottom: '8px', paddingBottom: '8px' }}>
                            <div className="col-md-12 px-0 d-flex justify-content-between align-items-center mb-2">
                              <div className="d-flex align-items-center">
                                <h5 className="mb-0">Location {idx + 1} : {existingCity &&
                                  <span>{existingCity}</span>
                                }</h5>
                                {existingMobile != null &&
                                  <h5 className='ml-3 mb-0' style={{ marginLeft: '15px' }}>📞
                                    <span>{existingMobile}</span>
                                  </h5>
                                }
                                {existingEmail != null &&
                                  <h5 className='ml-3 mb-0' style={{ marginLeft: '15px' }}>✉️
                                    <span>{existingEmail}</span>
                                  </h5>
                                }
                              </div>
                              {!existingCity && locations.length > 1 &&
                                <button className="btn btn-danger btn-sm" onClick={() => removeLocation(loc.id)}>
                                  Remove
                                </button>
                              }
                            </div>

                            {existingCity == null &&
                              <>
                                <div className='col-md-4 mb-3'>
                                  <div className='d-flex'>
                                    <label>Select Country : </label>
                                    <select
                                      className="form-control formContoler"
                                      value={loc.country_code}
                                      onChange={(e) => handleLocationChange(loc.id, 'country_code', e.target.value)}
                                    >
                                      <option value="">Select Country</option>
                                      {countries.map((country, i) => (
                                        <option key={i + 1} value={country.country_code}>{country.country_name}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className='col-md-4 mb-3'>
                                  <div className='d-flex'>
                                    <label>Select State : </label>
                                    <select
                                      className="form-control formContoler"
                                      value={loc.state_code}
                                      onChange={(e) => handleLocationChange(loc.id, 'state_code', e.target.value)}
                                    >
                                      <option value="">Select State</option>
                                      {(locationStates[loc.id] || []).map((state, i) => (
                                        <option key={i + 1} value={state.state_code}>{state.state_name}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className='col-md-4 mb-3'>
                                  <div className="d-flex">
                                    <label>Select City</label>
                                    <select
                                      className="form-control formContoler"
                                      value={loc.city}
                                      onChange={(e) => handleLocationChange(loc.id, 'city', e.target.value)}
                                    >
                                      <option value="">Select City</option>
                                      {(locationCities[loc.id] || []).map((city, i) => (
                                        <option key={i + 1} value={city.city_code}>{city.city_name}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className='col-md-6 mb-3'>
                                  <div className='d-flex'>
                                    <label>Enter Mobile : </label>
                                    <input
                                      className="form-control formContoler"
                                      type="text"
                                      value={loc.mobile}
                                      onChange={(e) => handleLocationChange(loc.id, 'mobile', e.target.value)}
                                    />
                                  </div>
                                </div>
                                <div className='col-md-6 mb-3'>
                                  <div className='d-flex'>
                                    <label>Email : </label>
                                    <input
                                      className="form-control formContoler"
                                      type="text"
                                      value={loc.email}
                                      onChange={(e) => handleLocationChange(loc.id, 'email', e.target.value)}
                                    />
                                  </div>
                                </div>
                              </>
                            }
                          </div>
                        );
                      })}

                      {userData.headoffice_location == null &&

                        <div className="page-title-right d-flex justify-content-end mt-2">
                          <button className="btn btn-info" onClick={handleSubmit}>
                            Complete Profile
                          </button>
                        </div>
                      }


                    </div>



                  </div>
                </div>
              </div>
            </div>
          </div>


          <Offcanvas show={show} onHide={() => setShow(false)} placement="end" className="prifile_edit">
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body>
              <div className='card'>
                <div className="card-header"><h3 className="card-title">Edit Profile</h3></div>

                <div className="card-body">
                  <h5 className='sect-title mb-3'>Please Enter Details Below</h5>
                  {/* <form> */}
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Company Name"
                          name='company_name'
                          value={editForm?.company_name || ''}
                          onChange={handleEditForm}
                        />
                        <label htmlFor="size-representation" className="fw-normal">Company Name :</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="file"
                          className="form-control"
                          placeholder="Company Name"
                          name='logo_path'
                          onChange={(e) => handleImage(e, 'edit')}
                        />
                        <label htmlFor="size-representation" className="fw-normal">Upload Logo :</label>
                      </div>
                    </div>
                  </div>
                  <h6 className="BuildNameCom mb-3 mt-4">Office Address :</h6>

                  <div className="row mb-4">
                    <div className="col-md-12">
                      <div className="form-floating">
                        <textarea
                          type="text"
                          placeholder="Enter Complete Address"
                          className="form-control"
                          name='headoffice_location'
                          value={editForm.headoffice_location || ''}
                          onChange={handleEditForm}
                        ></textarea>
                        <label htmlFor="size-representation" className="fw-normal">Enter Complete Address</label>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-4">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Md Name"
                          name='md_name'
                          value={editForm.md_name || ''}
                          onChange={handleEditForm}
                        />
                        <label htmlFor="size-representation" className="fw-normal">Md Name </label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="MD Phone Number"
                          name='md_phone_number'
                          value={editForm.md_phone_number || ''}
                          onChange={handleEditForm}
                        />
                        <label htmlFor="size-representation" className="fw-normal">Md Phone Number</label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Email"
                          name='md_email'
                          value={editForm.md_email || ''}
                          onChange={handleEditForm}
                        />
                        <label htmlFor="size-representation" className="fw-normal">Md Email</label>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-4">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Company Email"
                          name='company_email'
                          value={editForm.company_email || ''}
                          onChange={handleEditForm}
                        />
                        <label htmlFor="size-representation" className="fw-normal">Company Email</label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Company Contact"
                          name='company_contact'
                          value={editForm.company_contact || ''}
                          onChange={handleEditForm}
                        />
                        <label htmlFor="size-representation" className="fw-normal">Company Contact </label>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-4">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Manager Name"
                          name='cp_manager_name'
                          value={editForm.cp_manager_name || ''}
                          onChange={handleEditForm}
                        />
                        <label htmlFor="size-representation" className="fw-normal">Enter Manager Name</label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Company Name"
                          name='cp_manager_phone_number'
                          value={editForm.cp_manager_phone_number || ''}
                          onChange={handleEditForm}
                        />
                        <label htmlFor="size-representation" className="fw-normal">Enter Manager Number</label>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Manager Email"
                          name='cp_manager_email'
                          value={editForm.cp_manager_email || ''}
                          onChange={handleEditForm}
                        />
                        <label htmlFor="size-representation" className="fw-normal">Enter Manager Email </label>
                      </div>
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-4">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Company PAN"
                          name='cp_company_pan'
                          value={editForm.cp_company_pan || ''}
                          onChange={handleEditForm}
                        />
                        <label htmlFor="size-representation" className="fw-normal">Enter Company PAN</label>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-floating">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Company GST"
                          name='cp_gst_number'
                          value={editForm.cp_gst_number || ''}
                          onChange={handleEditForm}
                        />
                        <label htmlFor="size-representation" className="fw-normal">Enter GST Number</label>
                      </div>
                    </div>

                  </div>

                  <h3 className="BuildNameCom mb-3 mt-4">Provide  your contact number & Mail id to be displayed for customer inquiries.
                  </h3>

                  {editLocations.map((loc, idx) => (
                    <div className="row mb-4" key={loc.id} style={{ borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                      <div className="col-md-12 d-flex justify-content-between align-items-center mb-2">
                        <h6 className="mb-0">Location {idx + 1}</h6>
                        {editLocations.length > 1 &&
                          <button className="btn btn-danger btn-sm" type="button" onClick={() => removeEditLocation(loc.id)}>Remove</button>
                        }
                      </div>
                      <div className="col-md-4">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Location"
                            value={loc.city || ''}
                            readOnly
                          />
                          <label className="fw-normal">Location</label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Location Email"
                            value={loc.email || ''}
                            onChange={(e) => handleEditLocationChange(loc.id, 'email', e.target.value)}
                          />
                          <label className="fw-normal">Enter Mail ID</label>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Location Number"
                            value={loc.mobile || ''}
                            onChange={(e) => handleEditLocationChange(loc.id, 'mobile', e.target.value)}
                          />
                          <label className="fw-normal">Enter Mobile Number</label>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="mb-3">
                    <button className="btn btn-success btn-sm" type="button" onClick={addEditLocation}>+ Add Location</button>
                  </div>

                  <div className="button-subb mt-0">
                    <button name="submit" className="sub-btn1" onClick={handleUpdate} >
                      Update
                    </button>
                  </div>
                  {/* </form> */}
                </div>
              </div>
            </Offcanvas.Body>
          </Offcanvas>

        </div>

      </div>
    </>

  )
}

export default Profile