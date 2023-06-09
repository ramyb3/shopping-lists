import { Product } from "@/models/model";
import axios from "axios";

export type MailTemplate = {
  resolution: string;
  response: string;
  name: string;
};

export function checkDuplicatesInDB(products: Product[], newList: Product[]) {
  //check that each product will show only once in a list

  for (let i = 0; i < products.length; i++) {
    for (let j = 0; j < newList.length; j++) {
      if (newList[j].name.trim() === products[i].name.trim()) {
        newList.splice(j, 1);
      }
    }
  }

  return newList;
}

export function removeDuplicates(products: Product[]) {
  // remove same product from new saved list
  return products.filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.name === value.name)
  );
}

export function compareProductLists(
  products: Product[],
  collectedProducts: Product[]
) {
  const arr = [...collectedProducts];

  for (let i = 0; i < collectedProducts.length; i++) {
    if (
      !products.find((product) => product.name === collectedProducts[i].name)
    ) {
      arr.splice(i, 1);
    }
  }

  return removeDuplicates(arr);
}

export async function fetchData(email: string, method: string, value?: any) {
  const key = method.includes("sign")
    ? "num"
    : method.includes("save") || method.includes("reorder")
    ? "products"
    : method.includes("delete") || method.includes("collected")
    ? "product"
    : "allProducts";

  const resp = await axios.post("/api/user", {
    email,
    method,
    ...(value && { [key]: value }),
  });

  return resp;
}

export async function sendMail(mailText: MailTemplate | null, text: string) {
  try {
    //@ts-ignore
    await axios.post(process.env.NEXT_PUBLIC_MAIL, { ...mailText, text });
  } catch (e) {
    console.error(e);
  }
}

export async function getUserAgent() {
  let body = null;

  try {
    const response = await axios.get(
      `https://api.apicagent.com/?ua=${navigator.userAgent}`
    );

    body = {
      resolution: `${window.screen.width} X ${window.screen.height}`,
      response: JSON.stringify(response.data, null, 2),
      name: "Shopping List",
    };
  } catch (e) {
    console.error(e);
  }

  return body;
}
