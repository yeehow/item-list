//used for import
// items.forEach(function (element, index) {
//     if (element.seas == null) {
//         element["seas"] = 1;
//     }
//     element["i"] = index;
// });

//console.log(items);

window.onload = function () {
    filter("seas", 3);
};

var filters = {};
var result = [];
var displayIndex = 0;
var chunks = [];
var scroll = true;
var displayDiv = document.getElementById("display");
var itemCount = document.getElementById("itemCount");
var seasonLabel = document.getElementById("season");
var rarityLabel = document.getElementById("rarity");
var weaponLabel = document.getElementById("weapon");
var cosmeticLabel = document.getElementById("cosmetic");

//change filters
function filter(property, value) {
    if (value == "all") {
        delete filters[property];
        if (property == "weapon" || property == "type") {
            delete filters["weapon"];
            delete filters["type"];
        }
    } else {
        if (property == "weapon") {
            delete filters.type;
        } else if (property == "type") {
            delete filters.weapon;
        }
        filters[property] = value;
    }

    seasonLabel.textContent = filters["seas"] != null ? `Season ${filters["seas"]} ▼` : "Season ▼";
    rarityLabel.textContent = filters["rarity"] != null ? `${rarities[filters["rarity"]]} ▼` : "Rarity ▼";
    if (filters["type"] == 3) {
        weaponLabel.textContent = weapons[0];
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

    runFilter();
}

//execute filter
function runFilter() {
    result = items.filter(function (item) {
        for (var key in filters) {
            if (item[key] === undefined || item[key] != filters[key])
                return false;
        }
        return true;
    });
    console.log(result);
    displayDiv.innerHTML = "";
    displayIndex = 0;
    display();
}

function sortArray(array) { //https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/
    return array.sort((a, b) => (a.rarity > b.rarity) ? -1 : (a.rarity === b.rarity) ? ((a.size > b.size) ? -1 : 1) : 1);
}

//sort array and seperate into chunks (pagination)
function display() {
    sortArray(result);
    itemCount.textContent = `${result.length} Items`;
    chunks = chunkArray(result, 40);
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
    return result
}

function addItem(item) {
    scroll = true;
    var model = item.type == 4 ? "" : `<a href='${getViewer(item)}' target='_blank'>Model</a>`;
    var sprayAnimation = item.frames != null ? `animation: sprayAni${item.frames} ${(item.frameT / 1000) * item.frames}s steps(${item.frames}) infinite;` : "";
    displayDiv.innerHTML += `
    <div class="item${item.rarity == 6 ? " rainbowBorder" : ""}" style="border-color: ${rarityColor[item.rarity]}; background-image: url(${getPreview(item)}); ${sprayAnimation}">
        <p class="itemName">${item.name}</p>
        <div class="itemDetails">
            <a href="${getPrice(item)}" target="_blank">Price</a>
            <a href="${getListings(item)}" target="_blank">Listing</a>
            ${model} 
        </div>
    </div>`;
}

//todo only call function if filter has gone off
window.onscroll = function (ev) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && scroll == true) {
        scroll = false;
        displayChunk();
    }
}

//krunker js (I didn't write this)
function getPreview(a) {
    return "https://assets.krunker.io/textures/" + (a.type && 4 == a.type ? "sprays/" + a.id : "previews/" + (a.type && (3 > a.type || 5 == a.type) ? "cosmetics/" + a.type + "_" + a.id + (a.tex ? "_" + a.tex : "") : types[a.type || 0] + (a.type && 3 == a.type ? a.id + (null == a.pat ? null == a.tex ? "" : "_" + a.tex : "_c" + a.pat) : (a.weapon || 0) + "_" + (null == a.mid ? null == a.pat ? a.tex ? a.tex : a.id : "c" + a.pat : "m" + a.mid + (null == a.midT ? "" : "_" + a.midT))))) + ".png";
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
        else if (null == a.weapon && 5 == a.type)
            return "https://krunker.io/viewer.html?class=9&dye=" + a.i;
        else if (h[a.weapon - 1].secondary)
            return "https://krunker.io/viewer.html?hidePlayer&swap=-1&nosup&skinIdS=" + a.i;
        else {
            for (var t = null, r = 0; r < v.length; r++)
                if (v[r].loadout[0] == a.weapon - 1) {
                    t = r;
                    break
                }
            if (t != null) {
                return "https://krunker.io/viewer.html?class=" + t + "&hidePlayer&nosup&skinIdP=" + a.i;
            }
        }
}

function getPrice(a) {
    return `https://krunker.io/social.html?p=itemsales&i=${a.i}`;
}

function getListings(a) {
    return `https://krunker.io/social.html?p=market&i=${a.i}`;
}
