import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import { Product } from "@/models/model";
import { checkDuplicates, fetchData } from "@/utils/functions";

export default function AddProducts({
  setOpen,
  setProducts,
  setList,
  open,
  products,
  email,
}: {
  setOpen: any;
  setProducts: any;
  setList: any;
  open: boolean;
  products: Product[];
  email: string;
}) {
  const [loading, setLoading] = useState(false);
  const [inputFields, setInputFields] = useState<Product[]>([
    { name: "", quantity: NaN },
  ]);

  const addProducts = async () => {
    setLoading(true);

    let arr = inputFields.filter(
      (item) =>
        item.name.trim() !== "" && item.quantity > 0 && !isNaN(item.quantity)
    );

    if (arr.length === 0) {
      setLoading(false);
      setOpen(false);
      return;
    }

    // remove same product from new saved list
    arr = arr.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.name === value.name)
    );

    arr = checkDuplicates(products, arr);

    setProducts([...products, ...arr]);

    try {
      await fetchData(email, "saveproducts", arr);
    } catch (e: any) {
      console.error(e);
    }

    setLoading(false);
    setOpen(false);
    setList(true);
    setInputFields([{ name: "", quantity: NaN }]);
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
    <Dialog
      open={open}
      fullWidth
      onClose={() => {
        if (!loading) {
          setOpen(false);
        }
      }}
    >
      <div className="flex flex-col items-center gap-4 py-5 px-2">
        <h1>הוספת מוצרים לרשימה</h1>
        <div className="sm:max-h-[350px] max-h-[250px] overflow-y-auto">
          {inputFields.map((product, index) => {
            return (
              <div className="flex gap-2 py-2 sm:px-2 px-1" key={index}>
                <input
                  placeholder="מוצר"
                  type="text"
                  className="sm:min-w-[300px] max-w-[140px]"
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
  );
}
