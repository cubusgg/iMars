<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    public function index($id)
    {
        $games = DB::select("CALL `getTop3GamesForUser`(".$id.");");

        $game_data = [];
        $users = [];
        foreach ($games as $game) {
            array_push($game_data, $game);
            array_push($users, DB::select("CALL `getUserById`(" . $id . ");")[0]);
        }

        $games_users = array_map(function ($n, $m) {
            return ['game' => $n, 'user' => $m];
        }, $game_data, $users);

        return response()->json($games_users);
    }

    public function show()
    {
        $games = DB::select("CALL `getTop3Games`();");

        $game_data = [];
        $users = [];
        foreach ($games as $game) {
            array_push($game_data, $game);
            array_push($users, User::find(
                DB::table('games')
                    ->join('game_user', 'id', '=', 'game_id')
                    ->select('user_id')->where('game_id', '=', $game->id)->get()[0]->user_id)
            );
        }

        $games_users = array_map(function ($n, $m) {
            return ['game' => $n, 'user' => $m];
        }, $game_data, $users);

        return response()->json($games_users);
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'points' => 'required',
        ]);

        $game = new Game();
        $game->points = $request->points;

        $game->save();
        $game->users()->attach(auth()->user()->id);

        return response()->json([
            'game' => $game->toArray(),
            'user' => auth()->user()]);
    }

    public function best()
    {
        $id = auth()->user()->id;

        $today = DB::select("SELECT getBestUserGameToday(".$id.") AS points;")[0]->points;
        $week = DB::select("SELECT `getBestUserGameThisWeek`(".$id.")AS points;")[0]->points;
        $all = DB::select("SELECT `getBestUserGame`(".$id.")AS points;")[0]->points;

        return response()->json([
            'today' => $today,
            'week' => $week,
            'all' => $all]);
    }
}
