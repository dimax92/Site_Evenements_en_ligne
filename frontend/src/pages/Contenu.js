import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import Navigation from "../components/Navigation";

const Contenu = () => {
    const[titre, setTitre] = useState();
    const[description, setDescription] = useState([]);
    const[date, setDate] = useState([]);
    const[lieu, setLieu] = useState([]);

    let { id } = useParams();

    function carteEvenement(lattitude, longitude){
        let map = L.map('map').setView([lattitude, longitude], 13);
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZGltYXg5MiIsImEiOiJja3g1NnJiMTMwY2NzMnZuemN3Z3djcnVtIn0.PcBZuTLeR4U2cEZ1346szw', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: ''
        }).addTo(map);
        let marker = L.marker([lattitude, longitude]).addTo(map);
    };

    function recevoirDonnees(id){
        axios.get("http://127.0.0.1:8000/api/evenement/"+id)
        .then((result)=>{
            setTitre(result.data.titre);
            setDescription(result.data.description);
            setDate(result.data.date);
            setLieu(result.data.lieu);
            carteEvenement(result.data.lattitude, result.data.longitude)
        })
        .catch((error)=>{})
    }

    useEffect(()=>{
        recevoirDonnees(id);
    },[]);
    
    return (
        <div className="divContenu">
            <Navigation/>
            <h1>{titre}</h1>
            <h2>Description de l'evenement</h2>
            <p>{description}</p>
            <h2>Date de l'evenement</h2>
            <p>{date}</p>
            <h2>Lieu de l'evenement</h2>
            <div id="map"></div>
        </div>
    )
}

export default Contenu;