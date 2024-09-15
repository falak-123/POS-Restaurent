import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { useCart } from "../context/cart";
import { Button, Form, Modal, Input, Select, Table, message } from "antd";
import {
  MinusCircleOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CartPage = () => {
  const [cart, setCart] = useCart();
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);
  const navigate = useNavigate();

  //table data
  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img
          src={`/api/items/item-image/${record._id}`}
          alt={record.name}
          height="60"
          width="60"
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (id, record) => <b>{record.price * record.quantity}</b>,
    },
    {
      title: "Quantity",
      dataIndex: "qty",
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleIncrement(record._id, record.quantity + 1)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleDecrement(record._id, record.quantity - 1)}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
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

  const handleDelete = (pid) => {
    try {
      let myCart = [...cart];
      const index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cartitems", JSON.stringify(myCart));
    } catch (e) {
      console.log(e);
    }
  };
  const handleIncrement = (pid, updateQuantity) => {
    try {
      let myCart = [...cart];
      let cartWithUpdatedProduct = myCart.map((product) =>
        product._id === pid ? { ...product, quantity: updateQuantity } : product
      );
      setCart(cartWithUpdatedProduct);
      localStorage.setItem("cartitems", JSON.stringify(cartWithUpdatedProduct));
    } catch (error) {
      console.log(error);
    }
  };
  const handleDecrement = (pid, updateQuantity) => {
    try {
      let myCart = [...cart];
      let cartWithUpdatedProduct = myCart.map((product) =>
        product._id === pid && product.quantity !== 1
          ? { ...product, quantity: updateQuantity }
          : product
      );
      setCart(cartWithUpdatedProduct);
      localStorage.setItem("cartitems", JSON.stringify(cartWithUpdatedProduct));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let temp = 0;
    cart.forEach((item) => (temp = temp + item.price * item.quantity));
    setSubTotal(temp);
  }, [cart]);

  const handleSubmit = async (value) => {
    try {
      const newObject = {
        ...value,
        cart,
        subTotal,
        tax: Number(((subTotal / 100) * 0).toFixed(2)),
        totalAmount: Number(
          Number(subTotal) + Number(((subTotal / 100) * 0).toFixed(2))
        ),
        userId: JSON.parse(localStorage.getItem("auth")).user._id,
      };
      // console.log(newObject);
      await axios.post("/api/bills/add-bills", newObject);
      localStorage.removeItem("cartitems");
      setCart([]);
      message.success("Bill Generated");
      navigate("/bills");
    } catch (error) {
      message.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <DefaultLayout>
      <Table columns={columns} dataSource={cart} bordered />
      <div className="d-flex flex-column align-items-end">
        <hr />
        <h3>
          SUBT TOTAL : $ <b> {subTotal}</b> /-{" "}
        </h3>
        <Button type="primary" onClick={() => setBillPopup(true)}>
          Create Invoice
        </Button>
      </div>
      <Modal
        title="Create Invoice"
        open={billPopup}
        onCancel={() => setBillPopup(false)}
        footer={false}
      >
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="customerName" label="Customer Name">
            <Input />
          </Form.Item>
          <Form.Item name="customerNumber" label="Contact Number">
            <Input />
          </Form.Item>

          <Form.Item name="paymentMode" label="Payment Method">
            <Select>
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="card">Card</Select.Option>
            </Select>
          </Form.Item>
          <div className="bill-it">
            <h5>
              Sub Total : <b>{subTotal}</b>
            </h5>
            <h4>
              TAX
              <b> {((subTotal / 100) * 0).toFixed(2)}</b>
            </h4>
            <h3>
              GRAND TOTAL =
              <b style={{ color: "green" }}>
                {Number(subTotal) + Number(((subTotal / 100) * 0).toFixed(2))}
              </b>
            </h3>
          </div>
          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit">
              Generate Bill
            </Button>
          </div>
        </Form>
      </Modal>
    </DefaultLayout>
  );
};

export default CartPage;
