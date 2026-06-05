import React, { useState, useEffect, useContext } from 'react';
import Loader from '../../components/Loader';
import { projectClient, masterClient } from '../../utils/httpClient';
import { toastSuccess, toastError } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { setEditProject } from '../../store/slices/ProjectManagementSlice';
import { useNavigate } from 'react-router-dom';
const StepFive = ({ nextStep, prevStep, type, subType, stepOne }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const formState = useSelector((state) => state.projectManagement['editProjectData']);
    const [loading, setLoading] = useState(false);
    const [posStatus, setPosStatus] = useState([]);
    const [form, setForm] = useState({ ...formState });
    const [formError, setFormError] = useState({});
    const userData = useSelector((state) => state.user.userData);

    //get Possession Status
    const getPossStatus = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('possessionstatus');
            if (res?.data?.status) {
                setPosStatus(res?.data?.data);
            }
        } catch (error) {
            console.log('error result=====', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        dispatch(setEditProject({ ...formState, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        if (!validate()) {
            console.log(formError);
            toastWarning('Please Enter Mandatory Fields');
            return;
        }

        setLoading(true);

        try {
            const apiData1 = {
                ...form,
                listed_by: 2,
                created_by_type: 1,
                updated_by_type: userData.role_id,
                community_type_id: form.community_type_id || "0",
                property_size_representation_id: form.property_size_representation_id || 0,
                project_status: "A"
            };

            const apiData2 = form.unitDetails?.map((unit) => ({
                project_listing_id: form.id,
                id: unit.id,
                villa_type: unit.villatype,
                villa_type_id: unit.villa_type_id,
                farm_house_type_id: unit.farm_house_type_id,
                property_facing_id: unit.property_facing_id,
                property_bhk_size_id: unit.property_bhk_size_id,
                super_built_up_area: unit.super_built_up_area,
                carpet_area: unit.carpet_area,
                floor_level: unit.floor_level,
                car_parkings: unit.car_parkings,
                balconies: unit.balconies,
                bathrooms: unit.bathrooms,
                uds: unit.uds || 0,
                property_uds_size_id: unit.property_uds_size_id || "1",
                plot_size: unit.plot_size,
                property_size_id: unit.property_size_id,
                length: unit.plot_length,
                width: unit.plot_breadth,
                dimension_representation: unit.dimension_representation,
                north_facing_road_width_in_fts: unit.north_facing_road_width_in_fts,
                currency: unit.currency,
                base_price: unit.base_price,
                total_base_price: unit.total_base_price,
                amenities_charges: 0,
                car_parking_charges: unit.car_parking_charges,
                club_house_charges: unit.club_house_charges,
                corpus_fund: unit.corpus_fund,
                advance_maintenance_charges: unit.advance_maintenance_charges,
                advance_maintenance_for_months: unit.advance_maintenance_for_months,
                legal_charges: unit.legal_charges,
                others_1_charges_name: unit.others_1_charges_name,
                others_1_charges: unit.others_1_charges,
                others_2_charges_name: unit.others_2_charges_name,
                others_2_charges: unit.others_2_charges,
                others_3_charges_name: unit.others_3_charges_name,
                others_3_charges: unit.others_3_charges,
                estimated_total_price: unit.estimated_total_price,
                gst_charges: unit.gst_charges,
                registration_charges: unit.registration_charges,
                floor_plan_path: unit.floor_plan_path,
                created_by_type: 1
            }));

            const saveImages = async (id) => {
                if (!form.file_path?.length) return;

                const payload = {
                    payload: form.file_path.map((item) => ({
                        id: item.id,
                        gallery_header_id: item.gallery_header_id,
                        thumbnail_path: item.file_path,
                        metadata: 'test',
                        project_listing_id: id,
                        file_path: item.file_path,
                        created_by_type: 1,
                        order: 1
                    }))
                };

                try {
                    const res = await projectClient.post('gallery-update', payload);
                    res.data.status ? toastSuccess('Updated Successfully') : toastError('Error in saving Gallery Images Data');
                    navigate('/projects/master');
                } catch {
                    toastError('Error in saving Images Data');
                }
            };

            const saveAmenities = async (id) => {
                if (!form.amenities_id?.length) {
                    await saveSpecialFeatures(id);
                    return;
                }

                const payload = {
                    payload: form.amenities_id.map((item) => ({
                        amenities_id: item.id,
                        project_listing_id: id,
                        id: item.paramId
                    }))
                };

                try {
                    await projectClient.post(`update-listing-amenities/${id}`, payload);
                } catch {
                    toastError('Error in saving Amenities Data');
                }
                await saveSpecialFeatures(id);
            };

            const saveSpecialFeatures = async (id) => {
                if (!form.special_feature_id?.length) {
                    await saveBanks(id);
                    return;
                }

                const payload = {
                    payload: form.special_feature_id.map((item) => ({
                        special_feature_id: item.id,
                        project_listing_id: id,
                        id: item.paramId
                    }))
                };

                try {
                    await projectClient.post(`update-special-features/${id}`, payload);
                } catch {
                    toastError('Error in saving Special Features');
                }
                await saveBanks(id);
            };

            const saveBanks = async (id) => {
                if (!form.bank_id?.length) {
                    await saveFurnished(id);
                    return;
                }

                const payload = {
                    payload: form.bank_id.map((item) => ({
                        bank_id: item.id,
                        project_listing_id: id,
                        id: item.paramId
                    }))
                };

                try {
                    await projectClient.post(`update-banks/${id}`, payload);
                } catch {
                    toastError('Error in saving Bank Data');
                }
                await saveFurnished(id);
            };

            const saveFurnished = async (id) => {
                const furnished_items = form.furnishedName?.map((item) => ({ item })) || [];
                const additional_furnished_list = form.furnished_id?.map((item) => ({ furnished: item.furnished })) || [];

                if (!furnished_items.length) {
                    await saveCkEditor(id);
                    await saveVideos(id);
                    return;
                }

                const payload = {
                    project_listing_id: id,
                    furnished_items,
                    additional_furnished_list
                };

                try {
                    await projectClient.post('update-furnished', payload);
                } catch {
                    toastError('Error in saving Furnished Data');
                }

                await saveCkEditor(id);
                await saveVideos(id);
            };

            const saveVideos = async (id) => {
                const payload = {
                    project_listing_id: id,
                    video1: form.video1,
                    video2: form.video2,
                    created_by_type: '1'
                };

                if (!form.video1 && !form.video2) {
                    // toastError('No Videos Added');
                    return;
                }

                try {
                    const res = await projectClient.post('listing-video-links', payload);
                    if (res.data.status) toastSuccess('Data Saved Successfully');
                } catch {
                    toastError('Error in saving Videos');
                }
            };

            const saveCkEditor = async (id) => {
                if (!form.specifications?.length) return;

                const payload = {
                    payload: form.specifications.map((item) => ({
                        project_listing_id: id,
                        specifications_id: item.headId,
                        description: item.description,
                        id: item.id
                    }))
                };

                try {
                    const res = await projectClient.post(`update-specifications/${id}`, payload);
                    if (res.data.status && form.furnishedStatus !== 'Furnished') {
                        await saveVideos(id);
                    }
                } catch {
                    toastError('Error in saving Specifications');
                }
            };

            // MAIN API CALLS
            const resApi1 = await projectClient.patch(`listing-data/${form.id}`, apiData1);
            if (resApi1?.data?.status) {
                await projectClient.post(`update-units`, { payload: apiData2 });
                const projectListingId = resApi1?.data?.data?.id;
                await saveImages(projectListingId);
                await saveAmenities(projectListingId);
            } else {
                toastError('Error in saving Project Data');
            }

        } catch (error) {
            toastError('Something went wrong');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        getPossStatus();
    }, []);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            ...formState
        }));
    }, [formState]);

    const validate = () => {
        let isValid = true;
        const error = {};
        if (!form.possession_status_id) {
            error.possession_status_id = 'Posession status is required';
            isValid = false;
        }
        setFormError(error);
        return isValid;
    };

    return (
        <div>
            {loading && <Loader />}
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Posession status</h4>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-4">
                            <div className="form-floating">
                                <select
                                    className="form-select"
                                    name="possession_status_id"
                                    required
                                    onChange={handleChange}
                                    value={formState.possession_status_id || ''}>
                                    <option value="default"> Select Possession Status</option>
                                    {posStatus.map((item, index) => (
                                        <option key={index} value={item.id}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {formError.possession_status_id && (
                                <p className="err">{formError.possession_status_id}</p>
                            )}
                        </div>
                        {formState.possession_status_id == 6 && (
                            <>
                                <div className="mb-3 col-4">
                                    <div className="form-floating">
                                        <input
                                            type="date"
                                            id="project-type"
                                            className="form-control"
                                            name="possession_by"
                                            placeholder=""
                                            onChange={handleChange}
                                            value={formState.possession_by || ''}
                                        />
                                        <label htmlFor="project-type" className="fw-normal">
                                            Year Built{' '}
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-3 col-4">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            id="age_of_possession"
                                            className="form-control"
                                            name="age_of_possession"
                                            placeholder=""
                                            onChange={handleChange}
                                            value={formState.age_of_possession || ''}
                                        />
                                        <label htmlFor="project-type" className="fw-normal">
                                            Age of Property{' '}
                                        </label>
                                    </div>
                                </div>
                            </>
                        )}

                        {(formState.possession_status_id == 7 || formState.possession_status_id == 8) && (
                            <div className="mb-3 col-4">
                                <div className="form-floating">
                                    <input
                                        type="date"
                                        id="possession_by"
                                        className="form-control"
                                        name="possession_by"
                                        placeholder=""
                                        onChange={handleChange}
                                        value={formState.possession_by || ''}
                                    />
                                    <label htmlFor="project-type" className="fw-normal">
                                        Possession By{' '}
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Project Visibility</h4>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-12 mb-2">
                            <h5 className="mb-3">Do you want to show the project?</h5>
                        </div>

                        <div className="col-auto">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="showYes"
                                    name="showProject"
                                    onChange={handleChange}
                                    value="1"
                                    checked={formState?.is_active === 'A'}
                                />
                                <label className="form-check-label" htmlFor="showYes">
                                    Yes
                                </label>
                            </div>
                        </div>

                        <div className="col-auto">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    id="showNo"
                                    name="showProject"
                                    onChange={handleChange}
                                    value="0"
                                    checked={formState?.is_active === 'I'}
                                />
                                <label className="form-check-label" htmlFor="showNo">
                                    No
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Property Posted by</h4>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-4">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    id="posted_by"
                                    className="form-control"
                                    name="posted_by"
                                    required
                                    disabled={true}
                                    onChange={handleChange}
                                    value={userData.first_name || ''}
                                />
                                <label htmlFor="from" className="fw-normal">
                                    Property posted by
                                </label>
                            </div>
                        </div>
                        <div className='col-4'>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    id="posted_by"
                                    className="form-control"
                                    name="posted_name"
                                    required
                                    onChange={handleChange}
                                    value={form.posted_name || ''}
                                />
                                <label htmlFor="posted_name" className="fw-normal">
                                    Name
                                </label>
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
                    Submit
                </button>
            </div>
        </div>
    );
};

export default StepFive;