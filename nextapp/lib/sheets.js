import { google } from "googleapis";

export async function getOrdersList() {
  try {
    const target = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      null,
      (process.env.GOOGLE_SHEETS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      target
    );

    console.log(process.env.GOOGLE_SHEETS_CLIENT_EMAIL);

    const sheets = google.sheets({ version: "v4", auth: jwt });
    const ordersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Orders", // sheet name
    });

    const targetResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Targets", // sheet name
    });

    const orderRows = ordersResponse.data.values;
    const targetRows = targetResponse.data.values;
    if (orderRows.length && targetRows.length) {
      return {
        orders: orderRows
          .map((order) => {
            return {
              orderNumber: order[0],
              orderDate: order[1],
              orderProduct: order[2],
              orderVolume: order[3],
            };
          })
          .slice(1),
        targets: targetRows
          .map((target) => {
            return {
              targetMonth: target[0],
              targetValue: target[1],
            };
          })
          .slice(1),
      };
    }
  } catch (err) {
    console.log(err);
  }
  return [];
}
