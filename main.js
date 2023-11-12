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
        "data": {
            "X": x,
            "Y": y
        }
    }

    var result = await fetchPost(serverUrl + '/imgcheck', content, "application/json");
    console.log(result);

    var imgPath = result[1].Img;
    if(imgPath != '')
    {
        document.getElementById('myImg').src = imgPath;
    }
}