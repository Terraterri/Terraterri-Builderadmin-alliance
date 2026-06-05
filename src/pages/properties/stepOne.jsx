import React, { useState, useEffect, useContext } from 'react';
import Loader from '../../components/Loader';
import { masterClient, projectClient } from '../../utils/httpClient';
import { IpInfoContext } from '../../utils/context';
import { toastSuccess, toastError, toastWarning } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { setProject } from '../../store/slices/ProjectManagementSlice';
import Offcanvas from 'react-bootstrap/Offcanvas';
import AutoComplete from '../projects/components/AutoComplete';

const stepOne = ({
  setType,
  setSubType,
  subType,
  setIsRent,
  setIsSale,
  isRent,
  isSale,
  nextStep,
  prevStep,
  currentStep
}) => {
  const [loading, setLoading] = useState(false);
  const { ipInfo } = useContext(IpInfoContext);
  const [projects, setProjects] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [subProperty, setSubProperty] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [builder, setBuilder] = useState({});
  const [formBuiderErr, setFormBuilderErr] = useState({});
  const [formforBuilder, setBuilderForm] = useState({
    position: 1
  });
  const [showModal, setModalPopup] = useState(false);
  const [show, setShow] = useState(false);

  const [formError, setFormError] = useState({});
  const [formErr, setFormErr] = useState({});

  const dispatch = useDispatch();

  const formState = useSelector((state) => state.projectManagement['project']);

  const [form, setForm] = useState({
    listing_type_id: 2,
    isSale: true,
    isRent: false,
    ...formState
  });

  const handleForTypeChage = (e) => {
    if (e.target.name == 'sale') {
      setIsSale(true);
      setIsRent(false);
      setForm((prev) => ({ ...prev, isSale: true, isRent: false }));
    } else {
      setIsRent(true);
      setIsSale(false);
      setForm((prev) => ({ ...prev, isSale: false, isRent: true }));
    }
  };

  //get Property types
  const getPropertyTypes = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('propertytype');
      if (res?.data?.status) {
        setPropertyTypes(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  //get Property types
  const getSubPropertyTypes = async (Propid) => {
    setLoading(true);
    try {
      const res = await masterClient.get('propertysubtype');
      if (res.data?.status) {
        const data = await res?.data?.data?.filter((id) => id.property_type_id == Propid);
        if (!data.length) {
          toastError('No Sub Properties Type Found');
        }
        setSubProperty(data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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

  //   getAll Localities
  const getLocalityByCity = async (param) => {
    setLoading(true);
    try {
      const res = await masterClient.get(`locality/${param}`);
      if (res?.data?.status) {
        const sortedLocalities = res?.data?.data.sort((a, b) =>
          a.locality_name.localeCompare(b.locality_name)
        );
        setLocalities(sortedLocalities);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const getBuilderName = async (param) => {
    const project = projects.filter((name) => name.id == param);
    const builderId = project[0].builder_id;
    const latitude = project[0].latitude;
    const longitude = project[0].longitude;
    try {
      setLoading(true);
      const res = await masterClient.get(`builder/${builderId}`);
      if (res?.status === 200) {
        setBuilder(res?.data?.data);
        setForm((prev) => ({
          ...prev,
          builder_id: res?.data?.data?.id,
          latitude: latitude,
          longitude: longitude
        }));
      }
    } catch (error) {
      toastError(error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  //get Builders
  const getBuilders = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('builder');
      if (res?.data?.status) {
        setBuilders(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
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
      errors.slug = 'Please Enter Builder Websiste URL';
    }
    if (!formforBuilder.logo_path) {
      isFormValid = false;
      errors.logo_path = 'Please Choose Logo';
    }
    setFormBuilderErr(errors);
    return isFormValid;
  };

  //handle Builder Submit
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

  const getLatLongs = (data) => {
    setCordinates(data);
    setForm({ ...form, latitude: data.lat, longitude: data.lng });
  };

  const allCountries = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('country');
      if (res?.data?.status) {
        setCountries(res?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const getfilteredProjects = async (param) => {
    try {
      setLoading(true);
      const data = projects.filter((name) => name.locality == param);
      if (data.length) {
        setFilteredProjects(data);
      } else {
        setFilteredProjects([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const projectNames = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('projectname');
      if (res?.data?.status) {
        setProjects(res?.data?.data);
        setFilteredProjects(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // handleSubmitaddprojectForm
  const handleSubmitAddProjectForm = async () => {
    if (validateAddProjectForm()) {
      try {
        setLoading(true);
        const res = await masterClient.post('projectname', form);
        if (res?.data?.status) {
          const newProject = res?.data?.data;
          const newProjectId = newProject?.id;
          const newLocality = newProject?.locality;
          const newBuilderId = newProject?.builder_id;

          toastSuccess(res?.data?.message);
          setFormErr({});
          setShow(false);

          // Refresh full projects list and filtered projects for the dropdown
          const projectsRes = await masterClient.get('projectname');
          if (projectsRes?.data?.status) {
            const allProjects = projectsRes?.data?.data;
            setProjects(allProjects);
            const filtered = allProjects.filter((p) => p.locality == newLocality);
            setFilteredProjects(filtered);
          }

          // Auto-select the newly created project in the main form
          setForm((prev) => ({
            ...prev,
            project_name_id: newProjectId,
            locality: newLocality
          }));

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

  useEffect(() => {
    getPropertyTypes();
    allCountries();
    projectNames();
    if (form?.property_type_id !== undefined) {
      const val = form.property_type_id;
      getSubPropertyTypes(val);
    }
    if (form?.property_sub_type_id !== undefined) {
      console.log('form?.property_sub_type_id', form?.property_sub_type_id);
      setSubType(form?.property_sub_type_id);
    }
    getBuilders();
  }, []);

  const handleChange = async (e) => {

    const { name } = e.target;

    setForm((prev) => {
      const newState = { ...prev };

      // Toggle the selected radio button
      if (name === 'sale') {
        newState.sale = !prev.sale;
        newState.rent = false;
      } else if (name === 'rent') {
        newState.rent = !prev.rent;
        newState.sale = false;
      } else {
        setForm((prev) => ({ ...prev, [name]: e.target.value }));
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

      return newState;
    });


    if (e.target.name == 'property_type_id') {
      getSubPropertyTypes(e.target.value);
      setType(e.target.value);

    }
    if (e.target.name == 'property_sub_type_id') {
      setSubType(e.target.value);
    }
    if (e.target.name == 'project_name_id') {
      getBuilderName(e.target.value);
      getProjectByProjectName(e.target.value)
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
  };

  useEffect(() => {
    getPropertyTypes();
    allCountries();
    projectNames();
    if (form?.property_type_id !== undefined) {
      const val = form.property_type_id;
      getSubPropertyTypes(val);
    }
    if (form?.country_code !== undefined) {
      getStatesByCountry(form?.country_code);
    }
    if (form?.state_code !== undefined) {
      getCitiesByState(form?.state_code);
    }
    if (form?.city_code !== undefined) {
      getLocalityByCity(form?.city_code);
    }
  }, [formState]);

  useEffect(() => {
    setForm((prevState) => ({
      ...prevState,
      ...formState
    }));
  }, [formState]);


  const validate = () => {
    let isValid = true;
    const error = {};
    if (!form.project_listing_name) {
      error.project_listing_name = 'Title is required';
      isValid = false;
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
    if (subType != '53' &&
      subType != '52' &&
      subType != '56' &&
      subType != '57' &&
      subType != '48' &&
      subType != '58' && !form.project_name_id) {
      error.project_name_id = 'Project Name is required';
      isValid = false;

    }
    setFormError(error);
    return isValid;
  };


  const handleSubmit = async () => {
    if (validate()) {
      dispatch(setProject(form));
      nextStep();
    }
    else {
      console.log(formError)
    }
  };

  const getProjectByProjectName = async (id) => {
    setLoading(true)
    try {
      let res = await projectClient.get(`projectbyname/${id}`)
      if (res?.data?.status) {
        const projectData = res?.data?.data;
        const formObject = {
          approval_authority: projectData?.approval_authority,
          approval_number: projectData?.approval_number,
          approval_year: projectData?.approval_year,
          approval_document_path: projectData?.approval_document_path,
          real_estate_authority: projectData?.real_estate_authority,
          real_estate_approval_number: projectData?.real_estate_approval_number,
          real_estate_approval_year: projectData?.real_estate_approval_year,
          real_estate_approval_document_path: projectData?.real_estate_approval_document_path,
          total_project_land_area: projectData?.total_project_land_area,
          total_project_land_area_size_id: projectData?.total_project_land_area_size_id,
          totalNumberOfBlocks: projectData?.totalNumberOfBlocks,
          numberOfFlooorsBlocks: projectData?.numberOfFlooorsBlocks,
          numberOfUnitsBlocks: projectData?.numberOfUnitsBlocks,
          totalNumberOfUnits: projectData?.totalNumberOfUnits,
          community_type_id: projectData?.community_type_id,
          project_layout_document_path: projectData?.project_layout_document_path,
          project_description: projectData?.project_description,
          property_size_representation_id: projectData?.property_size_representation_id,
          sizeRepresentation: projectData?.sizeRepresentation,
          id: projectData?.id
        }
        setForm((prev) => ({
          ...prev,
          ...formObject
        }))
      }
    } catch (err) {
      console.log('error =====>', err);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('form =====>', form);

  }, [form])

  return (
    <>
      {loading && <Loader />}
      <div>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Title & Type</h3>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <div className="form-floating">
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  onChange={handleChange}
                  placeholder="Enter Title"
                  name="project_listing_name"
                  required
                  value={form.project_listing_name || ''}
                />
                <label htmlFor="title" className="fw-normal">
                  Title
                </label>
                {formError.project_listing_name && (
                  <p className="err">{formError.project_listing_name}</p>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-2">
                <input
                  type="radio"
                  id="sale"
                  name="sale"
                  onChange={handleForTypeChage}
                  checked={isSale}
                />
                <label htmlFor="sale" className="ms-1">
                  For Sale
                </label>
              </div>

              <div className="col-2">
                <input
                  type="radio"
                  id="rent"
                  name="rent"
                  onChange={handleForTypeChage}
                  checked={isRent}
                />
                <label htmlFor="rent" className="ms-1">
                  For Rent
                </label>
              </div>

              <div className="col-4">
                <div className="form-floating">
                  <select
                    className="form-select"
                    name="property_type_id"
                    onChange={handleChange}
                    id="property_type_id"
                    value={form.property_type_id || ''}>
                    <option value="default">select Property Type</option>
                    {propertyTypes.map((property, index) => (
                      <option key={index} value={property.id}>
                        {property.name}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="property_type_id" className="fw-normal">
                    Select Property type
                  </label>
                  {formError.property_type_id && <p className="err">{formError.property_type_id}</p>}
                </div>
              </div>

              <div className="col-4">
                <div className="form-floating">
                  <select
                    className="form-select"
                    name="property_sub_type_id"
                    id="property_sub_type_id"
                    required
                    onChange={handleChange}
                    value={form.property_sub_type_id || ''}>
                    <option value="default">Sub property type</option>
                    {subProperty.map((subproperty, index) => (
                      <option key={index} value={subproperty.id}>
                        {subproperty.name}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="property_sub_type_id" className="fw-normal">
                    Select Sub property type
                  </label>
                  {formError.property_sub_type_id && (
                    <p className="err">{formError.property_sub_type_id}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Project Location</h4>
          </div>
          <div className="card-body">
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
                    Select Country
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
                    onChange={handleChange}
                    value={form?.state_code || ''}>
                    <option value="default">State</option>
                    {states.map((state, index) => (
                      <option key={index} value={state.state_code}>
                        {state.state_name}
                      </option>
                    ))}
                  </select>
                  <label htmlFor="state_code" className="fw-normal">
                    Select State
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
                    Select City
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
                    Select Locality
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

        {subType != '53' &&
          subType != '52' &&
          subType != '56' &&
          subType != '57' &&
          subType != '48' &&
          subType != '58' && (
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Project Name</h4>
              </div>
              <div className="card-body">
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
                        Select Project
                      </label>
                      {formError.project_name_id && (
                        <p className="err">{formError.project_name_id}</p>
                      )}
                    </div>
                  </div>

                  <div className="col-4">
                    <div className="form-floating">
                      <label htmlFor="builder_id" className="fw-normal builderclass">
                        Builder Name
                      </label>
                      {builder && (
                        <h6 className="builderNameCard nameCardh6">{builder && builder?.name}</h6>
                      )}
                      <input type="hidden" name="builder_id" id="builder" />
                    </div>
                  </div>
                  <div className="col-4">
                    <h6> Can't find the project you're looking for?</h6>
                    <button className="addit" onClick={() => setShow(true)}>
                      Add it here!
                    </button>
                  </div>

                  {/* <div>Builder Name</div> */}
                  <Offcanvas
                    show={show}
                    style={{ width: '50%' }}
                    onHide={() => setShow(false)}
                    placement="end">
                    <Offcanvas.Header closeButton></Offcanvas.Header>
                    <Offcanvas.Body>
                      <div className="card">
                        <div className="card-header">
                          <h3 className="card-title">Add Project Name</h3>
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
                                <label htmlFor="project-type" className="fw-normal">
                                  Enter Project Name{' '}
                                </label>
                                {formErr.name && <p className="err">{formErr.name}</p>}
                              </div>
                            </div>
                            <div class="row">
                              <div className="col mb-3">
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
                                {formErr.country_code && (
                                  <p className="err">{formErr.country_code}</p>
                                )}
                              </div>
                              <div className="col mb-3">
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
                            <div class="row">
                              <div className="col mb-3">
                                <select
                                  className="form-select"
                                  name="city_code"
                                  value={form?.city_code || ''}
                                  onChange={handleChange}>
                                  <option value="default">Select City</option>
                                  {cities.map((city, index) => (
                                    <option key={index} value={city.city_code}>
                                      {city.city_name}
                                    </option>
                                  ))}
                                </select>
                                {formErr.city_code && <p className="err">{formErr.city_code}</p>}
                              </div>
                              <div className="col mb-3">
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
                            <div class="row">
                              <div className="col-6 mb-3">
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
                              <div className="mb-3 col-6 d-flex justify-content-center">
                                <h6>Builder not listed?</h6>
                                <button
                                  type="button"
                                  className="add_builder"
                                  onClick={() => setModalPopup(true)}>
                                  Add New Builder
                                </button>
                              </div>
                            </div>
                            <div class="row">
                              <div className="col mb-3">
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
                                  <label htmlFor="project-type" className="fw-normal">
                                    Enter Email
                                  </label>
                                  {formErr.email && <p className="err">{formErr.email}</p>}
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
                                    value={form?.mobile_number || ''}
                                    onChange={handleChange}
                                  />
                                  <label htmlFor="project-type" className="fw-normal">
                                    Enter Mobile
                                  </label>
                                  {formErr.mobile_number && (
                                    <p className="err">{formErr.mobile_number}</p>
                                  )}
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
                              <button
                                className="btn btn-primary"
                                type="button"
                                onClick={handleSubmitAddProjectForm}>
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
          )}
        <div className="btnParent">
          <button className="btn customBtn" onClick={prevStep} disabled={currentStep === 0}>
            Previous
          </button>
          <button className="btn customBtn" onClick={handleSubmit}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default stepOne;
