import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Row, Col, Button, ProgressBar, Card, Table } from "react-bootstrap";
import dayjs from "dayjs";
import { convertToNumber } from "../utils/helper";
export default function Home() {
  const [state, setState] = useState({
    name: "loading",
    orders: [],
    targets: [],
    currentOrders: [],
    top5Orders: [],
    currentOrdersTotal: 0,
    selectedTarget: {},
  });
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(-1);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    getSheetsData();
    setSelectedMonthIndex(0);
    const interval = setInterval(() => {
      setTimer((previous) => {
        if (previous <= 0) {
          getSheetsData();
          return 60;
        }
        return previous - 1;
      });
    }, 1000); // Refresh every 1 second
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (selectedMonthIndex !== -1 && state.name === "complete") {
      const filteredOrders = state.orders.filter(
        (order) =>
          dayjs(order.orderDate).format("MMMM") ===
          state?.targets[selectedMonthIndex]?.targetMonth
      );
      setState((previous) => {
        return {
          ...previous,
          currentOrders: filteredOrders,
          top5Orders: filteredOrders.slice(0, 5),
        };
      });
    }
  }, [selectedMonthIndex, state.name]);

  const getSheetsData = async () => {
    setState((previous) => {
      return {
        ...previous,
        name: "loading",
      };
    });
    const response = await fetch("/api/sheets");
    if (response && response.ok) {
      const json = await response.json();
      const { orders, targets } = json.data;
      setState({
        name: "complete",
        orders,
        targets,
      });
    } else {
      setState({
        name: "error",
        orders: [],
        targets: [],
      });
    }
  };

  return (
    <div className="bg-black min-vh-100 min-vw-100 text-white ">
      <div className=" min-vh-100  h-100 d-flex flex-column ">
        <Row className="justify-content-between align-items-center p-4 my-2">
          <Col
            xs={{ span: 12, order: 1 }}
            md={{ span: 6, order: 2 }}
            className="d-flex justify-content-end"
          >
            <p className="fw-light text-c4">Refresh In</p>
            <p className="fw-bold timer-text ps-1">{timer}</p>
          </Col>
          <Col xs={{ span: 12, order: 2 }} md={{ span: 6, order: 1 }}>
            <p className="font-source">Order Dashboard</p>
            <div className="d-flex align-items-center">
              <h3 className="fw-bold">
                {state?.targets[selectedMonthIndex]?.targetMonth}
              </h3>
              <div className="d-flex">
                <div
                  onClick={() =>
                    setSelectedMonthIndex((previous) =>
                      Math.max(0, previous - 1)
                    )
                  }
                  className="c-p"
                >
                  Left
                </div>
                <div
                  onClick={() =>
                    setSelectedMonthIndex((previous) =>
                      Math.min(state?.targets?.length - 1, previous + 1)
                    )
                  }
                  className="c-p"
                >
                  Right
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="px-4 my-5">
          <p className="fs-150 font-roboto fw-bold text-wrap word-break">
            {convertToNumber(state?.targets[selectedMonthIndex]?.targetValue)} €
          </p>
        </Row>
        <Row className="px-4 my-4">
          <div>
            <ProgressBar now={80} max={120} className="target-bar" />
          </div>
        </Row>
        <Row className="my-4 ">
          <Col xs={12} md={5}>
            <div className="text-white p-2 stat-card">
              <Table responsive className="text-white">
                <thead className="header-row">
                  <tr>
                    <th>NR</th>
                    <th>Date</th>
                    <th>Product Name</th>
                    <th>Order Volume</th>
                  </tr>
                  <tr></tr>
                </thead>
                <tbody>
                  {state?.currentOrders?.map((order, index) => (
                    <tr key={`Current order -${index}`} className="body-row">
                      <td>{order.orderNumber}</td>
                      <td>{order.orderDate}</td>
                      <td>{order.orderProduct}</td>
                      <td>{order.orderVolume}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
          <Col xs={12} md={7}>
            <div className="text-white p-2 stat-card">
              <Table responsive className="text-white">
                <thead className="header-row">
                  <tr>
                    <th colSpan={2}>Top 5 Products</th>
                  </tr>
                  <tr></tr>
                </thead>
                <tbody>
                  {state?.currentOrders?.map((order, index) => (
                    <tr key={`Current order -${index}`} className="body-row">
                      <td width={"25%"}>{order.orderProduct?.slice(0, 15)}</td>
                      <td width={"75%"}>{order.orderVolume}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
