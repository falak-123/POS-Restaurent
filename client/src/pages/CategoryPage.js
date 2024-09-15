import { Button, Form, Modal, Input, message, Table } from "antd";
import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CategoryPage = () => {
  const [categoryName, setCategoryName] = useState();
  const [allCategory, setAllCategory] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [popupModal, setPopupModal] = useState(false);

  const handleSubmit = async (value) => {
    if (editCategory === null) {
      try {
        const { data } = await axios.post(
          "/api/categories/create-category",
          value
        );
        getAllCategories();
        setPopupModal(false);
        console.log(data.message);
        if (data.success) {
          message.success(data.message);
        } else {
          message.error(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const { data } = await axios.put(
          `/api/categories/update-category/${editCategory._id}`,
          { name: value.name }
        );
        getAllCategories();
        setPopupModal(false);
        setEditCategory(null);

        console.log(data.message);
        if (data.success) {
          message.success(data.message);
        } else {
          message.error(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/categories/get-categories");
      setAllCategory(data.Categories);
      console.log(data.Categories);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(
        `/api/categories/delete-category/${id}`
      );
      getAllCategories();
      console.log(data.message);
      if (data.success) {
        message.success(data.message);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },

    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEditCategory(record);
              setPopupModal(true);
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleDelete(record._id);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Item List</h1>
        <Button
          type="primary"
          onClick={() => {
            setPopupModal(true);
          }}
        >
          Add Item
        </Button>
      </div>

      <Table columns={columns} dataSource={allCategory} bordered />

      {popupModal && (
        <Modal
          title={`${editCategory !== null ? "Edit Category" : "Add Category"}`}
          open={popupModal}
          footer={false}
          onCancel={() => {
            setEditCategory(null);
            setPopupModal(false);
          }}
        >
          <Form
            layout="vertical"
            initialValues={editCategory}
            onFinish={handleSubmit}
          >
            <Form.Item name="name" label="Name">
              <Input
                type="text"
                value={categoryName}
                placeholder="write a Category name"
                className="form-control"
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </Form.Item>

            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                SAVE
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </DefaultLayout>
  );
};

export default CategoryPage;
