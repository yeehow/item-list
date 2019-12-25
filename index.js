var itemDisplay = document.getElementById('display');

var filtered = [];
var seasonSelection = 2;
var raritySelection = null;
var weaponSelection = null;
var cosmeticSelection = null;

var rarityColor = ['#b2f252', '#2196F3', '#E040FB', '#FBC02D', '#ed4242', '#171717', '#fff53d'];
var classes = [1, 0, 3, 6, 5, 4, 7, 8, 9, 12, 10, 13, 14];

var index = 0;
function getcomment(i) {
    $('#cm_btn').attr('onclick', `comment(${i})`)
}
function filter(season, rarity, weapon, cosmetic) {
    if (season == null && rarity == null && weapon == null && cosmetic == null) {
        console.log("none");
        items.forEach(function (element, index) {
            element.index = index;
            filtered.push(element);
        });
    }
    if (season != null) {
        items.forEach(function (element, index) {
            if (season == 1 && element.seas == null) {
                element.index = index;
                filtered.push(element);
            }
            else if (season == 2 && element.seas == 2) {
                element.index = index;
                filtered.push(element);
            }
        });
    }
    if (rarity != null) {
        if (filtered.length > 0) {
            var temp = []
            filtered.forEach(function (element, index) {
                if (element.rarity == rarity) {
                    temp.push(element);
                }
            });
            filtered = temp;
        }
        else {
            items.forEach(function (element, index) {
                if (element.rarity == rarity) {
                    element.index = index;
                    filtered.push(element);
                }
            });
        }
    }
    if (weapon != null && cosmetic == null) {
        if (filtered.length > 0) {
            var temp = [];
            filtered.forEach((element) => {
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
            items.forEach(function (element, index) {
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
            filtered.forEach((element) => {
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
            items.forEach(function (element, index) {
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
        filtered.sort(function (a, b) {
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
        if (1 == t.type) return 'viewer.html?class=9&hat=' + index ;
        else if (2 == t.type) return 'viewer.html?class=9&back=' + index ';
        else if (3 == t.type) return 'viewer.html?class=9&hidePlayer&melee=' + index ;
        else if (null != t.weapon) {
            for (var n = null, r = 0; r < classes.length; r++)
                if (classes[r] == t.weapon - 1) {
                    n = r;
                    break;
                }
            if (n != null) {
                return 'viewer.html?class=' + n + '&hidePlayer&nosup&skinIdP=' + index;
            }
        }
}

function modal3d(n, d, c) {
    $("#_3dmodals , #backgr").fadeIn("slow");
    $("#_3diframe").attr("src", d);
    $("#_3diname").html(n);
    $("#_3dicreator").html(c);
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

        // var model = document.createElement('a');
        // model.className = 'model';
        // model.href = getModelViewerURL(now.index);
        // model.target = '_blank';
        // model.textContent = 'Model';
        // var pid = now.id;

        var prev3d = document.createElement('a');
        prev3d.className = 'model';

        prev3d.textContent = 'Preview';
        prev3d.href = `javascript:modal3d('${now.name}','${getModelViewerURL(now.index)}','By: ${creator()}');getcomment(${now.index})`
        button.appendChild(cost);
        //button.appendChild(model);
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
    $('#loadButton').attr('onclick', 'displayItems()')
}
function run(type, value) {
    filtered = [];

    itemDisplay.innerHTML = '';

    seasonSelection = type == 3 ? value : seasonSelection;
    raritySelection = type == 0 ? value : raritySelection;
    weaponSelection = type == 1 ? value : weaponSelection;
    cosmeticSelection = type == 2 ? value : cosmeticSelection;

    if (type == 1) {
        cosmeticSelection = null;
    } else if (type == 2) {
        weaponSelection = null;
    }

    console.log(seasonSelection, raritySelection, weaponSelection, cosmeticSelection);

    index = 0;

    filter(seasonSelection, raritySelection, weaponSelection, cosmeticSelection);
}

window.onload = (event) => {
    //filter();
    run(3, 2);
}

window.onscroll = function (ev) {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        if (index < filtered.length) {
            //displayItems();
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
        console.log("On mobile");
    }
}
mobile_check()

function yeehow() {
    return `
    <div class="modal_data">
    <a class="mt_class">social / contact</a>
      <ul>
      <li><a href="https://krunker.io/social.html?p=profile&q=yeehow">Krunker Profile</a></li>
      <li><a>Discord: </a>yeehow#8456</li>
      </ul>
    </div>
    `
}
function hoodgail() {
    return `
    <div class="modal_data">
    <a class="mt_class">social / contact</a>
      <ul>
      <li><a href="https://krunker.io/social.html?p=profile&q=Hoodgail">Krunker Profile</a></li>
      <li><a href="http://hoodgail.dx.am/">website</a> (old)</li>
      <li><a>Discord: </a>Hoodgail#5408</li>
      </ul>
    </div>
    `
}
function m_1() {
    return `
    <div class="modal_data">
        <a class="mt_class">Creators</a>
        <ul>
      <li onclick="openModal('Yeehow',yeehow())"><a>yeehow</a></li>
      <li onclick="openModal('Hoodgail',hoodgail())"><a>Hoodgail</a></li>
       </ul>
    </div>
    `
}
function openModal(n, d) {
    $(".modal").html('')
    $("#backgr , .modal").fadeIn('slow');
    $(".modal").append(`
         <div class="modal_name">${n}</div>
         ${d}
        `)
}
function closeModal() {
    $("#backgr , .modal").fadeOut('slow');
    $(".modal").html('')
}
