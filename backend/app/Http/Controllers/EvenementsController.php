<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\evenements;
use Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class EvenementsController extends Controller
{
    //
    public function store(Request $request, $id)
    {
        $validator = Validator::make($request->all(),[
            "titre" => "required|string",
            "description" => "required|string",
            "date" => "required|date|date_format:Y-m-d",
            "lieu" => "required|string"
            ]
        );

        if($validator->fails()){
            return response()->json($validator->errors(), 401);       
        }

        $actualite = evenements::create([
            "user_id" => $id,
            "titre" => $request->input("titre"),
            "description" => $request->input("description"),
            "date" => $request->input("date"),
            "lieu" => $request->input("lieu"),
            "longitude" => $request->input("longitude"),
            "lattitude" => $request->input("lattitude")
        ]);
        return response()->json(["message" => "evenement cree avec succes"], 201);
    }

    public function index()
    {
        return evenements::all();
    }

    public function search(Request $request, $search)
    {
        $filtre = "";
        $longitude = $request->input("longitude");
        $lattitude = $request->input("lattitude");

        if($request->input("date") === "croissant"){
            $filtre = " ORDER BY `date` ASC ";
        }else if($request->input("date") === "decroissant"){
            $filtre = " ORDER BY `date` DESC ";
        }
        if($longitude != "" AND $lattitude != ""){
            if($request->input("distance") === "croissant"){
                $filtre = " ORDER BY calculDistance('$lattitude', '$longitude', `lattitude`, `longitude`, 'K') ASC ";
            }else if($request->input("distance") === "decroissant"){
                $filtre = " ORDER BY calculDistance('$lattitude', '$longitude', `lattitude`, `longitude`, 'K') DESC ";
            }
        }

        if($search !== "-"){
            return DB::select("SELECT * FROM `evenements` WHERE filtre_recherche(REPLACE('$search', '-', ' '), CONCAT(`titre`, ' ', `description`, ' ', `lieu`)) = 10 $filtre");
        }else{
            return DB::select("SELECT * FROM `evenements` $filtre");
        }
    }

    public function show($id)
    {
        $evenement = evenements::findOrFail($id);
        return $evenement;
    }

    public function update(Request $request, $id)
    {
        $userIdRequete = intval($request->input("user_id"));

        $evenements = evenements::firstWhere('id','=',$id);

        $userIdUpdate = $evenements->user_id;

        $validator = Validator::make($request->all(),[
            "titre" => "required|string",
            "description" => "required|string",
            "date" => "required|date|date_format:Y-m-d",
            "lieu" => "required|string"
            ]
        );

        if($validator->fails()){
            return response()->json($validator->errors(), 401);       
        }

        if($userIdRequete === $userIdUpdate){
            $evenements->update([
                "titre" => $request->input("titre"),
                "description" => $request->input("description"),
                "date" => $request->input("date"),
                "lieu" => $request->input("lieu"),
                "longitude" => $request->input("longitude"),
                "lattitude" => $request->input("lattitude")
            ]);
            return response()->json(["message" => "modifier"], 201);  
        }else{
            return response()->json(["message" => "vous n'etes pas autorise"], 401);  
        }

    }

    public function destroy(Request $request, $id)
    {
        $userIdRequete = intval($request->input("user_id"));
        $evenements = evenements::firstWhere('id','=',$id);
        $userIdUpdate = $evenements->user_id;

        if($userIdRequete === $userIdUpdate){
            $evenements->delete();
            return response()->json(["message" => "supprimer"], 201);  
        }else{
            return response()->json(["message" => "echec suppression"], 401);  
        }
    }

    public function mesEvenements($id)
    {
        return DB::select("SELECT * FROM `evenements` WHERE `user_id` = '$id' ");
    }

}
