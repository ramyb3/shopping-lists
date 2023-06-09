import { useEffect, useState } from "react";
import History from "./history";
import { Product } from "@/models/model";
import AddProducts from "./add-products";
import RealTimeList from "./real-time-list";
import { fetchData } from "@/utils/functions";

export default function List({ email }: { email: string }) {
  const [list, setList] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [collectedProducts, setCollectedProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyList, setHistoryList] = useState(false);
  const [chooseList, setChooseList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(true);
  const [firstTimeUser, setFirstTimeUser] = useState(false);
  const [historyProducts, setHistoryProducts] = useState<Product[]>([]);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);

      try {
        const resp = await fetchData(email, "getproducts");

        setList(resp.data.realTimeList.length > 0 ? true : false);
        setFirstTimeUser(resp.data?.firstTimeUser);
        setProducts(resp.data.realTimeList);
        setCollectedProducts(resp.data.collectedProducts);
        setHistoryList(resp.data.lists.length > 0 ? true : false);
      } catch (e: any) {
        console.error(e);
      }

      setLoading(false);
      setRefresh(false);
    };

    if (refresh) {
      getProducts();
    }
  }, [refresh]);

  return (
    <div className={`mt-14 ${showHistory ? "" : "flex justify-center"}`}>
      {showHistory ? (
        <History
          email={email}
          chooseList={chooseList}
          setChooseList={setChooseList}
          setShowHistory={setShowHistory}
          setOpen={setOpen}
          setHistoryProducts={setHistoryProducts}
        />
      ) : !list ? (
        <div className="flex flex-col gap-5 mt-[20%]">
          <button
            onClick={() => {
              if (products.length === 0) {
                setOpen(true);
              } else {
                setList(true);
              }
            }}
          >
            הוסף רשימה
          </button>
          {historyList && (
            <button
              onClick={() => {
                setChooseList(true);
                setShowHistory(true);
              }}
            >
              הוסף רשימה מההיסטוריה
            </button>
          )}
        </div>
      ) : (
        <RealTimeList
          setOpen={setOpen}
          setProducts={setProducts}
          setList={setList}
          setRefresh={setRefresh}
          setCollectedProducts={setCollectedProducts}
          setLoading={setLoading}
          products={products}
          collectedProducts={collectedProducts}
          email={email}
          loading={loading}
          firstTimeUser={firstTimeUser}
        />
      )}

      <AddProducts
        setOpen={setOpen}
        setProducts={setProducts}
        setList={setList}
        setChooseList={setChooseList}
        open={open}
        products={products}
        email={email}
        historyProducts={historyProducts}
      />

      <div className="absolute top-3 right-3">
        <button
          className="text-sm bg-[#9f58a5]"
          onClick={() => setShowHistory(!showHistory)}
        >
          {!showHistory ? "היסטוריית קניות" : "חזרה לרשימה"}
        </button>
      </div>
    </div>
  );
}
