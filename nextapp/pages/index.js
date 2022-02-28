import Head from "next/head";
import React, { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [state, setState] = useState({
    name: "loading",
    orders: [],
    targets: [],
  });

  useEffect(() => {
    getSheetsData();
    const interval = setInterval(() => {
      getSheetsData();
    }, 1000 * 60); // Refresh every 1 minute
    return () => {
      clearInterval(interval);
    };
  }, []);

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
    <div className={styles.container}>
      <Head>
        <title>Orders</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        Total Orders: {state.orders.length}
        Total Targets: {state.targets.length}
      </div>
    </div>
  );
}
