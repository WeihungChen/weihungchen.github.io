import { fetchPost } from "../common/web.js";
import { serverUrl } from "../common/def_global.js";

document.getElementById('btn_start').addEventListener('click', Start);
document.getElementById('btn_next').addEventListener('click', Next);

var people = [];
var currentItem = -1;
const items = [
    ["全方位安心帶 (移位腰帶)", 2],
    ["任我行移位滑墊", 2],
    ["保護性限制帶 (掛包)", 2],
    ["TUSB隨身碟", 10],
    ["台灣居護咖啡盒 (5包)", 6],
    ["品按摩球", 3],
    ["彈力帶1.8M", 3],
    ["VIT-C+鋅發泡錠", 3],
    ["B-Com+C發泡錠", 3],
    ["德國黑森林精油系列-冰森活萬用精油 (滾珠)", 2],
    ["德國黑森林精油系列-ご森活關鍵精油 (滾珠)", 2],
    ["前香氛乾洗手噴霧 (到芳療攤位添加喜歡的精油香氛)", 10],
    ["蟲玫瑰嫩白保濕面膜+藍銅胜肽緊緻面膜體驗組 (2片)", 5]
];

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
        document.getElementById('item').innerHTML = items[currentItem][0] + ' ' + items[currentItem][1] + '名';
        document.getElementById('btn_start').style.display = "block";
    }
    document.getElementById('btn_next').style.display = "none";
    document.getElementById('winners').innerHTML = "";
}

async function Next()
{
    event.preventDefault(); //prevent reloading html
    nextItem();
}

async function Start()
{
    event.preventDefault(); //prevent reloading html
    var count = items[currentItem][1];
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
            await sleep(100);
        }
        people.splice(randomInt, 1);
    }
    document.getElementById('btn_start').style.display = "none";
    if(currentItem + 1 < items.length && people.length > 0)
        document.getElementById('btn_next').style.display = "block";
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }