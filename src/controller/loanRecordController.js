import express from "express";
import { body, validationResult } from "express-validator";
import { errorFormatter } from "../helpers/errorFormatter.js";
import fs from "fs";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loanRecordRouter = express.Router();

loanRecordRouter.post(
  "/register_loan_record",
  [
    body("id").notEmpty().withMessage("El ID es un campo obligatorio"),
    body("nombre").notEmpty().withMessage("El nombre es un campo obligatorio"),
    body("apellido")
      .notEmpty()
      .withMessage("El apellido es un campo obligatorio"),
    body("titulo").notEmpty().withMessage("El titulo es un campo obligatorio"),
    body("autor").notEmpty().withMessage("El autor es un campo obligatorio"),
    body("año").notEmpty().withMessage("El año es un campo obligatorio"),
    body("editorial").notEmpty().withMessage("El año es un campo obligatorio"),
  ],
  async (req, res, next) => {
    const resultErrors = validationResult(req).formatWith(errorFormatter);
    if (!resultErrors.isEmpty()) {
      return res.redirect("/error");
    }

    try {
      const { id, nombre, apellido, titulo, autor, año, editorial } = req.body;

      fs.writeFileSync(
        `${path.join(__dirname, `../../data/id_${id}.txt`)}`,
        `
        ID : ${id} 
        Nombre : ${nombre} ${apellido}
        Datos del libro solicitado
        Titulo : ${titulo}
        Autor : ${autor}
        editorial: ${editorial}
        Año: ${año}`,
        function (err) {
          console.log(err);
        }
      );

      return res.redirect(`/api/v1/loan/descarga/${id}`);
    } catch (error) {
      console.log(error);
      return;
    }
  }
);

loanRecordRouter.get("/descarga/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const ruta = `${path.join(__dirname, `../../data/id_${id}.txt`)}`;

    res.download(ruta, function (error) {
      if (error) {
        next(error);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

export default loanRecordRouter;
