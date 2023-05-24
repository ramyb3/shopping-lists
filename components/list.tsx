import { useEffect, useState } from "react";
import axios from "axios";
import History from "./history";
import { Product } from "@/models/model";
import Dialog from "@mui/material/Dialog";

export default function List({ email }: { email: string }) {
  const [list, setList] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputFields, setInputFields] = useState<Product[]>([
    { name: "", quantity: NaN },
  ]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const resp = await axios.post("/api/user", {
          email,
          method: "getproducts",
        });

        setList(resp.data.length > 0 ? true : false);
        setProducts(resp.data);
      } catch (e: any) {
        console.error(e);
      }
    };

    getProducts();
  }, []);

  const finishShopping = async () => {
    if (allProducts.length === 0) {
      alert("לא ליקטת מוצרים!");
      return;
    }

    try {
      await axios.post("/api/user", {
        allProducts,
        email,
        method: "finishshopping",
      });
    } catch (e: any) {
      console.error(e);
    }

    setList(false);
  };

  const addProducts = async () => {
    setLoading(true);

    const arr = inputFields.filter(
      (item) =>
        item.name.trim() !== "" && item.quantity > 0 && !isNaN(item.quantity)
    );

    if (arr.length === 0) {
      setList(false);
      return;
    } else {
      setList(true);
    }

    setProducts([...products, ...arr]);

    try {
      await axios.post("/api/user", {
        products: arr,
        email,
        method: "saveproducts",
      });
    } catch (e: any) {
      console.error(e);
    }

    setLoading(false);
    setOpen(false);
    setInputFields([{ name: "", quantity: NaN }]);
  };

  const removeProduct = async (product: Product) => {
    const arr = products.filter((item) => item.name !== product.name);
    setProducts(arr);

    try {
      await axios.post("/api/user", {
        product,
        email,
        method: "deleteproduct",
      });
    } catch (e: any) {
      console.error(e);
    }

    if (arr.length === 0) {
      setList(false);
    }
  };

  const handleFormChange = (
    value: string | number,
    index: number,
    key: string
  ) => {
    let data: any = [...inputFields];
    data[index][key] = value;

    setInputFields(data);
  };

  return (
    <div className="flex justify-center mt-14">
      {!list ? (
        <>
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
        </>
      ) : (
        <div className="flex flex-col gap-6 p-2 border-2 border-black min-w-[300px]">
          <div className="max-h-[350px] sm:max-h-[600px] overflow-y-auto">
            {products.map((product, index) => {
              const isCollected = allProducts.find(
                (item) => item.name === product.name
              );

              return (
                <div
                  className={`flex items-center justify-between gap-3 p-2 border-b-2 border-gray ${
                    isCollected ? "bg-[#008000]" : ""
                  }`}
                  key={index}
                >
                  <div className="w-24 break-words text-center">
                    {product.name}
                  </div>
                  <div className="w-8 text-center font-bold">
                    {product.quantity}
                  </div>

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
      )}

      <Dialog
        open={open}
        fullWidth
        onClose={() => {
          if (!loading) {
            setOpen(false);
          }
        }}
      >
        <div className="flex flex-col items-center gap-4 p-5">
          <h1>הוספת מוצרים לרשימה</h1>
          <div className="sm:max-h-[350px] max-h-[250px] overflow-y-auto">
            {inputFields.map((product, index) => {
              return (
                <div className="flex gap-2 p-2" key={index}>
                  <input
                    placeholder="מוצר"
                    type="text"
                    className="sm:w-56 w-48"
                    onChange={(e) =>
                      handleFormChange(e.target.value, index, "name")
                    }
                  />
                  <input
                    placeholder="כמות"
                    type="number"
                    className="w-20"
                    onChange={(e) =>
                      handleFormChange(
                        parseInt(e.target.value),
                        index,
                        "quantity"
                      )
                    }
                  />
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() =>
                setInputFields([...inputFields, { name: "", quantity: NaN }])
              }
            >
              הוסף מוצר
            </button>
            <button onClick={addProducts}>שמור</button>
          </div>
          {loading && <h3>טוען...</h3>}
        </div>
      </Dialog>

      <History />
    </div>
  );
}
