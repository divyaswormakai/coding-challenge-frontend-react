import { getOrdersList } from "../../lib/sheets";

export default async function fetchSheetsData(request, response) {
  const data = await getOrdersList();
  response.json({
    data,
  });
}
