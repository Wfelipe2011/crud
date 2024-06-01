import "dotenv/config";

import jwt from "jsonwebtoken";
export const middleware = (req: any, res: any, next: any) => {
  const accessToken = req.headers["authorization"];
  if (accessToken) {
    const token = accessToken.split(" ")[1];
    const isAuthorized = jwt.verify(token, process.env.JWT_SECRET!);
    if (isAuthorized) {
      next();
      return;
    }
  }

  res.status(401).send("Unauthorized");
};
