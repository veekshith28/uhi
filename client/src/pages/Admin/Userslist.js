import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { Table, Button } from "antd";
import moment from "moment";

function Userslist() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);
  const handleRemoveUserByEmail = async (email) => {
    try {
      await axios.post(
        "/api/admin/remove-user-by-email",
        {
          email: email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Remove the deleted user from the local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.email !== email));
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text, record) => {
        const role = record.isAdmin
          ? "Admin"
          : record.isDoctor
          ? "Doctor"
          : "User";
        return role;
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (createdAt) => moment(createdAt).format("DD-MM-YYYY"),
    },
    
    {
      title: "Actions",
      dataIndex: "actions",
      render: (_, user) => (
        <Button onClick={() => handleRemoveUserByEmail(user.email)}>Block</Button>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="page-header">Users List</h1>
      <hr />
      <Table columns={columns} dataSource={users} />
    </Layout>
  );
}
export default Userslist;
