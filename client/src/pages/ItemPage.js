import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { Button, Form, Input, message, Modal, Select, Table } from "antd";
import axios from "axios";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ItemPage = () => {
  const [itemData, setItemData] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [allCategory, setAllCategory] = useState([]);

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/categories/get-categories");
      setAllCategory(data.Categories);
      console.log(data.Categories);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllItems = async () => {
    try {
      const { data } = await axios.get("/api/items/get-items");
      setItemData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllItems();
    getAllCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/items/delete-item/${id}`);
      console.log(data?.message);
      getAllItems();
    } catch (error) {
      console.log(error);
    }
  };
  //Table data
  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Image",
      dataIndex: "image",
      render: (id, record) => (
        <img
          src={`/api/items/item-image/${record._id}`}
          alt={record.name}
          height="60"
          width="60"
        />
      ),
    },
    { title: "Price", dataIndex: "price" },

    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EditOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setEditItem(record);
              setPopupModal(true);
            }}
          />
          <DeleteOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              handleDelete(id);
            }}
          />
        </div>
      ),
    },
  ];
  const handleSubmit = async (value) => {
    if (editItem === null) {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("image", image);
      try {
        const res = await axios.post("/api/items/add-item", productData);
        setPopupModal(false);
        getAllItems();
        message.success("added successfully");
        console.log("added successfully");
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log(value);
      const newProductData = new FormData();
      newProductData.append("name", value.name);
      newProductData.append("price", value.price);
      newProductData.append("category", value.category);
      image && newProductData.append("image", image);
      try {
        const { data } = await axios.put(
          `/api/items/edit-item/${editItem._id}`,
          newProductData
        );
        setPopupModal(false);
        setEditItem(null);
        getAllItems();
        message.success(data.message);
        console.log("updated successfully");
      } catch (error) {
        console.log(error);
      }
    }
  };

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
      <Table columns={columns} dataSource={itemData} bordered />
      {popupModal && (
        <Modal
          title={`${editItem !== null ? "Edit Item" : "Add Item"}`}
          open={popupModal}
          footer={false}
          onCancel={() => {
            setEditItem(null);
            setImage();
            setPopupModal(false);
          }}
        >
          <Form
            layout="vertical"
            initialValues={editItem}
            onFinish={handleSubmit}
          >
            <Form.Item name="name" label="Name">
              <Input
                type="text"
                value={name}
                placeholder="write a name"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Item>
            <Form.Item name="price" label="Price">
              <Input
                type="text"
                value={price}
                placeholder="write a price"
                className="form-control"
                onChange={(e) => setPrice(e.target.value)}
              />
            </Form.Item>
            <Form.Item name="category" label="Category">
              <Select
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                }}
              >
                {allCategory.map((c) => {
                  return (
                    <>
                      <Select.Option value={c.name} key={c._id}>
                        {c.name}
                      </Select.Option>
                    </>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item name="image" label="Image">
              {image ? (
                <div className="text-center">
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  <img
                    src={URL.createObjectURL(image)}
                    alt="product_photo"
                    height={"120px"}
                    className="img img-responsive"
                  />
                </div>
              ) : editItem ? (
                <div className="text-center">
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                  <img
                    src={`/api/items/item-image/${editItem._id}`}
                    alt="product_photo"
                    height={"120px"}
                    className="img img-responsive"
                  />
                </div>
              ) : (
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              )}
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

export default ItemPage;
