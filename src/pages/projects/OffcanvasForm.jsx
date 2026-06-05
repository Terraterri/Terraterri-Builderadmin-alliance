import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Loader from '../../components/Loader';
import { masterClient } from '../../utils/httpClient';
import { IpInfoContext } from '../../utils/context';
import { toastSuccess, toastError, toastWarning, date } from '../../utils/toast';
import AutoComplete from './components/AutoComplete';
import GoogleMapComponent from './components/GoogleMapComponent';

const OffcanvasForm = (props) => {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [builders, setBuilders] = useState([]);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [form, setForm] = useState({
      position: 1
    });
    const [formErr, setFormErr] = useState({});
    const [update, setUpdate] = useState({});
    const [cordinates, setCordinates] = useState({});
  
    const getLatLongs = (data) => {
      setCordinates(data);
      setForm({ ...form, latitude: data.lat, longitude: data.lng });
    }
  
    // get countries
    const allCountries = async () => {
      setLoading(true);
      try {
        const res = await masterClient.get('country');
        console.log('get countries=====', res);
        if (res?.data?.status) {
          setCountries(res?.data?.data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
  
    //   getAll States
    const getStatesByCountry = async (param) => {
      setLoading(true);
      try {
        const res = await masterClient.get(`state/${param}`);
        console.log('get states=====', res);
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
    const allCities = async (param) => {
      setLoading(true);
      try {
        const res = await masterClient.get(`city/${param}`);
        console.log('get cities=====', res);
        if (res?.data?.status) {
          setCities(res?.data?.data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
  
    //   getAll Cities
    const getLocalityByCity = async (param) => {
      setLoading(true);
      try {
        const res = await masterClient.get(`locality/${param}`);
        console.log('get localities=====', res);
        if (res?.data?.status) {
          setLocalities(res?.data?.data);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
  
    //   handle Change
    const handleChange = async (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
      if (e.target.name == 'country_code') {
        getStatesByCountry(e.target.value);
      }
      if (e.target.name == 'state_code') {
        allCities(e.target.value);
      }
      if (e.target.name == 'city_code') {
        getLocalityByCity(e.target.value);
      }
    };
  
    //   validation
    const validate = () => {
      let errors = {};
      let isFormValid = true;
      if (!form.name) {
        isFormValid = false;
        errors.name = 'Please Enter Project Name';
      }
      if (!form.country_code) {
        isFormValid = false;
        errors.country_code = 'Please Select the Country';
      }
      if (!form.state_code) {
        isFormValid = false;
        errors.state_code = 'Please Select the State';
      }
      if (!form.city_code) {
        isFormValid = false;
        errors.city_code = 'Please Select the City';
      }
  
      if (!form.locality) {
        isFormValid = false;
        errors.locality = 'Please Enter the Locality';
      }
  
      if (!form.builder_id) {
        isFormValid = false;
        errors.builder_id = 'Please Select the Builder';
      }
      if (!form.mobile_number) {
        isFormValid = false;
        errors.mobile_number = 'Please Enter Phone Number';
      }
      if (!form.email) {
        isFormValid = false;
        errors.email = 'Please Enter Email';
      }
  
      setFormErr(errors);
      return isFormValid;
    };
  
    // handleSubmit
    const handleSubmit = async () => {
      if (validate()) {
        let res;
        if (update?.id) {
          res = await masterClient.put(`projectname/${update.id}`, form)
        }
        else {
          res = await masterClient.post('projectname', form);
        }
        try {
          setLoading(true);
          if (res?.data?.status) {
            toastSuccess(res?.data?.message);
            setFormErr({});
           
            setShow(false);
            getProjectName();
          }
        } catch (error) {
          console.log(error);
          if (error?.response?.data?.type === 'Validation error' && error?.response?.data?.data) {
            setFormErr(error?.response?.data?.data);
          } else {
            toastError(error?.response?.data?.message);
          }
        } finally {
          setLoading(false);
        }
      } else {
        toastError('please fill mandatory fields');
        console.log(formErr);
      }
    };
  
    // get ProjectName
    const getProjectName = async () => {
      setLoading(true);
      try {
        const res = await masterClient.get('projectname');
        console.log('proNameResult=====', res);
        if (res?.data?.status) {
          setProjects(res?.data?.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
  
    //get Builders
    const getBuilders = async () => {
      setLoading(true);
      try {
        const res = await masterClient.get('builder');
        console.log('Get Builders====', res);
        if (res?.data?.status) {
          setBuilders(res?.data?.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
  
    // Delete ProjectName
    const deleteProName = async (proId) => {
      setLoading(true);
      try {
        const res = await masterClient.delete(`projectname/${proId}`);
        if (res?.data?.status) {
          toastSuccess(res?.data?.message);
          getProjectName();
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };
  
  
    //edit project
    const handleEdit = (projectData) => {
      setShow(true);
      setForm({ ...projectData });
      setUpdate(projectData);
    }
  
    useEffect(() => {
      getProjectName();
      getBuilders();
      allCountries();
      if (update?.country_code) {
        getStatesByCountry(update?.country_code)
      }
      if (update?.state_code) {
        allCities(update?.state_code)
      }
      if (update?.city_code) {
        getLocalityByCity(update?.city_code)
      }
    }, [update]);

  return (
    <div>
      
      <Offcanvas show={props.show} style={{ width: '90%' }} onHide={props.close} placement="end">
              <Offcanvas.Header closeButton></Offcanvas.Header>
              <Offcanvas.Body>
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Add Project Type</h3>
                  </div>
                  <div className="card-body">
                    <form className="custom-validation">
                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="text"
                            id="project-type"
                            className="form-control"
                            name="name"
                            placeholder="Insert your firstname"
                            value={form?.name || ''}
                            onChange={handleChange}
                          />
                          <label for="project-type" className="fw-normal">
                            Enter Project Name{' '}
                          </label>
                          {formErr.name && <p className="err">{formErr.name}</p>}
                        </div>
                      </div>

                      <div className="mb-3">
                        <select
                          className="form-select"
                          name="country_code"
                          value={form?.country_code || ''}
                          onChange={handleChange}>
                          <option value="default">Select Country</option>
                          {countries.map((country, index) => (
                            <option key={index} value={country.country_code}>
                              {country.country_name}
                            </option>
                          ))}
                        </select>
                        {formErr.country_code && <p className="err">{formErr.country_code}</p>}
                      </div>
                      <div className="mb-3">
                        <select
                          className="form-select"
                          name="state_code"
                          value={form?.state_code || ''}
                          onChange={handleChange}>
                          <option value="default">Select State</option>
                          {states.map((state, index) => (
                            <option key={index} value={state.state_code}>
                              {state.state_name}
                            </option>
                          ))}
                        </select>
                        {formErr.state_code && <p className="err">{formErr.state_code}</p>}
                      </div>
                      <div className="mb-3">
                        <select
                          className="form-select"
                          name="city_code"
                          value={form?.city_code || ''}
                          onChange={handleChange}>
                          <option value="default">Select Cities</option>
                          {cities.map((city, index) => (
                            <option key={index} value={city.city_code}>
                              {city.city_name}
                            </option>
                          ))}
                        </select>
                        {formErr.city_code && <p className="err">{formErr.city_code}</p>}
                      </div>

                      <div className="mb-3">
                        <select
                          className="form-select"
                          name="locality"
                          value={form?.locality || ''}
                          onChange={handleChange}>
                          <option value="default">Locality</option>
                          {localities.map((locality, index) => (
                            <option key={index} value={locality.locality_name}>
                              {locality.locality_name}
                            </option>
                          ))}
                        </select>
                        {formErr.locality && <p className="err">{formErr.locality}</p>}
                      </div>
                      <div className="mb-3">
                        <select
                          className="form-select"
                          name="builder_id"
                          value={form?.builder_id || ''}
                          onChange={handleChange}>
                          <option value="default">Select Builder</option>
                          {builders.map((builder, index) => (
                            <option key={index} value={builder.id}>
                              {builder.name}
                            </option>
                          ))}
                        </select>
                        {formErr.builder_id && <p className="err">{formErr.builder_id}</p>}
                      </div>
                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="text"
                            id="project-type"
                            className="form-control"
                            name="email"
                            placeholder="Insert your firstname"
                            value={form?.email || ''}
                            onChange={handleChange}
                          />
                          <label for="project-type" className="fw-normal">
                            Enter Email
                          </label>
                          {formErr.email && <p className="err">{formErr.email}</p>}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="number"
                            id="project-type"
                            className="form-control"
                            name="mobile_number"
                            placeholder="Insert your firstname"
                            value={form?.mobile_number || ''}
                            onChange={handleChange}
                          />
                          <label for="project-type" className="fw-normal">
                            Enter Mobile
                          </label>
                          {formErr.mobile_number && <p className="err">{formErr.mobile_number}</p>}
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="form-floating">
                          <AutoComplete latLong={getLatLongs} />
                          {/* {formErr.name && <p className="err">{formErr.name}</p>} */}
                        </div>
                      </div>

                      <div className="col-12">
                        <button className="btn btn-primary" type="button" onClick={handleSubmit}>
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Offcanvas.Body>
            </Offcanvas>
    </div>
  )
}

export default OffcanvasForm
