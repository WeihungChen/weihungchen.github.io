import { fetchPost } from "../common/web.js";
import { serverUrl } from "../common/def_global.js";

document.getElementById('btn_start').addEventListener('click', Start);
document.getElementById('btn_next').addEventListener('click', Next);
document.getElementById('btn_summary').addEventListener('click', Summary);

var people = [];
var currentItem = -1;
const items = [
    ["全方位安心帶 (移位腰帶)", "強生醫療", 2],
    ["任我行移位滑墊", "強生醫療", 2],
    ["保護性限制帶 (掛包)", "強生醫療", 2],
    ["德國黑森林精油系列-冰森活萬用精油 (滾珠)", "陳虹霏芳療師", 2],
    ["德國黑森林精油系列-ご森活關鍵精油 (滾珠)", "陳虹霏芳療師", 2],
    ["前香氛乾洗手噴霧 (到芳療攤位添加喜歡的精油香氛)", "陳虹霏芳療師", 10],
    ["蟲玫瑰嫩白保濕面膜+藍銅胜肽緊緻面膜體驗組 (2片)", "陳虹霏芳療師", 5],
    ["VIT-C+鋅發泡錠", "黃裕仁（躍獅光明藥局)", 3],
    ["B-Com+C發泡錠", "黃裕仁（躍獅光明藥局)", 3],
    ["USB隨身碟", "吳炯麟學長", 10],
    ["台灣居護咖啡盒 (5包)", "台灣居護", 6],
    ["品按摩球", "愛迪樂", 3],
    ["彈力帶1.8M", "愛迪樂", 3],
    ["禮物", "涂秀美執行長", 3]
];
var winners_eachItem = [];

await Init();

async function Init()
{
    nextItem();
    const content = {
        "method": "getallcheckedin"
    };
    var result = await fetchPost(serverUrl + '/api', content, "application/json");
    if(result[0] == 200)
        people = result[1].People;
}

async function nextItem()
{
    currentItem++;
    if(items.length > currentItem)
    {
        document.getElementById('item').innerHTML = items[currentItem][0] + ' ' + items[currentItem][2] + '名';
        document.getElementById('provider').innerHTML = "提供單位: " + items[currentItem][1];
        document.getElementById('btn_start').style.display = "block";
    }
    else
        document.getElementById('btn_summary').style.display = "block";
    document.getElementById('item').style.display = 'block';
    document.getElementById('provider').style.display = 'block';
    document.getElementById('winners').style.display = 'block';
    document.getElementById('form-container').style.maxWidth = "500px";
    document.getElementById('btn_next').style.display = "none";
    document.getElementById('btn_summary').style.display = "none";
    document.getElementById('show_winners').style.display = "none";
    document.getElementById('winners').innerHTML = "";
}

async function exportExcel()
{
    var myJson = [];
    for(var i=0; i<items.length; i++)
    {
        if(winners_eachItem[i])
        {
            for(var j=0; j<winners_eachItem[i].length; j++)
            {
                myJson[myJson.length] = {
                    "品項": items[i][0],
                    "得獎者": winners_eachItem[i][j]
                };
            }
        }
    }
    const scriptElement = document.createElement('script');
    scriptElement.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js';
    document.head.appendChild(scriptElement);
    const xlsxLoaded = new Promise(resolve => {
        scriptElement.onload = resolve;
    });
    xlsxLoaded.then(() => {
        const ws = XLSX.utils.json_to_sheet(myJson);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
        XLSX.writeFile(wb, '得獎名單.xlsx');
    });
}

async function Summary()
{
    event.preventDefault(); //prevent reloading html
    document.getElementById('form-container').style.maxWidth = "none";
    document.getElementById('btn_summary').style.display = 'none';
    var myTable = document.getElementById('winners_table');
    document.getElementById('winners').innerHTML = '';
    document.getElementById('winners').style.display = 'none';
    document.getElementById('show_winners').style.display = 'block';
    document.getElementById('item').style.display = 'none';
    document.getElementById('provider').style.display = 'none';
    if(myTable == null)
        return;
    myTable.innerHTML = '';
    var thead = document.createElement('thead');
    var tr_head = document.createElement('tr');
    var th_item = document.createElement('th');
    th_item.innerHTML = '品項';
    var th_winners = document.createElement('th');
    th_winners.innerHTML = '得獎者';
    tr_head.appendChild(th_item);
    tr_head.appendChild(th_winners);
    thead.appendChild(tr_head);
    myTable.appendChild(thead);

    for(var i=0; i<items.length; i++)
    {
        var row = myTable.insertRow(-1);
        var cell_item = row.insertCell(-1);
        cell_item.innerHTML = items[i][0];
        var cell_winners = row.insertCell(-1);
        if(winners_eachItem.length > i)
        {
            for(var j=0; j<winners_eachItem[i].length; j++)
            {
                cell_winners.innerHTML += winners_eachItem[i][j];
                if(j < winners_eachItem[i].length - 1)
                    cell_winners.innerHTML += ' ';
            }
        }
    }

    if(currentItem + 1 == items.length || people.length == 0)
        exportExcel();
}

async function Next()
{
    event.preventDefault(); //prevent reloading html
    nextItem();
}

async function Start()
{
    event.preventDefault(); //prevent reloading html
    var count = items[currentItem][2];
    if(winners_eachItem.length == currentItem)
        winners_eachItem[currentItem] = [];

    for(var i=0; i<count; i++)
    {
        if(people.length == 0)
            break;
        var d = document.getElementById('winners');
        var id = "winner_" + i;
        d.innerHTML += '<label id="' + id + '"></label>';
        var randomInt = 0;
        for(var j=0; j<10; j++)
        {
            randomInt = Math.floor(Math.random() * people.length);
            document.getElementById(id).innerHTML = people[randomInt].Name + ' ';
            if(people[randomInt].Identity == '教職員')
                document.getElementById(id).innerHTML += people[randomInt].Identity;
            else
                document.getElementById(id).innerHTML += '第' + people[randomInt].Term + '屆';
            if(people.length > 1)
                await sleep(100);
        }
        var tmp = document.getElementById(id).innerHTML.split(' ');
        winners_eachItem[currentItem][i] = tmp[0] + '(' + tmp[1] + ')';
        people.splice(randomInt, 1);
    }
    document.getElementById('btn_start').style.display = "none";
    if(currentItem + 1 < items.length && people.length > 0)
        document.getElementById('btn_next').style.display = "block";
    document.getElementById('btn_summary').style.display = "block";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }