import User from "@/models/model";
import { checkDuplicatesInDB } from "./functions";

export const findUser = async (email: string) => {
  return await User.findOne({ email: email.trim() });
};

export const saveUser = async (email: string, verification: any) => {
  return new Promise((resolve, reject) => {
    const subs = new User({
      email,
      verification,
      authorized: false,
    });

    subs
      .save()
      .then((data: any) => resolve(data))
      .catch((err: any) => reject(err));
  });
};

export const signUp = async (email: string) => {
  return await User.findOneAndUpdate(
    { email },
    {
      authorized: true,
      verification: null,
      firstTimeUser: true,
    }
  );
};

export const deleteProduct = async (obj: any) => {
  return await User.findOneAndUpdate(
    { email: obj.email },
    {
      $pull: {
        realTimeList: { name: obj.product.name },
        collectedProducts: { name: obj.product.name },
      },
    }
  );
};

export const addProductToCollected = async (obj: any) => {
  return await User.findOneAndUpdate(
    { email: obj.email },
    {
      $push: {
        collectedProducts: obj.product,
      },
    }
  );
};

export const saveProduct = async (obj: any) => {
  const user = await User.findOne({ email: obj.email });

  return await User.findOneAndUpdate(
    { email: obj.email },
    {
      $push: {
        realTimeList: {
          $each: checkDuplicatesInDB(user.realTimeList, obj.products),
        },
      },
    }
  );
};

export const updateLists = async (obj: any) => {
  return await User.findOneAndUpdate(
    { email: obj.email },
    {
      $set: { realTimeList: [], collectedProducts: [] },
      $push: {
        lists: {
          products: obj.allProducts,
          date: new Date(Date.now()).toLocaleDateString("en-GB"),
        },
      },
    }
  );
};

export const updateFirstTimeUser = async (email: string) => {
  return await User.findOneAndUpdate(
    { email },{firstTimeUser: false }
  );
};
