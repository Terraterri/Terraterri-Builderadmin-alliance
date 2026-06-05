import React, { useState, useEffect, useContext } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ProjectName from './ProjectName';

const Modalpopup = ({onHide}) => {
  const [show, setShow] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [bulders, setBuilders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { ipInfo } = useContext(IpInfoContext);
  const [form, setForm] = useState({});
  const [formErr, setFormErr] = useState({});

  //hanndle Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //validation
  const validateBuilders = () => {
    let errors = {};
    let isFormValid = true;
    console.log(form)
    if (!form.name) {
      isFormValid = false;
      errors.name = 'Please Enter Builder Name';
    }
    if (!form.headoffice_location) {
      isFormValid = false;
      errors.headoffice_location = 'Please Enter Location';
    }
    if (!form.md_name) {
      isFormValid = false;
      errors.md_name = 'Please Enter MD Name';
    }
    if (!form.md_phone_number) {
      isFormValid = false;
      errors.md_phone_number = 'Enter Phone Number';
    }
    if (!form.cp_manager_name) {
      isFormValid = false;
      errors.cp_manager_name = 'Please Enter CP Name';
    }
    if (!form.cp_manager_phone_number) {
      isFormValid = false;
      errors.cp_manager_phone_number = 'Enter Phone Number';
    }
    if (!form.sales_manager_name) {
      isFormValid = false;
      errors.sales_manager_name = 'Please Enter Sale Manager Name';
    }
    if (!form.sales_manager_phone_number) {
      isFormValid = false;
      errors.sales_manager_phone_number = ' Enter Phone Number';
    }
    
    if (!form.logo_path) {
      isFormValid = false;
      errors.logo_path = 'Please Choose Logo';
    }
    setFormErr(errors);
    return isFormValid;
  };

  //handle Submit
  const handleSubmitBuilderForm = async () => {
    if (validateBuilders()) {
      try {
        setLoading(true);
        const res = await masterClient.post('builder', form);
        if (res?.data?.status) {
          toastSuccess(res?.data?.message);
          setForm({});
          setFormErr({});
          setShow(false);
          getBuilders();
        }
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.type === 'Validation error' && error?.response?.data?.data) {
          setFormErr(error?.response?.data?.data);
        } else {
          toastError(error?.response?.data?.message);
        }
      } finally {
        setLoading(false);
      }
    } else {
      toastWarning('Please fill Mandetory Fields');
    }
  };

  //get Builders
  const getBuilders = async () => {
    setLoading(true);
    try {
      const res = await masterClient.get('builder');
      console.log('Get Builders====', res);
      if (res?.data?.status) {
        setBuilders(res?.data?.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  //delete Builder
  const deleteBuilder = async (bId) => {
    setLoading(true);
    try {
      const res = await masterClient.delete(`builder/${bId}`);
      if (res?.data?.status) {
        toastSuccess(res?.data?.message);
        getBuilders();
      }
    } catch (err) {
      toastError(err);
    } finally {
      setLoading(false);
    }
  };



  // Edit Builder
  const handleEditBuilder = (builderData) => {
    setShow(true);
    setForm({ ...builderData });
  }

  useEffect(() => {
    getBuilders();
  }, []);
  return (
    <div>
       <Modal show={props.show} onHide={props.close} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Add New Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
    
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.close}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitBuilderForm}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Modalpopup
