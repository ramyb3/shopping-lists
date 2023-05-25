import { useEffect, useState } from "react";
import History from "./history";
import { Product } from "@/models/model";
import AddProducts from "./add-products";
import RealTimeList from "./real-time-list";
import { fetchData } from "@/utils/functions";

export default function List({ email }: { email: string }) {
  const [list, setList] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);

      try {
        const resp = await fetchData(email, "getproducts");

        setList(resp.data.length > 0 ? true : false);
        setProducts(resp.data);
      } catch (e: any) {
        console.error(e);
      }

      setLoading(false);
    };

    getProducts();
  }, []);

  return (
    <div
      className={`flex mt-14 ${
        showHistory ? "justify-around flex-wrap gap-3 p-1" : "justify-center"
      }`}
    >
      {showHistory ? (
        <History email={email} />
      ) : !list ? (
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
      ) : (
        <RealTimeList
          setOpen={setOpen}
          setProducts={setProducts}
          setList={setList}
          products={products}
          email={email}
        />
      )}

      <AddProducts
        setOpen={setOpen}
        setProducts={setProducts}
        setList={setList}
        open={open}
        products={products}
        email={email}
      />

      <div className="absolute top-3 right-3">
        <button
          className="text-sm"
          onClick={() => setShowHistory(!showHistory)}
        >
          {!showHistory ? "היסטוריית קניות" : "חזרה לרשימה"}
        </button>
      </div>

      {loading && <h3>טוען...</h3>}
    </div>
  );
}
