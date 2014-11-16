// ==UserScript==
// @name         PSB_MCC_SHOW
// @namespace    http://your.homepage/
// @version      1.0
// @description  enter something useful
// @author       Константин Павленко (original script writer http://rakeev.name/psb.html)
// @author       alezhu (convert to user.js)
// @match        https://pfm.psbank.ru/Transactions
// @include      https://pfm.psbank.ru/Transactions
// @source      https://raw.githubusercontent.com/alezhu/PSB_MCC_SHOW/master/PSB_MCC_SHOW.user.js
// @updateURL   https://raw.githubusercontent.com/alezhu/PSB_MCC_SHOW/master/PSB_MCC_SHOW.user.js
// @downloadURL https://raw.githubusercontent.com/alezhu/PSB_MCC_SHOW/master/PSB_MCC_SHOW.user.js
// @grant        none
// ==/UserScript==

(function() {

    var Cat = 0;
	var _cats = [
		{"name":"Топливо","mcc" : [5172,5541,5542,5983] },
		{"name":"Супермаркеты", "mcc":[5411, 5422, 5441, 5451, 5462, 5499, 5921, 5811, 5812, 5813, 5814] },
		{"name":"Одежда", "mcc":[5094,5137,5139,5331,5611,5621,5631,5651,5661,5681,5691,5697,5698,5699,5931,5944,5949,5950,7296,5641]},
		{"name":"Ремонт","mcc":[1520,1711,1731,1740,1750,1761,1771,1799,2791,2842,5021,5039,5046,5051,5065,5072,5074,5085,5198,5200,5211,5231,5251,5261,5712,5713,5714,5718,5719,5722,7622,7623,7629,7631,7641,7692,7699]},
		{"name":"Путешествия", "mcc":[4112,4411,4511], "check": function(n){return n>=3e3&&3300>n;}}
	];
	var in5 = function (mcc) {
		var _cat = _cats[Cat];
		return (((_cat.check)&&(_cat.check(mcc)))||_cat.mcc.indexOf(mcc)>=0);
	};
	var a = function (a) {
		$.each(a.data.Transactions, function (a, t) {
			if (!t.Mcc)
				return !0;
			var d = $("*[data-id=" + t.Id + "]");
			d.find("td[data-category] .data").prepend("<b>" + t.Mcc + "</b> ");
			if(in5(t.Mcc))d.find("td[data-amount]").prepend('<b style="color: green">+5%</b> ');
		});
	};
    
    var addCat = function(p){
        var select = $("<select />");
        for(var cat in _cats) 
        {    
            var option = $('<option />', {value: cat, text: _cats[cat].name });
            option.appendTo(select); 
        } 
        select.change(function() {
            Cat = $(this).val();
            window.transactionsPage.refreshPage();
            //Meniga.TransactionsListWidget.refresh();
        });
        var h1 = $('h1.box-heading>span.title');		
        select.insertAfter(h1);
    };
	addCat(window);
	a(window.transactionsPage);
	Meniga.EventBus.bind(Meniga.Transactions.Events.TransactionsListLoaded, a);
})();
