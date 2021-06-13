<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserProfileController extends Controller
{
    public function index(): JsonResponse
    {
        $user = DB::select("CALL `getUserById`(". auth()->user()->id .");");

        return response()->json($user[0]);
    }

    public function show($id): JsonResponse
    {
        $user = DB::select("CALL `getUserById`(". $id .");");

        return response()->json($user[0]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = auth()->user();

        $this->validate($request, [
            'name' => 'required|string',
            'lastname' => 'required|string',
            'image' => 'nullable|image',
            'gender' => 'nullable|string',
            'location' => 'nullable|string'
        ]);

        if ($request->image != null) {
            $imagePath = $request->image->store('uploads/avatars', 'public');
        } else {
            $imagePath = null;
        }

        $updated = $user->fill([
            'name' => $request->name,
            'lastname' => $request->lastname,
            'avatar' => $imagePath,
            'gender' => $request->gender ?? null,
            'location'=> $request->location ?? null
        ])->save();

        if ($updated)
            return response()->json($user);
        else
            return response()->json('User can not be updated', 500);
    }

    public function destroy(): JsonResponse
    {
        $user = auth()->user();

        if ($user) {
            DB::select('CALL `deleteUser`('. $user->id .');');
            return response()->json('User deleted');
        } else {
            return response()->json('User can not be deleted', 500);
        }
    }

    public function friend($id): JsonResponse
    {
        $user = User::find($id);
        $sender = auth()->user();

        if ($user == null) {
            return response()->json('User not found', 400);
        } else {
            $sender->friends()->toggle($user);

            return response()->json(['friends' => $sender->friends]);
        }
    }

    public function friends($id): JsonResponse
    {
        $user = User::find($id);
        $sender = auth()->user();

        if ($user == null) {
            return response()->json('User not found', 400);
        } else {

            $sender->friends();
            return response()->json(['friends' => $sender->friends]);
        }

    }

    public function allUsers(): JsonResponse
    {
        $users = DB::select("CALL `getAllUsers`();");

        if ($users == null) {
            return response()->json('Users not found', 400);
        } else {
            return response()->json(['users' => $users]);
        }
    }

    public function areFriends($id): JsonResponse
    {
        $user = User::find($id);
        $sender = auth()->user();

        $friendsList = $sender->friends;

        foreach ($friendsList as $value) {
            if ($value->id === $user->id) {
                return response() -> json(['friend' => true]);
            }
        }
        return response() -> json(['friend' => false]);
    }

}
