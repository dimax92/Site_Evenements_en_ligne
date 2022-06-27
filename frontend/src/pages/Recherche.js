import React, {useState, useEffect} from "react";
import axios from "axios";
import Navigation from "../components/Navigation";

const Recherche = () => {
    const[data, setData] = useState([]);

    function recevoirDonnees(){
        axios.get("http://127.0.0.1:8000/api/evenement")
        .then((result)=>{
            setData(result.data);
        })
        .catch((error)=>{})
    };

    function remplacementEspacesTirets(espaces){
        let espacesSplit=espaces.split(" ");
        let nouveauEspaces=[];
        for(let i=0; i<=espacesSplit.length-1; i++){
            if(espacesSplit[i]!==""){
                nouveauEspaces.push(espacesSplit[i]);
            }
        };
        return nouveauEspaces.join("-");
    };

    function croissantDecroissant(valeurTriDate, valeurTriDistance, longitude, lattitude){

        const data = new FormData();
        data.append('date', valeurTriDate);
        data.append('distance', valeurTriDistance);
        data.append('longitude', longitude);
        data.append('lattitude', lattitude);

        return data;
    }

    function rechercheDonnees(recherche, inputLieu, valeurTriDate, valeurTriDistance){
        axios.get("https://nominatim.openstreetmap.org/search?format=json&limit=1&q="+inputLieu )
            .then(function (response) {
                let longitude = "";
                let lattitude = "";
                if(response.data.length >= 1){
                    longitude = response.data[0].lon;
                    lattitude = response.data[0].lat;
                };
                axios.post("http://127.0.0.1:8000/api/recherche/-"+recherche, croissantDecroissant(valeurTriDate, valeurTriDistance, longitude, lattitude))
                .then((result)=>{
                    setData(result.data);
                })
                .catch((error)=>{})
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    useEffect(()=>{recevoirDonnees()},[]);

    return (
        <div className="divRecherche">
            <Navigation/>
            <form>
                <input id="inputRecherche" className="divRecherche__inputRecherche" type="text"></input>
                <button onClick={(e)=>{
                    e.preventDefault();
                    rechercheDonnees(remplacementEspacesTirets(document.querySelector("#inputRecherche").value), "", "", "");
                }}>Rechercher</button>
            </form>
            <div className="divRecherche__divFiltreDate">
                <button onClick={(e)=>{
                    e.preventDefault();
                    rechercheDonnees(remplacementEspacesTirets(document.querySelector("#inputRecherche").value), "", "croissant", "");
                }}>Tri date Croissant</button>
                <button onClick={(e)=>{
                    e.preventDefault();
                    rechercheDonnees(remplacementEspacesTirets(document.querySelector("#inputRecherche").value), "", "decroissant", "");
                }}>Tri date Decroissant</button>
            </div>
            <div className="divRecherche__divFiltreDistance">
                <input id="inputDistance" className="divRecherche__divFiltreDistance__inputDistance" type="text"></input>
                <button onClick={(e)=>{
                    e.preventDefault();
                    rechercheDonnees(remplacementEspacesTirets(document.querySelector("#inputRecherche").value), document.querySelector("#inputDistance").value, "", "croissant");
                }}>Tri distance Croissant</button>
                <button onClick={(e)=>{
                    e.preventDefault();
                    rechercheDonnees(remplacementEspacesTirets(document.querySelector("#inputRecherche").value), document.querySelector("#inputDistance").value, "", "decroissant");
                }}>Tri distance Decroissant</button>
            </div>
            <div className="divRecherche__divMap">
                {data.map((resultat)=>{
                    return(
                        <a href={remplacementEspacesTirets(resultat.titre)+"-"+resultat.id}>
                            <p>{resultat.titre}</p>
                        </a>
                    )
                })}
            </div>
        </div>
    )
}

export default Recherche;