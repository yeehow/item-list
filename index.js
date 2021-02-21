window.onload = setTimeout( function () {
    // loadUpdates();
    Newfilter();
    filter('seas', 'all');

}, 400);

var filters = {};
var result = [];

var newLabel = document.getElementById("newest");
var displayIndex = 0;
var chunks = [];
var scroll = true;
var displayDiv = document.getElementById("display");
var categoryLabel = document.getElementById("category");
var rarityLabel = document.getElementById("rarity");
var weaponLabel = document.getElementById("weapon");
var cosmeticLabel = document.getElementById("cosmetic");
var searchInput = document.getElementById("search");

var FreeItem= [];
// var updateLabel = document.getElementById("updateLabel");
// updateLabel.textContent = updates[0].version;
fetch('https://items.yee.how/').then(response => {
//console.log(response);
return response.json();
}).then(text => {
items = text;
setTimeout(window.onload, 150);
});

//display updates, it's turned off at the moment
function loadUpdates() {
    displayDiv.innerHTML = "";
    displayIndex = 0;
    updates.forEach(element => {
        var label = element.version;
        var date = new Date(element.timestamp * 1000);
        if (date instanceof Date && !isNaN(date.valueOf())) {
            label += " - " + date.toLocaleDateString(undefined, { year: "numeric", month: "numeric", day: "numeric" });
        }
        displayLabel(label);
        result = items.slice(element.startIndex, element.endIndex + 1);
        displayIndex = 0;
        display();
    });
}

//change filters
function filter(property, value) {

    if (value == "all") {
        delete filters[property];
        if (property == "weapon" || property == "type") {
            delete filters["weapon"];
            delete filters["type"];
        }
        if (property == "category") {
            delete filters.seas;
            delete filters.limT;
            delete filters.blackM;
        }
    } else {
        if (property == "weapon") {
            delete filters.type;
        } else if (property == "type") {
            delete filters.weapon;
        } else if (property == "seas") {
            delete filters.limT;
            delete filters.blackM;
        } else if (property == "limT") {
            delete filters.seas;
           delete filters.blackM;
        } else if (property == "blackM") {
            delete filters.limT;
            delete filters.seas;
        }
        filters[property] = value;
    }

    categoryLabel.textContent = filters["seas"] != null ? `Season ${filters["seas"]} ▼` : "Category ▼";
    categoryLabel.textContent = filters["limT"] != null ? `${filters["limT"]} ▼` : "Category ▼";
    categoryLabel.textContent = filters["blackM"] != null ? `Black Market ▼` : "Category ▼";
    rarityLabel.textContent = filters["rarity"] != null ? `${rarities[filters["rarity"]]} ▼` : "Rarity ▼";

    if (filters["type"] == 3) {
        weaponLabel.textContent = weapons[0] + " ▼";
    } else {
        weaponLabel.textContent = filters["weapon"] != null ? `${weapons[filters["weapon"]]} ▼` : "Weapon ▼";
    }

    if (filters["type"] != null) {
        if (filters["type"] != 3) {
            cosmeticLabel.textContent = `${cosmetics[filters["type"]]} ▼`;
        } else {
            cosmeticLabel.textContent = "Cosmetic ▼";
        }
    } else {
        cosmeticLabel.textContent = "Cosmetic ▼";
    }
    

    searchInput.value = "";
    runFilter();
}

