import React, { useState, useEffect } from 'react';
import { expoApiClient, expoAdminClient } from '../utils/httpClient';
import { handleBrochures3, handleImages3 } from '../utils/S3Handler';
import Loader from '../components/Loader';
import { toastError, toastSuccess } from '../utils/toast';
import { AiFillDelete } from "react-icons/ai";


const AddExecutivePone = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    builder: {},
    manager: {},
    executives: [],
    projects: [
      {
        project_logo: "",
        brand_logo: "",
        background_image: "",
        project_title: "",
        brochure_url: "",
        video_upload: ""
      }
    ]
  });


  const [formError, setFormError] = useState({});

  const handleForm = (e, index) => {
    const { name, value, id } = e.target;

    if (index !== undefined) {
      setForm((prev) => ({
        ...prev,
        projects: prev.projects.map((project, i) =>
          i == index
            ? { ...project, [name]: value }
            : project
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

  useEffect(() => {
    console.log('form ====>', form);
  }, [form]);

  const handleBrochure = async (e, index) => {
    setLoading(true)
    let resFromMiddleware = await handleBrochures3(e);
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

  const handleImage = async (e, index) => {
    setLoading(true);
    let resFromMiddleware = await handleImages3(e);
    setLoading(false);
    if (resFromMiddleware.clientStatus) {
      if (index !== undefined) {
        if (e.target.name === 'brochure_url') {
          setForm((prevState) => ({
            ...prevState,
            projects: prevState.projects.map((project, i) =>
              i == index
                ? { ...project, [e.target.name]: resFromMiddleware.data.original_file_url }
                : project
            )
          }));
        } else {
          setForm((prev) => ({
            ...prev,
            projects: prev.projects.map((project, i) =>
              i == index
                ? { ...project, [e.target.name]: resFromMiddleware.data.original_image_url }
                : project
            )
          }));
        }
      } else {
        setForm((prev) => ({
          ...prev,
          [e.target.name]: resFromMiddleware.data.original_image_url
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
    const requiredFields = ["video1", "video2", "bannerOne", "bannerTwo", "bannerThree", "bannerFour", "bannerFive", "bannerSix", "logoVideo", "logo", "builderNameImage", "posterOne", "posterTwo", "Stallvideo"];
    requiredFields.forEach((field) => {
      if (!form[field]) {
        errors[field] = `${field.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    // Validate projects
    errors.projects = form.projects.map((project, index) => {
      let projectErrors = {};

      if (!project.project_logo) {
        projectErrors.project_logo = "Project logo is required";
        isValid = false;
      }
      if (!project.brand_logo) {
        projectErrors.brand_logo = "Brand logo is required";
        isValid = false;
      }
      if (!project.background_image) {
        projectErrors.background_image = "Background image is required";
        isValid = false;
      }
      if (!project.project_title) {
        projectErrors.project_title = "Project title is required";
        isValid = false;
      }
      if (!project.brochure_url) {
        projectErrors.brochure_url = "Brochure URL is required";
        isValid = false;
      }
      if (!project.video_upload) {
        projectErrors.video_upload = "Project video is required";
        isValid = false;
      }

      return projectErrors;
    });

    setFormError(errors);
    return isValid;
  }



  const handleSubmit = async () => {
    if (validate()) {
      let res;
      setLoading(true);
      try {
        res = await expoApiClient.post('createStall/create.php', form);
        if (res?.status) {
          toastSuccess('Stall Was Created')
          setForm({});
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
      let res = await expoAdminClient.post('videoConfig/create.php', formData, config);
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

  function addProject() {
    setForm((prevForm) => ({
      ...prevForm,
      projects: [...prevForm.projects, {
        project_logo: "",
        brand_logo: "",
        background_image: "",
        project_title: "",
        brochure_url: "",
        video_upload: ""
      }]
    }));
  }

  function removeProject(index) {
    setForm((prevForm) => ({
      ...prevForm,
      projects: prevForm.projects.filter((_, i) => i !== index)
    }));
  }


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
              <h2 className="mb-0">Platinum Stall</h2>
              <div className="stall-gap">
                <div className="stal-ent">
                  <div className="col-md-12">
                    <h5>Stall In Side</h5>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <h5>Builder</h5>
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

                {[...Array(5)].map((_, index) => (
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
                      {formError.builderNameImage && (
                        <p className="err">{formError.builderNameImage}</p>
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
                      {formError.Stallvideo && <p className="err">{formError.Stallvideo}</p>}
                      {form.Stallvideo != undefined && (
                        <video width="100%" autoPlay loop preload="auto" muted>
                          <source src={form.Stallvideo} type="video/mp4" />
                          <track
                            src={form.Stallvideo}
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
                      {formError.Stallvideo && <p className="err">{formError.Stallvideo}</p>}
                      {form.Stallvideo != undefined && (
                        <video width="100%" autoPlay loop preload="auto" muted>
                          <source src={form.Stallvideo} type="video/mp4" />
                          <track
                            src={form.Stallvideo}
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
                  </div>
                </div>
                {form.projects.map((project, i) => (
                    <div className='add_proj' key={i}>
                  <div className="row" >
                    <div className="d-flex align-center ">
                      <h3>Project {i + 1}</h3>

<div>
                      <button onClick={addProject} className='btn btn-primary'>Add</button>
                      {form.projects.length > 1 && (
                        <a onClick={() => removeProject(i)} style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}>
                          <button className='btn btn-danger'><AiFillDelete /></button>
                        </a>
                      )}

                      </div>
                    </div>

                    {["project_logo", "brand_logo", "background_image"].map((field) => (
                      <div className="col-md-4" key={field}>
                        <h6 className="BuildNameCom mb-2">{field.replace(/_/g, " ")}:</h6>
                        {!project[field] ? (
                          <>
                            <input type="file" className="form-control" name={field} onChange={(e) => handleImage(e, i)} />
                            {formError.projects?.[i]?.[field] && <span className="text-danger">{formError.projects[i][field]}</span>}
                          </>
                        ) : (
                          <span className="upld_img">
                            <img src={project[field]} alt={field} />
                          </span>
                        )}
                      </div>
                    ))}

                    <div className="col-md-12 mt-3 mb-3">
                      <h6 className="BuildNameCom mb-2">Project Title :</h6>
                      <input
                        type="text"
                        className="form-control"
                        name="project_title"
                        value={project.project_title || ""}
                        onChange={(e) => handleForm(e, i)}
                      />
                      {formError.projects?.[i]?.project_title && <span className="text-danger">{formError.projects[i].project_title}</span>}
                    </div>

                    <div className="col-md-4">
                      <h6 className="BuildNameCom mb-2">Get Brochure :</h6>
                      {!project.brochure_url ? (
                        <>
                          <input type="file" className="form-control" name="brochure_url" onChange={(e) => handleBrochure(e, i)} />
                          {formError.projects?.[i]?.brochure_url && <span className="text-danger">{formError.projects[i].brochure_url}</span>}
                        </>
                      ) : (
                        <span className="upld_img">
                          <button href={project.brochure_url} target="_blank"> </button>
                        </span>
                      )}
                    </div>

                    <div className="col-md-4">
                      <h6 className="BuildNameCom mb-2">Video Upload :</h6>
                      {!project.video_upload ? (
                        <>
                          <input type="file" className="form-control" name="video_upload" onChange={(e) => handleVideos3(e, i)} />
                          {formError.projects?.[i]?.video_upload && <span className="text-danger">{formError.projects[i].video_upload}</span>}
                        </>
                      ) : (
                        <video width="100%" autoPlay loop muted>
                          <source src={project.video_upload} type="video/mp4" />
                        </video>
                      )}
                    </div>
                  </div>
                  </div>
                ))}


              </div>

              <div className="button-subb mt-4">
                <button name="submit" className="sub-btn1" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddExecutivePone;
