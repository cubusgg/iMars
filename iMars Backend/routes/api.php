<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\PassportAuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;

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
Route::post('register', [PassportAuthController::class, 'register'])->name('user.register');
Route::post('login', [PassportAuthController::class, 'login'])->name('user.login');


Route::middleware('auth:api')->group( function () {
    Route::post('logout', [PassportAuthController::class, 'logout'])->name('user.logout');

    Route::get('users', [UserProfileController::class, 'index'])->name('users.index');
    Route::get('users/{user}', [UserProfileController::class, 'show'])->name('users.show');
    Route::put('users/{user}', [UserProfileController::class, 'update'])->name('users.update');
    Route::patch('users', [UserProfileController::class, 'update'])->name('users.update');
    Route::delete('users', [UserProfileController::class, 'destroy'])->name('users.destroy');

    Route::get('users/{user}/friend', [UserProfileController::class, 'friend'])->name('users.friend');
    Route::get('users/{user}/friends', [UserProfileController::class, 'friends'])->name('users.friends');
    Route::get('friends/{user}', [UserProfileController::class, 'areFriends'])->name('users.areFriends');
    Route::get('allusers', [UserProfileController::class, 'allUsers'])->name('users.allUsers');

    Route::get('users/{user}/posts', [PostController::class, 'userPosts'])->name('users.userPosts');

    Route::resource('posts', PostController::class);
    Route::get('posts/{post}/like', [PostController::class, 'like'])->name('posts.like');

    Route::resource('posts.comments', CommentController::class)->shallow();
    Route::get('comments/{comment}/like', [CommentController::class, 'like'])->name('comments.like');

    Route::get('users/{user}/chat', [MessageController::class, 'show'])->name('conversation.show');
    Route::post('con/{con}/send', [MessageController::class, 'send'])->name('conversation.send');
    Route::get('conversations', [MessageController::class, 'allcon'])->name('conversation.allcon');

    Route::get('games/top3', [GameController::class, 'show'])->name('game.show');
    Route::get('games/best', [GameController::class, 'best'])->name('game.best');
    Route::post('games', [GameController::class, 'store'])->name('game.store');
    Route::get('games/{game}', [GameController::class, 'index'])->name('game.index');

});
