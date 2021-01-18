fetch('https://items.yee.how/').then(response => {
//console.log(response);
return response.json();
}).then(text => {
items = text;
setTimeout(window.onload, 120);
console.log(items);

})

