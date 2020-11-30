const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Promotions = require("../models/promotions");
var authenticate = require("../authenticate");

const promotionsRouter = express.Router();
promotionsRouter.use(bodyParser.json());

promotionsRouter
  .route("/")
  .get((req, res, next) => {
    Promotions.find({})
      .then(
        (promotions) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotions);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .post(authenticate.verifyUser, (req, res, next) => {
    Promotions.create(req.body)
      .then(
        (promotion) => {
          console.log("Promotion created", promotion);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  .put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("Put operation not supported on promotions");
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.remove({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

promotionsRouter
  .route("/:promotionsId")
  .get((req, res) => {
    Promotions.findById(req.params.promotionsId)
      .then(
        (promotion) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res, next) => {
    res.end(
      "Post operation not supported on /promotions/" + req.params.promotionsId
    );
  })
  .put(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndUpdate(
      req.params.promotionsId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (promotion) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .delete(authenticate.verifyUser, (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promotionsId)
      .then(
        (promotion) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = promotionsRouter;
