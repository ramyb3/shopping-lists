import User from "@/models/model";

export const findUser = async (email: any) => {
  return await User.findOne({ email: email.trim() });
};

export const saveUser = async (email: any, verification: any) => {
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

export const signUp = async (email: any) => {
  return await User.findOneAndUpdate(
    { email },
    {
      authorized: true,
      verification: null,
    }
  );
};

export const deleteProduct = async (obj: any) => {
  return await User.findOneAndUpdate(
    { email: obj.email },
    { $pull: { realTimeList: { name: obj.product.name } } }
  );
};

export const saveProduct = async (obj: any) => {
  return await User.findOneAndUpdate(
    { email: obj.email },
    { $push: { realTimeList: { $each: obj.products } } }
  );
};

export const updateLists = async (obj: any) => {
  return await User.findOneAndUpdate(
    { email: obj.email },
    {
      $set: { realTimeList: [] },
      $push: {
        lists: {
          products: obj.allProducts,
          date: new Date(Date.now()).toLocaleDateString("en-GB"),
        },
      },
    }
  );
};
