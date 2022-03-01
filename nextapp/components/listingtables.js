import React from "react";
import { Row, Col, Table, ProgressBar } from "react-bootstrap";

const ListingTable = ({ state }) => {
  return (
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
              {state?.top5Orders?.map((order, index) => (
                <tr key={`Current order -${index}`} className="body-row">
                  <td width={"25%"}>{order.orderProduct?.slice(0, 15)}</td>
                  <td width={"60%"}>
                    <ProgressBar
                      now={order.formattedVolume}
                      max={state?.currentOrdersTotal}
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
  );
};

export default ListingTable;
