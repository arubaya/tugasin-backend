'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Selamat Datang di Tugasin API. Jika tidak punya wewenang jangan pakai ya :)' }
})

Route.group(() => {
  // Task Route Group
  Route.get('tasks', 'TaskController.index');
  Route.post('task/add', 'TaskController.store');
  Route.get('taskById/:id', 'TaskController.showById');
  Route.delete('delete/:id', 'TaskController.destroyById');

  // Account Route Group
  Route.post('checkname', 'AccountController.checkUsername');
  Route.post('createuser', 'AccountController.store');
  Route.delete('deleteuser/:id', 'AccountController.destroy');
}).prefix('api/v1')
