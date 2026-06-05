import React, { useState, useEffect, useContext, useCallback } from 'react';
import Loader from '../../components/Loader';
import { masterClient } from '../../utils/httpClient';
import { Offcanvas } from 'react-bootstrap';
import { toastSuccess, toastError, toastWarning, date } from '../../utils/toast';
import { IpInfoContext } from '../../utils/context';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { BiCloset } from 'react-icons/bi';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { setProject } from '../../store/slices/ProjectManagementSlice';
import { useDispatch, useSelector } from 'react-redux';
import { handleImages3 } from '../../utils/S3Handler';
import Dropzone from 'react-dropzone';

const stepTwo = ({ nextStep, prevStep, type, subType }) => {
    console.log('subType', subType);
    const dispatch = useDispatch();
    const formState = useSelector((state) => state.projectManagement['project']);

    const [approvals, setApprovals] = useState([]);
    const [approvalTypes, setApprovalTypes] = useState([]);
    const [communitis, setCommunities] = useState([]);
    const [saleableAres, setSaleableArea] = useState([]);
    const [propertyFacing, setPropertyFacing] = useState([]);
    const [bhkSize, setBhkSize] = useState([]);
    const [loading, setLoading] = useState(false);
    const { ipInfo } = useContext(IpInfoContext);
    const [form, setForm] = useState({ unitDetails: [], ...formState });
    const [formError, setFormError] = useState({});
    const [propertySize, setPropertySize] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [carParking, setCarParking] = useState([]);
    const [balconies, setBalconies] = useState([]);
    const [bathrooms, setBathrooms] = useState([]);
    const [unitClone, setUnitClone] = useState(1);
    const [tabSwitch, setTabSwitch] = useState(false);
    const [unitDetails, setUnitDetails] = useState([]);

    // ---------------------------- static --------------------------------------

    const [showApprovals, setShowApprovals] = useState(false);
    const [addApprovalCount, setAddApprovalCount] = useState(0);
    const maxAddApprovalCount = 3; // Set the maximum limit here


    // ------------------------- variables for date format -----------------------
    const [selectedApproval_year, setselectedApproval_year] = useState('');
    const [selectedREA_year, setselectedREA_year] = useState('');

    const handleAddApprovalClick = () => {
        setAddApprovalCount((prevCount) => prevCount + 1);

        if (addApprovalCount < maxAddApprovalCount) {
            setShowApprovals(true);
            const newApprovals = [...approvals, { key: approvals.length + 1 }];
            setApprovals(newApprovals);
        }
    };

    // ---------------------------- static --------------------------------------

    //get Approval Authority
    const getApprovalAuthority = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('approval-authority');
            if (res?.data?.status) {
                const filter = res?.data?.data.filter((item) => item.city_code == formState.city_code);
                setApprovalTypes(filter);
            }
        } catch (error) {
            console.log('error ===>', error);
        } finally {
            setLoading(false);
        }
    };

    //get Community Types
    const getCommunityTypes = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('communityTypes');
            if (res?.data?.status) {
                setCommunities(res?.data?.data);
            }
        } catch (error) {
            console.log('error ===>', error);
        } finally {
            setLoading(false);
        }
    };

    //get Saleable Area Representation
    const getSaleableArea = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('saleable-area-representation');
            if (res?.data?.status) {
                setSaleableArea(res?.data?.data);
            }
        } catch (error) {
            console.log('error ===>', error);
        } finally {
            setLoading(false);
        }
    };

    //get Property Facing
    const getPropertyFacing = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('propertyfacing');
            console.log('get Property Facings===', res);
            if (res?.data?.status) {
                setPropertyFacing(res?.data?.data);
            }
        } catch (error) {
            console.log('error ===>', error);
        } finally {
            setLoading(false);
        }
    };

    //get BHK Sizes
    const getBHKsizes = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('bhksizes');
            if (res?.data?.status) {
                setBhkSize(res?.data?.data);
            }
        } catch (error) {
            console.log('error ===>', error);
        } finally {
            setLoading(false);
        }
    };

    // get property sizes
    const getPropertySizes = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('/propertysizes');
            if (res.data?.status) {
                setPropertySize(res.data?.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };



    // Function to handle date change
    const handleDateChange = (event) => {
        const { name, value } = event.target;

        if (name === 'real_estate_approval_year') {
            setselectedREA_year(value)
        }

        if (name === 'approval_year') {
            setselectedApproval_year(value)
        }

        const dateObj = new Date(value);
        if (!isNaN(dateObj.getTime())) {
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            const formatted = `${day}-${month}-${year}`;
            setForm((prevForm) => ({ ...prevForm, [name]: formatted }));
        }
    };




    const handleChange = (e, formIndex) => {
        const { name, value } = e.target;
        if (e.target.dataset.id === 'unitDetailsData') {
            let updatedUnitDetails;
            if (unitDetails.length === 0 || formIndex >= unitDetails.length) {
                updatedUnitDetails = [...unitDetails, { [name]: value }];
            } else {
                updatedUnitDetails = unitDetails.map((item, index) => {
                    if (index === formIndex) {
                        return { ...item, [name]: value };
                    }
                    return item;
                });
            }
            setUnitDetails(updatedUnitDetails);
            setForm((prevForm) => ({ ...prevForm, unitDetails: updatedUnitDetails }));
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleImage = async (e, index) => {
        setLoading(true);
        let resFromMiddleware = await handleImages3(e);
        console.log('resFromMiddleware===', resFromMiddleware);
        setLoading(false);
        if (resFromMiddleware.clientStatus) {
            if (index !== undefined) {
                setForm((prev) => ({
                    ...prev,
                    unitDetails: prev.unitDetails.map((unit, i) =>
                        i == index
                            ? { ...unit, [e.target.name]: resFromMiddleware.data.original_image_url }
                            : unit
                    )
                }));
                setUnitDetails(
                    unitDetails.map((unit, i) =>
                        i == index
                            ? { ...unit, [e.target.name]: resFromMiddleware.data.original_image_url }
                            : unit
                    )
                );
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

    console.log('form', form);

    const handleCalEstPr = (i) => {
        console.log(`form?.unitDetails[${i}]`, form?.unitDetails);
        const updatedUnitDetails = calculateTotalEstimatePrice(form?.unitDetails);
        setForm((prevForm) => ({ ...prevForm, ...formState, unitDetails: updatedUnitDetails }));
    };

    const calculateTotalEstimatePrice = useCallback((unitDetails) => {
        console.log('its a function to make arithmetic', unitDetails);
        console.log('its a function to make arithmetic', typeof unitDetails);

        const updatedUnitDetails = unitDetails.map((unit) => {
            const totalBasePrice = Number(unit.total_base_price) || 0;
            const amenitiesCharges = Number(unit.amenities_charges) || 0;
            const carParkingCharges = Number(unit.car_parking_charges) || 0;
            const clubHouseCharges = Number(unit.club_house_charges) || 0;
            const corpusFund = Number(unit.corpus_fund) || 0;
            const advanceMaintenanceCharges = Number(unit.advance_maintenance_charges) || 0;
            const legalCharges = Number(unit.legal_charges) || 0;
            const others1Charges = Number(unit.others_1_charges) || 0;
            const others2Charges = Number(unit.others_2_charges) || 0;

            const totalEstimatePrice =
                totalBasePrice +
                amenitiesCharges +
                carParkingCharges +
                clubHouseCharges +
                corpusFund +
                advanceMaintenanceCharges +
                legalCharges +
                others1Charges +
                others2Charges;

            const percentage = Math.round(totalEstimatePrice * 0.05);
            const registrationChargePercentage = Math.round(totalEstimatePrice * 0.061);

            // Return the updated unit object
            return {
                ...unit,
                estimated_total_price: totalEstimatePrice,
                registration_charges: registrationChargePercentage,
                gst_charges: percentage
            };
        });

        // Return the updated unit details array
        return updatedUnitDetails;
    }, []);

    useEffect(() => {
        if (form.unitDetails.length > 0) {
            const updatedUnitDetails = calculateTotalEstimatePrice(form.unitDetails);
        }
    }, [form.unitDetails, formState]);


    useEffect(() => {
        if (unitClone > 1) {
            window.scrollTo(0, 1200);
        }
    }, [unitClone])

    const validate = () => {
        let isValid = true;
        const errors = {};

        if (form.approval_authority === 'default' || !form.approval_authority) {
            errors.approval_authority = 'Approval Authority is required';
            isValid = false;
        }
        if (!form.real_estate_authority) {
            errors.real_estate_authority = 'Real Estate Authority is required';
            isValid = false;
        }
        if (!form.total_project_land_area) {
            errors.total_project_land_area = 'Total Project Land Area is required';
            isValid = false;
        }
        if (!form.total_project_land_area_size_id) {
            errors.total_project_land_area_size_id = 'Total Project Land Area Size is required';
            isValid = false;
        }
        if (!form.totalNumberOfBlocks && subType == '7') {
            errors.totalNumberOfBlocks = 'Total Number Of Blocks is required';
            isValid = false;
        }
        if (!form.numberOfFloorsBlocks && subType == '7') {
            errors.numberOfFloorsBlocks = 'Number Of Floors/Block is required';
            isValid = false;
        }
        if (!form.project_layout_document_path) {
            errors.project_layout_document_path = 'Project Layout Plan is required';
            isValid = false;
        }
        if (!form.community_type_id && (subType !== "13" && subType !== "15")) {
            errors.community_type_id = 'Community Type is required';
            isValid = false;
        }
        if (!form.property_size_representation_id && subType != "9") {
            errors.property_size_representation_id = 'Property Size Representation is required';
            isValid = false;
        }
        if (!form.property_min_size) {
            errors.property_min_size = 'Property Min Size is required';
            isValid = false;
        }
        if (!form.property_max_size) {
            errors.property_max_size = 'Property Max Size is required';
            isValid = false;
        }
        if (!form.sizeRepresentation) {
            errors.sizeRepresentation = 'Size Representation is required';
            isValid = false;
        }
        if (!form.project_description) {
            errors.project_description = 'Project Description is required';
            isValid = false;
        }
        if (!form.unitDetails || form.unitDetails.length === 0) {
            errors.unitDetailsError = 'UnitDetails is Required';
            isValid = false;
        }

        if (form.unitDetails) {
            errors.unitDetails = [];

            form.unitDetails.forEach((unit, index) => {
                let unitErrors = {};

                if (!unit.property_facing_id || unit.property_facing_id === 'default') {
                    unitErrors['property_facing_id'] = 'Property Facing is required';
                    isValid = false;
                }
                if (!unit.property_bhk_size_id && subType == '7') {
                    unitErrors['property_bhk_size_id'] = 'Property BHK Size is required';
                    isValid = false;
                }
                if (!unit.super_built_up_area && subType !== "9") {
                    unitErrors['super_built_up_area'] = 'Super Built Up Area is required';
                    isValid = false;
                }
                if (!unit.carpet_area && subType !== "9") {
                    unitErrors['carpet_area'] = 'Carpet Area is required';
                    isValid = false;
                }
                if (!unit.car_parkings && subType !== "9") {
                    unitErrors['car_parkings'] = 'Car Parking is required';
                    isValid = false;
                }
                if (!unit.balconies && subType !== "9") {
                    unitErrors['balconies'] = 'Balconies are required';
                    isValid = false;
                }
                if (!unit.bathrooms && subType !== "9") {
                    unitErrors['bathrooms'] = 'Bathrooms are required';
                    isValid = false;
                }
                if (!unit.floor_plan_path) {
                    unitErrors['floor_plan_path'] = 'Floor Plan is required';
                    isValid = false;
                }
                if (!unit.villatype && subType == '8') {
                    unitErrors['villa_type'] = 'Villa Type is required';
                    isValid = false;
                }
                if (!unit.plot_size && (subType == '8' || subType == "9")) {
                    unitErrors['plot_size'] = 'Plot Size is required';
                    isValid = false;
                }
                if (!unit.plot_length && (subType == '8' || subType == "9")) {
                    unitErrors['plot_length'] = 'Plot length is required';
                    isValid = false;
                }
                if (!unit.plot_breadth && (subType == '8' || subType == "9")) {
                    unitErrors['plot_breadth'] = 'Plot breadth is required';
                    isValid = false;
                }

                if (!unit.base_price) {
                    unitErrors['base_price'] = 'Base Price is required';
                    isValid = false;
                }
                if (!unit.total_base_price) {
                    unitErrors['total_base_price'] = 'Total Base Price is required';
                    isValid = false;
                }

                if (!unit.car_parking_charges && subType !== "9") {
                    unitErrors['car_parking_charges'] = 'Car Parking Charges are required';
                    isValid = false;
                }
                if (!unit.club_house_charges && (subType !== "13" && subType !== "15")) {
                    unitErrors['club_house_charges'] = 'Club House Charges are required';
                    isValid = false;
                }
                if (!unit.corpus_fund) {
                    unitErrors['corpus_fund'] = 'Corpus Fund is required';
                    isValid = false;
                }
                if (!unit.advance_maintenance_charges) {
                    unitErrors['advance_maintenance_charges'] = 'Advance Maintenance Charges are required';
                    isValid = false;
                }
                if (!unit.advance_maintenance_for_months) {
                    unitErrors['advance_maintenance_for_months'] =
                        'Advance Maintenance For Months is required';
                    isValid = false;
                }

                if (Object.keys(unitErrors).length > 0) {
                    errors.unitDetails[index] = unitErrors;
                }
            });
        }

        if (!form.floorRaising && !subType == '8') {
            errors.floorRaising = 'Floor Raising is required';
            isValid = false;
        }
        if (!form.preffered_location_charges_facing_per_sft) {
            errors.preffered_location_charges_facing_per_sft =
                'Preferred Location Charges (Facing per sqft) are required';
            isValid = false;
        }
        if (!form.preffered_location_charges_corner_per_sft) {
            errors.preffered_location_charges_corner_per_sft =
                'Preferred Location Charges (Corner per sqft) are required';
            isValid = false;
        }
        if (!form.months && subType == '7') {
            errors.months = 'Months are required';
            isValid = false;
        }

        console.log('errors', errors);
        console.log('errors', JSON.stringify(errors, null, 2));
        setFormError(errors);
        return isValid;
    };

    const blurValidation = (e, i) => {
        let newErrors = {};
        if (e.target.name === 'property_max_size') {
            console.log('blurred on max size');
            let minSizeValue = form.property_min_size;
            if (Number(e.target.value) < Number(minSizeValue)) {
                newErrors = { ...newErrors, property_max_size: 'Max size should be greater than min size' };
            } else {
                newErrors = { ...newErrors, property_max_size: '' };
            }
        }

        if (e.target.name === 'property_bhk_size_id') {
            let bhkValue = bhkSize.find((item) => item.id == e.target.value);
            setAttributes({
                minSize: bhkValue?.min_size,
                maxSize: bhkValue?.max_size,
                bathrooms: bhkValue?.no_of_bathrooms,
                balconies: bhkValue?.no_of_balconies,
                car_parkings: bhkValue?.no_of_parkings
            });
        }

        if (e.target.name == 'plot_size') {
            if (!(
                Number(e.target.value) >= Number(form.property_min_size) &&
                Number(e.target.value) <= Number(form.property_max_size)
            )) {
                newErrors = {
                    ...newErrors,
                    plot_size: `The value is not within the range specified by property min and max sizes`
                };
            } else {
                newErrors = {
                    ...newErrors,
                    plot_size: ""
                };
            }
        }

        if (e.target.name == 'super_built_up_area') {
            let minSize = attributes.minSize;
            let maxSize = attributes.maxSize;

            console.log('super', minSize, maxSize);

            if (
                !(Number(e.target.value) >= minSize && Number(e.target.value) <= maxSize) &&
                subType == '7'
            ) {
                newErrors = {
                    ...newErrors,
                    super_built_up_area: `Super built up area should be between ${minSize} and ${maxSize}`
                };
            } else if (
                !(
                    Number(e.target.value) >= Number(form.property_min_size) &&
                    Number(e.target.value) <= Number(form.property_max_size)
                )
            ) {
                console.log('form error', Number(form.property_min_size));

                newErrors = {
                    ...newErrors,
                    super_built_up_area: `The value is not within the range specified by property min and max sizes`
                };
            } else {
                newErrors = {
                    ...newErrors,
                    super_built_up_area: ''
                };
            }
        }

        if (e.target.name == 'carpet_area') {
            if (Number(form.unitDetails[i].super_built_up_area) < Number(e.target.value)) {
                newErrors = {
                    ...newErrors,
                    carpet_area: 'Carpet area should be less than super built up area'
                };
            } else {
                newErrors = {
                    ...newErrors,
                    carpet_area: ''
                };
            }
        }

        if (e.target.name == 'base_price') {
            if (form.property_size_representation_id == 9) {
                let basePrice = e.target.value;
                let totalBasePrice = Number(basePrice) * Number(form.unitDetails[i].super_built_up_area);
                setForm((prevForm) => ({
                    ...prevForm,
                    unitDetails: prevForm.unitDetails.map((unit, index) =>
                        index === i ? { ...unit, total_base_price: totalBasePrice } : unit
                    )
                }));

                setUnitDetails((prevUnitDetails) =>
                    prevUnitDetails.map((unit, index) =>
                        index === i ? { ...unit, total_base_price: totalBasePrice } : unit
                    )
                );

                // form.total_base_price = totalBasePrice;
                console.log('total base price===', totalBasePrice);
            } else if (form.property_size_representation_id == 10) {
                let basePrice = e.target.value;
                let totalBasePrice = Number(basePrice) * Number(form.unitDetails[i].carpet_area);
                setForm((prevForm) => ({
                    ...prevForm,
                    unitDetails: prevForm.unitDetails.map((unit, index) =>
                        index === i ? { ...unit, total_base_price: totalBasePrice } : unit
                    )
                }));

                setUnitDetails((prevUnitDetails) =>
                    prevUnitDetails.map((unit, index) =>
                        index === i ? { ...unit, total_base_price: totalBasePrice } : unit
                    )
                );

                console.log('total base price===', totalBasePrice);
            } else if (subType == "9") {


                let basePrice = e.target.value;
                let totalBasePrice = Number(basePrice) * Number(form.unitDetails[i].plot_size);
                setForm((prevForm) => ({
                    ...prevForm,
                    unitDetails: prevForm.unitDetails.map((unit, index) =>
                        index === i ? { ...unit, total_base_price: totalBasePrice } : unit
                    )
                }));

                setUnitDetails((prevUnitDetails) =>
                    prevUnitDetails.map((unit, index) =>
                        index === i ? { ...unit, total_base_price: totalBasePrice } : unit
                    )
                );


            }
        }

        setFormError({ ...formError, ...newErrors });
    };

    const handleSubmit = () => {
        // if (validate()) {
        dispatch(setProject(form));
        nextStep();
        // } else {
        //     toastError('Please Enter Mandatory fields')
        // }
    };

    useEffect(() => {
        getApprovalAuthority();
        getCommunityTypes();
        getSaleableArea();
        getPropertyFacing();
        getBHKsizes();
        getPropertySizes();

        if (form.unitDetails.length > 0) {
            setUnitDetails(form?.unitDetails);
        }
    }, []);

    console.log('formError', formError);

    return (
        <div>
            {loading && <Loader />}
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Approval Authorities</h4>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col">
                            <div className="form-floating">
                                <select
                                    className="form-select"
                                    name="approval_authority"
                                    required
                                    onChange={handleChange}
                                    value={form.approval_authority || ''}>
                                    <option value="default">Approval Authority</option>
                                    {approvalTypes.map((approve, index) => (
                                        <option key={index} value={approve.name}>
                                            {approve.name}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor="size-representation" className="fw-normal">
                                    Approval authority <span className='req'>*</span>
                                </label>
                                {formError.approval_authority && (
                                    <p className="text-danger">{formError.approval_authority}</p>
                                )}
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    id="approval-number"
                                    className="form-control"
                                    name="approval_number"
                                    placeholder="Enter Enter"
                                    required
                                    onChange={handleChange}
                                    value={form.approval_number || ''}
                                />
                                <label htmlFor="approval-number" className="fw-normal">
                                    Approval Number
                                </label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-floating">
                                <input
                                    type="date"
                                    id="year-of-approval"
                                    className="form-control"
                                    name="approval_year"
                                    placeholder="Enter Enter"
                                    required
                                    onChange={handleDateChange}
                                    value={selectedApproval_year || ''}
                                />
                                <label htmlFor="year-of-approval" className="fw-normal">
                                    Year Of Approval
                                </label>
                            </div>
                        </div>
                        <div className="col">
                            {form?.approval_document_path === undefined ? (
                                <div className="form-floating">
                                    <input
                                        type="file"
                                        id="bank-logo"
                                        className="form-control"
                                        name="approval_document_path"
                                        accept="image/*"
                                        required
                                        onChange={handleImage}
                                    />

                                    <label htmlFor="project-type" className="fw-normal">
                                        Upload Document
                                    </label>
                                </div>
                            ) : (
                                <div className="col-md-12 imgclass">
                                    <img src={form?.approval_document_path} width="150" height="80" />
                                    <button className="btn btn-danger removebtn">Delete Image</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col">
                            <div className="form-floating">
                                <select
                                    className="form-select"
                                    name="real_estate_authority"
                                    required
                                    onChange={handleChange}
                                    value={form.real_estate_authority || ''}>
                                    <option value="default">Real Estate Authority</option>
                                    <option value="RERA">RERA</option>
                                    <option value="RERA 2">RERA 2</option>
                                </select>
                                <label htmlFor="size-representation" className="fw-normal">
                                    Real-estate authority <span className='req'>*</span>
                                </label>
                            </div>
                            {formError.real_estate_authority && (
                                <p className="text-danger">{formError.real_estate_authority}</p>
                            )}
                        </div>
                        <div className="col">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    id="approval-number"
                                    className="form-control"
                                    name="real_estate_approval_number"
                                    placeholder="Enter Enter"
                                    required
                                    value={form.real_estate_approval_number || ''}
                                    onChange={handleChange}
                                />
                                <label htmlFor="approval-number" className="fw-normal">
                                    Approval Number
                                </label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-floating">
                                <input
                                    type="date"
                                    id="year-of-approval"
                                    className="form-control"
                                    name="real_estate_approval_year"
                                    placeholder="Enter Enter"
                                    required
                                    value={selectedREA_year || ''}
                                    onChange={handleDateChange}
                                />
                                <label htmlFor="year-of-approval" className="fw-normal">
                                    Year Of Approval
                                </label>
                            </div>
                        </div>
                        <div className="col">
                            {form?.real_estate_approval_document_path === undefined ? (
                                <div className="form-floating">
                                    <input
                                        type="file"
                                        id="bank-logo"
                                        className="form-control"
                                        name="real_estate_approval_document_path"
                                        accept="image/*"
                                        required
                                        onChange={handleImage}
                                    />
                                    <label htmlFor="project-type" className="fw-normal">
                                        Upload Document
                                    </label>
                                </div>
                            ) : (
                                <div className="col-md-12 imgclass">
                                    <img src={form?.real_estate_approval_document_path} width="150" height="80" />
                                    <button className="btn btn-danger removebtn">Delete Image</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {showApprovals &&
                        addApprovalCount == 1 &&
                        approvals.map((approval, index) => (
                            <div className="row mb-3" key={index}>
                                <div className="col">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            id="approval-name"
                                            className="form-control"
                                            name="other_1_approval_name"
                                            placeholder="Enter Enter"
                                            required
                                            onChange={handleChange}
                                            value={form.other_1_approval_name || ''}
                                        />
                                        <label htmlFor="approval-name" className="fw-normal">
                                            Enter Approval Name
                                        </label>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-floating">
                                        <input
                                            type="number"
                                            id="approval-number"
                                            className="form-control"
                                            name="other_1_approval_number"
                                            placeholder="Enter Enter"
                                            required
                                            onChange={handleChange}
                                            value={form.other_1_approval_number || ''}
                                        />
                                        <label htmlFor="approval-number" className="fw-normal">
                                            Approval Number
                                        </label>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-floating">
                                        <input
                                            type="date"
                                            id="year-of-approval"
                                            className="form-control"
                                            name="other_1_approval_year"
                                            placeholder="Enter Enter"
                                            required
                                            onChange={handleChange}
                                            value={form.other_1_approval_year || ''}
                                        />
                                        <label htmlFor="year-of-approval" className="fw-normal">
                                            Year Of Approval
                                        </label>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-floating">
                                        <input
                                            type="file"
                                            id="bank-logo"
                                            className="form-control"
                                            name="other_1_approval_document_path"
                                            accept="image/*"
                                            required
                                            onChange={handleImage}
                                        />
                                        <label htmlFor="project-type" className="fw-normal">
                                            Upload Document
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    {showApprovals &&
                        addApprovalCount == 2 &&
                        approvals.map((approval, index) => (
                            <div className="row mb-3" key={index}>
                                <div className="col">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            id="approval-name"
                                            className="form-control"
                                            name="other_2_approval_name"
                                            placeholder="Enter Enter"
                                            required
                                            value={form.other_2_approval_name || ''}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="approval-name" className="fw-normal">
                                            Enter Approval Name
                                        </label>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-floating">
                                        <input
                                            type="number"
                                            id="approval-number"
                                            className="form-control"
                                            name="other_2_approval_number"
                                            placeholder="Enter Enter"
                                            required
                                            value={form.other_2_approval_number || ''}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="approval-number" className="fw-normal">
                                            Approval Number
                                        </label>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-floating">
                                        <input
                                            type="date"
                                            id="year-of-approval"
                                            className="form-control"
                                            name="other_2_approval_year"
                                            placeholder="Enter Enter"
                                            required
                                            value={form.other_2_approval_year || ''}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="year-of-approval" className="fw-normal">
                                            Year Of Approval
                                        </label>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-floating">
                                        <input
                                            type="file"
                                            id="bank-logo"
                                            className="form-control"
                                            name="other_2_approval_document_path"
                                            accept="image/*"
                                            required
                                            onChange={handleImage}
                                        />
                                        <label htmlFor="project-type" className="fw-normal">
                                            Upload Document
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}

                    {showApprovals &&
                        addApprovalCount == 3 &&
                        approvals.map((approval, index) => (
                            <div className="row mb-3" key={index}>
                                <div className="col">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            id="approval-name"
                                            className="form-control"
                                            name="other_3_approval_name"
                                            placeholder="Enter Enter"
                                            required
                                            value={form.other_3_approval_name || ''}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="approval-name" className="fw-normal">
                                            Enter Approval Name
                                        </label>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-floating">
                                        <input
                                            type="number"
                                            id="approval-number"
                                            className="form-control"
                                            name="other_3_approval_number"
                                            placeholder="Enter Enter"
                                            required
                                            value={form.other_3_approval_number || ''}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="approval-number" className="fw-normal">
                                            Approval Number
                                        </label>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-floating">
                                        <input
                                            type="date"
                                            id="year-of-approval"
                                            className="form-control"
                                            name="other_3_approval_year"
                                            placeholder="Enter Enter"
                                            required
                                            value={form.other_3_approval_year || ''}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="year-of-approval" className="fw-normal">
                                            Year Of Approval
                                        </label>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="form-floating">
                                        <input
                                            type="file"
                                            id="bank-logo"
                                            className="form-control"
                                            name="other_3_approval_document_path"
                                            accept="image/*"
                                            required
                                            onChange={handleImage}
                                        />
                                        <label htmlFor="project-type" className="fw-normal">
                                            Upload Document
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}

                    {addApprovalCount < maxAddApprovalCount && (
                        <div className="row mb-3">
                            <div className="form-floating">
                                <button className="btn btn-primary" onClick={handleAddApprovalClick}>
                                    Add Other Approval
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Project Details</h4>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col-4">
                            <div className="form-floating">
                                <input
                                    type="number"
                                    id="total-project-landarea"
                                    className="form-control"
                                    name="total_project_land_area"
                                    placeholder="Enter Enter"
                                    required
                                    value={form.total_project_land_area || ''}
                                    onChange={handleChange}
                                />
                                <label htmlFor="total-project-landarea" className="fw-normal">
                                    Total Project Land Area <span className='req'>*</span>
                                </label>
                            </div>
                            {formError.total_project_land_area && (
                                <p className="text-danger">{formError.total_project_land_area}</p>
                            )}
                        </div>
                        <div className="col-4">
                            <div className="form-floating">
                                <select
                                    className="form-select"
                                    name="total_project_land_area_size_id"
                                    required
                                    onChange={handleChange}
                                    value={form.total_project_land_area_size_id || ''}>
                                    <option value="Sq Ft">Select Land area representation</option>
                                    {propertySize.map((item, index) => (
                                        <option value={item.id} key={index}>{item.name}</option>
                                    ))}
                                </select>
                                <label htmlFor="size-representation" className="fw-normal">
                                    Land area representation <span className='req'>*</span>
                                </label>
                            </div>
                            {formError.total_project_land_area_size_id && (
                                <p className="text-danger">{formError.total_project_land_area_size_id}</p>
                            )}
                        </div>
                    </div>

                    {(subType === '7' || subType === '8' || subType === '9') && (
                        <div className="row mb-3">
                            <div className="col-4 mb-3">
                                <div className="form-floating ">
                                    <select
                                        className="form-select"
                                        name="community_type_id"
                                        required
                                        onChange={handleChange}
                                        value={form.community_type_id || ''}>
                                        <option value="default">Select Community Type</option>
                                        {communitis.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="size-representation" className="fw-normal">
                                        Community type <span className='req'>*</span>
                                    </label>
                                    {formError.community_type_id && (
                                        <p className="text-danger">{formError.community_type_id}</p>
                                    )}
                                </div>
                            </div>

                            {formError.totalNumberOfUnits && (
                                <p className="text-danger">{formError.totalNumberOfUnits}</p>
                            )}
                        </div>
                    )}

                    {(subType === '7' || subType === '13' || subType === '15') && (
                        <div className="row">
                            <div className="col-4 mb-3">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        id="total-no-of-blocks"
                                        className="form-control"
                                        name="totalNumberOfBlocks"
                                        placeholder="Enter Enter"
                                        required
                                        value={form.totalNumberOfBlocks || ''}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="total-no-of-blocks" className="fw-normal">
                                        Total Number Of Blocks <span className='req'>*</span>
                                    </label>
                                </div>
                                {formError.totalNumberOfBlocks && (
                                    <p className="text-danger">{formError.totalNumberOfBlocks}</p>
                                )}
                            </div>
                            <div className="col-4 mb-3">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        id="total-no-of-floor-blocks"
                                        className="form-control"
                                        name="numberOfFloorsBlocks"
                                        placeholder="Enter Enter"
                                        required
                                        value={form.numberOfFloorsBlocks || ''}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="total-no-of-floor-blocks" className="fw-normal">
                                        Number Of Floors/Block <span className='req'>*</span>
                                    </label>
                                </div>
                                {formError.numberOfFloorsBlocks && (
                                    <p className="text-danger">{formError.numberOfFloorsBlocks}</p>
                                )}
                            </div>
                            <div className="col-4 mb-3">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        id="total-number-of-units"
                                        className="form-control"
                                        name="totalNumberOfUnits"
                                        placeholder="Enter Enter"
                                        required
                                        value={form.totalNumberOfUnits || ''}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="total-number-of-units" className="fw-normal">
                                        Total Number Of Units <span className='req'>*</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {subType === '8' && (
                        <div className="row">
                            <div className="col-4 mb-3">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        id="total-number-of-units"
                                        className="form-control"
                                        name="totalNumberOfVillas"
                                        placeholder="Enter Enter"
                                        required
                                        value={form.totalNumberOfVillas || ''}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="total-number-of-units" className="fw-normal">
                                        Total Number Of Villas
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {subType === '9' && (

                        <div className="row">
                            <div className="col-4 mb-3">
                                <div className="form-floating">
                                    <input
                                        type="number"
                                        id="total-number-of-units"
                                        className="form-control"
                                        name="total_no_of_units"
                                        required
                                        onChange={handleChange}
                                        value={form.total_no_of_units || ''}
                                    />
                                    <label htmlFor="total-number-of-units" className="fw-normal">
                                        Total Number Of untis
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="row">
                        <h1 className="card-title mb-3 unitclass"> {subType == 13 ? "Mall Layout Plan" : subType == "15" ? "IT Park Layout Plan" : " Project Layout Plan"}</h1>

                        <div className="col-4 mb-3">
                            {form?.project_layout_document_path === undefined ? (
                                <div className="form-floating mb-3">
                                    <input
                                        type="file"
                                        id="project-layout-plan"
                                        className="form-control"
                                        name="project_layout_document_path"
                                        accept="image/*"
                                        required
                                        onChange={handleImage}
                                    />
                                    <label htmlFor="project-layout-plan" className="fw-normal">
                                        {subType == 13 ? "Mall Layout Plan" : " Project Layout Plan"} <span className='req'>*</span>
                                    </label>
                                </div>
                            ) : (
                                <div className="col-md-12 imgclass">
                                    {/* <label className="fw-normal imgprevclass">Image Preview</label> */}
                                    <img src={form?.project_layout_document_path} width="150" height="80" />
                                    <button className="btn btn-danger removebtn">Delete Image</button>
                                </div>
                            )}
                            {formError.project_layout_document_path && (
                                <p className="text-danger">{formError.project_layout_document_path}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-3">
                        <h1 className="card-title mb-3 unitclass">Description </h1>
                        <CKEditor
                            editor={ClassicEditor}
                            name="project_description"
                            data={form.project_description}
                            onReady={(editor) => {
                                // You can store the "editor" and use when it is needed.
                                console.log('Editor is ready to use!', editor);
                            }}
                            // value={form.project_description}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                // projectDescription(data);
                                setForm({ ...form, project_description: data });
                                console.log({ event, editor, data });
                            }}
                        />

                        {formError.project_description && (
                            <p className="text-danger">{formError.project_description}</p>
                        )}
                    </div>

                    <div className="row mb-3">
                        <div className="row"></div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Unit Sizes</h4>
                </div>
                <div className="card-body">
                    {
                        subType !== "9" && (


                            <div className="row">
                                <div className="form-floating mb-3 col-4">
                                    <select
                                        className="form-select"
                                        name="property_size_representation_id"
                                        required
                                        onChange={handleChange}
                                        value={form.property_size_representation_id || ''}>
                                        <option value="default">Saleable Area Representation</option>
                                        {saleableAres.map((item, index) => (
                                            <option key={index} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor="size-representation" className="fw-normal">
                                        Saleable area representation <span className='req'>*</span>
                                    </label>
                                    {formError.property_size_representation_id && (
                                        <p className="text-danger">{formError.property_size_representation_id}</p>
                                    )}
                                </div>
                            </div>

                        )
                    }

                    <div className="row mb-3">
                        <div className="col">
                            <div className="form-floating">
                                <input
                                    type="number"
                                    id="flat-min-size"
                                    className="form-control"
                                    name="property_min_size"
                                    placeholder="Enter Enter"
                                    required
                                    value={form.property_min_size || ''}
                                    onChange={handleChange}
                                />
                                <label htmlFor="flat-min-size" className="fw-normal">
                                    {subType == 7
                                        ? 'Flat Size Min'
                                        : subType == 9
                                            ? 'Plot Size Min'
                                            : subType == 8
                                                ? 'Villa Size Min'
                                                : 'Unit Size Min'} <span className='req'>*</span>
                                </label>
                            </div>
                            {formError.property_min_size && (
                                <p className="text-danger">{formError.property_min_size}</p>
                            )}
                        </div>
                        <div className="col">
                            <div className="form-floating">
                                <input
                                    type="number"
                                    id="flat-max-size"
                                    className="form-control"
                                    name="property_max_size"
                                    placeholder="Enter Enter"
                                    required
                                    value={form.property_max_size || ''}
                                    onChange={handleChange}
                                    onBlur={blurValidation}
                                />
                                <label htmlFor="flat-max-size" className="fw-normal">
                                    {subType == 7
                                        ? 'Flat Size Max'
                                        : subType == 9
                                            ? 'Plot Size Max'
                                            : subType == 8
                                                ? 'Villa Size Max'
                                                : 'Unit Size Max'} <span className='req'>*</span>
                                </label>
                            </div>
                            {formError.property_max_size && (
                                <p className="text-danger">{formError.property_max_size}</p>
                            )}
                        </div>
                        <div className="col">
                            <div className="form-floating">
                                <select
                                    className="form-select"
                                    name="sizeRepresentation"
                                    required
                                    onChange={handleChange}
                                    value={form.sizeRepresentation || ''}>
                                    <option value="default">Select Size Representation</option>
                                    <option value="sq.ft">sq.ft</option>
                                    {subType == 9 &&
                                        <>
                                            <option value="sq.yards">sq.yards</option>
                                            <option value="Acre">Acre</option>
                                        </>
                                    }
                                </select>
                                <label htmlFor="size-representation" className="fw-normal">
                                    Size Representation <span className='req'>*</span>
                                </label>
                            </div>
                            {formError.sizeRepresentation && (
                                <p className="text-danger">{formError.sizeRepresentation}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Unit Details</h4>
                </div>
                <div className="card-body">
                    <Tabs>
                        <TabList>
                            {Array.from({ length: unitClone }).map((_, i) => (
                                <Tab key={i}  >{`unit - ${i + 1}`} </Tab>
                            ))}
                            <Tab className="btn plus-btn" onClick={() => {
                                setUnitClone(unitClone + 1)
                                window.scrollTo(0, 2000);
                            }}>
                                Add Unit
                            </Tab>
                        </TabList>
                        {Array.from({ length: unitClone }).map((_, i) => (
                            <TabPanel key={i}>
                                <div className="mt-3">
                                    <h1 className="card-title mb-3 unitclass">Please enter unit - {i + 1} details</h1>
                                    {formError.unitDetailsError && (
                                        <p className="text-danger">{formError.unitDetailsError}</p>
                                    )}
                                </div>
                                <div className="row mb-3">
                                    <div className="col-3 mb-3">
                                        <div className="form-floating">
                                            <select
                                                className="form-select"
                                                name="property_facing_id"
                                                data-id="unitDetailsData"
                                                required
                                                onChange={(e) => handleChange(e, i)}
                                                value={
                                                    (form.unitDetails[i] && form.unitDetails[i]?.property_facing_id) || ''
                                                }>
                                                <option value="default">Select Facing</option>
                                                {propertyFacing.map((item, index) => (
                                                    <option key={index} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <label htmlFor="size-representation" className="fw-normal">
                                                Select facing <span className='req'>*</span>
                                            </label>
                                        </div>
                                        {formError?.property_facing_id && (
                                            <p className="text-danger">{formError?.property_facing_id}</p>
                                        )}
                                    </div>
                                    {subType == '7' && (
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <select
                                                    className="form-select"
                                                    name="property_bhk_size_id"
                                                    required
                                                    onChange={(e) => handleChange(e, i)}
                                                    data-id="unitDetailsData"
                                                    value={
                                                        (form.unitDetails[i] && form.unitDetails[i]?.property_bhk_size_id) || ''
                                                    }
                                                    onBlur={blurValidation}>
                                                    <option value="default">Select BHK Size</option>
                                                    {bhkSize.map((item, index) => (
                                                        <option key={index} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <label htmlFor="size-representation" className="fw-normal">
                                                    Select BHK Sizes <span className='req'>*</span>
                                                </label>
                                            </div>
                                            {formError?.property_bhk_size_id && (
                                                <p className="text-danger">{formError?.property_bhk_size_id}</p>
                                            )}
                                        </div>
                                    )}
                                    {subType == '8' && (
                                        <div className="col-3">
                                            <div className="form-floating">
                                                <select
                                                    className="form-select"
                                                    name="villatype"
                                                    required
                                                    data-id="unitDetailsData"
                                                    onChange={(e) => handleChange(e, i)}
                                                    value={(form.unitDetails[i] && form.unitDetails[i]?.villatype) || ''}>
                                                    <option value="default">Villa Type</option>
                                                    <option value="Duplex">Duplex</option>
                                                    <option value="Simplex">Simplex</option>
                                                    <option value="Triplex">Triplex</option>
                                                </select>
                                                <label htmlFor="size-representation" className="fw-normal">
                                                    Villa Type <span className='req'>*</span>
                                                </label>
                                            </div>
                                            {formError.unitDetails?.[i]?.villa_type && (
                                                <p className="text-danger">{formError.unitDetails?.[i]?.villa_type}</p>
                                            )}
                                        </div>
                                    )}
                                    {
                                        subType == "8" && (
                                            <div className=" row mb-3 ">
                                                <div className="form-floating col-3">
                                                    <select
                                                        className="form-select"
                                                        name="property_bhk_size_id"
                                                        required
                                                        onChange={(e) => handleChange(e, i)}
                                                        data-id="unitDetailsData"
                                                        value={
                                                            (form.unitDetails[i] && form.unitDetails[i]?.property_bhk_size_id) || ''
                                                        }
                                                        onBlur={blurValidation}>
                                                        <option value="default">Bedrooms</option>
                                                        {bhkSize.map((item, index) => (
                                                            <option key={index} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <label htmlFor="size-representation" className="fw-normal">
                                                        Select BHK <span className='req'>*</span>
                                                    </label>
                                                </div>
                                                {formError?.property_bhk_size_id && (
                                                    <p className="text-danger">{formError?.property_bhk_size_id}</p>
                                                )}
                                            </div>
                                        )
                                    }
                                    {(subType == '8' || subType == '9') && (
                                        <div className="row mt-3">
                                            <div className="col-3 mb-3">
                                                <div className="form-floating">
                                                    <input
                                                        type="number"
                                                        data-id="unitDetailsData"
                                                        className="form-control"
                                                        name="plot_size"
                                                        placeholder="Enter Enter"
                                                        required
                                                        value={(form.unitDetails[i] && form.unitDetails[i]?.plot_size) || ''}
                                                        onChange={(e) => handleChange(e, i)}
                                                        onBlur={blurValidation}
                                                    />
                                                    <label htmlFor="super-buildup-area" className="fw-normal">
                                                        Plot Size <span className='req'>*</span>
                                                    </label>
                                                </div>
                                                {formError.plot_size && (
                                                    <p className="text-danger">{formError.plot_size}</p>
                                                )}
                                            </div>
                                            <div className="col-3 mb-3">
                                                <div className="form-floating">
                                                    <select
                                                        className="form-select"
                                                        name="plot_size_representation"
                                                        required
                                                        onChange={handleChange}
                                                        value={form.plot_size_representation || ''}>
                                                        <option value="default">Select Size Representation</option>
                                                        <option value="sq.ft">sq.ft</option>
                                                        <option value="sq.yards">sq.yards</option>
                                                    </select>

                                                    <label htmlFor="size-representation" className="fw-normal">
                                                        Size Representation <span className='req'>*</span>
                                                    </label>
                                                </div>
                                                {formError.unitDetails?.[i]?.plot_size_representation && (
                                                    <p className="text-danger">
                                                        {formError.unitDetails?.[i]?.plot_size_representation}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {(subType == '9' || subType == '8') && (
                                        <div className="row">
                                            <h5 className="fw-normal">Dimensions</h5>
                                            <div className="col-3 mb-3">
                                                <div className="form-floating">
                                                    <input
                                                        type="number"
                                                        data-id="unitDetailsData"
                                                        className="form-control"
                                                        name="plot_length"
                                                        placeholder="Enter Enter"
                                                        required
                                                        value={(form.unitDetails[i] && form.unitDetails[i]?.plot_length) || ''}
                                                        onChange={(e) => handleChange(e, i)}
                                                    />
                                                    <label htmlFor="super-buildup-area" className="fw-normal">
                                                        Length <span className='req'>*</span>
                                                    </label>
                                                </div>
                                                {formError.unitDetails?.[i]?.plot_length && (
                                                    <p className="text-danger">{formError.unitDetails?.[i]?.plot_length}</p>
                                                )}
                                            </div>
                                            <div className="flex flex-col col-1 ">
                                                <h5 className=" ">×</h5>
                                            </div>

                                            <div className="col-3 mb-3">
                                                <div className="form-floating">
                                                    <input
                                                        type="number"
                                                        data-id="unitDetailsData"
                                                        className="form-control"
                                                        name="plot_breadth"
                                                        placeholder="Enter Enter"
                                                        required
                                                        value={(form.unitDetails[i] && form.unitDetails[i]?.plot_breadth) || ''}
                                                        onChange={(e) => handleChange(e, i)}
                                                    />
                                                    <label htmlFor="super-buildup-area" className="fw-normal">
                                                        Breadth <span className='req'>*</span>
                                                    </label>
                                                </div>
                                                {formError.unitDetails?.[i]?.plot_breadth && (
                                                    <p className="text-danger">{formError.unitDetails?.[i]?.plot_breadth}</p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {(subType !== '9') && (
                                    <div className="row mb-3">
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="number"
                                                    data-id="unitDetailsData"
                                                    className="form-control"
                                                    name="super_built_up_area"
                                                    placeholder="Enter Enter"
                                                    required
                                                    value={
                                                        (form.unitDetails[i] && form.unitDetails[i]?.super_built_up_area) || ''
                                                    }
                                                    onChange={(e) => handleChange(e, i)}
                                                    onBlur={(e) => blurValidation(e, i)}
                                                />
                                                <label htmlFor="super-buildup-area" className="fw-normal">
                                                    Super Build Up Area <span className='req'>*</span>
                                                </label>
                                            </div>
                                            {formError?.super_built_up_area && (
                                                <p className="text-danger">{formError?.super_built_up_area}</p>
                                            )}
                                        </div>
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="number"
                                                    data-id="unitDetailsData"
                                                    className="form-control"
                                                    name="carpet_area"
                                                    placeholder="Enter Enter"
                                                    required
                                                    value={(form.unitDetails[i] && form.unitDetails[i]?.carpet_area) || ''}
                                                    onChange={(e) => handleChange(e, i)}
                                                    onBlur={(e) => blurValidation(e, i)}
                                                />
                                                <label htmlFor="carpet-area" className="fw-normal">
                                                    Carpet Area <span className='req'>*</span>
                                                </label>
                                            </div>
                                            {formError?.carpet_area && (
                                                <p className="text-danger">{formError?.carpet_area}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {
                                    subType !== "9" && (
                                        <div className="row mb-3">
                                            <div className="col-3 mb-3">
                                                <div className="form-floating">
                                                    <select
                                                        className="form-select"
                                                        data-id="unitDetailsData"
                                                        name="car_parkings"
                                                        required
                                                        onChange={(e) => handleChange(e, i)}
                                                        value={(form.unitDetails[i] && form.unitDetails[i]?.car_parkings) || ''}>
                                                        <option value="default">Car Parking</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3 </option>
                                                    </select>
                                                    <label htmlFor="size-representation" className="fw-normal">
                                                        No.of Car Parkings <span className='req'>*</span>
                                                    </label>
                                                </div>
                                                {formError.unitDetails?.[i]?.car_parkings && (
                                                    <p className="text-danger">{formError.unitDetails?.[i]?.car_parkings}</p>
                                                )}
                                            </div>
                                            <div className="col-3 mb-3">
                                                <div className="form-floating">
                                                    <select
                                                        className="form-select"
                                                        data-id="unitDetailsData"
                                                        name="balconies"
                                                        required
                                                        onChange={(e) => handleChange(e, i)}
                                                        value={(form.unitDetails[i] && form.unitDetails[i]?.balconies) || ''}>
                                                        <option value="default">Balconies</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                    </select>
                                                    <label htmlFor="size-representation" className="fw-normal">
                                                        No.of balconies <span className='req'>*</span>
                                                    </label>
                                                </div>
                                                {formError.unitDetails?.[i]?.balconies && (
                                                    <p className="text-danger">{formError.unitDetails[i]?.balconies}</p>
                                                )}
                                            </div>
                                            <div className="col-3 mb-3">
                                                <div className="form-floating">
                                                    <select
                                                        className="form-select"
                                                        data-id="unitDetailsData"
                                                        name="bathrooms"
                                                        required
                                                        onChange={(e) => handleChange(e, i)}
                                                        value={(form.unitDetails[i] && form.unitDetails[i]?.bathrooms) || ''}>
                                                        <option value="default">Bathrooms</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3 </option>
                                                    </select>
                                                    <label htmlFor="size-representation" className="fw-normal">
                                                        No.of bathrooms <span className='req'>*</span>
                                                    </label>
                                                </div>
                                                {formError.unitDetails?.[i]?.bathrooms && (
                                                    <p className="text-danger">{formError.unitDetails?.[i]?.bathrooms}</p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                }
                                {subType == '7' && (
                                    <div className="row mb-3">
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    data-id="unitDetailsData"
                                                    className="form-control"
                                                    name="uds"
                                                    placeholder="Enter Enter"
                                                    required
                                                    onChange={(e) => handleChange(e, i)}
                                                    value={(form.unitDetails[i] && form.unitDetails[i]?.uds) || ''}
                                                />
                                                <label htmlFor="uds" className="fw-normal">
                                                    UDS
                                                </label>
                                            </div>
                                            {formError.unitDetails?.[i]?.uds && (
                                                <p className="text-danger">{formError?.unitDetails?.uds}</p>
                                            )}
                                        </div>
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <select
                                                    className="form-select"
                                                    data-id="unitDetailsData"
                                                    name="property_uds_size_id"
                                                    required
                                                    onChange={(e) => handleChange(e, i)}
                                                    value={
                                                        (form.unitDetails[i] && form.unitDetails[i]?.property_uds_size_id) || ''
                                                    }>
                                                    <option value="1">UDS Unit</option>
                                                    <option value="2">Sq</option>
                                                    <option value="3">Sq Meter</option>
                                                    <option value="4">Sq Yard</option>
                                                    <option value="5">Sq ft</option>
                                                </select>
                                                <label htmlFor="size-representation" className="fw-normal">
                                                    Select Uds Units
                                                </label>
                                            </div>
                                            {formError.property_uds_size_id && (
                                                <p className="text-danger">{formError.property_uds_size_id}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="Subcard">
                                    <div>
                                        <h1 className="unitclass">
                                            {subType == '7' || subType == '8'
                                                ? '(Floor Plan)'
                                                : subType == '9'
                                                    ? 'Plot Dimension Plan'
                                                    : 'Unit Plan'}{' '}
                                        </h1>
                                    </div>
                                    {form.unitDetails[i]?.floor_plan_path === undefined ? (
                                        <div className="row mb-3">
                                            <div className="col-3 mb-3">
                                                <div className="form-floating">
                                                    <input
                                                        type="file"
                                                        data-id="unitDetailsData"
                                                        className="form-control"
                                                        name="floor_plan_path"
                                                        accept="image/*"
                                                        required
                                                        value={(form.unitDetails[i] && form.unitDetails[i]?.floor_plan_path) || ''}
                                                        onChange={(e) => handleImage(e, i)}
                                                    />
                                                    <label htmlFor="project-type" className="fw-normal">
                                                        {subType == '7' || subType == '8'
                                                            ? '(Floor Plan)'
                                                            : subType == '9'
                                                                ? 'Plot Plan'
                                                                : 'Unit Plan'} <span className='req'>*</span>
                                                    </label>
                                                </div>
                                                {formError.unitDetails?.[i]?.floor_plan_path && (
                                                    <p className="text-danger">
                                                        {formError.unitDetails?.[i]?.floor_plan_path}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="col-md-12 imgclass">
                                            <img src={form.unitDetails[i]?.floor_plan_path} width="150" height="80" />
                                        </div>
                                    )}
                                </div>

                                <div className="Subcard mt-3">
                                    <div>
                                        <h1 className="unitclass">Unit Pricing</h1>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <select
                                                    className="form-select"
                                                    data-id="unitDetailsData"
                                                    name="currency"
                                                    required
                                                    onChange={(e) => handleChange(e, i)}
                                                    value={(form.unitDetails[i] && form.unitDetails[i]?.currency) || ''}>
                                                    <option value="default">Currency</option>
                                                    <option value="INR">INR</option>
                                                    <option value="USD">USD</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="number"
                                                    data-id="unitDetailsData"
                                                    className="form-control"
                                                    name="base_price"
                                                    placeholder="Enter Base Price"
                                                    required
                                                    value={(form.unitDetails[i] && form.unitDetails[i]?.base_price) || ''}
                                                    onChange={(e) => handleChange(e, i)}
                                                    onBlur={(e) => blurValidation(e, i)}
                                                />
                                                <label htmlFor="base-price" className="fw-normal">
                                                    Base Price {subType == '7' || subType == '8' ? '(Per Sq Ft)' : ''} <span className='req'>*</span>
                                                </label>
                                            </div>
                                            {formError.base_price && (
                                                <p className="text-danger">{formError.base_price}</p>
                                            )}
                                        </div>
                                        <div className="col-3 mb-3"></div>
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="number"
                                                    data-id="unitDetailsData"
                                                    className="form-control clrinput clrinputlabel"
                                                    name="total_base_price"
                                                    placeholder="Enter Base Price"
                                                    required
                                                    value={
                                                        (form.unitDetails[i] && form.unitDetails[i]?.total_base_price) || ''
                                                    }
                                                    onChange={(e) => handleChange(e, i)}
                                                    readOnly
                                                />
                                                <label htmlFor="total-base-price" className="fw-normal clrinputlabel">
                                                    Total Base Price
                                                </label>
                                            </div>
                                            {formError.total_base_price && (
                                                <p className="text-danger">{formError.total_base_price}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div>
                                            <h1 className="unitclass mb-3">Amenities Charges</h1>
                                        </div>
                                        {(subType !== "9") && (
                                            <div className="col-3 mb-3">
                                                <div className="form-floating">
                                                    <input
                                                        type="number"
                                                        data-id="unitDetailsData"
                                                        className="form-control"
                                                        name="car_parking_charges"
                                                        placeholder="Enter Base Price"
                                                        required
                                                        value={
                                                            (form.unitDetails[i] && form.unitDetails[i]?.car_parking_charges) ||
                                                            ''
                                                        }
                                                        onChange={(e) => handleChange(e, i)}
                                                        onBlur={handleCalEstPr}
                                                    />
                                                    <label htmlFor="car-parking-chargers" className="fw-normal">
                                                        Car Parking Charges <span className='req'>*</span>
                                                    </label>
                                                </div>
                                                {formError.car_parking_charges && (
                                                    <p className="text-danger">{formError.car_parking_charges}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="row mb-3">
                                        {(subType == '7' || subType == '8' || subType == '9') && (
                                            <div className="col-3 mb-3">
                                                <div className="form-floating">
                                                    <input
                                                        type="number"
                                                        data-id="unitDetailsData"
                                                        className="form-control"
                                                        name="club_house_charges"
                                                        placeholder="Enter Base Price"
                                                        required
                                                        value={
                                                            (form.unitDetails[i] && form.unitDetails[i]?.club_house_charges) || ''
                                                        }
                                                        onChange={(e) => handleChange(e, i)}
                                                        onBlur={handleCalEstPr}
                                                    />
                                                    <label htmlFor="club-house-charges" className="fw-normal">
                                                        Club House Charges <span className='req'>*</span>
                                                    </label>
                                                </div>
                                                {formError.club_house_charges && (
                                                    <p className="text-danger">{formError.club_house_charges}</p>
                                                )}
                                            </div>
                                        )}

                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="number"
                                                    data-id="unitDetailsData"
                                                    className="form-control"
                                                    name="corpus_fund"
                                                    placeholder="Enter Base Price"
                                                    required
                                                    value={(form.unitDetails[i] && form.unitDetails[i]?.corpus_fund) || ''}
                                                    onChange={(e) => handleChange(e, i)}
                                                    onBlur={handleCalEstPr}
                                                />
                                                <label htmlFor="corpus-fund" className="fw-normal">
                                                    Corpus Fund <span className='req'>*</span>
                                                </label>
                                            </div>
                                            {formError.corpus_fund && (
                                                <p className="text-danger">{formError.corpus_fund}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="number"
                                                    data-id="unitDetailsData"
                                                    className="form-control"
                                                    name="advance_maintenance_charges"
                                                    placeholder="Enter Base Price"
                                                    required
                                                    value={
                                                        (form.unitDetails[i] &&
                                                            form.unitDetails[i]?.advance_maintenance_charges) ||
                                                        ''
                                                    }
                                                    onChange={(e) => handleChange(e, i)}
                                                    onBlur={handleCalEstPr}
                                                />
                                                <label htmlFor="maintenance-charges" className="fw-normal">
                                                    Maintenance Charges <span className='req'>*</span>
                                                </label>
                                            </div>
                                            {formError.advance_maintenance_charges && (
                                                <p className="text-danger">{formError.advance_maintenance_charges}</p>
                                            )}
                                        </div>
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <select
                                                    className="form-select"
                                                    data-id="unitDetailsData"
                                                    name="advance_maintenance_for_months"
                                                    required
                                                    onChange={(e) => handleChange(e, i)}
                                                    onBlur={handleCalEstPr}
                                                    value={
                                                        (form.unitDetails[i] &&
                                                            form.unitDetails[i]?.advance_maintenance_for_months) ||
                                                        ''
                                                    }>
                                                    <option value="1">For Months</option>
                                                    <option value="12">12 Months</option>
                                                    <option value="24">24 Months</option>
                                                    <option value="36">36 Months</option>
                                                </select>
                                                <label htmlFor="size-representation" className="fw-normal">
                                                    For Months <span className='req'>*</span>
                                                </label>
                                            </div>
                                        </div>
                                        {formError.advance_maintenance_for_months && (
                                            <p className="text-danger">{formError.advance_maintenance_for_months}</p>
                                        )}
                                    </div>
                                    <div className="row mb-3">
                                        <h1 className="unitclass mb-3">Other charges</h1>
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    data-id="unitDetailsData"
                                                    className="form-control"
                                                    name="others_1_charges_name"
                                                    placeholder="Enter Base Price"
                                                    required
                                                    value={
                                                        (form.unitDetails[i] && form.unitDetails[i]?.others_1_charges_name) ||
                                                        ''
                                                    }
                                                    onChange={(e) => handleChange(e, i)}
                                                />
                                                <label htmlFor="otherCharges1" className="fw-normal">
                                                    Other Charges 1
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="number"
                                                    data-id="unitDetailsData"
                                                    className="form-control"
                                                    name="others_1_charges"
                                                    placeholder="Enter Base Price"
                                                    required
                                                    value={
                                                        (form.unitDetails[i] && form.unitDetails[i]?.others_1_charges) || ''
                                                    }
                                                    onChange={(e) => handleChange(e, i)}
                                                    onBlur={handleCalEstPr}
                                                />
                                                <label htmlFor="amount" className="fw-normal">
                                                    Amount
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    data-id="unitDetailsData"
                                                    className="form-control"
                                                    name="others_2_charges_name"
                                                    placeholder="Enter Base Price"
                                                    required
                                                    value={
                                                        (form.unitDetails[i] && form.unitDetails[i]?.others_2_charges_name) ||
                                                        ''
                                                    }
                                                    onChange={(e) => handleChange(e, i)}
                                                />
                                                <label htmlFor="otherCharges2" className="fw-normal">
                                                    Other Charges 2
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="number"
                                                    data-id="unitDetailsData"
                                                    className="form-control"
                                                    name="others_2_charges"
                                                    placeholder="Enter Base Price"
                                                    required
                                                    value={
                                                        (form.unitDetails[i] && form.unitDetails[i]?.others_2_charges) || ''
                                                    }
                                                    onChange={(e) => handleChange(e, i)}
                                                    onBlur={handleCalEstPr}
                                                />
                                                <label htmlFor="amount" className="fw-normal">
                                                    Amount
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="number"
                                                    data-id="unitDetailsData"
                                                    className="form-control clrinput"
                                                    name="estimated_total_price"
                                                    placeholder="Enter Base Price"
                                                    required
                                                    value={
                                                        (form.unitDetails[i] && form.unitDetails[i]?.estimated_total_price) ||
                                                        ''
                                                    }
                                                />
                                                <label htmlFor="legalCharges" className="fw-normal clrinputlabel">
                                                    Total Estimated Price
                                                </label>
                                            </div>
                                            {formError.estimated_total_price && (
                                                <p className="text-danger">{formError.estimated_total_price}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                        ))}
                        <TabList>
                            {Array.from({ length: unitClone }).map((_, i) => (
                                <Tab key={i}>{`unit - ${i + 1}`}</Tab>
                            ))}
                            {formState.listing_type_id == 1 && (
                                <Tab className="btn plus-btn" onClick={() => {
                                    setUnitClone(unitClone + 1)
                                    window.scrollTo(0, 2000);
                                }}>
                                    Add Unit
                                </Tab>
                            )}
                        </TabList>
                    </Tabs>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h6>Preferred Location Charges</h6>
                </div>
                <div className="card-body">
                    {(subType !== '8' && subType !== "9") && (
                        <div className="row mb-3">
                            <div className="col-3">
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        id="floor-raising"
                                        className="form-control"
                                        name="floorRaising"
                                        placeholder="Enter Base Price"
                                        required
                                        value={form.floorRaising || ''}
                                        onChange={handleChange}
                                    />
                                    <label htmlFor="floor-raising" className="fw-normal">
                                        Floor Raising Charges per sft
                                    </label>
                                </div>
                                {formError.floorRaising && <p className="text-danger">{formError.floorRaising}</p>}
                            </div>

                            <div className="col-3">
                                <div className="form-floating">
                                    <select
                                        className="form-select"
                                        name="months"
                                        required
                                        disabled={form.floorRaising === '0' ? true : false}
                                        onChange={handleChange}
                                        value={form.months || ''}>
                                        <option value="default">Valid From</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10</option>
                                    </select>
                                    <label htmlFor="size-representation" className="fw-normal">
                                        Valid from floor
                                    </label>
                                </div>
                                {formError.months && <p className="text-danger">{formError.months}</p>}
                            </div>
                        </div>
                    )}

                    <div className="row mb-3">
                        <div className="col-3">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    id="east-facing"
                                    className="form-control"
                                    name="preffered_location_charges_facing_per_sft"
                                    placeholder="Enter Base Price"
                                    required
                                    value={form.preffered_location_charges_facing_per_sft || ''}
                                    onChange={handleChange}
                                />
                                <label htmlFor="east-facing" className="fw-normal">
                                    East Facing Charges Per sft
                                </label>
                            </div>
                            {formError.preffered_location_charges_facing_per_sft && (
                                <p className="text-danger">{formError.preffered_location_charges_facing_per_sft}</p>
                            )}
                        </div>
                        <div className="col-3">
                            <div className="form-floating">
                                <input
                                    type="text"
                                    id="corner"
                                    className="form-control"
                                    name="preffered_location_charges_corner_per_sft"
                                    placeholder=""
                                    required
                                    value={form.preffered_location_charges_corner_per_sft || ''}
                                    onChange={handleChange}
                                />
                                <label htmlFor="corner" className="fw-normal">
                                    Corner Unit Charges per sft
                                </label>
                            </div>
                            {formError.preffered_location_charges_corner_per_sft && (
                                <p className="text-danger">{formError.preffered_location_charges_corner_per_sft}</p>
                            )}
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

export default stepTwo;
