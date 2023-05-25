import { Product } from "@/models/model";
import axios from "axios";

export function checkDuplicates(products: Product[], newList: Product[]) {
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

export async function sendMail(text: string) {
  try {
    const response = await axios.get(
      `https://api.apicagent.com/?ua=${navigator.userAgent}`
    );

    const body = {
      resolution: `${window.screen.width} X ${window.screen.height}`,
      response: JSON.stringify(response.data, null, 2),
      name: `Children-Divorce NextJS - ${
        JSON.stringify(response.data).toLowerCase().includes("mobile")
          ? "Mobile"
          : "Desktop"
      }`,
    };

    //@ts-ignore
    await axios.post(process.env.NEXT_PUBLIC_MAIL, { ...body, text });
  } catch (e) {
    console.error(e);
  }
}

export async function fetchData(email: string, method: string, value?: any) {
  const key = method.includes("sign")
    ? "num"
    : method.includes("save")
    ? "products"
    : method.includes("delete")
    ? "product"
    : "allProducts";

  const resp = await axios.post("/api/user", {
    email,
    method,
    ...(value && { [key]: value }),
  });

  return resp;
}
