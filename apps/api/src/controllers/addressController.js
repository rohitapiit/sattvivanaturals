import Address from "../models/Address.js";

export const addAddress = async (req, res) => {


  try {

    console.log("req.user:", req.user);
    console.log("req.body:", req.body);
    const {
      nickname,
      fullName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault,
    } = req.body;

    if (isDefault) {
      await Address.updateMany(
        { user: req.user.userId },
        { isDefault: false }
      );
    }

    const newAddress = await Address.create({
      user: req.user.userId,
      nickname,
      fullName,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault,
    });

    res.status(201).json({
      success: true,
      address: newAddress,
    });
  }catch (error) {
    console.error("Add Address Error:", error);
  
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyAddresses = async (
  req,
  res
) => {
  try {
    const addresses = await Address.find({
      user: req.user.userId,
    }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAddress = async (
  req,
  res
) => {
  try {
    const address =
      await Address.findById(
        req.params.id
      );

    if (!address) {
      return res.status(404).json({
        success: false,
        message:
          "Address not found",
      });
    }

    if (req.body.isDefault) {
  await Address.updateMany(
    { user: req.user.userId },
    { isDefault: false }
  );
}

    Object.assign(
      address,
      req.body
    );

    await address.save();

    res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAddress = async (
  req,
  res
) => {
  try {
    const address = await Address.findById(
      req.params.id
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const wasDefault = address.isDefault;

    await address.deleteOne();

    if (wasDefault) {
      const anotherAddress =
        await Address.findOne({
          user: req.user.userId,
        }).sort({
          createdAt: -1,
        });

      if (anotherAddress) {
        anotherAddress.isDefault = true;

        await anotherAddress.save();
      }
    }

    res.status(200).json({
      success: true,
      message:
        "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const setDefaultAddress =
  async (req, res) => {
    try {
      await Address.updateMany(
        {
          user: req.user.userId,
        },
        {
          isDefault: false,
        }
      );

      const address =
        await Address.findById(
          req.params.id
        );

      if (!address) {
        return res.status(404).json({
          success: false,
          message:
            "Address not found",
        });
      }

      address.isDefault = true;

      await address.save();

      res.status(200).json({
        success: true,
        address,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };