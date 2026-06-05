import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleImages3 } from '../../utils/S3Handler';
import { toastError } from '../../utils/toast';
import Loader from '../../components/Loader';
import { masterClient } from '../../utils/httpClient';
import { setProject } from '../../store/slices/ProjectManagementSlice';
import { projectClient } from '../../utils/httpClient';
const stepTwo = ({ type, subType, isRent, isSale, prevStep, nextStep }) => {
  const [approvals, setApprovals] = useState([]);
  const [showApprovals, setShowApprovals] = useState(false);
  const [addApprovalCount, setAddApprovalCount] = useState(0);
  const [approvalTypes, setApprovalTypes] = useState([]);
  const [villaTypes, setVillaTypes] = useState([]);

  const [showPrice, setShowPrice] = useState({
    base: true,
    estimated: false
  });
  const maxAddApprovalCount = 2; // Set the maximum limit here

  const [formCount, setFormCount] = useState(0);
  const [houseType, setHouseType] = useState('1');
  const [propertySize, setPropertySize] = useState([]);

  const dispatch = useDispatch();

  const [communitis, setCommunities] = useState([]);
  const [saleableAres, setSaleableArea] = useState([]);
  const [propertyFacing, setPropertyFacing] = useState([]);
  const [bhkSize, setBhkSize] = useState([]);
  const [loading, setLoading] = useState(false);
  const formState = useSelector((state) => state.projectManagement['project']);
  const [unitDetails, setUnitDetails] = useState([]);
  const [form, setForm] = useState({ unitDetails: [], ...formState });
  const [formError, setFormError] = useState({});
  const [addedProjectUnit, setPUnit] = useState({});

  const handleAddChargesClick = () => {
    if (formCount < 2) {
      setFormCount((prevCount) => prevCount + 1);
    }
  };

  const handleAddApprovalClick = () => {
    setAddApprovalCount((prevCount) => prevCount + 1);

    if (addApprovalCount < maxAddApprovalCount) {
      setShowApprovals(true);
      const newApprovals = [...approvals, { key: approvals.length + 1 }];
      setApprovals(newApprovals);
    }
  };

  const getVillaTypes = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('villatypes');
      if (res?.data?.status) {
        setVillaTypes(res?.data?.data);
      }
    } catch (error) {
      console.log('Villa types error =====>', error);
    } finally {
      setLoading(false);
    }
  };

  //get Approval Authority
  const getApprovalAuthority = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('approval-authority');
      if (res?.data?.status) {
        const filter = res?.data?.data.filter((item) => item.city_code == formState.city_code);
        console.log('filter', filter);
        setApprovalTypes(filter);
      }
    } catch (error) {
      console.log('Approval Authority error =====>', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('form =====>', form);
  }, [form])


  const validate = () => {
    let isValid = true;
    const errors = {};

    if (subType !== '53') {
      if (form.approval_authority === 'default' || !form.approval_authority) {
        errors.approval_authority = 'Approval Authority is required';
        isValid = false;
      }
      if (!form.approval_number) {
        errors.approval_number = 'Approval Number is required';
        isValid = false;
      }
      // if (!form.approval_year) {
      //   errors.approval_year = 'Approval Year is required';
      //   isValid = false;
      // }
      // if (!form.approval_document_path) {
      //   errors.approval_document_path = 'Approval Document is required';
      //   isValid = false;
      // }
      if (!form.real_estate_authority) {
        errors.real_estate_authority = 'Real Estate Authority is required';
        isValid = false;
      }
      if (!form.real_estate_approval_number) {
        errors.real_estate_approval_number = 'Real Estate Approval Number is required';
        isValid = false;
      }
      // if (!form.real_estate_approval_year) {
      //   errors.real_estate_approval_year = 'Real Estate Approval Year is required';
      //   isValid = false;
      // }
      // if (!form.real_estate_approval_document_path) {
      //   errors.real_estate_approval_document_path = 'Real Estate Approval Document is required';
      //   isValid = false;
      // }
    }

    if (subType == '38' ||
      subType == '39' ||
      subType == '50' ||
      subType == '51' ||
      subType == '40' ||
      subType == '54' ||
      subType == '55') {
      if (!form.total_project_land_area) {
        errors.total_project_land_area = 'Total Project Land Area is required';
        isValid = false;
      }
      if (!form.total_project_land_area_size_id) {
        errors.total_project_land_area_size_id = 'Total Project Land Area Size is required';
        isValid = false;
      }

      if (subType == '38' || subType == '54' || subType == '55' || subType == '51') {
        if (!form.totalNumberOfBlocks) {
          errors.totalNumberOfBlocks = 'Total Number Of Blocks is required';
          isValid = false;
        }
      }

      if (subType == '38' || subType == '51') {
        if (!form.totalNumberOfUnits) {
          errors.totalNumberOfUnits = 'Total Number Of Units is required';
          isValid = false;
        }
      }

      if (subType == '39' ||
        subType == '48' ||
        subType == '52' ||
        subType == '53' ||
        subType == '40' ||
        subType == '56' ||
        subType == '57' ||
        subType == '50' ||
        subType == '58') {
        if (!form.community_type_id) {
          errors.community_type_id = 'Community Type is required';
          isValid = false;
        }

        if (!form.totalNumberOfUnits) {
          errors.totalNumberOfUnits = 'Community Type is required';
          isValid = false;
        }
      }

      if (!form.project_layout_document_path) {
        errors.project_layout_document_path = 'Project Layout Plan is required';
        isValid = false;
      }

      if (!form.project_description) {
        errors.project_description = 'Project Description is required';
        isValid = false;
      }

    }

    if (form.unitDetails) {
      errors.unitDetails = [];

      form.unitDetails.forEach((unit, index) => {
        let unitErrors = {};

        if (!unit.property_facing_id || unit.property_facing_id === 'default') {
          unitErrors['property_facing_id'] = 'Property Facing is required';
          isValid = false;
        }

        if (subType == '38' || subType == '51' || subType == '39') {

          if (!unit.property_bhk_size_id) {
            unitErrors['property_bhk_size_id'] = 'Property BHK Size is required';
            isValid = false;
          }

          if (!unit.super_built_up_area) {
            unitErrors['super_built_up_area'] = 'Super Built Up Area is required';
            isValid = false;
          }

        }

        if (subType == '38' || subType == '54' || subType == '55' || subType == '51') {
          if (!unit.carpet_area) {
            unitErrors['carpet_area'] = 'Carpet Area is required';
            isValid = false;
          }
        }

        if (subType == '38' ||
          subType == '39' ||
          subType == '54' ||
          subType == '55' ||
          subType == '50' ||
          subType == '51') {

          if (!unit.car_parkings) {
            unitErrors['car_parkings'] = 'Car Parking is required';
            isValid = false;
          }
          if (!unit.balconies) {
            unitErrors['balconies'] = 'Balconies are required';
            isValid = false;
          }
          if (!unit.bathrooms) {
            unitErrors['bathrooms'] = 'Bathrooms are required';
            isValid = false;
          }
        }


        if (!unit.floor_plan_path) {
          unitErrors['floor_plan_path'] = 'Floor Plan is required';
          isValid = false;
        }

        if (subType == '39' ||
          subType == '48' ||
          subType == '52' ||
          subType == '53' ||
          subType == '40' ||
          subType == '56' ||
          subType == '57' ||
          subType == '50' ||
          subType == '58') {

          if (!unit.plot_size) {
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
        }

        if (subType != '48' &&
          subType != '52' &&
          subType != '53' &&
          subType != '56' &&
          subType != '57' &&
          subType != '58') {
          if (!unit.base_price) {
            unitErrors['base_price'] = 'Base Price is required';
            isValid = false;
          }
          if (!unit.total_base_price) {
            unitErrors['total_base_price'] = 'Total Base Price is required';
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
        }

        if (subType !== '40' && subType !== '53' && subType !== '58') {

          if (!unit.car_parking_charges && subType !== "9") {
            unitErrors['car_parking_charges'] = 'Car Parking Charges are required';
            isValid = false;
          }

        }

        if (Object.keys(unitErrors).length > 0) {
          errors.unitDetails[index] = unitErrors;
        }
      });
    }

    // if (subType !== '40' && subType !== '53' && subType !== '58' && subType !== "48" && subType !== "50" && subType !== '52' && !form.property_size_representation_id && subType != '9') {
    //   errors.property_size_representation_id = 'Property Size Representation is required';
    //   isValid = false;
    // }
    // if (!form.property_min_size) {
    //   errors.property_min_size = 'Property Min Size is required';
    //   isValid = false;
    // }
    // if (!form.property_max_size) {
    //   errors.property_max_size = 'Property Max Size is required';
    //   isValid = false;
    // }
    // if ((subType == "38" || subType == "39" || subType == "51") && !form.sizeRepresentation) {
    //   errors.sizeRepresentation = 'Size Representation is required';
    //   isValid = false;
    // }

    if (!form.unitDetails || form.unitDetails.length === 0) {
      errors.unitDetailsError = 'UnitDetails is Required';
      isValid = false;
    }

    // if (!form.preffered_location_charges_facing_per_sft) {
    //   errors.preffered_location_charges_facing_per_sft =
    //     'Preferred Location Charges (Facing per sqft) are required';
    //   isValid = false;
    // }
    // if (!form.preffered_location_charges_corner_per_sft) {
    //   errors.preffered_location_charges_corner_per_sft =
    //     'Preferred Location Charges (Corner per sqft) are required';
    //   isValid = false;
    // }
    if (!form.months && subType == '7') {
      errors.months = 'Months are required';
      isValid = false;
    }

    console.log('errors', JSON.stringify(errors, null, 2));
    setFormError(errors);
    return isValid;
  };

  const handleCalEstPr = (i) => {
    console.log('form?.unitDetails[i]', form?.unitDetails);
    const updatedUnitDetails = calculateTotalEstimatePrice(form?.unitDetails);
    setForm((prevForm) => ({ ...prevForm, ...formState, unitDetails: updatedUnitDetails }));
  };

  const calculateTotalEstimatePrice = useCallback((unitDetails) => {
    console.log();
    console.log('its a function to make arithmetic', unitDetails);
    console.log('its a function to make arithmetic', typeof unitDetails);

    const updatedUnitDetails = unitDetails.map((unit) => {
      const totalBasePrice = Number(unit.total_base_price) || 0;
      const amenitiesCharges = Number(unit.amenities_charges) || 0;
      const carParkingCharges = Number(unit.car_parking_charges) || 0;
      const corpusFund = Number(unit.corpus_fund) || 0;
      const advanceMaintenanceCharges = Number(unit.advance_maintenance_charges) || 0;
      const legalCharges = Number(unit.legal_charges) || 0;
      const others1Charges = Number(unit.others_1_charges) || 0;
      const others2Charges = Number(unit.others_2_charges) || 0;

      const totalEstimatePrice =
        totalBasePrice +
        amenitiesCharges +
        carParkingCharges +
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

  const handlePriceTypeChange = (e) => {
    if (e.target.name === 'basePrice') {
      setShowPrice({
        base: true,
        estimated: false
      });
    } else {
      setShowPrice({
        base: false,
        estimated: true
      });
    }
    console.log(showPrice);
  };

  const handleSubmit = async () => {
    if (validate()) {
      dispatch(setProject(form));
      nextStep();
    }
    else {
      console.log(formError)
    }
  };

  const handleImage = async (e, index) => {
    setLoading(true);
    let resFromMiddleware = await handleImages3(e);
    setLoading(false);
    if (resFromMiddleware.clientStatus) {
      if (index == 0) {
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

  const handleDeleteImage = (val) => {
    console.log('val', val);

    // delete val
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

  const getCommunityTypes = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('communityTypes');
      if (res?.data?.status) {
        setCommunities(res?.data?.data);
      }
    } catch (error) {
      console.log('error result=====', error);
    } finally {
      setLoading(false);
    }
  };

  const getSaleableArea = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('saleable-area-representation');
      if (res?.data?.status) {
        setSaleableArea(res?.data?.data);
      }
    } catch (error) {
      console.log('error result=====', error);
    } finally {
      setLoading(false);
    }
  };

  const getPropertyFacing = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('propertyfacing');
      if (res?.data?.status) {
        setPropertyFacing(res?.data?.data);
      }
    } catch (error) {
      console.log('error result=====', error);
    } finally {
      setLoading(false);
    }
  };

  const getBHKsizes = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('bhksizes');
      if (res?.data?.status) {
        setBhkSize(res?.data?.data);
      }
    } catch (error) {
      console.log('error result=====', error);
    } finally {
      setLoading(false);
    }
  };

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

  const blurValidation = (e, i) => {
    let newErrors = {};

    // if (e.target.name === 'property_bhk_size_id') {
    //   let bhkValue = bhkSize.find((item) => item.id == e.target.value);
    //   setAttributes({
    //     minSize: bhkValue?.min_size,
    //     maxSize: bhkValue?.max_size,
    //     bathrooms: bhkValue?.no_of_bathrooms,
    //     balconies: bhkValue?.no_of_balconies,
    //     car_parkings: bhkValue?.no_of_parkings
    //   });
    // }

    // if (e.target.name == 'super_built_up_area') {
    //   let minSize = attributes.minSize;
    //   let maxSize = attributes.maxSize;

    //   console.log('super', minSize, maxSize);

    //   if (
    //     !(Number(e.target.value) >= minSize && Number(e.target.value) <= maxSize) &&
    //     subType == '7'
    //   ) {
    //     newErrors = {
    //       ...newErrors,
    //       super_built_up_area: `Super built up area should be between ${minSize} and ${maxSize}`
    //     };
    //   } else if (
    //     !(
    //       Number(e.target.value) >= Number(form.property_min_size) &&
    //       Number(e.target.value) <= Number(form.property_max_size)
    //     )
    //   ) {
    //     console.log('form error', Number(form.property_min_size));

    //     newErrors = {
    //       ...newErrors,
    //       super_built_up_area: `The value is not within the range specified by property min and max sizes`
    //     };
    //   } else {
    //     newErrors = {
    //       ...newErrors,
    //       super_built_up_area: ''
    //     };
    //   }
    // }

    // if (e.target.name == 'carpet_area') {
    //   if (Number(form.unitDetails[i].super_built_up_area) < Number(e.target.value)) {
    //     newErrors = {
    //       ...newErrors,
    //       carpet_area: 'Carpet area should be less than super built up area'
    //     };
    //   } else {
    //     newErrors = {
    //       ...newErrors,
    //       carpet_area: ''
    //     };
    //   }
    // }

    if (e.target.name == 'base_price') {
      if (form.unitDetails[0].property_size_representation_id == "9") {
        let basePrice = e.target.value;
        let totalBasePrice = Number(basePrice) * Number(form.unitDetails[0].super_built_up_area);
        console.log(form.unitDetails[0].super_built_up_area, "total===base")
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
      } else if (form.unitDetails[0].property_size_representation_id == "10") {
        let basePrice = e.target.value;
        let totalBasePrice = Number(basePrice) * Number(form.unitDetails[0].carpet_area);
        console.log(form.unitDetails[0].carpet_area, "total===base")

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
      }
      // else if(subType == "9"){

      //   let basePrice = e.target.value;
      //   let totalBasePrice = Number(basePrice) * Number(form.unitDetails[i].plot_size);
      //   setForm((prevForm) => ({
      //     ...prevForm,
      //     unitDetails: prevForm.unitDetails.map((unit, index) =>
      //       index === i ? { ...unit, total_base_price: totalBasePrice } : unit
      //     )
      //   }));

      //   setUnitDetails((prevUnitDetails) =>
      //     prevUnitDetails.map((unit, index) =>
      //       index === i ? { ...unit, total_base_price: totalBasePrice } : unit
      //     )
      //   );

      // }
    }

    setFormError({ ...formError, ...newErrors });
  };

  useEffect(() => {
    getApprovalAuthority();
    getCommunityTypes();
    getSaleableArea();
    getPropertyFacing();
    getBHKsizes();
    getPropertySizes();
    getVillaTypes();
    getUnitSizes();

    if (form.unitDetails.length > 0) {
      setUnitDetails(form?.unitDetails);
    }
  }, []);

  const getUnitSizes = async () => {
    setLoading(true)
    try {
      const res = await projectClient.get('listing-units');
      if (res?.data?.status) {
        const units = res?.data.data.filter(unit => unit.project_listing_id == form.id)
        setPUnit(units[0])
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
      {subType !== '53' && (
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
                  <label for="size-representation" className="fw-normal">
                    Approval authority
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
                  <label for="approval-number" className="fw-normal">
                    Approval Number
                  </label>
                </div>
                {formError.approval_number && (
                  <p className="text-danger">{formError.approval_number}</p>
                )}
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
                    onChange={handleChange}
                    value={form.approval_year || ''}
                  />
                  <label for="year-of-approval" className="fw-normal">
                    Year Of Approval
                  </label>
                </div>
                {formError.approval_year && (
                  <p className="text-danger">{formError.approval_year}</p>
                )}
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

                    <label for="project-type" className="fw-normal">
                      Upload Document
                    </label>
                  </div>
                ) : (
                  <div className="col-md-12 imgclass">
                    {/* <label className="fw-normal imgprevclass">Image Preview</label> */}
                    <img src={form?.approval_document_path} width="150" height="80" />
                    <button className="btn btn-danger removebtn">Delete Image</button>
                  </div>
                )}
                {formError.approval_document_path && (
                  <p className="text-danger">{formError.approval_document_path}</p>
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
                  <label for="size-representation" className="fw-normal">
                    Real-estate authority
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
                  <label for="approval-number" className="fw-normal">
                    Approval Number
                  </label>
                </div>
                {formError.real_estate_approval_number && (
                  <p className="text-danger">{formError.real_estate_approval_number}</p>
                )}
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
                  <label for="year-of-approval" className="fw-normal">
                    Year Of Approval
                  </label>
                </div>
                {formError.real_estate_approval_year && (
                  <p className="text-danger">{formError.real_estate_approval_year}</p>
                )}
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
                    <label for="project-type" className="fw-normal">
                      Upload Document
                    </label>
                  </div>
                ) : (
                  <div className="col-md-12 imgclass">
                    {/* <label className="fw-normal imgprevclass">Image Preview</label> */}
                    <img src={form?.real_estate_approval_document_path} width="150" height="80" />
                    <button className="btn btn-danger removebtn">Delete Image</button>
                  </div>
                )}
                {formError.real_estate_approval_document_path && (
                  <p className="text-danger">{formError.real_estate_approval_document_path}</p>
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
                      <label for="approval-name" className="fw-normal">
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
                      <label for="approval-number" className="fw-normal">
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
                      <label for="year-of-approval" className="fw-normal">
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
                      <label for="project-type" className="fw-normal">
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
                      <label for="approval-name" className="fw-normal">
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
                      <label for="approval-number" className="fw-normal">
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
                      <label for="year-of-approval" className="fw-normal">
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
                      <label for="project-type" className="fw-normal">
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
                      <label for="approval-name" className="fw-normal">
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
                      <label for="approval-number" className="fw-normal">
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
                      <label for="year-of-approval" className="fw-normal">
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
                      <label for="project-type" className="fw-normal">
                        Upload Document
                      </label>
                    </div>
                  </div>
                  {/* <div className='col'>
                <p className='viewBtn'>View uploaded image</p>
              </div> */}
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
      )}

      {(subType == '38' ||
        subType == '39' ||
        subType == '50' ||
        subType == '51' ||
        subType == '40' ||
        subType == '54' ||
        subType == '55') && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Project Details</h3>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-4">
                  <div className="form-floating">
                    <input
                      type="number"
                      id="total_project_land_area"
                      className="form-control"
                      name="total_project_land_area"
                      placeholder="Enter Enter"
                      required
                      value={form.total_project_land_area || ''}
                      onChange={handleChange}
                    />
                    <label for="total_project_land_area" className="fw-normal">
                      Total Project Land Area
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
                    <label for="size-representation" className="fw-normal">
                      Land area representation
                    </label>
                  </div>
                  {formError.total_project_land_area_size_id && (
                    <p className="text-danger">{formError.total_project_land_area_size_id}</p>
                  )}
                </div>
              </div>

              {(subType == '38' || subType == '54' || subType == '55' || subType == '51') && (
                <div>
                  <div className="row mb-3">
                    <div className="col-4">
                      <div className="form-floating">
                        <input
                          type="number"
                          id="total-no-of-blocks"
                          className="form-control"
                          name="total_project_land_area_size_id"
                          placeholder="Enter Enter"
                          required
                          value={form.totalNumberOfBlocks || ''}
                          onChange={handleChange}
                        />
                        <label for="total-no-of-blocks" className="fw-normal">
                          Total Number Of Blocks
                        </label>
                      </div>
                      {formError.totalNumberOfBlocks && (
                        <p className="text-danger">{formError.totalNumberOfBlocks}</p>
                      )}
                    </div>

                    <div className="col-4">
                      <div className="form-floating">
                        <input
                          type="number"
                          id="number-of-floors-blocks"
                          className="form-control"
                          name="numberOfFlooorsBlocks"
                          placeholder="Enter Enter"
                          required
                          value={form.numberOfFlooorsBlocks || ''}
                          onChange={handleChange}
                        />
                        <label for="number-of-floors-blocks" className="fw-normal">
                          Number Of Floors/Block
                        </label>
                      </div>
                      {formError.numberOfFloorsBlocks && (
                        <p className="text-danger">{formError.numberOfFloorsBlocks}</p>
                      )}
                    </div>

                  </div>

                  {(subType == '38' || subType == '51') && (
                    <div className="row mb-3">
                      <div className="col-4">
                        <div className="form-floating">
                          <input
                            type="number"
                            id="number-of-units-blocks"
                            className="form-control"
                            name="numberOfUnitsBlocks"
                            placeholder="Enter Enter"
                            required
                            value={form.numberOfUnitsBlocks || ''}
                            onChange={handleChange}
                          />
                          <label for="number-of-units-blocks" className="fw-normal">
                            Number Of Units/Block
                          </label>
                        </div>
                      </div>
                      <div className="col-4">
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
                          <label for="total-number-of-units" className="fw-normal">
                            Total Number Of Units
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {(subType == '39' ||
                subType == '48' ||
                subType == '52' ||
                subType == '53' ||
                subType == '40' ||
                subType == '56' ||
                subType == '57' ||
                subType == '50' ||
                subType == '58') && (
                  <div className="row mb-3">
                    <div className="col-3 mb-3">
                      <div className="form-floating ">
                        <select
                          className="form-select"
                          name="community_type_id"
                          required
                          onChange={handleChange}
                          value={form.community_type_id || ''}
                        >
                          <option value="default">Select Community Type</option>
                          {communitis.map((item, index) => (
                            <option key={index} value={item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        <label for="size-representation" className="fw-normal">
                          Community type
                        </label>
                        {formError.community_type_id && (
                          <p className="text-danger">{formError.community_type_id}</p>
                        )}
                      </div>
                    </div>

                    <div className="col-3">
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
                        <label for="total-number-of-units" className="fw-normal">
                          {subType == '39' ? 'Number Of Villas' : 'Number Of Units'}{' '}
                        </label>
                      </div>
                    </div>
                  </div>
                )}

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
                    <label for="project-layout-plan" className="fw-normal">
                      Project Layout Plan
                    </label>
                  </div>
                ) : (
                  <div className="col-md-12 imgclass">
                    {/* <label className="fw-normal imgprevclass">Image Preview</label> */}
                    <img src={form?.project_layout_document_path} width="150" height="80" />
                  </div>
                )}
                {formError.project_layout_document_path && (
                  <p className="text-danger">{formError.project_layout_document_path}</p>
                )}
              </div>

              <div className="mb-3">
                <h1 className="card-title mb-3 unitclass">Description</h1>
                <CKEditor
                  editor={ClassicEditor}
                  name="project_description"
                  data={form.project_description}
                  onReady={(editor) => {
                    // You can store the "editor" and use when it is needed.
                    console.log('Editor is ready to use!', editor);
                  }}
                  // // value={form.project_description}
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
            </div>
          </div>
        )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{subType == '53' ? 'Land Details' : 'Unit Details'} </h3>
        </div>
        <div className="card-body">
          {subType !== '40' && subType !== '53' && subType !== '58' && subType !== "48" && subType !== "50" && subType !== '52' && (
            <div className="row ">
              <div className="form-floating mb-3 col-4">
                <select
                  className="form-select"
                  data-id="unitDetailsData"
                  name="property_size_representation_id"
                  required
                  onChange={(e) => handleChange(e, 0)}
                  value={form?.unitDetails[0]?.property_size_representation_id || ''}
                >
                  <option value="default">Saleable Area Representation</option>
                  {saleableAres.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <label for="size-representation" className="fw-normal">
                  Saleable area representation
                </label>
                {formError.property_size_representation_id && (
                  <p className="text-danger">{formError.property_size_representation_id}</p>
                )}
              </div>

              {
                (subType == "38" || subType == "39" || subType == "51") ? (
                  <div className="col-4">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        name="sizeRepresentation"
                        data-id="unitDetailsData"
                        required
                        onChange={(e) => handleChange(e, 0)}
                        value={(form?.unitDetails && form?.unitDetails[0]?.sizeRepresentation) || ''}>
                        <option value="default">Size Rep</option>
                        <option value="Sq.ft">Sq.ft</option>
                        {/* <option value="Sq.meter">Sq.meter</option>
                      <option value="Sq.Yard">Sq.Yard</option> */}
                      </select>
                      <label for="size-representation" className="fw-normal">
                        Size Representation
                      </label>
                    </div>
                  </div>

                ) : (

                  <div className="col-4">
                    <div className="form-floating">
                      <select
                        className="form-select"
                        name="sizeRepresentation"
                        data-id="unitDetailsData"
                        required
                        onChange={(e) => handleChange(e, 0)}
                        value={(form?.unitDetails && form?.unitDetails[0]?.sizeRepresentation) || ''}>
                        <option value="default">Size Rep</option>
                        <option value="Sq.ft">Sq.ft</option>
                        <option value="Sq.meter">Sq.meter</option>
                        <option value="Sq.Yard">Sq.Yard</option>
                      </select>
                      <label for="size-representation" className="fw-normal">
                        Size Representation
                      </label>
                    </div>
                  </div>

                )
              }


            </div>
          )}

          {(subType == '38' || subType == '54' || subType == '55' || subType == '51') && (
            <div className="row mb-3">
              <div className="col-4 ">
                <div className="form-floating">
                  <input
                    type="number"
                    data-id="unitDetailsData"
                    className="form-control"
                    name="super_built_up_area"
                    placeholder="Enter Enter"
                    required
                    value={(form?.unitDetails[0] && form.unitDetails[0]?.super_built_up_area) || ''}
                    onChange={(e) => handleChange(e, 0)}
                  // onBlur={(e) => blurValidation(e, i)}
                  />
                  <label for="super-buildup-area" className="fw-normal">
                    Super Build Up Area {form?.unitDetails[0]?.sizeRepresentation ? `(in ${form?.unitDetails[0]?.sizeRepresentation})` : "(in Sq.ft)"}
                  </label>
                </div>
                {formError?.super_built_up_area && (
                  <p className="text-danger">{formError?.super_built_up_area}</p>
                )}
              </div>
              <div className="col-4">
                <div className="form-floating">
                  <input
                    type="number"
                    data-id="unitDetailsData"
                    className="form-control"
                    name="carpet_area"
                    placeholder="Enter Enter"
                    required
                    value={(form.unitDetails[0] && form.unitDetails[0]?.carpet_area) || ''}
                    onChange={(e) => handleChange(e, 0)}
                  // onBlur={(e) => blurValidation(e, i)}
                  />
                  <label for="carpet-area" className="fw-normal">
                    Carpet Area {form?.unitDetails[0]?.sizeRepresentation ? `(in ${form?.unitDetails[0]?.sizeRepresentation})` : "(in Sq.ft)"}
                  </label>
                </div>
                {formError?.carpet_area && <p className="text-danger">{formError?.carpet_area}</p>}
              </div>
            </div>
          )}

          <div className="row mb-3">
            {(subType == '39' ||
              subType == '48' ||
              subType == '52' ||
              subType == '51' ||
              subType == '56' ||
              subType == '50' ||
              subType == '57') && (
                <div className="col-3">
                  <div className="form-floating">
                    <select
                      onChange={handleChange}
                      name="villa_type_id"
                      className="form-select"
                      data-id="unitDetailsData"
                      value={form.villa_type_id || ''}
                    >
                      <option value="default">
                        {subType == '39'
                          ? 'Villa Type'
                          : subType == '48'
                            ? 'House Type'
                            : subType == '51'
                              ? 'Pent House Type'
                              : 'Building Type'}
                      </option>
                      {villaTypes.map((item, index) => (
                        <option key={index} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                    <label for="size-representation" className="fw-normal">
                      {subType == '39'
                        ? 'Villa Type'
                        : subType == '48'
                          ? 'House Type'
                          : subType == '51'
                            ? 'Pent House Type'
                            : 'Building Type'}
                    </label>
                  </div>
                  {/* {formError.months && <p className="text-danger">{formError.months}</p>} */}
                </div>
              )}

            {(subType == '38' || subType == '51' || subType == '39') && (
              <div className="col-3 mb-3">
                <div className="form-floating">
                  <select
                    className="form-select"
                    name="property_bhk_size_id"
                    required
                    onChange={(e) => handleChange(e, 0)}
                    data-id="unitDetailsData"
                    value={(form.unitDetails[0] && form.unitDetails[0]?.property_bhk_size_id) || ''}
                  //  onBlur={blurValidation}
                  >
                    <option value="default">Select BHK Size</option>
                    {bhkSize.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <label for="size-representation" className="fw-normal">
                    Select BHK Sizes
                  </label>
                </div>
                {formError?.property_bhk_size_id && (
                  <p className="text-danger">{formError?.property_bhk_size_id}</p>
                )}
              </div>
            )}
          </div>

          <div className="row mb-4">
            {(subType == '38' || subType == '51') && (
              <div className="col-3">
                <div className="form-floating">
                  <input
                    type="text"
                    id="floor-number"
                    className="form-control"
                    name="floorNumber"
                    placeholder="Enter Title"
                    data-id="unitDetailsData"
                    value={(form.unitDetails[0] && form.unitDetails[0]?.floorNumber) || ''}
                    onChange={(e) => handleChange(e, 0)}
                    required
                  />
                  <label for="floor-number" className="fw-normal">
                    Floor Number
                  </label>
                </div>
              </div>
            )}

            <div className="col-3 mb-3">
              <div className="form-floating">
                <select
                  className="form-select"
                  name="property_facing_id"
                  data-id="unitDetailsData"
                  required
                  onChange={(e) => handleChange(e, 0)}
                  value={(form.unitDetails[0] && form.unitDetails[0]?.property_facing_id) || ''}>
                  <option value="default">Select Facing</option>
                  {propertyFacing.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <label for="size-representation" className="fw-normal">
                  Select facing
                </label>
              </div>
              {formError?.property_facing_id && (
                <p className="text-danger">{formError?.property_facing_id}</p>
              )}
            </div>
          </div>

          {(subType == '39' ||
            subType == '48' ||
            subType == '52' ||
            subType == '53' ||
            subType == '40' ||
            subType == '56' ||
            subType == '57' ||
            subType == '50' ||
            subType == '58') && (
              <div className="row">
                <h5 className="unitclass">
                  {' '}
                  {subType == '39'
                    ? 'Villa Plot Details'
                    : subType == '53'
                      ? 'Land Details'
                      : 'Plot Details'}{' '}
                </h5>
                <div className="col-3 mb-3">
                  <div className="form-floating">
                    <input
                      type="number"
                      data-id="unitDetailsData"
                      className="form-control"
                      name="plot_size"
                      placeholder="Enter Enter"
                      required
                      value={(form.unitDetails[0] && form.unitDetails[0]?.plot_size) || ''}
                      onChange={(e) => handleChange(e, 0)}
                    />
                    <label for="super-buildup-area" className="fw-normal">
                      {subType == '53' ? 'Land Size' : 'Plot Size'}
                    </label>
                  </div>
                </div>
                {/* {(subType == '40' || subType == '53' || subType == '58' || subType =="39" || subType =="") && ( */}
                <div className="col-2 mb-3">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      name="sizeRepresentation"
                      required
                      value={form?.sizeRepresentation || ''}
                      onChange={handleChange}
                    >
                      <option value="default">Select Size Rep</option>
                      <option value="sq.ft">Sq.ft</option>
                      <option value="Sq.yards">Sq.yards</option>
                      <option value="sq.meters">Sq.meters</option>
                      <option value="Cents">Cents</option>
                    </select>

                    <label for="size-representation" className="fw-normal">
                      Size Rep
                    </label>
                  </div>
                  {/* {formError.sizeRepresentation && (
                          <p className="text-danger">{formError.sizeRepresentation}</p>
                        )} */}
                </div>
                {/* )} */}
              </div>
            )}

          {(subType == '39' ||
            subType == '48' ||
            subType == '52' ||
            subType == '53' ||
            subType == '40' ||
            subType == '56' ||
            subType == '50' ||
            subType == '57' ||
            subType == '58') && (
              <div className="row mb-3">
                <h5 className="fw-normal">
                  {' '}
                  {subType == '53' ? 'Land Dimensions' : 'Plot Dimensions'}
                </h5>
                <div className="col-2 mb-3">
                  <div className="form-floating">
                    <input
                      type="number"
                      data-id="unitDetailsData"
                      className="form-control"
                      name="plot_length"
                      placeholder="Enter Enter"
                      required
                      value={(form.unitDetails[0] && form.unitDetails[0]?.plot_length) || ''}
                      onChange={(e) => handleChange(e, 0)}
                    />
                    <label for="super-buildup-area" className="fw-normal">
                      Length (in ft)
                    </label>
                  </div>
                </div>
                <div className="col-1 d-flex align-items-center">
                  <h5 className=" ">×</h5>
                </div>

                <div className="col-2 mb-3">
                  <div className="form-floating">
                    <input
                      type="number"
                      data-id="unitDetailsData"
                      className="form-control"
                      name="plot_breadth"
                      placeholder="Enter Enter"
                      required
                      value={(form.unitDetails[0] && form.unitDetails[0]?.plot_breadth) || ''}
                      onChange={(e) => handleChange(e, 0)}
                    />
                    <label for="super-buildup-area" className="fw-normal">
                      Breadth (in ft)
                    </label>
                  </div>
                </div>
                {/* <div className="col-2 mb-3">
                <div className="form-floatin g">
                  <select className="form-select" name="sizeRepresentation" required value="">
                    <option value="default">Select Size Rep</option>
                    <option value="1">sq.ft</option>
                  </select>

                  <label for="size-representation" className="fw-normal">
                    Size Rep
                  </label>
                </div>
                
              </div> */}
              </div>
            )}

          {(subType == '39' ||
            subType == '48' ||
            subType == '52' ||
            subType == '56' ||
            subType == '50' ||
            subType == '57') && (
              <div className="row mb-3">
                <h5 className="fw-normal unitclass mb-3">
                  {subType == '39'
                    ? 'Villa Built Up Details'
                    : subType == '48'
                      ? 'House Built Up Details'
                      : 'Building Built Up Details'}
                </h5>
                <div className="col-3">
                  <div className="form-floating">
                    <input
                      type="number"
                      data-id="unitDetailsData"
                      className="form-control"
                      name="super_built_up_area"
                      placeholder="Enter Enter"
                      required
                      value={
                        (form.unitDetails[0] && form.unitDetails[0]?.super_built_up_area) || ''
                      }
                      onChange={(e) => handleChange(e, 0)}
                      onBlur={(e) => blurValidation(e, 0)}
                    />
                    <label for="super-buildup-area" className="fw-normal">
                      Super Built Up Area {form?.unitDetails[0]?.sizeRepresentation ? `(in ${form?.unitDetails[0]?.sizeRepresentation})` : "(in Sq.ft)"}
                    </label>
                  </div>
                </div>
                <div className="col-3">
                  <div className="form-floating">
                    <input
                      type="number"
                      data-id="unitDetailsData"
                      className="form-control"
                      name="carpet_area"
                      placeholder="Enter Enter"
                      required
                      value={(form.unitDetails[0] && form.unitDetails[0]?.carpet_area) || ''}
                      onChange={(e) => handleChange(e, 0)}
                      onBlur={(e) => blurValidation(e, 0)}
                    />
                    <label for="carpet-area" className="fw-normal">
                      Carpet Area {form?.unitDetails[0]?.sizeRepresentation ? `(in ${form?.unitDetails[0]?.sizeRepresentation})` : "(in Sq.ft)"}
                    </label>
                  </div>
                </div>
              </div>
            )}

          {(subType == '38' ||
            subType == '39' ||
            subType == '54' ||
            subType == '55' ||
            subType == '50' ||
            subType == '51') && (
              <div className="row mb-3">
                <div className="col-3 mb-3">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      data-id="unitDetailsData"
                      name="car_parkings"
                      required
                      onChange={(e) => handleChange(e, 0)}
                      value={(form.unitDetails[0] && form.unitDetails[0]?.car_parkings) || ''}>
                      <option value="default">Car Parking</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    <label for="size-representation" className="fw-normal">
                      No.of Car Parkings
                    </label>
                  </div>
                </div>

                <div className="col-3 mb-3">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      data-id="unitDetailsData"
                      name="balconies"
                      required
                      onChange={(e) => handleChange(e, 0)}
                      value={(form.unitDetails[0] && form.unitDetails[0]?.balconies) || ''}>
                      <option value="default">Balconies</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    <label for="size-representation" className="fw-normal">
                      No.of balconies
                    </label>
                  </div>
                </div>
                <div className="col-3 mb-3">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      data-id="unitDetailsData"
                      name="bathrooms"
                      required
                      onChange={(e) => handleChange(e, 0)}
                      value={(form.unitDetails[0] && form.unitDetails[0]?.bathrooms) || ''}>
                      <option value="default">Bathrooms</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                    <label for="size-representation" className="fw-normal">
                      No.of bathrooms
                    </label>
                  </div>
                </div>
              </div>
            )}

          {(subType == '38' || subType == '51') && (
            <div className="row mb-3">
              <div className="col-3">
                <div className="form-floating">
                  <input
                    type="text"
                    data-id="unitDetailsData"
                    className="form-control"
                    name="uds"
                    placeholder="Enter Enter"
                    required
                    onChange={(e) => handleChange(e, 0)}
                    value={(form.unitDetails[0] && form.unitDetails[0]?.uds) || ''}
                  />
                  <label for="uds" className="fw-normal">
                    UDS
                  </label>
                </div>
              </div>
              <div className="col-4">
                <div className="form-floating">
                  <select
                    className="form-select"
                    data-id="unitDetailsData"
                    name="property_uds_size_id"
                    required
                    onChange={(e) => handleChange(e, 0)}
                    value={
                      (form.unitDetails[0] && form.unitDetails[0]?.property_uds_size_id) || ''
                    }>
                    <option value="1">UDS Unit</option>
                    <option value="2">Sq</option>
                    <option value="3">Sq Meter</option>
                    <option value="4">Sq Yard</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="row mb-3">
            <h5 className="fw-normal unitclass mb-4">
              {' '}
              {subType == '40' || subType == '58' || subType == '53'
                ? 'Dimension Plan'
                : ' Ground Floor Plan'}
            </h5>
            <div className="col-3">
              {form.floor_plan_path === undefined ?
                <div className="form-floating">
                  <input
                    type="file"
                    data-id="unitDetailsData"
                    className="form-control"
                    name="floor_plan_path"
                    accept="image/*"
                    required
                    onChange={(e) => handleImage(e, 0)}
                  />
                  <label for="propertyFloorPlan" className="fw-normal">
                    {subType == '40' || subType == '58' || subType == '53'
                      ? 'Dimension Plan'
                      : ' Ground Floor Plan'}
                  </label>
                </div>
                :
                <div className="col-md-12 imgclass">
                  {/* <label className="fw-normal imgprevclass">Image Preview</label> */}
                  <img src={form?.floor_plan_path} width="150" height="80" />
                </div>
              }
            </div>
            {(houseType == '2' || houseType == '3') && (
              <div className="col-3">
                <div className="form-floating">
                  <input
                    type="file"
                    id="propertyFloorPlan"
                    className="form-control"
                    name="image1"
                    accept="image/*"
                    required
                  />
                  <label for="propertyFloorPlan" className="fw-normal">
                    1st Floor Plan
                  </label>
                </div>
              </div>
            )}

            {houseType == '3' && (
              <div className="col-3">
                <div className="form-floating">
                  <input
                    type="file"
                    id="propertyFloorPlan"
                    className="form-control"
                    name="image1"
                    accept="image/*"
                    required
                  />
                  <label for="propertyFloorPlan" className="fw-normal">
                    2nd Floor Plan
                  </label>
                </div>
              </div>
            )}

            <div className="col"></div>
          </div>
        </div>
      </div>
      {isRent ? (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Price Details</h3>
          </div>
          <div className="card-body">
            <h3 className="fw-normal unitclass mb-4">
              Rent
            </h3>
            <div className="row mb-3">
              <div className="col-3">
                <div className="form-floating">
                  <input
                    type="text"
                    data-id="unitDetailsData"
                    id="rent"
                    className="form-control"
                    name="rent_price"
                    placeholder="Enter Title"
                    required
                    value={(form.unitDetails[0] && form.unitDetails[0]?.rent_price) || ''}
                    onChange={(e) => handleChange(e, 0)}
                  />
                  <label for="rent" className="fw-normal">
                    Rent per Month
                  </label>
                </div>
              </div>

            </div>
            <h3 className="fw-normal unitclass mb-4">
              Advance
            </h3>
            <div className='row mb-3'>

              <div className="col-3">
                <div className="form-floating">
                  <select
                    data-id="unitDetailsData"
                    className="form-select"
                    name="rent_for_months"
                    required
                    onChange={(e) => handleChange(e, 0)}
                    // onBlur={handleCalEstPr}
                    value={(form.unitDetails[0] && form.unitDetails[0]?.rent_for_months) || ''}>
                    <option value="default">Select Months</option>
                    <option value="6">6</option>
                    <option value="12">12</option>
                    <option value="24">24</option>
                  </select>

                  <label for="for-months" className="fw-normal">
                    For Months
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Price Details</h3>
          </div>
          <div className="card-body">
            {subType != '48' &&
              subType != '52' &&
              subType != '53' &&
              subType != '56' &&
              subType != '57' &&
              subType != '58' && (
                <div>
                  <div className="row mb-3">
                    <div>
                      <p>How'd you like to show the price</p>
                    </div>
                    <div className="col-6">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="poojaRoom"
                          name="basePrice"
                          checked={showPrice.base}
                          onChange={handlePriceTypeChange}
                        />
                        <label className="form-radio-label fw-medium ms-2" for="poojaRoom">
                          Base Price + All Other Charges to show separately
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          id="studyRoom"
                          name="estimatedTotalPrice"
                          checked={showPrice.estimated}
                          onChange={(e) => handlePriceTypeChange(e)}
                        />
                        <label className="form-radio-label fw-medium ms-2" for="studyRoom">
                          Estimated Total Price (This Includes All other charges except Registration
                          & Other applicable taxes)
                        </label>
                      </div>
                    </div>
                  </div>

                  {showPrice.base && (
                    <div>
                      <div className="row mb-3">
                        <div className="col-3">
                          <div className="form-floating">
                            <input
                              type="number"
                              data-id="unitDetailsData"
                              className="form-control"
                              name="base_price"
                              placeholder="Enter Base Price"
                              required
                              value={(form.unitDetails[0] && form.unitDetails[0]?.base_price) || ''}
                              onChange={(e) => handleChange(e, 0)}
                              onBlur={(e) => blurValidation(e, 0)}
                            />
                            <label for="base-price" className="fw-normal">
                              Base Price
                            </label>
                          </div>
                        </div>
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
                                (form.unitDetails[0] && form.unitDetails[0]?.total_base_price) || ''
                              }
                              // onChange={(e) => handleChange(e, i)}
                              readOnly
                            />
                            <label for="total-base-price" className="fw-normal clrinputlabel">
                              Total Base Price
                            </label>
                          </div>
                          {formError.total_base_price && (
                            <p className="text-danger">{formError.total_base_price}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <h5 className="mb-3 unitclass">Estimated Other Chargers</h5>
                      </div>

                      <div className="row mb-3">
                        {/* <div className="col-3">
                          <div className="form-floating">
                            <input
                              type="text"
                              id="amenities"
                              className="form-control"
                              name="amenities"
                              placeholder="Enter Title"
                              required
                            />
                            <label for="amenities" className="fw-normal">
                              Amenities
                            </label>
                          </div>
                        </div> */}
                        {subType !== '40' && subType !== '53' && subType !== '58' && (
                          <div className="col-3">
                            <div className="form-floating">
                              <input
                                type="number"
                                data-id="unitDetailsData"
                                className="form-control"
                                name="car_parking_charges"
                                placeholder="Enter Base Price"
                                required
                                value={
                                  (form.unitDetails[0] &&
                                    form.unitDetails[0]?.car_parking_charges) ||
                                  ''
                                }
                                onChange={(e) => handleChange(e, 0)}
                                onBlur={() => handleCalEstPr(0)}
                              />
                              <label for="car-parking" className="fw-normal">
                                Car Parkings
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="row mb-3">
                        <div className="col-3">
                          <div className="form-floating">
                            <input
                              type="number"
                              data-id="unitDetailsData"
                              className="form-control"
                              name="corpus_fund"
                              placeholder="Enter Base Price"
                              required
                              value={
                                (form.unitDetails[0] && form.unitDetails[0]?.corpus_fund) || ''
                              }
                              onChange={(e) => handleChange(e, 0)}
                              onBlur={() => handleCalEstPr(0)}
                            />
                            <label for="corpus-fund" className="fw-normal">
                              Corpus Fund
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-3">
                          <div className="form-floating">
                            <input
                              type="number"
                              data-id="unitDetailsData"
                              className="form-control"
                              name="advance_maintenance_charges"
                              placeholder="Enter Base Price"
                              required
                              value={
                                (form.unitDetails[0] &&
                                  form.unitDetails[0]?.advance_maintenance_charges) ||
                                ''
                              }
                              onChange={(e) => handleChange(e, 0)}
                              onBlur={() => handleCalEstPr(0)}
                            />
                            <label for="maintainence-charges" className="fw-normal">
                              Maintenance Charges(Advance)
                            </label>
                          </div>
                        </div>
                        <div className="col-3">
                          <div className="form-floating">
                            <select
                              className="form-select"
                              data-id="unitDetailsData"
                              name="advance_maintenance_for_months"
                              required
                              onChange={(e) => handleChange(e, 0)}
                              // onBlur={handleCalEstPr}
                              value={
                                (form.unitDetails[0] &&
                                  form.unitDetails[0]?.advance_maintenance_for_months) ||
                                ''
                              }>
                              <option value="default">Select Months</option>
                              <option value="6">6</option>
                              <option value="12">12</option>
                              <option value="24">24</option>
                            </select>
                            {/* <input
                        type="text"
                        id="for-months"
                        className="form-control"
                        name="forMonths"
                        placeholder="Enter Title"
                        required
                      /> */}
                            <label for="for-months" className="fw-normal">
                              For Months
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-3">
                          <div className="form-floating">
                            <input
                              type="text"
                              id="legal-charges"
                              className="form-control"
                              name="legalCharges"
                              placeholder="Enter Title"
                              required
                            />
                            <label for="legal-charges" className="fw-normal">
                              Legal Charges
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
                                (form.unitDetails[0] &&
                                  form.unitDetails[0]?.estimated_total_price) ||
                                ''
                              }
                              readOnly
                            />
                            <label for="legalCharges" className="fw-normal clrinputlabel">
                              Total Estimated Price
                            </label>
                          </div>
                          {formError.estimated_total_price && (
                            <p className="text-danger">{formError.estimated_total_price}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <div>
                          <h5 className="mb-3 unitclass ">
                            {formCount === 2 ? 'Cannot Add More Charges' : 'Add Other Charges'}
                          </h5>
                        </div>

                        <button
                          onClick={handleAddChargesClick}
                          className="mb-3 btn btn-primary "
                          disabled={formCount === 2}>
                          +
                        </button>
                      </div>

                      {[...Array(formCount)].map((_, index) => (
                        <div key={index} className="row mb-3">
                          <div className="col-3">
                            <div className="form-floating">
                              <input
                                type="text"
                                data-id="unitDetailsData"
                                className="form-control"
                                value={
                                  (form.unitDetails[0] &&
                                    form.unitDetails[0]?.[`others_${index + 1}_charges_name`]) ||
                                  ''
                                }
                                onChange={(e) => handleChange(e, 0)}
                                name={`others_${index + 1}_charges_name`}
                                placeholder={`Enter Label ${index + 1}`}
                                required
                              />
                              <label
                                htmlFor={`charge-label-${index + 1}`}
                                className="fw-normal">{`Enter Label ${index + 1}`}</label>
                            </div>
                          </div>
                          <div className="col-3">
                            <div className="form-floating">
                              <input
                                type="text"
                                data-id="unitDetailsData"
                                id={`approval-number-${index + 1}`}
                                className="form-control"
                                name={`others_${index + 1}_charges`}
                                placeholder={`Amount`}
                                value={
                                  (form.unitDetails[0] &&
                                    form.unitDetails[0]?.[`others_${index + 1}_charges`]) ||
                                  ''
                                }
                                onChange={(e) => handleChange(e, 0)}
                                required
                              />
                              <label
                                htmlFor={`others_${index + 1}_charges`}
                                className="fw-normal">{`Amount`}</label>
                            </div>
                          </div>
                        </div>
                      ))}




                    </div>
                  )}

                  {showPrice.estimated && (
                    <div className="row mb-3">
                      <div className="col-3">
                        <div className="form-floating">
                          <input
                            type="number"
                            data-id="unitDetailsData"
                            className="form-control clrinput"
                            name="estimated_total_price"
                            placeholder="Enter Base Price"
                            required
                            value={
                              (form.unitDetails[0] && form.unitDetails[0]?.estimated_total_price) ||
                              ''
                            }
                            onChange={(e) => handleChange(e, 0)}
                          />
                          <label for="base-price" className="fw-normal">
                            Total Estimated Price
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            {(subType == '48' ||
              subType == '52' ||
              subType == '53' ||
              subType == '56' ||
              subType == '57' ||
              subType == '58') && (
                <div className="row mb-3">
                  <div className="col-3">
                    <div className="form-floating">
                      <input
                        type="text"
                        id="estimated-price"
                        className="form-control"
                        name="estimatedfPrice"
                        placeholder="Enter Title"
                        required
                      />
                      <label for="base-price" className="fw-normal">
                        Total Estimated Price
                      </label>
                    </div>
                  </div>
                </div>
              )}
            {/* <div>
              <h5 className="mb-3 unitclass">Estimated GST and Other Statutory Charges</h5>
            </div>

            <div className="row mb-3">
              <div className="col-3">
                <div className="form-floating">
                  <input
                    type="number"
                    data-id="unitDetailsData"
                    className="form-control"
                    name="gst_charges"
                    placeholder="Enter Base Price"
                    required
                    value={(form.unitDetails[0] && form.unitDetails[0]?.gst_charges) || ''}
                    onChange={(e) => handleChange(e, 0)}
                  />
                  <label htmlFor="gst" className="fw-normal">
                    GST (Taxes)
                  </label>
                </div>
              </div>
              <div className="col-3">
                <div className="form-floating">
                  <input
                    type="number"
                    data-id="unitDetailsData"
                    className="form-control"
                    name="registration_charges"
                    placeholder="Enter Base Price"
                    required
                    value={(form.unitDetails[0] && form.unitDetails[0]?.registration_charges) || ''}
                    onChange={(e) => handleChange(e, 0)}
                  />
                  <label htmlFor="registration-charges" className="fw-normal">
                    Registration Charges
                  </label>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      )}

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
