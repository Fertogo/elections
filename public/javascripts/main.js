// Auto populate form if param given
console.log("hello there");

var url = window.location.href;
var query = url.split("=");

console.log(query)

if (query.length >= 2){

    var eid = query[query.length-1];
    document.getElementById("eid").value = eid;
}
