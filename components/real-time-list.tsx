import { useEffect, useState } from "react";
import { Product } from "@/models/model";
import { fetchData } from "@/utils/functions";

export default function RealTimeList({
  setOpen,
  setProducts,
  setList,
  products,
  email,
}: {
  setOpen: any;
  setProducts: any;
  setList: any;
  products: Product[];
  email: string;
}) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getCollectedProducts = async () => {
      setLoading(true);

      try {
        const resp = await fetchData(email, "getcollectedproducts");

        setAllProducts(resp.data);
      } catch (e: any) {
        console.error(e);
      }

      setLoading(false);
    };

    getCollectedProducts();
  }, []);

  const removeProduct = async (product: Product) => {
    setLoading(true);

    const arr = products.filter((item) => item.name !== product.name);
    setProducts(arr);

    if (arr.length === 0) {
      setList(false);
    }

    try {
      await fetchData(email, "deleteproduct", product);
    } catch (e: any) {
      console.error(e);
    }

    setLoading(false);
  };

  const addProduct = async (product: Product) => {
    setLoading(true);
    setAllProducts([...allProducts, product]);

    try {
      await fetchData(email, "addtocollected", product);
    } catch (e: any) {
      console.error(e);
    }

    setLoading(false);
  };

  const finishShopping = async () => {
    if (allProducts.length === 0) {
      alert("לא ליקטת מוצרים!");
      return;
    }

    setLoading(true);

    try {
      await fetchData(email, "finishshopping", allProducts);
    } catch (e: any) {
      console.error(e);
    }

    setProducts([]);
    setList(false);
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6 p-2 border-2 border-black sm:min-w-[500px] w-[300px]">
      <div className="max-h-[350px] sm:max-h-[600px] overflow-y-auto">
        {loading && <h3>טוען...</h3>}

        {products.map((product, index) => {
          const isCollected = allProducts.find(
            (item) => item.name === product.name
          );

          return (
            <div
              className={`flex items-center justify-between gap-2 py-2 border-b-2 border-gray ${
                isCollected ? "bg-[#008000]" : ""
              }`}
              key={index}
            >
              <div className="w-24 break-words text-center">{product.name}</div>
              <div className="w-5 text-right font-bold">{product.quantity}</div>

              {!isCollected && (
                <button className="text-xs sm:text-sm" onClick={() => addProduct(product)}>
                  לוקט?
                </button>
              )}
              <button
                className="text-xs sm:text-sm ml-1"
                onClick={() => removeProduct(product)}
              >
                הסר מוצר
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3 justify-center">
        <button onClick={finishShopping}>סיום</button>
        <button onClick={() => setOpen(true)}>הוסף מוצרים</button>
      </div>
    </div>
  );
}
