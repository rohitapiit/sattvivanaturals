import Contact from "../models/Contact.js";

export const submitContact =
async (req, res) => {
  try {

    const contact =
      await Contact.create(
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Message sent successfully",
      contact,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};

export const getAllContacts = async (
  req,
  res
) => {
  try {

    const contacts =
      await Contact.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      contacts,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const updateContactStatus =
  async (req, res) => {

    try {

      const contact =
        await Contact.findById(
          req.params.id
        );

      if (!contact) {

        return res.status(404).json({
          success: false,
          message:
            "Contact not found",
        });

      }

      contact.status =
        req.body.status;

      await contact.save();

      res.status(200).json({
        success: true,
        contact,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
};

export const deleteContact = async (
  req,
  res
) => {
  try {

    const contact =
      await Contact.findById(
        req.params.id
      );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message:
          "Contact not found",
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Contact deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};