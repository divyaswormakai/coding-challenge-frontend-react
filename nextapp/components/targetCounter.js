import React from "react";
import { Row } from "react-bootstrap";

import { convertToCurrencyText } from "../utils/helper";

const TargetCounter = ({ value }) => {
  return (
    <Row className="px-4 my-5">
      <p className="fs-150 font-roboto fw-bold text-wrap word-break">
        {convertToCurrencyText(value)}
      </p>
    </Row>
  );
};

export default React.memo(TargetCounter);
