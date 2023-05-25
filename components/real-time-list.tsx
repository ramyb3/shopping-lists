import { useState } from "react";
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

  const removeProduct = async (product: Product) => {
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
  };

  const collectedProduct = async (product: Product) => {
    setAllProducts([...allProducts, product]);

    // try {
    //   await axios.post("/api/user", {
    //     product,
    //     email,
    //     method: "deleteproduct",
    //   });
    // } catch (e: any) {
    //   console.error(e);
    // }
  };

  const finishShopping = async () => {
    if (allProducts.length === 0) {
      alert("לא ליקטת מוצרים!");
      return;
    }

    try {
      await fetchData(email, "finishshopping", allProducts);
    } catch (e: any) {
      console.error(e);
    }

    setProducts([]);
    setList(false);
  };

  return (
    <div className="flex flex-col gap-6 p-2 border-2 border-black sm:min-w-[500px] max-w-[300px]">
      <div className="max-h-[350px] sm:max-h-[600px] overflow-y-auto">
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
                <button
                  className="text-sm"
                  onClick={() => setAllProducts([...allProducts, product])}
                >
                  לוקט?
                </button>
              )}
              <button
                className="text-sm"
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
