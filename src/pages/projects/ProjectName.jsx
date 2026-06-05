import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Loader from '../../components/Loader';
import { masterClient } from '../../utils/httpClient';
import { IpInfoContext } from '../../utils/context';
import { toastSuccess, toastError, toastWarning, date } from '../../utils/toast';
import AutoComplete from './components/AutoComplete';
import GoogleMapComponent from './components/GoogleMapComponent';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const ProjectName = ({ changeHandler, selectHandler }) => {
  const [show, setShow] = useState(false);
  const [showModal, setModalPopup] = useState(false);
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
  const [formBuiderErr, setFormBuilderErr] = useState({});
  const [formforBuilder, setBuilderForm] = useState({
    position: 1
  });
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
          setForm({
            position: 1
          });
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


  //hanndle Builder Form Change
  const handleBuilderChange = (e) => {
    setBuilderForm({ ...formforBuilder, [e.target.name]: e.target.value });
  };


 //validation
 const validateBuilders = () => {
  let errors = {};
  let isFormValid = true;
  if (!formforBuilder.name) {
    isFormValid = false;
    errors.name = 'Please Enter Builder Name';
  }
  if (!formforBuilder.headoffice_location) {
    isFormValid = false;
    errors.headoffice_location = 'Please Enter Location';
  }
  if (!formforBuilder.md_name) {
    isFormValid = false;
    errors.md_name = 'Please Enter MD Name';
  }
  if (!formforBuilder.md_phone_number) {
    isFormValid = false;
    errors.md_phone_number = 'Enter Phone Number';
  }
  if (!formforBuilder.cp_manager_name) {
    isFormValid = false;
    errors.cp_manager_name = 'Please Enter CP Name';
  }
  if (!formforBuilder.cp_manager_phone_number) {
    isFormValid = false;
    errors.cp_manager_phone_number = 'Enter Phone Number';
  }
  if (!formforBuilder.sales_manager_name) {
    isFormValid = false;
    errors.sales_manager_name = 'Please Enter Sale Manager Name';
  }
  if (!formforBuilder.sales_manager_phone_number) {
    isFormValid = false;
    errors.sales_manager_phone_number = ' Enter Phone Number';
  }
  if (!formforBuilder.slug) {
    isFormValid = false;
    errors.slug = 'Please Enter Slug';
  }
  if (!formforBuilder.logo_path) {
    isFormValid = false;
    errors.logo_path = 'Please Choose Logo';
  }
  setFormBuilderErr(errors);
  return isFormValid;
};

//handle Submit
const handleSubmitBuilderForm = async () => {
  if (validateBuilders()) {
    try {
      setLoading(true);
      const res = await masterClient.post('builder', formforBuilder);
      if (res?.data?.status) {
        toastSuccess(res?.data?.message);
        setBuilderForm({});
        setFormBuilderErr({});
        setModalPopup(false);
        getBuilders();
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
    toastWarning('Please fill Mandetory Fields');
  }
};





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
                        <a href="/">Terraterri</a>
                      </li>
                      <li className="breadcrumb-item active">Project Names</li>
                    </ol>
                  </div>
                  <div className="page-title-right">
                    <button onClick={() => setShow(true)} className="btn btn-info">
                      Add Project Name
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Project Types</h3>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by location"
                      />
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Project Name</th>
                            <th>Country</th>
                            <th>State</th>
                            <th>City</th>
                            <th>Locality</th>
                            <th>Builder Id</th>
                            <th>latitude</th>
                            <th>longitude</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.map((project, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{project.name}</td>
                              <td>{project.country_code}</td>
                              <td>{project.state_code}</td>
                              <td>{project.city_code}</td>
                              <td>{project.locality}</td>
                              <td>{project.latitude}</td>
                              <td>{project.longitude}</td>
                              <td>{project.builder_id}</td>
                              <td className="table-icons">
                                <tr>
                                  <td onClick={() => handleEdit(project)}>
                                    <i className="fas fa-edit"></i>
                                  </td>
                                  <td onClick={() => deleteProName(project.id)}>
                                    <i className="fa fa-trash"></i>
                                  </td>
                                </tr>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Offcanvas show={show} style={{ width: '50%' }} onHide={() => setShow(false)} placement="end">
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
                      <div className="row">
                      <div className="mb-3 col-6">
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
                      <div className="mb-3 col-6">
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
                      </div>
                      <div className='row'>
                      <div className="mb-3 col-6">
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
                      <div className="mb-3 col-6">
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
                      </div>
                      <div className='row'>
                      <div className="mb-3 col-6">
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
                      <div className='mb-3 col-6 d-flex justify-content-center'>
                        <h6>Builder not listed?</h6>
                      <button type="button" className="add_builder" onClick={() => setModalPopup(true)}>
                Add New Builder
              </button>

                      </div>
                      </div>
                      <div class="row">
                      <div className="mb-3 col-6">
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
                      <div className="mb-3 col-6">
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
        </div>
      </div>
      <Modal show={showModal}  size="xl">
        <Modal.Header>
          <Modal.Title>Add New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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

                            className="form-control"
                            name="name"
                            placeholder="Builder Name"
                            value={formforBuilder?.name || ''}
                            onChange={handleBuilderChange}
                          />
                          <label for="project-type" className="fw-normal">
                            Enter Builder Name{' '}
                          </label>
                          {formBuiderErr.name && <p className="err">{formBuiderErr.name}</p>}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="text"

                            className="form-control"
                            name="headoffice_location"
                            placeholder="Head Office Location"
                            value={formforBuilder?.headoffice_location || ''}
                            onChange={handleBuilderChange}
                          />
                          <label for="project-type" className="fw-normal">
                            Head Office Location
                          </label>
                          {formBuiderErr.headoffice_location && (
                            <p className="err">{formBuiderErr.headoffice_location}</p>
                          )}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="text"

                            className="form-control"
                            name="md_name"
                            placeholder="Enter MD Name"
                            value={formforBuilder?.md_name || ''}
                            onChange={handleBuilderChange}
                          />
                          <label for="project-type" className="fw-normal">
                            Enter MD Name
                          </label>
                          {formBuiderErr.md_name && <p className="err">{formBuiderErr.md_name}</p>}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="number"

                            className="form-control"
                            name="md_phone_number"
                            placeholder="MD Phone Number"
                            value={formforBuilder?.md_phone_number || ''}
                            onChange={handleBuilderChange}
                          />
                          <label for="project-type" className="fw-normal">
                            Enter Phone Number
                          </label>
                          {formBuiderErr.md_phone_number && (
                            <p className="err">{formBuiderErr.md_phone_number}</p>
                          )}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="text"

                            className="form-control"
                            name="cp_manager_name"
                            placeholder="CP Manager Name"
                            value={formforBuilder?.cp_manager_name || ''}
                            onChange={handleBuilderChange}
                          />
                          <label for="project-type" className="fw-normal">
                            Channel Partner Manager Name
                          </label>
                          {formBuiderErr.cp_manager_name && (
                            <p className="err">{formBuiderErr.cp_manager_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="number"

                            className="form-control"
                            name="cp_manager_phone_number"
                            placeholder="Phone Number"
                            value={formforBuilder?.cp_manager_phone_number || ''}
                            onChange={handleBuilderChange}
                          />
                          <label for="project-type" className="fw-normal">
                            Enter Phone Number
                          </label>
                          {formBuiderErr.cp_manager_phone_number && (
                            <p className="err">{formBuiderErr.cp_manager_phone_number}</p>
                          )}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="text"

                            className="form-control"
                            name="sales_manager_name"
                            placeholder="Sales manager Name"
                            value={formforBuilder?.sales_manager_name || ''}
                            onChange={handleBuilderChange}
                          />
                          <label for="project-type" className="fw-normal">
                            Sales manager Name
                          </label>
                          {formBuiderErr.sales_manager_name && (
                            <p className="err">{formBuiderErr.sales_manager_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="number"

                            className="form-control"
                            name="sales_manager_phone_number"
                            placeholder="Phone Number"
                            value={formforBuilder?.sales_manager_phone_number || ''}
                            onChange={handleBuilderChange}
                          />
                          <label for="project-type" className="fw-normal">
                            Enter Phone Number
                          </label>
                          {formBuiderErr.sales_manager_phone_number && (
                            <p className="err">{formBuiderErr.sales_manager_phone_number}</p>
                          )}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="text"

                            className="form-control"
                            name="slug"
                            placeholder="Slug"
                            value={formforBuilder?.slug || ''}
                            onChange={handleBuilderChange}
                          />
                          <label for="project-type" className="fw-normal">
                            Enter Slug{' '}
                          </label>
                          {formBuiderErr.slug && <p className="err">{formBuiderErr.slug}</p>}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="form-floating">
                          <input
                            type="file"
                            id="build-logo"
                            className="form-control"
                            name="logo_path"
                            accept="image/*"
                            onChange={handleBuilderChange}
                          />
                          <label for="project-type" className="fw-normal">
                            Logo
                          </label>
                          {formBuiderErr.logo_path && <p className="err">{formBuiderErr.logo_path}</p>}
                        </div>
                      </div>
                     
                    </form>
                  </div>
                </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalPopup(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitBuilderForm}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default ProjectName;
