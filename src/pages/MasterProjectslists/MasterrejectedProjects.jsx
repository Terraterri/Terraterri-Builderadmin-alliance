import React, { useState, useEffect } from 'react'
import Loader from '../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { projectClient, masterClient } from '../../utils/httpClient';
import { Link } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinFill } from "react-icons/ri";


const MasterrejectedProjects = () => {
  const userData = useSelector((state) => state.user.userData);

  const [loading, setLoading] = useState(false);
  const [pendingProjects, setPendingProjects] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [builders, setBuilders] = useState({});
  const [statesByCountry, setStatesByCountry] = useState([]);
  const [cityBystates, setCityBystates] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [subProjectType, setSubProjectType] = useState([]);
  const [projectNames, setProjectNames] = useState([]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        projectNamesRes,
        buildersRes,
        countriesRes,
        statesRes,
        citiesRes,
        projectsRes,
        projectTypesRes,
      ] = await Promise.all([
        masterClient.get('projectname'),
        masterClient.get('builder'),
        masterClient.get('country'),
        masterClient.get('state'),
        masterClient.get('city'),
        projectClient.get(`PendingProjects/${userData?.project_type_id}/${userData?.city_code}/R`),
        masterClient.get('projecttype')
      ]);

      if (projectNamesRes?.data?.status) setProjectNames(projectNamesRes?.data?.data);

      if (buildersRes?.data?.status) setBuilders(buildersRes?.data?.data);

      if (countriesRes?.data?.status) setCountries(countriesRes?.data?.data);

      if (statesRes?.data?.status) setStates(statesRes?.data?.data);

      if (citiesRes?.data?.status) setCities(citiesRes?.data?.data);

      if (projectsRes?.data?.status) setPendingProjects(projectsRes?.data?.data);

      if (projectTypesRes?.data?.status) setProjectTypes(projectTypesRes?.data?.data)

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    fetchAllData();
  }, []);

  //   getAll States
  const getStatesByCountry = async (param) => {
    const data = states.filter(state => state.country_code == param)
    if (data.length > 0) {
      setStatesByCountry(data);
    } else {
      toastError('No States Found')
    }
  };

  //   getAll Cities
  const getCitiesByState = async (param) => {
    const data = cities.filter(city => city.state_code == param)
    if (data) {
      setCityBystates(data);
    } else {
      toastError('No Cities Found')
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


  const handlesearch = async (e) => {
    const { name, value } = e.target;
    setSearch((prev) => ({ ...prev, [name]: value }));
    if (name === 'country_code') getStatesByCountry(value);
    if (name === 'state_code') getCitiesByState(value);
    if (name === 'property_type_id') getSubProjectType(value);
  }

  const changeApprovalStatus = async (projectId, status) => {
    const body = {
      projectId: projectId,
      status: status,
      approvedBy: userData?.username
    }
    setLoading(true)
    let res;
    try {
      res = await projectClient.post('updateApprovalStatus', body);
      if (res?.data?.status) {
        toastSuccess('Approval status changed successful')
      }
      fetchAllData();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {loading && <Loader />}
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item active"><h4 className="m-0 font-bold">Rejected Projects </h4></li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="row justify-content-center ">
              <div className="col-md-10">
                <div className="cardd mb-4 cardd-input">
                  <div className="card-body">
                    <h3 className="card-title mb-3">Search Projects</h3>
                    <div className="row">
                      <div className="col-md-2">
                        <div className="">
                          <select
                            className="form-select"
                            onChange={handlesearch}
                            name="country_code"
                            id="country_code"
                            required>
                            <option value="default">Select Country</option>
                            {countries.map((country, index) => (
                              <option key={index + 1} value={country.country_code}>
                                {country.country_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="">
                          <select
                            className="form-select"
                            onChange={handlesearch}
                            name="state_code"
                            id="state_code"
                            required>
                            <option value="default">Select State</option>
                            {statesByCountry.map((state, index) => (
                              <option key={index} value={state.state_code}>
                                {state.state_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="">
                          <select
                            className="form-select"
                            onChange={handlesearch}
                            name="city_code"
                            id="city_code"
                            required>
                            <option value="default">Select City</option>
                            {cityBystates.map((city, index) => (
                              <option key={index} value={city.city_code}>
                                {city.city_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="col-md-2 w-20">
                        <div className="">
                          <select
                            className="form-select"
                            onChange={handlesearch}
                            name="property_type_id"
                            id="property_type_id"
                            required>
                            <option value="default">Select Project Type</option>
                            {projectTypes.map((project, index) => (
                              <option key={index} value={project?.id}>{project.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-3 w-20">
                        <div className="">
                          <select
                            className="form-select"
                            onChange={handlesearch}
                            name="property_sub_type_id"
                            id='property_sub_type_id'
                            required>
                            <option value="default">Select Sub Project Type</option>
                            {subProjectType.map((subProject, index) => (
                              <option key={index} value={subProject.id}>
                                {subProject.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-md-1">
                        <button className="btn btn-primary">
                          Search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Rejected Projects </h3>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Project Name</th>
                            <th>City</th>
                            <th>Posted By</th>
                            <th>Listed Date</th>
                            <th>Expire Date</th>
                            {/* <th>Approved By</th> */}
                            <th>Change Status  </th>
                            <th>Action </th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingProjects.length > 0 ? (
                            pendingProjects.map((project, index) => {
                              const projectName = projectNames.find((p) => p.id === project.project_name_id)?.name || 'Unknown';
                              const builderName = builders.find((a) => a.id == project.builder_id).name || 'Unknown';
                              const city_name = cities.find((a) => a.city_code == project.city_code).city_name || 'Unknown'
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{projectName}</td>
                                  <td>{builderName}</td>
                                  <td>{project?.propertyId}</td>
                                  <td>{city_name}</td>
                                  <td>{project?.created_by_type}</td>
                                  <td><button onClick={() => { editProject(project) }}> <FaRegEdit /></button></td>
                                </tr>
                              )
                            })
                          ) : (
                            <tr>
                              <td colSpan="5">No projects Found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default MasterrejectedProjects