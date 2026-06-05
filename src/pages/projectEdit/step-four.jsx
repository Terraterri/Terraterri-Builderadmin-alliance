import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import { masterClient, projectClient } from '../../utils/httpClient';
import { toastError } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { setEditProject } from '../../store/slices/ProjectManagementSlice';
import { handleImages3 } from '../../utils/S3Handler';
import { handleImageGcs } from '../../utils/GcsHandler';
import { FaFilePdf } from "react-icons/fa6";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


const StepFour = ({ nextStep, prevStep, type, subType }) => {
    const dispatch = useDispatch();
    const formState = useSelector((state) => state.projectManagement['editProjectData']);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({ ...formState });
    const [formError, setFormError] = useState({});

    const [sgalleryHeader, setgalleryHeader] = useState([]);
    const [fileArray, setFileArray] = useState([]);
    const [images, setImages] = useState([])

    // image preview end
    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleImage = async (e, headerName) => {
        setLoading(true);
        // let resFromMiddleware = await handleImages3(e);
        let resFromMiddleware = await handleImageGcs(e);
        setLoading(false);
        if (resFromMiddleware.clientStatus) {
            if (e.target.name === 'broucher_path') {
                setForm((prevState) => ({
                    ...prevState,
                    [e.target.name]: resFromMiddleware.data.original_file_url
                }));
            } else {
                let fileArrayData = [
                    ...fileArray,
                    { gallery_header_id: e.target.id, file_path: resFromMiddleware.data.original_image_url }
                ];
                setFileArray(fileArrayData);
                setForm((prevState) => ({
                    ...prevState,
                    [e.target.name]: fileArrayData
                }));
            }
        } else {
            toastError(resFromMiddleware.data);
        }
    };


    const validate = () => {
        let isValid = true;
        const error = {};
        console.log('form', form);
        if (!form?.file_path?.[0]?.file_path) {
            error.file_path0 = 'Display Image is required';
            isValid = false;
        }
        if (!form?.broucher_path) {
            error.broucher_path = 'Broucher is required';
            isValid = false;
        }
        setFormError(error);
        return isValid;
    };

    const handleSubmit = () => {
        if (validate()) {
            nextStep();
            dispatch(setEditProject(form));
        } else {
            console.log(formError);
            toastError('Please Enter Mandatory fields')
        }
    };

    //get Gallery Headers
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
    }, [fileArray]);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            ...formState
        }));
    }, [formState]);

    const handleDeleteImage = async (headId, id) => {
        setLoading(true)
        try {
            let res = await projectClient.delete(`listing-gallery/${id}`);
            if (res?.data?.status) {
                getProjectImages()
                const updatedFileArray = fileArray.filter((item) => item.gallery_header_id != headId);
                setFileArray(updatedFileArray);
                setForm((prevState) => ({
                    ...prevState,
                    file_path: updatedFileArray
                }));
            }
        } catch (err) {
            console.log('error =>', err);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (fileArray) {
            const imgArray = Array.from({ length: 8 }, (_, index) => {
                const found = fileArray.find((item) => item.gallery_header_id == index);
                return {
                    id: `${index}`,
                    dbId: found?.id || null,
                    image: found?.file_path || null
                };
            });
            console.log(imgArray)
            setImages(imgArray);
        }
    }, [fileArray]);

    // ? get added gallery images
    const getProjectImages = async () => {
        try {
            const res = await projectClient.get('listing-gallery');
            if (res?.data?.status) {
                console.log('form id', form?.id)
                const data = res?.data?.data.filter(img => img.project_listing_id == form.id);
                const isFormGalleryEmpty = !form?.file_path || form.file_path.length === 0;

                console.log('images data', data)

                if (isFormGalleryEmpty) {
                    setFileArray(data);
                    setForm((prevState) => ({ ...prevState, file_path: data }));
                } else {
                    setFileArray(form?.file_path)
                    setForm((prevState) => ({ ...prevState, file_path: data }))
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getProjectImages()
        getVideoUrls()
    }, [])


    const getVideoUrls = async () => {
        setLoading(false)
        try {
            const res = await projectClient.get('listing-video-links');
            if (res?.data?.status) {
                const data = res?.data?.data.filter(video => video.project_listing_id == form.id)
                if (data.length > 0) {

                    const isFormVideosEmpty = form?.video1 || form?.video2;

                    if (!isFormVideosEmpty) {
                        setForm((prev) => ({ ...prev, video1: data[0].video1, video2: data[0].video2 }))
                    } else {
                        setForm((prev) => ({ ...prev, video1: form?.video1, video2: form?.video2 }))
                    }

                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }


    const ImageUpload = ({ id, dbId, image, onImageChange, onDeleteImage }) => {
        return (
            <div className="col-md-3">
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
                        <button className="btn btn-danger removebtn" onClick={() => onDeleteImage(id, dbId)}>
                            Delete Image
                        </button>
                    </div>
                )
                }
            </div >

        );
    };

    return (
        <div>
            {loading && <Loader />}
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Project Gallery</h4></div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="row mb-5">
                            <h4 className="disp_titl">Display Image</h4>
                            {images.map(({ id, dbId, image }) => (
                                <ImageUpload
                                    key={id}
                                    id={id}
                                    dbId={dbId}
                                    image={image}
                                    onImageChange={handleImage}
                                    onDeleteImage={handleDeleteImage}
                                />
                            ))}
                        </div>

                        {(subType == '7' || subType == '8' || subType == '13' || subType == '15') && (
                            <div>
                                <h3 className="unitclass">Unit Gallery</h3>
                                <Tabs>
                                    <TabList>
                                        {sgalleryHeader.map((header, index) => (
                                            <Tab key={index}>{header.name}</Tab>
                                        ))}
                                    </TabList>
                                    {sgalleryHeader.map((header, index) => (
                                        <TabPanel key={index}>
                                            <div className="mb-50">
                                                <div className="row justify-content-center mb-20">
                                                    <p>Upload images for {header.name}</p>
                                                    <div className="row">
                                                        <ImageUpload
                                                            id={header.id}
                                                            dbId={fileArray?.filter((item) => item.gallery_header_id == header.id)?.[0]?.id || ''}
                                                            image={fileArray?.filter((item) => item.gallery_header_id == header.id)?.[0]?.file_path || ''}
                                                            onImageChange={handleImage}
                                                            onDeleteImage={handleDeleteImage}
                                                        />
                                                        <ImageUpload
                                                            id={header.id}
                                                            dbId={fileArray?.filter((item) => item.gallery_header_id == header.id)?.[1]?.id || ''}
                                                            image={fileArray?.filter((item) => item.gallery_header_id == header.id)?.[1]?.file_path || ''}
                                                            onImageChange={handleImage}
                                                            onDeleteImage={handleDeleteImage}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </TabPanel>
                                    ))}
                                </Tabs>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="row video_broucher_row">
                <div className="card col-md-6">
                    <div className="card-header ">
                        <h4 className="card-title">Videos</h4></div>
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
                                    <label htmlFor="video1" className="fw-normal">
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
                                    <label htmlFor="video2" className="fw-normal">
                                        Video 2 URL
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

export default StepFour;
