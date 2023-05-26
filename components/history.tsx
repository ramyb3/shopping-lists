import { List } from "@/models/model";
import { fetchData } from "@/utils/functions";
import { useEffect, useState } from "react";

export default function History({ email }: { email: string }) {
  const [data, setData] = useState<List[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getHistory = async () => {
      setLoading(true);

      try {
        const resp = await fetchData(email, "gethistory");

        setData(resp.data);
      } catch (e: any) {
        console.error(e);
      }

      setLoading(false);
    };

    getHistory();
  }, []);

  return (
    <>
      {loading && <h3>טוען...</h3>}

      {data.map((obj, index) => {
        return (
          <div
            className="flex flex-col h-[250px] w-[300px] gap-2 rounded-lg border-2 border-black"
            key={index}
          >
            <h1>{obj.date}</h1>
            <div className="text-center">
              מוצרים שנקנו: {obj.products.length}
            </div>

            <div className="overflow-y-auto">
              {obj.products.map((product, index1) => {
                return (
                  <div
                    className="flex justify-around gap-2 border-b-2 border-gray font-bold"
                    key={index1}
                  >
                    <div className="w-48">{product.name}</div>
                    <div>{product.quantity}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
