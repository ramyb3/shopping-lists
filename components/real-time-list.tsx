import { useEffect, useState } from "react";
import { Product } from "@/models/model";
import { fetchData } from "@/utils/functions";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

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
    // setLoading(true);
    // const arr = products.filter((item) => item.name !== product.name);
    // setProducts(arr);
    // if (arr.length === 0) {
    //   setList(false);
    // }
    // try {
    //   await fetchData(email, "deleteproduct", product);
    // } catch (e: any) {
    //   console.error(e);
    // }
    // setLoading(false);
  };

  const addProduct = async (product: Product) => {
    // setLoading(true);
    // setAllProducts([...allProducts, product]);
    // try {
    //   await fetchData(email, "addtocollected", product);
    // } catch (e: any) {
    //   console.error(e);
    // }
    // setLoading(false);
  };

  const finishShopping = async () => {
    // if (allProducts.length === 0) {
    //   alert("לא ליקטת מוצרים!");
    //   return;
    // }
    // setLoading(true);
    // try {
    //   await fetchData(email, "finishshopping", allProducts);
    // } catch (e: any) {
    //   console.error(e);
    // }
    // setProducts([]);
    // setList(false);
    // setLoading(false);
  };

  const reorder =(e:any)=> {
    // console.log(e,11);

    const result = Array.from(products);
    const [removed] = result.splice(e.source.index, 1);
    result.splice(e.destination.index, 0, removed);

    console.log(result,22);
  }

  return (
    <div className="flex flex-col gap-6 p-2 border-2 border-black sm:min-w-[500px] w-[300px]">
      {loading && <h3>טוען...</h3>}

      <div className="max-h-[350px]  sm:max-h-[600px] overflow-y-auto">
        <DragDropContext onDragEnd={reorder} >
          <Droppable droppableId={"drop-zone"}>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {products.map((product, index) => {
                  const isCollected = allProducts.find(
                    (item) => item.name === product.name
                  );

                  return (
                    <Draggable
                      key={product.name}
                      draggableId={product.name}
                      index={index}
                    >
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className={`flex items-center justify-between gap-2 py-2 border-b-2 border-gray ${
                              isCollected ? "bg-[#008000]" : ""
                            }`}
                          >
                            <div className="w-24 break-words text-center">
                              {product.name}
                            </div>
                            <div className="w-5 text-right font-bold">
                              {product.quantity}
                            </div>

                            {!isCollected && (
                              <button
                                className="text-xs sm:text-sm"
                                onClick={() => addProduct(product)}
                              >
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
                      }}
                    </Draggable>
                  );
                })}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="flex gap-3 justify-center">
        <button onClick={finishShopping}>סיום</button>
        <button onClick={() => setOpen(true)}>הוסף מוצרים</button>
      </div>
    </div>
  );
}
