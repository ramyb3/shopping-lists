import { Product } from "@/models/model";
import { compareProductLists, fetchData } from "@/utils/functions";
import DND from "./dnd";
import { useEffect, useState } from "react";

export default function RealTimeList({
  setOpen,
  setProducts,
  setList,
  setRefresh,
  setLoading,
  setCollectedProducts,
  products,
  loading,
  email,
  collectedProducts,
  firstTimeUser,
}: {
  setOpen: any;
  setProducts: any;
  setList: any;
  setRefresh: any;
  setCollectedProducts: any;
  setLoading: any;
  products: Product[];
  email: string;
  loading: boolean;
  firstTimeUser: boolean;
  collectedProducts: Product[];
}) {
  const [finish, setFinish] = useState(false);

  useEffect(() => {
    const removeFirstTimeUser = async () => {
      try {
        await fetchData(email, "firsttimeuser");
      } catch (e: any) {
        console.error(e);
      }
    };

    if (firstTimeUser) {
      setTimeout(() => {
        alert('שים לב! ניתן לסדר את הפריטים ברשימה ע"י גרירה');
        removeFirstTimeUser();
      }, 1000);
    }
  }, []);

  const finishShopping = async () => {
    if (!finish) {
      alert("אנא לחץ על רענן רשימה כדי לוודא שלא התווספו פריטים");
      setFinish(true);
      return;
    }

    let realTimeList, products;

    setLoading(true);

    if (collectedProducts.length === 0) {
      alert("לא ליקטת מוצרים!");
      setLoading(false);
      return;
    } else {
      // in case of parallel finish
      try {
        const resp = await fetchData(email, "getproducts");

        realTimeList = resp.data.realTimeList;
        products = resp.data.collectedProducts;

        setProducts(realTimeList);
        setCollectedProducts(products);
        setList(false);

        if (realTimeList.length === 0) {
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error(e);
        return;
      }
    }

    try {
      await fetchData(
        email,
        "finishshopping",
        compareProductLists(realTimeList, products)
      );
    } catch (e) {
      console.error(e);
    }

    setProducts([]);
    setCollectedProducts([]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col sm:gap-6 gap-2 p-2 border-2 rounded-md border-black sm:min-w-[500px] w-[300px]">
      <button className="self-center text-sm" onClick={() => setRefresh(true)}>
        רענון רשימה
      </button>

      <div className="max-h-[320px] sm:max-h-[600px] overflow-y-auto">
        {loading && <h3>טוען...</h3>}

        <DND
          setProducts={setProducts}
          setList={setList}
          setCollectedProducts={setCollectedProducts}
          setLoading={setLoading}
          products={products}
          collectedProducts={collectedProducts}
          email={email}
        />
      </div>

      <div className="flex gap-3 justify-center">
        <button onClick={finishShopping}>סיום</button>
        <button onClick={() => setOpen(true)}>הוסף מוצרים</button>
      </div>
    </div>
  );
}
