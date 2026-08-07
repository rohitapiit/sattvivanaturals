import express from "express";

import {submitContact, getAllContacts, updateContactStatus, deleteContact,} from "../controllers/contactController.js";

const router =
express.Router();

router.post("/",submitContact);
router.get("/admin", getAllContacts);

router.put("/:id",updateContactStatus);
router.delete("/:id",deleteContact);

export default router;