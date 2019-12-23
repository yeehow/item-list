var itemDisplay = document.getElementById('display');

var filtered = [];
var raritySelection = null;
var weaponSelection = null;
var cosmeticSelection = null;

var rarityColor = ['#b2f252', '#2196F3', '#E040FB', '#FBC02D', '#ed4242', '#171717', '#fff53d'];
var classes = [1, 0, 3, 6, 5, 4, 7, 8, 9, 12, 10, 13, 14];

var index = 0;

function filter(rarity, weapon, cosmetic) {
    if (rarity != null) {
        items.forEach(function(element, index) {
            if (element.rarity == rarity) {
                element.index = index;
                filtered.push(element);
            }
        });
        console.log(filtered);
    } else if (rarity == null && weapon == null && cosmetic == null) {
        items.forEach(function(element, index) {
            element.index = index;
            filtered.push(element);
        });
    }
    if (weapon != null && cosmetic == null) {
        if (filtered.length > 0) {
            var temp = [];
            filtered.forEach((element)=>{
                if (weapon == 'all' && (element.weapon != null || element.keyW == 'Knife' || element.keyW == 'Axe')) {
                    temp.push(element);
                }
                if (weapon == 16 && (element.keyW == 'Knife' || element.keyW == 'Axe')) {
                    temp.push(element);
                }
                if (element.weapon == weapon) {
                    temp.push(element);
                }
            }
            );
            filtered = temp;
            console.log(filtered);
        } else {
            items.forEach(function(element, index) {
                if (weapon == 'all' && (element.weapon != null || element.keyW == 'Knife' || element.keyW == 'Axe')) {
                    element.index = index;
                    filtered.push(element);
                }
                if (weapon == 16 && (element.keyW == 'Knife' || element.keyW == 'Axe')) {
                    element.index = index;
                    filtered.push(element);
                }
                if (element.weapon == weapon) {
                    element.index = index;
                    filtered.push(element);
                }
            });
            console.log(filtered);
        }
    }
    if (cosmetic != null && weapon == null) {
        if (filtered.length > 0) {
            var temp = [];
            filtered.forEach((element)=>{
                if (cosmetic == 'all' && element.type != null && element.type != 3) {
                    temp.push(element);
                }
                if (element.type == cosmetic) {
                    temp.push(element);
                }
            }
            );
            filtered = temp;
            console.log(filtered);
        } else {
            items.forEach(function(element, index) {
                if (cosmetic == 'all' && element.type != null && element.type != 3) {
                    element.index = index;
                    filtered.push(element);
                }
                if (element.type == cosmetic) {
                    element.index = index;
                    filtered.push(element);
                }
            });
            console.log(filtered);
        }
    }

    if (filtered.length > 0) {
        filtered.sort(function(a, b) {
            var keyA = new Date(a.rarity)
              , keyB = new Date(b.rarity);
            if (keyA < keyB)
                return -1;
            if (keyA > keyB)
                return 1;
            return 0;
        }).reverse();
    }

    console.log(filtered);

    displayItems();
}

function getPreviewURL(index) {
    const start = 'https://assets.krunker.io';
    const build = '?build=mWa2r';
    const types = ['weapons/weapon_', 'hats/hat_', 'body/body_', 'melee/melee_'];

    const t = items[index];

    //taken from krunker js. i didn't write this
    return (start + '/textures/previews/' + (t.type && 3 > t.type ? 'cosmetics/' + t.type + '_' + t.id + (t.tex ? '_' + t.tex : '') : types[t.type || 0] + (t.type && 3 == t.type ? t.id + (null == t.tex ? '' : '_' + t.tex) : (t.weapon || 0) + '_' + (null == t.mid ? null == t.pat ? (t.tex ? t.tex : t.id) : 'c' + t.pat : 'm' + t.mid + (null == t.midT ? '' : '_' + t.midT.split('_').slice(-1)[0])))) + '.png' + build);
}
function getModelViewerURL(index) {
    //taken from krunker js. i didn't write this
    var t = items[index];
    if (t)
        if (1 == t.type)
            return '/viewer.html?class=9&hat=' + index;
        else if (2 == t.type)
            return '/viewer.html?&class=9&back=' + index;
        else if (3 == t.type)
            return '/viewer.html?class=9&melee=' + index;
        else if (null != t.weapon) {
            for (var n = null, r = 0; r < classes.length; r++)
                if (classes[r] == t.weapon - 1) {
                    n = r;
                    break;
                }
            if (n != null) {
                return '/viewer.html?class=' + n + '&hidePlayer&nosup&skinIdP=' + index;
            }
        }
}

