import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../../components/Loader';
import { expoApiClient } from '../../utils/httpClient';
import moment from 'moment';

const formatDateTime = (dateStr, timeStr) => {
  if (!dateStr && !timeStr) return 'N/A';
  if (dateStr && timeStr) {
    const combined = `${dateStr} ${timeStr}`;
    const parsed = moment(combined, ['YYYY-MM-DD HH:mm:ss', 'DD-MM-YYYY HH:mm:ss']);
    if (parsed.isValid()) return parsed.format('DD-MM-YYYY hh:mm A');
  }
  const raw = dateStr || timeStr;
  const parsed = moment(raw, ['YYYY-MM-DD', 'DD-MM-YYYY', 'YYYY-MM-DD HH:mm:ss']);
  return parsed.isValid() ? parsed.format('DD-MM-YYYY') : raw;
};

const extractVisitedUsers = (visitedObj, stallsArray) => {
  let list = [];
  const processVisitedData = (dataObj) => {
    if (!dataObj || typeof dataObj !== 'object') return;
    Object.entries(dataObj).forEach(([dateStr, val]) => {
      if (Array.isArray(val)) {
        val.forEach((item) => {
          if (Array.isArray(item?.users)) {
            item.users.forEach((u) => list.push({ ...u, date: dateStr }));
          } else {
            list.push({ ...item, date: dateStr });
          }
        });
      } else if (val && typeof val === 'object') {
        if (Array.isArray(val.users)) {
          val.users.forEach((u) => list.push({ ...u, date: dateStr }));
        }
      }
    });
  };

  if (visitedObj?.data) {
    processVisitedData(visitedObj.data);
  }

  if (list.length === 0 && Array.isArray(stallsArray)) {
    stallsArray.forEach((stall) => {
      if (stall?.visited?.data) {
        processVisitedData(stall.visited.data);
      }
    });
  }

  return list;
};

const StallVisitedUsers = () => {
  const userData = useSelector((state) => state.user.userData);
  const [visitedUsers, setVisitedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVisitedUsers = async () => {
    if (!userData?.id) return;
    setLoading(true);
    try {
      const res = await expoApiClient.get(
        `expoAnalytics/builderDashboardCounts.php?builderId=${userData.id}`
      );
      const resData = res?.data || {};
      const list = extractVisitedUsers(resData?.visited, resData?.stalls);
      setVisitedUsers(list);
    } catch (error) {
      console.error('Error fetching visited users:', error);
      setVisitedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitedUsers();
  }, [userData?.id]);

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
                      <li className="breadcrumb-item">
                        <a href="/">Home</a>
                      </li>
                      <li className="breadcrumb-item">
                        <a href="/dashboard">Dashboard</a>
                      </li>
                      <li className="breadcrumb-item active">Stall Visited Users</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-12">
                <div className="card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h3 className="card-title mb-0">Stall Visited Users</h3>
                    <span className="badge bg-primary fs-6">
                      Total Visited: {visitedUsers.length}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive-md">
                      <table className="table text-nowrap mb-0">
                        <thead>
                          <tr>
                            <th>S.No</th>
                            <th>Expo</th>
                            <th>Stall Code</th>
                            <th>Visitor Name</th>
                            <th>Mobile Number</th>
                            <th>Email Id</th>

                            <th>Visited Date & Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visitedUsers.length > 0 ? (
                            visitedUsers.map((user, index) => (
                              <tr key={user.userId || user.id || index}>
                                <td>{index + 1}</td>
                                <td>{user.expoId || 'N/A'}</td>
                                <td>{user.stallCode || 'N/A'}</td>
                                <td>{user.name || user.visitor_name || user.username || 'N/A'}</td>
                                <td>{user.number || user.mobile || user.phone || 'N/A'}</td>
                                <td>{user.email || 'N/A'}</td>

                                <td>{formatDateTime(user.date, user.visited_at || user.joined_at || user.created_at)}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="text-center">
                                No Visited Users Found
                              </td>
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
      </div>
    </>
  );
};

export default StallVisitedUsers;
