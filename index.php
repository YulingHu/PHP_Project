<html>

	<head>
		<link rel="stylesheet" href="/vendors/chartist/chartist.min.css">
		<script src="/vendors/chartist/chartist.min.js"></script>
		<script src="/vendors/moment/moment.min.js"></script>
		<link rel="stylesheet" href="/index.css" type="text/css" />
		<script type="text/javascript" src="/index.js"></script>
		<title>Sales Dashboard</title>
	</head>

	<body>
		<div class="outer-margin">
			<div class="inner-margin">
				<h1>Sales Dashboard</h1>
				<main role="main">
					<section>
						<h2>Statistics</h2>
						<div class="subsection">
							<h3>Overview</h3>
							<ul class="statictics-list">
								<li>
									<div id="total-sales">
										<div><span class="statistics-large">&hellip;</span><span class="statistics-small"></span></div>
										<div class="statistics-caption">&hellip;</div>
									</div>
								</li>
								<li>
									<div id="total-tax">
										<div><span class="statistics-large">&hellip;</span><span class="statistics-small"></span></div>
										<div class="statistics-caption">&hellip;</div>
									</div>
								</li>
								<li>
									<div id="total-shipping">
										<div><span class="statistics-large">&hellip;</span><span class="statistics-small"></span></div>
										<div class="statistics-caption">&hellip;</div>
									</div>
								</li>
							</ul>
						</div>
						<div class="subsection">
							<h3>Top Locations</h3>
							<ol class="statictics-list" id="top-locations">
								<li>
									<div class="statistics-large">&hellip;</div>
									<div class="statistics-caption">&hellip;</div>
								</li>
								<li>
									<div class="statistics-large">&hellip;</div>
									<div class="statistics-caption">&hellip;</div>
								</li>
								<li>
									<div class="statistics-large">&hellip;</div>
									<div class="statistics-caption">&hellip;</div>
								</li>
							</ol>
						</div>
					</section>
					<section>
						<h2>Charts</h2>
						<div class="subsection">
							<h3>Sales over Time</h3>
							<div class="filters">
								<fieldset>
									<legend>From Date</legend>
									<input type="text" id="over-time-chart-from-date-text-field" name="from-date" placeholder="YYYY-MM-DD"><br>
								</fieldset>
								<fieldset>
									<legend>To Date</legend>
									<input type="text" id="over-time-chart-to-date-text-field" name="to-date" placeholder="YYYY-MM-DD"><br>
								</fieldset>
							</div>
							<div class="chart" id="chart-sales-over-time">
								<div class="chart-placeholder">&hellip;</div>
							</div>
						</div>
						<div class="subsection">
							<h3>Sales by Location</h3>
							<div class="filters">
								<fieldset>
									<legend>Top Number</legend>
									<input type="text" id="by-location-chart-top-number-text-field" name="top-number" placeholder="Top Number" value="15"><br>
								</fieldset>
							</div>
							<div class="chart" id="chart-sales-by-location">
								<div class="chart-placeholder">&hellip;</div>
							</div>
						</div>
						<div class="subsection">
							<h3>Sales by Customer</h3>
							<div class="filters">
								<fieldset>
									<legend>Top Number</legend>
									<input type="text" id="by-customer-chart-top-number-text-field" name="top-number" placeholder="Top Number" value="15"><br>
								</fieldset>
							</div>
							<div class="chart" id="chart-sales-by-customer">
								<div class="chart-placeholder">&hellip;</div>
							</div>
						</div>
					</section>
					<section>
						<h2>Tables</h2>
						<div class="filters">
							<fieldset>
								<legend>Year</legend>
								<input type="text" id="table-year-text-field" name="year" placeholder="Year"><br>
							</fieldset>
							<fieldset>
								<legend>Month</legend>
								<input type="text" id="table-month-text-field" name="month" placeholder="Month"><br>
							</fieldset>
							<fieldset>
								<legend>Customer Name</legend>
								<input type="text" id="table-first-name-text-field" name="first-name" placeholder="Customer Name"><br>
							</fieldset>
							<fieldset>
								<legend>City</legend>
								<input type="text" id="table-city-text-field" name="city" placeholder="City"><br>
							</fieldset>
						</div>
						<div>
							<table id="table">
								<thead>
									<tr>
										<th>Order ID</th>
										<th>Date</th>
										<th>Customer Name</th>
										<th>City</th>
										<th>Tax</th>
										<th>Shipping</th>
										<th>Total</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>&hellip;</td>
										<td>&hellip;</td>
										<td>&hellip;</td>
										<td>&hellip;</td>
										<td>&hellip;</td>
										<td>&hellip;</td>
										<td>&hellip;</td>
									</tr>
								</tbody>
							</table>
						</div>
					</section>
				</main>
			</div>
		</div>
	</body>

</html>