function modal3d(n, d, c) {
    $("#_3dmodals , #backgr").fadeIn("slow")
    $("#_3diframe").attr("src", d)
    $("#_3diname").html(n)
    $("#_3dicreator").html(c)

}
function close3d() {
    $("#_3dmodals , #backgr").fadeOut("slow")
    $("#_3diframe").attr("src", "")
    $("#_3diname").html("")
    $("#_3dicreator").html('')
}
function displayItems() {
    //console.log(index);

    if (filtered.length > index + 50) {
        setLoadDisplay(true);
    } else {
        setLoadDisplay(false);
    }

    for (var i = index; i < index + 50; i++) {
        if (i == filtered.length) {
            console.log('break');
            break;
        }
        var now = filtered[i];
        function creator() {
            if (now.creator == undefined || now.creator == null) {
                return "Krunker.io"
            } else {
                return now.creator
            }
        }
        var item = document.createElement('div');
        item.className = 'item';

        var title = document.createElement('p');
        title.textContent = now.name;
        title.style.color = rarityColor[now.rarity];

        var image = document.createElement('img');
        image.src = getPreviewURL(now.index);

        var button = document.createElement('div');
        button.className = 'button';

        var cost = document.createElement('a');
        cost.href = `https://krunker.io/social.html?p=itemsales&i=${now.index}`;
        cost.target = '_blank';
        cost.className = 'cost';
        cost.textContent = 'Price';

        var model = document.createElement('a');
        model.className = 'model';
        model.href = getModelViewerURL(now.index);
        model.target = '_blank';
        model.textContent = 'Model';
        var pid = now.id;

        var prev3d = document.createElement('a');
        prev3d.className = 'prev3d';

        prev3d.textContent = 'prev ';
        prev3d.href = `javascript:modal3d('${now.name}','${getModelViewerURL(now.index)}','By: ${creator()}')`
        button.appendChild(cost);
        button.appendChild(model);
        button.appendChild(prev3d);

        item.appendChild(title);
        item.appendChild(image);

        item.appendChild(button);

        itemDisplay.appendChild(item);
    }
    index += 50;
}

function setLoadDisplay(state) {
    document.getElementById('loadButton').style.display = state ? 'block' : 'none';
}

function run(type, value) {
    filtered = [];

    itemDisplay.innerHTML = '';

    raritySelection = type == 0 ? value : raritySelection;
    weaponSelection = type == 1 ? value : weaponSelection;
    cosmeticSelection = type == 2 ? value : cosmeticSelection;

    if (type == 1) {
        cosmeticSelection = null;
    } else if (type == 2) {
        weaponSelection = null;
    }

    console.log(raritySelection, weaponSelection, cosmeticSelection);

    index = 0;

    filter(raritySelection, weaponSelection, cosmeticSelection);
}

window.onload = (event)=>{
    filter();
}
;

window.onscroll = function(ev) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        if (index < filtered.length) {
            displayItems();
        }
    }
}
;
//Others
function mobile_check() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        $('#_3diframe').css({
            'height': '251px',
            'width': '555px',
            'margin-top': '20px'
        });
        console.log("On mobile")
    }
}
mobile_check()
