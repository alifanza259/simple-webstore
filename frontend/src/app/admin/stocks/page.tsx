import StockForm from "./stockForm";

type StockLog = {
  logId: number;
  productName: string;
  changes: number;
  transactionDate: number;
  activity: string;
};

export default async function AdminStocks() {
  const response = await fetch(`http://localhost:3001/stock-logs`);
  const logs: StockLog[] = (await response.json()).data;

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h1 className="pb-6">Stock Management</h1>
      <br />
      <StockForm />

      <div>
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Product
              </th>
              <th scope="col" className="px-6 py-3">
                Activity
              </th>
              <th scope="col" className="px-6 py-3">
                Delta
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l: StockLog) => (
              <tr
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                key={l.logId}
              >
                <td className="px-6 py-4">{l.productName}</td>
                <td className="px-6 py-4">{l.activity}</td>
                <td className="px-6 py-4">{l.changes}</td>
                <td className="px-6 py-4">{l.transactionDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
