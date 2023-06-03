import { List } from "@/models/model";
import { fetchData } from "@/utils/functions";
import { useEffect, useState } from "react";

export default function History({
  email,
  chooseList,
  setChooseList,
  setShowHistory,
  setOpen,
  setHistoryProducts,
}: {
  email: string;
  chooseList: boolean;
  setChooseList: any;
  setShowHistory: any;
  setOpen: any;
  setHistoryProducts: any;
}) {
  const [data, setData] = useState<List[]>([]);
  const [searchData, setSearchData] = useState<List[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
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

  useEffect(() => {
    const newList = [];

    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].products.length; j++) {
        if (data[i].products[j].name.includes(searchProduct)) {
          newList.push(data[i]);
          break;
        }
      }
    }

    setSearchData(newList);
  }, [searchProduct]);

  return loading ? (
    <h3>טוען...</h3>
  ) : (
    <>
      <div className="flex justify-center mb-3">
        <input
          type="text"
          placeholder="חפש מוצר"
          onChange={(e) => setSearchProduct(e.target.value)}
        />
      </div>

      <div className="flex justify-around flex-wrap gap-3 p-1">
        {(searchProduct !== "" ? searchData : data).map((obj, index) => {
          return (
            <div
              className={`flex flex-col h-[250px] w-[300px] gap-2 rounded-lg border-2 border-black ${
                chooseList ? "cursor-pointer hover:bg-cyan-200" : ""
              }`}
              key={index}
              onClick={() => {
                if (chooseList) {
                  setHistoryProducts(obj.products);
                  setShowHistory(false);
                  setOpen(true);
                  setChooseList(false);
                }
              }}
            >
              <h1>{obj.date}</h1>
              <div className="text-center">
                מוצרים שנקנו: {obj.products.length}
              </div>

              <div className="overflow-y-auto">
                {obj.products.map((product, index1) => {
                  return (
                    <div
                      className={`flex justify-between px-2 border-b-2 border-gray font-bold ${
                        searchProduct !== "" &&
                        product.name.includes(searchProduct)
                          ? "bg-[#abd6b3]"
                          : ""
                      }`}
                      key={index1}
                    >
                      <div className="w-48">{product.name}</div>
                      <div>
                        {product.quantity} {product.unit}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
