(function () {
	"use strict";

	const numericPattern = /^\d+$/;
	const datePattern = /^\d{4}-\d{2}-\d{2}$/;

	let salesOverTimeResult = [];
	let tableResult = [];

	window.addEventListener("load", updateData, false);
	window.addEventListener("load", function () {
		document.getElementById("over-time-chart-from-date-text-field").addEventListener("change", overTimeChartFilterTextDidChange, false);
		document.getElementById("over-time-chart-to-date-text-field").addEventListener("change", overTimeChartFilterTextDidChange, false);
	}, false);
	window.addEventListener("load", function () {
		document.getElementById("by-location-chart-top-number-text-field").addEventListener("change", byLocationChartFilterTextDidChange, false);
	}, false);
	window.addEventListener("load", function () {
		document.getElementById("by-customer-chart-top-number-text-field").addEventListener("change", byCustomerChartFilterTextDidChange, false);
	}, false);
	window.addEventListener("load", function () {
		document.getElementById("table-year-text-field").addEventListener("input", tableFilterTextDidChange, false);
		document.getElementById("table-month-text-field").addEventListener("input", tableFilterTextDidChange, false);
		document.getElementById("table-first-name-text-field").addEventListener("input", tableFilterTextDidChange, false);
		document.getElementById("table-city-text-field").addEventListener("input", tableFilterTextDidChange, false);
	}, false);

	function updateData() {
		fetchTotalSales();
		fetchTotalTax();
		fetchTotalShipping();
		fetchTopLocations();
		fetchSalesOverTime();
		fetchSalesByLocation();
		fetchSalesByCustomer();
		fetchSalesTable();
	}

	function fetchTotalSales() {
		fetchData("/service/?action=get-sales&attribute=total", updateTotalSales);
	}

	function fetchTotalTax() {
		fetchData("/service/?action=get-tax&attribute=total", updateTotalTax);
	}

	function fetchTotalShipping() {
		fetchData("/service/?action=get-shipping&attribute=total", updateTotalShipping);
	}

	function fetchTopLocations() {
		fetchData("/service/?action=get-sales&attribute=by-location&sort=desc&limit=3", updateTopLocations);
	}

	function fetchSalesOverTime() {
		fetchData("/service/?action=get-all&attribute=over-time", updateSalesOverTime);
	}

	function fetchSalesByLocation() {
		const limitNumber = parseInt(document.querySelector("#by-location-chart-top-number-text-field").value.trim());
		fetchData(`/service/?action=get-sales&attribute=by-location&sort=desc&limit=${limitNumber}`, updateSalesByLocation);
	}

	function fetchSalesByCustomer() {
		const limitNumber = parseInt(document.querySelector("#by-customer-chart-top-number-text-field").value.trim());
		fetchData(`/service/?action=get-sales&attribute=by-customer&sort=desc&limit=${limitNumber}`, updateSalesByCustomer);
	}

	function fetchSalesTable() {
		fetchData("/service/?action=get-details", updateSalesTable);
	}

	function updateTotalSales(response) {
		const result = response.result;
		document.querySelector("#total-sales .statistics-large").textContent = getFormattedCurrency(result[0].amount);
		document.querySelector("#total-sales .statistics-small").textContent = result[0].currency;
		document.querySelector("#total-sales .statistics-caption").textContent = response.description;
	}

	function updateTotalTax(response) {
		const result = response.result;
		document.querySelector("#total-tax .statistics-large").textContent = getFormattedCurrency(result[0].amount);
		document.querySelector("#total-tax .statistics-small").textContent = result[0].currency;
		document.querySelector("#total-tax .statistics-caption").textContent = response.description;
	}

	function updateTotalShipping(response) {
		const result = response.result;
		document.querySelector("#total-shipping .statistics-large").textContent = getFormattedCurrency(result[0].amount);
		document.querySelector("#total-shipping .statistics-small").textContent = result[0].currency;
		document.querySelector("#total-shipping .statistics-caption").textContent = response.description;
	}

	function updateTopLocations(response) {
		const topLocationsElement = document.querySelector("#top-locations");
		topLocationsElement.innerHTML = "";

		const result = response.result;
		for (const resultEntry of result) {
			let listItemElement = document.createElement("li");

			let divElement = document.createElement("div");

			let statisticsLargeElement = document.createElement("span");
			statisticsLargeElement.className = "statistics-large";
			statisticsLargeElement.textContent = resultEntry.city;
			divElement.appendChild(statisticsLargeElement);

			let statisticsSmallElement = document.createElement("span");
			statisticsSmallElement.className = "statistics-small";
			statisticsSmallElement.textContent = resultEntry.province;
			divElement.appendChild(statisticsSmallElement);

			listItemElement.appendChild(divElement);

			let statisticsCaptionElement = document.createElement("div");
			statisticsCaptionElement.className = "statistics-caption";
			statisticsCaptionElement.textContent = getFormattedCurrency(resultEntry.amount) + " " + resultEntry.currency;
			listItemElement.appendChild(statisticsCaptionElement);

			topLocationsElement.appendChild(listItemElement)
		}
	}

	function updateSalesOverTime(response) {
		let result = response.result;
		result.sort((a, b) => (new Date(a.date)) - (new Date(b.date)));
		salesOverTimeResult = result;
		updateSalesOverTimeFiltered();
	}

	function overTimeChartFilterTextDidChange() {
		updateSalesOverTimeFiltered();
	}

	function updateSalesOverTimeFiltered() {
		const fromDateText = document.querySelector("#over-time-chart-from-date-text-field").value.trim();
		const toDateText = document.querySelector("#over-time-chart-to-date-text-field").value.trim();

		const shouldFilterFromDate = datePattern.test(fromDateText);
		const shouldFilterToDate = datePattern.test(toDateText);
		
		let filteredResult = null;
		if (shouldFilterFromDate || shouldFilterToDate) {
			let fromDate = null;
			let toDate = null;
			try {
				fromDate = shouldFilterFromDate ? (new Date(fromDateText)) : (new Date());
				toDate = shouldFilterToDate ? (new Date(toDateText)) : (new Date());
			} catch (error) {
				return;
			}
	
			filteredResult = salesOverTimeResult.filter(function (resultEntry) {
				const d = new Date(resultEntry.date);
				return (!shouldFilterFromDate || d >= fromDate) && (!shouldFilterToDate || d <= toDate);
			});
		} else {
			filteredResult = salesOverTimeResult;
		}

		document.querySelector("#chart-sales-over-time").innerHTML = "";

		let data = {
			series: [
				{
					name: "Sales",
					data: []
				}, {
					name: "Tax",
					data: []
				}, {
					name: "Shipping",
					data: []
				}
			]
		};
		let options = {
			axisX: {
				type: Chartist.FixedScaleAxis,
				divisor: 8,
				labelInterpolationFnc: function (value) {
					return moment(value).format("MMM D, YYYY");
				}
			}
		};

		for (const resultEntry of filteredResult) {
			const d = new Date(resultEntry.date);
			data.series[0].data.push({ x: d, y: resultEntry.sales });
			data.series[1].data.push({ x: d, y: resultEntry.tax });
			data.series[2].data.push({ x: d, y: resultEntry.shipping });
		}

		new Chartist.Line('#chart-sales-over-time', data, options);
	}

	function updateSalesByLocation(response) {
		document.querySelector("#chart-sales-by-location").innerHTML = "";

		const result = response.result;

		let data = {
			labels: [],
			series: [[]]
		};
		let options = {
			// seriesBarDistance: 10,
			// reverseData: true,
			// horizontalBars: true,
			// axisY: {
			// 	offset: 80
			// }
		};

		for (const resultEntry of result) {
			data.labels.push(resultEntry.city);
			data.series[0].push(resultEntry.amount);
		}

		new Chartist.Bar("#chart-sales-by-location", data, options);
	}

	function byLocationChartFilterTextDidChange() {
		const topNumberText = document.querySelector("#by-location-chart-top-number-text-field").value.trim();
		const isTopNumberValid = numericPattern.test(topNumberText) ? 1 <= parseInt(topNumberText) : false;
		if (isTopNumberValid) {
			fetchSalesByLocation();
		}
	}

	function updateSalesByCustomer(response) {
		document.querySelector("#chart-sales-by-customer").innerHTML = "";

		const result = response.result;

		let data = {
			labels: [],
			series: [[]]
		};
		let options = {
			// seriesBarDistance: 10,
			// reverseData: true,
			// horizontalBars: true,
			// axisY: {
			// 	offset: 80
			// }
		};

		for (const resultEntry of result) {
			data.labels.push(resultEntry.firstName);
			data.series[0].push(resultEntry.amount);
		}

		new Chartist.Bar("#chart-sales-by-customer", data, options);
	}

	function byCustomerChartFilterTextDidChange() {
		fetchSalesByCustomer();
	}

	function updateSalesTable(response) {
		tableResult = response.result;
		updateSalesTableFiltered();
	}

	function tableFilterTextDidChange() {
		updateSalesTableFiltered();
	}

	function updateSalesTableFiltered() {
		const yearFilterText = document.querySelector("#table-year-text-field").value.trim();
		const monthFilterText = document.querySelector("#table-month-text-field").value.trim();
		const firstNameFilterText = document.querySelector("#table-first-name-text-field").value.trim().toLowerCase();
		const cityFilterText = document.querySelector("#table-city-text-field").value.trim().toLowerCase();


		const shouldFilterYear = numericPattern.test(yearFilterText) ? (2000 <= parseInt(yearFilterText) && parseInt(yearFilterText) <= 2100) : false;
		const shouldFilterMonth = numericPattern.test(monthFilterText) ? (1 <= parseInt(monthFilterText) && parseInt(monthFilterText) <= 12) : false;
		const shouldFilterFirstName = firstNameFilterText.length > 0;
		const shouldFilterCity = cityFilterText.length > 0;

		const filteredResult = tableResult.filter(function (resultEntry) {
			const d = new Date(resultEntry.date);
			return (!shouldFilterYear || d.getFullYear() == parseInt(yearFilterText)) && (!shouldFilterMonth || (d.getMonth() + 1) == parseInt(monthFilterText)) && (!shouldFilterFirstName || resultEntry.firstName.toLowerCase().includes(firstNameFilterText)) && (!shouldFilterCity || resultEntry.city.toLowerCase().includes(cityFilterText) || resultEntry.province.toLowerCase().includes(cityFilterText));
		});

		const tableBodyElement = document.querySelector("#table tbody");
		tableBodyElement.innerHTML = "";

		if (filteredResult.length == 0) {
			let tableRowElement = document.createElement("tr");

			let tableDataElement = document.createElement("td");
			tableDataElement.setAttribute("colspan", "7");
			tableDataElement.className = "empty-placeholder-cell";
			tableDataElement.textContent = "(Empty)";
			tableRowElement.appendChild(tableDataElement);

			tableBodyElement.appendChild(tableRowElement);

			return;
		}

		for (const resultEntry of filteredResult) {
			let tableRowElement = document.createElement("tr");

			let tableDataElement = document.createElement("td");
			tableDataElement.textContent = resultEntry.orderID;
			tableRowElement.appendChild(tableDataElement);

			tableDataElement = document.createElement("td");
			tableDataElement.textContent = resultEntry.date;
			tableRowElement.appendChild(tableDataElement);

			tableDataElement = document.createElement("td");
			tableDataElement.textContent = resultEntry.firstName;
			tableRowElement.appendChild(tableDataElement);

			tableDataElement = document.createElement("td");
			tableDataElement.textContent = resultEntry.city + ", " + resultEntry.province;
			tableRowElement.appendChild(tableDataElement);

			tableDataElement = document.createElement("td");
			tableDataElement.textContent = getFormattedCurrency(resultEntry.tax);
			tableRowElement.appendChild(tableDataElement);

			tableDataElement = document.createElement("td");
			tableDataElement.textContent = getFormattedCurrency(resultEntry.shipping);
			tableRowElement.appendChild(tableDataElement);

			tableDataElement = document.createElement("td");
			tableDataElement.textContent = getFormattedCurrency(resultEntry.grandTotal);
			tableRowElement.appendChild(tableDataElement);

			tableBodyElement.appendChild(tableRowElement);
		}
	}

	function fetchData(url, completionHandler) {
		fetch(url)
			.then(checkStatus)
			.then(JSON.parse)
			.then(completionHandler)
			.catch(console.error);
	}

	function checkStatus(response) {
		if (response.status >= 200 && response.status < 300 || response.status === 0) {
			return response.text();
		} else {
			return Promise.reject(new Error(response.status + ": " + response.statusText));
		}
	}

	function getFormattedCurrency(amount) {
		return amount.toFixed(2);
	}
})();