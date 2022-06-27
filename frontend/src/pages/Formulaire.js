import React, {useState, useEffect} from "react";
import axios from "axios";
import { useCookies } from 'react-cookie';
import Navigation from "../components/Navigation";

const Formulaire = ()=>{
    const [cookies, setCookie, removeCookie] = useCookies();
    const[reponse,setReponse] = useState();
    const[reponseTitre,setReponseTitre] = useState();
    const[reponseDescription,setReponseDescription] = useState();
    const[reponseDate,setReponseDate] = useState();
    const[reponseLieu,setReponseLieu] = useState();

    function messageValidation(){
        setReponse(<p className="messageValidation">Creation Evenement reussi</p>)
        setReponseTitre();
        setReponseDescription();
        setReponseDate();
        setReponseLieu();
    }
  
    function messageErreur(error){
        setReponse(<p className="messageErreur">Echec creation Evenement</p>)
        if(error.response.data.titre){
            setReponseTitre(<p className="messageErreurInput">{error.response.data.titre}</p>)
        }else{
            setReponseTitre()
        }if(error.response.data.description){
          setReponseDescription(<p className="messageErreurInput">{error.response.data.description}</p>)
        }else{
          setReponseDescription()
        }if(error.response.data.date){
            setReponseDate(<p className="messageErreurInput">{error.response.data.date}</p>)
        }else{
            setReponseDate()
        }if(error.response.data.lieu){
            setReponseLieu(<p className="messageErreurInput">{error.response.data.lieu}</p>)
        }else{
            setReponseLieu()
        }
    }

    function creationDonnees(lieu, longitude, lattitude){
        let titre = document.querySelector("#titre").value;
        let description = document.querySelector("#description").value;
        let date = document.querySelector("#date").value;
        date = date.split("/");
        date = date.join("-");

        const data = new FormData();
        data.append('titre', titre);
        data.append('description', description);
        data.append('date', date);
        data.append('lieu', lieu);
        data.append('longitude', longitude);
        data.append('lattitude', lattitude);

        return data;
    }

    function envoiDonnees(inputLieu){
        axios.get("http://127.0.0.1:8000/api/profile", {
            headers: {
                'Authorization': "Bearer "+cookies.token
              }
        })
        .then(function (reponse) {
            axios.get("https://nominatim.openstreetmap.org/search?format=json&limit=1&q="+inputLieu )
            .then(function (response) {
                let longitude = "";
                let lattitude = "";
                let lieu = "";
                if(response.data.length >= 1){
                    longitude = response.data[0].lon;
                    lattitude = response.data[0].lat;
                    lieu = response.data[0].display_name;
                }
                axios.post("http://127.0.0.1:8000/api/evenement/"+reponse.data, creationDonnees(lieu, longitude, lattitude), {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        'Authorization': "Bearer "+cookies.token
                    }
                })
                .then(function (resultat) {
                    messageValidation();
                })
                .catch(function (error) {
                    messageErreur(error);
                });
            })
            .catch(function (error) {
                console.log(error);
            });
        })
        .catch(function (error) {
        });
    }

    function inputDate(e){
        if(e.nativeEvent.target.value.length > 10){
            e.nativeEvent.target.value = e.nativeEvent.target.value.slice(0, -1);
        }else{
            if(e.nativeEvent.inputType !== "deleteContentBackward"){
                if(e.nativeEvent.target.value.length <= 4 || (e.nativeEvent.target.value.length >= 5 && e.nativeEvent.target.value.length <=7) || (e.nativeEvent.target.value.length >= 8 && e.nativeEvent.target.value.length <=10)){
                    if(!e.nativeEvent.data.match(/[0-9]/gm)){
                        e.nativeEvent.target.value = e.nativeEvent.target.value.slice(0, -1);
                    }
                    if(e.nativeEvent.target.value.length === 4 || e.nativeEvent.target.value.length === 7){
                        e.nativeEvent.target.value = e.nativeEvent.target.value+"/";
                    }
                }
            }else{
                if(e.nativeEvent.target.value.length === 4 || e.nativeEvent.target.value.length === 7){
                    e.nativeEvent.target.value = e.nativeEvent.target.value.slice(0, -1);
                }
            }
        }
    }

    return (
        <div className="divFormulaire">
            <Navigation/>
            {reponse}
            <form className="divFormulaire__formulaire">
                <label for="titre">Nom de l'evenement</label>
                {reponseTitre}
                <input id="titre" className="titre"></input>
                <label for="description">Description de l'evenement</label>
                {reponseDescription}
                <textarea id="description" className="description"></textarea>
                <label for="date">Date de l'evenement(annee/mois/jour)</label>
                {reponseDate}
                <input id="date" className="date" onInput={(e)=>{
                    inputDate(e);
                }}></input>
                <label for="lieu">Lieu de l'evenement</label>
                {reponseLieu}
                <input id="lieu" className="lieu"></input>
                <button className="boutonEvenement" onClick={(e)=>{
                    e.preventDefault();
                    let inputLieu = document.querySelector("#lieu").value;
                    envoiDonnees(inputLieu)
                }}>Mettre en ligne</button>
            </form>
        </div>
    )
}

export default Formulaire