import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (request: Request, response: Response) => {
  return response.json({
    message: "Tudo Ok!",
  });
});

router.post("/create", (request: Request, response: Response) => {
  return response.json({
    message: "Usuário Cadastrado com sucesso!",
  });
});

export { router };
