import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import styles from "./styles/Explore.module.scss";

export const Accounts = () => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <div style={{ margin: "3em" }}>
          <Row xs={1} sm={2} md={3} lg={3} xl={4} xxl={4} className="g-4">
            {Array.from({ length: 20 }).map((_, idx) => (
              <div className={styles.exploreCard} key={idx}>
                <Col style={{ cursor: "pointer" }}>
                  <Card>
                    <Card.Img
                      variant="top"
                      src="https://gateway.pinata.cloud/ipfs/QmYvX3kBV3wAoc4Bei4KKLMcKxtvbx1CR2AAy9LAxKT5z8"
                    />
                    <Card.Body>
                      <Card.Title>Card title</Card.Title>
                      <Card.Text>
                        This is a longer card with supporting text below as a
                        natural lead-in to additional content. This content is a
                        little bit longer.
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </div>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};
