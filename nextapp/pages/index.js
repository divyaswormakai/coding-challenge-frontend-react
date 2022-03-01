import React, { useEffect, useState } from "react";
import { Row, Col, ProgressBar, Table } from "react-bootstrap";
import dayjs from "dayjs";
import Image from "next/image";

import { convertToNumber } from "../utils/helper";
import topRightImage from "../assets/top-right.svg";
import Spinner from "../components/spinner";

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
          dayjs(order.orderDate, "DD.MM.YYYY").format("MMMM") ===
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
  }, [selectedMonthIndex, state.name, state.orders]);

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
    <div className="bg-black min-vh-100 min-vw-100 text-white position-relative ">
      <div className="position-absolute top-right-image">
        <Image src={topRightImage} height={700} width={700} />
      </div>
      {state?.name === "loading" && (
        <div className="min-vh-100  h-100 d-flex justify-content-center align-items-center">
          <Spinner />
        </div>
      )}
      {state?.name === "complete" && (
        <div className=" min-vh-100  h-100 d-flex flex-column">
          <Row className="justify-content-between align-items-center p-4 my-2">
            <Col
              xs={{ span: 12, order: 1 }}
              md={{ span: 6, order: 2 }}
              className="d-flex justify-content-start justify-content-md-end z-2"
            >
              <p className="fw-light text-c4">Refresh In</p>
              <p className="fw-bold timer-text ps-1">{timer}</p>
            </Col>
            <Col xs={{ span: 12, order: 2 }} md={{ span: 6, order: 1 }}>
              <p className="font-source">Order Dashboard</p>
              <div className="d-flex align-items-center">
                <h3 className="fw-bold target-month">
                  {state?.targets[selectedMonthIndex]?.targetMonth}
                </h3>
                <div className="d-flex">
                  <div
                    onClick={() =>
                      setSelectedMonthIndex((previous) =>
                        Math.max(0, previous - 1)
                      )
                    }
                    className="c-p month-select text-center mx-2"
                  >
                    &#8249;
                  </div>
                  <div
                    onClick={() =>
                      setSelectedMonthIndex((previous) =>
                        Math.min(state?.targets?.length - 1, previous + 1)
                      )
                    }
                    className="c-p month-select text-center mx-2"
                  >
                    &#8250;
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="px-4 my-5">
            <p className="fs-150 font-roboto fw-bold text-wrap word-break">
              {convertToNumber(state?.targets[selectedMonthIndex]?.targetValue)}{" "}
              €
            </p>
          </Row>
          <Row className="px-4 my-4">
            <div className="z-2 position-relative">
              <ProgressBar
                now={60}
                max={120}
                className="target-bar"
                style={{ backgroundColor: "#2f2f2f" }}
              />
              <div
                className="position-absolute d-flex flex-column align-items-center"
                style={{
                  zIndex: 4,
                  left: "80%",
                  top: "-75%",
                }}
              >
                <p className="mb-0">
                  {state?.targets[selectedMonthIndex]?.targetValue}
                </p>
                <div
                  style={{
                    height: 60,
                    width: 3,
                    background: "white",
                  }}
                />
              </div>
            </div>
          </Row>
          <Row className="my-4 ">
            <Col xs={12} md={5}>
              <div className="text-white p-2 ps-md-4 stat-card">
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
                      <th colSpan={3}>Top 5 Products</th>
                    </tr>
                    <tr></tr>
                  </thead>
                  <tbody>
                    {state?.currentOrders?.map((order, index) => (
                      <tr key={`Current order -${index}`} className="body-row">
                        <td width={"25%"}>
                          {order.orderProduct?.slice(0, 15)}
                        </td>
                        <td width={"60%"}>
                          <ProgressBar
                            now={60}
                            max={100}
                            style={{
                              backgroundColor: "transparent",
                              marginTop: 3,
                            }}
                          />
                        </td>
                        <td width={"15%"}>{order.orderVolume}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
