import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import { Product } from "@/models/model";
import {
  checkDuplicatesInDB,
  fetchData,
  removeDuplicates,
} from "@/utils/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function AddProducts({
  setOpen,
  setProducts,
  setList,
  open,
  products,
  email,
  historyProducts,
}: {
  setOpen: any;
  setProducts: any;
  setList: any;
  open: boolean;
  products: Product[];
  historyProducts: Product[];
  email: string;
}) {
  const [loading, setLoading] = useState(false);
  const [inputFields, setInputFields] = useState<Product[]>([
    { name: "", quantity: NaN },
  ]);

  useEffect(() => {
    if (historyProducts.length > 0) {
      setInputFields([...historyProducts]);
    }
  }, [historyProducts]);

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

    arr = checkDuplicatesInDB(products, removeDuplicates(arr));

    setProducts([...products, ...arr]);

    try {
      await fetchData(email, "saveproducts", arr);
    } catch (e: any) {
      console.error(e);
    }

    setLoading(false);
    setOpen(false);
    setList(true);
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
      sx={{
        "& .MuiDialog-paperWidthSm": {
          margin: 0,
          width: "100%",
        },
      }}
      onClose={() => {
        if (!loading) {
          setOpen(false);
        }

        setInputFields([{ name: "", quantity: NaN }]);
      }}
    >
      <figure
        className="absolute top-1 right-2 cursor-pointer"
        onClick={() => setOpen(false)}
      >
        <FontAwesomeIcon icon={faXmark} size="xl" />
      </figure>

      <div className="flex flex-col items-center gap-4 py-5 px-2">
        <h1>הוספת מוצרים לרשימה</h1>

        <div className="sm:max-h-[350px] max-h-[250px] overflow-y-auto">
          {inputFields.map((product, index) => {
            return (
              <div
                className="flex gap-2 py-2 sm:px-2 px-1 items-center"
                key={index}
              >
                <figure
                  className="-ml-1 cursor-pointer"
                  onClick={() =>
                    setInputFields(
                      inputFields.filter(
                        (item, itemIndex) => itemIndex !== index
                      )
                    )
                  }
                >
                  <FontAwesomeIcon icon={faXmark} />
                </figure>
                <input
                  placeholder="מוצר"
                  type="text"
                  className="sm:min-w-[300px] max-w-[180px]"
                  onChange={(e) =>
                    handleFormChange(e.target.value, index, "name")
                  }
                  value={product.name}
                />
                <input
                  placeholder=" כמות"
                  type="number"
                  className="w-20 text-right"
                  onChange={(e) =>
                    handleFormChange(
                      parseInt(e.target.value),
                      index,
                      "quantity"
                    )
                  }
                  value={String(product.quantity)}
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
            הוסף שורה
          </button>
          <button onClick={addProducts}>שמור</button>
        </div>

        {loading && <h3>טוען...</h3>}
      </div>
    </Dialog>
  );
}
