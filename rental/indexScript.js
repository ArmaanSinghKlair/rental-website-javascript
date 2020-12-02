let timeBox= document.getElementById("time-container");
window.onload = function(){
    timeBox.innerHTML = new Date().toLocaleString().split(",").join("  |  ");


}
