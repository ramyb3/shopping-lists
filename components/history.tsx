import { List } from "@/models/model";
import { fetchData, removeDuplicates } from "@/utils/functions";
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
  const [listsIndex, setListsIndex] = useState<number[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getHistory = async () => {
      setLoading(true);

      try {
        const resp = await fetchData(email, "gethistory");

        setData(resp.data.reverse());
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

  const loadLists = () => {
    if (listsIndex.length === 0) {
      alert("אנא בחר רשימה אחת לפחות!");
      return;
    } else {
      const arr = [];

      for (let i = 0; i < listsIndex.length; i++) {
        arr.push(data[listsIndex[i]].products);
      }

      setHistoryProducts(removeDuplicates(arr.flat(2)));
      setShowHistory(false);
      setOpen(true);
      setChooseList(false);
    }
  };

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

      {chooseList && (
        <div className="flex justify-center mb-3">
          <button onClick={loadLists}>הוסף רשימות</button>
        </div>
      )}

      <div className="flex justify-around flex-wrap gap-3 p-1">
        {(searchProduct !== "" && !chooseList ? searchData : data).map(
          (obj, index) => {
            return (
              <div
                className={`flex flex-col h-[250px] w-[300px] gap-2 rounded-lg border-2 border-black ${
                  chooseList ? "cursor-pointer" : ""
                } 
              ${chooseList && listsIndex.includes(index) ? "bg-cyan-200" : ""}`}
                key={index}
                onClick={() => {
                  if (chooseList) {
                    if (listsIndex.includes(index)) {
                      setListsIndex(
                        listsIndex.filter((item) => item !== index)
                      );
                    } else {
                      setListsIndex([...listsIndex, index]);
                    }
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
          }
        )}
      </div>
    </>
  );
}
