import React from "react";
import { Row, Col } from "react-bootstrap";

const TitleBar = ({ timerValue, currentTargetMonth, handleMonthChange }) => {
  return (
    <Row className="justify-content-between align-items-center p-4 my-2">
      <Col
        xs={{ span: 12, order: 1 }}
        md={{ span: 6, order: 2 }}
        className="d-flex justify-content-start justify-content-md-end z-2"
      >
        <p className="fw-light text-c4">Refresh In</p>
        <p className="fw-bold timer-text ps-1">{timerValue}</p>
      </Col>
      <Col xs={{ span: 12, order: 2 }} md={{ span: 6, order: 1 }}>
        <p className="font-source">Order Dashboard</p>
        <div className="d-flex align-items-center">
          <h3 className="fw-bold target-month">{currentTargetMonth}</h3>
          <div className="d-flex">
            <div
              onClick={() => handleMonthChange(-1)}
              className="c-p month-select text-center mx-2"
            >
              &#8249;
            </div>
            <div
              onClick={() => handleMonthChange(1)}
              className="c-p month-select text-center mx-2"
            >
              &#8250;
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default TitleBar;
