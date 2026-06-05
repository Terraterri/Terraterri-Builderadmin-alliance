import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { projectClient, masterClient } from '../../utils/httpClient';
import { toastSuccess, toastError, toastWarning, date } from '../../utils/toast';
import { IpInfoContext } from '../../utils/context';
import { reset, setProject } from '../../store/slices/ProjectManagementSlice';

const stepFive = ({ type, subType, prevStep, stepOne }) => {

  const userData = useSelector((state) => state.user.userData);

  const formState = useSelector((state) => state.projectManagement['project']);
  const dispatch = useDispatch();
  const [form, setForm] = useState({ ...formState });
  const [formError, setFormError] = useState({});
  const [posStatus, setPosStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectapiData1, setProjectApiData1] = useState();
  const [projectapiData2, setProjectApiData2] = useState();
  const [projectapiData3, setProjectApiData3] = useState();
  const [projectapiData4, setProjectApiData4] = useState();
  const [projectapiData5, setProjectApiData5] = useState();
  const [projectapiData6, setProjectApiData6] = useState();
  const [projectapiData7, setProjectApiData7] = useState();
  const [amenitiesPayload, setAmenitiesPayload] = useState();

  const getPossStatus = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('possessionstatus');
      console.log('get possession status===', res);
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

    // handleFormData(e.target.name)(e);
  };

  const handleSubmit = async () => {
    if (validate()) {
      console.table('values', formState);

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
        listed_by: 2,
        isSale: formState.isSale,
        isRent: formState.isRent,

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
        water_source: formState.water_source,
        number_of_borewells: formState.number_of_borewells,
        ground_water_depth: formState.ground_water_depth,
        community_type_id: formState.community_type_id ? formState.community_type_id : "0",
        property_min_size: formState.property_min_size ? formState.property_min_size : "0",
        property_max_size: formState.property_max_size ? formState.property_max_size : "0",
        property_size_representation_id: formState.property_size_representation_id ? formState.property_size_representation_id : 0,
        possession_status_id: formState.possession_status_id,
        project_description: formState.project_description,
        preffered_location_charges_facing_per_sft:
          formState.preffered_location_charges_facing_per_sft ? formState.preffered_location_charges_facing_per_sft : "0",
        preffered_location_charges_corner_per_sft:
          formState.preffered_location_charges_corner_per_sft ? formState.preffered_location_charges_corner_per_sft : "0",
        contact_timing_from: formState.contact_timing_from,
        contact_timing_to: formState.contact_timing_to,
        broucher_path: formState.broucher_path,
        created_by_type: userData.role_id,
        latitude: formState.latitude,
        longitude: formState.longitude,
        possession_by: formState.possession_by,
        posted_by: formState.posted_by,
        age_of_possession: formState.age_of_possession,
        created_by: userData.id,
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
        currency: formState.unitDetails[index].currency ? formState.unitDetails[index].currency : "INR",
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
        created_by_type: '1'
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
          console.log('Amenities payload', payload);

          const res = await projectClient.post('listing-amenities-mappings', payload);
          if (res?.data?.status) {
            await specialFeaturesApiCall(projectListingid);
            toastSuccess('Project Data Saved Successfully');
          } else {
            toastError('Error in saving Amenities Data');
          }
        } catch (error) {
          console.error('Error in saving Project Data:', error);
          toastError('Error in saving Project Data');
        }
      };

      const specialFeaturesApiCall = async (projectListingid) => {
        const specialFeaturesPayloadStructure = formState['special_feature_id']?.map((item) => ({
          special_feature_id: item?.id,
          project_listing_id: projectListingid,
          created_by_type: 1
        }));

        const payload = { payload: specialFeaturesPayloadStructure };

        try {
          const res = await projectClient.post('listing-special-features-mapping', payload);
          if (res?.data?.status) {
            await banksApiCall(projectListingid);
          } else {
            toastError('Error in saving Specifications Data');
          }
        } catch (error) {
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
            toastError('Error in saving Banks Data');
          }
        } catch (error) {
          toastError('Error in saving Project Data');
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
            created_by_type: 1,
            order: 1
          };
        });
        const payload = { payload: galleryPayloadStructure };

        try {
          const res = await projectClient.post('listing-gallery', payload);
          if (res?.data?.status) {
            ckEditorApiCall(projectListingid);
          } else {
            toastError('Error in saving Gallery Data');
          }
        } catch (error) {
          toastError('Error in saving Project Data');
        }
      };


      const ckEditorApiCall = async (projectListingId) => {
        const specificationPayloadStructure = formState['specifications']?.map((item) => ({
          specifications_id: item?.headId,
          description: item?.description,
          project_listing_id: projectListingId
        }));

        const payload = { payload: specificationPayloadStructure }

        try {
          const res = await projectClient.post(
            'listing-specifications-mappings',
            payload
          );
          if (res?.data?.status) {
            if (formState['furnishedStatus'] === 'Furnished') {
              await furnishedApiCall(projectListingId)
            } else {
              await videosApiCall(projectListingId)
            }
          } else {
            toastError('Error in saving Specifications Data')
          }
        } catch (error) {
          toastError('Error in saving Project Data');
          console.log('specification error==', error);
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
        try {
          const res = await projectClient.post('listing-furnished-mapping', payload);
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
          video1: formState['video1'],
          video2: formState['video2'],
          created_by_type: '1'
        }

        try {
          const res = await projectClient.post('listing-video-links', payload)
          if (res?.data?.status) {
            toastSuccess('Added Successfully');
            dispatch(reset());
            stepOne()
          } else {
            toastError('Error in saving Videos data')
          }
        } catch (err) {
          console.log(err);

        }
      }


      try {
        setLoading(true);
        const resApi1 = await projectClient.post('listing-data', apiData1);
        if (resApi1?.data?.status) {
          console.log('trigger area');
          let data = { ...apiData2, project_listing_id: resApi1?.data?.data?.id };
          await apiData2.map(async (payload, i) => {
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

  console.log("form", form);

  const validate = () => {
    let isValid = true;
    const error = {};
    console.log('form', form);
    if (!form.possession_status_id) {
      error.possession_status_id = 'Posession status is required';
      isValid = false;
    }
    setFormError(error);
    return isValid;
  };


  return (
    <div>
      {subType !== '53' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Possession</h3>
          </div>
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-4">
                <div className="form-floating">
                  <select className="form-select" name="possession_status_id" required
                    onChange={handleChange}
                    value={formState.possession_status_id || ''}
                  >
                    <option value="default">Possession Status</option>
                    {/* <option value="">Ready To Move</option>
                    <option value="">Under Construction</option>
                    <option value="">New Launch</option> */}
                    {posStatus.map((item, index) => (
                      <option key={index} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
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
                        value={formState.possession_by || ''}
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
      )}

      {/* <div className="card">
        <div className="card-header">
          <h4 className="card-title">Contact Time</h4>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col">
              <div className="form-floating">
                <input
                  type="time"
                  id="from"
                  className="form-control"
                  name="contact_timing_from"
                  placeholder="Enter Enter"
                  required
                  onChange={handleChange}
                  value={formState.contact_timing_from || ''}
                />
                <label for="from" className="fw-normal">
                  From
                </label>
              </div>
            </div>
            <div className="col">
              <div className="form-floating">
                <input
                  type="time"
                  id="to"
                  className="form-control"
                  name="contact_timing_to"
                  placeholder="Enter Enter"
                  required
                  onChange={handleChange}
                  value={formState.contact_timing_to || ''}
                />
                <label for="to" className="fw-normal">
                  To
                </label>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div>
        <h5 className="mb-3">Google Maps</h5>
      </div>

      <div className="row mb-3">
        <iframe
          title="Example Iframe"
          width="600"
          height="400"
          src="https://www.google.com/maps?ll=17.465297,78.373724&z=16&t=m&hl=en&gl=IN&mapclient=embed&cid=1781525338689807305"
          frameBorder="0"
          allowFullScreen></iframe>
      </div> */}

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

export default stepFive;