//change filters for the new items
function Newfilter(PROPERTY, VALUE){

    var LAST = items.length;


    if (VALUE == "All") {
        delete filters[PROPERTY];
        if (PROPERTY == 'Yes'){
            delete filters[PROPERTY];
            delete filters.seas;
            delete filters.limT;
            delete filters.blackM;
            delete filters["weapon"];
            delete filters["type"];
            newLabel.textContent = "All New";
        } 
    } else if (VALUE == 'LOL') {
        delete filters.type;
    } else if (PROPERTY == 'type') {
        if (PROPERTY == "type") {
            delete filters.weapon;
        } else if (PROPERTY == "seas") {
            delete filters.limT;
            delete filters.blackM;
        } else if (PROPERTY == "limT") {
            delete filters.seas;
            delete filters.blackM;
        } else if (PROPERTY == "blackM") {
            delete filters.limT;
            delete filters.seas;
        }
        filters[PROPERTY] = VALUE;
    }

    if (PROPERTY == "type") {
        newLabel.textContent = "New " + `${cosmetics[filters["type"]]} ▼`;
    } else if (PROPERTY == "weapon"){
        newLabel.textContent = "New " + cosmetics[0] + " ▼";
    }

    searchInput.value = "";
    
    if (PROPERTY != 'weapon') {
        NEWrunFilter('', LAST);
    } else {
        NEWrunFilter('LMAO', LAST);
    }
}


function NEWrunFilter(LMAO, LAST) { 
    var lastItems = LAST - 44;
    console.log(lastItems);

    items = items.filter(item => item.rarity != undefined); 
    // all the free items won't be shown
    
    itemsNEW = items;
    itemsNEW = itemsNEW.filter((items) => { 
        return items.i > lastItems;
    });
    result = itemsNEW.filter(function (item) {
        for (var key in filters) { 
            if (item[key] === undefined || item[key] != filters[key]) {
                return false;
            }
        }
        return true;
    });

    if(LMAO == 'LMAO') {
        result = itemsNEW.filter(element => element.weapon != null); 
    }

    console.log(result);
    displayDiv.innerHTML = "";
    displayIndex = 0;
    displayLabel(`${result.length} Items`);
    display();
}

//execute filter
function runFilter() {
    items = items.filter(item => item.rarity !== undefined); //all the free items won't be shown

    result = items.filter(function (item) {
        for (var key in filters) {
            if (item[key] === undefined || item[key] != filters[key]) {
                return false;
            }
        }
        return true;
    });

    console.log(result);
    displayDiv.innerHTML = "";
    displayIndex = 0;
    displayLabel(`${result.length} Items`);
    display();
}


//search filter
function search(text) {
    clearFilters();

    text = text.value.toLowerCase();
    result = [];
    items.forEach(element => {
        var elementName = element.name.toLowerCase();
        if (elementName.includes(text) == true) {
            result.push(element);
        }
    });


    console.log(result);
    displayDiv.innerHTML = "";
    displayIndex = 0;
    displayLabel(`${result.length} Items`);
    display();
}

//used to reset filters while searching
function clearFilters() {
    filters = [];
    newLabel.textContent = "New ▼";
    categoryLabel.textContent = "Category ▼";
    rarityLabel.textContent = "Rarity ▼"
    weaponLabel.textContent = "Weapon ▼";
    cosmeticLabel.textContent = "Cosmetic ▼";
}

function sortArray(array) { //https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
    return array.sort((a, b) => (a.rarity > b.rarity) ? -1 : (a.rarity === b.rarity) ? ((a.size > b.size) ? -1 : 1) : 1);
}

//label used for item count and update label
function displayLabel(text) {
    var countDiv = document.createElement("div");
    countDiv.className = "displayLabelDiv";

    var count = document.createElement("span");
    count.className = "displayLabel";
    count.textContent = text;

    countDiv.appendChild(count);
    displayDiv.appendChild(countDiv);
}

//sort array and seperate into chunks (pagination)
function display() {
    
    sortArray(result);
    chunks = chunkArray(result, 500);
    displayChunk();
}

//add chunk of items
function displayChunk() {
    if (displayIndex >= chunks.length) {
        return;
    }
    chunks[displayIndex].forEach(element => {
        addItem(element);
    });
    displayIndex++;
}

//https://scotch.io/courses/the-ultimate-guide-to-javascript-algorithms/array-chunking
function chunkArray(array, size) {
    let result = []
    let arrayCopy = [...array]
    while (arrayCopy.length > 0) {
        result.push(arrayCopy.splice(0, size))
    }
    return result;
}

