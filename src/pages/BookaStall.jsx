import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import moment from 'moment';
import Loader from '../components/Loader';
import { expoApiClient, expoAdminClient, masterClient } from '../utils/httpClient'
import { useSelector } from 'react-redux';
import { PiNutFill } from 'react-icons/pi';
import { toastError, toastSuccess } from '../utils/toast';
import { useNavigate } from 'react-router-dom';
import { environment } from '../utils/environment';



const BookaStall = () => {

  const navigate = useNavigate();

  const userData = useSelector((state) => state.user.userData);
  // console.log(userData)

  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [expos, setExpos] = useState([]);
  const [filteredExpos, setFilteredExpos] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(moment().format('MMMM'));

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [showSlots, setShowSlots] = useState(false);

  const [selectedExpo, setSelectedExpo] = useState(null);

  const [selectedStall, setSelectedStall] = useState('Diamond');

  const [stallPrice, setStallPrice] = useState('')

  const [expoStallsDetails, setExpoStallDetails] = useState({})

  const [selStallId, setSelStallId] = useState('')

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Razorpay script loaded
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const HandleIntiatePayment = async () => {
    if (!selStallId) {
      toastError('Please select a stall');
      return;
    }
    setLoading(true);
    const data = new FormData();

    // data.append('amount', stallPrice || 100);

    data.append('amount', 1);
    try {
      // const response = await expoApiClient.post('/stallBooking/initiatePayment.php', data);

      // const { id, amount } = response.data;

      const response = await masterClient.post('/create-order', data, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      // console.log(response);
      const { id, amount } = response.data;

      const options = {
        key: environment.razorpayApiKey,
        amount: amount,
        currency: 'INR',
        name: 'Terraterri / AirPropx',
        description: 'Stall Booking Payment',
        order_id: id,
        handler: async function (res) {
          await verifyPayment(res);
          // await BookStall();
        },
        prefill: {
          name: userData?.name || userData?.builderName || '',
          email: userData?.email || '',
          contact: userData?.mobile || userData?.phone || ''
        },
        theme: {
          color: '#F37254'
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Error creating order:', error);
      toastError('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const verifyPayment = async (response) => {
    const verifyUrl = '/stallBooking/verifyPayment.php';
    console.log(response);
    try {
      const bookingStartDate = selectedMonth ? moment(selectedMonth, 'MMMM').startOf('month').format('YYYY-MM-DD') : '';
      const bookingEndDate = selectedMonth ? moment(selectedMonth, 'MMMM').endOf('month').format('YYYY-MM-DD') : '';

      response.expoId = selectedExpo?.newExpoId || selectedExpo?.expo_id || selectedExpo?.expoId || selectedExpo?.id;
      response.expoUnqCode = selectedExpo?.expoUnqCode;
      response.stallUnqCode = selStallId;
      response.stallType = selectedStall;
      response.builderId = userData?.id;
      response.amount = stallPrice;
      response.bookingStartDate = bookingStartDate;
      response.bookingEndDate = bookingEndDate;
      response.startDate = bookingStartDate;
      response.endDate = bookingEndDate;

      await expoApiClient.post(verifyUrl, response);
      await updateExpoStalls();
      toastSuccess('Stall created successfully!');

      setTimeout(() => {
        navigate('/expo/pending');
      }, 2000);

    } catch (error) {
      console.error('Error verifying payment:', error);
      toastError('Payment verification failed!');
    }
  };

  const BookStall = async () => {
    setLoading(true)
    if (!selStallId) {
      toastError('Please select a stall');
      setLoading(false)
      return;
    }
    try {
      const payload = {
        expoId: selectedExpo?.newExpoId,
        expoUnqCode: selectedExpo?.expoUnqCode,
        stallUnqCode: selStallId,
        stallType: selectedStall,
        builderId: userData?.id,
        amount: stallPrice
      }

      console.log('payload', payload);
      // return;


      const res = await expoApiClient.post('/stallBooking/stallBooking.php', payload);
      await updateExpoStalls()

      // console.log(payload);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }


  const updateExpoStalls = async () => {
    setLoading(true);
    try {
      const bookingStartDate = moment(selectedMonth, 'MMMM').startOf('month').format('YYYY-MM-DD');
      const bookingEndDate = moment(selectedMonth, 'MMMM').endOf('month').format('YYYY-MM-DD');

      // Compute the updated state before updating the actual state
      const updatedState = { ...expoStallsDetails, [selStallId]: true };

      // Convert updated state to JSON
      let stalls = JSON.stringify(updatedState);

      // Prepare payload with month and dates
      const payload = {
        stalls: stalls,
        month: selectedMonth,
        bookingStartDate: bookingStartDate,
        bookingEndDate: bookingEndDate
      };

      // Update state AFTER computing payload
      setExpoStallDetails(updatedState);

      // Hit the API with the correct payload
      const res = await expoAdminClient.post(
        `/stalls/updateStalls.php?expoId=${selectedExpo.newExpoId}&month=${selectedMonth}&bookingStartDate=${bookingStartDate}&bookingEndDate=${bookingEndDate}`,
        payload
      );

      if (res?.status) {
        setShow(false);
        setExpos([]);
        setFilteredExpos([]);
        setSelectedCountry('');
        setSelectedCity('');
        setSelectedType('');
        setSelStallId('');
        setSelectedExpo(null);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };




  const completedExpo = async () => {
    setLoading(true);
    try {
      const res = await expoAdminClient.get('/NewExpo/get.php?type=ongoing',);
      if (res?.data?.status && res.data.data.length) {
        setExpos(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching expo data:", err);
      toastError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };


  const getStallPrices = async () => {
    setLoading(true)
    try {
      let body = {
        city: selectedCity,
        expoType: selectedType,
        stall: selectedStall
      }
      const res = await expoAdminClient.post('/packages/getByType.php', body);
      if (res?.data?.status && res?.data?.data != null) {
        setStallPrice(res?.data?.data?.amount)
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    completedExpo();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let filteredExposData = expos;

      if (selectedCountry) {
        filteredExposData = filteredExposData.filter((expo) => expo.expoCountry === selectedCountry);
      }

      if (selectedCity) {
        filteredExposData = filteredExposData.filter((expo) => expo.expoCity === selectedCity);
      }

      if (selectedType) {
        filteredExposData = filteredExposData.filter((expo) => expo.expoType === selectedType);
      }

      setFilteredExpos(filteredExposData);
    };

    applyFilters();
  }, [selectedCountry, selectedCity, selectedType, expos]);

  const fetchBookedStalls = async (expoId, month) => {
    if (!expoId || !month) {
      setExpoStallDetails({});
      return;
    }
    setLoading(true);
    try {
      const bookingStartDate = moment(month, 'MMMM').startOf('month').format('YYYY-MM-DD');
      const bookingEndDate = moment(month, 'MMMM').endOf('month').format('YYYY-MM-DD');

      let res;
      try {
        res = await expoAdminClient.get(
          `/stalls/getStalls.php?expoId=${expoId}&bookingStartDate=${bookingStartDate}&bookingEndDate=${bookingEndDate}`
        );
      } catch (e1) {
        res = await expoApiClient.get(
          `/stallBooking/getBookedStalls.php?expoId=${expoId}&bookingStartDate=${bookingStartDate}&bookingEndDate=${bookingEndDate}`
        );
      }

      let parsedStalls = {};
      const rawData = res?.data;

      let stallList = [];
      if (rawData) {
        if (Array.isArray(rawData)) {
          stallList = rawData;
        } else if (Array.isArray(rawData.data)) {
          stallList = rawData.data;
        } else if (typeof rawData.data === 'string') {
          try {
            const parsed = JSON.parse(rawData.data);
            if (Array.isArray(parsed)) stallList = parsed;
          } catch (e) { }
        } else if (typeof rawData === 'string') {
          try {
            const parsed = JSON.parse(rawData);
            if (Array.isArray(parsed)) {
              stallList = parsed;
            } else if (Array.isArray(parsed.data)) {
              stallList = parsed.data;
            }
          } catch (e) { }
        } else if (typeof rawData.data === 'object' && rawData.data !== null) {
          Object.keys(rawData.data).forEach((key) => {
            if (rawData.data[key]) {
              const codeStr = String(key).trim();
              parsedStalls[codeStr] = true;
              parsedStalls[codeStr.toUpperCase()] = true;
            }
          });
        }
      }

      if (stallList.length > 0) {
        stallList.forEach((item) => {
          if (!item) return;

          if (typeof item === 'string') {
            const codeStr = item.trim();
            if (codeStr) {
              parsedStalls[codeStr] = true;
              parsedStalls[codeStr.toUpperCase()] = true;
            }
            return;
          }

          const isBooked = item.status === undefined || item.status === null || item.status == 1 || item.status === true || item.status === '1' || item.status === 'booked' || item.status === 'active';

          if (isBooked) {
            const stallCode = item.stallUnqCode || item.stallNumber || item.stall_code || item.stallId;
            if (stallCode) {
              const codeStr = String(stallCode).trim();
              parsedStalls[codeStr] = true;
              parsedStalls[codeStr.toUpperCase()] = true;
            }
          }
        });
      }

      setExpoStallDetails(parsedStalls);
    } catch (err) {
      console.error("Error fetching booked stalls for month:", err);
      setExpoStallDetails({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedType && selectedCity) {
      if (filteredExpos.length > 0) {
        const expo = filteredExpos[0];
        setSelectedExpo(expo);
      } else {
        setSelectedExpo(null);
        setExpoStallDetails({});
      }
    } else {
      setSelectedExpo(null);
      setExpoStallDetails({});
    }
  }, [selectedType, selectedCity, filteredExpos]);

  useEffect(() => {
    const expoId = selectedExpo?.newExpoId || selectedExpo?.expo_id || selectedExpo?.expoId || selectedExpo?.id;
    if (expoId && selectedMonth) {
      fetchBookedStalls(expoId, selectedMonth);
    } else {
      setExpoStallDetails({});
    }
  }, [selectedExpo, selectedMonth, show]);


  useEffect(() => {
    if (selectedCity && selectedType && selectedStall) {
      getStallPrices();
    }
  }, [selectedCity, selectedType, selectedStall])

  const Stalltabs = [
    { tab: 'D1', name: 'Diamond', className: 'daimond-clr' },
    { tab: 'P', name: 'Platinum', className: 'platinum-clr' },
    { tab: 'G', name: 'Gold', className: 'gold-clr' },
    { tab: 'S', name: 'Standard', className: 'standrd-clr' },
  ];

  const selectTab = (stall) => {
    setSelectedStall(stall)
  }


  // Select a stall, ensuring only one is selected at a time
  const onSelectStall = (stallId, stall) => {
    if (!selectedMonth) {
      toastError('Please select a month first');
      return;
    }
    const stallKeyUpper = stallId ? String(stallId).trim().toUpperCase() : '';
    if (expoStallsDetails[stallId] || expoStallsDetails[stallKeyUpper]) return; // If already booked, do nothing
    selectTab(stall)
    setSelStallId(stallId === selStallId ? null : stallId);
  };


  return (
    <>
      {loading && <Loader />}
      <div className="main-content">
        <div className="page-content">
          <div className="container">
            <div className="cardd metavrse_out">
              <div className="container">
                <div className="titles_lne  text-center mb-4">
                  <h4>THE METAVERSE REALESTATE EXPO</h4>
                  <p>Showcase Your Projects at the Premier Metaverse Realestate Expo</p>
                </div>
                <div className="row slet_out">
                  <div className="col-md-4 stateBox">
                    <div className="d-flex sel_blo">
                      <span>Select Country:</span>
                      <select className="form-select formcontrol" name="country" value={selectedCountry}
                        onChange={(e) => { setSelectedCountry(e.target.value); setSelectedCity(''); setSelectedType(''); setSelectedExpo(null); setSelStallId(''); }}>
                        <option value="" >
                          Select
                        </option>
                        {[...new Set(expos.map((cExpo) => cExpo.expoCountry))].map((expoCountry, index) => (
                          <option key={index} value={expoCountry}>
                            {expoCountry}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4 stateBox">
                    <div className="d-flex sel_blo">
                      <span>Select City:</span>
                      <select className="form-select formcontrol" name="city" value={selectedCity}
                        onChange={(e) => { setSelectedCity(e.target.value); setSelectedType(''); setSelectedExpo(null); setSelStallId(''); }}>
                        <option value="">
                          Select
                        </option>
                        {[...new Set(expos
                          .filter((cExpo) => cExpo.expoCountry === selectedCountry)
                          .map((cExpo) => cExpo.expoCity))].map((expoCity, index) => (
                            <option key={index} value={expoCity}>
                              {expoCity}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex sel_blo sel_bloo">
                      <span>Expo Type:</span>
                      <select className="form-select formcontrol" name="type" value={selectedType}
                        onChange={(e) => { setSelectedType(e.target.value); setSelectedExpo(null); setSelStallId(''); }}>
                        <option value="">
                          Select
                        </option>
                        {[...new Set(expos
                          .filter((cExpo) => (!selectedCountry || cExpo.expoCountry === selectedCountry) && (!selectedCity || cExpo.expoCity === selectedCity))
                          .map((cExpo) => cExpo.expoType))].map((expoType, index) => (
                            <option key={index} value={expoType}>
                              {expoType}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>


                <Tabs>
                  <div className='row align-items-center'>
                    <div className='col-md-3'><h3 className='mb-0'>Choose the Expo Stall </h3></div>
                    <div className='col-md-9'>
                      <TabList>
                        {Stalltabs.map((item, index) => (
                          <Tab onClick={() => selectTab(item.name)} className={item.className} key={index}>{item.name}</Tab>
                        ))}
                      </TabList>
                    </div>
                  </div>

                  {selectedExpo != null ?
                    <>
                      <div className="row mt-5 airprx_ot">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                          <div className={`bg-color1 bg-color-pnk ${selectedStall}`}>
                            <h4>{selectedStall}  Stall</h4>
                            <div className="pricing-item text-center">
                              <h2 className="gold">AIRPROPX - {selectedExpo.expoCity}</h2>
                              <h6>
                                THE METAVERSE <span>{selectedExpo.name}</span> REALESTATE EXPO
                              </h6>
                              {/* <h6 className="vald-ot">10 &amp; 11 - March-2024</h6> */}
                              <h3>₹ {stallPrice ? stallPrice : '-'}</h3>
                              <button className="purchage-btn" onClick={handleShow} href="#" role="button">
                                BOOK NOW
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-3"></div>
                      </div>
                    </>
                    :
                    <>
                      <TabPanel>
                        <div className="row mt-5 airprx_ot">
                          <div className="col-md-3"></div>
                          <div className="col-md-6">
                            <div className="pricing-item text-center">
                              <h6>
                                Please select city and expo type
                              </h6>
                            </div>
                          </div>
                        </div>
                      </TabPanel>
                    </>
                  }

                </Tabs>

                <div className="text-center">
                  <h4>
                    Want to learn more about AirPropx and its sponsorships? <Link to="#">View</Link>
                  </h4>
                </div>

                <Modal show={show} onHide={handleClose} className="stall_popup">
                  <Modal.Header closeButton>
                    <div className='row w-100 '>
                      <div className='col-md-6'>
                        <div className="row align-items-center">
                          <div className="col-md-7">
                            <h3 className="mb-0">Expo Layout-Plan</h3>
                          </div>
                          <div className="col-md-5">
                            <select
                              className="form-control"
                              value={selectedMonth}
                              onChange={(e) => { setSelectedMonth(e.target.value); setSelStallId(''); }}
                            >
                              <option value="">Select Month</option>
                              {monthsList.map((m, index) => (
                                <option key={index} value={m}>{m}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6'>
                        <div className='paymet_bloo'>
                          <h3>Selected Package Details</h3>
                        </div>
                      </div>
                    </div>
                  </Modal.Header>

                  <div className="py-3 px-5">
                    <div className="row">
                      <div className="col-md-6">
                        <div className='text-center map_outt'>
                          <img src="/assets/images/routemap.png" />
                          <div className='d-stall'>
                            <button
                              className={expoStallsDetails["D1"] ? "booked cursor-notallowed" : selStallId === "D1" ? "selected" : ""}
                              onClick={() => onSelectStall("D1", "Diamond")}
                              disabled={Boolean(expoStallsDetails["D1"])}
                            >
                              D
                            </button>
                          </div>

                          <div className='p-stall'>
                            {['P1', 'P2'].map((stall) => (
                              <button
                                key={stall}
                                className={`${stall.toLowerCase()} ${expoStallsDetails[stall] ? "booked cursor-notallowed" : selStallId === stall ? "selected" : ""}`}
                                onClick={() => onSelectStall(stall, "Platinum")}
                                disabled={Boolean(expoStallsDetails[stall])}
                              >
                                {stall}
                              </button>
                            ))}
                          </div>

                          <div className="g-stall">
                            {["G1", "G2", "G3", "G4"].map((stall) => (
                              <button
                                key={stall}
                                className={`${stall.toLowerCase()} ${expoStallsDetails[stall] ? "booked cursor-notallowed" : selStallId === stall ? "selected" : ""}`}
                                onClick={() => onSelectStall(stall, "Gold")}
                                disabled={Boolean(expoStallsDetails[stall])}
                              >
                                {stall}
                              </button>
                            ))}
                          </div>


                          <div className="s-stall">
                            {Array.from({ length: 20 }, (_, i) => {
                              const stallKey = `S${i + 1}`;
                              let className = `s${i + 1}`;

                              if (expoStallsDetails[stallKey]) {
                                className += " booked cursor-notallowed";
                              } else if (selStallId === stallKey) {
                                className += " selected";
                              }

                              return (
                                <button
                                  key={stallKey}
                                  className={className}
                                  onClick={() => onSelectStall(stallKey, "Standard")}
                                  disabled={Boolean(expoStallsDetails[stallKey])}
                                >
                                  {stallKey}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className='clr_bars row mt-2 align-items-center'>
                          <div className='col-md-4'>
                            <ul className='mb-0 p-0'>
                              <li><span className='avlb'></span> Available</li>
                              <li><span className='selt'></span> Selected</li>
                              <li><span className='bookd'></span> Booked</li>
                            </ul>
                          </div>
                          <div className='col-md-4'>
                            <ul className='mb-0 p-0'>
                              <li className='dimnr-clr'>
                                <me className='mr-3'>D1 </me> : Daimond Stall
                              </li>
                              <li className='pltnm-clr'> P1 & P2 : Platinum Stall</li>
                            </ul>
                          </div>
                          <div className='col-md-4'>
                            <ul className='mb-0 p-0'>
                              <li className='gld-clr'> G1 - G4 : Gold Stall</li>
                              <li className='stnd-clr'> S1 - S20 : Standard Stall</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className='paymet_blo'>
                          <div className='pay-card1 mb-2'>
                            <div className="row">
                              <div className='col-md-6'>
                                <div className='icn-paymts'>
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    stroke-width="0"
                                    viewBox="0 0 384 512"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path>
                                  </svg>
                                  {selectedExpo != null &&
                                    <span>City : {selectedExpo.expoCity}</span>
                                  }
                                </div>
                              </div>
                              <div className='col-md-6'>
                                <div className='icn-paymts'>
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    stroke-width="0"
                                    role="img"
                                    viewBox="0 0 24 24"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <title></title>
                                    <path d="M0 20.084c.043.53.23 1.063.718 1.778.58.849 1.576 1.315 2.303.567.49-.505 5.794-9.776 8.35-13.29a.761.761 0 011.248 0c2.556 3.514 7.86 12.785 8.35 13.29.727.748 1.723.282 2.303-.567.57-.835.728-1.42.728-2.046 0-.426-8.26-15.798-9.092-17.078-.8-1.23-1.044-1.498-2.397-1.542h-1.032c-1.353.044-1.597.311-2.398 1.542C8.267 3.991.33 18.758 0 19.77Z"></path>
                                  </svg>
                                  {selectedExpo != null &&
                                    <>
                                      <span>Expo Type : </span> <span>{selectedExpo?.expoType}</span>
                                    </>
                                  }
                                </div>
                              </div>
                              <div className='col-md-6'>
                                <div className='icn-paymts'>
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    stroke-width="0"
                                    viewBox="0 0 24 24"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 6v15H3v-2h2V3h9v1h5v15h2v2h-4V6h-3zm-4 5v2h2v-2h-2z"></path>
                                  </svg>
                                  {selectedStall != undefined &&
                                    <>
                                      <span>Stall Type : </span> <span>{selectedStall}</span>
                                    </>
                                  }
                                </div>
                              </div>
                              <div className='col-md-6'>
                                <div className='icn-paymts'>
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    stroke-width="0"
                                    viewBox="0 0 24 24"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 6v15H3v-2h2V3h9v1h5v15h2v2h-4V6h-3zm-4 5v2h2v-2h-2z"></path>
                                  </svg>
                                  <span>Stall No :</span> <span>{selStallId}</span>
                                </div>
                              </div>
                              {/* <div className="stall-price mt-1 mb-0 d-flex">
                                Your Selected Package <span className="sle_blo"> : 2 Expos</span>
                              </div> */}
                            </div>
                          </div>


                          {/* <div className='pay-card1 b_dates mb-2'>
                            <div className="row">
                              <div className='col-md-12'>
                                <div className='icn-paymts'>
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    stroke-width="0"
                                    viewBox="0 0 24 24"
                                    height="1em"
                                    width="1em"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"></path>
                                  </svg>
                                  <span> {selStallId} Stall Available Expo Dates:-</span>
                                </div>
                              </div>

                              {filteredDates.length > 0 &&
                                filteredDates.map((cExpo, idx) => (
                                  <div className="col-md-4" key={idx}>
                                    <div className="w-100 s_date mb-3 selected">
                                      {moment(cExpo.fromDate).format("Do MMM YYYY")}
                                    </div>
                                  </div>
                                ))
                              }

                              <div className="col-md-4">
                                <div className="w-100 s_date selected">16-09-2024</div>
                              </div>
                              <div className="col-md-4">
                                <div className="w-100 s_date">31-08-2024</div>
                              </div>
                              <div className="col-md-4">
                                <div className="w-100 s_date">31-12-2024</div>
                              </div>
                            </div>
                          </div> */}


                          <div className='pay-card1'>
                            <div className="row btns-p">
                              <div className="col-md-12 text-right">
                                <div>
                                  <p className="rate_out d-flex align-items-center justify-content-end mb-0">
                                    Package Amout : <span className="pric_blo">₹ {stallPrice}</span>
                                  </p>
                                  <p className="rate_out d-flex align-items-center justify-content-end mb-0">
                                    Estimated Gst : <span className="pric_blo">₹ 19440</span>
                                  </p>
                                  <p className="total-amt d-flex align-items-center justify-content-end mb-0 br-top">
                                    Total Payable Amount : <span className="pric_blo">₹127440</span>
                                  </p>
                                </div>
                              </div>
                              <div className="col-md-12 text-right">

                                <button
                                  className="grn"
                                  fdprocessedid="jbxtud"
                                  onClick={HandleIntiatePayment}>
                                  Buy Now
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="card-data">
                            <ul className="row m-0">
                              {/* <li className='col-md-12'>
                                          <div className="heds">
                                            <h6>Selected Package Details</h6>
                                          </div>
                                          </li>
                                          <li className="col-md-6">
                                            <svg
                                              stroke="currentColor"
                                              fill="currentColor"
                                              stroke-width="0"
                                              viewBox="0 0 384 512"
                                              height="1em"
                                              width="1em"
                                              xmlns="http://www.w3.org/2000/svg">
                                              <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"></path>
                                            </svg>
                                            <span>HYD</span>
                                          </li>
                                          <li className="col-md-6">
                                            <svg
                                              stroke="currentColor"
                                              fill="currentColor"
                                              stroke-width="0"
                                              role="img"
                                              viewBox="0 0 24 24"
                                              height="1em"
                                              width="1em"
                                              xmlns="http://www.w3.org/2000/svg">
                                              <title></title>
                                              <path d="M0 20.084c.043.53.23 1.063.718 1.778.58.849 1.576 1.315 2.303.567.49-.505 5.794-9.776 8.35-13.29a.761.761 0 011.248 0c2.556 3.514 7.86 12.785 8.35 13.29.727.748 1.723.282 2.303-.567.57-.835.728-1.42.728-2.046 0-.426-8.26-15.798-9.092-17.078-.8-1.23-1.044-1.498-2.397-1.542h-1.032c-1.353.044-1.597.311-2.398 1.542C8.267 3.991.33 18.758 0 19.77Z"></path>
                                            </svg>
                                            <span>Expo Type : </span> <span>Residential</span>
                                          </li>
                                          <li className="col-md-6">
                                            <svg
                                              stroke="currentColor"
                                              fill="currentColor"
                                              stroke-width="0"
                                              viewBox="0 0 24 24"
                                              height="1em"
                                              width="1em"
                                              xmlns="http://www.w3.org/2000/svg">
                                              <path d="M14 6v15H3v-2h2V3h9v1h5v15h2v2h-4V6h-3zm-4 5v2h2v-2h-2z"></path>
                                            </svg>
                                            <span>Stall Type: </span> <span>Daimond</span>
                                          </li>
                                          <li className="col-md-6">
                                            <svg
                                              stroke="currentColor"
                                              fill="currentColor"
                                              stroke-width="0"
                                              viewBox="0 0 24 24"
                                              height="1em"
                                              width="1em"
                                              xmlns="http://www.w3.org/2000/svg">
                                              <path fill="none" d="M0 0h24v24H0z"></path>
                                              <path d="M4 10h3v7H4zM10.5 10h3v7h-3zM2 19h20v3H2zM17 10h3v7h-3zM12 1L2 6v2h20V6z"></path>
                                            </svg>
                                            <span>Stall No : </span><span>3</span>
                                            <span className="stallbg"></span>
                                          </li>
                                          <li className='d-flex'>
                                          <div className="month_ot d-flex justifi-content-center">
                                            <div className='mr-2 mnths-ot'>
                                              <label className="custom-radio">
                                                <input type="radio" name="standardPrice" value="1000" />
                                                <span className="radio-icon">1 Month</span>
                                              </label>
                                            </div>
                                            <div className='mr-2 mnths-ot'>
                                              <label className="custom-radio">
                                                <input type="radio" name="standardPrice" value="3000" />
                                                <span className="radio-icon">3 Months</span>
                                              </label>
                                            </div>
                                            <div className='mr-2 mnths-ot'>
                                              <label className="custom-radio">
                                                <input type="radio" name="standardPrice" value="6000" />
                                                <span className="radio-icon">6 Months</span>
                                              </label>
                                            </div>
                                      </div>
                                          </li>
                                          <li className="stall-price mt-3 mb-2 d-flex">
                                            Your Selected Package  
                                            <span className="sle_blo">: 3Expos</span>
                                          </li>
                                          <li className="mb-3">
                                            <svg
                                              stroke="currentColor"
                                              fill="currentColor"
                                              stroke-width="0"
                                              viewBox="0 0 24 24"
                                              height="1em"
                                              width="1em"
                                              xmlns="http://www.w3.org/2000/svg">
                                              <path fill="none" d="M0 0h24v24H0z"></path>
                                              <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"></path>
                                            </svg>
                                            <span> S3 Stall Available Dates:-</span>
                                          </li>
                                          <li>
                                            <div className="row b_dates">
                                              <div className="col-md-4 px-1">
                                                <div className="w-100 s_date">16-08-2024</div>
                                              </div>
                                              <div className="col-md-4 px-1">
                                                <div className="w-100 s_date">16-09-2024</div>
                                              </div>
                                              <div className="col-md-4 px-1">
                                                <div className="w-100 s_date">31-08-2024</div>
                                              </div>
                                              <div className="col-md-4 px-1">
                                                <div className="w-100 s_date">31-12-2024</div>
                                              </div>
                                              <div className="col-md-4 px-1">
                                                <div className="w-100 s_date">31-10-2024</div>
                                              </div>
                                            </div>
                                          </li>
                                          <li>
                                            <div className="row b_dates"></div>
                                            <div className="row btns-p">
                                              <div className="col-md-12 text-right">
                                              <div> 
                                              <p  className="rate_out d-flex align-items-center justify-content-end mb-0">Package Amout : <span className="pric_blo">₹ 108000</span></p>
                                              <p  className="rate_out d-flex align-items-center justify-content-end mb-0">Estimated Gst : <span className="pric_blo">₹ 19440</span></p>
                                              <p  className="total-amt d-flex align-items-center justify-content-end mb-0 br-top">Total Payable Amount : <span className="pric_blo">₹ 127440</span></p>
                                              </div> 
                                              </div>
                                              <div className="col-md-12 text-right">
                                                
                                                <button
                                                  className="grn"
                                                  fdprocessedid="jbxtud"
                                                  onClick={HandleIntiatePayment}>
                                                  Buy Now
                                                </button>
                                              </div>
                                            </div>
                                          </li> */}
                              {/* <li className="col-md-12 px-0">
                                <div className="stall-price clrs d-flex align-items-start pack-avabl">
                                  <span> Other Available Packages :</span>
                                  <span className="other_opt">
                                    <input type="radio" name="standardPrice" value="1000" /> 1 Expo : ₹ 40000
                                    <br />
                                    <input type="radio" name="standardPrice" value="3000" /> 3 Expos : ₹ 204000
                                  </span>
                                </div>
                              </li> */}
                              {/* <li className="stall-price clrs"></li> */}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookaStall;