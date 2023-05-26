import { Product } from "@/models/model";
import { fetchData } from "@/utils/functions";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

export default function DND({
  setProducts,
  setList,
  setLoading,
  setAllProducts,
  products,
  email,
  allProducts,
}: {
  setProducts: any;
  setList: any;
  setAllProducts: any;
  setLoading: any;
  products: Product[];
  email: string;
  allProducts: Product[];
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
    setAllProducts([...allProducts, product]);

    try {
      await fetchData(email, "addtocollected", product);
    } catch (e: any) {
      console.error(e);
    }

    setLoading(false);
  };

  return (
    <DragDropContext onDragEnd={reorder}>
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
                        className={`flex items-center justify-between gap-2 py-2 font-bold border-b-2 border-gray ${
                          isCollected ? "bg-[#008000]" : ""
                        }`}
                      >
                        <div className="w-24 break-words text-center">
                          {product.name}
                        </div>
                        <div className="w-5 text-right">{product.quantity}</div>

                        {!isCollected ? (
                          <button
                            className="text-xs sm:text-sm sm:px-2 px-0.5"
                            onClick={() => addProduct(product)}
                          >
                            לוקט?
                          </button>
                        ) : (
                          <div className="min-w-[50px]" />
                        )}

                        <button
                          className={`text-xs sm:text-sm ml-1 sm:px-2 px-0.5 ${
                            isCollected ? "bg-red-400" : ""
                          }`}
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
  );
}
