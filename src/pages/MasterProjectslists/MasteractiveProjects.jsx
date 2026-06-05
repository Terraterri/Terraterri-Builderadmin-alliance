import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { masterClient, projectClient } from '../../utils/httpClient';
import Loader from '../../components/Loader';
import { RiDeleteBinFill } from "react-icons/ri";
import Pagenation from '../../components/reusable/Pagenation';
import { setEditProject } from '../../store/slices/ProjectManagementSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const MasteractiveProjects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState({});
  const [projectTypes, setProjectTypes] = useState([]);
  const [subProjectType, setSubProjectType] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const LIMIT = 10;

  const fetchApiData = async (apiCall, onSuccess) => {
    setLoading(true)
    try {
      const res = await apiCall();
      if (res?.data?.status) onSuccess(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApiData(() => (masterClient.get('country'), setCountries))
    fetchApiData(() => (masterClient.get('projecttype'), setProjectTypes))
    getMetaProjects();
  }, []);

  useEffect(() => {
    getMetaProjects()
  }, [currentPage])

  const getMetaProjects = async () => {
    setLoading(true)
    try {
      const { data } = await projectClient.get(`projects/3/A?limit=${LIMIT}&skip=${(currentPage - 1) * 10}`);
      if (data?.status) {
        setProjects(data?.data)
        setTotalPages(Math.ceil(data?.total / LIMIT));
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }


  //   getAll States
  const getStatesByCountry = async (param) => {
    const data = states.filter(state => state.country_code == param)
    if (data.length > 0) {
      setStates(data);
    } else {
      toastError('No States Found')
    }
  };

  //   getAll Cities
  const getCitiesByState = async (param) => {
    const data = cities.filter(city => city.state_code == param)
    if (data) {
      setCities(data);
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

  const searchProjects = async () => {
    let res
    setLoading(true)
    try {
      res = await projectClient.post('search', search)
      if (res.data.status) {
        setProjects(res.data.data);
      }
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  };

  const toggleProjectStatus = async (id, status) => {
    let res;
    setLoading(true);
    const payload = {
      id: id,
      status: status
    }
    try {
      res = await projectClient.post('toggleProjectStatus', payload)
      if (res.data.status) {
        status == 'A' ?
          toastSuccess('Deactivated SuccessFully') :
          toastSuccess('Activated SuccessFully')
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  const editProject = (project) => {
    dispatch(setEditProject(project));
    navigate('/meta-project/edit')
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
                      <li className="breadcrumb-item active"><h4 className="m-0 font-bold">Active Projects</h4></li>
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
                            {states.map((state, index) => (
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
                            {cities.map((city, index) => (
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
                        <button className="btn btn-primary" onClick={searchProjects} >
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
                    <h3 className="card-title">Active Projects Lists</h3>
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
                          {projects.length > 0 ? (
                            projects.map((project, index) => {
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{project?.name}</td>
                               
                                  <td>{project?.city_name}</td>
                                  <td>{project?.listing_type_id}</td>
                                  <td><Link>03-06-2026</Link></td>
                                  <td><Link>03-06-2026</Link></td>
                                  <td>
                                                                      <button
                                                                        type="button"
                                                                        className={`btn btn-sm ${project?.project_status === 'A' ? 'btn-warning' : 'btn-success'} btn-action`}
                                                                        onClick={() => toggleProjectStatus(project.id, project?.project_status === 'A' ? 'B' : 'A')}
                                                                      >
                                                                        {project?.project_status === 'A' ? 'Deactivate' : 'Activate'}
                                                                      </button>
                                                                                                           
                                  
                                                                    </td>
                                                                    {/* <td className="table-action-cell">
                                                                      <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-light btn-action"
                                                                        onClick={() => editProject(project)}
                                                                      >
                                                                        <FaRegEdit />
                                                                      </button>
                                                                    </td> */}
                                  
                                                                    <td> <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-primary btn-action"
                                                                        onClick={() => editProject(project)}
                                                                      >
                                                                        <FaRegEdit />
                                                                      </button></td>
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
                    <Pagenation
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      totalPages={totalPages}
                    />
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

export default MasteractiveProjects
