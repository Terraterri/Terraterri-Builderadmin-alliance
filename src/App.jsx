import { useState, useEffect, } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import LazyLoad from "./routes/LazyLoad";
import Loader from "./components/Loader";
import { authClient } from "./utils/httpClient";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserInfoContext, IpInfoContext } from "./utils/context";
import { Provider } from "react-redux";
import Store from "./store/Store";
import { useDispatch } from "react-redux";
import { setUserRole, setUserData, clearUser } from "./store/slices/UserSlice";
import { toastError } from "./utils/toast";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loader, setLoader] = useState(true);
  const [ipInfo, setIpInfo] = useState({});

  const dispatch = useDispatch();
  const token = localStorage.getItem('adminToken');

  const acceptRoles = ['Alliance Builder'];

  const ValidateToken = async () => {
    if (token == null) {
      setLoader(false);
      navigate('/')
      return;
    }
    try {
      const response = await authClient.post('/validate-token');
      if (response.status) {
        if (acceptRoles.includes(response?.data?.data?.role)) {
          dispatch(setUserRole(response.data.data?.role));
          dispatch(setUserData(response.data?.data?.userData));
          if (location.pathname == '/') {
            navigate('/dashboard')
          } else {
            navigate(location.pathname);
          }
        } else {
          handleInvalidToken();
          toastError("You don't have permission to access this Panel.");
        }
      } else {
        handleInvalidToken();
      }
    }
    catch (err) {
      console.error("Token validation failed:", err);
      handleInvalidToken();
    }
    finally {
      setLoader(false);
    }
  }

  const handleInvalidToken = async () => {
    localStorage.removeItem('adminToken');
    navigate('/')
    dispatch(clearUser());
  }


  const getIpInfo = async () => {
    try {
      // Step 1: Get the user's public IP
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();
      const userIp = ipData?.ip;

      if (!userIp) return;

      // Step 2: Call terraterri ipgeo API with the IP
      const response = await fetch(`https://nodeapi.terraterri.com/api/ipgeo?ip=${userIp}`);
      const data = await response.json();
      if (data) {
        setIpInfo(data);
      }
    } catch (err) {
      console.log("Failed to fetch IP info:", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');

    if (token != null) {
      ValidateToken();
      getIpInfo();
    } else {
      setLoader(false);
      handleInvalidToken()
    }
  }, [token]);

  if (loader) return <Loader />;

  return (
    <>
      <Provider store={Store}>
        <IpInfoContext.Provider value={{ ipInfo }}>
          <div id="layout-wrapper">
            <ToastContainer />
            {loader && <Loader />}
            {token && <Header />}
            {token && <Sidebar />}
            <LazyLoad />
            {token && <Footer />}
          </div>
        </IpInfoContext.Provider>
      </Provider>
    </>
  );
}

export default App;
