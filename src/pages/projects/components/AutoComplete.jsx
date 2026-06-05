import React, { useEffect, useState } from 'react'
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import GoogleMapComponent from './GoogleMapComponent';

const AutoComplete = ({ latLong }) => {

    const [address, setAddress] = useState('')
    const [mapDetails, setMapDetails] = useState({})

    const handleChange = address => {
        setAddress(address);
    };

    const handleSelect = async (address) => {

        try {
            const res = await geocodeByAddress(address);
            const latLng = await getLatLng(res[0]);
            latLong(latLng);
            setMapDetails((prevState) => ({ ...prevState, latLng, placeId: res[0].place_id }));
        }
        catch (error) {
            console.log(error)
        }
    };

    const getLatLongsFromDragger = (latLng) => {
        latLong(latLng);
    }

    useEffect(() => {
        console.log('=======>', mapDetails);
    }, [mapDetails])

    return (
        <>
            <PlacesAutocomplete
                value={address}
                onChange={handleChange}
                onSelect={handleSelect}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <div className="row mb-5">
                            <div className='col-12'>
                        <label className="locateLabel mt-3 mb-3">Locate Your Project on the Map</label>
                        <input
                            {...getInputProps({
                                placeholder: 'Enter Project Name/Loaction',
                                className: 'form-control',
                            })}
                        />
                        </div>
                        
                        </div>
                        <div className="autocomplete-dropdown-container mt-3">
                            {loading && <div>Loading...</div>}
                            {suggestions.map(suggestion => {
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                // inline style for demonstration purpose
                                const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer', padding: '10px 16px', fontSize: '14px' }
                                    : { backgroundColor: '#ffffff', cursor: 'pointer', padding: '10px 16px', fontSize: '14px' }
                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style,
                                        })}
                                    >
                                        <span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete >

            {mapDetails.latLng &&
                < div className="mb-3">
                    <div className="form-floating">
                        <GoogleMapComponent latilongs={getLatLongsFromDragger} data={mapDetails} />
                    </div>
                </div >
            }
        </>

    )
}

export default AutoComplete


