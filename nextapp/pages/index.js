import React, { useEffect, useState, useMemo } from "react";
import { Row, Col, ProgressBar, Table } from "react-bootstrap";
import dayjs from "dayjs";
import Image from "next/image";

import { convertToNumber, convertToCurrencyText } from "../utils/helper";
import topRightImage from "../assets/top-right.svg";
import Spinner from "../components/spinner";
import ListingTable from "../components/listingtables";
import TargetCounter from "../components/targetCounter";
import TargetProgress from "../components/target-progress";

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
      const filteredOrders = [];
      const totalValue = 0;
      for (const order of state.orders) {
        if (
          dayjs(order.formattedDate).format("MMMM") ===
          state?.targets[selectedMonthIndex]?.targetMonth
        ) {
          filteredOrders.push(order);
          totalValue += order.formattedVolume;
        }
      }

      setState((previous) => {
        return {
          ...previous,
          currentOrders: filteredOrders,
          top5Orders: filteredOrders
            .sort(
              (first, second) => second.formattedVolume - first.formattedVolume
            )
            .slice(0, 5),
          currentOrdersTotal: totalValue || 0,
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
        orders: orders?.map((order) => {
          return {
            ...order,
            formattedVolume: convertToNumber(order.orderVolume),
          };
        }),
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
          <TargetCounter value={state?.currentOrdersTotal} />
          <TargetProgress
            currentTotal={state?.currentOrdersTotal}
            targetValue={state?.targets[selectedMonthIndex]?.targetValue}
          />
          <ListingTable state={state} />
        </div>
      )}
    </div>
  );
}
