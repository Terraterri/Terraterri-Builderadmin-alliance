import React, { useState, useEffect, useContext } from 'react';
import Loader from '../../components/Loader';
import { masterClient, projectClient } from '../../utils/httpClient';
import { toastError } from '../../utils/toast';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { setEditProject } from '../../store/slices/ProjectManagementSlice';
import { useDispatch, useSelector } from 'react-redux';

const StepThree = ({ nextStep, prevStep, type, subType }) => {

    const FurnishedFeatures = [
        { id: 'StereoSystem', value: 'Stereo System' },
        { id: 'DesksandChairs', value: 'Desks and Chairs' },
        { id: 'Sofa', value: 'Sofa' },
        { id: 'Stove', value: 'Stove' },
        { id: 'Fridge', value: 'Fridge' },
        { id: 'Chimney', value: 'Chimney' },
        { id: 'Maditation Hall', value: 'Maditation Hall' }
    ];

    const furnishedNames = [
        { name: 'Lights' },
        { name: 'Fans' },
        { name: 'AC' },
        { name: 'TV' },
        { name: 'Geyser' },
    ];

    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    const formState = useSelector((state) => state.projectManagement['editProjectData']);

    const [banks, setBanks] = useState([]);
    const [form, setForm] = useState({ ...formState });
    const [specificationData, setSpecificationData] = useState([]);
    const [formError, setFormError] = useState({});
    const [amenityValues, setAmenityValues] = useState([]);
    const [specialFeatureValues, setSpecialFeatureValues] = useState([]);
    const [banksValues, setBanksValues] = useState([]);
    const [specificationHeaders, setSpecificationHeaders] = useState([]);
    const [furnishedValues, setFurnishedValues] = useState([]);
    const [furnishedItems, setFurnishedItems] = useState([]);
    const [allocatedAmenities, setAllocatedAmenities] = useState([]);
    const [allocatedFeatures, setAllocatedFeatures] = useState([]);

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


    const getAllocatedAmenities = async () => {
        const payload = {
            allocationType: "Projects",
            property_type_id: form.property_type_id,
            property_sub_type_id: form.property_sub_type_id,
        }
        let res;
        setLoading(true)
        try {
            res = await masterClient.post('get-amenities-by-type', payload);
            if (res?.data.status) {
                setAllocatedAmenities(res?.data.data)
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    const getAllocatedFeatures = async () => {
        const payload = {
            allocationType: "Projects",
            property_type_id: form.property_type_id,
            property_sub_type_id: form.property_sub_type_id,
        }
        let res;
        setLoading(true)
        try {
            res = await masterClient.post('get-features-by-type', payload);
            if (res?.data.status) {
                setAllocatedFeatures(res?.data.data)
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setForm((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const handleCheck = (e) => {
        const { name, value, checked, id } = e.target;
        if (name === 'amenities_id') {
            const updatedAmenities = checked
                ? [...amenityValues, { headId: id, id: value }]
                : amenityValues.filter((amenity) => amenity.id !== value);

            setAmenityValues(updatedAmenities);
            setForm((prevState) => ({
                ...prevState,
                [name]: updatedAmenities
            }));
        } else if (name === 'special_feature_id') {
            const updatedSpecialFeatures = checked
                ? [...specialFeatureValues, { headId: id, id: value }]
                : specialFeatureValues.filter((specialFeature) => specialFeature.id !== value);

            setSpecialFeatureValues(updatedSpecialFeatures);
            setForm((prevState) => ({
                ...prevState,
                [name]: updatedSpecialFeatures
            }));
        } else if (name === 'bank_id') {

            const updatedBanks = checked
                ? [...banksValues, { id: Number(value), paramId: null }]
                : banksValues.filter((bank) => bank.id != value);
            setBanksValues(updatedBanks);
            setForm((prevState) => ({
                ...prevState,
                [name]: updatedBanks
            }));
        } else if (name === 'furnished_id') {
            const updatedFeatures = checked
                ? [...furnishedValues, { id: id, furnished: value }]
                : furnishedValues.filter((feature) => feature.id !== value);
            setFurnishedValues(updatedFeatures);
            setForm((prevState) => ({
                ...prevState,
                [name]: updatedFeatures
            }));
        } else if (name === 'furnishedName') {
            const existingEntry = furnishedItems.find((item) => item.name === id);
            if (existingEntry) {
                setFurnishedItems((prevValues) =>
                    prevValues.map((item) =>
                        item.name === id ? { ...item, value: value } : item
                    )
                );
            } else {
                setFurnishedItems((prevValues) => [
                    ...prevValues,
                    { name: id, value: value },
                ]);
            }
            setForm((prevState) => ({
                ...prevState,
                [name]: furnishedItems
            }));
        }
    };

    const validate = () => {
        let isValid = true;
        const error = {};

        if (subType == '7' || subType == '8' || subType == '15') {
            if (form?.furnishedStatus === 'default' || form?.furnishedStatus === undefined) {
                error.furnishedStatus = 'Furnished Status is required';
                isValid = false;
            }
        }

        if (!form?.amenities_id || form?.amenities_id.length === 0) {
            error.amenities_id = 'Amenities are required';
            isValid = false;
        }

        if (!form?.bank_id || form?.bank_id.length === 0) {
            error.bank_id = 'Banks are required';
            isValid = false;
        }

        if (subType == '7' || subType == '8') {
            if (!form?.special_feature_id || form?.special_feature_id.length === 0) {
                error.special_feature_id = 'Speacial Features are required';
                isValid = false;
            }
        }

        if (subType == '7' || subType == '8' || subType == '15') {
            if (form.furnishedStatus == 'Furnished' && !form.furnished_id && form.furnishedName) {
                error.furnished_id = 'Furnished Items required'
            }
        }

        // if (subType == '7' || subType == '8' || subType == '13' || subType == '15') {
        //     error.special_feature_id = 'Speacial Features are required';
        //     isValid = false;
        // }

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

    useEffect(() => {
        fetchData(() => masterClient.get('banks'), setBanks)
        fetchData(() => masterClient.get('specificationsheader'), setSpecificationHeaders)

        getAllocatedAmenities();
        getAllocatedFeatures();
        getsplfeatures();
        getFurnished();
        getSpecificationsData();
        getProjectAmenities();
        getProjectBanks();
    }, []);

    useEffect(() => {
        setForm((prev) => ({
            ...prev,
            ...formState
        }));
    }, [formState]);

    // ? get furnished data 
    const getFurnished = async () => {
        setLoading(true)
        try {
            const res = await projectClient.get('listing-furnished-mapping');
            if (res?.data?.status) {
                const data = res?.data.data.filter(furnished => furnished.project_listing_id == form.id);
                const furnisheNames = data.feature_names
                const furnished_id = data.furnished

                // Only set unit details from API is empty or uninitialized
                const isFormFurnishedEmpty = !form?.furnisheNames || form.furnished_id.length === 0;

                if (data || isFormFurnishedEmpty) {
                    setForm((prev) => ({ ...prev, furnisheNames: furnisheNames, furnished_id: furnished_id }))
                    setFurnishedItems(furnisheNames)
                    setFurnishedValues(furnished_id)
                } else {
                    setForm((prev) => ({ ...prev, furnisheNames: form?.furnisheNames, furnished_id: form?.furnished_id }))
                    setFurnishedItems(form?.furnisheNames)
                    setFurnishedValues(form?.furnished_id)
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    // ? get specifications data
    const getSpecificationsData = async () => {
        setLoading(true)
        try {
            const res = await projectClient.get('listing-specifications-mappings');
            if (res?.data?.status) {
                const specifications = res?.data.data.filter(spec => spec.project_listing_id == form.id);
                const specsData = specifications.map(spec => ({
                    headId: spec.specifications_id,
                    description: spec.description,
                    id: spec.id
                }))

                const isFormSpecificationsEmpty = !form?.specifications || form.specifications.length === 0;

                if (isFormSpecificationsEmpty) {
                    setForm((prev) => ({ ...prev, specifications: specsData }));
                } else {
                    setForm((prev) => ({ ...prev, specifications: form?.specifications }))
                }

            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    // ? getAllAmenities and set form
    const getProjectAmenities = async () => {
        setLoading(true)
        try {
            const res = await projectClient.get('listing-amenities-mappings');
            if (res?.data?.status) {
                const amenities = res?.data?.data.filter(amenity => amenity.project_listing_id == form.id)
                const amenity_data = amenities.map(amenity => ({
                    id: amenity.amenities_id,
                    paramId: amenity.id
                }));

                const isFormAmenitiesEmpty = !form?.amenities_id || form.amenities_id.length === 0;

                if (isFormAmenitiesEmpty) {
                    setForm((prev) => ({ ...prev, amenities_id: amenity_data }))
                    setAmenityValues(amenity_data)
                } else {
                    setForm((prev) => ({ ...prev, amenities_id: form?.amenities_id }))
                    setAmenityValues(form?.amenities_id)
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    // ? get special features and set form
    const getsplfeatures = async () => {
        setLoading(true)
        try {
            const res = await projectClient.get('listing-special-features-mapping');
            if (res?.data?.status) {
                const data = res?.data?.data.filter(spl => spl.project_listing_id == form.id)
                const spl_features = data.map(spl => ({
                    id: spl.special_feature_id,
                    paramId: spl.id
                }));

                const isFormSpecialFeatEmpty = !form?.special_feature_id || form.special_feature_id.length === 0;
                if (isFormSpecialFeatEmpty) {
                    setForm((prev) => ({ ...prev, special_feature_id: spl_features }))
                    setSpecialFeatureValues(spl_features)
                } else {
                    setSpecialFeatureValues(form?.special_feature_id)
                    setForm((prev) => ({ ...prev, special_feature_id: form?.special_feature_id }))
                }
            }
        } catch (err) {
            console.error(`Error while fetch form special features ${err}`)
        } finally {
            setLoading(false)
        }
    }


    // ? get project added banks 
    const getProjectBanks = async () => {
        setLoading(true)
        try {
            const res = await projectClient.get('listing-bank-mappings');
            if (res?.data?.status) {
                const data = res?.data?.data.filter(bank => bank.project_listing_id == form.id);
                const bank_data = data.map(bank => ({
                    id: bank.bank_id,
                    paramId: bank.id
                }))

                const isFormBanksEmpty = !form?.bank_id || form.bank_id.length === 0;
                if (isFormBanksEmpty) {
                    setForm((prev) => ({ ...prev, bank_id: bank_data }))
                    setBanksValues(bank_data)
                } else {
                    setForm((prev) => ({ ...prev, bank_id: form?.bank_id }))
                    setBanksValues(form?.bank_id)
                }
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
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Water Availability</h4>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col">
                            <div className="form-floating">
                                <select
                                    className="form-select"
                                    name="water_source"
                                    required
                                    onChange={handleChange}
                                    value={form.water_source || ''}
                                >
                                    <option value="default">Select Water Source</option>
                                    <option value="Y">Yes</option>
                                    <option value="N">No</option>
                                </select>

                                <label htmlFor="ground-water-depth" className="fw-normal">
                                    Water Source
                                </label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-floating">
                                <input
                                    type="number"
                                    id="no-of-bore-wells"
                                    className="form-control"
                                    name="number_of_borewells"
                                    placeholder="Enter Number Of Borewells"
                                    required
                                    onChange={handleChange}
                                    value={form?.number_of_borewells || ''}
                                />
                                <label htmlFor="no-of-bore-wells" className="fw-normal">
                                    Number Of Borewells
                                </label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-floating">
                                <input
                                    type="number"
                                    id="ground-water-depth"
                                    className="form-control"
                                    name="ground_water_depth"
                                    placeholder="Enter Base Price"
                                    required
                                    onChange={handleChange}
                                    value={form?.ground_water_depth || ''}
                                />
                                <label htmlFor="ground-water-depth" className="fw-normal">
                                    Ground Water depth (in Ft's)
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {(subType == '7' || subType == '8' || subType == '15') && (
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">Furnishing Status </h4>
                    </div>
                    <div className="card-body">
                        <div className="row mb-3">
                            <div className="col-6 mb-4">
                                <div className="form-floating mt-3 ">
                                    <select
                                        className="form-select"
                                        name="furnishedStatus"
                                        required
                                        onChange={handleChange}
                                        value={form.furnishedStatus || ''}>
                                        <option value="default">Furnished Status </option>
                                        <option value="Furnished">Furnished</option>
                                        <option value="UnFurnished">UnFurnished</option>
                                    </select>
                                    {formError.furnishedStatus && (
                                        <p className="text-danger">{formError.furnishedStatus}</p>
                                    )}
                                </div>
                            </div>

                            {form.furnishedStatus == 'Furnished' && (
                                <div className="col-8">
                                    <div className="row  inputs_ot">
                                        {furnishedNames.map((furnishedN, index) => (
                                            <div className="col-md-2 d-flex" key={index}>
                                                <label>{furnishedN.name} </label>
                                                <input
                                                    type="text"
                                                    name='furnishedName'
                                                    id={furnishedN.name}
                                                    value={form?.furnishedName?.some((a) => a.name == furnishedN.name).value}
                                                    onChange={handleCheck}
                                                />
                                            </div>
                                        ))}

                                    </div>
                                    <div className="row mb-4">
                                        {FurnishedFeatures.map((feature, index) => (
                                            <div className="col-12 col-md-3 col-lg-3" key={index}>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input bankcheckbox"
                                                        type="checkbox"
                                                        name='furnished_id'
                                                        id={feature.id}
                                                        value={feature.value}
                                                        checked={form?.furnished_id?.some((a) => a.furnished == feature.value)}
                                                        onClick={handleCheck}
                                                    />
                                                    <label className="form-check-label fw-medium" htmlFor={feature.id}>
                                                        {feature.value}
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {(subType == '7' || subType == '8' || subType == '13' || subType == '15') && (
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">Specifications</h4>
                    </div>
                    <div className="card-body">
                        <div className="row mb-3">
                            <Tabs>
                                <TabList>
                                    {specificationHeaders.map((header, index) => (
                                        <Tab key={index}>{header.name}</Tab>
                                    ))}
                                </TabList>

                                {specificationHeaders.map((header, index) => (
                                    <TabPanel key={header.id}>
                                        <div className="row justify-content-center">
                                            <div className="col-md-12 mt-3">
                                                <label
                                                    htmlFor={`specification-${header.id}`}
                                                    className="form-label specclass mb-3">
                                                    Please enter the specifications for {header.name} <span className='req'>*</span>
                                                </label>
                                                <div className="form-floating">
                                                    <CKEditor
                                                        editor={ClassicEditor}
                                                        name={`specification-${header.id}`}
                                                        id={header.id}
                                                        data={
                                                            form?.specifications?.find((spec) => spec.headId === header.id)
                                                                ?.description || ''
                                                        }
                                                        onChange={(event, editor) => {
                                                            const data = editor.getData();
                                                            let updatedSpecifications = [...specificationData];
                                                            const specIndex = updatedSpecifications.findIndex(
                                                                (spec) => spec.headId === header.id
                                                            );
                                                            if (specIndex > -1) {
                                                                // Update existing specification
                                                                updatedSpecifications[specIndex] = {
                                                                    ...updatedSpecifications[specIndex],
                                                                    description: data
                                                                };
                                                            } else {
                                                                // Add new specification
                                                                updatedSpecifications.push({
                                                                    headId: header.id,
                                                                    name: header.name,
                                                                    description: data
                                                                });
                                                            }

                                                            setSpecificationData(updatedSpecifications);
                                                            setForm((prevForm) => ({
                                                                ...prevForm,
                                                                specifications: updatedSpecifications
                                                            }));
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </TabPanel>
                                ))}
                            </Tabs>
                        </div>
                    </div>
                </div>
            )}

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Amenities</h4>
                </div>
                <div className="card-body">
                    <div className="row mb-3 amenities_row">
                        {allocatedAmenities.map((property, index) => (
                            <>
                                {property.amenities.map((amenity) => (
                                    <div className="col-md-3 mb-3" key={amenity.header_id}>
                                        <div>
                                            <h6 className="headTag">{amenity.header_name}</h6>
                                        </div>
                                        {amenity.allocatedAmenities.map((item) => (
                                            <div className="form-check" key={item.id}>
                                                <input
                                                    className="form-check-input bankcheckbox"
                                                    type="checkbox"
                                                    name="amenities_id"
                                                    value={item.id || ''}
                                                    id={amenity.header_id}
                                                    onChange={handleCheck}
                                                    checked={form?.amenities_id?.some((a) => a.id == item.id)}
                                                />
                                                <label
                                                    className="form-check-label fw-medium"
                                                    htmlFor={`amenity-${item.id}`}
                                                >
                                                    {item.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </>
                        ))}
                    </div>
                    {formError.amenities_id &&
                        (<p className='text-danger'>{formError?.amenities_id}</p>)
                    }
                </div>
            </div>

            {(subType == '7' || subType == '8') && (
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">Special Features</h4>
                    </div>
                    <div className="card-body">
                        <div className="row mb-3 amenities_row">
                            {allocatedFeatures.map((feature, index) => (
                                <>
                                    {feature.features.map((feature) => (
                                        <div className="col-md-3 mb-3" key={feature.header_id}>
                                            <div>
                                                <h6 className="headTag">{feature.header_name}</h6>
                                            </div>
                                            {feature.allocatedFeatures.map((item) => (
                                                <div className="form-check" key={item.id}>
                                                    <input
                                                        className="form-check-input bankcheckbox"
                                                        type="checkbox"
                                                        name="special_feature_id"
                                                        value={item.id || ''}
                                                        id={feature.header_id}
                                                        onChange={handleCheck}
                                                        checked={form?.special_feature_id?.some((a) => a.id == item.id)}
                                                        required
                                                    />
                                                    <label
                                                        className="form-check-label fw-medium"
                                                        htmlFor={`amenity-${item.id}`}
                                                    >
                                                        {item.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </>
                            ))}
                        </div>
                        {formError.special_feature_id &&
                            (<p className='text-danger'>{formError?.special_feature_id}</p>)
                        }
                    </div>
                </div>
            )}

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Approved Bank Loans</h4>
                </div>
                <div className="card-body">
                    <div className="row mb-8">
                        {banks.map((bank, index) => (
                            <div className="col-3" key={index}>
                                <div className="form-check">
                                    <input
                                        className="form-check-input bankcheckbox"
                                        type="checkbox"
                                        id={bank.id}
                                        name="bank_id"
                                        required
                                        onChange={handleCheck}
                                        value={bank.id}
                                        checked={form?.bank_id?.some((a) => a.id == bank.id)}
                                    />
                                    <label className="form-check-label fw-medium bankclass" htmlFor={bank.id}>
                                        {bank.name}
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                    {formError.bank_id &&
                        (<p className='text-danger'>{formError?.bank_id}</p>)
                    }
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

export default StepThree;
