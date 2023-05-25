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

  useEffect(() => {
    const getProducts = async () => {
      try {
        const resp = await fetchData(email, "getproducts");

        setList(resp.data.length > 0 ? true : false);
        setProducts(resp.data);
      } catch (e: any) {
        console.error(e);
      }
    };

    getProducts();
  }, []);

  return (
    <div className="flex justify-center mt-14">
      {!list ? (
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
      <History />
    </div>
  );
}
