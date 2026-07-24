import React, { useState, useEffect } from 'react';
import { expoApiClient, expoAdminClient } from '../utils/httpClient';
import { handleBrochures3, handleImages3 } from '../utils/S3Handler';
import { handleImageGcs, handleBrochureGcs } from '../utils/GcsHandler';
import Loader from '../components/Loader';
import { toastError, toastSuccess, toastWarning } from '../utils/toast';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { IoCloseSharp } from "react-icons/io5";
import { useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import { ModalBody } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
const AddExecutive = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector(state => state.user.userData)

  //console.log(userData)

  const { expoCode, stallCode, newStallId } = location.state || {};

  const stallType = typeof stallCode === 'string'
    ? stallCode.startsWith('D') ? 'Diamond'
      : stallCode.startsWith('P') ? 'Platinum'
        : stallCode.startsWith('G') ? 'Gold'
          : 'Standard'
    : 'Standard';


  const NumberOfExecutives = typeof stallCode === 'string'
    ? stallCode.startsWith('D') ? 6
      : stallCode.startsWith('P') ? 5
        : stallCode.startsWith('G') ? 4
          : 3
    : 3;



  useEffect(() => {
    if (expoCode === undefined || stallCode === undefined || newStallId === undefined) {
      navigate('/expo/pending');
    }
  }, []);


  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [brochureImages, setBrochureImages] = useState([]);
  const [form, setForm] = useState({
    builderId: userData?.id,
    builderNameText: userData?.company_name,
    expoUnqCode: expoCode,
    stallUnqCode: stallCode,
    newStallId: newStallId,
    categories: [{
      category: "",
      city: "",
      locality: []
    }],
    builder: {},
    manager: {},
    executives: [],
    projects: [
      {
        project_title: "",
        brochure_url: "",
      }
    ]
  });
  const [inputLocalities, setInputLocalities] = useState([]);


  const [formError, setFormError] = useState({});

  const handleForm = (e, index) => {
    const { name, value, id } = e.target;

    if (id === 'project') {
      setForm((prev) => ({
        ...prev,
        projects: prev.projects.map((project, i) =>
          i == index
            ? { ...project, [name]: value }
            : project
        )
      }));
    } else if (id === 'category') {
      setForm((prev) => ({
        ...prev,
        categories: prev.categories.map((category, i) =>
          i == index
            ? { ...category, [name]: value }
            : category
        )
      }));
    } else {
      setForm((prev) => {
        const updatedForm = { ...prev };

        if (id === 'builder') {
          updatedForm.builder = {
            ...updatedForm.builder,
            [name]: value
          };
        } else if (id === 'manager') {
          updatedForm.manager = {
            ...updatedForm.manager,
            [name]: value
          };
        } else if (id.startsWith('executive')) {
          const index = parseInt(id.split('-')[1], 10) - 1;
          const tableNo = id.split('-')[1];
          const updatedExecutives = [...updatedForm.executives];

          updatedExecutives[index] = {
            ...updatedExecutives[index],
            [name]: value,
            tableNo: tableNo
          };

          updatedForm.executives = updatedExecutives;
        }

        return updatedForm;
      });
    }
  };


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
                brochure_url: resFromMiddleware.data?.pdf_image_urls,
              }
              : project
          )
        }));
      }
    } else {
      toastError(resFromMiddleware.data);
    }
  }

  const openBrochure = (brochureImgs) => {
    const imgs = Array.isArray(brochureImgs) ? brochureImgs : brochureImgs ? [brochureImgs] : [];
    setBrochureImages(imgs);
    setShow(true);
  };

  const removeBrochure = (index) => {
    setForm((prevForm) => {
      const updatedProjects = [...prevForm.projects];
      updatedProjects[index] = {
        ...updatedProjects[index],
        brochure_url: ""
      };
      return {
        ...prevForm,
        projects: updatedProjects,
      };
    });
  };

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

  const validate = () => {
    let isValid = true;
    const errors = {};

    // Validate builder details
    if (!form.builder.name) {
      errors.builderName = "Builder Name is required";
      isValid = false;
    }
    if (!form.builder.phone) {
      errors.builderPhone = "Builder Phone is required";
      isValid = false;
    }

    // Validate manager details
    if (!form.manager.name) {
      errors.managerName = "Manager Name is required";
      isValid = false;
    }
    if (!form.manager.phone) {
      errors.managerPhone = "Manager Phone is required";
      isValid = false;
    }

    // Validate banners and videos
    const requiredFields = ["video1", "video2", "bannerOne", "bannerTwo", "bannerThree", "bannerFour", "bannerFive", "bannerSix", "logoVideo", "logo", "builderName", "posterOne", "posterTwo", "exteriorVideo1", "exteriorVideo2"];
    requiredFields.forEach((field) => {
      if (!form[field]) {
        errors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    // validate categories
    const currentCats = commitPendingLocalities(form.categories);
    setForm((prev) => ({ ...prev, categories: currentCats }));

    errors.categories = currentCats.map((cat) => {
      let categoryErrors = {};
      if (!cat.category || cat.category === "defalut" || cat.category === "default") {
        categoryErrors.category = "Category is required";
        isValid = false;
      }
      if (!cat.city || !cat.city.trim()) {
        categoryErrors.city = "City is required";
        isValid = false;
      }
      const locArray = Array.isArray(cat.locality) ? cat.locality : [];
      if (locArray.length === 0) {
        categoryErrors.locality = "locality is required";
        isValid = false;
      }
      return categoryErrors;
    });

    // Validate projects
    errors.projects = form.projects.map((project, index) => {
      let projectErrors = {};

      if (!project.project_title) {
        projectErrors.project_title = "Project title is required";
        isValid = false;
      }
      // if (!project.brochure_url) {
      //   projectErrors.brochure_url = "Brochure URL is required";
      //   isValid = false;
      // }
      return projectErrors;
    });

    setFormError(errors);
    console.log(errors)
    return isValid;
  }

  const handleSubmit = async () => {
    if (validate()) {
      let res;
      setLoading(true);
      try {
        res = await expoApiClient.post('createStall/create.php', form);
        if (res?.data?.status) {
          await handleCategoriesSubmit(res?.data?.stallId)
          toastSuccess('Stall Was Created')
          setForm({
            builderNameText: userData?.company_name,
            expoUnqCode: expoCode,
            stallUnqCode: stallCode,
            newStallId: newStallId,
            categories: [
              {
                category: "",
                city: "",
                locality: [],
              }
            ],
            builder: {},
            manager: {},
            executives: [],
            projects: [
              {
                project_title: "",
                brochure_url: "",
              }
            ]
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      toastError('Please Enter Mandatory fields');
    }
  };

  const handleCategoriesSubmit = async (stallInfoId) => {
    setLoading(true)
    let payload = {
      categories: form.categories,
      expoUnqCode: expoCode,
      stallCode: stallCode,
      stallInfoId: stallInfoId,
      builderName: userData?.company_name
    }
    try {
      res = await expoApiClient.post('categories/create.php', payload);
      if (res?.status) {
        toastSuccess("Categories Added Successfully");
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

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
          setForm((prev) => ({
            ...prev,
            projects: prev.projects.map((project, i) =>
              i == index
                ? { ...project, [e.target.name]: res?.data?.url }
                : project
            )
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            [e.target.name]: res?.data?.url
          }));
        }

      }
    } catch (error) {
      alert('error uploading Image');
    } finally {
      setLoading(false);
    }
  };

  const addProject = () => {
    if (form.projects.length < 6) {
      setForm((prevForm) => ({
        ...prevForm,
        projects: [...prevForm.projects, {
          brochure_url: "",
          project_title: "",
        }]
      }));
    } else {
      toastError("Projects Length exceeded")
    }
  }

  function removeProject(index) {
    setForm((prevForm) => ({
      ...prevForm,
      projects: prevForm.projects.filter((_, i) => i !== index)
    }));
  }

  const handleLocalityInputChange = (e, index) => {
    const updated = [...inputLocalities];
    updated[index] = e.target.value;
    setInputLocalities(updated);
  };

  const addLocalityChip = (categoryIndex) => {
    const text = (inputLocalities[categoryIndex] || '').trim();
    if (!text) return;

    const currentLocs = form?.categories?.[categoryIndex]?.locality || [];
    if (currentLocs.length >= 4) {
      toastWarning("Localities Limit Reached");
      return;
    }

    setForm((prev) => ({
      ...prev,
      categories: prev.categories.map((category, i) =>
        i === categoryIndex
          ? { ...category, locality: [...(category.locality || []), text] }
          : category
      )
    }));

    const updated = [...inputLocalities];
    updated[categoryIndex] = '';
    setInputLocalities(updated);
  };

  const commitPendingLocalities = (currentCategories) => {
    let updatedInputs = [...inputLocalities];
    const updatedCategories = currentCategories.map((cat, i) => {
      const text = (updatedInputs[i] || '').trim();
      if (text) {
        const existing = Array.isArray(cat.locality) ? cat.locality : [];
        if (existing.length < 4) {
          updatedInputs[i] = '';
          return {
            ...cat,
            locality: [...existing, text]
          };
        }
      }
      return cat;
    });
    setInputLocalities(updatedInputs);
    return updatedCategories;
  };

  const addCategory = () => {
    const currentCats = commitPendingLocalities(form.categories);
    setForm((prevForm) => ({ ...prevForm, categories: currentCats }));

    const lastCategory = currentCats[currentCats.length - 1];

    // Simple validation checks
    const isValid =
      lastCategory &&
      lastCategory.category &&
      lastCategory.category !== "defalut" &&
      lastCategory.category !== "default" &&
      lastCategory.category.trim() !== "" &&
      lastCategory.city &&
      lastCategory.city.trim() !== "" &&
      Array.isArray(lastCategory.locality) &&
      lastCategory.locality.length > 0;

    if (!isValid) {
      toastError("Please fill the previous category completely (category, city, and at least one locality) before adding a new one.");
      return;
    }

    if (currentCats.length < 4) {
      setForm((prevForm) => ({
        ...prevForm,
        categories: [
          ...currentCats,
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
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.target.value.trim() !== '') {
        addLocalityChip(index);
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
              {stallType &&
                <h2 className="mb-0">{stallType} Stall</h2>
              }
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
                      <div className="d-flex gap-1 mb-1">
                        <input
                          type='text'
                          className="form-control"
                          placeholder='Type locality & press Enter'
                          id='category'
                          name="locality"
                          value={inputLocalities[i] || ""}
                          onChange={(e) => handleLocalityInputChange(e, i)}
                          onKeyDown={(e) => handleKeyDown(e, i)}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => addLocalityChip(i)}
                          title="Add Locality"
                        >
                          +
                        </button>
                      </div>
                      {formError.locality && <p className="err">{formError.locality}</p>}
                      {formError.categories?.[i]?.locality && <span className="text-danger">{formError?.categories?.[i].locality}</span>}
                    </div>
                    <div className="col-md-2 d-flex asign_lists flex-wrap">
                      {Array.isArray(category?.locality) && category.locality.map((loc, idx) => {
                        const locName = typeof loc === 'object' && loc !== null ? (loc.name || '') : loc;
                        return (
                          <h6 key={idx}>{locName}
                            <IoCloseSharp onClick={() => removeLocality(i, idx)} style={{ cursor: 'pointer', marginLeft: '4px' }} /> </h6>
                        );
                      })}
                    </div>
                    <div className="col-md-2 d-flex">
                      <button onClick={addCategory} className='btn btn-primary'>Add</button>
                      {form?.categories?.length > 1 &&
                        <button onClick={() => removeCategory(i)} className='btn btn-warning'>remove</button>
                      }
                    </div>
                  </div>
                )}
              </div>

              <div className="stall-gap">
                <div className="stal-ent">
                  <div className="col-md-12">
                    <h5>Stall In Side</h5>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5>Builders</h5>
                  </div>

                  <div className="col-md-4 pr-5">
                    <h6 className="BuildNameCom mb-2">Name :</h6>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      id="builder"
                      name="name"
                      value={form?.builder.name || ''}
                      onChange={handleForm}
                    />
                    {formError.builderName && <p className="err">{formError.builderName}</p>}
                  </div>
                  <div className="col-md-4">
                    <h6 className="BuildNameCom mb-2">Phone Number :</h6>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Phone Number"
                      id="builder"
                      name="phone"
                      value={form?.builder.phone || ''}
                      onChange={handleForm}
                    />
                    {formError.builderPhone && <p className="err">{formError.builderPhone}</p>}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5>Manager</h5>
                  </div>
                  <div className="col-md-4 pr-5">
                    <h6 className="BuildNameCom mb-2">Name :</h6>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Name"
                      id="manager"
                      name="name"
                      value={form?.manager.name || ''}
                      onChange={handleForm}
                    />
                    {formError.managerName && <p className="err">{formError.managerName}</p>}
                  </div>
                  <div className="col-md-4">
                    <h6 className="BuildNameCom mb-2">Phone Number :</h6>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Phone Number "
                      id="manager"
                      name="phone"
                      value={form?.manager.phone || ''}
                      onChange={handleForm}
                    />
                    {formError.managerPhone && <p className="err">{formError.managerPhone}</p>}
                  </div>
                </div>

                <div className="col-md-12">
                  <h5>Executives</h5>
                </div>

                {[...Array(NumberOfExecutives)].map((_, index) => (
                  <div className="row mb-3" key={index}>
                    <div className="col-md-12">
                      <h4>Executive {index + 1}</h4>
                    </div>
                    <div className="col-md-4">
                      <h6 className="BuildNameCom mb-2">Name :</h6>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Executive Name"
                        id={`executive-${index + 1}`}
                        name="name"
                        value={form.executives[index]?.name || ''}
                        onChange={handleForm}
                      />
                      {/* {executiveErrors[index]?.name && <p className="err">{executiveErrors[index].name}</p>} */}
                    </div>
                    <div className="col-md-4">
                      <h6 className="BuildNameCom mb-2">Phone Number :</h6>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Executive Phone Number"
                        id={`executive-${index + 1}`}
                        name="phone"
                        value={form.executives[index]?.phone || ''}
                        onChange={handleForm}
                      />
                      {/* {executiveError[index]?.phone && <p className="err">{executiveError[index].company_name}</p>} */}
                    </div>
                  </div>
                ))}

                <div className="stal-ent">
                  <div className="col-md-12">
                    <h5>Stall Interior</h5>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5 className="mt-0">Video Screens</h5>
                  </div>

                  <div className="col-md-4">
                    <h6 className="BuildNameCom mb-2">Video 1</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="video1"
                      onChange={handleVideos3}
                      accept="video/*"
                    />
                    {formError.video1 && <p className="err">{formError.video1}</p>}
                    {form.video1 != undefined && (
                      <video width="100%" autoPlay loop preload="auto" muted>
                        <source src={form.video1} type="video/mp4" />
                        <track src={form.video1} kind="subtitles" srcLang="en" label="English" />
                      </video>
                    )}
                  </div>

                  <div className="col-md-4">
                    <h6 className="BuildNameCom mb-2">Video 2</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="video2"
                      onChange={handleVideos3}
                      accept="video/*"
                    />
                    {formError.video2 && <p className="err">{formError.video2}</p>}
                    {form.video2 != undefined && (
                      <video width="100%" autoPlay loop preload="auto" muted>
                        <source src={form.video2} type="video/mp4" />
                        <track src={form.video2} kind="subtitles" srcLang="en" label="English" />
                      </video>
                    )}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5>Poster/Banners</h5>
                  </div>

                  <div className="col-md-4 mb-4">
                    <h6 className="BuildNameCom mb-2">Banner 1</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="bannerOne"
                      onChange={handleImage}
                      accept="image/*"
                    />
                    {formError.bannerOne && <p className="err">{formError.bannerOne}</p>}
                    {form.bannerOne !== undefined && (
                      <span className="upld_img">
                        {' '}
                        <img src={form.bannerOne} />
                      </span>
                    )}
                  </div>
                  <div className="col-md-4 mb-4">
                    <h6 className="BuildNameCom mb-2">Banner 2</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="bannerTwo"
                      onChange={handleImage}
                      accept="image/*"
                    />
                    {formError.bannerTwo && <p className="err">{formError.bannerTwo}</p>}
                    {form.bannerTwo !== undefined && (
                      <span className="upld_img">
                        {' '}
                        <img src={form.bannerTwo} />
                      </span>
                    )}
                  </div>

                  <div className="col-md-4 mb-4">
                    <h6 className="BuildNameCom mb-2">Banner 3</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="bannerThree"
                      onChange={handleImage}
                      accept="image/*"
                    />
                    {formError.bannerThree && <p className="err">{formError.bannerThree}</p>}
                    {form.bannerThree !== undefined && (
                      <span className="upld_img">
                        {' '}
                        <img src={form.bannerThree} />
                      </span>
                    )}
                  </div>

                  <div className="col-md-4">
                    <h6 className="BuildNameCom mb-2">Banner 4</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="bannerFour"
                      onChange={handleImage}
                      accept="image/*"
                    />
                    {formError.bannerFour && <p className="err">{formError.bannerFour}</p>}
                    {form.bannerFour !== undefined && (
                      <span className="upld_img">
                        {' '}
                        <img src={form.bannerFour} />
                      </span>
                    )}
                  </div>

                  <div className="col-md-4">
                    <h6 className="BuildNameCom mb-2">Banner 5</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="bannerFive"
                      onChange={handleImage}
                      accept="image/*"
                    />
                    {formError.bannerFive && <p className="err">{formError.bannerFive}</p>}
                    {form.bannerFive !== undefined && (
                      <span className="upld_img">
                        {' '}
                        <img src={form.bannerFive} />
                      </span>
                    )}
                  </div>

                  <div className="col-md-4">
                    <h6 className="BuildNameCom mb-2">Banner 6</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="bannerSix"
                      onChange={handleImage}
                      accept="image/*"
                    />
                    {formError.bannerSix && <p className="err">{formError.bannerSix}</p>}
                    {form.bannerSix !== undefined && (
                      <span className="upld_img">
                        {' '}
                        <img src={form.bannerSix} />
                      </span>
                    )}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5>Logo Video </h5>
                  </div>
                  <div className="col-md-6 mb-6">
                    <h6 className="BuildNameCom mb-2">Video</h6>
                    <input
                      type="file"
                      className="form-control"
                      name="logoVideo"
                      onChange={handleVideos3}
                      accept="video/*"
                    />
                    {formError.logoVideo && <p className="err">{formError.logoVideo}</p>}
                    {form.logoVideo != undefined && (
                      <video width="100%" autoPlay loop preload="auto" muted>
                        <source src={form.logoVideo} type="video/mp4" />
                        <track src={form.logoVideo} kind="subtitles" srcLang="en" label="English" />
                      </video>
                    )}
                  </div>
                  <div className="col-md-6 mb-6"></div>
                </div>
              </div>

              <div className="stal-ent mb-4">
                <div className="col-md-12">
                  <h5>Stall Entrance</h5>
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-7">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <h6 className="BuildNameCom mb-2">Logo Upload</h6>
                      <input
                        type="file"
                        className="form-control"
                        name="logo"
                        onChange={handleImage}
                        accept="image/*"
                      />
                      {formError.logo && <p className="err">{formError.logo}</p>}
                      {form.logo !== undefined && (
                        <span className="upld_img">
                          {' '}
                          <img src={form.logo} />
                        </span>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <h6 className="BuildNameCom mb-2">Builder Name</h6>
                      <input
                        type="file"
                        className="form-control"
                        name="builderName"
                        onChange={handleImage}
                        accept="image/*"
                      />
                      {formError.builderName && (
                        <p className="err">{formError.builderName}</p>
                      )}
                      {form.builderName !== undefined && (
                        <span className="upld_img">
                          {' '}
                          <img src={form.builderName} />
                        </span>
                      )}
                    </div>
                    <div className="col-md-6 mb-3">
                      <h6 className="BuildNameCom mb-2">Posters 1</h6>
                      <input
                        type="file"
                        className="form-control"
                        name="posterOne"
                        onChange={handleImage}
                        accept="image/*"
                      />
                      {formError.posterOne && <p className="err">{formError.posterOne}</p>}
                      {form.posterOne !== undefined && (
                        <span className="upld_img">
                          {' '}
                          <img src={form.posterOne} />
                        </span>
                      )}
                    </div>

                    <div className="col-md-6 mb-3">
                      <h6 className="BuildNameCom mb-2">Posters 2</h6>
                      <input
                        type="file"
                        className="form-control"
                        name="posterTwo"
                        onChange={handleImage}
                        accept="image/*"
                      />
                      {formError.posterTwo && <p className="err">{formError.video1}</p>}
                      {form.posterTwo !== undefined && (
                        <span className="upld_img">
                          {' '}
                          <img src={form.posterTwo} />
                        </span>
                      )}
                    </div>
                    <div className="col-md-6">
                      <h6 className="BuildNameCom mb-2">Videos</h6>
                      <input
                        type="file"
                        className="form-control"
                        name="exteriorVideo1"
                        onChange={handleVideos3}
                        accept="video/*"
                      />
                      {formError.exteriorVideo1 && <p className="err">{formError.exteriorVideo1}</p>}
                      {form.exteriorVideo1 != undefined && (
                        <video width="100%" autoPlay loop preload="auto" muted>
                          <source src={form.exteriorVideo1} type="video/mp4" />
                          <track
                            src={form.exteriorVideo1}
                            kind="subtitles"
                            srcLang="en"
                            label="English"
                          />
                        </video>
                      )}
                    </div>
                    <div className="col-md-6">
                      <h6 className="BuildNameCom mb-2">Videos</h6>
                      <input
                        type="file"
                        className="form-control"
                        name="exteriorVideo2"
                        onChange={handleVideos3}
                        accept="video/*"
                      />
                      {formError.exteriorVideo2 && <p className="err">{formError.exteriorVideo2}</p>}
                      {form.exteriorVideo2 != undefined && (
                        <video width="100%" autoPlay loop preload="auto" muted>
                          <source src={form.exteriorVideo2} type="video/mp4" />
                          <track
                            src={form.exteriorVideo2}
                            kind="subtitles"
                            srcLang="en"
                            label="English"
                          />
                        </video>
                      )}
                    </div>
                  </div>
                  <div className="col-md-5"></div>
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
                        <a onClick={() => removeProject(i)} style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}>
                          Remove
                        </a>
                      )}
                    </div>

                    <div className="col-md-6 mt-3 mb-3">
                      <h6 className="BuildNameCom mb-2">Project Name :</h6>
                      <input
                        type="text"
                        className="form-control"
                        id='project'
                        name="project_title"
                        placeholder='Project Name'
                        value={project.project_title || ""}
                        onChange={(e) => handleForm(e, i)}
                      />
                      {formError.projects?.[i]?.project_title && <span className="text-danger">{formError.projects[i].project_title}</span>}
                    </div>

                    <div className="col-md-6 mt-3 mb-3">
                      <h6 className="BuildNameCom mb-2">Get Brochure :</h6>
                      {(!project.brochure_url || (Array.isArray(project.brochure_url) && project.brochure_url.length === 0)) ? (
                        <>
                          <input type="file" id='project' className="form-control" name="brochure_url" onChange={(e) => handleBrochure(e, i)} />
                          {formError.projects?.[i]?.brochure_url && <span className="text-danger">{formError.projects[i].brochure_url}</span>}
                        </>
                      ) : (
                        <div className="d-flex align-items-center gap-2 mt-1">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => openBrochure(project.brochure_url)}
                          >
                            View Brochure
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => removeBrochure(i)}
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="button-subb mt-4">
                <button name="submit" className="sub-btn1" onClick={handleSubmit}>
                  Submit
                </button>
              </div>

              <Modal show={show} onHide={() => setShow(false)} className="stall_popup">
                <Modal.Header closeButton>
                  <div className='row w-100'>
                    <h3>Project Brochure</h3>
                  </div>
                </Modal.Header>
                <ModalBody>
                  <Carousel>
                    {brochureImages && brochureImages.map((brochureImg, idx) => (
                      <Carousel.Item key={idx}>
                        <img src={brochureImg} alt={`Brochure Page ${idx + 1}`} style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }} />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </ModalBody>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddExecutive;
