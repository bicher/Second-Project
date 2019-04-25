var arrCoins = [];
var selectedCoins = [];

$(() => {
    var scrollLink = $('#scroll');
    scrollLink.click(function (e) {
        e.preventDefault();
        $('body,html').animate({
            scrollTop: $(this.hash).offset().top
        }, 1000);
    });

    function getHomePageData() {
        spinnerOn();
        $.ajax({
            type: 'GET',
            url: 'https://api.coingecko.com/api/v3/coins/list',
            success: (result) => {
                spinnerOff();
                arrCoins = result;
                appendCoin(result);
            },
            error: () => {
                $(".content .row").html("Faild to get Data");
            }
        })
    }
    getHomePageData();

    $("#about").on("click", (e) => {
        spinnerOn();
        $.ajax({
            type: 'GET',
            url: 'about.html',
            success: (result) => {
                spinnerOff();
                $(".content .row").empty();
                $(".content .row").html(result);
            },
            error: () => {
                $(".content .row").append("Faild to get Data");
            }
        });
        e.preventDefault();
    });

    $("#home").on("click", (e) => {
        spinnerOn();
        $(".content .row").empty();
        getHomePageData();
        spinnerOff();
        e.preventDefault();
    });



    $("#live").on("click", (e) => {
        if (selectedCoins.length == 0) {
            alert('Please select at least one coin for chart display')
            getHomePageData();
        }
        else {
            $.ajax({
                type: "GET",
                url: `graph.html`,
                success: (result) => {
                    $(".content .row").empty();
                    $(".content .row").html(result);
                },
                error: () => {
                    $(".content .row").append("Faild to get Data");
                }

            });
            let CoinLive0 = [];
            let CoinLive1 = [];
            let CoinLive2 = [];
            let CoinLive3 = [];
            let CoinLive4 = [];
            spinnerOn();
            function liveCoinData() {
                let coinUrl;
                for (let i = 0; i < selectedCoins.length; i++) {
                    if (i == (selectedCoins.length - 1)) {
                        coinUrl += selectedCoins[i].name;
                    }
                    else {
                        coinUrl += selectedCoins[i].name + ",";
                    }
                }
                $.ajax({
                    type: "GET",
                    url: "https://min-api.cryptocompare.com/data/pricemulti?fsyms=" + coinUrl + "&tsyms=USD",
                    success: (result) => {

                        let dateNow = new Date();
                        let counter = 0;
                        coinLiveDataStore = [];

                        for (let key in result) {

                            if (counter == 0) {
                                CoinLive0.push({ x: dateNow, y: result[key].USD });
                                coinLiveDataStore.push(key);
                            }

                            if (counter == 1) {
                                CoinLive1.push({ x: dateNow, y: result[key].USD });
                                coinLiveDataStore.push(key);
                            }

                            if (counter == 2) {
                                CoinLive2.push({ x: dateNow, y: result[key].USD });
                                coinLiveDataStore.push(key);
                            }

                            if (counter == 3) {
                                CoinLive3.push({ x: dateNow, y: result[key].USD });
                                coinLiveDataStore.push(key);
                            }

                            if (counter == 4) {
                                CoinLive4.push({ x: dateNow, y: result[key].USD });
                                coinLiveDataStore.push(key);
                            }

                            counter++;
                        }
                        createGraph();
                    }
                });
            }
            setInterval(() => {
                liveCoinData();
            }, 2000);

            function createGraph() {
                spinnerOff();
                var chart = new CanvasJS.Chart("chartContainer", {
                    exportEnabled: true,
                    animationEnabled: false,

                    title: {
                        text: "Your choosing currencies"
                    },
                    axisX: {
                        valueFormatString: "HH:mm:ss",
                    },
                    axisY: {
                        title: "Value in USD",
                        suffix: "$",
                        titleFontColor: "#4F81BC",
                        lineColor: "#4F81BC",
                        labelFontColor: "#4F81BC",
                        tickColor: "#4F81BC",
                        includeZero: true,
                    },
                    toolTip: {
                        shared: true
                    },
                    legend: {
                        cursor: "pointer",
                        itemclick: toggleDataSeries,
                    },
                    data: [{
                        type: "spline",
                        name: coinLiveDataStore[0],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: CoinLive0

                    },
                    {
                        type: "spline",
                        name: coinLiveDataStore[1],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: CoinLive1

                    },
                    {
                        type: "spline",
                        name: coinLiveDataStore[2],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: CoinLive2

                    },
                    {
                        type: "spline",
                        name: coinLiveDataStore[3],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: CoinLive3

                    },
                    {
                        type: "spline",
                        name: coinLiveDataStore[4],
                        showInLegend: true,
                        xValueFormatString: "HH:mm:ss",
                        dataPoints: CoinLive4

                    }]

                });

                chart.render();

                function toggleDataSeries(e) {
                    if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                        e.dataSeries.visible = false;
                    }
                    else {
                        e.dataSeries.visible = true;
                    }
                    e.chart.render();
                }

            }
        }
        e.preventDefault();
    });

    $("#searchBtn").on("click", (e) => {
        spinnerOn();
        
        var searchSymbol = $("#searchCoins").val().toLowerCase();
        for (let i = 0; i < arrCoins.length; i++) {
            if (searchSymbol == arrCoins[i].symbol) {
                var foundCoin = arrCoins[i];
                $(".content .row").empty();
                $(".content .row").append(`<div class="col-sm-3">
                <div class="card" id="card_${foundCoin.id}">
                    <div class="card-body">
                        <h5 class="card-title d-inline">${foundCoin.symbol.toUpperCase()}</h5>
                        <label class="switch float-right">
                            <input type="checkbox" dcoin="${foundCoin.symbol}" id="toggle_${foundCoin.id}" onChange="inuptCheckd(this)">
                            <span class="slider round"></span>
                        </label>
                        <p class="card-text">${foundCoin.name}</p>
                        <button class="btn btn-primary collapsible data-toggle="collapse"">More Info</button>
                        <div class="content">
                        <p id=${foundCoin.id}></p>
                        </div>
                    </div>
                </div>
            </div>`);
            selectedCoins.filter(function (x) {
                if (foundCoin.symbol.toUpperCase() == x.name) {
                    $(`#toggle_${foundCoin.id}`).prop('checked', true);
                }
            })
                spinnerOff();
                break;
            }
            else if (searchSymbol === "") {

                $(".content .row").empty();
                appendCoin();
                spinnerOff();
            }
            else {
                $(".content .row").empty();
                $(".content .row").html("Coin is not found!");
            };
        };
        e.preventDefault();
    });
    function appendCoin(coin) {
        for (let i = 0; i < 100; i++) {
            $(".content .row").append(
                `<div class="col-sm-3">
                            <div class="card" id="card__${coin[i].id}">
                                <div class="card-body">
                                    <h5 class="card-title d-inline">${coin[i].symbol.toUpperCase()}</h5>
                                    <label class="switch float-right">
                                        <input type="checkbox" class="chackbox" dcoin="${coin[i].symbol}" id="toggle_${coin[i].id}" onChange="inuptCheckd(this)">
                                        <span class="slider round"></span>
                                    </label>
                                    <p class="card-text">${coin[i].name}</p>
                                    <button class="btn btn-primary collapsible data-toggle="collapse"">More Info</button>
                                    <div class="content">
                                        <p id=${coin[i].id}></p>
                                    </div>
                                </div>
                            </div>
                        </div>`
            );
            selectedCoins.filter(function (x) {
                if (coin[i].symbol.toUpperCase() == x.name) {
                    $(`#toggle_${coin[i].id}`).prop('checked', true);
                }
            })
        };

        var coll = $('.collapsible');
        for (let i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                } else {
                    content.style.maxHeight = 500 + "px";
                    let idCoin = this.parentElement.children[4].children[0].id;
                    spinnerOn();

                    let currentTime = Date.now();
                    var localCoinsBackup = JSON.parse(localStorage.getItem(idCoin));

                    if (localCoinsBackup != null && (currentTime - localCoinsBackup.ajaxTime < 120000)) {
                        console.log("Data From LocalStorage");
                        appendMoreInfo(idCoin, localCoinsBackup.image.small, localCoinsBackup.market_data.current_price.usd, localCoinsBackup.market_data.current_price.eur, localCoinsBackup.market_data.current_price.ils);
                    }
                    else {
                        console.log("Data From Ajax");
                        $.ajax({
                            type: 'GET',
                            url: `https://api.coingecko.com/api/v3/coins/${idCoin}`,
                            success: (result) => {
                                appendMoreInfo(result.id, result.image.small, result.market_data.current_price.usd, result.market_data.current_price.eur, result.market_data.current_price.ils);
                            },
                            complete: (result) => {
                                result.responseJSON.ajaxTime = Date.now();
                                localStorage.setItem(result.responseJSON.id, JSON.stringify(result.responseJSON));
                            }
                        });
                    }
                }
            });
        };
    };

    function appendMoreInfo(id, image, priceUsd, PriceEur, PriceIls) {
        spinnerOff();
        $(`#${id}`).html(`
         <div class="col"><img class="coinLogo rounded mx-auto d-block" src=${image} /></div>
         <div class="col">${priceUsd.toFixed(5)}<i class="fas fa-dollar-sign"></i></div>
         <div class="col">${PriceEur.toFixed(5)}<i class="fas fa-euro-sign"></i></div>
         <div class="col">${PriceIls.toFixed(5)}<i class="fas fa-shekel-sign"></i></div>`
        );
    };
});

