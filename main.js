import { fetchPost } from "./common/web.js";
import { serverUrl } from "./common/def_global.js";

document.getElementById('myImg').addEventListener('click', ImgClicked);
var tmpEvent = {"offsetX": 0, "offsetY": 0};
ImgClicked(tmpEvent);
var currentType = 0;

async function tableClicked()
{
    if(currentType == 0)
    {
        var content = {
            "method": "getstudentsinfo",
            "data": {
                "CityName": this.innerHTML
            }
        }
        var result = await fetchPost(serverUrl + '/api', content, "application/json");
        if(result[0] != 200)
            return;
        if(result[1].ID != null)
            document.getElementById('myImg').src = result[1].ID + ".png";
        ShowInfo(result[1].Col, result[1].Header, result[1].Info);
        currentType = 1;
    }
    else if(currentType == 1)
    {
        var content = {
            "method": "getstudentsinfo",
            "data": {
                "Organization": this.innerHTML
            }
        }
        var result = await fetchPost(serverUrl + '/api', content, "application/json");
        if(result[0] != 200)
            return;
        if(result[1].ID != null)
            document.getElementById('myImg').src = result[1].ID + ".png";
        ShowInfo(result[1].Col, result[1].Header, result[1].Info);
        currentType = 2;
    }
}

async function ImgClicked(event)
{
    var x = event.offsetX;
    var y = event.offsetY;

    var content = {
        "method": "imgcheck",
        "data": {
            "X": x,
            "Y": y
        }
    }

    var result = await fetchPost(serverUrl + '/api', content, "application/json");
    if(result[0] != 200)
        return;

    var imgPath = result[1].Img;
    if(imgPath != '')
        document.getElementById('myImg').src = imgPath;

    const myTable = document.getElementById('myTable');
    if(imgPath == '0.png')
        currentType = 0;
    else
        currentType = 1;
    ShowInfo(result[1].Col, result[1].Header, result[1].Info);
}

function ShowInfo(col, header, info)
{
    const myTable = document.getElementById('myTable');
    myTable.innerHTML = '';
    var thead = document.createElement('thead');
    for(var i=0; i<header.length; i++)
    {
        var tr = document.createElement('tr');
        for(var j=0; j<header[i].length; j++)
        {
            var th = document.createElement('th');
            th.innerHTML = header[i][j];
            if(header[i].length == 1)
                th.colSpan = col;
            tr.appendChild(th);
        }
        if(header.length > 1 && i == 0)
            tr.className = 'header1';
        else
            tr.className = 'header2';
        thead.appendChild(tr);
    }
    myTable.appendChild(thead);
    for(var i=0; i<info.length; i++)
    {
        var row = myTable.insertRow(-1);
        for(var j=0; j<info[i].length; j++)
        {
            var cell = row.insertCell(-1);
            cell.innerHTML = info[i][j];
            if(j == 0)
                cell.className = 'ctbclc';
        }
    }
    var tbclc = document.querySelectorAll('.ctbclc');
    for(var i=0; i<tbclc.length; i++)
        tbclc[i].addEventListener('click', tableClicked);
}

function ShowOneCity(organizations)
{
    const myTable = document.getElementById('myTable');
    myTable.innerHTML = '<thead><tr><th>服務機構</th><th>人數</th></tr></thead>';
    myTable.innerHTML += '<tbody>';

    if(organizations != null)
    {
        for(var i=0; i<organizations.length; i++)
        {
            var tmp = '<tr><td class="ctbclc">' + organizations[i].Organization + '</td>';
            tmp += '<td>' + organizations[i].amount + '</td></tr>';
            myTable.innerHTML += tmp;
        }
    }
    myTable.innerHTML += '</tbody>';

    var tbclc = document.querySelectorAll('.ctbclc');
    for(var i=0; i<tbclc.length; i++)
        tbclc[i].addEventListener('click', tableClicked);
}

function ShowWholeData(cities)
{
    const myTable = document.getElementById('myTable');
    myTable.innerHTML = '<thead><tr><th>城市</th><th>人數</th></tr></thead>';
    myTable.innerHTML += '<tbody>';

    if(cities != null)
    {
        for(var i=0; i<cities.length; i++)
        {
            var tmp = '<tr><td class="ctbclc">' + cities[i].Name + '</td>';
            tmp += '<td>' + cities[i].amount + '</td></tr>';
            myTable.innerHTML += tmp;
        }
    }
    myTable.innerHTML += '</tbody>';

    var tbclc = document.querySelectorAll('.ctbclc');
    for(var i=0; i<tbclc.length; i++)
        tbclc[i].addEventListener('click', tableClicked);
}