function addItem(item) {
    scroll = true;

    var div = document.createElement("div");
    div.className = "item" + (item.rarity == 6 ? " rainbowBorder" : "");

    div.style.borderColor = rarityColor[item.rarity];
    
    if (item.type == 4) {
        var img = document.createElement("div");
        img.className = "itemSprayImg";
        img.style.backgroundImage = `url(${getPreview(item)})`;
        if (item.frames != null) {
            img.style.animation = `sprayAni${item.frames} ${(item.frameT / 1000) * item.frames}s steps(${item.frames}) infinite`;
        }
        div.appendChild(img);
    } else {
        var img = document.createElement("img");
        img.src = getPreview(item);
        if (item.rgb != null) {
            img.className = "rgbHue";
        }
        div.appendChild(img);
    }

    var p = document.createElement("p");
    p.className = "itemName";
    p.textContent = item.name;
    div.appendChild(p);

    var divDetails = document.createElement("div");
    divDetails.className = "itemDetails";

    var price = document.createElement("a");
    price.textContent = "Price";
    price.href = getPrice(item);
    price.setAttribute('target', '_blank');
    divDetails.appendChild(price);

    var listing = document.createElement("a");
    listing.textContent = "Listing"
    listing.href = getListings(item);
    listing.setAttribute('target', '_blank');
    divDetails.appendChild(listing);

    if (item.type != 4) {
        var model = document.createElement("a");
        model.textContent = "Model";
        model.href = getViewer(item);
        model.setAttribute('target', '_blank');
        divDetails.appendChild(model);
    }

    div.appendChild(divDetails);

    displayDiv.appendChild(div);
    
}

//todo only call function if filter has gone off
window.onscroll = function () {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && scroll == true) {
        scroll = false;
        displayChunk();
    }
}

//krunker js (I didn't write this)
function getPreview(a) {
    return "https://assets.krunker.io/textures/" + (a.type && 4 == a.type ? "sprays/" + a.id : "previews/" + (a.type && (3 > a.type || 4 < a.type) ? "cosmetics/" + a.type + "_" + a.id + (a.tex ? "_" + a.tex : "") : types[a.type || 0] + (a.type && 3 == a.type ? a.id + (null == a.pat ? null == a.tex ? "" : "_" + a.tex : "_c" + a.pat) : (a.weapon || 0) + "_" + (null == a.mid ? null == a.pat ? a.tex ? a.tex : a.id : "c" + a.pat : "m" + a.mid + (null == a.midT ? "" : "_" + a.midT))))) + ".png" + `?v=${updates[0].version}`;
}

//krunker js (I didn't write this)
function getViewer(a) {
    if (a)
        if (1 == a.type)
            return "https://krunker.io/viewer.html?class=9&hat=" + a.i;
        else if (2 == a.type)
            return "https://krunker.io/viewer.html?class=9&back=" + a.i;
        else if (3 == a.type)
            return "https://krunker.io/viewer.html?class=9&hidePlayer&melee=" + a.i;
        else if (5 == a.type)
            return "https://krunker.io/viewer.html?class=9&dye=" + a.i;
        else if (6 == a.type)
            return "https://krunker.io/viewer.html?class=9&waist=" + a.i;
        else if (7 == a.type)
            return "https://krunker.io/viewer.html?class=9&face=" + a.i;
        else if (8 == a.type)
            return "https://krunker.io/viewer.html?class=9&shoe=" + a.i;
        else if (second.includes(a.weapon - 1))
            return "https://krunker.io/viewer.html?hidePlayer&swap=-1&nosup&skinIdS=" + a.i + "&secIndex=" + (a.weapon - 1);
        else {
            return "https://krunker.io/viewer.html?class=" + classForWeapon[a.weapon - 1] + "&hidePlayer&nosup&skinIdP=" + a.i;
        }
}

function getPrice(a) {
    return `https://krunker.io/social.html?p=itemsales&i=${a.i}`;
}

function getListings(a) {
    return `https://krunker.io/social.html?p=market&i=${a.i}`;
}

