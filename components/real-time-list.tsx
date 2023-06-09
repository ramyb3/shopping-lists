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
    let realTimeList, products;

    setLoading(true);

    if (collectedProducts.length === 0) {
      alert("לא ליקטת מוצרים!");
      setLoading(false);
      return;
    } else {
      if (!finish) {
        alert("אנא לחץ על רענן רשימה כדי לוודא שלא התווספו פריטים");
        setFinish(true);
        setLoading(false);
        return;
      }

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
    setRefresh(true);
  };

  const saveOrder = async () => {
    setLoading(true);

    try {
      await fetchData(email, "reorderproducts", products);
    } catch (e: any) {
      console.error(e);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col sm:gap-6 gap-2 py-2 sm:px-2 px-0.5 border-2 rounded-md border-black sm:min-w-[500px] min-w-[98%]">
      <div className="flex gap-2 justify-center">
        <button
          className="text-sm bg-[#e9c8d0] rounded-sm"
          onClick={() => setRefresh(true)}
        >
          רענון רשימה
        </button>
        <button className="text-sm bg-[#e6cbaa] rounded-sm" onClick={saveOrder}>
          שמור סידור מוצרים
        </button>
      </div>

      {loading && <h3>טוען...</h3>}

      <div className="flex sm:-mb-6 -mb-2 justify-between font-bold text-lg underline">
        <div className="w-24 text-center">מוצר</div>
        <div className="sm:w-20 w-10">כמות</div>
        <div className="min-w-[50px]" />
        <div className="min-w-[50px]" />
      </div>

      <DND
        setProducts={setProducts}
        setList={setList}
        setCollectedProducts={setCollectedProducts}
        setLoading={setLoading}
        products={products}
        collectedProducts={collectedProducts}
        email={email}
      />

      <div className="flex gap-3 justify-center">
        <button className="bg-[#faf79f]" onClick={finishShopping}>
          סיום
        </button>
        <button onClick={() => setOpen(true)}>הוסף מוצרים</button>
      </div>
    </div>
  );
}
