import { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { masterClient, projectClient } from '../../utils/httpClient';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { toastSuccess, toastError, toastWarning } from '../../utils/toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setProject } from '../../store/slices/ProjectManagementSlice';
import AutoComplete from './components/AutoComplete';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const StepOne = ({ nextStep, prevStep, currentStep, setType, setSubType, setIsRent, setIsSale, isRent, isSale }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // to add loader while api fetching
  const [loading, setLoading] = useState(false);

  // ? set form data
  const formState = useSelector((state) => state.projectManagement['project']);
  const [form, setForm] = useState({
    'listing_type_id': 1,
    ...formState
  });
  const [formError, setFormError] = useState({});

  // ? project name form modal pop up
  const [show, setShow] = useState(false);
  const [projectNameForm, setProjectNameform] = useState({});
  const [projectFormErr, setProjectFormErr] = useState({});
  const [projectNameCountries, setProjectNameCountries] = useState([])
  const [projectNameStates, setProjectNameStates] = useState([])
  const [projectNameCities, setProjectNameCities] = useState([])

  // ? builder form and modal pop up
  const [builderForm, setBuilderForm] = useState({
    position: 1
  });
  const [builderFormErr, setBuilderFormErr] = useState({});


  // ? variables to store api data
  // ? project types
  const [projectType, setProjectType] = useState([]);
  const [subProjectType, setSubProjectType] = useState([]);

  // ? variables to store location data
  const [countries, setCountries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);

  const [filteredProjects, setFilteredProjects] = useState([])

  const [builder, setBuilder] = useState({});
  const [builders, setBuilders] = useState([]);
  const [cordinates, setCordinates] = useState({});
  const [showModal, setModalPopup] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [propertyTypee, setpropertyTypee] = useState('');
  const [subPtype, setsubPtype] = useState('');
  const [saleORrent, setsaleORrent] = useState('For sale');
  const [locality, setlocality] = useState('');
  const [city, setcity] = useState('');


  // ? API Helper funtion
  const fetchData = async (apiCall, onSuccess) => {
    setLoading(true);
    try {
      const res = await apiCall();
      if (res?.data?.status) onSuccess(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ? Reusable Helper funtion with params
  const fetchDataWithParms = async ({
    endpoint,
    setLoading,
    setData,
    transFormFn,
    emptyMessage,
  }) => {
    setLoading(true);
    try {
      const res = await masterClient.get(endpoint);
      if (res.data?.status) {
        let data = res.data.data;
        if (transFormFn) {
          data = transFormFn(data)
        }
        setData(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ? get Sub project types
  const getSubProjectType = async (Propid) => {
    fetchDataWithParms({
      endpoint: 'projectsubtype',
      setLoading,
      setData: setSubProjectType,
      transFormFn: (data) => data.filter(item => item.project_type_id == Propid),
      emptyMessage: 'No Sub Projects Type Found',
    });
  };

  // ? get States with params
  const getStatesByCountry = async (param) => {
    fetchDataWithParms({
      endpoint: `state/${param}`,
      setLoading,
      setData: setStates,
      transFormFn: (data) => data.filter(item => item.country_code == param),
      emptyMessage: ''
    })
  };

  // ? get Cities with params
  const getCitiesByState = async (param) => {
    fetchDataWithParms({
      endpoint: `city/${param}`,
      setLoading,
      setData: setCities,
      transFormFn: (data) => data.filter(item => item.state_code == param),
      emptyMessage: ''
    })
  };

  // ? getAll Localities
  const getLocalityByCity = async (param) => {
    fetchDataWithParms({
      endpoint: `locality/${param}`,
      setLoading,
      setData: setLocalities,
      transFormFn: (data) => data.sort((a, b) =>
        a.locality_name.localeCompare(b.locality_name)
      ),
      emptyMessage: ''
    })
  };


  const getfilteredProjects = async (param) => {
    try {
      const data = projects.filter((name) => name.locality == param);
      const sortedData = data.sort((a, b) => a.name.localeCompare(b.name))
      if (sortedData.length) {
        setFilteredProjects(sortedData);
      } else {
        setFilteredProjects([])
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getBuilderName = async (param) => {
    const project = projects.filter((name) => name.id == param);
    const builderId = project[0].builder_id;
    const latitude = project[0].latitude;
    const longitude = project[0].longitude;
    let res
    try {
      setLoading(true);
      res = await masterClient.get(`builder/${builderId}`);
      if (res?.data?.status) {
        setBuilder(res?.data?.data);
        setForm((prev) => ({ ...prev, builder_id: res?.data?.data?.id, latitude: latitude, longitude: longitude }))
        setProjectNameform(prev =>
          ({ ...prev, builder_id: res?.data?.data?.id, latitude: latitude, longitude: longitude })
        );
      }
    } catch (err) {
      console.log(err);
      toastError(res?.data?.message);
    } finally {
      setLoading(false);
    }
  };


  // * ////////////// Project Form handling funtions ////////////////////////

  // ? project name form handle
  const handleProjectName = async (e) => {
    const { name, value } = e.target

    if (name === 'country_code') {
      fetchDataWithParms({
        endpoint: `state/${value}`,
        setLoading,
        setData: setProjectNameStates,
        transFormFn: (data) => data.filter(item => item.country_code == value),
        emptyMessage: ''
      })
    }
    if (name === 'state_code') {
      console.log('calling cities api')
      fetchDataWithParms({
        endpoint: `city/${value}`,
        setLoading,
        setData: setProjectNameCities,
        transFormFn: (data) => data.filter(item => item.state_code == value),
        emptyMessage: ''
      })
    }

    setProjectNameform((prev) => ({ ...prev, [name]: value }))

  }

  // ? validation Add Project Form
  const validateAddProjectForm = () => {
    let errors = {};
    let isFormValid = true;
    if (!projectNameForm.name) {
      isFormValid = false;
      errors.name = 'Please Enter Project Name';
    }
    if (!projectNameForm.country_code) {
      isFormValid = false;
      errors.country_code = 'Please Select the Country';
    }
    if (!projectNameForm.state_code) {
      isFormValid = false;
      errors.state_code = 'Please Select the State';
    }
    if (!projectNameForm.city_code) {
      isFormValid = false;
      errors.city_code = 'Please Select the City';
    }
    if (!projectNameForm.locality) {
      isFormValid = false;
      errors.locality = 'Please Enter the Locality';
    }
    if (!projectNameForm.builder_id) {
      isFormValid = false;
      errors.builder_id = 'Please Select the Builder';
    }
    if (!projectNameForm.mobile_number) {
      isFormValid = false;
      errors.mobile_number = 'Please Enter Phone Number';
    }
    if (!projectNameForm.email) {
      isFormValid = false;
      errors.email = 'Please Enter Email';
    }
    setProjectFormErr(errors);
    return isFormValid;
  };

  // ? handle Submit projectForm
  const handleSubmitAddProjectForm = async () => {
    if (validateAddProjectForm()) {
      try {
        setLoading(true);
        const res = await masterClient.post('projectname', { ...projectNameForm, position: 1 });
        if (res?.data?.status) {
          const newProject = res?.data?.data;
          const newProjectId = newProject?.id;
          const newLocality = newProject?.locality;
          const newBuilderId = newProject?.builder_id;

          toastSuccess(res?.data?.message);
          setProjectFormErr({});
          setShow(false);

          // Refresh projects list and filteredProjects
          await fetchData(() => masterClient.get('projectname'), setProjects);
          getfilteredProjects(newLocality);

          // Auto-select the newly created project in the main form
          setForm((prev) => ({ ...prev, project_name_id: newProjectId, locality: newLocality }));

          // Auto-fetch and set builder for the new project
          if (newBuilderId) {
            const builderRes = await masterClient.get(`builder/${newBuilderId}`);
            if (builderRes?.data?.status) {
              setBuilder(builderRes?.data?.data);
              setForm((prev) => ({ ...prev, builder_id: builderRes?.data?.data?.id }));
            }
          }
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.type === 'Validation error' && error?.response?.data?.data) {
          setProjectFormErr(error?.response?.data?.data);
        } else {
          toastError(error?.response?.data?.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      toastError('please fill mandatory fields');
      console.log(projectFormErr);
    }
  };

  // * ////////////// Project Form handling funtions end ////////////////////////


  // * ////////////// Builder Form handling funtions ////////////////////////

  // ? hanndle Builder Form Change
  const handleBuilderChange = (e) => {
    setBuilderForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ? validation
  const validateBuilders = () => {
    let errors = {};
    let isFormValid = true;
    if (!builderForm.name) {
      isFormValid = false;
      errors.name = 'Please Enter Builder Name';
    }
    if (!builderForm.headoffice_location) {
      isFormValid = false;
      errors.headoffice_location = 'Please Enter Builder Head Office Location';
    }
    if (!builderForm.md_name) {
      isFormValid = false;
      errors.md_name = 'Please Enter MD Name';
    }
    if (!builderForm.md_phone_number) {
      isFormValid = false;
      errors.md_phone_number = 'Please Enter MD Phone Number';
    }
    if (!builderForm.cp_manager_name) {
      isFormValid = false;
      errors.cp_manager_name = 'Please Enter CP Manager Name';
    }
    if (!builderForm.cp_manager_phone_number) {
      isFormValid = false;
      errors.cp_manager_phone_number = 'Please Enter CP Manager Phone Number';
    }
    setBuilderFormErr(errors);
    return isFormValid;
  };

  // ? handle Builder Submit
  const handleSubmitBuilderForm = async () => {
    if (validateBuilders()) {
      try {
        setLoading(true);
        const res = await masterClient.post('builder', builderForm);
        if (res?.data?.status) {
          setModalPopup(false);
          toastSuccess(res?.data?.message);
          setBuilderForm({});
          setBuilderFormErr({});
          fetchData(() => masterClient.get('builder'), setBuilders)
        }
      } catch (error) {
        console.error('Error Creating Builder in:', error);

        if (error?.response?.data?.data) {
          const errors = error.response.data.data;
          const errorMessages = [];

          for (const key in errors) {
            if (Array.isArray(errors[key])) {
              errorMessages.push(...errors[key]);
            } else {
              errorMessages.push(errors[key]);
            }
          }

          errorMessages.forEach((message) => { toastError(message) });
        }
      } finally {
        setLoading(false);
      }
    } else {
      toastWarning('Please fill Mandetory Fields');
    }
  };

  // * ////////////// Builder Form handling funtions end ////////////////////////


  // * ////////////// Main Form handling funtions end ////////////////////////

  //   handle Change
  const handleChange = async (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    if (e.target.name == 'property_type_id') {
      if (form.listing_type_id == 1) {
        getSubProjectType(e.target.value);
        setType(e.target.value)
      }
    }
    if (e.target.name == 'property_sub_type_id') {
      setSubType(e.target.value)
    }
    if (e.target.name == 'country_code') {
      getStatesByCountry(e.target.value);
    }
    if (e.target.name == 'state_code') {
      getCitiesByState(e.target.value);
    }
    if (e.target.name == 'city_code') {
      getLocalityByCity(e.target.value);
    }
    if (e.target.name === 'locality') {
      getfilteredProjects(e.target.value);
    }
    if (e.target.name == 'project_name_id') {
      getBuilderName(e.target.value);
    }
    handleTitle(e)
  };

  // validation 
  const validate = () => {
    let isValid = true;
    const error = {};
    if (!form.project_listing_name) {
      error.project_listing_name = 'Title is required';
      isValid = false;
    } else {
      setForm(prev => ({ ...prev, ['project_listing_name']: projectTitle }))
    }
    if (!form.property_type_id) {
      error.property_type_id = 'Property Type is required';
      isValid = false;
    }
    if (!form.property_sub_type_id) {
      error.property_sub_type_id = 'Sub Property Type is required';
      isValid = false;
    }
    if (!form.country_code) {
      error.country_code = 'Country is required';
      isValid = false;
    }
    if (!form.state_code) {
      error.state_code = 'State is required';
      isValid = false;
    }
    if (!form.city_code) {
      error.city_code = 'City is required';
      isValid = false;
    }
    if (!form.locality) {
      error.locality = 'Locality is required';
      isValid = false;
    }

    if (!form.listing_type_id) {
      error.listing_type_id = 'Listing Type is required';
      isValid = false;
    }
    if (!form.project_name_id) {
      error.project_name_id = 'Project Name is required';
      isValid = false;
    }
    setFormError(error);
    return isValid;
  };

  // check added project
  const checkExistingProject = async () => {
    let isAvailable = 0;
    const payload = {
      property_type_id: form.property_type_id,
      property_sub_type_id: form.property_sub_type_id,
      locality: form.locality,
      project_name_id: form.project_name_id,
    }
    let res;
    try {
      setLoading(true);
      res = await projectClient.post('search', payload);
      if (res.data.status) {
        isAvailable = res.data.count;
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
    return isAvailable;
  }


  const handleSubmit = async () => {
    if (validate()) {
      try {
        const isAvailable = await checkExistingProject();
        if (isAvailable == 0) {
          dispatch(setProject(form));
          nextStep();
        } else {
          toastError('Project has been already created with this details')
        }
      } catch (e) {
        console.error('Error checking project availability:', e);
      }
    } else {
      console.log(formError)
      toastError('Please Enter Mandatory fields')
    }
  };


  const getLatLongs = (data) => {
    setCordinates(data);
    setProjectNameform((prev) => ({ ...prev, latitude: data.lat, longitude: data.lng }));
  }

  const handleForTypeChage = (e) => {
    handleTitle(e);
    if (e.target.name == "sale") {
      setIsSale(true)
      setIsRent(false)
    } else {
      setIsRent(true)
      setIsSale(false)
    }
  }

  const handleTitle = (e) => {

    if (e.target.name == 'property_type_id') {
      let projectT = projectType.find((a) => a.id == e.target.value)
      setpropertyTypee(projectT.name)
      setsubPtype('')
    }
    if (e.target.name == 'property_sub_type_id') {
      let subType = subProjectType.find((a) => a.id == e.target.value)
      setsubPtype(subType.name)
    }
    if (e.target.name == 'sale' || e.target.name == 'rent' && form.property_type_id == 9) {
      const sale = `For ${e.target.name}`
      setsaleORrent(sale)
    } else {
      setsaleORrent('')
    }
    if (e.target.name == 'locality') {
      const cityyy = cities.find((a) => a.city_code == form.city_code);
      const localityyy = localities.find((a) => a.locality_name == e.target.value);
      setcity(cityyy.city_name)
      setlocality(localityyy.locality_name)
    }
    if (!form.project_listing_name) {
      const ptitle = `${propertyTypee} ${subPtype} Space Is Available ${saleORrent} in ${locality} ${city}`;
      if (propertyTypee != '' && subPtype != '' && location != '' && city != '') {
        setProjectTitle(ptitle);
        setForm(prev => ({ ...prev, ['project_listing_name']: projectTitle }))
      }
    }
  }

  useEffect(() => {
    fetchData(() => masterClient.get('country'), setCountries)
    fetchData(() => masterClient.get('projectname'), setProjects)
    fetchData(() => masterClient.get('builder'), setBuilders)
    fetchData(() => masterClient.get('projecttype'), setProjectType)
  }, [])


  useEffect(() => {
    if (form?.property_type_id !== undefined) {
      getSubProjectType(form.property_type_id);
    }
  }, [form?.property_type_id]);

  useEffect(() => {
    if (form?.property_sub_type_id !== undefined) {
      setSubType(form.property_sub_type_id);
    }
  }, [form?.property_sub_type_id])

  useEffect(() => {
    if (form?.locality !== undefined && projects.length > 0) {
      getfilteredProjects(form.locality)
    }
  }, [form?.locality, projects])

  useEffect(() => {
    if (projects.length > 0 && form?.project_name_id) {
      getBuilderName(form?.project_name_id);
    }
  }, [projects]);

  useEffect(() => {
    if (form?.country_code) {
      getStatesByCountry(form?.country_code)
    }
  }, [form?.country_code])

  useEffect(() => {
    if (form?.state_code) {
      getCitiesByState(form?.state_code)
    }
  }, [form?.state_code])

  useEffect(() => {
    if (form?.city_code) {
      getLocalityByCity(form?.city_code)
    }
  }, [form?.city_code])

  useEffect(() => {
    if (!form.project_listing_name) {
      const ptitle = `${propertyTypee} ${subPtype} Space Is Available ${saleORrent} in ${locality} ${city}`;
      if (propertyTypee != '' && subPtype != ('' && undefined) && location != '' && city != '') {
        setProjectTitle(ptitle);
      } else {
        setProjectTitle('')
      }
      setForm(prev => ({ ...prev, ['project_listing_name']: projectTitle }))
    }
  }, [propertyTypee, subPtype, saleORrent, locality, city])


  return (
    <div>
      {loading && <Loader />}
      <div className='card'>
        <div className='card-header'>
          <h4 className='card-title'>Project Type</h4>
        </div>
        <div className='card-body'>
          <div className="row mb-3">
            <div className="col">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="property_type_id"
                  onChange={handleChange}
                  id="property_type_id"
                  value={form.property_type_id || ''}
                >
                  <option value="default">select Project Type</option>
                  {projectType.map((project, index) => (
                    <option key={index} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="property_type_id" className="fw-normal">
                  Select Project type <span className='req'>*</span>
                </label>
                {formError.property_type_id && <p className="err">{formError.property_type_id}</p>}
              </div>
            </div>

            <div className="col">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="property_sub_type_id"
                  id="property_sub_type_id"
                  required
                  onChange={handleChange}
                  value={form.property_sub_type_id || ''}>
                  <option value="default">select sub project type</option>
                  {subProjectType.map((subProject, index) => (
                    <option key={index} value={subProject.id}>
                      {subProject.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="property_sub_type_id" className="fw-normal">
                  Select sub project type <span className='req'>*</span>
                </label>
                {formError.property_sub_type_id && (
                  <p className="err">{formError.property_sub_type_id}</p>
                )}
              </div>
            </div>
          </div>
          {form.property_type_id == 9 &&
            <div className="row mb-3">
              <div className="col-1">
                <input type="radio" id="sale" name="sale" onChange={handleForTypeChage} checked={isSale} />
                <label htmlFor="sale" className="ms-1">
                  For Sale
                </label>
              </div>

              <div className="col-2">
                <input type="radio" id="rent" name="rent" onChange={handleForTypeChage} checked={isRent} />
                <label htmlFor="rent" className="ms-1">
                  For Rent
                </label>
              </div>
            </div>
          }

        </div>
      </div>

      <div className='card'>
        <div className='card-header'>
          <h4 className='card-title'>Project Location</h4>
        </div>
        <div className='card-body'>
          <div className="row mb-3">
            <div className="col">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="country_code"
                  id="country_code"
                  required
                  onChange={handleChange}
                  value={form.country_code || ''}>
                  <option value="default">Country</option>
                  {countries.map((country, index) => (
                    <option key={index + 1} value={country.country_code}>
                      {country.country_name}
                    </option>
                  ))}
                </select>
                <label htmlFor="country_code" className="fw-normal">
                  Select Country <span className='req'>*</span>
                </label>
                {formError.country_code && <p className="err">{formError.country_code}</p>}
              </div>
            </div>
            <div className="col">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="state_code"
                  id="state_code"
                  required
                  value={form?.state_code || ''}
                  onChange={handleChange}
                >
                  <option value="default">State</option>
                  {states.map((state, index) => (
                    <option key={index} value={state.state_code}>
                      {state.state_name}
                    </option>
                  ))}
                </select>
                <label htmlFor="state_code" className="fw-normal">
                  Select State <span className='req'>*</span>
                </label>
                {formError.state_code && <p className="err">{formError.state_code}</p>}
              </div>
            </div>
            <div className="col">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="city_code"
                  id="city_code"
                  required
                  onChange={handleChange}
                  value={form?.city_code || ''}>
                  <option value="default">City / Town</option>
                  {cities.map((city, index) => (
                    <option key={index + 1} value={city.city_code}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
                <label htmlFor="city_code" className="fw-normal">
                  Select City <span className='req'>*</span>
                </label>
                {formError.city_code && <p className="err">{formError.city_code}</p>}
              </div>
            </div>

          </div>

          <div className="row mb-3">
            <div className="col">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="locality"
                  id="locality"
                  required
                  onChange={handleChange}
                  autoComplete="off"
                  value={form?.locality || ''}>
                  <option value="default">Locality</option>
                  {localities.map((locality, index) => (
                    <option key={index} value={locality.locality_name}>
                      {locality.locality_name}
                    </option>
                  ))}
                </select>
                <label htmlFor="locality" className="fw-normal">
                  Select Locality <span className='req'>*</span>
                </label>
                {formError.locality && <p className="err">{formError.locality}</p>}
              </div>
            </div>
            <div className="col">
              <div className="form-floating">
                <input
                  type="text"
                  id="subLocality"
                  className="form-control"
                  name="sub_locality"
                  placeholder="Enter Title"
                  onChange={handleChange}
                  value={form?.sub_locality || ''}
                />
                <label htmlFor="subLocality" className="fw-normal">
                  Select Sub Locality
                </label>
              </div>
            </div>
            <div className="col">
              <div className="form-floating">
                <input
                  type="text"
                  id="street_name"
                  className="form-control"
                  name="street_name"
                  placeholder="Enter Title"
                  onChange={handleChange}
                  value={form?.street_name || ''}
                />
                <label htmlFor="street_name" className="fw-normal">
                  Street Name
                </label>
              </div>
            </div>

          </div>
        </div>
      </div>


      <div className='card'>
        <div className='card-header'>
          <h4 className='card-title'>Project Name</h4>
        </div>
        <div className='card-body'>
          <div className="row mb-3">
            <div className="col-4">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="project_name_id"
                  id="project_name_id"
                  required
                  onChange={handleChange}
                  value={form?.project_name_id || ''}>
                  <option value="default">Select Project</option>
                  {filteredProjects.map((project, index) => (
                    <option key={index} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="project_name_id" className="fw-normal">
                  Select Project <span className='req'>*</span>
                </label>
                {formError.project_name_id && <p className="err">{formError.project_name_id}</p>}
              </div>
            </div>

            <div className="col-4">
              <div className="form-floating">
                <label htmlFor="builder_id" className="fw-normal builderclass">
                  Builder Name
                </label>
                {builder && <h6 className="builderNameCard nameCardh6">{builder && builder?.name}</h6>}
                <input type="hidden" name="builder_id" id="builder" />
              </div>
            </div>
            <div className="col-4">
              <h6> Can't find the project you're looking for?</h6>
              <button className="addit" onClick={() => setShow(true)}>
                Add it here!
              </button>
            </div>
          </div>

          <div className="row mb-3">
            <div className='col'>
              <div className="form-floating">
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  name="project_listing_name"
                  placeholder="Enter Title"
                  onChange={handleChange}
                  value={form.project_listing_name || ''}
                />
                <label htmlFor="title" className="fw-normal">
                  Title <span className='req'>*</span>
                </label>
                {formError.project_listing_name && (
                  <p className="err">{formError.project_listing_name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='btnParent'>
        <button className="btn customBtn" onClick={prevStep} disabled={currentStep === 0} >
          Previous
        </button>
        <button className="btn customBtn" onClick={handleSubmit}>
          Next
        </button>
      </div>

      <Offcanvas show={show} style={{ width: '50%' }} placement="end">
        <Offcanvas.Body>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Add Project Name</h3>
              <button className='bg-transparent' onClick={() => setShow(false)}>X</button>
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
                      value={projectNameForm?.name || ''}
                      onChange={handleProjectName}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Enter Project Name{' '}
                    </label>
                    {projectFormErr.name && <p className="err">{projectFormErr.name}</p>}
                  </div>
                </div>
                <div className="row">
                  <div className="col mb-3">
                    <select
                      className="form-select"
                      name="country_code"
                      value={projectNameForm?.country_code || ''}
                      onChange={handleProjectName}
                    >
                      <option value="default">Select Country</option>
                      {countries.map((country, index) => (
                        <option key={index} value={country.country_code}>
                          {country.country_name}
                        </option>
                      ))}
                    </select>
                    {projectFormErr.country_code && <p className="err">{projectFormErr.country_code}</p>}
                  </div>

                  <div className="col mb-3">
                    <select
                      className="form-select"
                      name="state_code"
                      value={projectNameForm?.state_code || ''}
                      onChange={handleProjectName}>
                      <option value="default">Select State</option>
                      {projectNameStates.map((state, index) => (
                        <option key={index} value={state.state_code}>
                          {state.state_name}
                        </option>
                      ))}
                    </select>
                    {projectFormErr.state_code && <p className="err">{projectFormErr.state_code}</p>}
                  </div>
                </div>
                <div className="row">
                  <div className="col mb-3">
                    <select
                      className="form-select"
                      name="city_code"
                      value={projectNameForm?.city_code || ''}
                      onChange={handleProjectName}
                    >
                      <option value="default">Select City</option>
                      {projectNameCities.map((city, index) => (
                        <option key={index} value={city.city_code}>
                          {city.city_name}
                        </option>
                      ))}
                    </select>
                    {projectFormErr.city_code && <p className="err">{projectFormErr.city_code}</p>}
                  </div>

                  <div className="col mb-3">
                    <select
                      className="form-select"
                      name="locality"
                      value={projectNameForm?.locality || ''}
                      onChange={handleProjectName}
                    >
                      <option value="default">Locality</option>
                      {localities.map((locality, index) => (
                        <option key={index} value={locality.locality_name}>
                          {locality.locality_name}
                        </option>
                      ))}
                    </select>
                    {projectFormErr.locality && <p className="err">{projectFormErr.locality}</p>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <select
                      className="form-select"
                      name="builder_id"
                      value={projectNameForm?.builder_id || ''}
                      onChange={handleProjectName}
                    >
                      <option value="default">Select Builder</option>
                      {builders.map((builder, index) => (
                        <option key={index} value={builder.id}>
                          {builder.name}
                        </option>
                      ))}
                    </select>
                    {projectFormErr.builder_id && <p className="err">{projectFormErr.builder_id}</p>}
                  </div>
                  <div className='mb-3 col-6 d-flex justify-content-center'>
                    <h6>Builder not listed?</h6>
                    <button type="button" className="add_builder" onClick={() => setModalPopup(true)}>
                      Add New Builder
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        id="project-type"
                        className="form-control"
                        name="email"
                        placeholder="Insert your firstname"
                        value={projectNameForm?.email || ''}
                        onChange={handleProjectName}
                      />
                      <label htmlFor="project-type" className="fw-normal">
                        Enter Email
                      </label>
                      {projectFormErr.email && <p className="err">{projectFormErr.email}</p>}
                    </div>
                  </div>

                  <div className="col mb-3">
                    <div className="form-floating">
                      <input
                        type="number"
                        id="project-type"
                        className="form-control"
                        name="mobile_number"
                        placeholder="Insert your firstname"
                        value={projectNameForm?.mobile_number || ''}
                        onChange={handleProjectName}
                      />
                      <label htmlFor="project-type" className="fw-normal">
                        Enter Mobile
                      </label>
                      {projectFormErr.mobile_number && <p className="err">{projectFormErr.mobile_number}</p>}
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-floating">
                    <AutoComplete latLong={getLatLongs} />
                  </div>
                </div>

                <div className="col-12">
                  <button className="btn btn-primary" type="button" onClick={handleSubmitAddProjectForm}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal show={showModal} size="xl">
        <Modal.Body>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Add Builder</h3>
            </div>
            <div className="card-body">
              <form className="custom-validation row">
                <div className="mb-3 col-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Builder Name"
                      value={builderForm?.name || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Enter Builder Name{' '}
                    </label>
                    {builderFormErr.name && <p className="err">{builderFormErr.name}</p>}
                  </div>
                </div>
                <div className="mb-3 col-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      name="headoffice_location"
                      placeholder="Head Office Location"
                      value={builderForm?.headoffice_location || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Head Office Location
                    </label>
                    {builderFormErr.headoffice_location && (
                      <p className="err">{builderFormErr.headoffice_location}</p>
                    )}
                  </div>
                </div>
                <div className="mb-3 col-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      name="md_name"
                      placeholder="Enter MD Name"
                      value={builderForm?.md_name || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Enter MD Name
                    </label>
                    {builderFormErr.md_name && <p className="err">{builderFormErr.md_name}</p>}
                  </div>
                </div>
                <div className="mb-3 col-6">
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      name="md_phone_number"
                      placeholder="MD Phone Number"
                      value={builderForm?.md_phone_number || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Enter Phone Number
                    </label>
                    {builderFormErr.md_phone_number && (
                      <p className="err">{builderFormErr.md_phone_number}</p>
                    )}
                  </div>
                </div>
                <div className="mb-3 col-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      name="cp_manager_name"
                      placeholder="CP Manager Name"
                      value={builderForm?.cp_manager_name || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Channel Partner Manager Name
                    </label>
                    {builderFormErr.cp_manager_name && (
                      <p className="err">{builderFormErr.cp_manager_name}</p>
                    )}
                  </div>
                </div>
                <div className="mb-3 col-6">
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      name="cp_manager_phone_number"
                      placeholder="Phone Number"
                      value={builderForm?.cp_manager_phone_number || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Enter Phone Number
                    </label>
                    {builderFormErr.cp_manager_phone_number && (
                      <p className="err">{builderFormErr.cp_manager_phone_number}</p>
                    )}
                  </div>
                </div>
                <div className="mb-3 col-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      name="sales_manager_name"
                      placeholder="Sales manager Name"
                      value={builderForm?.sales_manager_name || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Sales manager Name
                    </label>
                    {/* {builderFormErr.sales_manager_name && (
                      <p className="err">{builderFormErr.sales_manager_name}</p>
                    )} */}
                  </div>
                </div>
                <div className="mb-3 col-6">
                  <div className="form-floating">
                    <input
                      type="number"
                      className="form-control"
                      name="sales_manager_phone_number"
                      placeholder="Phone Number"
                      value={builderForm?.sales_manager_phone_number || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Enter Phone Number
                    </label>
                    {/* {builderFormErr.sales_manager_phone_number && (
                      <p className="err">{builderFormErr.sales_manager_phone_number}</p>
                    )} */}
                  </div>
                </div>
                <div className="mb-3 col-6">
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      name="slug"
                      placeholder="URL"
                      value={builderForm?.slug || ''}
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Builder Website URL
                    </label>
                    {/* {builderFormErr.slug && <p className="err">{builderFormErr.slug}</p>} */}
                  </div>
                </div>
                <div className="mb-3 col-6">
                  <div className="form-floating">
                    <input
                      type="file"
                      id="build-logo"
                      className="form-control"
                      name="logo_path"
                      accept="image/*"
                      onChange={handleBuilderChange}
                    />
                    <label htmlFor="project-type" className="fw-normal">
                      Logo
                    </label>

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
    </div >
  );
};

export default StepOne;
