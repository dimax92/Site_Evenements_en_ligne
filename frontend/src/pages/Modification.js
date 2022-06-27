import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Navigation from "../components/Navigation";
import { useCookies } from 'react-cookie';

const Modification = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

    const[reponse,setReponse] = useState();
    const[reponseTitre,setReponseTitre] = useState();
    const[reponseDescription,setReponseDescription] = useState();
    const[reponseDate,setReponseDate] = useState();
    const[reponseLieu,setReponseLieu] = useState();

    const[titre, setTitre] = useState();
    const[description, setDescription] = useState();
    const[date, setDate] = useState();
    const[lieu, setLieu] = useState();

    let { id } = useParams();

    function recevoirDonnees(id){
        axios.get("http://127.0.0.1:8000/api/evenement/"+id)
        .then((result)=>{
            setTitre(result.data.titre);
            setDescription(result.data.description);
            setDate(result.data.date);
            setLieu(result.data.lieu);
        })
        .catch((error)=>{})
    }

    useEffect(()=>{
        recevoirDonnees(id);
    },[]);

    function messageValidation(){
        setReponse(<p className="messageValidation">Evenement modifie</p>)
        setReponseTitre();
        setReponseDescription();
        setReponseDate();
        setReponseLieu();
    }
  
    function messageErreur(error){
        setReponse(<p className="messageErreur">Echec modification Evenement</p>)
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

    function creationDonnees(user_id, lieu, longitude, lattitude){
        let titre = document.querySelector("#titre").value;
        let description = document.querySelector("#description").value;
        let date = document.querySelector("#date").value;

        const data = new FormData();
        data.append('user_id', user_id)
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
                let recuperationLieu = "";
                if(response.data.length >= 1){
                    longitude = response.data[0].lon;
                    lattitude = response.data[0].lat;
                    recuperationLieu = response.data[0].display_name;
                }
                axios.post("http://127.0.0.1:8000/api/modification/"+id, creationDonnees(reponse.data, recuperationLieu, longitude, lattitude), {
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
    
    return (
        <div className="divModification">
            <Navigation/>
            {reponse}
            <form className="divModification__formulaire">
                <label for="titre">Nom de l'evenement</label>
                {reponseTitre}
                <input id="titre" className="divModification__formulaire__titre" defaultValue={titre}></input>
                <label for="description">Description de l'evenement</label>
                {reponseDescription}
                <textarea id="description" className="divModification__formulaire__description" defaultValue={description}></textarea>
                <label for="date">Date de l'evenement(annee/mois/jour)</label>
                {reponseDate}
                <input id="date" className="divModification__formulaire__date" defaultValue={date}></input>
                <label for="lieu">Lieu de l'evenement</label>
                {reponseLieu}
                <input id="lieu" className="divModification__formulaire__lieu" defaultValue={lieu}></input>
                <button className="divModification__formulaire__boutonEvenement" onClick={(e)=>{
                    e.preventDefault();
                    let inputLieu = document.querySelector("#lieu").value;
                    envoiDonnees(inputLieu);
                }}>Modifier</button>
            </form>
        </div>
    )
}

export default Modification;