import { Button, Card } from "antd";
import Meta from "antd/es/card/Meta";
import React from "react";
import { useCart } from "../context/cart";

const ItemList = ({ item }) => {
  const [cart, setCart] = useCart();

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

  const handleClick = () => {
    setCart([...cart, item]);
    localStorage.setItem("cartitems", JSON.stringify([...cart, item]));
  };
  return (
    <Card
      style={{
        width: 240,
        marginBottom: 20,
      }}
      cover={
        <img
          alt="example"
          src={`/api/items/item-image/${item._id}`}
          style={{ height: 240 }}
        />
      }
    >
      <Meta title={item.name} />
      <div className="item-button">
        {cart.some((p) => p._id === item._id) ? (
          <Button type="primary" danger onClick={() => handleDelete(item._id)}>
            Remove from Cart
          </Button>
        ) : (
          <>
            <Button onClick={handleClick}>Add to Cart</Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default ItemList;
