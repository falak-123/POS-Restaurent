import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CopyOutlined,
  UserOutlined,
  LogoutOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  BorderOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import "../styles/DefaultLayout.css";
import { Layout, Menu } from "antd";
import { useCart } from "../context/cart";
const { Header, Sider, Content } = Layout;

const App = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [cart] = useCart();
  const navigate = useNavigate();
  const AdminUser = JSON.parse(localStorage.getItem("auth")).user.admin;

  const toggle = () => {
    setCollapsed(!collapsed);
  };
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <h1 className="text-center text-light font-wight-bold mt-4">POS</h1>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={window.location.pathname}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="/bills" icon={<CopyOutlined />}>
            <Link to="/bills">Bills</Link>
          </Menu.Item>

          {AdminUser ? (
            <Menu.Item key="/itempage" icon={<UnorderedListOutlined />}>
              <Link to="/itempage">Items</Link>
            </Menu.Item>
          ) : (
            <Menu.Item key="/itempage" hidden icon={<UnorderedListOutlined />}>
              <Link to="/itempage">Items</Link>
            </Menu.Item>
          )}

          <Menu.Item key="/categorypage" icon={<BorderOutlined />}>
            <Link to="/categorypage">Category</Link>
          </Menu.Item>
          <Menu.Item key="/customers" icon={<UserOutlined />}>
            <Link to="/customers">Cutomers</Link>
          </Menu.Item>
          <Menu.Item
            key="/logout"
            icon={<LogoutOutlined />}
            onClick={() => {
              localStorage.removeItem("auth");
              navigate("/login");
            }}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}
          <div className="cart-item d-flex " onClick={() => navigate("/cart")}>
            <p>{cart.length}</p>
            <ShoppingCartOutlined />
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;
