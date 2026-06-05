import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { masterClient } from '../../utils/httpClient';
import 'react-tabs/style/react-tabs.css';
import { FaFilePdf } from "react-icons/fa6";
import { handleImages3 } from '../../utils/S3Handler';
import { setProject } from '../../store/slices/ProjectManagementSlice';
import Loader from '../../components/Loader';
import { projectClient } from '../../utils/httpClient';
const stepFour = ({ type, subType, nextStep, prevStep }) => {
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.projectManagement['project']);
  const [form, setForm] = useState({ ...formState });
  const [sgalleryHeader, setgalleryHeader] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({});
  const [fileArray, setFileArray] = useState([]);
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const handleImage = async (e, i) => {
    setLoading(true); // Start loading
    let resFromMiddleware = await handleImages3(e); // Make API call
    setLoading(false); // End loading

    if (resFromMiddleware.clientStatus) {
      if (e.target.name === "broucher_path") {
        setForm((prevState) => ({
          ...prevState,
          [e.target.name]: resFromMiddleware.data.original_file_url,
        }));
      } else {
        const newFile = {
          headId: e.target.id,
          id: resFromMiddleware.data.original_image_url,
        };

        const updatedFileArray = fileArray.some(
          (file) => file.headId === newFile.headId
        )
          ? fileArray.map((file) =>
            file.headId === newFile.headId ? newFile : file
          )
          : [...fileArray, newFile];

        setFileArray(updatedFileArray);

        setForm((prevState) => ({
          ...prevState,
          [e.target.name]: updatedFileArray,
        }));
      }
    } else {
      // Handle error response
      toastError(resFromMiddleware.data);
    }
  };



  const getImageUrls = (id) => {
    const matchedItems = fileArray.filter((item) => item.headId === id);
    setImgView((prevState) => ({
      ...prevState,
      [id]: matchedItems.map((item) => item.id)
    }));
  };

  const getgalleryHeaders = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('galleryheaders');
      if (res?.data?.status) {
        setgalleryHeader(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getgalleryHeaders();
    console.log('file array =====>', fileArray);
    if (form.file_path !== undefined) {
      setFileArray(form?.file_path);
    }
  }, [fileArray]);

  const validate = () => {
    let isValid = true;
    const error = {};
    if (!form?.file_path?.[0]?.id) {
      error.file_path0 = 'Image is required';
      isValid = false;
    }
    if (!form?.video1) {
      error.video1 = 'Video is required'
    }
    if (!form?.video2) {
      error.video2 = 'Video is required'
    }
    if (!form?.broucher_path) {
      error.broucher_path = 'Video is required'
    }
    setFormError(error);
    return isValid;
  };

  const handleSubmit = () => {
    if (validate()) {
      nextStep();
      dispatch(setProject(form));
    }
  };

  const handleDeleteImage = (headId) => {
    const updatedFileArray = fileArray.filter((item) => item.headId !== headId.toString());

    setFileArray(updatedFileArray);

    setForm((prevState) => ({
      ...prevState,
      file_path: updatedFileArray
    }));
  };


  // ? commemted old code

  // const images = Array.from({ length: 8 }, (_, index) => ({
  //   id: `${index}`,
  //   image: fileArray?.filter((item) => item.headId === `${index}`)?.[0]?.id
  // }));

  const images = Array.from({ length: 8 }, (_, index) => {

    const matchedItem = fileArray?.find((item) => item.headId === index);
    return {
      id: `${index}`,
      image: matchedItem?.id || null,
    };
  });

  const ImageUpload = ({ id, image, onImageChange, onDeleteImage }) => {
    return (
      <div className="col-md-3">
        {id === '0' &&
          (form?.file_path && form?.file_path[0] ? (
            <h5>Display Image: {form.file_path[0].name}</h5>
          ) : (
            <></>
          ))}

        <div className="form-floating mb-3">
          <input
            type="file"
            id={id}
            className="w-103"
            name="file_path"
            accept="image/*"
            required
            onChange={(e) => onImageChange(e)}
          />
        </div>
        {image && (
          <div className="col-12 imgclass">
            <img src={image} width="100%" height="140" />
            <button className="btn btn-danger removebtn" onClick={() => onDeleteImage(id)}>
              Delete Image
            </button>
          </div>
        )}
        {formError?.[`file_path${id}`] && <p className="err">{formError?.[`file_path${id}`]}</p>}
      </div>
    );
  };

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      ...formState
    }));
  }, [formState]);

  useEffect(() => {
    getProjectImages();
  }, [])

  // ? get added gallery images
  const getProjectImages = async () => {
    try {
      const res = await projectClient.get('listing-gallery');
      if (res?.data?.status) {

        const filteredData = res.data.data.filter(
          (img) => img.project_listing_id == form.id
        );

        const newFileArray = filteredData.map((img) => ({
          headId: img.gallery_header_id,
          id: img.file_path,
        }));

        setFileArray((prevFileArray) => [...prevFileArray, ...newFileArray]);

        setForm((prevState) => ({
          ...prevState,
          file_path: [...(prevState.images || []), ...newFileArray],
        }));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }


  return (
    <div>
      {loading && <Loader />}
      {subType != '48' && subType != '52' && subType != '56' && subType != '57' && (
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Gallery</h4>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div>
                <h1 class="unitclass">
                  {subType == '40'
                    ? 'Property Gallery'
                    : subType == '53' || subType == '58'
                      ? 'Land Gallery'
                      : 'Project Gallery'}{' '}
                </h1>
              </div>
              <div className="row mb-5">
                {images.map(({ id, image }) => (
                  <ImageUpload
                    key={id}
                    id={id}
                    image={image}
                    onImageChange={handleImage}
                    onDeleteImage={handleDeleteImage}
                  />
                ))}
              </div>

              {subType !== '40' && subType !== '53' && subType !== '58' && (
                <div>
                  <h1 class="unitclass">Unit Gallery</h1>

                  <Tabs>
                    <TabList>
                      {sgalleryHeader.map((header, index) => (
                        <Tab>{header.name}</Tab>
                      ))}
                    </TabList>
                    {sgalleryHeader.map((header, index) => (
                      <TabPanel>
                        <div className="mb-50">
                          <div className="row justify-content-center mb-20">
                            <p>Upload images for {header.name}</p>
                            <div className="col-md-4">
                              <div className="row">
                                <div className="col-md-8">
                                  <div className="form-floating mb-3">
                                    <input
                                      type="file"
                                      id={header.id}
                                      className="w-103"
                                      name="file_path"
                                      accept="image/*"
                                      required
                                      onChange={(e) => {
                                        handleImage(e, header.name);
                                      }}
                                    />
                                  </div>
                                </div>
                                {/* <div className="col-md-2">
                                <button
                                  className="btn"
                                  onClick={(e) => {
                                    handleDeleteImage(header.id);
                                  }}>
                                  {' '}
                                  <i className="fa fa-trash"></i>
                                </button>
                              </div> */}
                              </div>

                              <div className="col-md-12 imgclass">
                                {/* {console.log(
                                `image1 for header ${ header.id }`,
                                fileArray.filter((item) => item.headId == header.id)?.[0]?.id
                              )} */}
                                {fileArray?.filter((item) => item.headId == header.id)?.[0]?.id ? (
                                  <img
                                    src={
                                      fileArray?.filter((item) => item.headId == header.id)?.[0]?.id
                                    }
                                    width="225"
                                    height="140"
                                    className="auth-logo logo-dark mx-auto"
                                  />
                                ) : null}
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="row">
                                <div className="col-md-8">
                                  <div className="form-floating mb-3">
                                    <input
                                      type="file"
                                      id={header.id}
                                      className="w-103"
                                      name="file_path"
                                      accept="image/*"
                                      required
                                      onChange={(e) => {
                                        handleImage(e, header.name);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-12 imgclass">
                                {/* {console.log(
                                `image2 for header ${ header.id }`,
                                fileArray.filter((item) => item.headId == header.id)?.[1]?.id
                              )} */}
                                {fileArray.filter((item) => item.headId == header.id)?.[1]?.id ? (
                                  <img
                                    src={
                                      fileArray.filter((item) => item.headId == header.id)?.[1]?.id
                                    }
                                    width="225"
                                    height="140"
                                    className="auth-logo logo-dark mx-auto"
                                  />
                                ) : null}
                              </div>
                            </div>

                            <div className="col-md-2">
                              <button
                                className="btn"
                                onClick={(e) => {
                                  handleDeleteImage(header.id);
                                }}>
                                <i className="fa fa-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                    ))}
                  </Tabs>
                </div>
              )}

              {/* 
            {sgalleryHeader.map((header, index) => (
              <div className="row mb-5 align-items-center justify-content-center gapclass">
                <div className="row">
                  <div>
                    <h6 className="mb-3 chnageclr">{header.name}</h6>
                  </div>
                </div>
                <div className="col-2">
                  <div className="form-floating">
                    <input
                      type="file"
                      id={header.id}
                      className="form-control fileclass"
                      name="file_path"
                      accept="image/*"
                      required
                      onChange={(e) => {
                        dynamicImagesUploads(e, header.name, 'image1');
                      }}
                    />
                    <label for="file_path" className="fw-normal">
                      Upload Image
                    </label>
                  </div>
                </div>
                <div className="col-3 imgclass">
                  <label className="fw-normal imgprevclass">Image Preview</label>

                  <img
                    src={
                      imagesObj?.[header.name + 'image1']
                        ? imagesObj?.[header.name + 'image1']
                        : ''
                    }
                    id={header.id}
                    alt=""
                    width="225"
                    height="140"
                    className="auth-logo logo-dark mx-auto"
                  />{' '}
                  <button className='btn btn-danger removebtn' onClick={(e) => { removeImage(e, header.name, 'image1') }}>Delete Image</button>
                </div>
                <div className="col-2">
                  <div className="form-floating">
                    <input
                      type="file"
                      id={header.id}
                      className="form-control fileclass"
                      name="file_path"
                      accept="image/*"
                      required
                      onChange={(e) => {
                        dynamicImagesUploads(e, header.name, 'image2');
                      }}
                    />
                    <label for="file_path" className="fw-normal">
                      Upload Image
                    </label>
                  </div>
                </div>
                <div className="col-3">
                  <label className="fw-normal imgprevclass">Image Preview</label>

                  <img
                    src={imagesObj?.[header.name + 'image2']
                      ? imagesObj?.[header.name + 'image2']
                      : ''}
                    alt=""
                    width="225"
                    height="140"
                    className="auth-logo logo-dark mx-auto"
                  />{' '}
                  <button className='btn btn-danger removebtn' onClick={(e) => { removeImage(e, header.name, 'image2') }}>Delete Image</button>
                </div>
              </div>
            ))} */}
            </div>
          </div>
        </div>
      )}
      <div className="row video_broucher_row">
        <div className="card col-md-6">
          <div className="card-header ">
            <h4 className="card-title">Videos</h4>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col">
                <div className="form-floating">
                  <input
                    type="url"
                    id="video1"
                    className="form-control"
                    name="video1"
                    placeholder="Enter Enter"
                    required
                    onChange={handleChange}
                    value={form.video1 || ''}
                  />
                  <label for="video1" className="fw-normal">
                    Video 1 URL
                  </label>
                </div>
              </div>
              <div className="col">
                <div className="form-floating">
                  <input
                    type="url"
                    id="video2"
                    className="form-control"
                    name="video2"
                    placeholder="Enter Enter"
                    required
                    onChange={handleChange}
                    value={form.video2 || ''}
                  />
                  <label for="video2" className="fw-normal">
                    Video 2 URL
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {subType != '48' && subType != '52' && subType != '53' && subType != '58' && (
          <div className="card col-md-6">
            <div className="card-header ">
              <h4 className="card-title">E-Brochure</h4>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col">
                  <div className="form-floating">
                    {form.broucher_path == null ?
                      <>
                        <input
                          type="file"
                          id="ebrochure"
                          className="form-control"
                          name="broucher_path"
                          accept="image/*,application/pdf"
                          required
                          onChange={handleImage}
                        />
                        <label htmlFor="file_path" className="fw-normal">
                          E-Brochure
                        </label>
                      </>
                      :
                      <a href={form.broucher_path} target='_blank'>
                        <button className='btn btn-primary'>View PDF <FaFilePdf />
                        </button>
                      </a>
                    }
                    {formError.broucher_path && (
                      <p className="text-danger">{formError.broucher_path}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="btnParent">
        <button className="btn customBtn" onClick={prevStep}>
          Previous
        </button>
        <button className="btn customBtn" onClick={handleSubmit}>
          Next
        </button>
      </div>
    </div>
  );
};

export default stepFour;
