"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Task = use("App/Models/Task");
const Account = use("App/Models/Account");
const { validate } = use("Validator");

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all todos.
   * GET todos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const result = await Task.all();
    const resData = {
      message: "List Tasks",
      data: result,
    };

    return response.status(200).json(resData);
  }

  /**
   * Create/save a new todo.
   * POST todos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const req = request.all();

    const rules = {
      userId: "required|integer",
      todoMessage: "required",
    };

    const validation = await validate(req, rules);

    if (validation.fails()) {
      return response.status(400).json({
        message: validation.messages(),
      });
    }

    const account = await Account.find(req.userId);

    if (account) {
      const todo = new Task();
      todo.username_id = req.userId;
      todo.todo_message = req.todoMessage;
      await todo.save();
      const resData = {
        message: "Task has been added successfully",
        data: todo,
      };

      return response.status(201).json(resData);
    } else {
      const resData = {
        message: "Username not found. Please check again",
      };
      return response.status(404).json(resData);
    }
  }

  /**
   * Display a single todo.
   * GET todos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async showById({ params, request, response, view }) {
    const { id } = params;

    const account = await Account.find(id);

    if (account) {
      const result = await Task.query()
        .where("username_id", "=", id)
        .orderBy("id", "desc")
        .fetch();

      if (result) {
        const resData = {
          message: "List Tasks by id",
          data: result,
        };

        return response.status(200).json(resData);
      } else {
        const resData = {
          message: "Task not found. Please add task",
        };

        return response.status(404).json(resData);
      }
    } else {
      const resData = {
        message: "Username not found. Please check again",
      };
      return response.status(404).json(resData);
    }
  }

  /**
   * Render a form to update an existing todo.
   * GET todos/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update todo details.
   * PUT or PATCH todos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a todo with id.
   * DELETE todos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroyById({ params, request, response }) {
    const { id } = params;

    const result = await Task.find(id);

    if (result) {
      await result.delete();
      const resData = {
        message: "Delete task has been successfully",
      };

      return response.status(200).json(resData);
    } else {
      const resData = {
        message: "Task not found. Please add task",
      };

      return response.status(404).json(resData);
    }
  }
}

module.exports = TaskController;
