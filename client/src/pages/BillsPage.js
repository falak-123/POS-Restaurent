import React, { useEffect, useState, useRef } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { Modal, Button, Table, message, Drawer, Popconfirm } from "antd";
import "../styles/InvoiceStyles.css";
const BillsPage = () => {
  const componentRef = useRef();
  const [billsData, setBillsData] = useState([]);
  const [userProfile, setUserProfile] = useState([]);
  const [popupModal, setPopupModal] = useState(false);
  const [drawerToggle, setDrawerToggle] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const getAllBills = async () => {
    try {
      const { data } = await axios.get("/api/bills/get-bills");
      setBillsData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  //useEffect
  useEffect(() => {
    getAllBills();
    //eslint-disable-next-line
  }, []);
  //print function
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  //able data
  const columns = [
    {
      title: "User ID ",
      dataIndex: "userId",
      render: (id, record) => (
        <EyeOutlined
          style={{ cursor: "pointer" }}
          onClick={() => showProfile(record.userId)}
        />
      ),
    },

    {
      title: "Customer Name",
      dataIndex: "customerName",
    },
    { title: "Contact No", dataIndex: "customerNumber" },
    { title: "Subtotal", dataIndex: "subTotal" },
    { title: "Tax", dataIndex: "tax" },
    { title: "Total Amount", dataIndex: "totalAmount" },

    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <EyeOutlined
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedBill(record);
              setPopupModal(true);
            }}
          />

          <Popconfirm
            title="Delete the Bill"
            description="Are you sure to delete this bill?"
            onConfirm={() => {
              handleDelete(record._id);
            }}
            onCancel={handleCancel}
            okText="Yes"
            cancelText="No"
          >
            <DeleteOutlined style={{ cursor: "pointer" }} />
          </Popconfirm>
        </div>
      ),
    },
  ];
  const handleCancel = () => {
    console.log("cancel");
  };
  const handleDelete = async (id) => {
    try {
      const { data } = await axios.delete(`/api/bills/delete-bill/${id}`);

      getAllBills();
      if (data.success) {
        message.success(data.message);
      } else {
        message.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showProfile = async (id) => {
    try {
      const { data } = await axios.get(`/api/users/search-user/${id}`);
      setUserProfile(data.user);
      setDrawerToggle(true);
      console.log(data.user);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DefaultLayout>
      <div className="d-flex justify-content-between">
        <h1>Invoice list</h1>
      </div>

      <Table columns={columns} dataSource={billsData} bordered />

      {popupModal && (
        <Modal
          width={400}
          pagination={false}
          title="Invoice Details"
          open={popupModal}
          onCancel={() => {
            setPopupModal(false);
          }}
          footer={false}
        >
          {/* ============ invoice modal start ==============  */}
          <div id="invoice-POS" ref={componentRef}>
            <center id="top">
              <div className="logo" />
              <div className="info">
                <h2>Restaurant</h2>
                <p> Contact : 0123456789 | Mamunkanjan Fsd.</p>
              </div>
              {/*End Info*/}
            </center>
            {/*End InvoiceTop*/}
            <div id="mid">
              <div className="mt-2">
                <p>
                  Customer Name : <b>{selectedBill.customerName}</b>
                  <br />
                  Phone No : <b>{selectedBill.customerNumber}</b>
                  <br />
                  Date : <b>{selectedBill.date.toString().substring(0, 10)}</b>
                  <br />
                </p>
                <hr style={{ margin: "5px" }} />
              </div>
            </div>
            {/*End Invoice Mid*/}
            <div id="bot">
              <div id="table">
                <table>
                  <tbody>
                    <tr className="tabletitle">
                      <td className="item">
                        <h2>Item</h2>
                      </td>
                      <td className="Hours">
                        <h2>Qty</h2>
                      </td>
                      <td className="Rate">
                        <h2>Price</h2>
                      </td>
                      <td className="Rate">
                        <h2>Total</h2>
                      </td>
                    </tr>
                    {selectedBill.cart.map((item) => (
                      <>
                        <tr className="service">
                          <td className="tableitem">
                            <p className="itemtext">{item.name}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.quantity}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.price}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">
                              {item.quantity * item.price}
                            </p>
                          </td>
                        </tr>
                      </>
                    ))}

                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate">
                        <h2>tax</h2>
                      </td>
                      <td className="payment">
                        <h2>${selectedBill.tax}</h2>
                      </td>
                    </tr>
                    <tr className="tabletitle">
                      <td />
                      <td />
                      <td className="Rate">
                        <h2>Grand Total</h2>
                      </td>
                      <td className="payment">
                        <h2>
                          <b>${selectedBill.totalAmount}</b>
                        </h2>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/*End Table*/}
              <div id="legalcopy">
                <p className="legal">
                  <strong>Thank you for your order!</strong> 0% GST application
                  on total amount.Please note that this is non refundable
                  amount.
                  <b> help@mydomain.com</b>
                </p>
              </div>
            </div>
            {/*End InvoiceBot*/}
          </div>
          {/*End Invoice*/}
          <div className="d-flex justify-content-end mt-3">
            <Button type="primary" onClick={handlePrint}>
              Print
            </Button>
          </div>
          {/* ============ invoice modal ends ==============  */}
        </Modal>
      )}
      {setDrawerToggle && (
        <Drawer
          title="User Profile"
          onClose={() => {
            setDrawerToggle(false);
          }}
          open={drawerToggle}
        >
          <p>{userProfile.name}</p>
          <p></p>
        </Drawer>
      )}
    </DefaultLayout>
  );
};

export default BillsPage;
