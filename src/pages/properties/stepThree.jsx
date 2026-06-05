import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { masterClient } from '../../utils/httpClient';
import { setProject } from '../../store/slices/ProjectManagementSlice';
import { projectClient } from '../../utils/httpClient';

const stepThree = ({ type, subType, prevStep, nextStep }) => {

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

  const [amenities, setAmenities] = useState([]);
  const [amenityHeader, setAmenityHeader] = useState([]);
  const [loading, setLoading] = useState(false);
  const [banks, setBanks] = useState([]);
  const [banksValues, setBanksValues] = useState([]);
  const [specificationData, setSpecificationData] = useState([]);
  const [specificationHeaders, setSpecificationHeaders] = useState([]);
  const [amenityValues, setAmenityValues] = useState([]);
  const [specialFeatureValues, setSpecialFeatureValues] = useState([]);
  const [featureHeader, setFeatureHeader] = useState([]);
  const [features, setFeatures] = useState([]);



  const dispatch = useDispatch();
  const formState = useSelector((state) => state.projectManagement['project']);
  const [formError, setFormError] = useState({});

  const [form, setForm] = useState({ unitDetails: [], ...formState });

  const [furnishedValues, setFurnishedValues] = useState([]);
  const [furnishedItems, setFurnishedItems] = useState([]);
  const [allocatedAmenities, setAllocatedAmenities] = useState([]);
  const [allocatedFeatures, setAllocatedFeatures] = useState([]);


  const getBanks = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('banks');
      if (res?.data?.status) {
        setBanks(res?.data?.data);
        getProjectBanks();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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

  const getAmenitiesHeader = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('amenitiesheader');
      if (res?.data?.status) {
        setAmenityHeader(res?.data?.data);
        console.log(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getFeatureHeaders = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('specialfeaturesheader');
      if (res?.data?.status) {
        setFeatureHeader(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredFeatures = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('specialfeatures');
      if (res?.data?.status) {
        setFeatures(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getfilteredAmenities = async () => {
    try {
      setLoading(true);
      const res = await masterClient.get('amenities');
      if (res?.data?.status) {
        setAmenities(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

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
        ? [...banksValues, value]
        : banksValues.filter((bank) => bank !== value);

      setBanksValues(updatedBanks);
      setForm((prevState) => ({
        ...prevState,
        [name]: updatedBanks
      }));
    } else if (name === 'furnished_id') {
      const updatedFeatures = checked
        ? [...furnishedValues, { furnished: value }]
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

  console.log("Forrrr", form)

  useEffect(() => {
    getAmenitiesHeader();
    getfilteredAmenities();
    getFeatureHeaders();
    getFilteredFeatures();
    getBanks();
    getSpecificationHeaders();
    getAllocatedAmenities();
    getAllocatedFeatures();
    if (form?.amenities_id) {
      setAmenityValues(form?.amenities_id);
    }
    if (form?.special_feature_id) {
      setSpecialFeatureValues(form?.special_feature_id);
    }
    if (form?.bank_id) {
      setBanksValues(form?.bank_id)
    }
    getProjectAmenities();
  }, []);



  const validate = () => {
    let isValid = true;
    const error = {};
    // if (subType == "7" || subType == "8" || subType == "13" || subType == "15") {
    if (form?.furnishedStatus === 'default' || form?.furnishedStatus === undefined) {
      error.furnishedStatus = 'Furnished Status is required';
      isValid = false;
    }
    // }
    if (!form?.amenities_id || form?.amenities_id.length === 0) {
      error.amenities_id = 'Amenities is required';
      isValid = false;
    }

    setFormError(error);
    return isValid;
  };

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      ...formState
    }));
  }, [formState]);

  const handleSubmit = () => {
    if (validate()) {
      nextStep();
      dispatch(setProject(form));
    }
  };

  const getAllocatedAmenities = async () => {
    const payload = {
      allocationType: "Properties",
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

  // ? getAllAmenities and set form
  const getProjectAmenities = async () => {
    setLoading(true)
    try {
      const res = await projectClient.get('listing-amenities-mappings');
      if (res?.data?.status) {
        const amenities = res?.data?.data.filter(amenity => amenity.project_listing_id == form.id)
        console.log('=====> dasd', form)
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

  const getAllocatedFeatures = async () => {
    const payload = {
      allocationType: "Properties",
      property_type_id: form.property_type_id,
      property_sub_type_id: form.property_sub_type_id,
    }
    let res;
    setLoading(true)
    try {
      res = await masterClient.post('get-features-by-type', payload);
      if (res?.data.status) {
        setAllocatedFeatures(res?.data.data)
        getsplfeatures()
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

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Water Source</h3>
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
                  id="number-of-borewells"
                  className="form-control"
                  name="number_of_borewells"
                  placeholder="Enter Number Of Borewells"
                  required
                  onChange={handleChange}
                />
                <label for="number-of-borewells" className="fw-normal">
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
                  placeholder="Enter Ground Water depth "
                  required
                  onChange={handleChange}
                />
                <label for="ground-water-depth" className="fw-normal">
                  Ground Water depth (in Ft's)
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
        (subType !== "40" && subType !== "53") && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Furnished Status</h3>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-4">
                  <div className="form-floating">
                    <select
                      className="form-select"
                      name="furnishedStatus"
                      required
                      onChange={handleChange}
                      value={form.furnishedStatus || ''}
                    >
                      <option value="default">Furnished Status</option>
                      <option value="Furnished">Furnished</option>
                      <option value="UnFurnished">Un Furnished</option>
                    </select>
                    {formError.furnishedStatus && (
                      <p className="text-danger">{formError.furnishedStatus}</p>
                    )}
                  </div>
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
        )
      }

      {
        (subType !== "40" && subType !== "53" && subType !== "58") && (
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
                          <label htmlFor={`specification-${header.id}`} className="form-label specclass mb-3">
                            Please enter the specifications for {header.name}
                          </label>
                          <div className="form-floating">
                            <CKEditor
                              editor={ClassicEditor}
                              name={`specification-${header.id}`}
                              id={header.id}
                              data={form?.specifications?.find(spec => spec.headId === header.id)?.description || ''}
                              onReady={(editor) => {
                                console.log('Editor is ready to use!', editor);
                              }}
                              onChange={(event, editor) => {
                                const data = editor.getData();

                                let updatedSpecifications = [...specificationData];
                                const specIndex = updatedSpecifications.findIndex(spec => spec.headId === header.id);

                                if (specIndex > -1) {
                                  // Update existing specification
                                  updatedSpecifications[specIndex] = {
                                    ...updatedSpecifications[specIndex],
                                    description: data
                                  };
                                } else {
                                  // Add new specification
                                  updatedSpecifications.push({ headId: header.id, name: header.name, description: data });
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

        )
      }

      {
        subType !== '53' && (
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Amenities</h4>
            </div>
            <div className="card-body">
              <div className="row mb-3 amenities_row">
                {/* {amenityHeader.map((title, index) => (
                  <div className="col-md-3 mb-3" key={index}>
                    <div>
                      <h6 className="headTag">{title.name}</h6>
                    </div>
                    {amenities
                      .filter((headId) => {
                        return headId.amenities_header_id == title.id;
                      })
                      .map((item, index) => (
                        <div className="form-check" key={index}>
                          <input
                            className="form-check-input bankcheckbox"
                            type="checkbox"
                            name="amenities_id"
                            value={item.id}
                            id={item.amenities_header_id}
                            // onChange={() => handleCheckbox(item.id, item.amenities_header_id)}
                            checked={form?.amenities_id?.some((a) => a.id == item.id)}
                            onChange={handleCheck}
                          />
                          <label className="form-check-label fw-medium" for="entrance-lounge">
                            {item.name}
                          </label>
                        </div>
                      ))}
                  </div>
                ))} */}
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
                {formError.amenities_id && (
                  <p className="text-danger">{formError.amenities_id}</p>
                )}
              </div>
            </div>
          </div>
        )
      }

      {
        subType !== '53' && (

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Special Features</h3>
            </div>
            <div className="card-body">
              <div className="row mb-3 amenities_row">
                {/* {featureHeader.map((title, index) => (
                  <div className="col-md-3 mb-3" key={index}>
                    <div>
                      <h6 className="headTag">{title.name}</h6>
                    </div>
                    {features
                      .filter((headId) => {
                        return headId.special_features_header_id == title.id;
                      })
                      .map((item, index) => (
                        <div className="form-check" key={index}>
                          <input
                            className="form-check-input bankcheckbox"
                            type="checkbox"
                            id={item.special_features_header_id}
                            name="special_feature_id"
                            value={item.id}
                            required
                            onChange={handleCheck}
                            checked={form?.special_feature_id?.some(a => a.id == item.id)}
                          // onChange={() => handleSpecialFeaturesCheckbox(item.id, item.special_features_header_id)}
                          // onChange={(e) => {

                          // }}
                          />
                          <label className="form-check-label fw-medium" for="poojaRoom">
                            {item.name}
                          </label>
                        </div>
                      ))}
                  </div>
                ))} */}
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
                              value={item.id}
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
            </div>
          </div>

        )
      }

      {
        subType !== '53' && (

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
                        id="axis"
                        name="bank_id"
                        required
                        onChange={handleCheck}
                        value={bank.id}
                         checked={form?.bank_id?.some((a) => a.id == bank.id) || ''}
                      />

                      <label className="form-check-label fw-medium bankclass" for="axis">
                        {bank.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      } <div className='btnParent'>
        <button className="btn customBtn" onClick={prevStep}>
          Previous
        </button>
        <button className="btn customBtn" onClick={handleSubmit}>
          Next
        </button>
      </div>
    </div >
  );
};

export default stepThree;
