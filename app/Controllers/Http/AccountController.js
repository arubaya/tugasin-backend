"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Account = use("App/Models/Account");
const { validate } = use("Validator");

/**
 * Resourceful controller for interacting with accounts
 */
class AccountController {
  /**
   * check username exist or not.
   * GET todos/:id
   *
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async checkUsername({ params, request, response }) {
    const req = request.all();

    const rules = {
      userName: "required",
    };

    const validation = await validate(req, rules);

    if (validation.fails()) {
      return response.status(400).json({
        message: validation.messages(),
      });
    }

    const result = await Account.findBy("username", req.userName);
    // const result = await Account
    // .query()
    // .where("username", "=", req.userName)
    // .fetch()

    if (result) {
      const resData = {
        code: 200,
        message: "Username found",
        data: result,
      };
      return response.status(200).json(resData);
    } else {
      const resData = {
        code: 404,
        message: "Username not found. Please create new Account",
      };
      return response.status(200).json(resData);
    }

    // return response.status(200).json(resData);
  }

  /**
   * Create/save a new account.
   * POST accounts
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const req = request.all();

    const rules = {
      userName: "required",
    };

    const validation = await validate(req, rules);

    if (validation.fails()) {
      return response.status(400).json({
        message: validation.messages(),
      });
    }

    const result = await Account.findBy("username", req.userName);

    if (result) {
      const resData = {
        code: 200,
        message: "Username exist. Please create another Account",
        data: result,
      };
      return response.status(200).json(resData);
    } else {
      const account = new Account();
      account.username = req.userName;
      await account.save();
      const resData = {
        code: 201,
        message: "Account has been created successfully",
        data: account,
      };

      return response.status(201).json(resData);
    }
  }

  /**
   * Delete a account with id.
   * DELETE accounts/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {
    const { id } = params;

    const account = await Account.find(id);

    if (account) {
      await account.delete();

      return response.status(200).json({
        message: "Account has been deleted",
      });
    } else {
      const resData = {
        message: "Username not found. Please check again",
      };
      return response.status(404).json(resData);
    }
  }
}

module.exports = AccountController;
