import {
  findUser,
  saveUser,
  signUp,
  deleteProduct,
  saveProduct,
  updateLists,
  addProductToCollected,
} from "@/utils/dbFuncs";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import connectMongo from "@/utils/dbConfig";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectMongo();

  if (req.body.method === "logorsign") {
    return await logOrSign(req, res);
  } else if (req.body.method === "completesign") {
    return await completeSign(req, res);
  } else if (req.body.method === "deleteproduct") {
    return await deleteProducts(req, res);
  } else if (req.body.method === "getproducts") {
    return await getAllProducts(req, res);
  } else if (req.body.method === "saveproducts") {
    return await saveProducts(req, res);
  } else if (req.body.method === "finishshopping") {
    return await finishShopping(req, res);
  } else if (req.body.method === "getcollectedproducts") {
    return await getCollectedProducts(req, res);
  } else if (req.body.method === "addtocollected") {
    return await addToCollected(req, res);
  } else if (req.body.method === "gethistory") {
    return await getHistory(req, res);
  }
}

const logOrSign = async (req: NextApiRequest, res: NextApiResponse) => {
  const obj = await findUser(req.body.email);
  const verification =
    obj?.verification || Math.floor(100000 + Math.random() * 900000);
  let message = "";

  if (!obj?.authorized) {
    //@ts-ignore
    const mailRes = await axios.post(process.env.NEXT_PUBLIC_MAIL, {
      email: req.body.email,
      verification,
      site: process.env.NEXT_PUBLIC_SITE,
    });

    if (!mailRes) {
      message = "חלה שגיאה ברישום, אנא נסו שוב";
    } else {
      if (!obj) {
        await saveUser(req.body.email, verification);
      }

      message =
        "ברגעים אלה נשלח אליכם מייל עם קוד אימות ורק לאחר מכן תוכלו להשתמש באתר";
    }
  }

  return res.json({
    authorized: obj?.authorized,
    message,
    firstFriday: obj?.firstFriday || "",
  });
};

const completeSign = async (req: NextApiRequest, res: NextApiResponse) => {
  const obj = await findUser(req.body.email);

  if (obj.verification === req.body.num) {
    await signUp(req.body.email);
    return res.status(200).json("");
  } else {
    return res.status(500).json("קוד האימות שגוי!");
  }
};

const deleteProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  await deleteProduct(req.body);
  return res.json("");
};

const getAllProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  const obj = await findUser(req.body.email);
  return res.json(obj.realTimeList);
};

const getCollectedProducts = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const obj = await findUser(req.body.email);
  return res.json(obj.collectedProducts);
};

const saveProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  await saveProduct(req.body);
  return res.json("");
};

const addToCollected = async (req: NextApiRequest, res: NextApiResponse) => {
  await addProductToCollected(req.body);
  return res.json("");
};

const finishShopping = async (req: NextApiRequest, res: NextApiResponse) => {
  await updateLists(req.body);
  return res.json("");
};

const getHistory = async (req: NextApiRequest, res: NextApiResponse) => {
  const obj = await findUser(req.body.email);
  return res.json(obj.lists);
};
