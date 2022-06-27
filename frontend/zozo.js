let input = document.querySelector("input"); 
input.addEventListener("input", (e)=>{
    console.log(e);
    if(e.target.value.length > 10){
        e.target.value = e.target.value.slice(0, -1);
    }else{
        if(e.inputType !== "deleteContentBackward"){
            if(e.target.value.length <= 4 || (e.target.value.length >= 5 && e.target.value.length <=7) || (e.target.value.length >= 8 && e.target.value.length <=10)){
                if(!e.data.match(/[0-9]/gm)){
                    e.target.value = e.target.value.slice(0, -1);
                }
                if(e.target.value.length === 4 || e.target.value.length === 7){
                    e.target.value = e.target.value+"/";
                }
            }
        }else{
            if(e.target.value.length === 4 || e.target.value.length === 7){
                e.target.value = e.target.value.slice(0, -1);
            }
        }
    }
});

function inputDate(e){
    if(e.target.value.length > 10){
        e.target.value = e.target.value.slice(0, -1);
    }else{
        if(e.inputType !== "deleteContentBackward"){
            if(e.target.value.length <= 4 || (e.target.value.length >= 5 && e.target.value.length <=7) || (e.target.value.length >= 8 && e.target.value.length <=10)){
                if(!e.data.match(/[0-9]/gm)){
                    e.target.value = e.target.value.slice(0, -1);
                }
                if(e.target.value.length === 4 || e.target.value.length === 7){
                    e.target.value = e.target.value+"/";
                }
            }
        }else{
            if(e.target.value.length === 4 || e.target.value.length === 7){
                e.target.value = e.target.value.slice(0, -1);
            }
        }
    }
}