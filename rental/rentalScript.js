let timeBox= document.getElementById("time-container");
let searchBox = document.getElementById("search-query");
let resultBox = document.getElementById("search-results");
let rentButton = document.getElementById("rent-button");
let overlayBox = $("overlay");
let report = $("info");
let clients;
let crossButton = document.getElementById("cross-button");

crossButton.onclick = function(){
    overlayBox.style.display = "none";
}


window.onload = function(){
    timeBox.innerHTML = new Date().toLocaleString().split(",").join("  |  ");

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            clients = JSON.parse(xhr.responseText);
        }
    }
    xhr.open("GET","rentalclients.json",true);
    xhr.send(null);

    searchBox.addEventListener("keyup",function(e){ searchHandler(e);},false);
}

function searchHandler(){
    resultBox.innerHTML = "";
    resultBox.style.display = "block";
    clients.forEach(function(value){
        if( value["last_name"].toLowerCase().startsWith(searchBox.value.toLowerCase())){
            resultBox.innerHTML += "<div class='result' id='"+value['phone']+"'>"+value['last_name']+", "+value['first_name']+"</div>";
        }
    });

    if(searchBox.value === ""){
        resultBox.style.display = "none";
    } else {
        let results = document.querySelectorAll(".result");
        for( let i = 0; i< results.length; i++){
            results[i].addEventListener("click",function(e){ clientClickHandler(e);}, false);
        }
    }
}

function clientClickHandler(e){
    let selected;
    resultBox.style.display = "none";
    clients.forEach(function(val){
        if( val["phone"] === e.target.id){
            selected = val;
            $("first-name").value = val.first_name;
            $("last-name").value = val.last_name;
            $("address").value = val.address;
            $("state-province").value = val.state_prov;
            $("email").value = val.email;
            $("phone").value = val.phone;
        }
    });

    let working = document.getElementsByClassName("work");
    for(let i = 0; i< working.length; i++) {
        working[i].removeAttribute("disabled");
    }

    rentButton.addEventListener("click",function(e){
        if(document.forms[0].checkValidity()){
            e.preventDefault();
            calcRent(selected);
        }
    }, false);
}

function getSelectedItem(arr){
    for( let i=0; i< arr.length; i++){
        if(arr[i].checked === true)
            return arr[i];
    }
    return false;
}

function $(id){
    return document.getElementById(id);
}

function calcRent(client){
    let choice = getSelectedItem(document.getElementsByName("choices"));

    let extra = 0;

    extra += ($("roof").checked) ? 5 : 0;
    extra += ($("gps").checked) ? 10: 0;
    extra += ($("rack").checked) ? 5: 0;
    let totalCost = 0;
    switch(choice.value){
        case "compact":
            totalCost += 15;
            break;
        case "mid-size":
            totalCost += 20;
            break;
        case "luxury":
            totalCost += 35;
            break;
        case "van/truck":
            totalCost += 40;
            break;
    }

    let days = parseFloat($("days").value);

    totalCost += extra;
    totalCost *= days;

    overlayBox.style.display = "block";
    report.innerHTML = "" +
        "<b>First Name</b>: "+ client.first_name+"<br />" +
        "<b>Last Name</b> : "+client.last_name  + "<br />" +
        "<b>Address</b>   : "+ client.address + "<br />"+
        "<b>State/Prov</b>: "+client.state_prov + "<br />" +
        "<b>Email</b>     : "+ client.email + "<br />" +
        "<b>Phone</b>     : "+ client.phone + "<br />" +
        "<br /><hr /><br />"+
        "<b>Car Choice</b>: "+choice.value.toUpperCase() + "<br />"+
        "<b>Extras</b>    : " + (($("roof").checked) ? "Roof Pack ," : "") + (($("rack").checked) ? "Bicycle Rack ," : "") + (($("gps").checked) ? " GPS ," : "") + (($("child-seat").checked) ? "Child Seat" : "") +
        "<br /><b>Extra Cost</b>: $"+extra+ "<br />" +
        "<b>Total Cost</b>: $"+totalCost;


}