import { fetchPost } from "../common/web.js";
import { serverUrl } from "../common/def_global.js";

document.getElementById('btn_submit').addEventListener('click', SubmitData);
document.getElementById('identity').addEventListener('change', IdentityChanged);

async function SubmitData()
{
    event.preventDefault(); //prevent reloading html

    var content = {
        "method": "submitcheckin",
        "data": {
            "Name": document.getElementById('name').value,
            "Identity": document.getElementById('identity').value,
            "Term": document.getElementById('term').value
        }
    }
    var current = new Date();
    current = current.getFullYear() - 2011;
    if(content.data.Identity != '教職員' && !isNumeric(content.data.Term))
    {
        alert('請確認所屬第幾屆');
        return;
    }
    const term = parseInt(content.data.Term);
    console.log(term);
    console.log(current);
    console.log(content.data.Identity);
    if(content.data.Identity == '系友' && (term > current - 2 || term <= 0))
    {
        alert('請確認所屬第幾屆\n系友為第 1 - ' + (current-2) + '屆');
        return;
    }
    if(content.data.Identity == '應屆' && (term <= current - 2 || term > current))
    {
        alert('請確認所屬第幾屆\n應屆為第 ' + (current-1) + ' - ' + current + '屆');
        return;
    }
    var result = await fetchPost(serverUrl + '/api', content, "application/json");
    if(result[0] == 200)
        document.location.href="./done.html";
}

function IdentityChanged()
{
    if(this.value == '教職員')
    {
        document.getElementById('d_term').style.display = 'none';
        document.getElementById('term').value = '';
    }
    else
        document.getElementById('d_term').style.display = 'block';
}

function isNumeric(str) {
    if(str == '')
        return false;
    return /^\d+$/.test(str) || /^\d*\.\d+$/.test(str);
}