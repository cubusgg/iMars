<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Comment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return JsonResponse
     */
    public function index($id)
    {
        $comments2 = DB::select("CALL `getCommentsForPost`(".$id.");");

        $com_data = [];
        $likes = [];
        $liked = [];
        $users_com = [];
        foreach ($comments2 as $com) {
            array_push( $com_data, $com);
            array_push($likes, DB::select("SELECT `getLikesForComment`(".$com->id.") AS likes ;")[0]->likes);
            array_push($liked, $this->liked($com->id));
            array_push($users_com, User::find($com->user_id));
        }

        $com_likes = array_map(function ($n, $m, $p, $o) {
            return ['comment' => $n, 'likes' => $m, 'liked' => $p, 'user' => $o];
        },  $com_data, $likes, $liked, $users_com);

        return response()->json($com_likes);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store($id, Request $request)
    {
        if (DB::select("CALL `getPostById`(".$id.");") == null)
            return response()->json('Post not found', 500);

        $this->validate($request, [
            'body' => 'required|String',
        ]);

        DB::select('CALL addComment ("'. $request->body .'", ' . auth()->user()->id . ', ' . $id . ', "' . Carbon::now('Europe/Warsaw') . '");');

        return response()->json('Comment added');
    }

    /**
     * Display the specified resource.
     *
     * @return JsonResponse
     */
    public function show($id)
    {
        $com = DB::select("CALL `getCommentById`(".$id.");");

        if (!$com)
            return response()->json('Comment not found', 400);


        return response()->json([
            'data' => $com,
            'likes' => DB::select("SELECT `getLikesForComment`(".$id.") AS likes ;")[0]->likes,
            'liked' => $this->liked($id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function update(Request $request, $id)
    {
        if (DB::select("CALL `getCommentById`(".$id.");" ) == null)
            return response()->json('Comment not found', 400);

        if(auth()->user()->id == Comment::find($id)->user_id) {
            DB::select('CALL updateComment ("'. $request->body .'", ' . $id . ', "' . Carbon::now() . '");');
            return response()->json('Comment updated');
        }

        return response()->json('Comment not found', 400);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @return JsonResponse
     */
    public function destroy($id)
    {
        $comment = DB::select("CALL `getCommentById`(".$id.");");

        if (!$comment)
            return response()->json('Comment not found', 400);

        if(auth()->user()->id == Comment::find($id)->user_id) {
            DB::select("CALL `deleteComment`(" . $id . ");");
            return response()->json('Comment deleted');
        }

        return response()->json('Comment not found', 400);
    }

    public function like($id): JsonResponse
    {
        $com = Comment::find($id);
        $user = auth()->user();

        if ($com == null) {
            return response()->json('Comment not found', 400);
        } else {
            $com->likes()->toggle($user);
            return response()->json(['likes' => $com->likes()->count(), 'liked' => $this->liked($com->id)]);
        }
    }

    public function liked($id)
    {
        $com = Comment::find($id);
        $user = auth()->user();

        $usersList = $com->likes;

        foreach ($usersList as $value) {
            if ($value->email === $user->email) {
                return true;
            }
        }

        return false;
    }
}
