<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\api\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

Route::post('login', [UserController::class, 'login']);
Route::post('register', [UserController::class, 'register']);
Route::group(['middleware' => 'auth:api'], function() {
    Route::get('details', [UserController::class, 'details']);
    Route::get('list', [UserController::class, 'list']);
});