import React, { useEffect, useState } from 'react'
import { masterClient } from '../../utils/httpClient'
import Loader from '../../components/Loader'
import { useSelector } from 'react-redux';
import { toastError, toastSuccess } from '../../utils/toast';

const BuyPakage = () => {
  const userData = useSelector((state) => state.user.userData)
  const userRole = useSelector((state) => state.user.role)
  const [loading, setLoading] = useState(false);
  const [listingPackages, setListingPackages] = useState([]);
  const [selPackage, setSelPackage] = useState(null)
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [search, setSearch] = useState({ no_of_listings: 1 });

  const getListingPackages = async () => {
    setLoading(true);
    try {
      const role = userRole === 'Builder' ? 'Builder,Exclusive Sales Partner' : userRole === 'Exclusive Sales Partner' ? 'Builder,Exclusive Sales Partner' : userRole
      const res = await masterClient.get('packages');
      if (res?.data?.status && res.data?.data.length > 0) {
        const premiumListings = res.data.data.filter(
          (listing) => {
            return listing.listing_type === 'Meta Listing' &&
              listing.package_for === role;
          }
        );

        setListingPackages(premiumListings);

        const selectedPackage = premiumListings.find(
          (packagee) => packagee.no_of_listings == 1 ||
            packagee.no_of_listings == 10
        );



        setSelPackage(selectedPackage);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleSearch = async (e) => {
    const { name, value } = e.target

    if (name === 'country_code') {
      getStatesByCountry(value)
    }

    if (name === 'state_code') {
      getCitiesByState(value)
    }

    setSearch((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    const filterData = () => {
      return listingPackages.filter(item => {
        return (
          (!search.country_code || item.country_code === search.country_code) &&
          (!search.state_code || item.state_code === search.state_code) &&
          (!search.city_code || item.city_code === search.city_code) &&
          (!search.no_of_listings || item.no_of_listings === parseInt(search.no_of_listings, 10))
        );
      });
    };

    const result = filterData();
    setSelPackage(result[0])
  }, [search])


  useEffect(() => {
    getListingPackages();
    getCountries();

  }, [])

  const getCountries = async () => {
    let res;
    setLoading(true)
    try {
      res = await masterClient.get('/country');
      if (res?.data.status) {
        setCountries(res?.data?.data)
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
  }

  //   getAll States
  const getStatesByCountry = async (param) => {
    setLoading(true);
    try {
      const res = await masterClient.get(`state/${param}`);
      if (res?.data?.status) {
        setStates(res?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  //   getAll Cities
  const getCitiesByState = async (param) => {
    setLoading(true);
    try {
      const res = await masterClient.get(`city/${param}`);
      if (res?.data?.status) {
        setCities(res?.data?.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const buyPackage = async (planType, price, numberOfDays, listings, package_id) => {
    let activatedDay = new Date().toISOString().split('T')[0];

    let deactivationDate = new Date();
    deactivationDate.setDate(deactivationDate.getDate() + numberOfDays);
    let formattedDate = deactivationDate.toISOString().split('T')[0];

    const body = {
      'package_id': package_id,
      'package_type': planType,
      'price': price,
      'number_of_days': numberOfDays,
      'total_listings': listings,
      'available_listings': listings,
      'activated_date': activatedDay,
      'deactivate_date': formattedDate,
      'user_id': userData?.id,
      'user_role': userData?.role_id
    }

    let res = await masterClient.post('purchaseDetails', body)
    if (res?.data?.status) {
      toastSuccess('Purchased SuccessFully')
    } else {
      toastError('Failed Please Try again')
    }
  }

  return (

    <>
      {loading && <Loader />}
      {selPackage == null ?
        <div className="main-content">
          <div className="page-content">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box d-flex align-items-center justify-content-between">
                    <div className="page-title-right">
                      <h4 className='mb-0'>Buy Meta Packages</h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card cardd">
                <div className="dashbrd_cont">
                  <div className="profile-det-titls">
                    <h3 className="PremiumAccount1"> METAVERSE LISTINGS</h3>
                  </div>
                  <div className='d-flex align-items-center justify-content-center'>
                    <h4>No Packages Found</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        :
        <div className="main-content">
          <div className="page-content">
            <div className="container">
              <div className="row">
                <div className="col-12">
                  <div className="page-title-box d-flex align-items-center justify-content-between">
                    <div className="page-title-right">
                      <h4 className='mb-0'>Buy Meta Packages</h4>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card cardd">
                <div className="dashbrd_cont">
                  <div className="profile-det-titls">
                    <h3 className="PremiumAccount1"> METAVERSE LISTINGS</h3>
                  </div>

                  <div className="pk-nme text-center">
                    <h2 className="PremiumAccount">Metaverse Listing Packages</h2>
                    <span>PLATFORM + PROMOTION</span>
                    <p className="showcase1">
                      Connect, Engage, Sell: Leverage Metaverse Listings to Reach New
                      Heights!
                    </p>
                  </div>

                  <div className="row slet_out">
                    <div className="col-md-5">
                      <div className="d-flex sel_blo">
                        <div className='custom-dropdown'>
                          <select
                            className="form-control formcontrol"
                            name='country_code'
                            onChange={handleSearch}
                          >
                            <option value="">Country</option>
                            {countries.map((country, index) => (
                              <option key={index + 1} value={country.country_code}>
                                {country.country_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='custom-dropdown'>
                          <select
                            className="form-control formcontrol"
                            name='state_code'
                            onChange={handleSearch}
                          >
                            <option value="">State</option>
                            {states.map((state, index) => (
                              <option key={index + 1} value={state.state_code}>
                                {state.state_name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className='custom-dropdown'>
                          <select
                            className="form-control formcontrol"
                            name='city_code'
                            onChange={handleSearch}
                          >
                            <option value="">City</option>
                            {cities.map((city, index) => (
                              <option key={index + 1} value={city.city_code}>
                                {city.city_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="d-flex sel_blo justify-content-end listi-blo">
                        <span>Select No of Listings: </span>
                        <div className='custom-dropdown'>
                          <select
                            className="form-control formcontrol"
                            name='no_of_listings'
                            onChange={handleSearch}
                          >
                            {listingPackages.map((item, index) => (
                              <option key={index} value={item.no_of_listings}>{item.no_of_listings}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-5">
                    <div className="col-md-4">
                      <div className="bg-color1">
                        <div className="pricing-item text-center">
                          <h2 className="PARAGON">{selPackage.package_one_type?.toUpperCase()}</h2>
                          <h6>Metaverse Model House</h6>
                          <h6 className="vald-ot">Validity: {selPackage.package_one_days} Days</h6>
                          {selPackage.package_one_price != null ?
                            <>
                              <h3>₹ {selPackage.package_one_price}</h3>
                              <ul>
                                <li>Listings: {selPackage.no_of_listings}</li>
                              </ul>
                            </>
                            :
                            <>
                              <h3>₹ -</h3>
                              <ul>
                                <li>Listings: -</li>
                              </ul>
                            </>
                          }
                          <button className="purchage-btn" onClick={() => buyPackage(selPackage.package_one_type, selPackage.package_one_price, selPackage.package_one_days, selPackage.no_of_listings, selPackage.id)}>Purchase</button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="bg-color2">
                        <div className="pricing-item text-center">
                          <h2 className="PARAGON">{selPackage.package_two_type?.toUpperCase()}</h2>
                          <h6>Metaverse Builder's Office</h6>
                          <h6 className="vald-ot">Validity: {selPackage.package_two_days} Days</h6>
                          {selPackage.package_two_price != null ?
                            <>
                              <h3>₹ {selPackage.package_two_price}</h3>
                              <ul>
                                <li>Listings: {selPackage.no_of_listings}</li>
                              </ul>
                            </>
                            :
                            <>
                              <h3>₹ -</h3>
                              <ul>
                                <li>Listings: -</li>
                              </ul>
                            </>
                          }
                          <button className="purchage-btn" onClick={() => buyPackage(selPackage.package_two_type, selPackage.package_two_price, selPackage.package_two_days, selPackage.no_of_listings, selPackage.id)}>Purchase</button>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="bg-color3">
                        <div className="pricing-item text-center">
                          <h2 className="PARAGON">{selPackage.package_three_type?.toUpperCase()}</h2>
                          <h6>Paragon + Builder Box</h6>
                          <h6 className="vald-ot">Validity: {selPackage.package_three_days} Days</h6>
                          {selPackage.package_three_price != null ?
                            <>
                              <h3>₹ {selPackage.package_three_price}</h3>
                              <ul>
                                <li>Listings: {selPackage.no_of_listings} + 1</li>
                              </ul>
                            </>
                            :
                            <>
                              <h3>₹ -</h3>
                              <ul>
                                <li>Listings: -</li>
                              </ul>
                            </>
                          }
                          <button className="purchage-btn" onClick={() => buyPackage(selPackage.package_three_type, selPackage.package_three_price, selPackage.package_three_days, selPackage.no_of_listings, selPackage.id)}>Purchase</button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      }

    </>

  )
}

export default BuyPakage
