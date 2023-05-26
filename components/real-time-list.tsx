import { Product } from "@/models/model";
import { compareProductLists, fetchData } from "@/utils/functions";
import DND from "./dnd";

export default function RealTimeList({
  setOpen,
  setProducts,
  setList,
  setRefresh,
  setLoading,
  setAllProducts,
  products,
  loading,
  email,
  allProducts,
}: {
  setOpen: any;
  setProducts: any;
  setList: any;
  setRefresh: any;
  setAllProducts: any;
  setLoading: any;
  products: Product[];
  email: string;
  loading: boolean;
  allProducts: Product[];
}) {
  const finishShopping = async () => {
    let realTimeList, collectedProducts;

    setLoading(true);

    if (allProducts.length === 0) {
      alert("לא ליקטת מוצרים!");
      setLoading(false);
      return;
    } else {
      // in case of parallel finish
      try {
        const resp = await fetchData(email, "getproducts");

        realTimeList = resp.data.realTimeList;
        collectedProducts = resp.data.collectedProducts;

        setProducts(realTimeList);
        setAllProducts(collectedProducts);
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
        compareProductLists(realTimeList, collectedProducts)
      );
    } catch (e) {
      console.error(e);
    }

    setProducts([]);
    setAllProducts([]);
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
          setAllProducts={setAllProducts}
          setLoading={setLoading}
          products={products}
          allProducts={allProducts}
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