function spinnerOn() {
    $(".content").append(`<div class="text-center"><div class="spinner-border"></div></div>`)
};

function spinnerOff() {
    $(".spinner-border").remove();
    $(".content").find(".text-center").remove();
};

function inuptCheckd(tog) {
    var obj = {
        name: tog.attributes.dcoin.value.toUpperCase(),
        id: tog.id
    };
    if (tog.checked == true) {
        if (selectedCoins.length < 5) {
            selectedCoins.push(obj);
            console.log(selectedCoins);
        }
        else {
            $(`#${tog.id}`).prop('checked', false);
            modalPop(selectedCoins);
            $("#currencyModal").modal("show");
        }
    }
    else {
        var index = selectedCoins.findIndex(key => {
            return key.name == obj.name;
        });
        selectedCoins.splice(index, 1);
    };
};

function modalPop(selectedCoins) {
    $("body").append(`<div class="modal fade" id="currencyModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
                    aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLongTitle">You can't select more then five Coins</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>`);
    $(".modal-body").empty();
    for (let i = 0; i < selectedCoins.length; i++) {
        $(".modal-body").append(
            `<div class="card" style="width: 18rem;">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <label class="switch float-right">
                                    <input type="checkbox" class="chackbox" dcoin="${selectedCoins[i].name}" id="${selectedCoins[i].id}" onChange="modalChange(this)" checked>
                                    <span class="slider round"></span>
                                </label>${selectedCoins[i].name}
                        </ul>
                    </div> `
        );
    }
};

function modalChange(x) {
    $(`#${x.id}`).prop('checked', false);
    $("#currencyModal").modal('hide');
    inuptCheckd(x);

};




