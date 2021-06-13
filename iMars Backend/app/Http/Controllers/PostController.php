<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use DateTime;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PostController extends Controller
{
    public function index(): JsonResponse
    {
        $auth_user = auth()->user()->id;
        $users = auth()->user()->friends()->pluck('users_id');
        $users->push($auth_user);

        $posts = Post::whereIn('user_id', $users)->orderBy('created_at', 'DESC')->get();

        $post_data = [];
        $likes = [];
        $liked = [];
        $users_posts = [];
        foreach ($posts as $post) {
            array_push($post_data, $post);
            array_push($likes, DB::select("SELECT `getLikesForPost`(".$post->id.") AS likes ;")[0]->likes);
            array_push($liked, $this->liked($post->id));
            array_push($users_posts, DB::select("CALL `getUserById`(" . $post->user_id . ");")[0]);
        }

        $post_likes = array_map(function ($n, $m, $p, $o) {
            return ['post' => $n, 'likes' => $m, 'liked' => $p, 'user' => $o];
        },  $post_data, $likes, $liked, $users_posts);

        return response()->json($post_likes);
    }

    /**
     * @throws ValidationException
     */
    public function store(Request $request) {
        $this->validate($request, [
            'body' => 'required',
            'image' => 'image',
        ]);

        if ($request->image != null) {
            $imagePath = $request->image->store('uploads', 'public');

            DB::select('CALL `addPostWithImage`(' . auth()->user()->id . ',"' . $request->body .'","' . $imagePath . '","' . Carbon::now() . '");');
        }

        DB::select('CALL `addPostWithoutImage`("' . $request->body . '", ' . auth()->user()->id . ', "' . Carbon::now() . '");');

        return response()->json('Post added');
    }

    public function show($id): JsonResponse
    {
        $post = DB::select("CALL `getPostById`(".$id.");");

        if (!$post)
            return response()->json('Post not found', 400);

        return response()->json([
                'post' => $post,
                'likes' => DB::select("SELECT `getLikesForPost`(".$id.") AS likes ;")[0]->likes,
                'liked' => $this->liked($id),
                'user'  => DB::select("CALL `getUserById`(" . $post[0]->user_id . ");")[0]
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        if (DB::select("CALL `getPostById`(".$id.");" ) == null)
            return response()->json('Post not found', 400);

        if(auth()->user()->id == Post::find($id)->user_id){
            DB::select('CALL updatePost ("'. $request->body .'", ' . $id . ', "' . Carbon::now() . '");');

            return response()->json('Post updated');
        }
        return response()->json('Post not found', 400);
    }

    public function destroy($id): JsonResponse
    {
        $post = DB::select("CALL `getPostById`(".$id.");");

        if (!$post)
            return response()->json('Post not found', 400);

        if(auth()->user()->id == Post::find($id)->user_id) {
            DB::select("CALL `deletePost`(".$id.");");
            return response()->json('Post deleted');
        }
        return response()->json('Post not found', 400);
    }

    public function like($id): JsonResponse
    {
        $post = Post::find($id);
        $user = auth()->user();

        if ($post == null) {
            return response()->json('Post not found', 400);
        } else {
            $post->likes()->toggle($user);
            return response()->json(['likes' => $post->likes->count(), 'liked' => $this->liked($post->id)]);
        }
    }

    public function userPosts($id)
    {
        $posts = DB::select("CALL `getPostsWhereUserId`(".$id.");");

        $post_data = [];
        $likes = [];
        $liked = [];
        $users_posts = [];
        foreach ($posts as $post) {
            array_push($post_data, $post);
            array_push($likes, DB::select("SELECT `getLikesForPost`(".$post->id.") AS likes ;")[0]->likes);
            array_push($liked, $this->liked($post->id));
            array_push($users_posts, DB::select("CALL `getUserById`(" . $post->user_id . ");")[0]);
        }

        $post_likes = array_map(function ($n, $m, $p, $o) {
            return ['post' => $n, 'likes' => $m, 'liked' => $p, 'user' => $o];
        },  $post_data, $likes, $liked, $users_posts);

        return response()->json($post_likes);
    }

    public function liked($id)
    {
        $user = auth()->user();
        $post = Post::find($id);

        $usersList = $post->likes;

        foreach ($usersList as $value) {
            if ($value->email === $user->email) {
               return true;
            }
        }

        return false;
    }
}
