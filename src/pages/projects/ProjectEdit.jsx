import React, { useState, useEffect, useContext, useCallback } from 'react';
import Loader from '../../components/Loader';
import { masterClient, projectClient } from '../../utils/httpClient';
import { toastError } from '../../utils/toast';
import { IpInfoContext } from '../../utils/context';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { setEditProject } from '../../store/slices/ProjectManagementSlice';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { handleImages3 } from '../../utils/S3Handler';
import { FaFilePdf } from "react-icons/fa6";
import { IoReturnDownForwardOutline } from 'react-icons/io5';

const ProjectDetails = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.user.userData);
    const editProjectData = useSelector((state) => state.projectManagement['editProjectData']);

    const [form, setForm] = useState({
        'listing_type_id': 1, position: 1,
        ...editProjectData, unitDetails: [], furnishedName: [], furnished_id: []
    });
    const [formError, setFormError] = useState({});
    const [loading, setLoading] = useState(false);

    // ?  step one variables
    const subType = form?.property_sub_type_id;
    const [projectType, setProjectType] = useState([]);
    const [subProjectType, setSubProjectType] = useState([]);
    const [countries, setCountries] = useState([]);
    const [projects, setProjects] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [localities, setLocalities] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([])
    const [builder, setBuilder] = useState({});
    const [projectTitle, setProjectTitle] = useState('');

    // ? step two variables
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
    const { ipInfo } = useContext(IpInfoContext);

    // ? step three variables
    const [furnishedValues, setFurnishedValues] = useState({});
    const [furnishedItems, setFurnishedItems] = useState([]);
    const [amenityValues, setAmenityValues] = useState([]);
    const [allocatedAmenities, setAllocatedAmenities] = useState([]);
    const [allocatedFeatures, setAllocatedFeatures] = useState([]);
    const [specificationHeaders, setSpecificationHeaders] = useState([]);
    const [specificationData, setSpecificationData] = useState([]);
    const [specialFeatureValues, setSpecialFeatureValues] = useState([]);
    const [banks, setBanks] = useState([]);
    const [banksValues, setBanksValues] = useState([]);


    // ? step four variables
    const [sgalleryHeader, setgalleryHeader] = useState([]);
    const [fileArray, setFileArray] = useState([]);
    const [imgView, setImgView] = useState([]);

    // ? step five variables
    const [posStatus, setPosStatus] = useState([]);
    const [projectapiData1, setProjectApiData1] = useState();

    // -------------------- approval tabs increment ---------------------------------
    const [showApprovals, setShowApprovals] = useState(false);
    const [addApprovalCount, setAddApprovalCount] = useState(0);
    const maxAddApprovalCount = 3; // Set the maximum limit here

    const handleAddApprovalClick = () => {
        setAddApprovalCount((prevCount) => prevCount + 1);

        if (addApprovalCount < maxAddApprovalCount) {
            setShowApprovals(true);
            const newApprovals = [...approvals, { key: approvals.length + 1 }];
            setApprovals(newApprovals);
        }
    };
    // -------------------- approval tabs increment ---------------------------------



    //   handle Change
    const handleChange = async (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

        if (e.target.name == 'property_type_id') {
            if (form.listing_type_id == 1) {
                getSubProjectType(e.target.value);
            }
        }
        if (e.target.name == 'property_sub_type_id') {
            setSubType(e.target.value)
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
        if (e.target.name == 'project_name_id') {
            getBuilderName(e.target.value);
        }
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
                ? [...banksValues, { id: value }]
                : banksValues.filter((bank) => bank !== value);

            setBanksValues(updatedBanks);
            setForm((prevState) => ({
                ...prevState,
                [name]: updatedBanks
            }));
        } else if (name === 'furnished_id') {
            const updatedFeatures = checked
                ? [...(furnishedValues || []), { furnished: value }]
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

    // * images upload code 

    const handleDeleteImage = (headId) => {
        const updatedFileArray = fileArray.filter((item) => item.headId !== headId.toString());
        setFileArray(updatedFileArray);
        setForm((prevState) => ({
            ...prevState,
            file_path: updatedFileArray
        }));
    };

    const images = Array.from({ length: 8 }, (_, index) => ({
        id: `${index}`,
        image: fileArray.filter((item) => item.headId === `${index}`)?.[0]?.id
    }));

    // ? handle images 
    const handleImage = async (e, index) => {
        setLoading(true);
        let resFromMiddleware = await handleImages3(e);
        console.log('resFromMiddleware===', resFromMiddleware);
        setLoading(false);
        if (resFromMiddleware.clientStatus) {
            if (index !== undefined) {
                console.log('index===', index);
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

    const handleImage1 = async (e, headerName) => {
        setLoading(true);
        let resFromMiddleware = await handleImages3(e);
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
                    { headId: e.target.id, id: resFromMiddleware.data.original_image_url }
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

    const handleCalEstPr = (i) => {
        const updatedUnitDetails = calculateTotalEstimatePrice(form?.unitDetails);
        setForm((prevForm) => ({ ...prevForm, ...form, unitDetails: updatedUnitDetails }));
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

            return {
                ...unit,
                estimated_total_price: totalEstimatePrice,
                registration_charges: registrationChargePercentage,
                gst_charges: percentage
            };
        });

        return updatedUnitDetails;
    }, []);

    const ImageUpload = ({ id, image, onImageChange, onDeleteImage }) => {
        return (
            <div className="col-md-3">
                {image == null ?
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
                    :
                    <div className="col-12 imgclass">
                        <img src={image} width="100%" height="140" />
                        <button className="btn btn-danger removebtn" onClick={() => onDeleteImage(id)}>
                            Delete Image
                        </button>
                    </div>
                }
            </div>
        );
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

    useEffect(() => {
        getgalleryHeaders();
    }, [fileArray])

    useEffect(() => {

        getUnitSizes();
        if (!editProjectData) {
            navigate('/projects/master')
        }
        projectNames();
        getProjectType();
        allCountries();
        getApprovalAuthority();
        getCommunityTypes();
        getSaleableArea();
        getBHKsizes();
        getPropertyFacing();
        getPropertySizes();
        getSpecificationHeaders();
        getFurnished();
        getSpecificationsData();
        getAllocatedFeatures();
        getAllocatedAmenities();
        getProjectAmenities();
        getsplfeatures();
        getBanks();
        getProjectBanks();
        getProjectImages();
        getVideoUrls();
        getPossStatus();
        if (form?.property_type_id) {
            getSubProjectType(form?.property_type_id)
        }
        if (form?.country_code) {
            getStatesByCountry(form?.country_code);
        }
        if (form?.state_code) {
            getCitiesByState(form?.state_code);
        }
        if (form?.city_code) {
            getLocalityByCity(form?.city_code);
        }
        if (form?.locality) {
            getfilteredProjects(form?.locality);
        }
        if (form?.project_name_id) {
            getBuilderName(form?.project_name_id);
        }
    }, [])


    // validation 
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
        if (!form.project_name_id) {
            error.project_name_id = 'Project Name is required';
            isValid = false;
        }
        if (form.approval_authority === 'default' || !form.approval_authority) {
            error.approval_authority = 'Approval Authority is required';
            isValid = false;
        }

        if (!form.approval_number) {
            error.approval_number = 'Approval Number is required';
            isValid = false;
        }
        if (!form.approval_year) {
            error.approval_year = 'Approval Year is required';
            isValid = false;
        }
        if (!form.approval_document_path) {
            error.approval_document_path = 'Approval Document is required';
            isValid = false;
        }
        if (!form.real_estate_authority) {
            error.real_estate_authority = 'Real Estate Authority is required';
            isValid = false;
        }
        if (!form.real_estate_approval_number) {
            error.real_estate_approval_number = 'Real Estate Approval Number is required';
            isValid = false;
        }
        if (!form.real_estate_approval_year) {
            error.real_estate_approval_year = 'Real Estate Approval Year is required';
            isValid = false;
        }
        if (!form.real_estate_approval_document_path) {
            error.real_estate_approval_document_path = 'Real Estate Approval Document is required';
            isValid = false;
        }
        if (!form.total_project_land_area) {
            error.total_project_land_area = 'Total Project Land Area is required';
            isValid = false;
        }
        if (!form.total_project_land_area_size_id) {
            error.total_project_land_area_size_id = 'Total Project Land Area Size is required';
            isValid = false;
        }
        if (!form.totalNumberOfBlocks && subType == '7') {
            error.totalNumberOfBlocks = 'Total Number Of Blocks is required';
            isValid = false;
        }
        if (!form.numberOfFloorsBlocks && subType == '7') {
            error.numberOfFloorsBlocks = 'Number Of Floors/Block is required';
            isValid = false;
        }
        if (!form.totalNumberOfUnits && subType == '7') {
            error.totalNumberOfUnits = 'Total Number Of Units is required';
            isValid = false;
        }
        if (!form.project_layout_document_path) {
            error.project_layout_document_path = 'Project Layout Plan is required';
            isValid = false;
        }
        if (!form.community_type_id && (subType !== "13" && subType !== "15")) {
            error.community_type_id = 'Community Type is required';
            isValid = false;
        }
        if (!form.property_size_representation_id && subType != "9") {
            error.property_size_representation_id = 'Property Size Representation is required';
            isValid = false;
        }
        if (!form.property_min_size) {
            error.property_min_size = 'Property Min Size is required';
            isValid = false;
        }
        if (!form.property_max_size) {
            error.property_max_size = 'Property Max Size is required';
            isValid = false;
        }
        if (!form.sizeRepresentation) {
            error.sizeRepresentation = 'Size Representation is required';
            isValid = false;
        }
        if (!form.project_description) {
            error.project_description = 'Project Description is required';
            isValid = false;
        }
        if (!form.unitDetails || form.unitDetails.length === 0) {
            error.unitDetailsError = 'UnitDetails is Required';
            isValid = false;
        }
        if (form.unitDetails) {
            error.unitDetails = []; // Initialize as an array

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
                if (!unit.uds && subType == '7') {
                    unitErrors['uds'] = 'UDS is required';
                    isValid = false;
                }
                if (!unit.property_uds_size_id && subType == '7') {
                    unitErrors['property_uds_size_id'] = 'UDS Unit is required';
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
                    error.unitDetails[index] = unitErrors;
                }
            });
        }

        if (!form.floorRaising && !subType == '8') {
            error.floorRaising = 'Floor Raising is required';
            isValid = false;
        }
        if (!form.preffered_location_charges_facing_per_sft) {
            error.preffered_location_charges_facing_per_sft =
                'Preferred Location Charges (Facing per sqft) are required';
            isValid = false;
        }
        if (!form.preffered_location_charges_corner_per_sft) {
            error.preffered_location_charges_corner_per_sft =
                'Preferred Location Charges (Corner per sqft) are required';
            isValid = false;
        }
        // if (!form.months && subType == '7') {
        //     error.months = 'Months are required';
        //     isValid = false;
        // }
        setFormError(error);
        return isValid;
    };

    const getProjectType = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('projecttype');
            if (res.data?.status) {
                setProjectType(res.data?.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const getSubProjectType = async (Propid) => {
        setLoading(true);
        try {
            const res = await masterClient.get('projectsubtype');
            if (res.data?.status) {
                const data = res?.data?.data?.filter((id) => id.project_type_id == Propid);
                if (!data.length) {
                    toastError('No Sub Projects Type Found');
                }
                setSubProjectType(data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // get countries
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
            // console.log('get cities=====', res);
            if (res?.data?.status) {
                // Sort the localities alphabetically by locality_name
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

    const projectNames = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('projectname');
            if (res?.data?.status) {
                setProjects(res?.data?.data);
                setFilteredProjects(res?.data?.data)
            }
        } catch (err) {
            console.log(err);
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
                setFilteredProjects([])
            }
        } catch (err) {
            console.log(err);
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
            if (res?.data?.status) {
                setBuilder(res?.data?.data);
                setForm(prev => ({ ...prev, builder_id: res?.data?.data?.id, latitude: latitude, longitude: longitude }));
            }
        } catch {
            toastError(res?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    // ? step two apis
    //get Approval Authority
    const getApprovalAuthority = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('approval-authority');
            if (res?.data?.status) {
                const filter = res?.data?.data.filter((item) => item.city_code == form.city_code);
                setApprovalTypes(filter);
            }
        } catch (error) {
            console.log('error =====>', error);
        } finally {
            setLoading(false);
        }
    };

    // ? get Community Types
    const getCommunityTypes = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('communityTypes');
            if (res?.data?.status) {
                setCommunities(res?.data?.data);
            }
        } catch (error) {
            console.log('error =====>', error);
        } finally {
            setLoading(false);
        }
    };

    // ? get Saleable Area Representation
    const getSaleableArea = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('saleable-area-representation');
            if (res?.data?.status) {
                setSaleableArea(res?.data?.data);
            }
        } catch (error) {
            console.log('error =====>', error);
        } finally {
            setLoading(false);
        }
    };

    // ? get property sizes
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
            console.log('error result=====', error);
        } finally {
            setLoading(false);
        }
    };

    //get BHK Sizes
    const getBHKsizes = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('bhksizes');
            console.log('get BHK sizes===', res);
            if (res?.data?.status) {
                setBhkSize(res?.data?.data);

            }
        } catch (error) {
            console.log('error result=====', error);
        } finally {
            setLoading(false);
        }
    };

    const getUnitSizes = async () => {
        setLoading(true)
        try {
            const res = await projectClient.get('listing-units');
            if (res?.data?.status) {
                const units = res?.data.data.filter(unit => unit.project_listing_id == form.id)
                setUnitDetails(units)
                setUnitClone(units.length)
                setForm((prev) => ({ ...prev, unitDetails: units }))
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    // ? step three apis
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


    // ? get furnished data 
    const getFurnished = async () => {
        setLoading(true)
        try {
            const res = await projectClient.get('listing-furnished-mapping');
            if (res?.data?.status) {
                const data = res?.data.data.filter(furnished => furnished.project_listing_id == form.id);
                const furnisheNames = data.feature_names
                const furnished_id = data.furnished
                if (data) {
                    setForm((prev) => ({ ...prev, furnisheNames: furnisheNames, furnished_id: furnished_id }))
                    setFurnishedItems(furnisheNames)
                    setFurnishedValues(furnished_id)
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    // ?  get specification headers
    const getSpecificationHeaders = async () => {
        try {
            setLoading(true);
            const res = await masterClient.get('specificationsheader');
            if (res?.data?.status) {
                setSpecificationHeaders(res?.data?.data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

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
                setForm((prev) => ({ ...prev, specifications: specsData }))
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
                setForm((prev) => ({ ...prev, amenities_id: amenity_data }))
                setAmenityValues(amenity_data)
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

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
                setForm((prev) => ({ ...prev, special_feature_id: spl_features }))
                setSpecialFeatureValues(spl_features)
            }
        } catch (err) {

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

    // ? get Banks
    const getBanks = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('banks');
            if (res?.data?.status) {
                setBanks(res?.data?.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

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
                setForm((prev) => ({ ...prev, bank_id: bank_data }))
                setBanksValues(bank_data)
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    // ? get gallery headers api
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

    // ? get added gallery images
    const getProjectImages = async () => {
        try {
            const res = await projectClient.get('listing-gallery');
            if (res?.data?.status) {
                const data = res?.data?.data.filter(img => img.project_listing_id == form.id);
                setFileArray(data);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    const getVideoUrls = async () => {
        setLoading(false)
        try {
            const res = await projectClient.get('listing-video-links');
            if (res?.data?.status) {
                const data = res?.data?.data.filter(video => video.project_listing_id == form.id)
                if (data.length > 0) {
                    setForm((prev) => ({ ...prev, video1: data[0].video1, video2: data[0].video2 }))
                }
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    // * get Possession Status
    const getPossStatus = async () => {
        setLoading(true);
        try {
            const res = await masterClient.get('possessionstatus');
            if (res?.data?.status) {
                setPosStatus(res?.data?.data);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // * apis and payload to update the data


    const handleSubmit = async () => {

        if (validate()) {

            const apiData1 = {
                project_name_id: form.project_name_id,
                project_listing_name: form.project_listing_name,
                property_type_id: form.property_type_id,
                property_sub_type_id: form.property_sub_type_id,
                listing_type_id: form.listing_type_id,
                country_code: form.country_code,
                state_code: form.state_code,
                city_code: form.city_code,
                locality: form.locality,
                sub_locality: form.sub_locality,
                street_name: form.street_name,
                door_number: form.door_number,
                builder_id: form.builder_id,
                listed_by: 2,
                sizeRepresentation: form.sizeRepresentation,
                approval_authority: form.approval_authority,
                approval_number: form.approval_number,
                approval_year: form.approval_year,
                approval_document_path: form.approval_document_path,
                real_estate_authority: form.real_estate_authority,
                real_estate_approval_number: form.real_estate_approval_number,
                real_estate_approval_year: form.real_estate_approval_year,
                real_estate_approval_document_path: form.real_estate_approval_document_path,
                other_1_approval_name: form.other_1_approval_name,
                other_1_approval_number: form.other_1_approval_number,
                other_1_approval_year: form.other_1_approval_year,
                other_1_approval_document_path: form.other_1_approval_document_path,
                other_2_approval_name: form.other_2_approval_name,
                other_2_approval_number: form.other_2_approval_number,
                other_2_approval_year: form.other_2_approval_year,
                other_2_approval_document_path: form.other_2_approval_document_path,
                other_3_approval_name: form.other_3_approval_name,
                other_3_approval_number: form.other_3_approval_number,
                other_3_approval_year: form.other_3_approval_year,
                other_3_approval_document_path: form.other_3_approval_document_path,
                total_project_land_area: form.total_project_land_area,
                total_project_land_area_size_id: form.total_project_land_area_size_id,
                totalNumberOfBlocks: form.totalNumberOfBlocks,
                numberOfFloorsBlocks: form.numberOfFloorsBlocks,
                totalNumberOfUnits: form.totalNumberOfUnits,
                totalNumberOfVillas: form.totalNumberOfVillas,
                project_layout_document_path: form.project_layout_document_path,
                water_source: form.water_source,
                number_of_borewells: form.number_of_borewells,
                ground_water_depth: form.ground_water_depth,
                community_type_id: form.community_type_id ? form.community_type_id : "0",
                property_min_size: form.property_min_size,
                property_max_size: form.property_max_size,
                property_size_representation_id: form.property_size_representation_id ? form.property_size_representation_id : 0,
                possession_status_id: form.possession_status_id,
                project_description: form.project_description,
                preffered_location_charges_facing_per_sft:
                    form.preffered_location_charges_facing_per_sft,
                preffered_location_charges_corner_per_sft:
                    form.preffered_location_charges_corner_per_sft,
                contact_timing_from: form.contact_timing_from,
                contact_timing_to: form.contact_timing_to,
                broucher_path: form.broucher_path,
                created_by_type: 1,
                updated_by_type: userData.id,
                latitude: form.latitude,
                longitude: form.longitude,
                possession_by: form.possession_by,
                posted_by: form.posted_by,
                age_of_possession: form.age_of_possession,
                project_status: "A",
                approval_status: "I",
                furnishedStatus: form.furnishedStatus
            };

            setProjectApiData1(apiData1);

            const apiData2 = form['unitDetails'].map((item, index) => ({
                project_listing_id: form.unitDetails[index].project_listing_id,
                id: form.unitDetails[index].id,
                villa_type: form.unitDetails[index].villatype,
                villa_type_id: form.unitDetails[index].villa_type_id,
                farm_house_type_id: form.unitDetails[index].farm_house_type_id,
                property_facing_id: form.unitDetails[index].property_facing_id,
                property_bhk_size_id: form.unitDetails[index].property_bhk_size_id,
                super_built_up_area: form.unitDetails[index].super_built_up_area,
                carpet_area: form.unitDetails[index].carpet_area,
                floor_level: form.unitDetails[index].floor_level,
                car_parkings: form.unitDetails[index].car_parkings,
                balconies: form.unitDetails[index].balconies,
                bathrooms: form.unitDetails[index].bathrooms,
                uds: form.unitDetails[index].uds ? form.unitDetails[index].uds : 0,
                property_uds_size_id: form.unitDetails[index].property_uds_size_id ? form.unitDetails[index].property_uds_size_id : "1",
                plot_size: form.unitDetails[index].plot_size,
                property_size_id: form.unitDetails[index].property_size_id,
                length: form.unitDetails[index].plot_length,
                width: form.unitDetails[index].plot_breadth,
                dimension_representation: form.unitDetails[index].dimension_representation,
                north_facing_road_width_in_fts: form.unitDetails[index].north_facing_road_width_in_fts,
                currency: form.unitDetails[index].currency,
                base_price: form.unitDetails[index].base_price,
                total_base_price: form.unitDetails[index].total_base_price,
                amenities_charges: 0,
                car_parking_charges: form.unitDetails[index].car_parking_charges,
                club_house_charges: form.unitDetails[index].club_house_charges,
                corpus_fund: form.unitDetails[index].corpus_fund,
                advance_maintenance_charges: form.unitDetails[index].advance_maintenance_charges,
                advance_maintenance_for_months: form.unitDetails[index].advance_maintenance_for_months,
                legal_charges: form.unitDetails[index].legal_charges,
                others_1_charges_name: form.unitDetails[index].others_1_charges_name,
                others_1_charges: form.unitDetails[index].others_1_charges,
                others_2_charges_name: form.unitDetails[index].others_2_charges_name,
                others_2_charges: form.unitDetails[index].others_2_charges,
                others_3_charges_name: form.unitDetails[index].others_3_charges_name,
                others_3_charges: form.unitDetails[index].others_3_charges,
                estimated_total_price: form.unitDetails[index].estimated_total_price,
                gst_charges: form.unitDetails[index].gst_charges,
                registration_charges: form.unitDetails[index].registration_charges,
                floor_plan_path: form.unitDetails[index].floor_plan_path,
                created_by_type: 1
            }));

            const amenitiesApiCall = async (projectListingid) => {
                try {
                    const amenitiesPayloads = form['amenities_id']?.map((item) => ({
                        amenities_id: item?.id,
                        id: item?.paramId
                    }));

                    const payload = { payload: amenitiesPayloads };

                    const res = await projectClient.put(`update-listing-amenities/${projectListingid}`, payload);
                    if (res?.data?.status) {
                        await specialFeaturesApiCall(projectListingid);
                        toastSuccess('Project Data Saved Successfully');
                    } else {
                        toastError('Error in saving Project Data');
                    }
                } catch (error) {
                    console.error('Error in saving Project Data:', error);
                    toastError('Error in saving Project Data');
                }
            };

            const specialFeaturesApiCall = async (projectListingid) => {
                const specialFeaturesPayloadStructure = form['special_feature_id']?.map((item) => ({
                    special_feature_id: item?.id,
                    id: item?.paramId
                }));
                const payload = { payload: specialFeaturesPayloadStructure };
                try {
                    const res = await projectClient.patch(`update-special-features/${projectListingid}`, payload);
                    if (res?.data?.status) {
                        await banksApiCall(projectListingid);
                        toastSuccess('Project Data Saved Successfully');
                    } else {
                        toastError('Error in saving Project Data');
                    }
                } catch (error) {
                    toastError('Error in saving Project Data');
                }
            };

            const banksApiCall = async (projectListingid) => {
                const bankPayloadStructure = form['bank_id'].map((item) => ({
                    bank_id: item.id,
                    if: item.paramId
                }));
                const payload = { payload: bankPayloadStructure };
                try {
                    const res = await projectClient.put('listing-bank-mappings', payload);
                    if (res?.data?.status) {
                        imagesApiCall(projectListingid);
                    } else {
                        toastError('Error in saving Project Data');
                    }
                } catch (error) {
                    toastError('Error in saving Project Data');
                }
            };

            const furnishedApiCall = async (projectListingid) => {
                const furnished_items = form['furnishedName']?.map((item) => ({
                    item
                }))
                const additional_furnished_list = form['furnished_id']?.map((item) => ({
                    furnished: item.furnished
                }))
                const payload = { furnished_items, additional_furnished_list, project_listing_id: projectListingid };

                try {
                    const res = await projectClient.patch('update-furnished', payload);
                    if (res?.data?.status) {
                        videosApiCall(projectListingid)
                    }
                } catch (error) {
                    toastError('Error in saving Project Data');
                }
            }

            const videosApiCall = async (projectListingid) => {
                const payload = {
                    project_listing_id: projectListingid,
                    video1: form['video1'],
                    video2: form['video2'],
                    created_by_type: '1'
                }
                console.log('listing-video-links', payload);

                try {
                    const res = await projectClient.put('listing-video-links', payload)
                    if (res?.data?.status) {
                        toastSuccess('Data Saved Successfully');
                        dispatch(reset());
                        stepOne()
                    }
                } catch (err) {
                    toastError('Error in saving Videos Data');
                }
            }

            const ckEditorApiCall = async (projectListingId) => {
                const specificationPayloadStructure = form['specifications']?.map((item) => ({
                    specifications_id: item?.headId,
                    description: item?.description,
                    id: item?.id
                }));

                const payload = { payload: specificationPayloadStructure };

                try {
                    const res = await projectClient.patch(
                        `update-specifications/${projectListingId}`,
                        payload
                    );
                    if (res?.data?.status) {
                        if (form['furnishedStatus'] === 'Furnished') {
                            await furnishedApiCall(projectListingId)
                        } else {
                            videosApiCall(projectListingId)
                        }
                    }
                } catch (error) {
                    toastError('Error in saving Project Data');
                    console.log('specification error==', error);
                }
            };

            const imagesApiCall = async (projectListingid) => {
                const galleryPayloadStructure = form['file_path'].map((item) => {
                    const headIdNumber = Number(item?.headId);
                    return {
                        gallery_header_id: headIdNumber < 8 ? 0 : item?.headId,
                        thumbnail_path: item?.id,
                        metadata: 'test',
                        project_listing_id: projectListingid,
                        file_path: item?.id,
                        created_by_type: 1,
                        order: 1
                    };
                });

                const payload = { payload: galleryPayloadStructure };
                try {
                    const res = await projectClient.patch('listing-gallery', payload);
                    if (res?.data?.status) {
                        ckEditorApiCall(projectListingid);
                    } else {
                        toastError('Error in saving Project Data');
                    }
                } catch (error) {
                    toastError('Error in saving Project Data');
                }
            }

            try {
                setLoading(true);
                const resApi1 = await projectClient.patch(`listing-data/${form.id}`, apiData1);
                if (resApi1?.data?.status) {
                    await apiData2.map(async (payload, i) => {
                        const apiPayload = {
                            ...payload,
                            project_listing_id: resApi1?.data?.data?.id,
                            property_size_id: 0,
                            unit_status: 'A'
                        };

                        try {
                            const res = await projectClient.post('listing-units', apiPayload);
                            if (res?.data?.status) {
                            } else {
                                toastError('Error in saving Project Data');
                            }
                        } catch (error) {
                            toastError('Error in saving Project Data');
                        }
                    });
                    await amenitiesApiCall(resApi1?.data?.data?.id);
                } else {
                    toastError('Error in saving Project Data');
                }
            } catch (error) {
                toastError(error);
            } finally {
                setLoading(false);
            }

        } else {
            console.log(formError);
        }
    }





    return (
        <>
            {loading && <Loader />}
            <div className="main-content builder_projcts">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-12">
                                <div className="page-title-box d-flex align-items-center justify-content-between">
                                    <div className="page-title-right">
                                        <ol className="breadcrumb m-0">
                                            <li className="breadcrumb-item">
                                                <a href="javascript: void(0);">Terraterri</a>
                                            </li>
                                            <li className="breadcrumb-item active">Project Details</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className='col-md-12'>

                                {/* project type card  */}
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Project Type</h4>
                                    </div>
                                    <div className="card-body">
                                        <div className="row mb-3">
                                            <div className="col">
                                                <div className="form-floating">
                                                    <select
                                                        className="form-select"
                                                        name="property_type_id"
                                                        onChange={handleChange}
                                                        id="property_type_id"
                                                        value={form.property_type_id || ''}
                                                    >
                                                        <option value="default">select Project Type</option>
                                                        {projectType.map((project, index) => (
                                                            <option key={index} value={project.id}>
                                                                {project.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <label htmlFor="property_type_id" className="fw-normal">Select Project type</label>
                                                    {formError.property_type_id && <p className="err">{formError.property_type_id}</p>}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-floating">
                                                    <select
                                                        className="form-select"
                                                        name="property_sub_type_id"
                                                        id="property_sub_type_id"
                                                        required=""
                                                        onChange={handleChange}
                                                        value={form.property_sub_type_id || ''}
                                                    >
                                                        <option value="default">select sub project type</option>
                                                        {subProjectType.map((subProject, index) => (
                                                            <option key={index} value={subProject.id}>
                                                                {subProject.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <label htmlFor="property_sub_type_id" className="fw-normal">Select sub project type</label>
                                                    {formError.property_sub_type_id && (
                                                        <p className="err">{formError.property_sub_type_id}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Location card */}
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Project Location</h4></div>
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
                                                        value={form.country_code || ''}
                                                    >
                                                        <option value="default">Country</option>
                                                        {countries.map((country, index) => (
                                                            <option key={index + 1} value={country.country_code}>
                                                                {country.country_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <label htmlFor="country_code" className="fw-normal">Select Country</label>
                                                    {formError.country_code && <p className="err">{formError.country_code}</p>}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-floating">
                                                    <select
                                                        className="form-select"
                                                        name="state_code"
                                                        id="state_code"
                                                        required=""
                                                        onChange={handleChange}
                                                        value={form?.state_code || ''}
                                                    >
                                                        <option value="default">State</option>
                                                        {states.map((state, index) => (
                                                            <option key={index} value={state.state_code}>
                                                                {state.state_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <label htmlFor="state_code" className="fw-normal">Select State</label>
                                                    {formError.state_code && <p className="err">{formError.state_code}</p>}
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-floating">
                                                    <select
                                                        className="form-select"
                                                        name="city_code"
                                                        id="city_code"
                                                        required=""
                                                        onChange={handleChange}
                                                        value={form?.city_code || ''}
                                                    >
                                                        <option value="default">City / Town</option>
                                                        {cities.map((city, index) => (
                                                            <option key={index + 1} value={city.city_code}>
                                                                {city.city_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <label htmlFor="city_code" className="fw-normal">Select City</label>
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
                                                        value={form?.locality || ''}
                                                    >
                                                        <option value="default">Locality</option>
                                                        {localities.map((locality, index) => (
                                                            <option key={index} value={locality.locality_name}>
                                                                {locality.locality_name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <label htmlFor="locality" className="fw-normal">Select Locality</label>
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
                                                        value={form.sub_locality || ''}
                                                    />
                                                    <label htmlFor="subLocality" className="fw-normal">Select Sub Locality</label>
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
                                                        value={form.street_name || ''}
                                                    />
                                                    <label htmlFor="street_name" className="fw-normal">Street Name</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Name  */}
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Project Name</h4></div>
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
                                                        value={form?.project_name_id || ''}
                                                    >
                                                        <option value="default">Select Project</option>
                                                        {filteredProjects.map((project, index) => (
                                                            <option key={index} value={project.id}>
                                                                {project.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <label htmlFor="project_name_id" className="fw-normal">Select Project</label>
                                                    {formError.project_name_id && <p className="err">{formError.project_name_id}</p>}
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="form-floating">
                                                    <label htmlFor="builder_id" className="fw-normal builderclass">Builder Name</label>
                                                    {builder && <h6 className="builderNameCard nameCardh6">{builder && builder?.name}</h6>}
                                                    <input type="hidden" name="builder_id" id="builder" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    id="title"
                                                    className="form-control"
                                                    name="project_listing_name"
                                                    placeholder="Enter Title"
                                                    value={form.project_listing_name || ''}
                                                    onChange={handleChange}
                                                />
                                                <label htmlFor="title" className="fw-normal">Title</label>
                                                {formError.project_listing_name && (
                                                    <p className="err">{formError.project_listing_name}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

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
                                                        <img src={form?.real_estate_approval_document_path} width="150" height="80" />
                                                        <button className="btn btn-danger removebtn">Delete Image</button>
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
                                                onReady={(editor) => {
                                                    console.log('Editor is ready to use!', editor);
                                                }}
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

                                        <div className="row mb-3">
                                            <div className="row"></div>
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
                                                    <Tab key={i}  >{`unit - ${i + 1}`} </Tab>
                                                ))}
                                                {form.listing_type_id == 1 && (
                                                    <Tab className="btn plus-btn" onClick={() => {
                                                        setUnitClone(unitClone + 1)
                                                        window.scrollTo(0, 2000);
                                                    }}>
                                                        Add Unit
                                                    </Tab>
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
                                                                        (form.unitDetails[i] && form.unitDetails[i]?.property_facing_id) || ''
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
                                                                        value={(form.unitDetails[i] && form.unitDetails[i]?.villatype) || ''}
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
                                                                                (form.unitDetails[i] && form.unitDetails[i]?.property_bhk_size_id) || ''
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
                                                                            Plot Size
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
                                                                            value={(form.unitDetails[i] && form.unitDetails[i]?.plot_length) || ''}
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
                                                                            value={(form.unitDetails[i] && form.unitDetails[i]?.plot_breadth) || ''}
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
                                                                            (form.unitDetails[i] && form.unitDetails[i]?.super_built_up_area) || ''
                                                                        }
                                                                        onChange={(e) => handleChange(e, i)}
                                                                        onBlur={(e) => blurValidation(e, i)}
                                                                    />
                                                                    <label htmlFor="super-buildup-area" className="fw-normal">
                                                                        Super Build Up Area
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
                                                                        Carpet Area
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
                                                                            value={(form.unitDetails[i] && form.unitDetails[i]?.car_parkings) || ''}
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
                                                                            value={(form.unitDetails[i] && form.unitDetails[i]?.balconies) || ''}
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
                                                                            value={(form.unitDetails[i] && form.unitDetails[i]?.bathrooms) || ''}
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
                                                                            value={(form.unitDetails[i] && form.unitDetails[i]?.real_estate_approval_document_path) || ''}
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
                                                                <img src={form?.real_estate_approval_document_path} width="150" height="80" />
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
                                                                        value={(form.unitDetails[i] && form.unitDetails[i]?.currency) || ''}
                                                                    >
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
                                                                        Base Price {subType == '7' || subType == '8' ? '(Per Sq Ft)' : ''}
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
                                                                            Car Parking Charges
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
                                                                            Club House Charges
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
                                                                        Corpus Fund
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
                                                                        Maintenance Charges
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
                                                                        value={(form.unitDetails[i] && form.unitDetails[i]?.gst_charges) || ''}
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
                                                                            (form.unitDetails[i] && form.unitDetails[i]?.registration_charges) || ''
                                                                        }
                                                                        onChange={(e) => handleChange(e, i)}
                                                                    />
                                                                    <label htmlFor="amount" className="fw-normal">
                                                                        Registration Charges
                                                                    </label>
                                                                </div>
                                                                {formError.registration_charges && (
                                                                    <p className="text-danger">{formError.registration_charges}</p>
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
                                                {form.listing_type_id == 1 && (
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
                                                        value={form.water_source || ''}>
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
                                                        placeholder="Enter Base Price"
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
                                            <h4 className="card-title">Furnishing Status</h4>
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
                                                            <option value="default">Furnished Status</option>
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

                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Specifications</h4></div>
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
                                                                    Please enter the specifications for {header.name}
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
                                                                        onReady={(editor) => {
                                                                            console.log('Editor is ready to use!', editor);
                                                                        }}
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


                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Amenities</h4></div>
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
                                                                            id={item.special_features_header_id}
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
                                        </div>
                                    </div>
                                )}

                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Approved Bank Loans</h4></div>
                                    <div className="card-body">
                                        <div className="row mb-8">
                                            {banks.map((bank, index) => (
                                                <div className="col-3" key={index}>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input bankcheckbox"
                                                            type="checkbox"
                                                            id="axis"
                                                            name="bank_id"
                                                            required
                                                            onChange={handleCheck}
                                                            value={bank.id}
                                                            checked={form?.bank_id?.some((a) => a.id == bank.id) || ''}
                                                        />

                                                        <label className="form-check-label fw-medium bankclass" htmlFor="axis">
                                                            {bank.name}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Project Gallery</h4></div>
                                    <div className="card-body">
                                        <div className="row mb-3">
                                            <div className="row mb-5">
                                                <h4 className="disp_titl">Display Image</h4>
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
                                                                    onChange={handleImage1}
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

                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title">Posession status</h4></div>
                                    <div className="card-body">
                                        <div className="row mb-3">
                                            <div className="col-4">
                                                <div className="form-floating">
                                                    <select
                                                        className="form-select"
                                                        name="possession_status_id"
                                                        required
                                                        onChange={handleChange}
                                                        value={form.possession_status_id || ''}>
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

                                            {form.possession_status_id == 6 && (
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
                                                                value={form.possession_by || ''}
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
                                                                value={form.age_of_possession || ''}
                                                            />
                                                            <label htmlFor="project-type" className="fw-normal">
                                                                Age of Property{' '}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {(form.possession_status_id == 7 || form.possession_status_id == 8) && (
                                                <>
                                                    <div className="mb-3 col-4">
                                                        <div className="form-floating">
                                                            <input
                                                                type="date"
                                                                id="possession_by"
                                                                className="form-control"
                                                                name="possession_by"
                                                                placeholder=""
                                                                onChange={handleChange}
                                                                value={form.possession_by || ''}
                                                            />
                                                            <label htmlFor="project-type" className="fw-normal">
                                                                Possession By{' '}
                                                            </label>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="btnParent">
                                    <button className="btn customBtn" onClick={handleSubmit}>Update</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default ProjectDetails;
