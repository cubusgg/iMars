<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\User;
use App\Models\Message;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MessageController extends Controller
{
    public function createConversation($sender, $recipient): JsonResponse
    {
        $sender->conversations()->attach($recipient->id);
        return response()->json([$sender]);
    }


    public function show($id): JsonResponse
    {
        $sender = auth()->user();
        $recipient = User::find($id);
        if ($recipient) {
            $query = DB::table('conversations')->orWhere(function ($query) use ($recipient, $sender) {
                $query->where('userOne_id', '=', $sender->id)->where('userTwo_id', '=', $recipient->id);
            })->orWhere(function ($query) use ($recipient, $sender) {
                $query->where('userOne_id', '=', $recipient->id)->where('userTwo_id', '=', $sender->id);
            })->get()->toArray();

            if($query == [])
                $this->createConversation($sender, $recipient);

            $query = DB::table('conversations')->orWhere(function ($query) use ($recipient, $sender) {
                $query->where('userOne_id', '=', $sender->id)->where('userTwo_id', '=', $recipient->id);
            })->orWhere(function ($query) use ($recipient, $sender) {
                $query->where('userOne_id', '=', $recipient->id)->where('userTwo_id', '=', $sender->id);
            })->get()->toArray();

            $messages = DB::table('messages')->where('conversations_id', '=', $query[0]->id);

            $messages_data = [];
            $users = [];

            foreach ($messages->get()->toArray() as $message) {
                array_push($messages_data, $message);
                array_push($users, User::find($message->user_id));
            }

            $messages_users = array_map(function ($n, $m) {
                return ['message' => $n, 'user' => $m];
            },  $messages_data, $users);

            return response()->json($messages_users);

        } else {
            return response()->json('User not found');
        }
    }

    public function allcon(): JsonResponse
    {
        $sender = auth()->user();

        $query = DB::table('conversations')->where('userOne_id', '=', $sender->id)
                                                ->orWhere('userTwo_id', '=', $sender->id)
                                                ->get()->toArray();
        $secondUser = [];

        foreach ($query as $q) {
            if ($q->userOne_id == $sender->id) {
                $find = User::find($q->userTwo_id);
                array_push($secondUser, $find);
            } else {
                $find = User::find($q->userOne_id);
                array_push($secondUser, $find);
            }
        }

        $conv = array_map(function ($n, $m) {
            return ['conv' => $n, 'secondUser' => $m];
        },  $query, $secondUser);


        if ($query) {
            return response()->json($conv);
        } else {
            return response()->json([]);
        }
    }



    public function send($id, Request $request): JsonResponse
    {
        $conversation = Conversation::find($id);
        if ($conversation) {
            $this->validate($request, [
                'text' => 'required|String',
            ]);

            $message = new Message();
            $message->body = $request->text;
            $message->user_id = $request->user()->id;
            $message->conversations_id = $id;

            if (auth()->user()->messages()->save($message))
                return response()->json($message->toArray());
            else
                return response()->json('Message not added', 500);
        } else {
            return response()->json('Conversation not found');
        }
    }
}
