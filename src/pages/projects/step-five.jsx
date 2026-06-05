import { useState, useEffect, useContext } from 'react';
import Loader from '../../components/Loader';
import { projectClient, masterClient } from '../../utils/httpClient';
import { toastSuccess, toastError } from '../../utils/toast';
import { IpInfoContext } from '../../utils/context';
import { useDispatch, useSelector } from 'react-redux';
import { setProject, reset } from '../../store/slices/ProjectManagementSlice';
import { useNavigate } from 'react-router-dom';
const StepFive = ({ nextStep, prevStep, type, subType, stepOne }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formState = useSelector((state) => state.projectManagement['project']);

  const [loading, setLoading] = useState(false);
  const { ipInfo } = useContext(IpInfoContext);
  const [posStatus, setPosStatus] = useState([]);
  const [form, setForm] = useState({ ...formState });
  const [formError, setFormError] = useState({});
  const [projectapiData1, setProjectApiData1] = useState();
  const [projectapiData2, setProjectApiData2] = useState();
  const [projectapiData3, setProjectApiData3] = useState();
  const [projectapiData4, setProjectApiData4] = useState();
  const [projectapiData5, setProjectApiData5] = useState();
  const [projectapiData6, setProjectApiData6] = useState();
  const [projectapiData7, setProjectApiData7] = useState();
  const [amenitiesPayload, setAmenitiesPayload] = useState();
  const userData = useSelector((state) => state.user.userData);
  const postedByLabel = formState.posted_by || userData?.company_name || userData?.first_name || userData?.name || '';

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
    dispatch(setProject({ ...formState, [e.target.name]: e.target.value }));
  };

  //api1 Integration

  //api2 Integration

  const handleSubmit = async () => {
    if (validate()) {

      const apiData1 = {
        project_name_id: formState.project_name_id,
        project_listing_name: formState.project_listing_name,
        property_type_id: formState.property_type_id,
        property_sub_type_id: formState.property_sub_type_id,
        listing_type_id: formState.listing_type_id,
        country_code: formState.country_code,
        state_code: formState.state_code,
        city_code: formState.city_code,
        locality: formState.locality,
        sub_locality: formState.sub_locality,
        street_name: formState.street_name,
        door_number: formState.door_number,
        builder_id: formState.builder_id,


        sizeRepresentation: formState.sizeRepresentation,
        approval_authority: formState.approval_authority,
        approval_number: formState.approval_number,
        approval_year: formState.approval_year,
        approval_document_path: formState.approval_document_path,
        real_estate_authority: formState.real_estate_authority,
        real_estate_approval_number: formState.real_estate_approval_number,
        real_estate_approval_year: formState.real_estate_approval_year,
        real_estate_approval_document_path: formState.real_estate_approval_document_path,
        other_1_approval_name: formState.other_1_approval_name,
        other_1_approval_number: formState.other_1_approval_number,
        other_1_approval_year: formState.other_1_approval_year,
        other_1_approval_document_path: formState.other_1_approval_document_path,
        other_2_approval_name: formState.other_2_approval_name,
        other_2_approval_number: formState.other_2_approval_number,
        other_2_approval_year: formState.other_2_approval_year,
        other_2_approval_document_path: formState.other_2_approval_document_path,
        other_3_approval_name: formState.other_3_approval_name,
        other_3_approval_number: formState.other_3_approval_number,
        other_3_approval_year: formState.other_3_approval_year,
        other_3_approval_document_path: formState.other_3_approval_document_path,
        total_project_land_area: formState.total_project_land_area,
        total_project_land_area_size_id: formState.total_project_land_area_size_id,
        totalNumberOfBlocks: formState.totalNumberOfBlocks,
        numberOfFloorsBlocks: formState.numberOfFloorsBlocks,
        totalNumberOfUnits: formState.totalNumberOfUnits,
        totalNumberOfVillas: formState.totalNumberOfVillas,
        project_layout_document_path: formState.project_layout_document_path,

        community_type_id: formState.community_type_id ? formState.community_type_id : "0",
        property_min_size: formState.property_min_size,
        property_max_size: formState.property_max_size,
        property_size_representation_id: formState.property_size_representation_id ? formState.property_size_representation_id : 0,
        possession_status_id: formState.possession_status_id,
        project_description: formState.project_description,
        preffered_location_charges_facing_per_sft:
          formState.preffered_location_charges_facing_per_sft,
        preffered_location_charges_corner_per_sft:
          formState.preffered_location_charges_corner_per_sft,
        latitude: formState.latitude,
        longitude: formState.longitude,

        water_source: formState.water_source,
        number_of_borewells: formState.number_of_borewells,
        ground_water_depth: formState.ground_water_depth,
        furnishedStatus: formState.furnishedStatus,


        possession_by: formState.possession_by,
        posted_by: formState.posted_by || userData?.company_name || userData?.first_name || userData?.name || '',
        age_of_possession: formState.age_of_possession,
        contact_timing_from: formState.contact_timing_from,
        contact_timing_to: formState.contact_timing_to,
        broucher_path: formState.broucher_path,

        created_by_type: userData?.role_id,
        created_by: userData?.id,
        listed_by: userData?.id,
        purchase_id: formState.purchase_id,
        package_id: formState.package_id,
        project_status: "A",
        is_active: formState?.showProject
      };

      setProjectApiData1(apiData1);

      const apiData2 = formState['unitDetails'].map((item, index) => ({
        project_listing_id: formState.unitDetails[index].project_listing_id,
        villa_type: formState.unitDetails[index].villatype,
        villa_type_id: formState.unitDetails[index].villa_type_id,
        farm_house_type_id: formState.unitDetails[index].farm_house_type_id,
        property_facing_id: formState.unitDetails[index].property_facing_id,
        property_bhk_size_id: formState.unitDetails[index].property_bhk_size_id,
        super_built_up_area: formState.unitDetails[index].super_built_up_area,
        carpet_area: formState.unitDetails[index].carpet_area,
        floor_level: formState.unitDetails[index].floor_level,
        car_parkings: formState.unitDetails[index].car_parkings,
        balconies: formState.unitDetails[index].balconies,
        bathrooms: formState.unitDetails[index].bathrooms,
        uds: formState.unitDetails[index].uds ? formState.unitDetails[index].uds : 0,
        property_uds_size_id: formState.unitDetails[index].property_uds_size_id ? formState.unitDetails[index].property_uds_size_id : "1",
        plot_size: formState.unitDetails[index].plot_size,
        property_size_id: formState.unitDetails[index].property_size_id,
        length: formState.unitDetails[index].plot_length,
        width: formState.unitDetails[index].plot_breadth,
        dimension_representation: formState.unitDetails[index].dimension_representation,
        north_facing_road_width_in_fts: formState.unitDetails[index].north_facing_road_width_in_fts,
        currency: formState.unitDetails[index].currency,
        base_price: formState.unitDetails[index].base_price,
        total_base_price: formState.unitDetails[index].total_base_price,
        amenities_charges: 0,
        car_parking_charges: formState.unitDetails[index].car_parking_charges,
        club_house_charges: formState.unitDetails[index].club_house_charges,
        corpus_fund: formState.unitDetails[index].corpus_fund,
        advance_maintenance_charges: formState.unitDetails[index].advance_maintenance_charges,
        advance_maintenance_for_months: formState.unitDetails[index].advance_maintenance_for_months,
        legal_charges: formState.unitDetails[index].legal_charges,
        others_1_charges_name: formState.unitDetails[index].others_1_charges_name,
        others_1_charges: formState.unitDetails[index].others_1_charges,
        others_2_charges_name: formState.unitDetails[index].others_2_charges_name,
        others_2_charges: formState.unitDetails[index].others_2_charges,
        others_3_charges_name: formState.unitDetails[index].others_3_charges_name,
        others_3_charges: formState.unitDetails[index].others_3_charges,
        estimated_total_price: formState.unitDetails[index].estimated_total_price,
        gst_charges: formState.unitDetails[index].gst_charges,
        registration_charges: formState.unitDetails[index].registration_charges,
        floor_plan_path: formState.unitDetails[index].floor_plan_path,
        created_by_type: 1
      }));

      setProjectApiData2(apiData2);
      setProjectApiData3(formState.specifications);
      setProjectApiData4(formState.amenities_id);
      setProjectApiData5(formState.special_feature_id);
      setProjectApiData6(formState.bank_id);
      setProjectApiData7(formState.file_path);

      const amenitiesApiCall = async (projectListingid) => {
        try {
          const amenitiesPayloads = formState['amenities_id']?.map((item) => ({
            amenities_id: item?.id,
            project_listing_id: projectListingid
          }));
          const payload = { payload: amenitiesPayloads };
          console.log('Amenities payload', payload)

          const res = await projectClient.post('listing-amenities-mappings', payload);
          if (res?.data?.status) {
            if (formState['special_feature_id']) {
              await specialFeaturesApiCall(projectListingid);
            } else if (formState['bank_id']) {
              await banksApiCall(projectListingid)
            } else {
              imagesApiCall(projectListingid)
            }
            toastSuccess('Project Data Saved Successfully');
          } else {
            toastError('Error in saving Project Amenities Data');
          }
        } catch (error) {
          console.error('Error in saving Project Amenities Data:', error);
          toastError('Error in saving Project Data');
        }
      };

      const specialFeaturesApiCall = async (projectListingid) => {
        const specialFeaturesPayloadStructure = formState['special_feature_id']?.map((item) => ({
          special_feature_id: item?.id,
          project_listing_id: projectListingid,
          created_by_type: userData?.role_id,
        }));

        const payload = { payload: specialFeaturesPayloadStructure };
        try {
          const res = await projectClient.post('listing-special-features-mapping', payload);
          if (res?.data?.status) {
            await banksApiCall(projectListingid);
          } else {
            toastError('Error in saving Project Data');
          }
        } catch (error) {
          console.error('Error in saving Project Special Features Data:', error);
          toastError('Error in saving Project Data');
        }
      };

      const banksApiCall = async (projectListingid) => {
        const bankPayloadStructure = formState['bank_id'].map((item) => ({
          bank_id: item,
          project_listing_id: projectListingid
        }));
        const payload = { payload: bankPayloadStructure };

        try {
          const res = await projectClient.post('listing-bank-mappings', payload);
          if (res?.data?.status) {
            imagesApiCall(projectListingid);
          } else {
            toastError('Error in saving Project Data');
          }
        } catch (error) {
          console.error('Error in saving Project Banks Data:', error);
          toastError('Error in saving Project Data');
        }
      };

      const furnishedApiCall = async (projectListingid) => {
        const furnished_items = formState['furnishedName']?.map((item) => ({
          item
        }))
        const additional_furnished_list = formState['furnished_id']?.map((item) => ({
          furnished: item.furnished
        }))
        const payload = { furnished_items, additional_furnished_list, project_listing_id: projectListingid };

        console.log('frnished payload', payload)
        try {
          const res = await projectClient.post('listing-furnished-mapping', payload);
          if (res?.data?.status) {
            videosApiCall(projectListingid)
          }
        } catch (error) {
          console.error('Error in saving Project Furnished Data:', error);
          toastError('Error in saving Project Data');
        }
      }

      const videosApiCall = async (projectListingid) => {
        const payload = {
          project_listing_id: projectListingid,
          video1: formState['video1'],
          video2: formState['video2'],
          created_by_type: userData?.role_id || 1
        }
        console.log('videos payload', payload)
        try {
          const res = await projectClient.post('listing-video-links', payload)
          if (res?.data?.status) {
            toastSuccess('Data Saved Successfully');
            dispatch(reset());
            stepOne()
          }
        } catch (err) {
          console.error('Error in saving Project Videos Data:', err);
          toastError('Error in saving Videos Data');
        }
      }

      const ckEditorApiCall = async (projectListingId) => {
        const specificationPayloadStructure = formState['specifications']?.map((item) => ({
          specifications_id: item?.headId,
          description: item?.description,
          project_listing_id: projectListingId
        }));

        const payload = { payload: specificationPayloadStructure };
        try {
          const res = await projectClient.post(
            'listing-specifications-mappings',
            payload
          );
          if (res?.data?.status) {
            if (formState['furnishedStatus'] === 'Furnished') {
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
        const galleryPayloadStructure = formState['file_path'].map((item) => {
          const headIdNumber = Number(item?.headId);

          return {
            gallery_header_id: headIdNumber < 8 ? 0 : item?.headId,
            thumbnail_path: item?.id,
            metadata: 'test',
            project_listing_id: projectListingid,
            file_path: item?.id,
            created_by_type: userData?.role_id || 1,
            order: 1
          };
        });


        const payload = { payload: galleryPayloadStructure };
        console.log('gallery payload', payload);

        try {
          const res = await projectClient.post('listing-gallery', payload);
          if (res?.data?.status) {
            ckEditorApiCall(projectListingid);
          } else {
            toastError('Error in saving Project Data');
          }
        } catch (error) {
          toastError('Error in saving Project Data');
        }
      };

      try {
        setLoading(true);

        console.log('listing-data payload', apiData1);
        console.log('created_by_type (debug):', apiData1.created_by_type);

        const resApi1 = await projectClient.post('listing-data', apiData1);
        if (resApi1?.data?.status) {
          let data = { ...apiData2, project_listing_id: resApi1?.data?.data?.id };
          apiData2.map(async (payload, i) => {
            const apiPayload = {
              ...payload,
              project_listing_id: resApi1?.data?.data?.id,
              property_size_id: 0
            };
            try {
              const res = await projectClient.post('listing-units', apiPayload);
              if (res?.data?.status) {
              } else {
                toastError('Error in saving Project Data');
              }
            } catch (error) {
              console.log('Error in saving Project Units Data', error)
              toastError('Error in saving Project Units Data');
            }
          });
          if (formState['amenities_id']) {
            await amenitiesApiCall(resApi1?.data?.data?.id);
          } else if (formState['special_feature_id']) {
            await specialFeaturesApiCall(resApi1?.data?.data?.id)
          } else {
            await banksApiCall(resApi1?.data?.data?.id)
          }
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
                  value={postedByLabel}
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