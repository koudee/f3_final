const tableData = document.getElementById("table-data");
const sortBtnMarket = document.getElementById('sort-btn-market')
const sortBtnPercent = document.getElementById('sort-btn-percent')
const inputSearch = document.getElementById('input-search')

let result = [];
let marketCapOrder = 0;
let percentChangeOrder = 0;

const options = { method: 'GET', headers: { 'x-cg-demo-api-key': 'CG-wBFob72E4g4vkfBxHWMJ6hNo	' } };

function fetchData(check) {
    return new Promise((resolve, reject) => {
        if (check) {
            let callApi = fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=10`, options).then(response => response.json()).then((data) => {
                result = data
                return data;
            }).catch(error => console.log(error));
            resolve(callApi);
        } else {
            reject("Bad Request");
        }
    })

}

async function doWork() {
    const response = await fetchData(true);
    // console.log(result);
    renderData(result);
}

function renderData(finalResult) {
    let finalData = "";

    finalResult.map((d) => {
        let priceChange = Math.trunc(d.price_change_percentage_24h * 100) / 100;
        let tempData = `<tr>
            <td class = "currency-name"><img class = "currency-img" src=${d.image} />${d.name}</td>
            <td>${d.symbol.toUpperCase()}</td>
            <td>${d.current_price}</td>
            <td>${d.total_volume}</td>
            <td class = ${priceChange >= 0 ? "text-success" : "text-danger"} >${priceChange}</td>
            <td>${d.market_cap}</td>
          </tr>`;

        finalData += tempData;
    })

    tableData.innerHTML = finalData;
}

document.onload = doWork();

sortBtnMarket.addEventListener('click', (e) => {
    if (marketCapOrder == 0) {
        marketCapOrder = 1;
        result.sort((a, b) => a.market_cap - b.market_cap);
        renderData(result);
    } else {
        marketCapOrder = 0;
        result.sort((a, b) => b.market_cap - a.market_cap);
        renderData(result);
    }
    // fetchData();
    // console.log(e);
})


sortBtnPercent.addEventListener('click', (e) => {
    if (percentChangeOrder == 0) {
        percentChangeOrder = 1;
        result.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
        renderData(result);
    } else {
        percentChangeOrder = 0;
        result.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        renderData(result);
    }
    // console.log(e);
})



// search functionality


function search(str) {
    let currentResults = [];
    const val = str.toLowerCase();

    for (i = 0; i < result.length; i++) {
        if (result[i].name.toLowerCase().indexOf(val) > -1 || result[i].symbol.toLowerCase().indexOf(val) > -1) {
            currentResults.push(result[i]);
        }
    }


    return currentResults;
}

function searchHandler(e) {
    const inputVal = e.currentTarget.value;
    let currentResults = [];
    if (inputVal.length > 0) {
        currentResults = search(inputVal);
        renderData(currentResults);
    } else {
        renderData(result);
    }

}


inputSearch.addEventListener('keyup', searchHandler);