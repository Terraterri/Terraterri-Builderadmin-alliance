import React, { useState, useEffect } from 'react'
import { masterClient } from '../../utils/httpClient'
import Loader from '../../components/Loader'
import { toastSuccess, toastError, toastWarning } from '../../utils/toast';
import { useDispatch, useSelector } from 'react-redux';
import { setProject } from '../../store/slices/ProjectManagementSlice';
const StepZero = ({ nextStep }) => {
    const formState = useSelector((state) => state.projectManagement['project']);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [listingTypes, setListingTypes] = useState([])

    const getLIstingTypes = async () => {
        setLoading(true)
        try {
            const res = await masterClient.get('/listingtype');
            if (res?.data?.status) {
                setListingTypes(res.data.data);
            }
            else {
                toastWarning('something went wrong!! please try again')
            }
        }
        catch (error) {
            toastError(error)
        }
        finally {
            setLoading(false)
        }
    }

    const handleChange = (listingTypeId) => {
        dispatch(setProject({ listing_type_id: listingTypeId }))
    }

    const handleSubmit = async () => {
        // if (!formState.listing_type_id) {
        //     toastError('Please select the listing type')

        // }
        // else {
        //     nextStep();
        // }

        nextStep();
    };

    useEffect(() => {
        getLIstingTypes();
    }, [])

    return (
        <div>
            {loading && <Loader />}
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className='card-header'>
                            <h4 className="card-title">Listing Type</h4>
                        </div>
                        <div className="card-body">
                            <p className="card-title">Please select the type of listing</p>
                            <div className='row mt-3'>
                                {
                                    listingTypes.map((type, index) => (


                                        <div className='col-md-6' key={type.id}>
                                            <div className={formState.listing_type_id == type.id ? 'project-card-active' : 'project-card'} onClick={() => handleChange(type.id)}>
                                                <h4>{type.name}</h4>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>


                        </div>
                    </div>
                </div>
            </div>
            <div className='btnParent'>
                <button className="btn customBtn" onClick={handleSubmit}>
                    Next
                </button>
            </div>
        </div>
    )
}

export default StepZero