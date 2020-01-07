import express from "express";
import url from "url";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { createAccessToken } from "../../../auth";
function RLogin() {
  let router: express.Router = express.Router({ mergeParams: true });

  router.get("/", function(req: express.Request, res: express.Response) {
    let q = req.query || req.body;

    let cookies = req.cookies;
    if (typeof q.forced !== "undefined") {
      console.log("Forced login...");
      return res.render("login");
    } else if (!cookies || Object.keys(cookies).length == 0) {
      console.log("No cookie set");
        try {
            let expDate =
            parseInt(dotenv.config().parsed.COOKIE_EXPIRATION!) * 60 * 1000;
          return res
            .cookie("user", createAccessToken({ name: "" }), {
              maxAge: expDate,
              httpOnly: true
            })
            .render("login");
        }catch(e){
            console.error("failed login token", e);

            return res.status(404);
        }
      
    } else if (!cookies.user) {
      console.log(typeof cookies);

      console.log("No 'user' cookie set", cookies);
      return res.render("login");
    } else if (cookies.user === "empty") {
      console.log("empty cookie...");
      return res.render("login");
    }

    return res.redirect("/");
  });
  return router;
}
export default RLogin();
