import React from "react";
import { Row, ProgressBar } from "react-bootstrap";

const TargetProgress = ({ currentTotal, targetValue }) => {
  return (
    <Row className="px-4 my-4">
      <div className="z-2 position-relative">
        <ProgressBar
          now={(currentTotal / 120000) * 100}
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
          <p className="mb-0">{targetValue}</p>
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
  );
};

export default TargetProgress;
