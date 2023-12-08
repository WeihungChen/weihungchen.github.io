import { fetchPost } from "../common/web.js";
import { serverUrl } from "../common/def_global.js";

exportTable();

async function exportTable()
{
    var content = {
        "method": "exporttable",
        "data": {}
    }
    var result = await fetchPost(serverUrl + '/api', content, "application/json");
    if(result[0] == 200)
    {
        const scriptElement = document.createElement('script');
        scriptElement.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.0/xlsx.full.min.js';
        document.head.appendChild(scriptElement);
        const xlsxLoaded = new Promise(resolve => {
            scriptElement.onload = resolve;
        });
        xlsxLoaded.then(() => {
            const ws = XLSX.utils.json_to_sheet(result[1]);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet 1');
            XLSX.writeFile(wb, '報到名單.xlsx');
        });
    }
}