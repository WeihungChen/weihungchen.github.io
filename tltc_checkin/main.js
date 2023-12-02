import { fetchPost } from "../common/web.js";
import { serverUrl } from "../common/def_global.js";

document.getElementById('btn_submit').addEventListener('click', SubmitData);

async function SubmitData()
{
    event.preventDefault(); //prevent reloading html

    var content = {
        "method": "submitcheckin",
        "data": {
            "Name": document.getElementById('name').value,
            "Term": document.getElementById('term').value
        }
    }
    var current = new Date();
    current = current.getFullYear() - 2011;
    if(content.data.Term > current)
    {
        alert('請確認所屬第幾屆');
        return;
    }
    var result = await fetchPost(serverUrl + '/api', content, "application/json");
    if(result[0] == 200)
        document.location.href="./done.html";
}