import React, { useState, useEffect } from 'react';
import { FaRegEdit } from "react-icons/fa";
import Loader from '../components/Loader';
import Modal from 'react-bootstrap/Modal';
import { expoAdminClient, expoApiClient } from '../utils/httpClient';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { toastError, toastSuccess, toastWarning } from '../utils/toast';
import { handleImages3 } from '../utils/S3Handler';
import { handleImageGcs, handleBrochureGcs } from '../utils/GcsHandler';
import { useNavigate } from 'react-router';
import { ModalBody } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import { IoCloseSharp } from "react-icons/io5";
const StallManagement = () => {
  const [inputLocalities, setInputLocalities] = useState([]);
  const userData = useSelector(state => state.user.userData);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [isTeamEdiTable, setIsTeamEdiTable] = useState(false);
  const [isInteriorEdiTable, setIsInteriorEdiTable] = useState(false);
  const [isExteriorEditTable, setIsExteriorEditTable] = useState(false);
  const [form, setForm] = useState({
    categories: [{
      category: "",
      city: "",
      locality: []
    }],
    Builder: {},
    Manager: {},
    Executive: [],
    projects: [
      {
        project_title: "",
        brochure_url: "",
        brochure_images: []
      }
    ]
  });

  const [brochureImages, setBrochureImages] = useState([]);
  const [formError, setFormError] = useState({});

  const handleTeamEdit = () => setIsTeamEdiTable(!isTeamEdiTable);
  const handleIntiriorEdit = () => setIsInteriorEdiTable(!isInteriorEdiTable);
  const handleExteriorEdit = () => setIsExteriorEditTable(!isExteriorEditTable);


  const getStallInfo = async () => {
    try {
      setLoading(true);
      const response = await expoApiClient.get(`/createStall/getStallInfo.php?id=${id}`);
      const response2 = await expoApiClient.get(`/categories/getByStall.php?stallInfoId=${id}`);
      if (response?.data?.status && response?.data?.status) {
        if (response2?.data?.data.length > 0) {
          setForm(() => ({
            ...response.data.data[0],
            ...response2?.data?.data?.[0]
          }))
        } else {
          setForm(() => ({
            ...response.data.data[0],
            categories: [{
              category: "",
              city: "",
              locality: []
            }]
          }))
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { getStallInfo() }, []);

  const handleForm = async (e, idx = null) => {
    const { name, value, id } = e.target;


    setForm((prev) => {
      const updatedForm = { ...prev };
      if (id == 'Builder') {

        updatedForm.Builder = {
          ...updatedForm.Builder,
          [name]: value
        };
      } else if (id == 'Manager') {
        updatedForm.Manager = {
          ...updatedForm.Manager,
          [name]: value
        };
      } else if (id.startsWith('Executive')) {
        const index = parseInt(id.split('-')[1], 10) - 1;
        const tableNo = id.split('-')[1];
        const updatedExecutives = [...updatedForm.Executive];

        updatedExecutives[index] = {
          ...updatedExecutives[index],
          [name]: value,
          tableNo: tableNo
        };

        updatedForm.Executive = updatedExecutives;
      } else if (id == 'Project') {
        const updatedProjects = [...updatedForm.projects];
        updatedProjects[idx] = {
          ...updatedProjects[idx],
          [name]: value,
        };
        updatedForm.projects = updatedProjects;
      } else if (id === 'category') {
        setForm((prev) => ({
          ...prev,
          categories: prev.categories.map((category, i) =>
            i == idx
              ? { ...category, [name]: value }
              : category
          )
        }));
      }

      return updatedForm;
    });
  }

  const handleBrochure = async (e, index) => {
    setLoading(true)
    let resFromMiddleware = await handleBrochureGcs(e);
    setLoading(false);
    if (resFromMiddleware.clientStatus) {
      if (index !== undefined) {
        setForm((prevState) => ({
          ...prevState,
          projects: prevState.projects.map((project, i) =>
            i == index
              ? {
                ...project,
                brochure_images: resFromMiddleware.data?.pdf_image_urls,
              }
              : project
          )
        }));
      }
    } else {
      toastError(resFromMiddleware.data);
    }
  }


  const handleImage = async (e, index) => {
    setLoading(true);
    let resFromMiddleware = await handleImageGcs(e);
    setLoading(false);
    if (resFromMiddleware.clientStatus) {
      if (index !== undefined) {
        if (e.target.name === 'brochure_url') {
          setForm((prevState) => ({
            ...prevState,
            projects: prevState.projects.map((project, i) =>
              i == index
                ? { ...project, [e.target.name]: resFromMiddleware.data.url }
                : project
            )
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            projects: prev.projects.map((project, i) =>
              i == index
                ? { ...project, [e.target.name]: resFromMiddleware.data.url }
                : project
            )
          }));
        }
      } else {
        setForm((prev) => ({
          ...prev,
          [e.target.name]: resFromMiddleware.data.url
        }));
      }
    } else {
      toastError(resFromMiddleware.data);
    }
  };

  const handleVideos3 = async (e, index) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append('video', e.target.files[0]);
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization:
            `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJudW1iZXIiOiI5MDYzNzU0MzIxIiwiaWF0IjoxNzMxNDc2MzYxLCJuYmYiOjE3MzE0NzYzNjEsImV4cCI6MTczMTU2Mjc2MX0.jfahNBh_28ap4VGQCVVu63QR0aJGxvAI9l391lqL82U` ||
            null,
          'Content-Type': 'multipart/form-data'
        }
      };
      let res = await expoAdminClient.post('videoConfig/upload_to_gcs.php', formData, config);
      if (res?.data) {

        if (index !== undefined) {
          console.log('from index', e.target.name, res?.data?.url);
          setForm((prev) => ({
            ...prev,
            projects: prev.projects.map((project, i) =>
              i == index
                ? { ...project, [e.target.name]: res?.data?.url }
                : project
            )
          }));
        } else {
          console.log(e.target.name, res?.data?.url);
          setForm((prev) => ({
            ...prev,
            [e.target.name]: res?.data?.url
          }));
        }

      }
    } catch (error) {
      console.log(error);
      alert('error uploading Video');
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    let isValid = true;
    const errors = {};

    // Validate builder details
    if (!form.Builder.name) {
      errors.builderName = "Builder Name is required";
      isValid = false;
    }
    if (!form.Builder.phone) {
      errors.builderPhone = "Builder Phone is required";
      isValid = false;
    }

    // Validate manager details
    if (!form.Manager.name) {
      errors.managerName = "Manager Name is required";
      isValid = false;
    }
    if (!form.Manager.phone) {
      errors.managerPhone = "Manager Phone is required";
      isValid = false;
    }

    // Validate banners and videos
    const requiredFields = ["StallInteriorVideo1", "StallInteriorVideo2", "bannerOne", "bannerTwo", "bannerThree", "bannerFour", "bannerFive", "bannerSix", "logoVideo", "logo", "builderName", "posterOne", "posterTwo", "exteriorVideo1", "exteriorVideo2"];
    requiredFields.forEach((field) => {
      if (!form[field]) {
        errors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    // validate categories
    errors.categories = form.categories.map((cat) => {
      let categoryErrors = {};
      if (!cat.category) {
        categoryErrors.category = "Category is required"
        isValid = false;
      }
      if (!cat.city) {
        categoryErrors.city = "City is required"
        isValid = false;
      }
      if (!cat.locality.length > 0) {
        categoryErrors.locality = "locality is required"
        isValid = false;
      }
      return categoryErrors
    })

    // Validate projects
    errors.projects = form.projects.map((project, index) => {
      let projectErrors = {};

      if (!project.project_title) {
        projectErrors.project_title = "Project title is required";
        isValid = false;
      }
      if (!project.brochure_images) {
        projectErrors.brochure_images = "Brochure URL is required";
        isValid = false;
      }
      return projectErrors;
    });

    setFormError(errors);
    console.log(errors)
    return isValid;
  }

  const handleSubmit = async (e) => {
    if (validate()) {
      const payload = {
        ...form,
        builderNameText: userData?.company_name
      }
      setLoading(true);
      e.preventDefault();
      try {
        const response = await expoApiClient.post('/createStall/updateStall.php', payload);
        if (response?.data?.status) {
          updateCategories();
        } else {
          toastError('Failed to update')
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      toastError('Please Enter Mandatory fields');
    }
  }

  const updateCategories = async () => {
    setLoading(true);
    const payload = {
      categories: form.categories,
      expoUnqCode: form.expoUnqCode,
      stallInfoId: id,
      stallCode: form.stallCode,
      builderName: userData?.company_name
    }
    try {
      const response = await expoApiClient.post('/categories/update.php', payload);
      if (response?.data?.status) {
        toastSuccess('Stall Updated Successfully');
        navigate('/expo/future');
      } else {
        toastError('Failed to update')
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const addProject = () => {
    if (form.projects.length < 6) {
      setForm((prevForm) => ({
        ...prevForm,
        projects: [...prevForm.projects, {
          brochure_images: [],
          project_title: "",
        }]
      }));
    } else {
      toastError("Projects Length exceeded")
    }
  }

  const removeProject = async (project_id, index) => {
    setLoading(true);
    try {
      const res = await expoApiClient.get(`createStall/deleteProject.php?project_id=${project_id}`)
      if (res?.data?.status) {
        setForm((prevForm) => ({
          ...prevForm,
          projects: prevForm.projects.filter((_, i) => i !== index)
        }));
      }
    } catch (error) {
      console.log('error =>', error)
    } finally {
      setLoading(false)
    }
  }

  const openBrochure = (brochureImgs) => {
    setShow(true);
    setBrochureImages(brochureImgs)
  }

  const deleteBrochure = async (project_id, index) => {
    setLoading(true);
    try {
      const res = await expoApiClient.get(`createStall/deleteBrochure.php?project_id=${project_id}`)
      if (res?.data?.status) {
        setForm((prevForm) => {
          const updatedProjects = [...prevForm.projects];
          updatedProjects[index].brochure_images = [];
          return {
            ...prevForm,
            projects: updatedProjects,
          };
        });
      }
    } catch (error) {
      console.log('error =>', error)
    } finally {
      setLoading(false)
    }

  };

  const handleLocalityInputChange = (e, index) => {
    const updated = [...inputLocalities];
    updated[index] = e.target.value;
    setInputLocalities(updated);
  };


  const addCategory = () => {
    const lastCategory = form.categories[form.categories.length - 1];

    // Simple validation checks
    const isValid =
      lastCategory.category.trim() !== "" &&
      lastCategory.city.trim() !== "" &&
      Array.isArray(lastCategory.locality) &&
      lastCategory.locality.length > 0;

    if (!isValid) {
      toastError("Please fill the previous category completely before adding a new one.");
      return;
    }

    if (form.categories.length < 4) {
      setForm((prevForm) => ({
        ...prevForm,
        categories: [
          ...prevForm.categories,
          {
            category: "",
            city: "",
            locality: []
          }
        ]
      }));
      setInputLocalities((prev) => [...prev, ""]);
    } else {
      toastError("Categories limit exceeded");
    }
  };


  const removeCategory = (index) => {
    setForm((prevForm) => ({
      ...prevForm,
      categories: prevForm.categories.filter((_, i) => i !== index)
    }));
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' && e.target.value !== '') {
      if (form?.categories?.[index]?.locality.length < 4) {
        setForm((prev) => ({
          ...prev,
          categories: prev.categories.map((category, i) =>
            i == index
              ? { ...category, [e.target.name]: [...category.locality, { id: null, name: e.target.value }] }
              : category
          )
        }));
        const updated = [...inputLocalities];
        updated[index] = '';
        setInputLocalities(updated);
      } else {
        toastWarning("Localities Limit Reached")
      }
    }
  }

  const removeLocality = (categoryIndex, locIndex) => {
    setForm((prevForm) => ({
      ...prevForm,
      categories: prevForm.categories.map((category, i) =>
        i === categoryIndex
          ? {
            ...category,
            locality: category.locality.filter((_, idx) => idx !== locIndex),
          }
          : category
      )
    }));
  };

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
                        <a href="/">Home</a>
                      </li>
                      <li className="breadcrumb-item active">Add Executive</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="cardd daimnd-stall">
              <h2 className='mb-0'>Daimond Stall</h2>
              <div className="stall-gap">
                <div className="stal-ent">
                  <div className="col-md-12">
                    <h5>Categories</h5>
                  </div>
                </div>
                {form?.categories.map((category, i) =>
                  <div className="row mb-3 d-flex align-items-end" key={i}>
                    <div className="col-md-3">
                      <h6 className="BuildNameCom mb-2">Category  {i + 1}:</h6>
                      <select
                        className="form-select"
                        aria-label="Default select example"
                        id='category'
                        name="category"
                        value={category.category || ""}
                        onChange={(e) => handleForm(e, i)}
                      >
                        <option value="defalut">Select</option>
                        <option value="Apartment">Apartments</option>
                        <option value="Villas">Villas</option>
                        <option value="Open Plots">Open Plots</option>
                        <option value="Commertial Spaces">Commertial Spaces</option>
                        <option value="Farm Plots">Farm Plots</option>
                      </select>
                      {formError.categories?.[i]?.category && <span className="text-danger">{formError.categories?.[i]?.category}</span>}
                    </div>
                    <div className="col-md-3">
                      <h6 className="BuildNameCom mb-2">City :</h6>
                      <input
                        type='text'
                        className="form-control"
                        placeholder='city'
                        id='category'
                        name="city"
                        value={category.city || ""}
                        onChange={(e) => handleForm(e, i)}
                      />
                      {formError.categories?.[i]?.city && <span className="text-danger">{formError.categories?.[i].city}</span>}
                    </div>
                    <div className="col-md-3">
                      <h6 className="BuildNameCom mb-2">Locality :</h6>
                      <input
                        type='text'
                        className="form-control"
                        placeholder='locality'
                        id='category'
                        name="locality"
                        value={inputLocalities[i] || ""}
                        onChange={(e) => handleLocalityInputChange(e, i)}
                        onKeyDown={(e) => handleKeyDown(e, i)}
                      />
                      {formError.locality && <p className="err">{formError.locality}</p>}
                      {formError.categories?.[i]?.locality && <span className="text-danger">{formError?.categories?.[i].locality}</span>}
                    </div>
                    <div className="col-md-2 d-flex asign_lists">
                      {form?.categories?.[i]?.locality.map((loc, idx) =>
                        <h6 key={idx}>{loc.name}
                          <IoCloseSharp onClick={() => removeLocality(i, idx)} /> </h6>
                      )}
                    </div>
                    {form?.categories.length - 1 === i &&
                      <div className="col-md-3 d-flex mt-3">
                        <button onClick={addCategory} className='btn btn-primary'>Add</button>
                        {form?.categories?.length > 1 &&
                          <button onClick={() => removeCategory(i)} className='btn btn-warning'>remove</button>
                        }
                      </div>
                    }
                  </div>
                )}
              </div>

              <div className='stall-gapp'>
                <div className='stal-ent'>
                  <div className="col-md-12">
                    <h5>Builder Team</h5>
                    <FaRegEdit onClick={handleTeamEdit} />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5 className='mt-2'>Builder</h5>
                  </div>
                  <div className="col-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        className={`form-control ${!isTeamEdiTable ? 'err' : ''} `}
                        placeholder=''
                        id="Builder"
                        name="name"
                        value={form.Builder.name || ''}
                        onChange={handleForm}
                        disabled={!isTeamEdiTable}
                      />
                      {formError.builderName && <p className="err">{formError.builderName}</p>}
                      <label htmlFor="builder" className="fw-normal">
                        Name
                      </label>
                    </div>
                  </div>

                  <div className="col-4 mb-3">
                    <div className="form-floating">
                      <input
                        type="number"
                        className={`form-control ${!isTeamEdiTable ? 'err' : ''} `}
                        placeholder=""
                        id="Builder"
                        name="phone"
                        value={form.Builder.phone || ''}
                        onChange={handleForm}
                        disabled={!isTeamEdiTable}
                      />
                      {formError.builderPhone && <p className="err">{formError.builderPhone}</p>}
                      <label htmlFor="Builder" className="fw-normal">
                        Phone Number
                      </label>
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5 className='mt-2'>Manager</h5>
                  </div>
                  <div className="col-4 mb-3">
                    <div className='Editdata'>
                      <h4>Mohan Reddy</h4>
                    </div>
                    <div className="form-floating">
                      <input
                        type="text"
                        className={`form-control ${!isTeamEdiTable ? 'err' : ''} `}
                        placeholder=""
                        id="Manager"
                        name="name"
                        value={form.Manager.name || ''}
                        onChange={handleForm}
                        disabled={!isTeamEdiTable}
                      />
                      {formError.managerName && <p className="err">{formError.managerName}</p>}
                      <label htmlFor="Manager" className="fw-normal">Name</label>
                    </div>
                  </div>
                  <div className="col-4 mb-3">
                    <div className='Editdata'>
                      <h4>Mohan Reddy</h4>
                    </div>
                    <div className="form-floating">
                      <input
                        type="number"
                        className={`form-control ${!isTeamEdiTable ? 'err' : ''} `}
                        placeholder=""
                        id="Manager"
                        name="phone"
                        value={form.Manager.phone || ''}
                        onChange={handleForm}
                        disabled={!isTeamEdiTable}
                      />
                      {formError.managerPhone && <p className="err">{formError.managerPhone}</p>}
                      <label htmlFor="total-no-of-floor-blocks" className="fw-normal">Phone Number</label>
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5 className='mt-2'>Executives</h5>
                  </div>
                  {[...Array(form.Executive.length || 0)].map((_, index) => (
                    <div className="row mb-3" key={index}>
                      <div className="col-md-12">
                        <h4>Executive {index + 1}</h4>
                      </div>
                      <div className="col-md-4">
                        <h6 className="BuildNameCom mb-2">Name :</h6>
                        <input
                          type="text"
                          className={`form-control ${!isTeamEdiTable ? 'err' : ''} `}
                          placeholder="Executive Name"
                          id={`Executive-${index + 1}`}
                          name="name"
                          value={form.Executive[index]?.name || ''}
                          onChange={handleForm}
                          disabled={!isTeamEdiTable}
                        />
                      </div>

                      <div className="col-md-4">
                        <h6 className="BuildNameCom mb-2">Phone Number :</h6>
                        <input
                          type="text"
                          className={`form-control ${!isTeamEdiTable ? 'err' : ''} `}
                          placeholder="Executive Phone Number"
                          id={`Executive-${index + 1}`}
                          name="phone"
                          value={form.Executive[index]?.phone || ''}
                          onChange={handleForm}
                          disabled={!isTeamEdiTable}
                        />
                      </div>
                    </div>
                  ))}


                  <div className="stal-ent">
                    <div className="col-md-12">
                      <h5>Stall Interior</h5>
                      <FaRegEdit onClick={handleIntiriorEdit} />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-12">
                      <h5 className="mt-0">Video Screens</h5>
                    </div>

                    <div className="col-md-4">
                      <h6 className="BuildNameCom mb-2">Video 1</h6>
                      {isInteriorEdiTable &&
                        <input
                          type="file"
                          className={`form-control ${!isTeamEdiTable ? 'err' : ''} `}
                          name="StallInteriorVideo1"
                          accept="video/*"
                          onChange={handleVideos3}
                        />
                      }
                      {formError.StallInteriorVideo1 && <p className="err">{formError.StallInteriorVideo1}</p>}

                      {form?.StallInteriorVideo1 !== undefined &&
                        <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                          <source src={form.StallInteriorVideo1} type="video/mp4" />
                          <track
                            src={form.StallInteriorVideo1}
                            kind="subtitles"
                            srcLang="en"
                            label="English"
                          />
                        </video>
                      }
                    </div>

                    <div className="col-md-4">
                      <h6 className="BuildNameCom mb-2">Video 2</h6>
                      {isInteriorEdiTable &&
                        <input
                          type="file"
                          className="form-control"
                          name="StallInteriorVideo2"
                          accept="video/*"
                          onChange={handleVideos3}
                        />
                      }
                      {formError.StallInteriorVideo2 && <p className="err">{formError.StallInteriorVideo2}</p>}

                      {form?.StallInteriorVideo2 !== undefined &&
                        <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                          <source src={form?.StallInteriorVideo2} type="video/mp4" />
                          <track
                            src={form?.StallInteriorVideo2}
                            kind="subtitles"
                            srcLang="en"
                            label="English"
                          />
                        </video>
                      }
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-12">
                      <h5 className="mt-0">Poster/Banners</h5>
                    </div>

                    <div className="col-md-4 mb-4">
                      <div className="row">
                        <h6 className="BuildNameCom mb-2">Banner 1</h6>
                        {isInteriorEdiTable &&
                          <div className="col-md-9">
                            <input
                              type="file"
                              className="form-control"
                              name="bannerOne"
                              accept="image/*"
                              onChange={handleImage}
                            />
                          </div>
                        }
                        {formError.bannerOne && <p className="err">{formError.bannerOne}</p>}
                        {form.bannerOne !== undefined &&
                          <div className="col-md-3">
                            <span className="upld_imgg">
                              {' '}
                              <img src={form.bannerOne} />
                            </span>
                          </div>
                        }

                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="row">
                        <h6 className="BuildNameCom mb-2">Banner 2</h6>
                        {isInteriorEdiTable &&
                          <div className="col-md-9">
                            <input
                              type="file"
                              className="form-control"
                              name="bannerTwo"
                              accept="image/*"
                              onChange={handleImage}
                            />
                          </div>
                        }
                        {formError.bannerTwo && <p className="err">{formError.bannerTwo}</p>}
                        {form.bannerTwo !== undefined &&
                          <div className="col-md-3">
                            <span className="upld_imgg">
                              {' '}
                              <img src={form.bannerTwo} />
                            </span>
                          </div>
                        }
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="row">
                        <h6 className="BuildNameCom mb-2">Banner 3</h6>
                        {isInteriorEdiTable &&
                          <div className="col-md-9">
                            <input
                              type="file"
                              className="form-control"
                              name="bannerThree"
                              accept="image/*"
                              onChange={handleImage}
                            />
                          </div>
                        }
                        {formError.bannerThree && <p className="err">{formError.bannerThree}</p>}
                        {form.bannerThree !== undefined &&
                          <div className="col-md-3">
                            <span className="upld_imgg">
                              {' '}
                              <img src={form.bannerThree} />
                            </span>
                          </div>
                        }
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="row">
                        <h6 className="BuildNameCom mb-2">Banner 4</h6>
                        {isInteriorEdiTable &&
                          <div className="col-md-9">
                            <input
                              type="file"
                              className="form-control"
                              name="bannerFour"
                              accept="image/*"
                              onChange={handleImage}
                            />
                          </div>
                        }
                        {formError.bannerFour && <p className="err">{formError.bannerFour}</p>}
                        {form.bannerFour !== undefined &&
                          <div className="col-md-3">
                            <span className="upld_imgg">
                              {' '}
                              <img src={form.bannerFour} />
                            </span>
                          </div>
                        }
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="row">
                        <h6 className="BuildNameCom mb-2">Banner 5</h6>
                        {isInteriorEdiTable &&
                          <div className="col-md-9">
                            <input
                              type="file"
                              className="form-control"
                              name="bannerFive"
                              accept="image/*"
                              onChange={handleImage}
                            />
                          </div>
                        }
                        {formError.bannerFive && <p className="err">{formError.bannerFive}</p>}
                        {form.bannerFive !== undefined &&
                          <div className="col-md-3">
                            <span className="upld_imgg">
                              {' '}
                              <img src={form.bannerFive} />
                            </span>
                          </div>
                        }
                      </div>
                    </div>
                    <div className="col-md-4 mb-4">
                      <div className="row">
                        <h6 className="BuildNameCom mb-2">Banner 6</h6>
                        {isInteriorEdiTable &&
                          <div className="col-md-9">
                            <input
                              type="file"
                              className="form-control"
                              name="bannerSix"
                              accept="image/*"
                              onChange={handleImage}
                            />
                          </div>
                        }
                        {formError.bannerSix && <p className="err">{formError.bannerSix}</p>}
                        {form.bannerSix !== undefined &&
                          <div className="col-md-3">
                            <span className="upld_imgg">
                              {' '}
                              <img src={form.bannerSix} />
                            </span>
                          </div>
                        }
                      </div>
                    </div>

                  </div>

                  <div className="row mb-0">
                    <div className="col-md-12">
                      <h5 className="mt-0">Logo Video</h5>
                    </div>
                    <div className="col-md-4">
                      {isInteriorEdiTable &&
                        <input
                          type="file"
                          className="form-control"
                          name="logoVideo"
                          accept="video/*"
                          onChange={handleVideos3}
                        />
                      }
                      {formError.logoVideo && <p className="err">{formError.logoVideo}</p>}
                      {form.logoVideo !== undefined &&
                        <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                          <source src={form.logoVideo} />
                          <track
                            src={form.logoVideo}
                            kind="subtitles"
                            srcLang="en"
                            label="English"
                          />
                        </video>
                      }
                    </div>
                  </div>

                  <div className="stal-ent mb-4">
                    <div className="col-md-12">
                      <h5>Stall Entrance</h5>
                      <FaRegEdit onClick={handleExteriorEdit} />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-10">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <div className="row">
                            <h6 className="BuildNameCom mb-2">Logo Upload</h6>
                            {isExteriorEditTable &&
                              <div className="col-md-9">
                                <input
                                  type="file"
                                  className="form-control"
                                  name="logo"
                                  accept="image/*"
                                  onChange={handleImage}
                                />
                              </div>
                            }
                            {formError.logo && <p className="err">{formError.logo}</p>}
                            {form.logo !== undefined &&
                              <div className="col-md-3">
                                <span className="upld_imgg">
                                  {' '}
                                  <img src={form.logo} />
                                </span>
                              </div>
                            }
                          </div>
                        </div>

                        <div className="col-md-6 mb-3">
                          <div className="row">
                            <h6 className="BuildNameCom mb-2">Builder Name</h6>
                            {isExteriorEditTable &&
                              <div className="col-md-9">
                                <input
                                  type="file"
                                  className="form-control"
                                  name="builderName"
                                  accept="image/*"
                                  onChange={handleImage}
                                />
                              </div>
                            }
                            {formError.builderName && (
                              <p className="err">{formError.builderName}</p>
                            )}
                            {form.builderName !== undefined &&
                              <div className="col-md-3">
                                <span className="upld_imgg">
                                  {' '}
                                  <img src={form.builderName} />
                                </span>
                              </div>
                            }
                          </div>
                        </div>

                        <div className="col-md-6 mb-3">
                          <div className="row">
                            <h6 className="BuildNameCom mb-2">Posters 1</h6>
                            {isExteriorEditTable &&
                              <div className="col-md-9">
                                <input
                                  type="file"
                                  className="form-control"
                                  name="posterOne"
                                  accept="image/*"
                                  onChange={handleImage}
                                />
                              </div>
                            }
                            {formError.posterOne && <p className="err">{formError.posterOne}</p>}
                            {form.posterOne !== undefined &&
                              <div className="col-md-3">
                                <span className="upld_imgg">
                                  {' '}
                                  <img src={form.posterOne} />
                                </span>
                              </div>
                            }
                          </div>
                        </div>

                        <div className="col-md-6 mb-3">
                          <div className="row">
                            <h6 className="BuildNameCom mb-2">Posters 2</h6>
                            {isExteriorEditTable &&
                              <div className="col-md-9">
                                <input
                                  type="file"
                                  className="form-control"
                                  name="posterTwo"
                                  accept="image/*"
                                  onChange={handleImage}
                                />
                              </div>
                            }
                            {formError.posterTwo && <p className="err">{formError.posterTwo}</p>}
                            {form.posterTwo !== undefined &&
                              <div className="col-md-3">
                                <span className="upld_imgg">
                                  {' '}
                                  <img src={form.posterTwo} />
                                </span>
                              </div>
                            }
                          </div>
                        </div>

                        <div className="col-md-6">
                          <h6 className="BuildNameCom mb-2"> Exterior Video 1</h6>
                          {isExteriorEditTable &&
                            <input
                              type="file"
                              className="form-control"
                              name="exteriorVideo1"
                              accept="video/*"
                              onChange={handleVideos3}
                            />
                          }
                          {formError.exteriorVideo1 && <p className="err">{formError.exteriorVideo1}</p>}
                          {form.exteriorVideo1 !== undefined &&
                            <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                              <source src={form.exteriorVideo1} type="video/mp4" />
                              <track
                                src={form.exteriorVideo1}
                                kind="subtitles"
                                srcLang="en"
                                label="English"
                              />
                            </video>
                          }
                        </div>

                        <div className="col-md-6">
                          <h6 className="BuildNameCom mb-2">Exterior Video 2</h6>
                          {isExteriorEditTable &&
                            <input
                              type="file"
                              className="form-control"
                              name="exteriorVideo2"
                              accept="video/*"
                              onChange={handleVideos3}
                            />
                          }
                          {formError.exteriorVideo2 && <p className="err">{formError.exteriorVideo2}</p>}
                          {form.exteriorVideo2 !== undefined &&
                            <video width="100%" autoPlay loop preload="auto" muted className='mt-3'>
                              <source src={form.exteriorVideo2} type="video/mp4" />
                              <track
                                src={form.exteriorVideo2}
                                kind="subtitles"
                                srcLang="en"
                                label="English"
                              />
                            </video>
                          }
                        </div>
                      </div>
                      <div className="col-md-5"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='add_pr_out'>
                <div className="stal-ent mb-4">
                  <div className="col-md-12">
                    <h5>Add Project</h5>
                    <button onClick={addProject}>Add Project</button>
                  </div>
                </div>
                {form.projects.map((project, i) => (
                  <div className="row mt-4" key={i}>
                    <div className="d-flex align-center">
                      <h2>Project {i + 1}</h2>
                      {form.projects.length > 1 && i > 0 && (
                        <a onClick={() => removeProject(project.project_id, i)} style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}>
                          Remove
                        </a>
                      )}
                    </div>

                    <div className="col-md-6 mt-3 mb-3">
                      <h6 className="BuildNameCom mb-2">Project Name :</h6>
                      <input
                        type="text"
                        className="form-control"
                        id='Project'
                        name="project_title"
                        placeholder='Project Name'
                        value={project.project_title || ""}
                        onChange={(e) => handleForm(e, i)}
                      />
                      {formError.projects?.[i]?.project_title && <span className="text-danger">{formError.projects[i].project_title}</span>}
                    </div>

                    <div className="col-md-6 mt-3 mb-3">
                      <h6 className="BuildNameCom mb-2">Get Brochure :</h6>
                      {!project.brochure_images.length > 0 ? (
                        <>
                          <input type="file" className="form-control" name="brochure_url" onChange={(e) => handleBrochure(e, i)} />
                          {formError.projects?.[i]?.brochure_url && <span className="text-danger">{formError.projects[i].brochure_url}</span>}
                        </>
                      ) : (
                        <span className="upld_img">
                          <button onClick={() => openBrochure(project.brochure_images)}>View</button>
                          <button className='btn btn-danger' onClick={() => deleteBrochure(project.project_id, i)}>Delete</button>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="button-subb mt-4">
                <button type="submit" className="sub-btn1" onClick={handleSubmit}>
                  Submit
                </button>
              </div>


              <Modal show={show} onHide={() => setShow(false)} className="stall_popup">
                <Modal.Header closeButton>
                  <div className='row w-100'>
                    <h3>Project Images</h3>
                  </div>
                </Modal.Header>
                <ModalBody>
                  <Carousel>
                    {brochureImages.map((item, idx) =>
                      <Carousel.Item className='text-center' key={idx}>
                        <img src={item?.brochure_url} alt="expo" width={390} />
                      </Carousel.Item>
                    )}
                  </Carousel>
                  <ul className='carosle_list d-flex'>
                    <li><img src="/assets/images/builder/hyderabad-04.jpg" alt="expo" width={390} /></li>
                    <li><img src="/assets/images/builder/hyderabad-04.jpg" alt="expo" width={390} /></li>
                    <li><img src="/assets/images/builder/hyderabad-04.jpg" alt="expo" width={390} /></li>
                    <li><img src="/assets/images/builder/hyderabad-04.jpg" alt="expo" width={390} /></li>
                    <li><img src="/assets/images/builder/hyderabad-04.jpg" alt="expo" width={390} /></li>

                  </ul>
                </ModalBody>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default StallManagement