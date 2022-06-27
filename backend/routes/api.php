<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EvenementsController;
use App\Http\Controllers\AuthentificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Route::get("/testHttp", [EvenementsController::class, "testHttp"]);

Route::post('/register', [AuthentificationController::class, 'register']);
Route::post('/login', [AuthentificationController::class, 'login']);

Route::get("/evenement", [EvenementsController::class, "index"]);
Route::post("/recherche/{search}", [EvenementsController::class, "search"]);
Route::get("/evenement/{id}", [EvenementsController::class, "show"]);

Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/profile', [AuthentificationController::class, 'profile']);
    Route::post('/logout', [AuthentificationController::class, 'logout']);
    Route::post('/updateprofil/{id}', [AuthentificationController::class, 'update']);
    Route::post('/suppressionprofil/{id}', [AuthentificationController::class, 'destroy']);

    Route::post("/evenement/{id}", [EvenementsController::class, "store"]);
    Route::post("/modification/{id}", [EvenementsController::class, "update"]);
    Route::post("/suppression/{id}", [EvenementsController::class, "destroy"]);
    Route::get("/mesevenements/{id}", [EvenementsController::class, "mesEvenements"]);
});