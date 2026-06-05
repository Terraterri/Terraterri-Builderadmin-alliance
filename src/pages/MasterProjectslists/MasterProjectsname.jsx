import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaRegEdit } from "react-icons/fa";
import { masterClient, projectClient } from '../../utils/httpClient';
import Loader from '../../components/Loader';
import { RiDeleteBinFill } from "react-icons/ri";
import { toastError, toastSuccess } from '../../utils/toast';
import { setEditProject } from '../../store/slices/ProjectManagementSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Pagenation from '../../components/reusable/Pagenation';
import confirmAction from '../../components/reusable/ConfirmToast';
import useDebounce from '../../hooks/Debounce';
import TableComponent from '../../components/reusable/TableComponent';

const MasterProjectsname = () => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [search, setSearch] = useState({});
  const [statesByCountry, setStatesByCountry] = useState([]);
  const [cityBystates, setCityBystates] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [subProjectType, setSubProjectType] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // variable for search
  const [searchTerm, setSearchTerm] = useState('')

  // custom debounce hook
  const debounce = useDebounce(searchTerm, 500);

  // variables for pagenation
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        countriesRes,
        statesRes,
        citiesRes,
        projectsRes,
        projectTypesRes
      ] = await Promise.all([
        masterClient.get('country'),
        masterClient.get('state'),
        masterClient.get('city'),
        projectClient.get(`listing-data?builderName?search=${searchTerm}&limit=10&skip=${10 * (currentPage - 1)}`),
        masterClient.get('projecttype')
      ]);

      if (countriesRes?.data?.status) setCountries(countriesRes?.data?.data);

      if (statesRes?.data?.status) setStates(statesRes?.data?.data);

      if (citiesRes?.data?.status) setCities(citiesRes?.data?.data);

      if (projectsRes?.data?.status) { setProjects(projectsRes?.data?.data); setTotalPages(Math.ceil(projectsRes?.data?.total / 10)) }

      if (projectTypesRes?.data?.status) setProjectTypes(projectTypesRes?.data?.data)

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [debounce, currentPage]);

  //   getAll States
  const getStatesByCountry = (param) => {
    const data = states.filter(state => state.country_code == param)
    if (data.length > 0) {
      setStatesByCountry(data);
    } else {
      toastError('No States Found')
    }
  };

  //   getAll Cities
  const getCitiesByState = (param) => {
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

  const editProject = (project) => {
    dispatch(setEditProject(project));
    navigate('/project/edit')
  }


  if (!countries.length || !states.length || !cities.length) {
    return <Loader />;
  }


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
          toastSuccess('Activated SuccessFully') :
          toastSuccess('Deactivated SuccessFully')
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (param) => {
    const isConfirmed = await confirmAction('Are you sure You want to delete')
    if (!isConfirmed) return;
    setLoading(true);
    try {
      const res = await projectClient.delete(`listing-data/${param}`);
      if (res?.data?.status) {
        toastSuccess('Deleted Successfully !')
        fetchAllData()
      } else {
        console.log(res);
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
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <div className="page-title-right">
                    <ol className="breadcrumb m-0">
                      <li className="breadcrumb-item active">
                        <h4 className="m-0 font-bold">Master Projects</h4>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="cardd mb-4 cardd-input">
                  <div className="card-body">
                  
                    <div className="row">
                      <div className="col-md-2">
                        <div className="">
                          <select
                            className="form-select"
                            onChange={handlesearch}
                            name="country_code"
                            id="country_code"
                            required
                          >
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
                            required
                          >
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
                            required
                          >
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
                            required
                          >
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
                            required
                          >
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
            </div> */}


            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Master Projects Lists</h3>
                    <div>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by Project Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Project Name</th>
                            <th>Bulider Name</th>
                            <th>Project Id</th>
                            <th>City</th>
                            <th>Posted By</th>
                            <th>Change Status  </th>
                            <th>Action </th>
                          </tr>
                        </thead>
                        <tbody>
                          {projects.length > 0 ? (
                            projects.map((project, index) => {
                              return (
                                <tr key={index}>
                                  <td>{(currentPage - 1) * 10 + index + 1}</td>
                                  <td>{project?.name}</td>
                                  <td>{project?.builderName}</td>
                                  <td>{project?.propertyId}</td>
                                  <td>{project?.city_name}</td>
                                  <td>{project?.created_by_type}</td>
                                  <td>{project?.project_status == 'A' ?
                                    <>
                                      <button onClick={() => { editProject(project) }}> <FaRegEdit /></button> | <Link onClick={() => toggleProjectStatus(project.id, 'B')}  >In activate</Link>
                                    </>
                                    :
                                    <>
                                      <button onClick={() => { editProject(project) }}> <FaRegEdit /></button> | <Link onClick={() => toggleProjectStatus(project.id, 'A')} >Activate</Link>
                                    </>
                                  }</td>
                                  <td>
                                    <RiDeleteBinFill onClick={() => { handleDelete(project.id) }} />
                                  </td>
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
      </div>
    </div>
  )
}

export default MasterProjectsname