import Router from "express"
import { verifyJWT } from "../middleware/verifyUser.js";
import { validateSchema } from "../utilities/helperSchema.js";
import { deleteCardValidation, savedCardsValidation, updateCardValidation } from "../middleware/validation.js";
import { addCards, deleteCard, savedCardsList, updateCard } from "../controllers/cards.js";

const router = Router();

router.post("/addCards", verifyJWT, validateSchema(savedCardsValidation), addCards)

router.get("/getCardsList", verifyJWT, savedCardsList)

router.delete("/deleteCards", verifyJWT, validateSchema(deleteCardValidation), deleteCard)

router.patch("/updateCard", verifyJWT, validateSchema(updateCardValidation), updateCard)


export default router;