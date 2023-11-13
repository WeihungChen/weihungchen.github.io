import { fetchPost } from "./common/web.js";
import { serverUrl } from "./common/def_global.js";

document.getElementById('myImg').addEventListener('click', ImgClicked);

async function ImgClicked(event)
{
    var image = document.getElementById('myImg');

    var x = event.clientX - image.offsetLeft;
    var y = event.clientY - image.offsetTop;

    console.log('x,y=' + x + ',' + y);

    var content = {
        "method": "imgcheck",
        "data": {
            "X": x,
            "Y": y
        }
    }

    var result = await fetchPost(serverUrl + '/api', content, "application/json");
    console.log(result);

    var imgPath = result[1].Img;
    if(imgPath != '')
    {
        document.getElementById('myImg').src = imgPath;
    }

    const myTable = document.getElementById('myTable');
    myTable.innerHTML = '<thead><tr><th>服務機構</th><th>人數</th></tr></thead>';
    myTable.innerHTML += '<tbody>';

    var organizations = result[1].Organizations;
    for(var i=0; i<organizations.length; i++)
    {
        console.log(organizations[i]);
        var tmp = '<tr><td>' + organizations[i].Organization + '</td>';
        tmp += '<td>' + organizations[i].amount + '</td></tr>';
        myTable.innerHTML += tmp;
    }
    myTable.innerHTML += '</tbody>';
}