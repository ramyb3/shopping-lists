import { Product } from "@/models/model";
import { fetchData } from "@/utils/functions";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

export default function DND({
  setProducts,
  setList,
  setLoading,
  setCollectedProducts,
  products,
  email,
  collectedProducts,
}: {
  setProducts: any;
  setList: any;
  setCollectedProducts: any;
  setLoading: any;
  products: Product[];
  email: string;
  collectedProducts: Product[];
}) {
  const reorder = (e: any) => {
    const result = Array.from(products);
    const [removed] = result.splice(e.source.index, 1);
    result.splice(e.destination.index, 0, removed);

    setProducts(result);
  };

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
    setCollectedProducts([...collectedProducts, product]);

    try {
      await fetchData(email, "addtocollected", product);
    } catch (e: any) {
      console.error(e);
    }

    setLoading(false);
  };

  return (
    <div className="max-h-[300px] sm:max-h-[600px] overflow-y-auto">
      <DragDropContext onDragEnd={reorder}>
        <Droppable droppableId={"drop-zone"}>
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {products.map((product, index) => {
                const isCollected = collectedProducts.find(
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
                          className={`flex items-center justify-between py-2 pl-1 font-bold border-b-2 text-center border-gray ${
                            isCollected
                              ? "bg-[#008000] ease-in duration-200"
                              : ""
                          }`}
                        >
                          <div className="w-24 break-words">{product.name}</div>
                          <div className="w-8">
                            {product.quantity} {product.unit}
                          </div>

                          {!isCollected ? (
                            <button
                              className="text-xs sm:text-sm sm:px-2 px-0.5 -ml-3 bg-[#01f200] rounded-md"
                              onClick={() => addProduct(product)}
                            >
                              לוקט?
                            </button>
                          ) : (
                            <div className="sm:min-w-[50px] min-w-[20px]" />
                          )}

                          <button
                            className="text-xs sm:text-sm sm:px-2 px-0.5 bg-red-400 rounded-md"
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
  );
}
