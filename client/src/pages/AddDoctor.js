
import { Button, Col, Form, Input, Row, TimePicker } from "antd";

import React,{ useState } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DoctorForm from "../components/DoctorForm";
import applyDoctorForm from "../components/applydoctorform";
import moment from "moment";

function AddDoctor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const handleSubmit = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/add-doctor",
        {
          ...values,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/"); // Redirect to home or wherever you want
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <h1 className="page-title">Add Doctor</h1>
      <hr />
      <DoctorForm onFinish={handleSubmit} />
    </Layout>
  );
}
  
export default AddDoctor;
  
