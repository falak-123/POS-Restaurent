import React, { useEffect, useState } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { Row, Col, Button } from "antd";
import ItemList from "../components/ItemList";

const HomePage = () => {
  const [itemData, setItemData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("drinks");
  const [reset, setReset] = useState(true);
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
  useEffect(() => {
    getAllCategories();
  }, []);

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
  }, []);

  return (
    <DefaultLayout>
      <div className="d-flex ">
        {allCategory.map((c) => (
          <div
            key={c.name}
            className={`d-flex category ${
              selectedCategory === c.name &&
              reset === false &&
              "category-active"
            }`}
            onClick={() => {
              setSelectedCategory(c.name);
              setReset(false);
            }}
          >
            <h4>{c.name}</h4>
          </div>
        ))}
        <div className="reset-btn">
          <h1></h1>
          <Button
            type="primary"
            onClick={() => {
              setReset(true);
            }}
          >
            Show All Items
          </Button>
        </div>
      </div>

      <Row>
        {reset ? (
          <>
            {itemData.map((item) => {
              return (
                <Col xs={24} lg={6} md={12} sm={6}>
                  <ItemList key={item.name} item={item} />
                </Col>
              );
            })}
          </>
        ) : (
          <>
            {itemData
              .filter((i) => i.category === selectedCategory)
              .map((item) => {
                return (
                  <Col xs={24} lg={6} md={12} sm={6}>
                    <ItemList key={item.name} item={item} />
                  </Col>
                );
              })}
          </>
        )}
      </Row>
    </DefaultLayout>
  );
};

export default HomePage;
