import React, { useState, useEffect, useCallback } from 'react';
import Loader from '../../components/Loader';
import { masterClient, projectClient } from '../../utils/httpClient';
import { toastError, } from '../../utils/toast';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { setEditProject } from '../../store/slices/ProjectManagementSlice';
import { useDispatch, useSelector } from 'react-redux';
import { handleImages3 } from '../../utils/S3Handler';
import { handleImageGcs } from '../../utils/GcsHandler';
import { CiCircleRemove } from "react-icons/ci";
import { toastWarning } from '../../utils/toast';
const StepTwo = ({ nextStep, prevStep, type, subType }) => {


    const dispatch = useDispatch();

    const formState = useSelector((state) => state.projectManagement['editProjectData']);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({ unitDetails: [], ...formState });
    const [formError, setFormError] = useState({});

    const [approvals, setApprovals] = useState([]);
    const [approvalTypes, setApprovalTypes] = useState([]);
    const [communitis, setCommunities] = useState([]);
    const [saleableAres, setSaleableArea] = useState([]);
    const [propertyFacing, setPropertyFacing] = useState([]);
    const [bhkSize, setBhkSize] = useState([]);

    const [propertySize, setPropertySize] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [unitClone, setUnitClone] = useState(1);
    const [unitDetails, setUnitDetails] = useState([]);

    // ---------------------------- static --------------------------------------
    const [showApprovals, setShowApprovals] = useState(false);
    const [addApprovalCount, setAddApprovalCount] = useState(0);
    const maxAddApprovalCount = 3; // Set the maximum limit here
    // ---------------------------- static --------------------------------------

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
    // ------------------------- variables for date format -----------------------


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
        // let resFromMiddleware = await handleImages3(e);
        let resFromMiddleware = await handleImageGcs(e);
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

    const handleCalEstPr = (i) => {
        const updatedUnitDetails = calculateTotalEstimatePrice(form?.unitDetails);
        setForm((prevForm) => ({ ...prevForm, ...formState, unitDetails: updatedUnitDetails }));
    };

    const calculateTotalEstimatePrice = useCallback((unitDetails) => {
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

    // useEffect(() => {
    //     if (unitClone > 1) {
    //         window.scrollTo(0, 1200);
    //     }
    // }, [unitClone])

    const validate = () => {
        let isValid = true;
        const errors = {};

        const isEmpty = (value) => value === undefined || value === null || value === '' || value === 'default';

        // Basic project-level validations
        if (isEmpty(form.approval_authority)) {
            errors.approval_authority = 'Approval Authority is required';
            isValid = false;
        }

        if (isEmpty(form.real_estate_authority)) {
            errors.real_estate_authority = 'Real Estate Authority is required';
            isValid = false;
        }

        if (isEmpty(form.total_project_land_area)) {
            errors.total_project_land_area = 'Total Project Land Area is required';
            isValid = false;
        }

        if (isEmpty(form.total_project_land_area_size_id)) {
            errors.total_project_land_area_size_id = 'Total Project Land Area Size is required';
            isValid = false;
        }

        if (subType === '7') {
            if (isEmpty(form.totalNumberOfBlocks)) {
                errors.totalNumberOfBlocks = 'Total Number Of Blocks is required';
                isValid = false;
            }

            if (isEmpty(form.numberOfFloorsBlocks)) {
                errors.numberOfFloorsBlocks = 'Number Of Floors/Block is required';
                isValid = false;
            }

            // Uncomment if required later
            // if (isEmpty(form.totalNumberOfUnits)) {
            //   errors.totalNumberOfUnits = 'Total Number Of Units is required';
            //   isValid = false;
            // }
        }

        if (isEmpty(form.project_layout_document_path)) {
            errors.project_layout_document_path = 'Project Layout Plan is required';
            isValid = false;
        }

        if (!['13', '15'].includes(subType) && isEmpty(form.community_type_id)) {
            errors.community_type_id = 'Community Type is required';
            isValid = false;
        }

        if (subType !== '9' && isEmpty(form.property_size_representation_id)) {
            errors.property_size_representation_id = 'Property Size Representation is required';
            isValid = false;
        }

        if (isEmpty(form.property_min_size)) {
            errors.property_min_size = 'Property Min Size is required';
            isValid = false;
        }

        if (isEmpty(form.property_max_size)) {
            errors.property_max_size = 'Property Max Size is required';
            isValid = false;
        }

        if (isEmpty(form.sizeRepresentation)) {
            errors.sizeRepresentation = 'Size Representation is required';
            isValid = false;
        }

        if (isEmpty(form.project_description)) {
            errors.project_description = 'Project Description is required';
            isValid = false;
        }

        if (!form.unitDetails || form.unitDetails.length === 0) {
            errors.unitDetailsError = 'UnitDetails is Required';
            isValid = false;
        }

        // Validate unit details
        if (form.unitDetails) {
            errors.unitDetails = [];

            form.unitDetails.forEach((unit, index) => {
                const unitErrors = {};

                if (isEmpty(unit.property_facing_id)) {
                    unitErrors.property_facing_id = 'Property Facing is required';
                    isValid = false;
                }

                if (subType === '7' && isEmpty(unit.property_bhk_size_id)) {
                    unitErrors.property_bhk_size_id = 'Property BHK Size is required';
                    isValid = false;
                }

                if (subType !== '9') {
                    ['super_built_up_area', 'carpet_area', 'car_parkings', 'balconies', 'bathrooms', 'car_parking_charges'].forEach(field => {
                        if (isEmpty(unit[field])) {
                            unitErrors[field] = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + ' is required';
                            isValid = false;
                        }
                    });
                }

                if (subType === '7') {
                    if (isEmpty(unit.uds)) {
                        unitErrors.uds = 'UDS is required';
                        isValid = false;
                    }
                    if (isEmpty(unit.property_uds_size_id)) {
                        unitErrors.property_uds_size_id = 'UDS Unit is required';
                        isValid = false;
                    }
                }

                if (subType === '8' && isEmpty(unit.villatype)) {
                    unitErrors.villa_type = 'Villa Type is required';
                    isValid = false;
                }

                if ((subType === '8' || subType === '9') && isEmpty(unit.plot_size)) {
                    unitErrors.plot_size = 'Plot Size is required';
                    isValid = false;
                }

                if ((subType === '8' || subType === '9')) {
                    if (isEmpty(unit.plot_length)) {
                        unitErrors.plot_length = 'Plot length is required';
                        isValid = false;
                    }
                    if (isEmpty(unit.plot_breadth)) {
                        unitErrors.plot_breadth = 'Plot breadth is required';
                        isValid = false;
                    }
                }

                if (isEmpty(unit.floor_plan_path)) {
                    unitErrors.floor_plan_path = 'Floor Plan is required';
                    isValid = false;
                }

                if (isEmpty(unit.base_price)) {
                    unitErrors.base_price = 'Base Price is required';
                    isValid = false;
                }

                if (isEmpty(unit.total_base_price)) {
                    unitErrors.total_base_price = 'Total Base Price is required';
                    isValid = false;
                }

                if (isEmpty(unit.estimated_total_price)) {
                    unitErrors.estimated_total_price = 'Estimated Total Price is required';
                    isValid = false;
                }

                if (!['13', '15'].includes(subType) && isEmpty(unit.club_house_charges)) {
                    unitErrors.club_house_charges = 'Club House Charges are required';
                    isValid = false;
                }

                ['corpus_fund', 'advance_maintenance_charges', 'advance_maintenance_for_months'].forEach(field => {
                    if (isEmpty(unit[field])) {
                        unitErrors[field] = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + ' is required';
                        isValid = false;
                    }
                });

                if (Object.keys(unitErrors).length > 0) {
                    errors.unitDetails[index] = unitErrors;
                }
            });
        }

        // if (subType !== '8' && isEmpty(form.floorRaising)) {
        //     errors.floorRaising = 'Floor Raising is required';
        //     isValid = false;
        // }

        if (isEmpty(form.preffered_location_charges_facing_per_sft)) {
            errors.preffered_location_charges_facing_per_sft = 'Preferred Location Charges (Facing per sqft) are required';
            isValid = false;
        }

        if (isEmpty(form.preffered_location_charges_corner_per_sft)) {
            errors.preffered_location_charges_corner_per_sft = 'Preferred Location Charges (Corner per sqft) are required';
            isValid = false;
        }

        if (subType === '7' && isEmpty(form.months)) {
            errors.months = 'Months are required';
            isValid = false;
        }

        console.log('errors', errors);
        console.log('errors (pretty):', JSON.stringify(errors, null, 2));
        setFormError(errors);
        return isValid;
    };


    const blurValidation = (e, i) => {
        let newErrors = {};
        if (e.target.name === 'property_max_size') {
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
        if (validate()) {
            dispatch(setEditProject(form));
            nextStep();
        } else {
            console.log(formError);
            toastError('Please Enter Mandatory fields')
        }
    };

    const getUnitSizes = async () => {
        setLoading(true)
        try {
            const res = await projectClient.get('listing-units');
            if (res?.data?.status) {
                const units = res?.data.data.filter(unit => unit.project_listing_id === form.id)
                // Only set unit details from API if form.unitDetails is empty or uninitialized
                const isFormUnitEmpty = !form?.unitDetails || form.unitDetails.length === 0;

                if (isFormUnitEmpty) {
                    setUnitDetails(units);
                    setUnitClone(units.length);
                    setForm((prev) => ({ ...prev, unitDetails: units }));
                } else {
                    // Preserve existing user input
                    setUnitClone(form?.unitDetails?.length);
                    setUnitDetails(form?.unitDetails);
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDataWithParms({
            endpoint: 'approval-authority',
            setLoading: setLoading,
            setData: setApprovalTypes,
            transFormFn: (data) => data?.filter((item) => item.city_code == formState.city_code)
        });
        fetchData(() => masterClient.get('communityTypes'), setCommunities);
        fetchData(() => masterClient.get('saleable-area-representation'), setSaleableArea);
        fetchData(() => masterClient.get('propertyfacing'), setPropertyFacing);
        fetchData(() => masterClient.get('bhksizes'), setBhkSize);
        fetchData(() => masterClient.get('propertysizes'), setPropertySize);
        getUnitSizes()
        if (form.unitDetails.length > 0) {
            setUnitDetails(form?.unitDetails);
        }
    }, []);

    const handleRemoveUnit = (index) => {
        if (unitClone <= 1) return;

        // Remove the tab count
        setUnitClone(prev => prev - 1);

        // Remove the form data at that index
        setUnitDetails(prev => prev.filter((_, i) => i !== index));

        // Remove data from unitDetails array at that index
        setForm(prevForm => ({
            ...prevForm,
            unitDetails: prevForm.unitDetails.filter((_, i) => i !== index)
        }));
    };


    const checkUnitAndClone = async () => {
        let isValid = true;
        const errors = {};
        errors.unitDetails = [];

        const isEmpty = (value) => value === undefined || value === null || value === '' || value === 'default';
        if (form?.unitDetails.length > 0) {
            form.unitDetails.forEach((unit, index) => {
                const unitErrors = {};

                if (isEmpty(unit.property_facing_id)) {
                    unitErrors.property_facing_id = 'Property Facing is required';
                    isValid = false;
                }

                if (subType === '7' && isEmpty(unit.property_bhk_size_id)) {
                    unitErrors.property_bhk_size_id = 'Property BHK Size is required';
                    isValid = false;
                }

                if (subType !== '9') {
                    ['super_built_up_area', 'carpet_area', 'car_parkings', 'balconies', 'bathrooms', 'car_parking_charges'].forEach(field => {
                        if (isEmpty(unit[field])) {
                            unitErrors[field] = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + ' is required';
                            isValid = false;
                        }
                    });
                }

                // if (subType === '7') {
                //   if (isEmpty(unit.uds)) {
                //     unitErrors.uds = 'UDS is required';
                //     isValid = false;
                //   }
                //   if (isEmpty(unit.property_uds_size_id)) {
                //     unitErrors.property_uds_size_id = 'UDS Unit is required';
                //     isValid = false;
                //   }
                // }

                if (subType === '8' && isEmpty(unit.villatype)) {
                    unitErrors.villa_type = 'Villa Type is required';
                    isValid = false;
                }

                if ((subType === '8' || subType === '9') && isEmpty(unit.plot_size)) {
                    unitErrors.plot_size = 'Plot Size is required';
                    isValid = false;
                }

                if ((subType === '8' || subType === '9')) {
                    if (isEmpty(unit.plot_length)) {
                        unitErrors.plot_length = 'Plot length is required';
                        isValid = false;
                    }
                    if (isEmpty(unit.plot_breadth)) {
                        unitErrors.plot_breadth = 'Plot breadth is required';
                        isValid = false;
                    }
                }

                if (isEmpty(unit.floor_plan_path)) {
                    unitErrors.floor_plan_path = 'Floor Plan is required';
                    isValid = false;
                }

                if (isEmpty(unit.currency)) {
                    unitErrors.currency = 'Currency is required';
                    isValid = false;
                }

                if (isEmpty(unit.base_price)) {
                    unitErrors.base_price = 'Base Price is required';
                    isValid = false;
                }

                if (isEmpty(unit.total_base_price)) {
                    unitErrors.total_base_price = 'Total Base Price is required';
                    isValid = false;
                }

                if (isEmpty(unit.estimated_total_price)) {
                    unitErrors.estimated_total_price = 'Estimated Total Price is required';
                    isValid = false;
                }

                if (!['13', '15'].includes(subType) && isEmpty(unit.club_house_charges)) {
                    unitErrors.club_house_charges = 'Club House Charges are required';
                    isValid = false;
                }

                if (isEmpty(unit.advance_maintenance_for_months)) {
                    unitErrors.advance_maintenance_for_months = 'Maintenance for No of Months is required';
                    isValid = false;
                }

                if (isEmpty(unit.advance_maintenance_charges)) {
                    unitErrors.advance_maintenance_charges = 'Maintenance Charges for No of Months is required';
                    isValid = false;
                }

                ['corpus_fund'].forEach(field => {
                    if (isEmpty(unit[field])) {
                        unitErrors[field] = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + ' is required';
                        isValid = false;
                    }
                });

                if (Object.keys(unitErrors).length > 0) {
                    errors.unitDetails[index] = unitErrors;
                }
            });
            console.log(errors)
            setFormError(errors)
            if (errors.unitDetails.length === 0 && form.unitDetails.length === unitClone) {
                setUnitClone(unitClone + 1)
            } else {
                toastWarning(`Please Fill in Unit - ${unitClone} Completely`)
            }
        } else {
            toastWarning(`Please Fill in Unit - ${unitClone} Completely`)
        }
    }


    return (
        <div>
            {loading && <Loader />}
            {/* Approval Authorities */}
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Approval Authorities</h4></div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col">
                            <div className="form-floating">
                                <select
                                    className="form-select"
                                    name="approval_authority"
                                    required
                                    onChange={handleChange}
                                    value={form.approval_authority || ''}
                                >
                                    <option value="default">Approval Authority</option>
                                    {approvalTypes.map((approve, index) => (
                                        <option key={index} value={approve.name}>
                                            {approve.name}
                                        </option>
                                    ))}
                                </select>
                                <label htmlFor="size-representation" className="fw-normal">Approval authority</label>
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
                                    required=""
                                    onChange={handleChange}
                                    value={form.approval_number || ''}
                                />
                                <label htmlFor="approval-number" className="fw-normal">Approval Number</label>
                                {formError.approval_number && (
                                    <p className="text-danger">{formError.approval_number}</p>
                                )}
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-floating">
                                <input
                                    type="date"
                                    id="year-of-approval"
                                    className="form-control"
                                    name="approval_year"
                                    placeholder="Enter"
                                    required
                                    onChange={handleChange}
                                    value={form.approval_year || ''} />
                                <label htmlFor="year-of-approval" className="fw-normal">Year Of Approval</label>
                                {formError.approval_year && <p className="text-danger">{formError.approval_year}</p>}
                            </div>
                        </div>
                        <div className="col">
                            {form?.approval_document_path === null ? (
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
                                    <label htmlFor="project-type" className="fw-normal">Upload Document</label>
                                </div>
                            ) : (
                                <div className="col-md-12 imgclass">
                                    <img src={form?.approval_document_path} width="150" height="80" />
                                    <button
                                        className="btn btn-danger removebtn"
                                        onClick={() =>
                                            setForm((prev) => ({ ...prev, approval_document_path: null }))}
                                    >
                                        Delete Image
                                    </button>
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
                                    value={form.real_estate_authority || ''}
                                >
                                    <option value="default">Real Estate Authority</option>
                                    <option value="RERA">RERA</option>
                                    <option value="RERA 2">RERA 2</option>
                                </select>
                                <label htmlFor="size-representation" className="fw-normal">Real-estate authority</label>
                                {formError.real_estate_authority && (
                                    <p className="text-danger">{formError.real_estate_authority}</p>
                                )}
                            </div>
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
                                <label htmlFor="approval-number" className="fw-normal">Approval Number</label>
                                {formError.real_estate_approval_number && (
                                    <p className="text-danger">{formError.real_estate_approval_number}</p>
                                )}
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
                                    value={form.real_estate_approval_year || ''}
                                    onChange={handleChange}
                                />
                                <label htmlFor="year-of-approval" className="fw-normal">Year Of Approval</label>
                                {formError.real_estate_approval_year && (
                                    <p className="text-danger">{formError.real_estate_approval_year}</p>
                                )}
                            </div>
                        </div>
                        <div className="col">
                            {form?.real_estate_approval_document_path === null ? (
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
                                    <label htmlFor="project-type" className="fw-normal">Upload Document</label>
                                </div>
                            ) : (
                                <div className="col-md-12 imgclass">
                                    <img src={form?.real_estate_approval_document_path} width="150" height="80" />
                                    <button
                                        className="btn btn-danger removebtn"
                                        onClick={() =>
                                            setForm((prev) => ({ ...prev, real_estate_approval_document_path: null }))}
                                    >Delete Image
                                    </button>
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
                                <button className="btn btn-primary" onClick={handleAddApprovalClick}>Add Other Approval</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Project Details */}
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Project Details</h4></div>
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
                                <label htmlFor="total-project-landarea" className="fw-normal">Total Project Land Area</label>
                                {formError.total_project_land_area && (
                                    <p className="text-danger">{formError.total_project_land_area}</p>
                                )}
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="form-floating">
                                <select
                                    className="form-select"
                                    name="total_project_land_area_size_id"
                                    required
                                    onChange={handleChange}
                                    value={form.total_project_land_area_size_id || ''}
                                >
                                    <option value="Sq Ft">Select Land area representation</option>
                                    {propertySize.map((item, index) => (
                                        <option value={item.id} key={index}>{item.name}</option>
                                    ))}
                                </select>
                                <label htmlFor="size-representation" className="fw-normal">
                                    Land area representation
                                </label>
                            </div>
                        </div>
                    </div>

                    {(subType == '7' || subType == '8' || subType == '9') && (
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
                                        Community type
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

                    {(subType == '7' || subType == '13' || subType == '15') && (
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
                                        Total Number Of Blocks
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
                                        Number Of Floors/Block
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
                                        Total Number Of Units
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {subType == '8' && (
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
                                        {subType == 13 ? "Mall Layout Plan" : " Project Layout Plan"}
                                    </label>
                                </div>
                            ) : (
                                <div className="col-md-12 imgclass">
                                    <img src={form?.project_layout_document_path} width="150" height="80" />
                                    <button
                                        className="btn btn-danger removebtn"
                                        onClick={() =>
                                            setForm((prev) => ({ ...prev, project_layout_document_path: undefined }))}
                                    >Delete Image</button>
                                </div>
                            )}
                            {formError.project_layout_document_path && (
                                <p className="text-danger">{formError.project_layout_document_path}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-3">
                        <h1 className="card-title mb-3 unitclass">Description</h1>
                        <CKEditor
                            editor={ClassicEditor}
                            name="project_description"
                            data={form.project_description}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                setForm({ ...form, project_description: data });
                                console.log({ event, editor, data });
                            }}
                        />
                        {formError.project_description && (
                            <p className="text-danger">{formError.project_description}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Unit Sizes */}
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Unit Sizes</h4></div>
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
                                        Saleable area representation
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
                                                    : 'Unit Size Min'}
                                    </label>
                                </div>
                                {formError.property_min_size && (
                                    <p className="text-danger">{formError.property_min_size}</p>
                                )}
                            </div>
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
                                />
                                <label htmlFor="flat-max-size" className="fw-normal">
                                    {subType == 7
                                        ? 'Flat Size Max'
                                        : subType == 9
                                            ? 'Plot Size Max'
                                            : subType == 8
                                                ? 'Villa Size Max'
                                                : 'Unit Size Max'}
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
                                    value={form.sizeRepresentation || ''}
                                >
                                    <option value="default">Select Size Representation</option>
                                    <option value="sq.ft">sq.ft</option>
                                    {subType == 9 &&
                                        <>
                                            <option value="sq.yards">sq.yards</option>
                                            <option value="Acre">Acre</option>
                                        </>
                                    }
                                </select>
                                <label htmlFor="size-representation" className="fw-normal">Size Representation</label>
                            </div>
                            {formError.sizeRepresentation && (
                                <p className="text-danger">{formError.sizeRepresentation}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Unit Details */}
            <div className="card">
                <div className="card-header">
                    <h4 className="card-title">Unit Details</h4></div>
                <div className="card-body">
                    <Tabs>
                        <TabList>
                            {Array.from({ length: unitClone }).map((_, i) => (
                                <Tab key={i}>
                                    <div className='d-flex align-items-center'>
                                        <div style={{ margin: '0px 17px' }}>
                                            {`unit - ${i + 1}`}
                                        </div>
                                        <div className='text-danger' onClick={() => handleRemoveUnit(i)} style={{ cursor: 'pointer' }}>
                                            <h5>
                                                <CiCircleRemove />
                                            </h5>
                                        </div>
                                    </div>
                                </Tab>
                            ))}
                            {formState.listing_type_id == 1 && (
                                <button style={{ background: 'transparent', 'color': '#000' }} onClick={checkUnitAndClone}>
                                    Add Unit
                                </button>
                            )}
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
                                                    (form.unitDetails?.[i] && form.unitDetails?.[i]?.property_facing_id) || ''
                                                }
                                            >
                                                <option value="default">Select Facing</option>
                                                {propertyFacing.map((item, index) => (
                                                    <option key={index} value={item.id}>
                                                        {item.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <label htmlFor="size-representation" className="fw-normal">
                                                Select facing
                                            </label>
                                        </div>
                                        {formError?.unitDetails?.[i]?.property_facing_id && (
                                            <p className="text-danger">{formError?.unitDetails?.[i]?.property_facing_id}</p>
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
                                                        (form.unitDetails?.[i] && form.unitDetails?.[i]?.property_bhk_size_id) || ''
                                                    }
                                                    onBlur={blurValidation}
                                                >
                                                    <option value="default">Select BHK Size</option>
                                                    {bhkSize.map((item, index) => (
                                                        <option key={index} value={item.id}>
                                                            {item.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                <label htmlFor="size-representation" className="fw-normal">
                                                    Select BHK Sizes
                                                </label>
                                            </div>
                                            {formError?.unitDetails?.[i]?.property_bhk_size_id && (
                                                <p className="text-danger">{formError?.unitDetails?.[i]?.property_bhk_size_id}</p>
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
                                                    value={(form.unitDetails?.[i] && form.unitDetails?.[i]?.villatype) || ''}
                                                >
                                                    <option value="default">Villa Type</option>
                                                    <option value="Duplex">Duplex</option>
                                                    <option value="Simplex">Simplex</option>
                                                    <option value="Triplex">Triplex</option>
                                                </select>
                                                <label htmlFor="size-representation" className="fw-normal">
                                                    Villa Type
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
                                                            (form.unitDetails?.[i] && form.unitDetails?.[i]?.property_bhk_size_id) || ''
                                                        }
                                                        onBlur={blurValidation}
                                                    >
                                                        <option value="default">Bedrooms</option>
                                                        {bhkSize.map((item, index) => (
                                                            <option key={index} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <label htmlFor="size-representation" className="fw-normal">
                                                        Select BHK
                                                    </label>
                                                </div>
                                                {formError?.unitDetails?.[i]?.property_bhk_size_id && (
                                                    <p className="text-danger">{formError?.unitDetails?.[i]?.property_bhk_size_id}</p>
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
                                                        value={(form.unitDetails?.[i] && form.unitDetails?.[i]?.plot_size) || ''}
                                                        onChange={(e) => handleChange(e, i)}
                                                        onBlur={blurValidation}
                                                    />
                                                    <label htmlFor="super-buildup-area" className="fw-normal">
                                                        Plot Size
                                                    </label>
                                                </div>
                                                {formError?.unitDetails?.[i]?.plot_size && (
                                                    <p className="text-danger">{formError?.unitDetails?.[i]?.plot_size}</p>
                                                )}
                                            </div>
                                            <div className="col-3 mb-3">
                                                <div className="form-floating">
                                                    <select
                                                        className="form-select"
                                                        name="plot_size_representation"
                                                        required
                                                        onChange={(e) => handleChange(e, i)}
                                                        value={form.plot_size_representation || ''}>
                                                        <option value="default">Select Size Representation</option>
                                                        <option value="sq.ft">sq.ft</option>
                                                        <option value="sq.yards">sq.yards</option>
                                                    </select>

                                                    <label htmlFor="size-representation" className="fw-normal">
                                                        Size Representation
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
                                                        value={(form.unitDetails?.[i] && form.unitDetails?.[i]?.plot_length) || ''}
                                                        onChange={(e) => handleChange(e, i)}
                                                    />
                                                    <label htmlFor="super-buildup-area" className="fw-normal">
                                                        Length
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
                                                        value={(form.unitDetails?.[i] && form.unitDetails?.[i]?.plot_breadth) || ''}
                                                        onChange={(e) => handleChange(e, i)}
                                                    />
                                                    <label htmlFor="super-buildup-area" className="fw-normal">
                                                        Breadth
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
                                                        (form.unitDetails?.[i] && form.unitDetails?.[i]?.super_built_up_area) || ''
                                                    }
                                                    onChange={(e) => handleChange(e, i)}
                                                    onBlur={(e) => blurValidation(e, i)}
                                                />
                                                <label htmlFor="super-buildup-area" className="fw-normal">
                                                    Super Build Up Area
                                                </label>
                                            </div>
                                            {formError?.unitDetails?.[i]?.super_built_up_area && (
                                                <p className="text-danger">{formError?.unitDetails?.[i]?.super_built_up_area}</p>
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
                                                    value={(form.unitDetails?.[i] && form.unitDetails?.[i]?.carpet_area) || ''}
                                                    onChange={(e) => handleChange(e, i)}
                                                    onBlur={(e) => blurValidation(e, i)}
                                                />
                                                <label htmlFor="carpet-area" className="fw-normal">
                                                    Carpet Area
                                                </label>
                                            </div>
                                            {formError?.unitDetails?.[i]?.carpet_area && (
                                                <p className="text-danger">{formError?.unitDetails?.[i]?.carpet_area}</p>
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
                                                        value={(form.unitDetails?.[i] && form.unitDetails[i]?.car_parkings) || ''}
                                                    >
                                                        <option value="default">Car Parking</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3 </option>
                                                    </select>
                                                    <label htmlFor="size-representation" className="fw-normal">
                                                        No.of Car Parkings
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
                                                        value={(form.unitDetails?.[i] && form.unitDetails?.[i]?.balconies) || ''}
                                                    >
                                                        <option value="default">Balconies</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                    </select>
                                                    <label htmlFor="size-representation" className="fw-normal">
                                                        No.of balconies
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
                                                        value={(form.unitDetails?.[i] && form.unitDetails?.[i]?.bathrooms) || ''}
                                                    >
                                                        <option value="default">Bathrooms</option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3 </option>
                                                    </select>
                                                    <label htmlFor="size-representation" className="fw-normal">
                                                        No.of bathrooms
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
                                                    value={(form.unitDetails?.[i] && form.unitDetails?.[i]?.uds) || ''}
                                                />
                                                <label htmlFor="uds" className="fw-normal">
                                                    UDS
                                                </label>
                                            </div>
                                            {formError.unitDetails?.[i]?.uds && (
                                                <p className="text-danger">{formError?.unitDetails?.[i]?.uds}</p>
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
                                                        (form.unitDetails?.[i] && form.unitDetails?.[i]?.property_uds_size_id) || ''
                                                    }
                                                >
                                                    <option value="1">UDS Unit</option>
                                                    <option value="2">Sq</option>
                                                    <option value="3">Sq Meter</option>
                                                    <option value="4">Sq Yard</option>
                                                </select>
                                                <label htmlFor="size-representation" className="fw-normal">
                                                    Select Uds Units
                                                </label>
                                            </div>
                                            {formError.unitDetails?.[i]?.property_uds_size_id && (
                                                <p className="text-danger">{formError.unitDetails?.[i]?.property_uds_size_id}</p>
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
                                    {form.unitDetails?.[i]?.floor_plan_path === undefined ? (
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
                                                        value={(form.unitDetails?.[i] && form.unitDetails?.[i]?.floor_plan_path) || ''}
                                                        onChange={(e) => handleImage(e, i)}
                                                    />
                                                    <label htmlFor="project-type" className="fw-normal">
                                                        {subType == '7' || subType == '8'
                                                            ? '(Floor Plan)'
                                                            : subType == '9'
                                                                ? 'Plot Plan'
                                                                : 'Unit Plan'}
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
                                            <img src={form.unitDetails?.[i]?.floor_plan_path} width="150" height="80" />
                                            <button
                                                className="btn btn-danger removebtn"
                                                onClick={() => {
                                                    const updatedUnitDetails = [...form.unitDetails];
                                                    if (updatedUnitDetails[i]) {
                                                        updatedUnitDetails[i].floor_plan_path = undefined;
                                                    }
                                                    setForm((prev) => ({
                                                        ...prev,
                                                        unitDetails: updatedUnitDetails,
                                                    }));
                                                }}
                                            >Delete Image</button>
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
                                                    value={(form?.unitDetails?.[i] && form?.unitDetails?.[i]?.currency) || ''}
                                                >
                                                    <option value="default">Currency</option>
                                                    <option value="INR">INR</option>
                                                    <option value="USD">USD</option>
                                                </select>
                                            </div>
                                            {formError?.unitDetails?.[i]?.currency && (
                                                <p className="text-danger">{formError?.unitDetails?.[i]?.currency}</p>
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
                                                    name="base_price"
                                                    placeholder="Enter Base Price"
                                                    required
                                                    value={(form?.unitDetails?.[i] && form?.unitDetails?.[i]?.base_price) || ''}
                                                    onChange={(e) => handleChange(e, i)}
                                                    onBlur={(e) => blurValidation(e, i)}
                                                />
                                                <label htmlFor="base-price" className="fw-normal">
                                                    Base Price {subType == '7' || subType == '8' ? '(Per Sq Ft)' : ''}
                                                </label>
                                            </div>
                                            {formError.unitDetails?.[i]?.base_price && (
                                                <p className="text-danger">{formError.unitDetails?.[i]?.base_price}</p>
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
                                                        (form.unitDetails?.[i] && form.unitDetails?.[i]?.total_base_price) || ''
                                                    }
                                                    onChange={(e) => handleChange(e, i)}
                                                    readOnly
                                                />
                                                <label htmlFor="total-base-price" className="fw-normal clrinputlabel">
                                                    Total Base Price
                                                </label>
                                            </div>
                                            {formError?.unitDetails?.[i]?.total_base_price && (
                                                <p className="text-danger">{formError?.unitDetails?.[i]?.total_base_price}</p>
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
                                                            (form.unitDetails?.[i] && form?.unitDetails?.[i]?.car_parking_charges) ||
                                                            ''
                                                        }
                                                        onChange={(e) => handleChange(e, i)}
                                                        onBlur={handleCalEstPr}
                                                    />
                                                    <label htmlFor="car-parking-chargers" className="fw-normal">
                                                        Car Parking Charges
                                                    </label>
                                                </div>
                                                {formError?.unitDetails?.[i]?.car_parking_charges && (
                                                    <p className="text-danger">{formError?.unitDetails?.[i]?.car_parking_charges}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="row mb-3">
                                        {(subType == '7' || subType == '8' || subType == '9' || subType == '23') && (
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
                                                            (form.unitDetails?.[i] && form.unitDetails?.[i]?.club_house_charges) || ''
                                                        }
                                                        onChange={(e) => handleChange(e, i)}
                                                        onBlur={handleCalEstPr}
                                                    />
                                                    <label htmlFor="club-house-charges" className="fw-normal">
                                                        Club House Charges
                                                    </label>
                                                </div>
                                                {formError?.unitDetails?.[i]?.club_house_charges && (
                                                    <p className="text-danger">{formError?.unitDetails?.[i]?.club_house_charges}</p>
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
                                                    value={(form?.unitDetails[i] && form?.unitDetails[i]?.corpus_fund) || ''}
                                                    onChange={(e) => handleChange(e, i)}
                                                    onBlur={handleCalEstPr}
                                                />
                                                <label htmlFor="corpus-fund" className="fw-normal">
                                                    Corpus Fund
                                                </label>
                                            </div>
                                            {formError?.unitDetails?.[i]?.corpus_fund && (
                                                <p className="text-danger">{formError?.unitDetails?.[i]?.corpus_fund}</p>
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
                                                        (form?.unitDetails?.[i] &&
                                                            form?.unitDetails?.[i]?.advance_maintenance_charges) ||
                                                        ''
                                                    }
                                                    onChange={(e) => handleChange(e, i)}
                                                    onBlur={handleCalEstPr}
                                                />
                                                <label htmlFor="maintenance-charges" className="fw-normal">
                                                    Maintenance Charges
                                                </label>
                                            </div>
                                            {formError?.unitDetails?.[i]?.advance_maintenance_charges && (
                                                <p className="text-danger">{formError?.unitDetails?.[i].advance_maintenance_charges}</p>
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
                                                        (form.unitDetails?.[i] &&
                                                            form.unitDetails?.[i]?.advance_maintenance_for_months) ||
                                                        ''
                                                    }
                                                >
                                                    <option value="1">For Months</option>
                                                    <option value="12">12 Months</option>
                                                    <option value="24">24 Months</option>
                                                    <option value="36">36 Months</option>
                                                </select>
                                                <label htmlFor="size-representation" className="fw-normal">
                                                    For Months
                                                </label>
                                            </div>
                                            {formError?.unitDetails?.[i]?.advance_maintenance_for_months && (
                                                <p className="text-danger">{formError?.unitDetails?.[i].advance_maintenance_for_months}</p>
                                            )}
                                        </div>
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
                                                        (form.unitDetails?.[i] && form.unitDetails?.[i]?.others_1_charges_name) ||
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
                                                        (form.unitDetails?.[i] && form.unitDetails?.[i]?.others_1_charges) || ''
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
                                                        (form.unitDetails?.[i] && form.unitDetails?.[i]?.others_2_charges_name) ||
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
                                                        (form.unitDetails?.[i] && form.unitDetails?.[i]?.others_2_charges) || ''
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
                                                        (form.unitDetails?.[i] && form.unitDetails?.[i]?.estimated_total_price) ||
                                                        ''
                                                    }
                                                    readOnly
                                                />
                                                <label htmlFor="legalCharges" className="fw-normal clrinputlabel">
                                                    Total Estimated Price
                                                </label>
                                            </div>
                                            {formError?.unitDetails?.[i]?.estimated_total_price && (
                                                <p className="text-danger">{formError?.unitDetails?.[i]?.estimated_total_price}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div>
                                            <h1 className="unitclass mb-3">Estimated GST and Other Statutory Charges</h1>
                                        </div>
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="number"
                                                    data-id="unitDetailsData"
                                                    className="form-control"
                                                    name="gst_charges"
                                                    placeholder="Enter Base Price"
                                                    required
                                                    value={(form.unitDetails?.[i] && form.unitDetails?.[i]?.gst_charges) || ''}
                                                    onChange={(e) => handleChange(e, i)}
                                                />
                                                <label htmlFor="otherCharges2" className="fw-normal">
                                                    GST (Taxes)
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-3 mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="number"
                                                    data-id="unitDetailsData"
                                                    className="form-control"
                                                    name="registration_charges"
                                                    placeholder="Enter Base Price"
                                                    required
                                                    value={
                                                        (form.unitDetails?.[i] && form.unitDetails?.[i]?.registration_charges) || ''
                                                    }
                                                    onChange={(e) => handleChange(e, i)}
                                                />
                                                <label htmlFor="amount" className="fw-normal">
                                                    Registration Charges
                                                </label>
                                            </div>
                                            {formError?.unitDetails?.[i]?.registration_charges && (
                                                <p className="text-danger">{formError?.unitDetails?.[i]?.registration_charges}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {unitClone - 1 === i &&
                                    <div className='d-flex justify-content-end'>
                                        <button className='' onClick={checkUnitAndClone}>Add New Unit</button>
                                    </div>
                                }
                            </TabPanel>
                        ))}
                    </Tabs>
                </div>
            </div>

            {/* Preferred location charges */}
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
                                        onChange={handleChange}
                                        value={form.months || ''}
                                    >
                                        <option value="default">Valid From</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
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

export default StepTwo;
