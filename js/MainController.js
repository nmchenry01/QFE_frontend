(function () {
    angular
        .module('myApp')
        .controller('MainController', function MainController($scope, $http) {
            $scope.selectedAsset;
            $scope.tickerId;
            $scope.startDate;
            $scope.toDate;
            $scope.fromDate;
            $scope.endDate;
            $scope.loading = false;

            //Get the date from the date picker
            $(function () {
                var dateFormat = "mm/dd/yy",
                    from = $("#from")
                    .datepicker({
                        defaultDate: "+1w",
                        changeMonth: true,
                        changeYear: true,
                        numberOfMonths: 1
                    })
                    .on("change", function () {
                        to.datepicker("option", "minDate", getDate(this));
                        startDate = getDate(this);
                    }),
                    to = $("#to").datepicker({
                        defaultDate: "+1w",
                        changeMonth: true,
                        changeYear: true,
                        numberOfMonths: 1
                    })
                    .on("change", function () {
                        from.datepicker("option", "maxDate", getDate(this));
                        endDate = getDate(this);
                    });

                function getDate(element) {
                    var date;
                    try {
                        date = $.datepicker.parseDate(dateFormat, element.dailyValue);
                    } catch (error) {
                        date = null;
                    }
                    return date;
                }
            });

            //Specifies what happens when AJAX call completes
            var on_complete = function (response) {
                if (response.data.is_valid == false && response.data.is_asset_error == true) { //Check if asset error
                    swal({
                        title: 'Error!',
                        text: "Please enter a valid asset",
                        type: 'error',
                        allowOutsideClick: false
                    }).then(function (result) {
                        $('#myOverlay').hide();
                    })
                } else if (response.data.is_valid == false && response.data.is_date_error == true) { //Check if date range error
                    //Process to display available dates
                    //Oldest date
                    var oldest_date = response.data.oldest_available.split("-");
                    var display_oldest = oldest_date[1] + '/' + oldest_date[2] + '/' + oldest_date[0];
                    //Newest date
                    var newest_date = response.data.newest_available.split("-");
                    var display_newest = newest_date[1] + '/' + newest_date[2] + '/' + newest_date[0];

                    var error_msg = "Please enter a date range between " + display_oldest + " and " + display_newest;

                    swal({
                        title: 'Error!',
                        text: error_msg,
                        type: 'error',
                        allowOutsideClick: false
                    }).then(function (result) {
                        $('#myOverlay').hide();
                    })
                } else if (response.data.is_valid == false && response.data.is_date_diff_error == true) {
                    swal({
                        title: 'Error!',
                        text: "Please enter a date range greater than a month!",
                        type: 'error',
                        allowOutsideClick: false
                    }).then(function (result) {
                        $('#myOverlay').hide();
                    })
                } else {
                    $scope.data = format_data(response.data);
                    $scope.grabCharts(response);
                    $scope.loading = false;
                    $('#myOverlay').hide();
                }
                $scope.loading = false;


            };

            //Applies correct formatting to the data displayed in the summary statistics table
            var format_data = function (data) {
                var asset_name = data.asset_name;
                var asset_symbol = data.asset_symbol;
                var start_date = data.start_date;
                var end_date = data.end_date;
                var cumulative_returns = (parseFloat(data.cumulative_returns) * 100).toFixed(2) + '%';
                var weekly_cumulative_returns = (parseFloat(data.weekly_cumulative_returns) * 100).toFixed(2) + '%';
                var monthly_cumulative_returns = (parseFloat(data.monthly_cumulative_returns) * 100).toFixed(2) + '%';
                var daily_average_return = (parseFloat(data.daily_average_return) * 100).toFixed(2) + '%';
                var weekly_average_return = (parseFloat(data.weekly_average_return) * 100).toFixed(2) + '%';
                var monthly_average_return = (parseFloat(data.monthly_average_return) * 100).toFixed(2) + '%';
                var daily_kurtosis = data.daily_kurtosis;
                var weekly_kurtosis = data.weekly_kurtosis;
                var monthly_kurtosis = data.monthly_kurtosis;
                var daily_skewness = data.daily_skewness;
                var weekly_skewness = data.weekly_skewness;
                var monthly_skewness = data.monthly_skewness;
                var daily_standard_deviation = data.daily_standard_deviation;
                var weekly_standard_deviation = data.weekly_standard_deviation;
                var monthly_standard_deviation = data.monthly_standard_deviation;
                var maximum_return = (parseFloat(data.maximum_return) * 100).toFixed(2) + '%';
                var weekly_maximum_return = (parseFloat(data.weekly_maximum_return) * 100).toFixed(2) + '%';
                var monthly_maximum_return = (parseFloat(data.monthly_maximum_return) * 100).toFixed(2) + '%';
                var minimum_return = (parseFloat(data.minimum_return) * 100).toFixed(2) + '%';
                var weekly_minimum_return = (parseFloat(data.weekly_minimum_return) * 100).toFixed(2) + '%';
                var monthly_minimum_return = (parseFloat(data.monthly_minimum_return) * 100).toFixed(2) + '%';
                var quartile_05 = (parseFloat(data.quartile_05) * 100).toFixed(2) + '%';
                var weekly_quartile_05 = (parseFloat(data.weekly_quartile_05) * 100).toFixed(2) + '%';
                var monthly_quartile_05 = (parseFloat(data.monthly_quartile_05) * 100).toFixed(2) + '%';
                var quartile_25 = (parseFloat(data.quartile_25) * 100).toFixed(2) + '%';
                var weekly_quartile_25 = (parseFloat(data.weekly_quartile_25) * 100).toFixed(2) + '%';
                var monthly_quartile_25 = (parseFloat(data.monthly_quartile_25) * 100).toFixed(2) + '%';
                var quartile_50 = (parseFloat(data.quartile_50) * 100).toFixed(2) + '%';
                var weekly_quartile_50 = (parseFloat(data.weekly_quartile_50) * 100).toFixed(2) + '%';
                var monthly_quartile_50 = (parseFloat(data.monthly_quartile_50) * 100).toFixed(2) + '%';
                var quartile_75 = (parseFloat(data.quartile_75) * 100).toFixed(2) + '%';
                var weekly_quartile_75 = (parseFloat(data.weekly_quartile_75) * 100).toFixed(2) + '%';
                var monthly_quartile_75 = (parseFloat(data.monthly_quartile_75) * 100).toFixed(2) + '%';
                var quartile_95 = (parseFloat(data.quartile_95) * 100).toFixed(2) + '%';
                var weekly_quartile_95 = (parseFloat(data.weekly_quartile_95) * 100).toFixed(2) + '%';
                var monthly_quartile_95 = (parseFloat(data.monthly_quartile_95) * 100).toFixed(2) + '%';

                //Package up and return as a JSON object
                var json_to_return = {
                    asset_name: asset_name,
                    asset_symbol: asset_symbol,
                    start_date: start_date,
                    end_date: end_date,
                    cumulative_returns: cumulative_returns,
                    weekly_cumulative_returns: weekly_cumulative_returns,
                    monthly_cumulative_returns: monthly_cumulative_returns,
                    daily_average_return: daily_average_return,
                    weekly_average_return: weekly_average_return,
                    monthly_average_return: monthly_average_return,
                    daily_kurtosis: daily_kurtosis,
                    weekly_kurtosis: weekly_kurtosis,
                    monthly_kurtosis: monthly_kurtosis,
                    daily_skewness: daily_skewness,
                    weekly_skewness: weekly_skewness,
                    monthly_skewness: monthly_skewness,
                    daily_standard_deviation: daily_standard_deviation,
                    weekly_standard_deviation: weekly_standard_deviation,
                    monthly_standard_deviation: monthly_standard_deviation,
                    maximum_return: maximum_return,
                    weekly_maximum_return: weekly_maximum_return,
                    monthly_maximum_return: monthly_maximum_return,
                    minimum_return: minimum_return,
                    weekly_minimum_return: weekly_minimum_return,
                    monthly_minimum_return: monthly_minimum_return,
                    quartile_05: quartile_05,
                    weekly_quartile_05: weekly_quartile_05,
                    monthly_quartile_05: monthly_quartile_05,
                    quartile_25: quartile_25,
                    weekly_quartile_25: weekly_quartile_25,
                    monthly_quartile_25: monthly_quartile_25,
                    quartile_50: quartile_50,
                    weekly_quartile_50: weekly_quartile_50,
                    monthly_quartile_50: monthly_quartile_50,
                    quartile_75: quartile_75,
                    weekly_quartile_75: weekly_quartile_75,
                    monthly_quartile_75: monthly_quartile_75,
                    quartile_95: quartile_95,
                    weekly_quartile_95: weekly_quartile_95,
                    monthly_quartile_95: monthly_quartile_95
                }
                return json_to_return;
            }

            //On Error for Ajax Call
            var on_error = function (response) {
                $scope.error = "Error getting data";
            };

            $scope.searchAsset = function searchAsset(selectedAsset, fromDate, toDate) {
                $scope.loading = true;
                $('#myOverlay').show();

                //User input checking
                if (!toDate || !fromDate || toDate == fromDate) { //Check to see if user entered a date or the same date
                    $scope.loading = false;
                    swal({
                        title: 'Error!',
                        text: "Please enter a date range",
                        type: 'error',
                        allowOutsideClick: false
                    }).then(function (result) {
                        $('#myOverlay').hide();
                    })
                } else if (!selectedAsset) { //Check to see if user entered an asset
                    $scope.loading = false;
                    swal({
                        title: 'Error!',
                        text: "Please enter an asset",
                        type: 'error',
                        allowOutsideClick: false
                    }).then(function (result) {
                        $('#myOverlay').hide();
                    })
                } else { //Perform normal function
                    var fromDate = fromDate.replace("/", "-");
                    var toDate = toDate.replace("/", "-");
                    var fromDate = fromDate.replace("/", "-");
                    var toDate = toDate.replace("/", "-");

                    //Change date formatting to year-month-day
                    var convert_date = function (input_date) {
                        var date = input_date.split('-');
                        var return_date = date[2] + '-' + date[0] + '-' + date[1]
                        return return_date
                    }

                    // Will need to change when put on local server
                    // Make AJAX/HTTP request
                    $http.get("http://flaskbackend-nmchenry.cloudapps.unc.edu/" + selectedAsset + "/" + convert_date(fromDate) + "/" + convert_date(toDate))
                        .then(on_complete, on_error);
                }
            };

            /* End of search bar function */
            $scope.grabCharts = function grabCharts(assetObject) {
                asset = assetObject;
                /*
                 * Daily Histogram Data Array
                 */
                var json_data = JSON.parse(assetObject.data.daily_histogram_data);

                //Sorting the keys of the json object to ensure order 
                var daily_keys = [];
                for (var key in json_data) {
                    daily_keys.push(key);
                }
                daily_keys.sort(function (a, b) {
                    return a - b;
                });

                var daily_bins = [];
                var daily_count = [];
                for (var key in daily_keys) {
                    daily_bins.push(((parseFloat(daily_keys[key]) * 100).toFixed(1)) + '%');
                    daily_count.push(json_data[daily_keys[key]]);
                }
                /*
                 * Weekly Histogram Data Array
                 */
                var json_data2 = JSON.parse(assetObject.data.weekly_histogram_data);

                //Sorting the keys of the json object to ensure order
                var weekly_keys = [];
                for (var key in json_data2) {
                    weekly_keys.push(key);
                }
                weekly_keys.sort(function (a, b) {
                    return a - b;
                });

                var weekly_bins = [];
                var weekly_count = [];
                for (var key in weekly_keys) {
                    weekly_bins.push(((parseFloat(weekly_keys[key]) * 100).toFixed(1)) + '%');
                    weekly_count.push(json_data2[weekly_keys[key]]);
                }
                /*
                 * Monthly Histogram Data Array
                 */
                var json_data3 = JSON.parse(assetObject.data.monthly_histogram_data);

                //Sorting the keys of the json object to ensure order
                var monthly_keys = [];
                for (var key in json_data3) {
                    monthly_keys.push(key);
                }
                monthly_keys.sort(function (a, b) {
                    return a - b;
                });

                var monthly_bins = [];
                var monthly_count = [];
                for (var key in monthly_keys) {
                    monthly_bins.push(((parseFloat(monthly_keys[key]) * 100).toFixed(1)) + '%');
                    monthly_count.push(json_data3[monthly_keys[key]]);
                }

                /*
                    Daily Autocorrelation Data Array
                */
                var json_data4 = JSON.parse(assetObject.data.daily_autocorrelation_data);

                var daily_lag = [];
                var daily_autocorr = [];
                for (var key in json_data4) {
                    if (!isNaN(json_data4[key])) {
                        daily_autocorr.push(parseFloat((parseFloat(json_data4[key]).toFixed(3))));
                    }
                    daily_lag.push(key);
                }

                //Pops the last value if erroneous
                if (((daily_autocorr[daily_autocorr.length - 1]) == 1) || ((daily_autocorr[daily_autocorr.length - 1]) == -1)) {
                    daily_autocorr.pop();
                }

                /*
                    Weekly Autocorrelation Data Array
                */
                var json_data5 = JSON.parse(assetObject.data.weekly_autocorrelation_data);
                var weekly_autocorr = [];
                var weekly_lag = [];
                for (var key in json_data5) {
                    if (!isNaN(json_data5[key])) {
                        weekly_autocorr.push(parseFloat((parseFloat(json_data5[key]).toFixed(5))));
                    }
                    weekly_lag.push(key);
                }

                //Pops the last value if erroneous
                if (((weekly_autocorr[weekly_autocorr.length - 1]) == 1) || ((weekly_autocorr[weekly_autocorr.length - 1]) == -1)) {
                    weekly_autocorr.pop();
                }

                /*
                    Monthly Autocorrelation Data Array
                */
                var json_data6 = JSON.parse(assetObject.data.monthly_autocorrelation_data);
                var monthly_autocorr = [];
                var monthly_lag = [];
                for (var key in json_data6) {
                    if (!isNaN(json_data6[key])) {
                        monthly_autocorr.push(parseFloat((parseFloat(json_data6[key]).toFixed(5))));
                    }
                    monthly_lag.push(key);
                }

                //Pops the last value if erroneous
                if (((monthly_autocorr[monthly_autocorr.length - 1]) == 1) || ((monthly_autocorr[monthly_autocorr.length - 1]) == -1)) {
                    monthly_autocorr.pop();
                }

                var myChart = Highcharts.chart('highchartsContainer', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Daily Histogram of Returns'
                    },
                    colors: ['#4BA2EA', '#CBCBCB', '#266FAD'],
                    xAxis: {
                        categories: daily_bins,
                        title: {
                            text: 'Percent Return'
                        }
                    },
                    yAxis: {
                        min: 0,
                        max: .2,
                        tickInterval: .025,
                        title: {
                            text: 'Frequency'
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: "Daily Returns",
                        showInLegend: false,
                        data: daily_count
                    }]
                });
                var myChart2 = Highcharts.chart('highchartsContainer3', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Monthly Histogram of Returns'
                    },
                    colors: ['#4BA2EA', '#CBCBCB', '#266FAD'],
                    xAxis: {
                        categories: monthly_bins,
                        title: {
                            text: 'Percent Return'
                        },
                    },
                    yAxis: {
                        min: 0,
                        max: .2,
                        tickInterval: .025,
                        title: {
                            text: 'Frequency'
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: "Monthly Returns",
                        showInLegend: false,
                        data: monthly_count
                    }]
                });
                Highcharts.chart('highchartsContainer2', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Weekly Histogram of Returns'
                    },
                    colors: ['#4BA2EA', '#CBCBCB', '#266FAD'],
                    xAxis: {
                        categories: weekly_bins,
                        title: {
                            text: 'Percent Return'
                        },
                    },
                    yAxis: {
                        min: 0,
                        max: .2,
                        tickInterval: .025,
                        title: {
                            text: 'Frequency'
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: "Weekly Returns",
                        showInLegend: false,
                        data: weekly_count
                    }]
                });
                Highcharts.chart('highchartsContainer4', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Daily Autocorrelation'
                    },
                    xAxis: {
                        title: {
                            text: 'Lag'
                        },
                        min: 0,
                        tickInterval: 5,
                        max: 20
                    },
                    yAxis: {
                        title: {
                            text: 'Correlation'
                        },
                        min: -1,
                        max: 1
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: "Daily Autocorrelation",
                        showInLegend: false,
                        data: daily_autocorr
                    }]
                });
                Highcharts.chart('highchartsContainer5', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Weekly Autocorrelation'
                    },
                    xAxis: {
                        title: {
                            text: 'Lag'
                        },
                        min: 0,
                        tickInterval: 5,
                        max: 20
                    },
                    yAxis: {
                        title: {
                            text: 'Correlation'
                        },
                        min: -1,
                        max: 1
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: "Weekly Autocorrelation",
                        showInLegend: false,
                        data: weekly_autocorr
                    }]
                });
                Highcharts.chart('highchartsContainer6', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Monthly Autocorrelation'
                    },
                    xAxis: {
                        title: {
                            text: 'Lag'
                        },
                        min: 0,
                        tickInterval: 5,
                        max: 20
                    },
                    yAxis: {
                        title: {
                            text: 'Correlation'
                        },
                        min: -1,
                        max: 1
                    },
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: "Monthly Autocorrelation",
                        showInLegend: false,
                        data: monthly_autocorr
                    }]
                });
            }; // Ends grabCharts() function

            $scope.asset = ['A', 'AA', 'AAAP', 'AABA', 'AAC', 'AADR', 'AAL', 'AAME', 'AAN', 'AAOI', 'AAON', 'AAP', 'AAPL', 'AAT', 'AAV', 'AAWW', 'AAXJ', 'AAXN', 'AB', 'ABAC', 'ABAX', 'ABB', 'ABBV', 'ABC', 'ABCB', 'ABCD', 'ABCO', 'ABDC', 'ABEO', 'ABEOW', 'ABEV', 'ABG', 'ABIL', 'ABIO', 'ABLX', 'ABM', 'ABMD', 'ABR', 'ABRN', 'ABR^A', 'ABR^B', 'ABR^C', 'ABT', 'ABTX', 'ABUS', 'ABX', 'ABY', 'AC', 'ACAD', 'ACBI', 'ACC', 'ACCO', 'ACCP', 'ACER', 'ACERW', 'ACET', 'ACFC', 'ACGL', 'ACGLO', 'ACGLP', 'ACH', 'ACHC', 'ACHN', 'ACHV', 'ACIA', 'ACIM', 'ACIU', 'ACIW', 'ACLS', 'ACM', 'ACMR', 'ACN', 'ACNB', 'ACOR', 'ACP', 'ACRE', 'ACRS', 'ACRX', 'ACSF', 'ACSI', 'ACST', 'ACTA', 'ACTG', 'ACV', 'ACWF', 'ACWI', 'ACWV', 'ACWX', 'ACXM', 'ADAP', 'ADBE', 'ADC', 'ADES', 'ADHD', 'ADI', 'ADM', 'ADMA', 'ADMP', 'ADMS', 'ADNT', 'ADOM', 'ADP', 'ADRA', 'ADRD', 'ADRE', 'ADRO', 'ADRU', 'ADS', 'ADSK', 'ADSW', 'ADTN', 'ADUS', 'ADVM', 'ADX', 'ADXS', 'ADXSW', 'ADZ', 'AEB', 'AED', 'AEE', 'AEG', 'AEGN', 'AEH', 'AEHR', 'AEIS', 'AEK', 'AEL', 'AEM', 'AEMD', 'AEO', 'AEP', 'AER', 'AERI', 'AES', 'AET', 'AETI', 'AEUA', 'AEY', 'AEZS', 'AFAM', 'AFB', 'AFC', 'AFG', 'AFGE', 'AFGH', 'AFH', 'AFHBL', 'AFI', 'AFK', 'AFL', 'AFMD', 'AFSD', 'AFSI', 'AFSI^A', 'AFSI^B', 'AFSI^C', 'AFSI^D', 'AFSI^E', 'AFSI^F', 'AFSS', 'AFST', 'AFT', 'AFTY', 'AG', 'AGA', 'AGC', 'AGCO', 'AGD', 'AGEN', 'AGF', 'AGFS', 'AGFSW', 'AGG', 'AGGE', 'AGGP', 'AGGY', 'AGI', 'AGII', 'AGIIL', 'AGIO', 'AGLE', 'AGM', 'AGM.A', 'AGM^A', 'AGM^B', 'AGM^C', 'AGN', 'AGNC', 'AGNCB', 'AGNCN', 'AGND', 'AGN^A', 'AGO', 'AGO^B', 'AGO^E', 'AGO^F', 'AGQ', 'AGR', 'AGRO', 'AGRX', 'AGT', 'AGTC', 'AGU', 'AGX', 'AGYS', 'AGZ', 'AGZD', 'AHC', 'AHGP', 'AHH', 'AHL', 'AHL^C', 'AHL^D', 'AHP', 'AHPA', 'AHPAU', 'AHPAW', 'AHPI', 'AHP^B', 'AHT', 'AHT^D', 'AHT^F', 'AHT^G', 'AHT^H', 'AI', 'AIA', 'AIC', 'AIF', 'AIG', 'AIG.WS', 'AIMC', 'AIMT', 'AIN', 'AINV', 'AIR', 'AIRG', 'AIRR', 'AIRT', 'AIT', 'AIV', 'AIV^A', 'AIW', 'AIY', 'AIZ', 'AI^B', 'AJG', 'AJRD', 'AJX', 'AJXA', 'AKAM', 'AKAO', 'AKBA', 'AKCA', 'AKER', 'AKO.A', 'AKO.B', 'AKP', 'AKR', 'AKRX', 'AKS', 'AKTS', 'AKTX', 'AL', 'ALB', 'ALBO', 'ALCO', 'ALD', 'ALDR', 'ALDW', 'ALDX', 'ALE', 'ALEX', 'ALFA', 'ALFI', 'ALG', 'ALGN', 'ALGT', 'ALIM', 'ALJJ', 'ALK', 'ALKS', 'ALL', 'ALLE', 'ALLT', 'ALLY', 'ALLY^A', 'ALL^A', 'ALL^B', 'ALL^C', 'ALL^D', 'ALL^E', 'ALL^F', 'ALNA', 'ALNY', 'ALOG', 'ALOT', 'ALPN', 'ALP^Q', 'ALQA', 'ALRM', 'ALRN', 'ALSK', 'ALSN', 'ALT', 'ALTR', 'ALTS', 'ALTY', 'ALV', 'ALX', 'ALXN', 'AM', 'AMAG', 'AMAT', 'AMBA', 'AMBC', 'AMBCW', 'AMBR', 'AMC', 'AMCA', 'AMCN', 'AMCX', 'AMD', 'AMDA', 'AME', 'AMED', 'AMG', 'AMGN', 'AMGP', 'AMH', 'AMH^C', 'AMH^D', 'AMH^E', 'AMH^F', 'AMH^G', 'AMID', 'AMJ', 'AMJL', 'AMKR', 'AMLP', 'AMLX', 'AMMA', 'AMN', 'AMNB', 'AMOT', 'AMOV', 'AMP', 'AMPH', 'AMRB', 'AMRC', 'AMRH', 'AMRHW', 'AMRK', 'AMRN', 'AMRS', 'AMSC', 'AMSF', 'AMSWA', 'AMT', 'AMTD', 'AMTX', 'AMT^B', 'AMU', 'AMUB', 'AMWD', 'AMX', 'AMZA', 'AMZN', 'AN', 'ANAB', 'ANAT', 'ANCB', 'ANCX', 'ANDA', 'ANDAR', 'ANDAU', 'ANDAW', 'ANDE', 'ANDV', 'ANDX', 'ANET', 'ANF', 'ANFI', 'ANGI', 'ANGL', 'ANGO', 'ANH', 'ANH^A', 'ANH^B', 'ANH^C', 'ANIK', 'ANIP', 'ANSS', 'ANTH', 'ANTM', 'ANTX', 'ANW', 'ANY', 'AOA', 'AOBC', 'AOD', 'AOI', 'AOK', 'AOM', 'AON', 'AOR', 'AOS', 'AOSL', 'AP', 'APA', 'APAM', 'APB', 'APC', 'APD', 'APDN', 'APDNW', 'APEI', 'APEN', 'APF', 'APH', 'APLE', 'APLP', 'APLS', 'APO', 'APOG', 'APOP', 'APOPW', 'APO^A', 'APPF', 'APPN', 'APPS', 'APRI', 'APRN', 'APTI', 'APTO', 'APTS', 'APU', 'APVO', 'APWC', 'AQ', 'AQB', 'AQMS', 'AQN', 'AQUA', 'AQXP', 'AR', 'ARA', 'ARAY', 'ARC', 'ARCB', 'ARCC', 'ARCH', 'ARCI', 'ARCO', 'ARCW', 'ARCX', 'ARD', 'ARDC', 'ARDM', 'ARDX', 'ARE', 'ARES', 'ARES^A', 'AREX', 'ARE^D', 'ARGS', 'ARGT', 'ARGX', 'ARH^C', 'ARI', 'ARII', 'ARI^C', 'ARKG', 'ARKK', 'ARKQ', 'ARKR', 'ARKW', 'ARL', 'ARLP', 'ARLZ', 'ARMK', 'ARNA', 'ARNC', 'AROC', 'AROW', 'ARQL', 'ARR', 'ARRS', 'ARRY', 'ARR^A', 'ARR^B', 'ARTNA', 'ARTW', 'ARTX', 'ARW', 'ARWR', 'ASA', 'ASB', 'ASB^C', 'ASB^D', 'ASC', 'ASCMA', 'ASEA', 'ASET', 'ASFI', 'ASG', 'ASGN', 'ASH', 'ASHR', 'ASHS', 'ASHX', 'ASIX', 'ASMB', 'ASML', 'ASNA', 'ASND', 'ASPN', 'ASPS', 'ASPU', 'ASR', 'ASRV', 'ASRVP', 'ASTC', 'ASTE', 'ASUR', 'ASV', 'ASX', 'ASYS', 'AT', 'ATAC', 'ATACR', 'ATACU', 'ATAI', 'ATAX', 'ATEC', 'ATEN', 'ATGE', 'ATH', 'ATHM', 'ATHN', 'ATHX', 'ATI', 'ATKR', 'ATLC', 'ATLO', 'ATMP', 'ATNI', 'ATNX', 'ATO', 'ATOM', 'ATOS', 'ATR', 'ATRA', 'ATRC', 'ATRI', 'ATRO', 'ATRS', 'ATSG', 'ATTO', 'ATTU', 'ATU', 'ATUS', 'ATV', 'ATVI', 'ATXI', 'AU', 'AUBN', 'AUDC', 'AUO', 'AUPH', 'AUSE', 'AUTO', 'AUY', 'AVA', 'AdailyVal', 'AVAV', 'AVB', 'AVD', 'AVDL', 'AVEO', 'AVGO', 'AVGR', 'AVH', 'AVHI', 'AVID', 'AVIR', 'AVK', 'AVNW', 'AVP', 'AVT', 'AVX', 'AVXL', 'AVXS', 'AVY', 'AWF', 'AWI', 'AWK', 'AWP', 'AWR', 'AWRE', 'AXAS', 'AXDX', 'AXE', 'AXGN', 'AXJL', 'AXJV', 'AXL', 'AXON', 'AXP', 'AXR', 'AXS', 'AXSM', 'AXS^D', 'AXS^E', 'AXTA', 'AXTI', 'AYI', 'AYR', 'AYT', 'AYTU', 'AYX', 'AZN', 'AZO', 'AZPN', 'AZRE', 'AZRX', 'AZUL', 'AZZ', 'B', 'BA', 'BAB', 'BABA', 'BABY', 'BAC', 'BAC.WS.A', 'BAC.WS.B', 'BAC^A', 'BAC^C', 'BAC^D', 'BAC^E', 'BAC^I', 'BAC^L', 'BAC^W', 'BAC^Y', 'BAF', 'BAH', 'BAK', 'BAL', 'BAM', 'BANC', 'BANC^C', 'BANC^D', 'BANC^E', 'BAND', 'BANF', 'BANFP', 'BANR', 'BANX', 'BAP', 'BAR', 'BAS', 'BASI', 'BATRA', 'BATRK', 'BAX', 'BB', 'BBBY', 'BBC', 'BBD', 'BBDO', 'BBF', 'BBG', 'BBGI', 'BBH', 'BBK', 'BBL', 'BBN', 'BBOX', 'BBP', 'BBRC', 'BBRG', 'BBRX', 'BBSI', 'BBT', 'BBT^D', 'BBT^E', 'BBT^F', 'BBT^G', 'BBT^H', 'BBU', 'BBVA', 'BBW', 'BBX', 'BBY', 'BC', 'BCAC', 'BCACR', 'BCACU', 'BCACW', 'BCBP', 'BCC', 'BCD', 'BCE', 'BCEI', 'BCH', 'BCI', 'BCLI', 'BCM', 'BCO', 'BCOM', 'BCOR', 'BCOV', 'BCPC', 'BCR', 'BCRH', 'BCRX', 'BCS', 'BCS^D', 'BCTF', 'BCX', 'BDC', 'BDCL', 'BDCS', 'BDCZ', 'BDC^B', 'BDD', 'BDGE', 'BDJ', 'BDN', 'BDSI', 'BDX', 'BDXA', 'BEAT', 'BEBE', 'BECN', 'BEDU', 'BEF', 'BEL', 'BELFA', 'BELFB', 'BEMO', 'BEN', 'BEP', 'BERY', 'BETR', 'BF.A', 'BF.B', 'BFAM', 'BFIN', 'BFIT', 'BFK', 'BFO', 'BFOR', 'BFR', 'BFS', 'BFS^C', 'BFZ', 'BG', 'BGB', 'BGC', 'BGCA', 'BGCP', 'BGFV', 'BGG', 'BGH', 'BGIO', 'BGNE', 'BGR', 'BGS', 'BGT', 'BGX', 'BGY', 'BH', 'BHAC', 'BHACR', 'BHACU', 'BHACW', 'BHBK', 'BHE', 'BHF', 'BHGE', 'BHK', 'BHLB', 'BHP', 'BHVN', 'BIB', 'BICK', 'BID', 'BIDU', 'BIF', 'BIG', 'BIIB', 'BIL', 'BIO', 'BIO.B', 'BIOA', 'BIOC', 'BIOL', 'BIOS', 'BIP', 'BIS', 'BIT', 'BITA', 'BIV', 'BIVV', 'BIZD', 'BJK', 'BJRI', 'BJZ', 'BK', 'BKCC', 'BKD', 'BKE', 'BKEP', 'BKEPP', 'BKF', 'BKH', 'BKHU', 'BKI', 'BKK', 'BKLN', 'BKMU', 'BKN', 'BKS', 'BKSC', 'BKT', 'BKU', 'BKYI', 'BK^C', 'BL', 'BLBD', 'BLCM', 'BLD', 'BLDP', 'BLDR', 'BLES', 'BLFS', 'BLH', 'BLHY', 'BLIN', 'BLK', 'BLKB', 'BLL', 'BLMN', 'BLMT', 'BLNG', 'BLPH', 'BLRX', 'BLUE', 'BLV', 'BLVD', 'BLVDU', 'BLVDW', 'BLW', 'BLX', 'BMA', 'BMCH', 'BME', 'BMI', 'BMLP', 'BML^G', 'BML^H', 'BML^I', 'BML^J', 'BML^L', 'BMO', 'BMRA', 'BMRC', 'BMRN', 'BMS', 'BMTC', 'BMY', 'BNCL', 'BND', 'BNDC', 'BNDX', 'BNED', 'BNFT', 'BNJ', 'BNO', 'BNS', 'BNSO', 'BNTC', 'BNTCW', 'BNY', 'BOBE', 'BOCH', 'BOE', 'BOFI', 'BOFIL', 'BOH', 'BOIL', 'BOJA', 'BOKF', 'BOKFL', 'BOLD', 'BOLT', 'BOM', 'BOMN', 'BOND', 'BOOM', 'BOOT', 'BORN', 'BOS', 'BOSC', 'BOSS', 'BOTJ', 'BOTZ', 'BOX', 'BOXL', 'BP', 'BPFH', 'BPFHP', 'BPFHW', 'BPI', 'BPK', 'BPL', 'BPMC', 'BPMP', 'BPOP', 'BPOPM', 'BPOPN', 'BPRN', 'BPT', 'BPTH', 'BPY', 'BQH', 'BR', 'BRAC', 'BRACR', 'BRACU', 'BRACW', 'BRC', 'BRCD', 'BREW', 'BRF', 'BRFS', 'BRID', 'BRK.A', 'BRK.B', 'BRKL', 'BRKR', 'BRKS', 'BRO', 'BRQS', 'BRQSW', 'BRS', 'BRSS', 'BRT', 'BRX', 'BRZU', 'BSAC', 'BSBR', 'BSCH', 'BSCI', 'BSCJ', 'BSCK', 'BSCL', 'BSCM', 'BSCN', 'BSCO', 'BSCP', 'BSCQ', 'BSCR', 'BSD', 'BSE', 'BSET', 'BSF', 'BSFT', 'BSJH', 'BSJI', 'BSJJ', 'BSJK', 'BSJL', 'BSJM', 'BSJN', 'BSJO', 'BSJP', 'BSL', 'BSM', 'BSMX', 'BSPM', 'BSQR', 'BSRR', 'BST', 'BSTC', 'BSTI', 'BSV', 'BSWN', 'BSX', 'BT', 'BTA', 'BTAL', 'BTE', 'BTEC', 'BTI', 'BTO', 'BTT', 'BTU', 'BTZ', 'BUD', 'BUFF', 'BUI', 'BUR', 'BURL', 'BUSE', 'BUZ', 'BV', 'BdailyVal', 'BVN', 'BVSN', 'BVXV', 'BVXVW', 'BW', 'BWA', 'BWEN', 'BWFG', 'BWG', 'BWINA', 'BWINB', 'BWLD', 'BWP', 'BWV', 'BWX', 'BWXT', 'BWZ', 'BX', 'BXC', 'BXE', 'BXMT', 'BXMX', 'BXP', 'BXP^B', 'BXS', 'BY', 'BYBK', 'BYD', 'BYFC', 'BYLD', 'BYM', 'BYSI', 'BZF', 'BZH', 'BZQ', 'BZUN', 'C', 'C.WS.A', 'CA', 'CAA', 'CAAS', 'CABO', 'CAC', 'CACC', 'CACG', 'CACI', 'CADC', 'CADE', 'CAE', 'CAF', 'CAFD', 'CAFE', 'CAG', 'CAH', 'CAI', 'CAJ', 'CAKE', 'CAL', 'CALA', 'CALD', 'CALI', 'CALL', 'CALM', 'CALX', 'CAMP', 'CAMT', 'CANE', 'CAPE', 'CAPL', 'CAPR', 'CAR', 'CARA', 'CARB', 'CARG', 'CARO', 'CARS', 'CART', 'CARV', 'CARZ', 'CASC', 'CASH', 'CASI', 'CASM', 'CASS', 'CASY', 'CAT', 'CATB', 'CATC', 'CATH', 'CATM', 'CATO', 'CATS', 'CATY', 'CATYW', 'CAVM', 'CB', 'CBA', 'CBAK', 'CBAN', 'CBAY', 'CBB', 'CBB^B', 'CBD', 'CBF', 'CBFV', 'CBG', 'CBH', 'CBI', 'CBIO', 'CBK', 'CBL', 'CBLI', 'CBL^D', 'CBL^E', 'CBM', 'CBMG', 'CBMX', 'CBMXW', 'CBND', 'CBO', 'CBOE', 'CBON', 'CBPO', 'CBPX', 'CBRL', 'CBS', 'CBS.A', 'CBSH', 'CBSHP', 'CBT', 'CBTX', 'CBU', 'CBX', 'CBZ', 'CC', 'CCBG', 'CCC', 'CCCL', 'CCCR', 'CCD', 'CCE', 'CCFI', 'CCI', 'CCIH', 'CCI^A', 'CCJ', 'CCK', 'CCL', 'CCLP', 'CCM', 'CCMP', 'CCNE', 'CCO', 'CCOI', 'CCOR', 'CCRC', 'CCRN', 'CCS', 'CCU', 'CCUR', 'CCXI', 'CCZ', 'CDC', 'CDE', 'CDEV', 'CDK', 'CDL', 'CDNA', 'CDNS', 'CDOR', 'CDR', 'CDR^B', 'CDR^C', 'CDTI', 'CDTX', 'CDW', 'CDXC', 'CDXS', 'CDZI', 'CE', 'CEA', 'CECE', 'CECO', 'CEE', 'CEFL', 'CEFS', 'CEL', 'CELC', 'CELG', 'CELGZ', 'CELH', 'CELP', 'CEM', 'CEMB', 'CEMI', 'CEN', 'CENT', 'CENTA', 'CENX', 'CEO', 'CEQP', 'CERC', 'CERCW', 'CERN', 'CERS', 'CETV', 'CETX', 'CETXP', 'CETXW', 'CEVA', 'CEW', 'CEY', 'CEZ', 'CF', 'CFA', 'CFBI', 'CFBK', 'CFCO', 'CFCOU', 'CFCOW', 'CFC^B', 'CFFI', 'CFFN', 'CFG', 'CFMS', 'CFNB', 'CFO', 'CFR', 'CFRX', 'CFR^A', 'CFX', 'CG', 'CGA', 'CGBD', 'CGEN', 'CGG', 'CGI', 'CGIX', 'CGNT', 'CGNX', 'CGO', 'CGW', 'CHA', 'CHAD', 'CHAU', 'CHCI', 'CHCO', 'CHCT', 'CHD', 'CHDN', 'CHE', 'CHEF', 'CHEK', 'CHEKW', 'CHEP', 'CHFC', 'CHFN', 'CHFS', 'CHGG', 'CHH', 'CHI', 'CHIE', 'CHII', 'CHIM', 'CHIQ', 'CHIX', 'CHK', 'CHKE', 'CHKP', 'CHKR', 'CHK^D', 'CHL', 'CHMA', 'CHMG', 'CHMI', 'CHMI^A', 'CHN', 'CHNR', 'CHOC', 'CHRS', 'CHRW', 'CHS', 'CHSCL', 'CHSCM', 'CHSCN', 'CHSCO', 'CHSCP', 'CHSP', 'CHT', 'CHTR', 'CHU', 'CHUBA', 'CHUBK', 'CHUY', 'CHW', 'CHY', 'CI', 'CIA', 'CIB', 'CIBR', 'CIC', 'CIC.U', 'CIC.WS', 'CID', 'CIDM', 'CIE', 'CIEN', 'CIF', 'CIFS', 'CIG', 'CIG.C', 'CIGI', 'CII', 'CIL', 'CIM', 'CIM^A', 'CIM^B', 'CINF', 'CINR', 'CIO', 'CIO^A', 'CIR', 'CISN', 'CIT', 'CIU', 'CIVB', 'CIVBP', 'CIVI', 'CIZ', 'CIZN', 'CJ', 'CJJD', 'CJNK', 'CKH', 'CKPT', 'CL', 'CLAR', 'CLB', 'CLBS', 'CLCT', 'CLD', 'CLDC', 'CLDR', 'CLDT', 'CLDX', 'CLF', 'CLFD', 'CLGX', 'CLH', 'CLI', 'CLIR', 'CLIRW', 'CLLS', 'CLMT', 'CLNE', 'CLNS', 'CLNS^B', 'CLNS^D', 'CLNS^E', 'CLNS^G', 'CLNS^H', 'CLNS^I', 'CLNS^J', 'CLNT', 'CLPR', 'CLR', 'CLRB', 'CLRBW', 'CLRBZ', 'CLRO', 'CLS', 'CLSD', 'CLSN', 'CLTL', 'CLUB', 'CLVS', 'CLW', 'CLWT', 'CLX', 'CLXT', 'CLY', 'CLYH', 'CM', 'CMA', 'CMA.WS', 'CMBS', 'CMC', 'CMCM', 'CMCO', 'CMCSA', 'CMCT', 'CMD', 'CMDT', 'CME', 'CMF', 'CMFN', 'CMG', 'CMI', 'CMLS', 'CMO', 'CMO^E', 'CMP', 'CMPR', 'CMRE', 'CMRE^B', 'CMRE^C', 'CMRE^D', 'CMRX', 'CMS', 'CMSS', 'CMSSR', 'CMSSU', 'CMSSW', 'CMS^B', 'CMTA', 'CMTL', 'CMU', 'CN', 'CNA', 'CNAC', 'CNACR', 'CNACU', 'CNACW', 'CNAT', 'CNBKA', 'CNC', 'CNCE', 'CNCR', 'CNDA', 'CNDF', 'CNDT', 'CNET', 'CNFR', 'CNHI', 'CNHX', 'CNI', 'CNIT', 'CNK', 'CNMD', 'CNNX', 'CNO', 'CNOB', 'CNP', 'CNQ', 'CNS', 'CNSF', 'CNSL', 'CNTF', 'CNTR', 'CNTY', 'CNX', 'CNXC', 'CNXN', 'CNXT', 'CNY', 'CNYA', 'CO', 'COBZ', 'CODA', 'CODI', 'CODI^A', 'CODX', 'COE', 'COF', 'COF.WS', 'COF^C', 'COF^D', 'COF^F', 'COF^G', 'COF^H', 'COF^P', 'COG', 'COGT', 'COHR', 'COHU', 'COKE', 'COL', 'COLB', 'COLL', 'COLM', 'COM', 'COMB', 'COMG', 'COMM', 'COMT', 'CONE', 'CONN', 'COO', 'COOL', 'COP', 'COPX', 'COR', 'CORE', 'CORI', 'CORN', 'CORP', 'CORR', 'CORR^A', 'CORT', 'COR^A.CL', 'COST', 'COT', 'COTV', 'COTY', 'COUP', 'COW', 'COWN', 'COWNL', 'CP', 'CPA', 'CPAC', 'CPAH', 'CPB', 'CPE', 'CPER', 'CPE^A', 'CPF', 'CPG', 'CPHC', 'CPI', 'CPIX', 'CPK', 'CPL', 'CPLA', 'CPLP', 'CPN', 'CPRT', 'CPRX', 'CPS', 'CPSH', 'CPSI', 'CPSS', 'CPST', 'CPT', 'CPTA', 'CPTAG', 'CPTAL', 'CQQQ', 'CR', 'CRAI', 'CRAK', 'CRAY', 'CRBN', 'CRBP', 'CRC', 'CRCM', 'CRD.A', 'CRD.B', 'CRED', 'CREE', 'CREG', 'CRESY', 'CRH', 'CRI', 'CRIS', 'CRK', 'CRL', 'CRM', 'CRME', 'CRMT', 'CRNT', 'CROC', 'CROP', 'CROX', 'CRR', 'CRS', 'CRSP', 'CRT', 'CRTN', 'CRTO', 'CRUS', 'CRVL', 'CRVS', 'CRWS', 'CRY', 'CRZO', 'CS', 'CSA', 'CSB', 'CSBK', 'CSBR', 'CSCO', 'CSD', 'CSF', 'CSFL', 'CSGP', 'CSGS', 'CSII', 'CSIQ', 'CSJ', 'CSL', 'CSLT', 'CSM', 'CSML', 'CSOD', 'CSPI', 'CSQ', 'CSRA', 'CSS', 'CSSE', 'CSTE', 'CSTM', 'CSTR', 'CSU', 'CSV', 'CSWC', 'CSWI', 'CSX', 'CTAA', 'CTAS', 'CTB', 'CTBB', 'CTBI', 'CTDD', 'CTG', 'CTHR', 'CTIB', 'CTIC', 'CTL', 'CTLT', 'CTMX', 'CTNN', 'CTR', 'CTRE', 'CTRL', 'CTRN', 'CTRP', 'CTRV', 'CTS', 'CTSH', 'CTSO', 'CTT', 'CTU', 'CTV', 'CTW', 'CTWS', 'CTX', 'CTXR', 'CTXRW', 'CTXS', 'CTY', 'CTZ', 'CUB', 'CUBA', 'CUBE', 'CUBI', 'CUBI^C', 'CUBI^D', 'CUBI^E', 'CUBI^F', 'CUBN', 'CUBS', 'CUDA', 'CUI', 'CUK', 'CULP', 'CUMB', 'CUPM', 'CUR', 'CURE', 'CUT', 'CUTR', 'CUZ', 'CVA', 'CVBF', 'CVCO', 'CVCY', 'CVE', 'CVEO', 'CVG', 'CVGI', 'CVGW', 'CVI', 'CVLT', 'CVLY', 'CVNA', 'CVO', 'CVRR', 'CVS', 'CVTI', 'CVV', 'CVX', 'CVY', 'CW', 'CWAI', 'CWAY', 'CWB', 'CWBC', 'CWCO', 'CWEB', 'CWH', 'CWI', 'CWS', 'CWST', 'CWT', 'CX', 'CXDC', 'CXE', 'CXH', 'CXO', 'CXP', 'CXRX', 'CXSE', 'CXW', 'CY', 'CYAD', 'CYAN', 'CYB', 'CYBE', 'CYBR', 'CYCC', 'CYCCP', 'CYD', 'CYH', 'CYHHZ', 'CYOU', 'CYRN', 'CYRX', 'CYRXW', 'CYS', 'CYS^A', 'CYS^B', 'CYTK', 'CYTR', 'CYTX', 'CYTXW', 'CZA', 'CZFC', 'CZNC', 'CZR', 'CZWI', 'CZZ', 'C^C', 'C^J', 'C^K', 'C^L', 'C^N', 'C^P', 'C^S', 'D', 'DAC', 'DAG', 'DAIO', 'DAKT', 'DAL', 'DAN', 'DAR', 'DARE', 'DATA', 'DAVE', 'DAX', 'DB', 'DBA', 'DBAP', 'DBAW', 'DBB', 'DBBR', 'DBC', 'DBD', 'DBE', 'DBEF', 'DBEM', 'DBES', 'DBEU', 'DBEZ', 'DBGR', 'DBJP', 'DBKO', 'DBL', 'DBMX', 'DBO', 'DBP', 'DBRT', 'DBS', 'DBUK', 'DBV', 'DBVT', 'DCF', 'DCI', 'DCIX', 'DCM', 'DCNG', 'DCO', 'DCOM', 'DCP', 'DCPH', 'DCT', 'DCUD', 'DDBI', 'DDD', 'DDE', 'DDEZ', 'DDF', 'DDG', 'DDJP', 'DDLS', 'DDM', 'DDP', 'DDR', 'DDR^A', 'DDR^J', 'DDR^K', 'DDS', 'DDT', 'DDWM', 'DD^A', 'DD^B', 'DE', 'DEA', 'DECK', 'DEEF', 'DEF', 'DEFA', 'DEI', 'DEL', 'DELT', 'DELTW', 'DEM', 'DEMG', 'DENN', 'DEO', 'DEPO', 'DERM', 'DES', 'DESC', 'DESP', 'DEST', 'DEUS', 'DEW', 'DEWJ', 'DEX', 'DEZU', 'DF', 'DFBG', 'DFE', 'DFEN', 'DFFN', 'DFIN', 'DFJ', 'DFND', 'DFNL', 'DFP', 'DFRG', 'DFS', 'DFS^B.CL', 'DFVL', 'DFVS', 'DG', 'DGAZ', 'DGICA', 'DGICB', 'DGII', 'DGL', 'DGLD', 'DGLY', 'DGP', 'DGRE', 'DGRO', 'DGRS', 'DGRW', 'DGS', 'DGT', 'DGX', 'DGZ', 'DHDG', 'DHF', 'DHG', 'DHI', 'DHIL', 'DHR', 'DHS', 'DHT', 'DHVW', 'DHX', 'DHXM', 'DIA', 'DIAX', 'DIG', 'DIM', 'DIN', 'DIOD', 'DIRT', 'DIS', 'DISCA', 'DISCB', 'DISCK', 'DISH', 'DIV', 'DIVA', 'DIVC', 'DIVO', 'DIVY', 'DJCI', 'DJCO', 'DJD', 'DJP', 'DK', 'DKL', 'DKS', 'DKT', 'DL', 'DLB', 'DLBL', 'DLBR', 'DLBS', 'DLHC', 'DLN', 'DLNG', 'DLNG^A', 'DLPH', 'DLR', 'DLR^C', 'DLR^G', 'DLR^H', 'DLR^I', 'DLR^J', 'DLS', 'DLTH', 'DLTR', 'DLX', 'DM', 'DMB', 'DMLP', 'DMO', 'DMPI', 'DMRC', 'DMRI', 'DMRL', 'DMRM', 'DMRS', 'DNB', 'DNBF', 'DNI', 'DNKN', 'DNL', 'DNO', 'DNOW', 'DNP', 'DNR', 'DO', 'DOC', 'DOD', 'DOG', 'DOL', 'DON', 'DOO', 'DOOR', 'DORM', 'DOTA', 'DOTAR', 'DOTAU', 'DOTAW', 'DOV', 'DOVA', 'DOX', 'DPG', 'DPK', 'DPLO', 'DPS', 'DPST', 'DPZ', 'DQ', 'DRAD', 'DRD', 'DRE', 'DRH', 'DRI', 'DRIO', 'DRIOW', 'DRIP', 'DRN', 'DRNA', 'DRQ', 'DRR', 'DRRX', 'DRUA', 'DRV', 'DRW', 'DRYS', 'DS', 'DSE', 'DSGX', 'DSI', 'DSKE', 'DSKEW', 'DSL', 'DSLV', 'DSM', 'DSPG', 'DST', 'DSU', 'DSUM', 'DSW', 'DSWL', 'DSX', 'DSXN', 'DSX^B', 'DS^B', 'DS^C', 'DS^D', 'DTD', 'DTE', 'DTEA', 'DTF', 'DTH', 'DTJ', 'DTK', 'DTLA^', 'DTN', 'DTO', 'DTQ', 'DTRM', 'DTUL', 'DTUS', 'DTV', 'DTY', 'DTYL', 'DTYS', 'DUC', 'DUG', 'DUK', 'DUKH', 'DUSA', 'DUSL', 'DUST', 'DVA', 'DVAX', 'DVCR', 'DVD', 'DVEM', 'DVHL', 'DVMT', 'DVN', 'DVP', 'DVY', 'DVYA', 'DVYE', 'DVYL', 'DWAC', 'DWAQ', 'DWAS', 'DWAT', 'DWCH', 'DWDP', 'DWFI', 'DWIN', 'DWLD', 'DWLV', 'DWM', 'DWPP', 'DWSN', 'DWT', 'DWTR', 'DWX', 'DX', 'DXB', 'DXC', 'DXCM', 'DXD', 'DXGE', 'DXJ', 'DXJC', 'DXJF', 'DXJH', 'DXJR', 'DXJS', 'DXLG', 'DXPE', 'DXPS', 'DXTR', 'DXUS', 'DXYN', 'DX^A', 'DX^B', 'DY', 'DYB', 'DYLS', 'DYN', 'DYN.WS.A', 'DYNC', 'DYNT', 'DYSL', 'DYY', 'DZK', 'DZSI', 'DZZ', 'E', 'EA', 'EAB', 'EACQ', 'EACQU', 'EACQW', 'EAE', 'EAGL', 'EAGLU', 'EAGLW', 'EAI', 'EARN', 'EARS', 'EAT', 'EBAY', 'EBAYL', 'EBF', 'EBIO', 'EBIX', 'EBMT', 'EBND', 'EBR', 'EBR.B', 'EBS', 'EBSB', 'EBTC', 'EC', 'ECA', 'ECC', 'ECCA', 'ECCB', 'ECCY', 'ECCZ', 'ECH', 'ECHO', 'ECL', 'ECNS', 'ECOL', 'ECOM', 'ECON', 'ECPG', 'ECR', 'ECT', 'ECYT', 'ED', 'EDAP', 'EDBI', 'EDC', 'EDD', 'EDEN', 'EDF', 'EDGE', 'EDGW', 'EDI', 'EDIT', 'EDIV', 'EDN', 'EDOG', 'EDOM', 'EDOW', 'EDR', 'EDU', 'EDUC', 'EDV', 'EDZ', 'EE', 'EEA', 'EEB', 'EEFT', 'EEH', 'EEI', 'EELV', 'EEM', 'EEMA', 'EEMO', 'EEMS', 'EEMV', 'EEMX', 'EEP', 'EEQ', 'EES', 'EET', 'EEV', 'EEX', 'EFA', 'EFAD', 'EFAS', 'EFAV', 'EFAX', 'EFBI', 'EFC', 'EFF', 'EFFE', 'EFG', 'EFII', 'EFL', 'EFNL', 'EFO', 'EFOI', 'EFR', 'EFSC', 'EFT', 'EFU', 'EFV', 'EFX', 'EFZ', 'EGAN', 'EGBN', 'EGF', 'EGHT', 'EGIF', 'EGL', 'EGLE', 'EGLT', 'EGN', 'EGO', 'EGOV', 'EGP', 'EGPT', 'EGRX', 'EGY', 'EHI', 'EHIC', 'EHR', 'EHT', 'EHTH', 'EIDO', 'EIG', 'EIGI', 'EIGR', 'EIRL', 'EIS', 'EIX', 'EKSO', 'EL', 'ELC', 'ELD', 'ELEC', 'ELECU', 'ELECW', 'ELF', 'ELGX', 'ELJ', 'ELLI', 'ELON', 'ELP', 'ELS', 'ELSE', 'ELTK', 'ELU', 'ELVT', 'ELY', 'EMAG', 'EMB', 'EMBH', 'EMBU', 'EMCB', 'EMCF', 'EMCG', 'EMCI', 'EMD', 'EMDV', 'EME', 'EMES', 'EMF', 'EMFM', 'EMGF', 'EMHY', 'EMIF', 'EMIH', 'EMITF', 'EMKR', 'EML', 'EMLB', 'EMLC', 'EMLP', 'EMMS', 'EMN', 'EMO', 'EMP', 'EMQQ', 'EMR', 'EMSD', 'EMSH', 'EMTL', 'EMXC', 'ENB', 'ENBL', 'ENDP', 'ENFC', 'ENFR', 'ENG', 'ENIA', 'ENIC', 'ENJ', 'ENLC', 'ENLK', 'ENO', 'ENOR', 'ENPH', 'ENR', 'ENS', 'ENSG', 'ENT', 'ENTA', 'ENTG', 'ENTL', 'ENV', 'ENVA', 'ENY', 'ENZ', 'ENZL', 'ENZY', 'EOCC', 'EOD', 'EOG', 'EOI', 'EOS', 'EOT', 'EPAM', 'EPAY', 'EPC', 'EPD', 'EPE', 'EPHE', 'EPI', 'EPIX', 'EPOL', 'EPP', 'EPR', 'EPRF', 'EPR^C', 'EPR^E', 'EPR^F', 'EPS', 'EPU', 'EPV', 'EPZM', 'EP^C', 'EQAL', 'EQBK', 'EQC', 'EQCO', 'EQC^D', 'EQFN', 'EQGP', 'EQIX', 'EQL', 'EQLT', 'EQM', 'EQR', 'EQRR', 'EQS', 'EQT', 'EQWL', 'EQWM', 'EQWS', 'ERA', 'ERF', 'ERGF', 'ERI', 'ERIC', 'ERIE', 'ERII', 'ERJ', 'ERM', 'ERO', 'EROS', 'ERUS', 'ERX', 'ERY', 'ERYP', 'ES', 'ESBK', 'ESCA', 'ESDI', 'ESDIW', 'ESE', 'ESEA', 'ESES', 'ESG', 'ESGD', 'ESGE', 'ESGF', 'ESGG', 'ESGL', 'ESGN', 'ESGR', 'ESGS', 'ESGU', 'ESGW', 'ESIO', 'ESL', 'ESLT', 'ESND', 'ESNT', 'ESPR', 'ESQ', 'ESRT', 'ESRX', 'ESS', 'ESSA', 'ESTE', 'ESV', 'ESXB', 'ETB', 'ETE', 'ETFC', 'ETG', 'ETH', 'ETHO', 'ETJ', 'ETM', 'ETM$', 'ETN', 'ETO', 'ETP', 'ETR', 'ETSY', 'ETV', 'ETW', 'ETX', 'ETY', 'EUDG', 'EUDV', 'EUFL', 'EUFN', 'EUFX', 'EUM', 'EUMV', 'EUO', 'EURL', 'EURN', 'EUSA', 'EUSC', 'EUXL', 'EV', 'EVA', 'EVBG', 'EVC', 'EVEP', 'EVF', 'EVG', 'EVGBC', 'EVGN', 'EVH', 'EVHC', 'EVK', 'EVLMC', 'EVLV', 'EVN', 'EVOK', 'EVOL', 'EVR', 'EVRI', 'EVSTC', 'EVT', 'EVTC', 'EVX', 'EW', 'EWA', 'EWBC', 'EWC', 'EWD', 'EWEM', 'EWG', 'EWGS', 'EWH', 'EWI', 'EWJ', 'EWK', 'EWL', 'EWM', 'EWMC', 'EWN', 'EWO', 'EWP', 'EWQ', 'EWRE', 'EWS', 'EWSC', 'EWT', 'EWU', 'EWUS', 'EWV', 'EWW', 'EWX', 'EWY', 'EWZ', 'EWZS', 'EXA', 'EXAC', 'EXAS', 'EXC', 'EXD', 'EXEL', 'EXFO', 'EXG', 'EXI', 'EXK', 'EXLS', 'EXP', 'EXPD', 'EXPE', 'EXPO', 'EXPR', 'EXR', 'EXT', 'EXTN', 'EXTR', 'EXXI', 'EYE', 'EYEG', 'EYEGW', 'EYES', 'EYESW', 'EYLD', 'EZA', 'EZJ', 'EZM', 'EZPW', 'EZT', 'EZU', 'EZY', 'F', 'FAAR', 'FAB', 'FAC', 'FAD', 'FAF', 'FALN', 'FAM', 'FAN', 'FANG', 'FANH', 'FARM', 'FARO', 'FAS', 'FAST', 'FAT', 'FATE', 'FAUS', 'FAZ', 'FB', 'FBC', 'FBGX', 'FBHS', 'FBIO', 'FBIZ', 'FBK', 'FBM', 'FBMS', 'FBNC', 'FBND', 'FBNK', 'FBP', 'FBR', 'FBSS', 'FBT', 'FBZ', 'FC', 'FCA', 'FCAL', 'FCAN', 'FCAP', 'FCAU', 'FCB', 'FCBC', 'FCCO', 'FCCY', 'FCE.A', 'FCEF', 'FCEL', 'FCF', 'FCFS', 'FCG', 'FCN', 'FCNCA', 'FCOM', 'FCOR', 'FCPT', 'FCRE', 'FCSC', 'FCT', 'FCVT', 'FCX', 'FDBC', 'FDC', 'FDD', 'FDEF', 'FDEU', 'FDIS', 'FDIV', 'FDL', 'FDLO', 'FDM', 'FDMO', 'FDN', 'FDP', 'FDRR', 'FDS', 'FDT', 'FDTS', 'FDUS', 'FDVV', 'FDX', 'FE', 'FEDU', 'FEEU', 'FEI', 'FEIM', 'FELE', 'FELP', 'FEM', 'FEMB', 'FEMS', 'FENC', 'FENG', 'FENY', 'FEO', 'FEP', 'FET', 'FEU', 'FEUZ', 'FEX', 'FEYE', 'FEZ', 'FF', 'FFA', 'FFBC', 'FFBCW', 'FFBW', 'FFC', 'FFG', 'FFHL', 'FFIC', 'FFIN', 'FFIU', 'FFIV', 'FFKT', 'FFNW', 'FFR', 'FFTY', 'FFWM', 'FGB', 'FGBI', 'FGD', 'FGEN', 'FGL', 'FGM', 'FGP', 'FH', 'FHB', 'FHK', 'FHLC', 'FHN', 'FHN^A', 'FHY', 'FI', 'FIBK', 'FIBR', 'FICO', 'FIDU', 'FIEE', 'FIEG', 'FIEU', 'FIF', 'FIG', 'FIGY', 'FIHD', 'FII', 'FILL', 'FINL', 'FINU', 'FINX', 'FINZ', 'FIS', 'FISI', 'FISV', 'FIT', 'FITB', 'FITBI', 'FIV', 'FIVE', 'FIVN', 'FIW', 'FIX', 'FIXD', 'FIZZ', 'FJP', 'FKLY', 'FKO', 'FKU', 'FL', 'FLAG', 'FLAT', 'FLC', 'FLCO', 'FLDM', 'FLEU', 'FLEX', 'FLGE', 'FLGT', 'FLIC', 'FLIO', 'FLIR', 'FLKS', 'FLL', 'FLLV', 'FLM', 'FLMB', 'FLMI', 'FLN', 'FLO', 'FLOT', 'FLOW', 'FLQD', 'FLQE', 'FLQG', 'FLQH', 'FLQL', 'FLQM', 'FLQS', 'FLR', 'FLRN', 'FLRT', 'FLS', 'FLT', 'FLTB', 'FLTR', 'FLWS', 'FLXN', 'FLXS', 'FLY', 'FM', 'FMAO', 'FMAT', 'FMAX', 'FMB', 'FMBH', 'FMBI', 'FMC', 'FMCI', 'FMCIR', 'FMCIU', 'FMCIW', 'FMDG', 'FMF', 'FMHI', 'FMI', 'FMK', 'FMN', 'FMNB', 'FMO', 'FMS', 'FMSA', 'FMX', 'FMY', 'FN', 'FNB', 'FNBG', 'FNB^E', 'FNCF', 'FNCL', 'FND', 'FNDA', 'FNDB', 'FNDC', 'FNDE', 'FNDF', 'FNDX', 'FNF', 'FNFV', 'FNG', 'FNGN', 'FNHC', 'FNI', 'FNJN', 'FNK', 'FNKO', 'FNLC', 'FNSR', 'FNTE', 'FNTEU', 'FNTEW', 'FNV', 'FNWB', 'FNX', 'FNY', 'FOANC', 'FOE', 'FOF', 'FOGO', 'FOIL', 'FOLD', 'FOMX', 'FONE', 'FONR', 'FOR', 'FORD', 'FORK', 'FORM', 'FORR', 'FORTY', 'FOSL', 'FOX', 'FOXA', 'FOXF', 'FPA', 'FPAY', 'FPE', 'FPEI', 'FPF', 'FPH', 'FPI', 'FPI^B', 'FPL', 'FPRX', 'FPT', 'FPX', 'FPXI', 'FQAL', 'FR', 'FRA', 'FRAC', 'FRAK', 'FRAN', 'FRBA', 'FRBK', 'FRC', 'FRC^C', 'FRC^D', 'FRC^E', 'FRC^F', 'FRC^G', 'FRC^H', 'FRED', 'FREL', 'FRGI', 'FRI', 'FRME', 'FRN', 'FRO', 'FRPH', 'FRPT', 'FRSH', 'FRSX', 'FRT', 'FRTA', 'FRT^C', 'FSAC', 'FSACU', 'FSACW', 'FSB', 'FSBC', 'FSBW', 'FSCT', 'FSD', 'FSFG', 'FSIC', 'FSLR', 'FSM', 'FSNN', 'FSS', 'FSTA', 'FSTR', 'FSV', 'FSZ', 'FT', 'FTA', 'FTAG', 'FTAI', 'FTC', 'FTCS', 'FTD', 'FTEC', 'FTEK', 'FTEO', 'FTFT', 'FTGC', 'FTHI', 'FTI', 'FTK', 'FTLB', 'FTLS', 'FTNT', 'FTR', 'FTRI', 'FTRPR', 'FTS', 'FTSD', 'FTSL', 'FTSM', 'FTV', 'FTW', 'FTXD', 'FTXG', 'FTXH', 'FTXL', 'FTXN', 'FTXO', 'FTXR', 'FUD', 'FUE', 'FUL', 'FULT', 'FUN', 'FUNC', 'FUND', 'FUSB', 'FUT', 'FUTY', 'FUV', 'FV', 'FdailyVal', 'FVC', 'FVD', 'FVE', 'FVL', 'FWDB', 'FWDD', 'FWDI', 'FWONA', 'FWONK', 'FWP', 'FWRD', 'FXA', 'FXB', 'FXC', 'FXCH', 'FXD', 'FXE', 'FXEP', 'FXEU', 'FXF', 'FXG', 'FXH', 'FXI', 'FXJP', 'FXL', 'FXN', 'FXO', 'FXP', 'FXR', 'FXS', 'FXSG', 'FXU', 'FXY', 'FXZ', 'FYC', 'FYLD', 'FYT', 'FYX', 'G', 'GAA', 'GAB', 'GABC', 'GAB^D', 'GAB^G', 'GAB^H', 'GAB^J', 'GAB~', 'GAIA', 'GAIN', 'GAINM', 'GAINN', 'GAINO', 'GAL', 'GALE', 'GALT', 'GAM', 'GAMR', 'GAM^B', 'GARD', 'GARS', 'GASL', 'GASS', 'GASX', 'GATX', 'GAZ', 'GAZB', 'GBAB', 'GBB', 'GBCI', 'GBDC', 'GBF', 'GBIL', 'GBL', 'GBLI', 'GBLIL', 'GBLIZ', 'GBNK', 'GBT', 'GBX', 'GCAP', 'GCBC', 'GCC', 'GCE', 'GCH', 'GCI', 'GCO', 'GCP', 'GCV', 'GCVRZ', 'GCV^B', 'GD', 'GDDY', 'GDEN', 'GDI', 'GDL', 'GDL^B', 'GDO', 'GDOT', 'GDS', 'GDV', 'GDVD', 'GDV^A', 'GDV^D', 'GDV^G', 'GDX', 'GDXJ', 'GDXS', 'GDXX', 'GE', 'GEB', 'GEC', 'GECC', 'GECCL', 'GEF', 'GEF.B', 'GEH', 'GEK', 'GEL', 'GEM', 'GEMP', 'GEN', 'GENC', 'GENE', 'GENY', 'GEO', 'GEOS', 'GER', 'GERN', 'GES', 'GEVO', 'GEX', 'GF', 'GFA', 'GFED', 'GFF', 'GFI', 'GFN', 'GFNCP', 'GFNSL', 'GFY', 'GG', 'GGAL', 'GGB', 'GGG', 'GGM', 'GGP', 'GGP^A', 'GGT', 'GGT^B', 'GGT^E', 'GGZ', 'GGZ^A', 'GGZ~', 'GHC', 'GHDX', 'GHII', 'GHL', 'GHM', 'GHS', 'GHY', 'GHYB', 'GHYG', 'GIB', 'GIFI', 'GIGB', 'GIGM', 'GII', 'GIII', 'GIL', 'GILD', 'GILT', 'GIM', 'GIMO', 'GIS', 'GJH', 'GJO', 'GJP', 'GJR', 'GJS', 'GJT', 'GJV', 'GKOS', 'GLAD', 'GLADN', 'GLBL', 'GLBR', 'GLBS', 'GLBZ', 'GLD', 'GLDD', 'GLDI', 'GLDW', 'GLL', 'GLMD', 'GLNG', 'GLOB', 'GLOG', 'GLOG^A', 'GLOP', 'GLOP^A', 'GLP', 'GLPG', 'GLPI', 'GLRE', 'GLT', 'GLTR', 'GLUU', 'GLW', 'GLYC', 'GM', 'GM.WS.B', 'GME', 'GMED', 'GMF', 'GMFL', 'GMLP', 'GMLPP', 'GMOM', 'GMRE', 'GMRE^A', 'GMS', 'GMTA', 'GMZ', 'GNBC', 'GNC', 'GNCA', 'GNCMA', 'GNE', 'GNE^A', 'GNK', 'GNL', 'GNL^A', 'GNMA', 'GNMK', 'GNMX', 'GNR', 'GNRC', 'GNRT', 'GNRX', 'GNST', 'GNT', 'GNTX', 'GNTY', 'GNT^A', 'GNUS', 'GNW', 'GOAU', 'GOEX', 'GOF', 'GOGL', 'GOGO', 'GOL', 'GOLD', 'GOLF', 'GOOD', 'GOODM', 'GOODO', 'GOODP', 'GOOG', 'GOOGL', 'GOOS', 'GOV', 'GOVNI', 'GOVT', 'GPAC', 'GPACU', 'GPACW', 'GPC', 'GPI', 'GPIC', 'GPJA', 'GPK', 'GPM', 'GPMT', 'GPN', 'GPOR', 'GPP', 'GPRE', 'GPRK', 'GPRO', 'GPS', 'GPT', 'GPT^A', 'GPX', 'GQRE', 'GRA', 'GRAM', 'GRBK', 'GRC', 'GREK', 'GRES', 'GRFS', 'GRI', 'GRID', 'GRIF', 'GRMN', 'GRN', 'GRNB', 'GROW', 'GRP.U', 'GRPN', 'GRR', 'GRU', 'GRUB', 'GRVY', 'GRWN', 'GRX', 'GRX^A', 'GRX^B', 'GS', 'GSBC', 'GSBD', 'GSC', 'GSD', 'GSEU', 'GSG', 'GSH', 'GSHT', 'GSHTU', 'GSHTW', 'GSIE', 'GSIT', 'GSJY', 'GSK', 'GSL', 'GSLC', 'GSL^B', 'GSM', 'GSP', 'GSSC', 'GSUM', 'GSVC', 'GSY', 'GS^A', 'GS^B', 'GS^C', 'GS^D', 'GS^I.CL', 'GS^J', 'GS^K', 'GS^N', 'GT', 'GTHX', 'GTIM', 'GTLS', 'GTN', 'GTN.A', 'GTO', 'GTS', 'GTT', 'GTXI', 'GTY', 'GTYH', 'GTYHU', 'GTYHW', 'GULF', 'GUNR', 'GURE', 'GURU', 'GUSH', 'GUT', 'GUT^A', 'GUT^C', 'GVA', 'GdailyVal', 'GVI', 'GVIP', 'GWB', 'GWGH', 'GWPH', 'GWR', 'GWRE', 'GWRS', 'GWW', 'GWX', 'GXC', 'GXF', 'GXG', 'GXP', 'GYB', 'GYC', 'GYLD', 'GYRO', 'GZT', 'H', 'HA', 'HABT', 'HACK', 'HACV', 'HACW', 'HAE', 'HAFC', 'HAHA', 'HAIN', 'HAIR', 'HAL', 'HALL', 'HALO', 'HAO', 'HAP', 'HAS', 'HASI', 'HAUD', 'HAWK', 'HAWX', 'HAYN', 'HBAN', 'HBANN', 'HBANO', 'HBANP', 'HBB', 'HBCP', 'HBHC', 'HBHCL', 'HBI', 'HBIO', 'HBK', 'HBM', 'HBM.WS', 'HBMD', 'HBNC', 'HBP', 'HCA', 'HCAP', 'HCAPZ', 'HCC', 'HCCI', 'HCHC', 'HCI', 'HCKT', 'HCLP', 'HCM', 'HCN', 'HCN^I', 'HCOM', 'HCOR', 'HCP', 'HCRF', 'HCSG', 'HD', 'HDAW', 'HDB', 'HDEE', 'HDEF', 'HDEZ', 'HDG', 'HDGE', 'HDLV', 'HDMV', 'HDNG', 'HDP', 'HDRW', 'HDS', 'HDSN', 'HDV', 'HE', 'HEAR', 'HEBT', 'HECO', 'HEDJ', 'HEEM', 'HEES', 'HEFA', 'HEFV', 'HEI', 'HEI.A', 'HELE', 'HEMV', 'HEP', 'HEQ', 'HES', 'HESM', 'HES^A', 'HEUS', 'HEUV', 'HEVY', 'HEWC', 'HEWG', 'HEWI', 'HEWJ', 'HEWL', 'HEWP', 'HEWU', 'HEWW', 'HEWY', 'HEZU', 'HE^U', 'HF', 'HFBC', 'HFBL', 'HFC', 'HFRO', 'HFWA', 'HFXE', 'HFXI', 'HFXJ', 'HGH', 'HGI', 'HGSD', 'HGSH', 'HGT', 'HGV', 'HHC', 'HHS', 'HHYX', 'HI', 'HIBB', 'HIE', 'HIFR', 'HIFS', 'HIG', 'HIG.WS', 'HIHO', 'HII', 'HIIQ', 'HIL', 'HILO', 'HIMX', 'HIO', 'HIPS', 'HIVE', 'HIW', 'HIX', 'HJPX', 'HJV', 'HK', 'HK.WS', 'HL', 'HLF', 'HLG', 'HLI', 'HLIT', 'HLNE', 'HLS', 'HLT', 'HLX', 'HL^B', 'HMC', 'HMHC', 'HMLP', 'HMLP^A', 'HMN', 'HMNF', 'HMNY', 'HMST', 'HMSY', 'HMTA', 'HMTV', 'HMY', 'HNI', 'HNNA', 'HNP', 'HNRG', 'HOFT', 'HOG', 'HOLD', 'HOLI', 'HOLX', 'HOMB', 'HOME', 'HOML', 'HON', 'HONE', 'HOPE', 'HOS', 'HOTR', 'HOV', 'HOVNP', 'HP', 'HPE', 'HPF', 'HPI', 'HPJ', 'HPP', 'HPQ', 'HPS', 'HPT', 'HQBD', 'HQCL', 'HQH', 'HQL', 'HQY', 'HR', 'HRB', 'HRC', 'HRG', 'HRI', 'HRL', 'HRS', 'HRTG', 'HRTX', 'HRZN', 'HSBC', 'HSBC^A', 'HSC', 'HSCZ', 'HSEA', 'HSEB', 'HSGX', 'HSIC', 'HSII', 'HSKA', 'HSNI', 'HSON', 'HSPX', 'HST', 'HSTM', 'HSY', 'HT', 'HTA', 'HTBI', 'HTBK', 'HTBX', 'HTD', 'HTFA', 'HTGC', 'HTGM', 'HTGX', 'HTH', 'HTHT', 'HTLD', 'HTLF', 'HTRB', 'HTUS', 'HTY', 'HTZ', 'HT^C', 'HT^D', 'HT^E', 'HUBB', 'HUBG', 'HUBS', 'HUM', 'HUN', 'HUNT', 'HUNTU', 'HUNTW', 'HURC', 'HURN', 'HUSE', 'HUSV', 'HVBC', 'HVT', 'HVT.A', 'HWBK', 'HWCC', 'HWKN', 'HX', 'HXL', 'HY', 'HYACU', 'HYB', 'HYD', 'HYDB', 'HYDD', 'HYEM', 'HYG', 'HYGH', 'HYGS', 'HYH', 'HYHG', 'HYI', 'HYIH', 'HYLB', 'HYLD', 'HYLS', 'HYLV', 'HYMB', 'HYND', 'HYS', 'HYT', 'HYXE', 'HYXU', 'HYZD', 'HZN', 'HZNP', 'HZO', 'I', 'IAC', 'IAE', 'IAG', 'IAGG', 'IAI', 'IAK', 'IAM', 'IAMXR', 'IAMXW', 'IART', 'IAT', 'IAU', 'IBA', 'IBB', 'IBCC', 'IBCD', 'IBCE', 'IBCP', 'IBD', 'IBDB', 'IBDC', 'IBDD', 'IBDH', 'IBDJ', 'IBDK', 'IBDL', 'IBDM', 'IBDN', 'IBDO', 'IBDP', 'IBDQ', 'IBDR', 'IBDS', 'IBKC', 'IBKCO', 'IBKCP', 'IBKR', 'IBLN', 'IBM', 'IBMG', 'IBMH', 'IBMI', 'IBMJ', 'IBMK', 'IBML', 'IBN', 'IBND', 'IBOC', 'IBP', 'IBTX', 'IBUY', 'ICAD', 'ICAN', 'ICB', 'ICBK', 'ICCC', 'ICCH', 'ICD', 'ICE', 'ICF', 'ICFI', 'ICHR', 'ICI', 'ICL', 'ICLN', 'ICLR', 'ICOL', 'ICON', 'ICPT', 'ICSH', 'ICUI', 'ICVT', 'IDA', 'IDCC', 'IDE', 'IDEV', 'IDHD', 'IDHQ', 'IDLB', 'IDLV', 'IDMO', 'IDOG', 'IDRA', 'IDSA', 'IDSY', 'IDT', 'IDTI', 'IDU', 'IDV', 'IDX', 'IDXG', 'IDXX', 'IEF', 'IEFA', 'IEI', 'IEMG', 'IEO', 'IEP', 'IESC', 'IEUR', 'IEUS', 'IEV', 'IEX', 'IEZ', 'IFEU', 'IFF', 'IFGL', 'IFIX', 'IFLY', 'IFMK', 'IFN', 'IFON', 'IFRX', 'IFV', 'IGA', 'IGD', 'IGE', 'IGEB', 'IGEM', 'IGF', 'IGHG', 'IGI', 'IGIH', 'IGLD', 'IGLE', 'IGM', 'IGN', 'IGOV', 'IGR', 'IGRO', 'IGT', 'IGV', 'IGVT', 'IHC', 'IHD', 'IHDG', 'IHE', 'IHF', 'IHG', 'IHI', 'IHIT', 'IHY', 'IID', 'IIF', 'III', 'IIIN', 'IIJI', 'IIM', 'IIN', 'IIPR', 'IIPR^A', 'IIVI', 'IJH', 'IJJ', 'IJK', 'IJR', 'IJS', 'IJT', 'IKNX', 'ILF', 'ILG', 'ILMN', 'ILTB', 'IMAX', 'IMDZ', 'IMGN', 'IMI', 'IMKTA', 'IMLP', 'IMMR', 'IMMU', 'IMMY', 'IMNP', 'IMOM', 'IMOS', 'IMPV', 'IMRN', 'IMRNW', 'IMTB', 'IMTE', 'IMTM', 'INAP', 'INB', 'INBK', 'INBKL', 'INCO', 'INCR', 'INCY', 'INDA', 'INDB', 'INDF', 'INDL', 'INDU', 'INDUU', 'INDUW', 'INDY', 'INF', 'INFI', 'INFN', 'INFO', 'INFR', 'INFY', 'ING', 'INGN', 'INGR', 'INKM', 'INN', 'INN^B.CL', 'INN^C', 'INN^D', 'INO', 'INOD', 'INOV', 'INP', 'INPX', 'INR', 'INSE', 'INSG', 'INSI', 'INSM', 'INST', 'INSW', 'INSY', 'INT', 'INTC', 'INTF', 'INTG', 'INTL', 'INTU', 'INTX', 'INVA', 'INVE', 'INVH', 'INWK', 'INXN', 'INXX', 'IO', 'IOIL', 'IONS', 'IOO', 'IOSP', 'IOTS', 'IOVA', 'IP', 'IPAC', 'IPAR', 'IPAS', 'IPAY', 'IPCC', 'IPCI', 'IPDN', 'IPE', 'IPFF', 'IPG', 'IPGP', 'IPHI', 'IPHS', 'IPI', 'IPKW', 'IPL^D', 'IPO', 'IPOA', 'IPOA.U', 'IPOA.WS', 'IPOS', 'IPWR', 'IPXL', 'IQDE', 'IQDF', 'IQDG', 'IQDY', 'IQI', 'IQLT', 'IR', 'IRBT', 'IRCP', 'IRDM', 'IRDMB', 'IRET', 'IRET^C', 'IRIX', 'IRL', 'IRL~', 'IRM', 'IRMD', 'IROQ', 'IRR', 'IRS', 'IRT', 'IRTC', 'IRWD', 'ISBC', 'ISCA', 'ISCF', 'ISD', 'ISF', 'ISG', 'ISHG', 'ISIG', 'ISM', 'ISMD', 'ISNS', 'ISRA', 'ISRG', 'ISRL', 'ISSC', 'ISTB', 'ISTR', 'ISZE', 'IT', 'ITA', 'ITB', 'ITCB', 'ITCI', 'ITE', 'ITEK', 'ITEQ', 'ITG', 'ITGR', 'ITI', 'ITIC', 'ITM', 'ITOT', 'ITRI', 'ITRN', 'ITT', 'ITUB', 'ITUS', 'ITW', 'IUSB', 'IUSG', 'IUSV', 'IVAC', 'IdailyVal', 'IVC', 'IVE', 'IVENC', 'IVFGC', 'IVFVC', 'IVH', 'IVLU', 'IVOG', 'IVOO', 'IVOP', 'IVOV', 'IVR', 'IVR^A', 'IVR^B', 'IVR^C', 'IVTY', 'IVV', 'IVW', 'IVZ', 'IWB', 'IWC', 'IWD', 'IWF', 'IWL', 'IWM', 'IWN', 'IWO', 'IWP', 'IWR', 'IWS', 'IWV', 'IWX', 'IWY', 'IX', 'IXC', 'IXG', 'IXJ', 'IXN', 'IXP', 'IXUS', 'IXYS', 'IYC', 'IYE', 'IYF', 'IYG', 'IYH', 'IYJ', 'IYK', 'IYLD', 'IYM', 'IYR', 'IYT', 'IYW', 'IYY', 'IYZ', 'IZEA', 'JACK', 'JAG', 'JAGX', 'JAKK', 'JASN', 'JASNW', 'JASO', 'JAX', 'JAZZ', 'JBGS', 'JBHT', 'JBK', 'JBL', 'JBLU', 'JBN', 'JBR', 'JBSS', 'JBT', 'JCAP', 'JCE', 'JCI', 'JCO', 'JCOM', 'JCP', 'JCS', 'JCTCF', 'JD', 'JDD', 'JDST', 'JE', 'JEC', 'JELD', 'JEM', 'JEMD', 'JEQ', 'JETS', 'JE^A', 'JFR', 'JGH', 'JHA', 'JHB', 'JHD', 'JHDG', 'JHG', 'JHI', 'JHMA', 'JHMC', 'JHMD', 'JHME', 'JHMF', 'JHMH', 'JHMI', 'JHML', 'JHMM', 'JHMS', 'JHMT', 'JHMU', 'JHS', 'JHX', 'JHY', 'JILL', 'JJA', 'JJC', 'JJE', 'JJG', 'JJM', 'JJN', 'JJP', 'JJS', 'JJSF', 'JJT', 'JJU', 'JKD', 'JKE', 'JKF', 'JKG', 'JKH', 'JKHY', 'JKI', 'JKJ', 'JKK', 'JKL', 'JKS', 'JLL', 'JLS', 'JMBA', 'JMEI', 'JMF', 'JMLP', 'JMM', 'JMP', 'JMPB', 'JMPC', 'JMT', 'JMU', 'JNCE', 'JNJ', 'JNK', 'JNP', 'JNPR', 'JNUG', 'JO', 'JOBS', 'JOE', 'JOF', 'JONE', 'JOUT', 'JP', 'JPC', 'JPEH', 'JPEM', 'JPEU', 'JPGB', 'JPGE', 'JPHF', 'JPHY', 'JPI', 'JPIH', 'JPIN', 'JPM', 'JPM.WS', 'JPME', 'JPMV', 'JPM^A', 'JPM^B', 'JPM^D.CL', 'JPM^E', 'JPM^F', 'JPM^G', 'JPM^H', 'JPN', 'JPNL', 'JPS', 'JPSE', 'JPST', 'JPT', 'JPUS', 'JPXN', 'JQC', 'JRI', 'JRJC', 'JRO', 'JRS', 'JRVR', 'JSD', 'JSM', 'JSMD', 'JSML', 'JSYN', 'JSYNR', 'JSYNU', 'JSYNW', 'JTA', 'JTD', 'JTPY', 'JUNO', 'JVA', 'JW.A', 'JW.B', 'JWN', 'JXI', 'JXSB', 'JYN', 'JYNT', 'K', 'KAAC', 'KAACU', 'KAACW', 'KAI', 'KALA', 'KALU', 'KALV', 'KAMN', 'KANG', 'KAP', 'KAR', 'KB', 'KBA', 'KBAL', 'KBE', 'KBH', 'KBLM', 'KBLMR', 'KBLMU', 'KBLMW', 'KBR', 'KBSF', 'KBWB', 'KBWD', 'KBWP', 'KBWR', 'KBWY', 'KCAP', 'KCAPL', 'KCE', 'KCNY', 'KDMN', 'KE', 'KED', 'KEG', 'KELYA', 'KELYB', 'KEM', 'KEMP', 'KEN', 'KEP', 'KEQU', 'KERX', 'KEX', 'KEY', 'KEYS', 'KEYW', 'KEY^I', 'KF', 'KFFB', 'KFN^', 'KFRC', 'KFS', 'KFY', 'KFYP', 'KGC', 'KGJI', 'KHC', 'KIDS', 'KIE', 'KIM', 'KIM^I', 'KIM^J', 'KIM^K', 'KIM^L', 'KIN', 'KINS', 'KIO', 'KIO~', 'KIRK', 'KKR', 'KKR^A', 'KKR^B', 'KL', 'KLAC', 'KLDW', 'KLIC', 'KLXI', 'KMB', 'KMDA', 'KMF', 'KMG', 'KMI', 'KMI^A', 'KMM', 'KMPA', 'KMPH', 'KMPR', 'KMT', 'KMX', 'KN', 'KND', 'KNDI', 'KNL', 'KNOP', 'KNOW', 'KNSL', 'KNX', 'KO', 'KODK', 'KODK.WS', 'KODK.WS.A', 'KOF', 'KOL', 'KOLD', 'KONA', 'KONE', 'KOOL', 'KOP', 'KOPN', 'KOR', 'KORS', 'KORU', 'KOS', 'KOSS', 'KPTI', 'KR', 'KRA', 'KRC', 'KRE', 'KREF', 'KRG', 'KRMA', 'KRNT', 'KRNY', 'KRO', 'KROO', 'KRP', 'KRYS', 'KS', 'KSA', 'KSM', 'KSS', 'KST', 'KSU', 'KSU^', 'KT', 'KTCC', 'KTEC', 'KTF', 'KTH', 'KTN', 'KTOS', 'KTOV', 'KTOVW', 'KTP', 'KTWO', 'KURA', 'KVHI', 'KW', 'KWEB', 'KWN.CL', 'KWR', 'KXI', 'KYE', 'KYN', 'KYN^F', 'KYO', 'L', 'LABD', 'LABL', 'LABU', 'LAD', 'LADR', 'LAKE', 'LALT', 'LAMR', 'LANC', 'LAND', 'LANDP', 'LARE', 'LARK', 'LAUR', 'LAWS', 'LAYN', 'LAZ', 'LB', 'LBAI', 'LBDC', 'LBIX', 'LBJ', 'LBRDA', 'LBRDK', 'LBTYA', 'LBTYB', 'LBTYK', 'LC', 'LCA', 'LCAHU', 'LCAHW', 'LCI', 'LCII', 'LCM', 'LCNB', 'LCUT', 'LD', 'LDF', 'LDL', 'LDOS', 'LDP', 'LDRI', 'LDUR', 'LE', 'LEA', 'LEAD', 'LECO', 'LEDD', 'LEDS', 'LEE', 'LEG', 'LEJU', 'LEMB', 'LEN', 'LEN.B', 'LENS', 'LEO', 'LEXEA', 'LEXEB', 'LFC', 'LFGR', 'LFUS', 'LFVN', 'LGCY', 'LGCYO', 'LGCYP', 'LGF.A', 'LGF.B', 'LGI', 'LGIH', 'LGLV', 'LGND', 'LH', 'LHCG', 'LHO', 'LHO^I', 'LHO^J', 'LIFE', 'LII', 'LILA', 'LILAK', 'LINC', 'LIND', 'LINDW', 'LINK', 'LINU', 'LION', 'LIT', 'LITB', 'LITE', 'LIVE', 'LIVN', 'LJPC', 'LKFN', 'LKOR', 'LKQ', 'LKSD', 'LL', 'LLEX', 'LLIT', 'LLL', 'LLNW', 'LLQD', 'LLSC', 'LLSP', 'LLY', 'LM', 'LMAT', 'LMB', 'LMBS', 'LMFA', 'LMFAW', 'LMHA', 'LMHB', 'LMLP', 'LMNR', 'LMNX', 'LMOS', 'LMRK', 'LMRKO', 'LMRKP', 'LMT', 'LN', 'LNC', 'LNC.WS', 'LNCE', 'LND', 'LNDC', 'LNGR', 'LNN', 'LNT', 'LNTH', 'LOAN', 'LOB', 'LOCO', 'LOGI', 'LOGM', 'LOMA', 'LONE', 'LOPE', 'LOR', 'LORL', 'LOW', 'LOWC', 'LOXO', 'LPCN', 'LPG', 'LPI', 'LPL', 'LPLA', 'LPNT', 'LPSN', 'LPT', 'LPTH', 'LPTX', 'LPX', 'LQ', 'LQD', 'LQDH', 'LQDT', 'LRAD', 'LRCX', 'LRET', 'LRGE', 'LRGF', 'LRN', 'LSBK', 'LSCC', 'LSI', 'LSTK', 'LSTR', 'LSVX', 'LSXMA', 'LSXMB', 'LSXMK', 'LTBR', 'LTC', 'LTEA', 'LTL', 'LTM', 'LTPZ', 'LTRPA', 'LTRPB', 'LTRX', 'LTXB', 'LUB', 'LUK', 'LULU', 'LUNA', 'LUV', 'LVHD', 'LVHE', 'LVHI', 'LVIN', 'LVL', 'LVNTA', 'LVNTB', 'LVS', 'LVUS', 'LW', 'LWAY', 'LXFR', 'LXFT', 'LXP', 'LXP^C', 'LXRX', 'LXU', 'LYB', 'LYG', 'LYL', 'LYTS', 'LYV', 'LZB', 'M', 'MA', 'MAA', 'MAA^I', 'MAC', 'MACK', 'MACQ', 'MACQU', 'MACQW', 'MAGA', 'MAGS', 'MAIN', 'MAMS', 'MAN', 'MANH', 'MANT', 'MANU', 'MAPI', 'MAR', 'MARA', 'MARK', 'MARPS', 'MAS', 'MASI', 'MAT', 'MATF', 'MATH', 'MATR', 'MATW', 'MATX', 'MAV', 'MAXR', 'MAYS', 'MB', 'MBB', 'MBCN', 'MBFI', 'MBFIP', 'MBG', 'MBI', 'MBII', 'MBIN', 'MBIO', 'MBOT', 'MBRX', 'MBSD', 'MBT', 'MBTF', 'MBUU', 'MBVX', 'MBWM', 'MC', 'MCA', 'MCB', 'MCBC', 'MCC', 'MCD', 'MCEF', 'MCEP', 'MCFT', 'MCHI', 'MCHP', 'MCHX', 'MCI', 'MCK', 'MCN', 'MCO', 'MCR', 'MCRB', 'MCRI', 'MCRN', 'MCRO', 'MCS', 'MCV', 'MCX', 'MCY', 'MD', 'MDB', 'MDC', 'MDCA', 'MDCO', 'MDGL', 'MDGS', 'MDIV', 'MDLQ', 'MDLX', 'MDLY', 'MDLZ', 'MDP', 'MDR', 'MDRX', 'MDSO', 'MDT', 'MDU', 'MDVX', 'MDVXW', 'MDWD', 'MDXG', 'MDY', 'MDYG', 'MDYV', 'MEAR', 'MED', 'MEDP', 'MEET', 'MEI', 'MEIP', 'MELI', 'MELR', 'MEN', 'MEOH', 'MERC', 'MER^K', 'MER^P', 'MESO', 'MET', 'METC', 'MET^A', 'MEXX', 'MFA', 'MFA^B', 'MFC', 'MFCB', 'MFD', 'MFDX', 'MFEM', 'MFG', 'MFGP', 'MFIN', 'MFINL', 'MFL', 'MFLA', 'MFM', 'MFNC', 'MFO', 'MFSF', 'MFT', 'MFUS', 'MFV', 'MG', 'MGA', 'MGC', 'MGCD', 'MGEE', 'MGEN', 'MGF', 'MGI', 'MGIC', 'MGK', 'MGLN', 'MGM', 'MGNX', 'MGP', 'MGPI', 'MGRC', 'MGU', 'MGV', 'MGYR', 'MHD', 'MHF', 'MHI', 'MHK', 'MHLA', 'MHLD', 'MHN', 'MHNC', 'MHO', 'MH^A', 'MH^C', 'MH^D', 'MIC', 'MICT', 'MICTW', 'MIDD', 'MIDU', 'MIDZ', 'MIE', 'MIII', 'MIIIU', 'MIIIW', 'MIK', 'MILN', 'MIME', 'MIN', 'MINC', 'MIND', 'MINDP', 'MINI', 'MINT', 'MITK', 'MITL', 'MITT', 'MITT^A', 'MITT^B', 'MIXT', 'MIY', 'MKC', 'MKC.V', 'MKL', 'MKSI', 'MKTX', 'MLAB', 'MLCO', 'MLHR', 'MLI', 'MLM', 'MLN', 'MLNK', 'MLNT', 'MLNX', 'MLP', 'MLPA', 'MLPB', 'MLPC', 'MLPE', 'MLPG', 'MLPI', 'MLPO', 'MLPQ', 'MLPS', 'MLPX', 'MLPY', 'MLPZ', 'MLQD', 'MLR', 'MLTI', 'MLVF', 'MMAC', 'MMC', 'MMD', 'MMDM', 'MMDMR', 'MMDMU', 'MMDMW', 'MMI', 'MMLP', 'MMM', 'MMP', 'MMS', 'MMSI', 'MMT', 'MMTM', 'MMU', 'MMYT', 'MN', 'MNA', 'MNDO', 'MNE', 'MNGA', 'MNK', 'MNKD', 'MNOV', 'MNP', 'MNR', 'MNRO', 'MNR^C', 'MNST', 'MNTA', 'MNTX', 'MO', 'MOAT', 'MOBL', 'MOD', 'MODN', 'MOFG', 'MOG.A', 'MOG.B', 'MOGLC', 'MOH', 'MOM', 'MOMO', 'MON', 'MOO', 'MORL', 'MORN', 'MORT', 'MOS', 'MOSC.U', 'MOSY', 'MOTA', 'MOTI', 'MOV', 'MOXC', 'MPA', 'MPAA', 'MPAC', 'MPACU', 'MPACW', 'MPB', 'MPC', 'MPCT', 'MPLX', 'MPO', 'MPV', 'MPVD', 'MPW', 'MPWR', 'MPX', 'MP^D', 'MQT', 'MQY', 'MRAM', 'MRBK', 'MRC', 'MRCC', 'MRCY', 'MRDN', 'MRDNW', 'MRGR', 'MRIC', 'MRIN', 'MRK', 'MRLN', 'MRNS', 'MRO', 'MRRL', 'MRSN', 'MRT', 'MRTN', 'MRTX', 'MRUS', 'MRVL', 'MS', 'MSA', 'MSB', 'MSBF', 'MSBI', 'MSCA', 'MSCC', 'MSCI', 'MSD', 'MSDI', 'MSDIW', 'MSEX', 'MSF', 'MSFG', 'MSFT', 'MSG', 'MSGN', 'MSI', 'MSL', 'MSM', 'MSON', 'MSP', 'MSTR', 'MS^A', 'MS^E', 'MS^F', 'MS^G', 'MS^I', 'MS^K', 'MT', 'MTB', 'MTB.WS', 'MTBC', 'MTBCP', 'MTB^', 'MTB^C', 'MTCH', 'MTD', 'MTDR', 'MTEM', 'MTEX', 'MTFB', 'MTFBW', 'MTG', 'MTGE', 'MTGEP', 'MTH', 'MTL', 'MTLS', 'MTL^', 'MTN', 'MTOR', 'MTP', 'MTR', 'MTRN', 'MTRX', 'MTSC', 'MTSI', 'MTSL', 'MTT', 'MTU', 'MTUM', 'MTW', 'MTX', 'MTZ', 'MU', 'MUA', 'MUB', 'MUC', 'MUE', 'MUH', 'MUI', 'MUJ', 'MULE', 'MUNI', 'MUR', 'MUS', 'MUSA', 'MUX', 'MVC', 'MVCB', 'MVIN', 'MVIS', 'MVO', 'MVT', 'MVV', 'MWA', 'MX', 'MXDU', 'MXE', 'MXF', 'MXI', 'MXIM', 'MXL', 'MXWL', 'MYC', 'MYD', 'MYE', 'MYF', 'MYGN', 'MYI', 'MYJ', 'MYL', 'MYN', 'MYND', 'MYNDW', 'MYOK', 'MYOS', 'MYOV', 'MYRG', 'MYSZ', 'MYY', 'MZF', 'MZOR', 'MZZ', 'NAC', 'NAD', 'NAII', 'NAIL', 'NAKD', 'NAN', 'NANO', 'NANR', 'NAO', 'NAOV', 'NAP', 'NASH', 'NAT', 'NATH', 'NATI', 'NATR', 'NAUH', 'NAV', 'NAVG', 'NAVI', 'NAV^D', 'NAZ', 'NBB', 'NBCP', 'NBD', 'NBEV', 'NBHC', 'NBIX', 'NBL', 'NBLX', 'NBN', 'NBR', 'NBRV', 'NBTB', 'NC', 'NCA', 'NCB', 'NCBS', 'NCI', 'NCLH', 'NCMI', 'NCNA', 'NCOM', 'NCR', 'NCS', 'NCSM', 'NCTY', 'NCV', 'NCZ', 'NDAQ', 'NDLS', 'NDP', 'NDRA', 'NDRAW', 'NDRO', 'NDSN', 'NE', 'NEA', 'NEAR', 'NEE', 'NEE^I', 'NEE^J', 'NEE^K', 'NEE^Q', 'NEE^R', 'NEM', 'NEO', 'NEOG', 'NEON', 'NEOS', 'NEOT', 'NEP', 'NEPT', 'NERV', 'NESR', 'NESRW', 'NETE', 'NETS', 'NEU', 'NEV', 'NEWA', 'NEWM', 'NEWR', 'NEWS', 'NEWT', 'NEWTL', 'NEWTZ', 'NEXA', 'NEXT', 'NEXTW', 'NFBK', 'NFEC', 'NFG', 'NFJ', 'NFLT', 'NFLX', 'NFO', 'NFRA', 'NFX', 'NGE', 'NGG', 'NGHC', 'NGHCN', 'NGHCO', 'NGHCP', 'NGHCZ', 'NGL', 'NGLS^A', 'NGL^B', 'NGS', 'NGVC', 'NGVT', 'NH', 'NHA', 'NHF', 'NHI', 'NHLD', 'NHLDW', 'NHTC', 'NI', 'NIB', 'NICE', 'NICK', 'NID', 'NIE', 'NIHD', 'NIM', 'NINI', 'NIQ', 'NITE', 'NJR', 'NJV', 'NK', 'NKE', 'NKG', 'NKSH', 'NKTR', 'NKX', 'NL', 'NLNK', 'NLR', 'NLS', 'NLSN', 'NLST', 'NLY', 'NLY^C', 'NLY^D', 'NLY^E', 'NLY^F', 'NM', 'NMFC', 'NMI', 'NMIH', 'NMK^B', 'NMK^C', 'NMM', 'NMR', 'NMRX', 'NMS', 'NMT', 'NMY', 'NMZ', 'NM^G', 'NM^H', 'NNA', 'NNBR', 'NNC', 'NNDM', 'NNI', 'NNN', 'NNN^E', 'NNN^F', 'NNY', 'NOA', 'NOAH', 'NOBL', 'NOC', 'NODK', 'NOK', 'NOM', 'NOMD', 'NORW', 'NOV', 'NOVN', 'NOVT', 'NOW', 'NP', 'NPK', 'NPN', 'NPO', 'NPTN', 'NPV', 'NQ', 'NQP', 'NR', 'NRCIA', 'NRCIB', 'NRE', 'NRG', 'NRIM', 'NRK', 'NRP', 'NRT', 'NRZ', 'NS', 'NSA', 'NSA^A', 'NSC', 'NSEC', 'NSH', 'NSIT', 'NSL', 'NSM', 'NSP', 'NSS', 'NSSC', 'NSTG', 'NSYS', 'NS^A', 'NS^B', 'NTAP', 'NTB', 'NTC', 'NTCT', 'NTEC', 'NTES', 'NTEST', 'NTEST.A', 'NTEST.B', 'NTEST.C', 'NTG', 'NTGR', 'NTIC', 'NTL', 'NTLA', 'NTNX', 'NTP', 'NTRA', 'NTRI', 'NTRP', 'NTRS', 'NTRSP', 'NTWK', 'NTX', 'NTZ', 'NUAG', 'NUAN', 'NUBD', 'NUDM', 'NUE', 'NUEM', 'NUGT', 'NULG', 'NULV', 'NUM', 'NUMG', 'NUMV', 'NUO', 'NURE', 'NURO', 'NUROW', 'NUS', 'NUSA', 'NUSC', 'NUV', 'NUVA', 'NUW', 'NVAX', 'NVCN', 'NVCR', 'NVDA', 'NVEC', 'NVEE', 'NVFY', 'NVG', 'NVGN', 'NVGS', 'NVIV', 'NVLN', 'NVMI', 'NVO', 'NVR', 'NVRO', 'NVS', 'NVTA', 'NVTR', 'NVUS', 'NWBI', 'NWE', 'NWFL', 'NWHM', 'NWL', 'NWLI', 'NWN', 'NWPX', 'NWS', 'NWSA', 'NWY', 'NX', 'NXC', 'NXEO', 'NXEOU', 'NXEOW', 'NXJ', 'NXN', 'NXP', 'NXPI', 'NXQ', 'NXR', 'NXRT', 'NXST', 'NXTD', 'NXTDW', 'NXTM', 'NYCB', 'NYCB^A', 'NYCB^U', 'NYF', 'NYLD', 'NYLD.A', 'NYMT', 'NYMTN', 'NYMTO', 'NYMTP', 'NYMX', 'NYNY', 'NYRT', 'NYT', 'NYV', 'NZF', 'O', 'OA', 'OACQ', 'OACQR', 'OACQU', 'OACQW', 'OAK', 'OAKS', 'OAKS^A', 'OAPH', 'OAS', 'OASI', 'OASM', 'OBAS', 'OBCI', 'OBE', 'OBLN', 'OBSV', 'OC', 'OCC', 'OCFC', 'OCIP', 'OCLR', 'OCN', 'OCRX', 'OCSI', 'OCSL', 'OCSLL', 'OCUL', 'ODC', 'ODFL', 'ODP', 'OEC', 'OEF', 'OESX', 'OEUH', 'OEUR', 'OEW', 'OFC', 'OFED', 'OFG', 'OFG^A', 'OFG^B', 'OFG^D', 'OFIX', 'OFLX', 'OFS', 'OGE', 'OGS', 'OHAI', 'OHGI', 'OHI', 'OHRP', 'OI', 'OIA', 'OIBR.C', 'OIH', 'OII', 'OIIL', 'OIIM', 'OIL', 'OILB', 'OILD', 'OILK', 'OILU', 'OILX', 'OIS', 'OKE', 'OKTA', 'OLBK', 'OLD', 'OLED', 'OLEM', 'OLLI', 'OLN', 'OLO', 'OLP', 'OMAA', 'OMAB', 'OMAM', 'OMC', 'OMCL', 'OME', 'OMED', 'OMER', 'OMEX', 'OMF', 'OMI', 'OMN', 'OMNT', 'OMP', 'ON', 'ONB', 'ONCE', 'ONCS', 'ONDK', 'ONEO', 'ONEQ', 'ONEV', 'ONEY', 'ONG', 'ONS', 'ONSIW', 'ONSIZ', 'ONTL', 'ONTX', 'ONTXW', 'ONVI', 'ONVO', 'OOMA', 'OPB', 'OPD', 'OPGN', 'OPGNW', 'OPHC', 'OPHT', 'OPK', 'OPNT', 'OPOF', 'OPP', 'OPTN', 'OPTT', 'OPY', 'OR', 'ORA', 'ORAN', 'ORBC', 'ORBK', 'ORC', 'ORCL', 'OREX', 'ORG', 'ORI', 'ORIG', 'ORIT', 'ORLY', 'ORMP', 'ORN', 'ORPN', 'ORRF', 'OSB', 'OSBC', 'OSBCP', 'OSG', 'OSIS', 'OSK', 'OSLE', 'OSN', 'OSPR', 'OSPRU', 'OSPRW', 'OSTK', 'OSUR', 'OTEL', 'OTEX', 'OTG', 'OTIC', 'OTIV', 'OTTR', 'OTTW', 'OUNZ', 'OUSA', 'OUSM', 'OUT', 'OVAS', 'OVBC', 'OVID', 'OVLC', 'OVLY', 'OXBR', 'OXBRW', 'OXFD', 'OXLC', 'OXLCM', 'OXLCO', 'OXM', 'OXY', 'OZM', 'OZRK', 'P', 'PAA', 'PAAS', 'PAC', 'PACB', 'PACW', 'PAF', 'PAG', 'PAGG', 'PAGP', 'PAH', 'PAHC', 'PAI', 'PAK', 'PALL', 'PAM', 'PANL', 'PANW', 'PAR', 'PATI', 'PATK', 'PAVE', 'PAVM', 'PAVMW', 'PAY', 'PAYC', 'PAYX', 'PB', 'PBA', 'PBB', 'PBBI', 'PBCT', 'PBCTP', 'PBD', 'PBDM', 'PBE', 'PBEE', 'PBF', 'PBFX', 'PBH', 'PBHC', 'PBI', 'PBIB', 'PBIO', 'PBIP', 'PBI^B', 'PBJ', 'PBMD', 'PBNC', 'PBND', 'PBP', 'PBPB', 'PBR', 'PBR.A', 'PBS', 'PBSK', 'PBSM', 'PBT', 'PBTP', 'PBUS', 'PBW', 'PBYI', 'PCAR', 'PCEF', 'PCF', 'PCG', 'PCH', 'PCI', 'PCK', 'PCLN', 'PCM', 'PCMI', 'PCN', 'PCO', 'PCOM', 'PCQ', 'PCRX', 'PCSB', 'PCTI', 'PCTY', 'PCY', 'PCYG', 'PCYO', 'PDBC', 'PDCE', 'PDCO', 'PDEX', 'PDFS', 'PDI', 'PDLB', 'PDLI', 'PDM', 'PDN', 'PDP', 'PDS', 'PDT', 'PDVW', 'PE', 'PEB', 'PEBK', 'PEBO', 'PEB^C', 'PEB^D', 'PEG', 'PEGA', 'PEGI', 'PEI', 'PEIX', 'PEI^B', 'PEI^C', 'PEI^D', 'PEJ', 'PEK', 'PEN', 'PENN', 'PEO', 'PEP', 'PER', 'PERI', 'PERY', 'PES', 'PESI', 'PETQ', 'PETS', 'PETX', 'PETZ', 'PEX', 'PEY', 'PEZ', 'PF', 'PFBC', 'PFBI', 'PFBX', 'PFD', 'PFE', 'PFF', 'PFFD', 'PFFR', 'PFG', 'PFGC', 'PFH', 'PFI', 'PFIE', 'PFIG', 'PFIN', 'PFIS', 'PFK', 'PFL', 'PFLT', 'PFM', 'PFMT', 'PFN', 'PFO', 'PFPT', 'PFS', 'PFSI', 'PFSW', 'PFXF', 'PG', 'PGAL', 'PGC', 'PGD', 'PGEM', 'PGF', 'PGH', 'PGHY', 'PGJ', 'PGLC', 'PGM', 'PGNX', 'PGP', 'PGR', 'PGRE', 'PGTI', 'PGX', 'PGZ', 'PH', 'PHB', 'PHD', 'PHDG', 'PHG', 'PHH', 'PHI', 'PHII', 'PHIIK', 'PHK', 'PHM', 'PHO', 'PHT', 'PHX', 'PHYS', 'PI', 'PICB', 'PICK', 'PICO', 'PID', 'PIE', 'PIH', 'PII', 'PIM', 'PIN', 'PINC', 'PIO', 'PIR', 'PIRS', 'PIXY', 'PIY', 'PIZ', 'PJC', 'PJH', 'PJP', 'PJT', 'PK', 'PKB', 'PKBK', 'PKD', 'PKE', 'PKG', 'PKI', 'PKO', 'PKOH', 'PKW', 'PKX', 'PLAB', 'PLAY', 'PLBC', 'PLCE', 'PLD', 'PLND', 'PLNT', 'PLOW', 'PLPC', 'PLPM', 'PLSE', 'PLT', 'PLUG', 'PLUS', 'PLW', 'PLXP', 'PLXS', 'PLYA', 'PM', 'PMBC', 'PMC', 'PMD', 'PME', 'PMF', 'PML', 'PMM', 'PMO', 'PMOM', 'PMPT', 'PMR', 'PMT', 'PMTS', 'PMT^A', 'PMT^B', 'PMX', 'PN', 'PNBK', 'PNC', 'PNC.WS', 'PNC^P', 'PNC^Q', 'PNF', 'PNFP', 'PNI', 'PNK', 'PNM', 'PNNT', 'PNQI', 'PNR', 'PNRG', 'PNTR', 'PNW', 'PODD', 'POL', 'POLA', 'POOL', 'POPE', 'POR', 'POST', 'POT', 'POWI', 'POWL', 'PPA', 'PPBI', 'PPC', 'PPG', 'PPH', 'PPHM', 'PPHMP', 'PPIH', 'PPL', 'PPLN', 'PPLT', 'PPR', 'PPSI', 'PPT', 'PPX', 'PQ', 'PQG', 'PRA', 'PRAA', 'PRAH', 'PRAN', 'PRB', 'PRCP', 'PREF', 'PRE^F', 'PRE^G', 'PRE^H', 'PRE^I', 'PRF', 'PRFT', 'PRFZ', 'PRGO', 'PRGS', 'PRGX', 'PRH', 'PRI', 'PRIM', 'PRKR', 'PRLB', 'PRME', 'PRMW', 'PRN', 'PRNT', 'PRO', 'PROV', 'PRPH', 'PRPO', 'PRQR', 'PRSC', 'PRSS', 'PRTA', 'PRTK', 'PRTO', 'PRTS', 'PRTY', 'PRU', 'PSA', 'PSAU', 'PSA^A', 'PSA^B', 'PSA^C', 'PSA^D', 'PSA^E', 'PSA^F', 'PSA^G', 'PSA^U', 'PSA^V', 'PSA^W', 'PSA^X', 'PSA^Y', 'PSA^Z', 'PSB', 'PSB^T', 'PSB^U', 'PSB^V', 'PSB^W', 'PSB^X', 'PSC', 'PSCC', 'PSCD', 'PSCE', 'PSCF', 'PSCH', 'PSCI', 'PSCM', 'PSCT', 'PSCU', 'PSDO', 'PSDV', 'PSEC', 'PSET', 'PSF', 'PSI', 'PSJ', 'PSK', 'PSL', 'PSLV', 'PSMB', 'PSMC', 'PSMG', 'PSMM', 'PSMT', 'PSO', 'PSP', 'PSQ', 'PSR', 'PST', 'PSTB', 'PSTG', 'PSTI', 'PSX', 'PSXP', 'PTC', 'PTCT', 'PTEN', 'PTEU', 'PTF', 'PTGX', 'PTH', 'PTI', 'PTIE', 'PTLA', 'PTLC', 'PTM', 'PTMC', 'PTNQ', 'PTNR', 'PTR', 'PTSI', 'PTX', 'PTY', 'PUB', 'PUI', 'PUK', 'PUK^', 'PUK^A', 'PULM', 'PUMP', 'PUTW', 'PUW', 'PVAC', 'PdailyVal', 'PVBC', 'PVG', 'PVH', 'PVI', 'PWB', 'PWC', 'PWOD', 'PWR', 'PWV', 'PWZ', 'PX', 'PXD', 'PXE', 'PXF', 'PXH', 'PXI', 'PXJ', 'PXLG', 'PXLV', 'PXLW', 'PXMG', 'PXMV', 'PXQ', 'PXR', 'PXS', 'PXSG', 'PXSV', 'PXUS', 'PY', 'PYDS', 'PYN', 'PYPL', 'PYS', 'PYT', 'PYZ', 'PZA', 'PZC', 'PZD', 'PZE', 'PZI', 'PZN', 'PZRX', 'PZT', 'PZZA', 'Q', 'QABA', 'QADA', 'QADB', 'QAI', 'QAT', 'QBAK', 'QCAN', 'QCLN', 'QCOM', 'QCP', 'QCRH', 'QD', 'QDEF', 'QDEL', 'QDEU', 'QDF', 'QDYN', 'QED', 'QEFA', 'QEMM', 'QEP', 'QGBR', 'QGEN', 'QGTA', 'QHC', 'QID', 'QINC', 'QIWI', 'QJPN', 'QLC', 'QLD', 'QLS', 'QLTA', 'QLYS', 'QMN', 'QMOM', 'QNST', 'QQEW', 'QQQ', 'QQQC', 'QQQE', 'QQQX', 'QQXT', 'QRHC', 'QRVO', 'QSII', 'QSR', 'QTEC', 'QTM', 'QTNA', 'QTNT', 'QTRH', 'QTS', 'QTWO', 'QUAD', 'QUAL', 'QUIK', 'QUMU', 'QUOT', 'QURE', 'QUS', 'QdailyVal', 'QVCA', 'QVCB', 'QVM', 'QWLD', 'QYLD', 'R', 'RA', 'RACE', 'RAD', 'RADA', 'RAIL', 'RALS', 'RAND', 'RARE', 'RARX', 'RAS', 'RAS^A', 'RAS^B', 'RAS^C', 'RAVE', 'RAVI', 'RAVN', 'RBA', 'RBB', 'RBC', 'RBCAA', 'RBCN', 'RBIN', 'RBIO', 'RBPAA', 'RBS', 'RBS^S', 'RBUS', 'RCD', 'RCI', 'RCII', 'RCKY', 'RCL', 'RCM', 'RCMT', 'RCOM', 'RCON', 'RCS', 'RDC', 'RDCM', 'RDFN', 'RDHL', 'RDI', 'RDIB', 'RDIV', 'RDN', 'RDNT', 'RDS.A', 'RDS.B', 'RDUS', 'RDVY', 'RDWR', 'RDY', 'RE', 'RECN', 'REDU', 'REEM', 'REET', 'REFA', 'REFR', 'REG', 'REGI', 'REGL', 'REGN', 'REIS', 'REK', 'RELL', 'RELV', 'RELX', 'RELY', 'REM', 'REML', 'REMX', 'REN', 'RENN', 'RENX', 'REPH', 'RES', 'RESI', 'RESN', 'RETA', 'RETL', 'REV', 'REVG', 'REW', 'REX', 'REXR', 'REXR^A', 'REXX', 'REZ', 'RF', 'RFAP', 'RFCI', 'RFDA', 'RFDI', 'RFEM', 'RFEU', 'RFFC', 'RFG', 'RFI', 'RFIL', 'RFP', 'RFT', 'RFTA', 'RFUN', 'RFV', 'RF^A', 'RF^B', 'RGA', 'RGC', 'RGCO', 'RGEN', 'RGI', 'RGLB', 'RGLD', 'RGLS', 'RGNX', 'RGR', 'RGS', 'RGSE', 'RGT', 'RH', 'RHI', 'RHP', 'RHS', 'RHT', 'RIBT', 'RIBTW', 'RIC', 'RICE', 'RICK', 'RIG', 'RIGL', 'RIGS', 'RILY', 'RILYL', 'RILYZ', 'RINF', 'RING', 'RIO', 'RIOT', 'RISE', 'RIV', 'RJA', 'RJF', 'RJI', 'RJN', 'RJZ', 'RKDA', 'RL', 'RLGY', 'RLH', 'RLI', 'RLJ', 'RLJE', 'RLJ^A', 'RLOG', 'RLY', 'RM', 'RMAX', 'RMBL', 'RMBS', 'RMCF', 'RMD', 'RMGN', 'RMNI', 'RMNIU', 'RMNIW', 'RMP', 'RMPL^', 'RMR', 'RMT', 'RMTI', 'RNDB', 'RNDM', 'RNDV', 'RNEM', 'RNET', 'RNG', 'RNGR', 'RNLC', 'RNMC', 'RNP', 'RNR', 'RNR^C', 'RNR^E', 'RNSC', 'RNST', 'RNWK', 'ROAM', 'ROBO', 'ROCK', 'RODI', 'RODM', 'ROG', 'ROGS', 'ROIC', 'ROK', 'ROKA', 'ROKU', 'ROL', 'ROLA', 'ROLL', 'ROM', 'ROOF', 'ROP', 'RORE', 'ROSE', 'ROSEU', 'ROSEW', 'ROSG', 'ROST', 'ROUS', 'ROYT', 'RP', 'RPAI', 'RPAI^A.CL', 'RPD', 'RPG', 'RPM', 'RPRX', 'RPT', 'RPT^D', 'RPV', 'RPXC', 'RQI', 'RRC', 'RRD', 'RRGB', 'RRR', 'RRTS', 'RS', 'RSAS', 'RSG', 'RSLS', 'RSO', 'RSO^A', 'RSO^B', 'RSO^C', 'RSP', 'RSPP', 'RST', 'RSX', 'RSXJ', 'RSYS', 'RT', 'RTEC', 'RTH', 'RTIX', 'RTLA', 'RTM', 'RTN', 'RTNB', 'RTRX', 'RTTR', 'RUBI', 'RUN', 'RUSHA', 'RUSHB', 'RUSL', 'RUSS', 'RUTH', 'RVEN', 'RVLT', 'RVNC', 'RVNU', 'RVSB', 'RVT', 'RWJ', 'RWK', 'RWL', 'RWLK', 'RWM', 'RWO', 'RWR', 'RWT', 'RWW', 'RWX', 'RXD', 'RXDX', 'RXI', 'RXII', 'RXIIW', 'RXL', 'RXN', 'RXN^A', 'RY', 'RYAAY', 'RYAM', 'RYAM^A', 'RYB', 'RYE', 'RYF', 'RYH', 'RYI', 'RYJ', 'RYN', 'RYT', 'RYTM', 'RYU', 'RY^S.CL', 'RY^T', 'RZA', 'RZB', 'RZG', 'RZV', 'S', 'SA', 'SAA', 'SAB', 'SABR', 'SAEX', 'SAFE', 'SAFM', 'SAFT', 'SAGE', 'SAGG', 'SAH', 'SAIA', 'SAIC', 'SAL', 'SALM', 'SALT', 'SAM', 'SAMG', 'SAN', 'SANM', 'SANW', 'SAN^A', 'SAN^B', 'SAN^C', 'SAN^I', 'SAP', 'SAR', 'SASR', 'SATS', 'SAUC', 'SAVE', 'SB', 'SBAC', 'SBB', 'SBBC', 'SBBP', 'SBBX', 'SBCF', 'SBCP', 'SBFG', 'SBFGP', 'SBGI', 'SBGL', 'SBH', 'SBI', 'SBIO', 'SBLK', 'SBLKL', 'SBM', 'SBNA', 'SBNY', 'SBNYW', 'SBOT', 'SBOW', 'SBPH', 'SBR', 'SBRA', 'SBRAP', 'SBS', 'SBSI', 'SBUX', 'SBV', 'SB^B', 'SB^C', 'SB^D', 'SC', 'SCA', 'SCAC', 'SCACU', 'SCACW', 'SCAP', 'SCC', 'SCCI', 'SCCO', 'SCD', 'SCE^G', 'SCE^H', 'SCE^J', 'SCE^K', 'SCE^L', 'SCG', 'SCHA', 'SCHB', 'SCHC', 'SCHD', 'SCHE', 'SCHF', 'SCHG', 'SCHH', 'SCHL', 'SCHM', 'SCHN', 'SCHO', 'SCHP', 'SCHR', 'SCHV', 'SCHW', 'SCHW^B.CL', 'SCHW^C', 'SCHW^D', 'SCHX', 'SCHZ', 'SCI', 'SCID', 'SCIF', 'SCIJ', 'SCIN', 'SCIU', 'SCIX', 'SCJ', 'SCKT', 'SCL', 'SCM', 'SCMP', 'SCO', 'SCON', 'SCS', 'SCSC', 'SCTO', 'SCVL', 'SCWX', 'SCX', 'SCYX', 'SCZ', 'SD', 'SDD', 'SDEM', 'SDIV', 'SDLP', 'SDOG', 'SDOW', 'SDP', 'SDR', 'SDRL', 'SDS', 'SDT', 'SDVY', 'SDY', 'SDYL', 'SE', 'SEA', 'SEAC', 'SEAS', 'SECO', 'SEDG', 'SEE', 'SEED', 'SEF', 'SEIC', 'SELB', 'SELF', 'SEM', 'SEMG', 'SENEA', 'SENEB', 'SEP', 'SERV', 'SF', 'SFB', 'SFBC', 'SFBS', 'SFE', 'SFHY', 'SFIG', 'SFL', 'SFLA', 'SFLY', 'SFM', 'SFNC', 'SFR', 'SFS', 'SFST', 'SFUN', 'SF^A', 'SGAR', 'SGBX', 'SGC', 'SGDJ', 'SGDM', 'SGEN', 'SGF', 'SGG', 'SGH', 'SGLB', 'SGLBW', 'SGMA', 'SGMO', 'SGMS', 'SGOC', 'SGOL', 'SGQI', 'SGRP', 'SGRY', 'SGU', 'SGY', 'SGYP', 'SGZA', 'SH', 'SHAG', 'SHAK', 'SHBI', 'SHE', 'SHEN', 'SHG', 'SHI', 'SHIP', 'SHIPW', 'SHLD', 'SHLDW', 'SHLM', 'SHLO', 'SHLX', 'SHM', 'SHNY', 'SHO', 'SHOO', 'SHOP', 'SHOS', 'SHO^E', 'SHO^F', 'SHPG', 'SHSP', 'SHV', 'SHW', 'SHY', 'SHYD', 'SHYG', 'SID', 'SIEB', 'SIEN', 'SIFI', 'SIFY', 'SIG', 'SIGI', 'SIGM', 'SIJ', 'SIL', 'SILC', 'SILJ', 'SIMO', 'SINA', 'SINO', 'SIR', 'SIRI', 'SITE', 'SITO', 'SIVB', 'SIVBO', 'SIVR', 'SIX', 'SIZ', 'SIZE', 'SJB', 'SJI', 'SJM', 'SJNK', 'SJR', 'SJT', 'SJW', 'SKF', 'SKIS', 'SKLN', 'SKM', 'SKOR', 'SKT', 'SKX', 'SKYS', 'SKYW', 'SKYY', 'SLAB', 'SLB', 'SLCA', 'SLCT', 'SLD', 'SLDA', 'SLF', 'SLG', 'SLGN', 'SLG^I', 'SLIM', 'SLM', 'SLMBP', 'SLNO', 'SLNOW', 'SLP', 'SLQD', 'SLRA', 'SLRC', 'SLTB', 'SLV', 'SLVO', 'SLVP', 'SLX', 'SLY', 'SLYG', 'SLYV', 'SM', 'SMB', 'SMBC', 'SMBK', 'SMCI', 'SMCP', 'SMDD', 'SMDV', 'SMED', 'SMEZ', 'SMFG', 'SMG', 'SMH', 'SMHD', 'SMHI', 'SMI', 'SMIN', 'SMIT', 'SMLF', 'SMLL', 'SMLP', 'SMLV', 'SMM', 'SMMD', 'SMMF', 'SMMT', 'SMMU', 'SMMV', 'SMN', 'SMP', 'SMPL', 'SMPLW', 'SMRT', 'SMSI', 'SMTC', 'SMTX', 'SN', 'SNA', 'SNAK', 'SNAP', 'SNBC', 'SNBR', 'SNC', 'SNCR', 'SND', 'SNDE', 'SNDR', 'SNDX', 'SNE', 'SNES', 'SNFCA', 'SNGX', 'SNGXW', 'SNH', 'SNHNI', 'SNHNL', 'SNHY', 'SNI', 'SNLN', 'SNMX', 'SNN', 'SNNA', 'SNOA', 'SNOAW', 'SNP', 'SNPS', 'SNR', 'SNSR', 'SNSS', 'SNV', 'SNV^C', 'SNX', 'SNY', 'SO', 'SOCL', 'SODA', 'SOFO', 'SOGO', 'SOHO', 'SOHOB', 'SOHOM', 'SOHOO', 'SOHU', 'SOI', 'SOIL', 'SOJA', 'SOJB', 'SOL', 'SON', 'SONA', 'SONC', 'SONS', 'SOR', 'SORL', 'SOVB', 'SOV^C', 'SOXL', 'SOXS', 'SOXX', 'SOYB', 'SP', 'SPA', 'SPAR', 'SPB', 'SPCB', 'SPDN', 'SPDW', 'SPE', 'SPEM', 'SPEX', 'SPE^B', 'SPFF', 'SPG', 'SPGI', 'SPG^J', 'SPH', 'SPHB', 'SPHD', 'SPHQ', 'SPHS', 'SPI', 'SPIL', 'SPKE', 'SPKEP', 'SPLB', 'SPLG', 'SPLK', 'SPLP', 'SPLP^A', 'SPLP^T', 'SPLV', 'SPLX', 'SPMO', 'SPMV', 'SPN', 'SPNE', 'SPNS', 'SPOK', 'SPPI', 'SPPP', 'SPR', 'SPRO', 'SPRT', 'SPSC', 'SPSM', 'SPTL', 'SPTM', 'SPTN', 'SPTS', 'SPUN', 'SPUU', 'SPVM', 'SPVU', 'SPWH', 'SPWR', 'SPXC', 'SPXE', 'SPXH', 'SPXL', 'SPXN', 'SPXS', 'SPXT', 'SPXU', 'SPXV', 'SPXX', 'SPY', 'SPYB', 'SPYD', 'SPYG', 'SPYV', 'SPYX', 'SQ', 'SQBG', 'SQLV', 'SQM', 'SQNS', 'SQQQ', 'SQZZ', 'SR', 'SRAX', 'SRC', 'SRCE', 'SRCL', 'SRCLP', 'SRC^A', 'SRDX', 'SRE', 'SRET', 'SREV', 'SRF', 'SRG', 'SRI', 'SRLN', 'SRLP', 'SRNE', 'SRPT', 'SRRA', 'SRS', 'SRT', 'SRTS', 'SRTSW', 'SRTY', 'SRUN', 'SRUNU', 'SRUNW', 'SRV', 'SRVA', 'SSB', 'SSBI', 'SSC', 'SSD', 'SSFN', 'SSG', 'SSI', 'SSKN', 'SSL', 'SSNC', 'SSNI', 'SSNT', 'SSO', 'SSP', 'SSRM', 'SSTI', 'SSTK', 'SSW', 'SSWA', 'SSWN', 'SSW^D', 'SSW^E', 'SSW^G', 'SSW^H', 'SSYS', 'ST', 'STAA', 'STAF', 'STAG', 'STAG^B', 'STAG^C', 'STAR', 'STAR^D', 'STAR^G', 'STAR^I', 'STAY', 'STB', 'STBA', 'STBZ', 'STC', 'STDY', 'STE', 'STFC', 'STI', 'STI.WS.A', 'STI.WS.B', 'STIP', 'STI^A', 'STI^E', 'STK', 'STKL', 'STKS', 'STL', 'STLD', 'STLR', 'STLRU', 'STLRW', 'STLY', 'STL^A', 'STM', 'STML', 'STMP', 'STN', 'STNG', 'STNLU', 'STO', 'STON', 'STOR', 'STOT', 'STPP', 'STPZ', 'STRA', 'STRL', 'STRM', 'STRS', 'STRT', 'STT', 'STT^C', 'STT^D', 'STT^E', 'STT^G', 'STWD', 'STX', 'STZ', 'STZ.B', 'SU', 'SUB', 'SUI', 'SUI^A', 'SUM', 'SUMR', 'SUN', 'SUNS', 'SUNW', 'SUP', 'SUPN', 'SUPV', 'SUSA', 'SUSB', 'SUSC', 'SVA', 'SVBI', 'SVRA', 'SVU', 'SVVC', 'SVXY', 'SWCH', 'SWIN', 'SWIR', 'SWJ', 'SWK', 'SWKS', 'SWM', 'SWN', 'SWNC', 'SWP', 'SWX', 'SWZ', 'SXC', 'SXCP', 'SXE', 'SXI', 'SXT', 'SYBT', 'SYBX', 'SYE', 'SYF', 'SYG', 'SYK', 'SYKE', 'SYLD', 'SYMC', 'SYMX', 'SYNA', 'SYNC', 'SYNL', 'SYNT', 'SYPR', 'SYRS', 'SYT', 'SYV', 'SYX', 'SYY', 'SZC', 'SZK', 'SZO', 'T', 'TA', 'TAC', 'TACO', 'TACOW', 'TACT', 'TAGS', 'TAHO', 'TAIT', 'TAL', 'TAN', 'TANH', 'TANNI', 'TANNL', 'TANNZ', 'TAO', 'TAP', 'TAP.A', 'TAPR', 'TARO', 'TAST', 'TATT', 'TAX', 'TAYD', 'TBB', 'TBBK', 'TBF', 'TBI', 'TBK', 'TBLU', 'TBNK', 'TBPH', 'TBT', 'TBX', 'TCAP', 'TCBI', 'TCBIL', 'TCBIP', 'TCBIW', 'TCBK', 'TCCA', 'TCCB', 'TCCO', 'TCF', 'TCF.WS', 'TCFC', 'TCF^C', 'TCF^D', 'TCGP', 'TCHF', 'TCI', 'TCMD', 'TCO', 'TCON', 'TCO^J', 'TCO^K', 'TCP', 'TCPC', 'TCRD', 'TCRX', 'TCRZ', 'TCS', 'TCX', 'TD', 'TDA', 'TDC', 'TDE', 'TDF', 'TDG', 'TDI', 'TDIV', 'TDJ', 'TDOC', 'TDS', 'TDTF', 'TDTT', 'TDW', 'TDW.WS.A', 'TDW.WS.B', 'TDY', 'TEAM', 'TECD', 'TECH', 'TECK', 'TECL', 'TECS', 'TEDU', 'TEF', 'TEGP', 'TEI', 'TEL', 'TELL', 'TEN', 'TENX', 'TEO', 'TEP', 'TER', 'TERM', 'TERP', 'TESO', 'TESS', 'TETF', 'TEVA', 'TEX', 'TFI', 'TFLO', 'TFSL', 'TFX', 'TG', 'TGA', 'TGEN', 'TGH', 'TGI', 'TGLS', 'TGNA', 'TGP', 'TGP^A', 'TGP^B', 'TGS', 'TGT', 'TGTX', 'THC', 'THD', 'THFF', 'THG', 'THGA', 'THO', 'THQ', 'THR', 'THRM', 'THS', 'THST', 'THW', 'TI', 'TI.A', 'TICC', 'TICCL', 'TIER', 'TIF', 'TIG', 'TIL', 'TILE', 'TILT', 'TIME', 'TIP', 'TIPT', 'TIPX', 'TIPZ', 'TISA', 'TISI', 'TITN', 'TIVO', 'TJX', 'TK', 'TKC', 'TKF', 'TKR', 'TLDH', 'TLEH', 'TLF', 'TLGT', 'TLH', 'TLI', 'TLK', 'TLND', 'TLP', 'TLRA', 'TLRD', 'TLT', 'TLTD', 'TLTE', 'TLYS', 'TM', 'TMF', 'TMHC', 'TMK', 'TMK^B', 'TMK^C', 'TMO', 'TMST', 'TMUS', 'TMUSP', 'TMV', 'TNA', 'TNAV', 'TNC', 'TNDM', 'TNET', 'TNH', 'TNK', 'TNP', 'TNP^B', 'TNP^C', 'TNP^D', 'TNP^E', 'TNTR', 'TNXP', 'TOCA', 'TOK', 'TOL', 'TOLZ', 'TOO', 'TOO^A', 'TOO^B', 'TOPS', 'TORM', 'TOT', 'TOTL', 'TOUR', 'TOWN', 'TOWR', 'TPB', 'TPC', 'TPGE', 'TPGE.U', 'TPGE.WS', 'TPGH', 'TPGH.U', 'TPGH.WS', 'TPH', 'TPIC', 'TPIV', 'TPL', 'TPOR', 'TPR', 'TPRE', 'TPVG', 'TPVY', 'TPX', 'TPYP', 'TPZ', 'TQQQ', 'TR', 'TRC', 'TRCB', 'TRCH', 'TRCO', 'TREC', 'TREE', 'TREX', 'TRGP', 'TRHC', 'TRI', 'TRIB', 'TRIL', 'TRIP', 'TRK', 'TRMB', 'TRMK', 'TRMT', 'TRN', 'TRNC', 'TRNO', 'TRNS', 'TROV', 'TROW', 'TROX', 'TRP', 'TRPX', 'TRQ', 'TRS', 'TRSK', 'TRST', 'TRTN', 'TRTX', 'TRU', 'TRUE', 'TRUP', 'TRV', 'TRVG', 'TRVN', 'TS', 'TSBK', 'TSC', 'TSCO', 'TSE', 'TSEM', 'TSG', 'TSI', 'TSLA', 'TSLF', 'TSLX', 'TSM', 'TSN', 'TSQ', 'TSRI', 'TSRO', 'TSS', 'TST', 'TSU', 'TTAC', 'TTAI', 'TTC', 'TTD', 'TTEC', 'TTEK', 'TTF', 'TTFS', 'TTGT', 'TTI', 'TTM', 'TTMI', 'TTNP', 'TTOO', 'TTP', 'TTPH', 'TTS', 'TTT', 'TTWO', 'TU', 'TUES', 'TUP', 'TUR', 'TURN', 'TUSA', 'TUSK', 'TUZ', 'TV', 'TVC', 'TVE', 'TVIX', 'TVIZ', 'TVPT', 'TVTY', 'TWI', 'TWIN', 'TWLO', 'TWM', 'TWMC', 'TWN', 'TWNK', 'TWNKW', 'TWO', 'TWOU', 'TWO^A', 'TWO^B', 'TWTR', 'TWX', 'TX', 'TXMD', 'TXN', 'TXRH', 'TXT', 'TY', 'TYBS', 'TYD', 'TYG', 'TYHT', 'TYL', 'TYME', 'TYNS', 'TYO', 'TYPE', 'TY^', 'TZA', 'TZOO', 'UA', 'UAA', 'UAE', 'UAG', 'UAL', 'UAN', 'UBA', 'UBC', 'UBCP', 'UBFO', 'UBG', 'UBIO', 'UBM', 'UBN', 'UBNK', 'UBNT', 'UBOH', 'UBP', 'UBP^G', 'UBP^H', 'UBR', 'UBRT', 'UBS', 'UBSH', 'UBSI', 'UBT', 'UCBA', 'UCBI', 'UCC', 'UCFC', 'UCI', 'UCIB', 'UCO', 'UCTT', 'UDBI', 'UDN', 'UDOW', 'UDR', 'UE', 'UEIC', 'UEPS', 'UFCS', 'UFI', 'UFPI', 'UFPT', 'UFS', 'UG', 'UGA', 'UGAZ', 'UGE', 'UGI', 'UGL', 'UGLD', 'UGP', 'UHAL', 'UHN', 'UHS', 'UHT', 'UIHC', 'UIS', 'UJB', 'UL', 'ULBI', 'ULBR', 'ULE', 'ULH', 'ULST', 'ULTA', 'ULTI', 'UMBF', 'UMC', 'UMDD', 'UMH', 'UMH^B', 'UMH^C', 'UMPQ', 'UN', 'UNAM', 'UNB', 'UNF', 'UNFI', 'UNG', 'UNH', 'UNIT', 'UNL', 'UNM', 'UNP', 'UNT', 'UNTY', 'UNVR', 'UONE', 'UONEK', 'UPL', 'UPLD', 'UPRO', 'UPS', 'UPV', 'UPW', 'URA', 'URBN', 'URE', 'URGN', 'URI', 'URR', 'URTH', 'URTY', 'USA', 'USAC', 'USAG', 'USAK', 'USAP', 'USAT', 'USATP', 'USAU', 'USB', 'USB^A', 'USB^H', 'USB^M', 'USB^O', 'USCI', 'USCR', 'USD', 'USDP', 'USDU', 'USEG', 'USEQ', 'USFD', 'USFR', 'USG', 'USL', 'USLB', 'USLM', 'USLV', 'USM', 'USMC', 'USMF', 'USMV', 'USNA', 'USO', 'USOD', 'USOI', 'USOU', 'USPH', 'USRT', 'UST', 'USV', 'UTES', 'UTF', 'UTHR', 'UTI', 'UTL', 'UTLF', 'UTMD', 'UTSI', 'UTSL', 'UTX', 'UUP', 'UVE', 'UVSP', 'UVV', 'UVXY', 'UWM', 'UWT', 'UXI', 'UYG', 'UYM', 'UZA', 'UZB', 'UZC', 'V', 'VAC', 'dailyValE', 'dailyValE.P', 'dailyValU', 'dailyValX', 'VAMO', 'VAR', 'VAW', 'VB', 'VBF', 'VBFC', 'VBIV', 'VBK', 'VBLT', 'VBND', 'VBR', 'VBTX', 'VC', 'VCEL', 'VCIT', 'VCLT', 'VCO', 'VCR', 'VCRA', 'VCSH', 'VCV', 'VCYT', 'VDC', 'VDE', 'VDSI', 'VDTH', 'VEA', 'VEAC', 'VEACU', 'VEACW', 'VEC', 'VECO', 'VEDL', 'VEEV', 'VEGA', 'VEGI', 'VEON', 'VER', 'VERI', 'VERU', 'VER^F', 'VESH', 'VET', 'VEU', 'VFC', 'VFH', 'VG', 'VGI', 'VGIT', 'VGK', 'VGLT', 'VGM', 'VGR', 'VGSH', 'VGT', 'VHI', 'VHT', 'VIA', 'VIAB', 'VIAV', 'VICL', 'VICR', 'VIDI', 'VIG', 'VIGI', 'VIIX', 'VIIZ', 'VIOG', 'VIOO', 'VIOV', 'VIPS', 'VIRC', 'VIRT', 'VIS', 'VIST', 'VIV', 'VIVE', 'VIVO', 'VIXM', 'VIXY', 'VJET', 'VKQ', 'VKTX', 'VKTXW', 'VLGEA', 'VLO', 'VLP', 'VLRS', 'VLRX', 'VLT', 'VLU', 'VLUE', 'VLY', 'VLY.WS', 'VLY^A', 'VLY^B', 'VMAX', 'VMBS', 'VMC', 'VMET', 'VMI', 'VMIN', 'VMO', 'VMW', 'VNCE', 'VNDA', 'VNET', 'VNLA', 'VNM', 'VNO', 'VNOM', 'VNO^G', 'VNO^I', 'VNO^K', 'VNO^L', 'VNQ', 'VNQI', 'VNTR', 'VNTV', 'VO', 'VOC', 'VOD', 'VOE', 'VONE', 'VONG', 'VONV', 'VOO', 'VOOG', 'VOOV', 'VOT', 'VOX', 'VOXX', 'VOYA', 'VPG', 'VPL', 'VPU', 'VPV', 'VQT', 'VR', 'VRA', 'VRAY', 'VREX', 'VRIG', 'VRML', 'VRNA', 'VRNS', 'VRNT', 'VRP', 'VRS', 'VRSK', 'VRSN', 'VRTS', 'VRTSP', 'VRTU', 'VRTV', 'VRTX', 'VRX', 'VR^A', 'VR^B', 'VSAR', 'VSAT', 'VSDA', 'VSEC', 'VSH', 'VSI', 'VSLR', 'VSM', 'VSMV', 'VSS', 'VST', 'VSTM', 'VSTO', 'VT', 'VTA', 'VTC', 'VTEB', 'VTGN', 'VTHR', 'VTI', 'VTIP', 'VTL', 'VTN', 'VTNR', 'VTR', 'VTRB', 'VTV', 'VTVT', 'VTWG', 'VTWO', 'VTWV', 'VUG', 'VUSE', 'VUZI', 'VV', 'VVC', 'VVI', 'VVPR', 'VVR', 'VVUS', 'VVV', 'VWO', 'VWOB', 'VWR', 'VXF', 'VXUS', 'VXX', 'VXZ', 'VYGR', 'VYM', 'VYMI', 'VZ', 'VZA', 'W', 'WAAS', 'WAB', 'WABC', 'WAC', 'WAFD', 'WAFDW', 'WAGE', 'WAIR', 'WAL', 'WALA', 'WASH', 'WAT', 'WATT', 'WAYN', 'WB', 'WBA', 'WBAI', 'WBC', 'WBIA', 'WBIB', 'WBIC', 'WBID', 'WBIE', 'WBIF', 'WBIG', 'WBIH', 'WBII', 'WBIL', 'WBIR', 'WBIY', 'WBK', 'WBS', 'WBS^E', 'WBT', 'WCC', 'WCFB', 'WCG', 'WCN', 'WD', 'WDAY', 'WDC', 'WDFC', 'WDIV', 'WDR', 'WDRW', 'WDTI', 'WEA', 'WEAT', 'WEB', 'WEBK', 'WEC', 'WEET', 'WEN', 'WERN', 'WES', 'WETF', 'WEX', 'WEXP', 'WEYS', 'WF', 'WFBI', 'WFC', 'WFC.WS', 'WFC^J', 'WFC^L', 'WFC^N', 'WFC^O', 'WFC^P', 'WFC^Q', 'WFC^R', 'WFC^T', 'WFC^V', 'WFC^W', 'WFC^X', 'WFC^Y', 'WFE^A', 'WFHY', 'WFIG', 'WFT', 'WG', 'WGL', 'WGO', 'WGP', 'WHF', 'WHFBL', 'WHG', 'WHLM', 'WHLR', 'WHLRD', 'WHLRP', 'WHLRW', 'WHR', 'WIA', 'WIFI', 'WIL', 'WILC', 'WIN', 'WINA', 'WING', 'WINS', 'WIP', 'WIRE', 'WIT', 'WIW', 'WIX', 'WK', 'WKHS', 'WLB', 'WLDN', 'WLFC', 'WLH', 'WLK', 'WLKP', 'WLL', 'WLTW', 'WM', 'WMB', 'WMC', 'WMCR', 'WMGI', 'WMGIZ', 'WMIH', 'WMK', 'WMLP', 'WMS', 'WMT', 'WMW', 'WNC', 'WNEB', 'WNFM', 'WNS', 'WOOD', 'WOR', 'WOW', 'WPC', 'WPCS', 'WPG', 'WPG^H', 'WPG^I', 'WPM', 'WPPGY', 'WPRT', 'WPS', 'WPX', 'WPXP', 'WPZ', 'WR', 'WRB', 'WRB^B', 'WRB^C', 'WRB^D', 'WRD', 'WRE', 'WREI', 'WRI', 'WRK', 'WRLD', 'WRLS', 'WRLSR', 'WRLSU', 'WRLSW', 'WSBC', 'WSBF', 'WSCI', 'WSFS', 'WSKY', 'WSM', 'WSO', 'WSO.B', 'WSR', 'WST', 'WSTG', 'WSTL', 'WTBA', 'WTFC', 'WTFCM', 'WTFCW', 'WTI', 'WTID', 'WTIU', 'WTM', 'WTR', 'WTRX', 'WTS', 'WTTR', 'WTW', 'WU', 'WUBA', 'WUSA', 'WVE', 'WVFC', 'WVVI', 'WVVIP', 'WWD', 'WWE', 'WWR', 'WWW', 'WY', 'WYDE', 'WYIG', 'WYIGU', 'WYIGW', 'WYN', 'WYNN', 'X', 'XAR', 'XBI', 'XBIO', 'XBIT', 'XBKS', 'XCEM', 'XCO', 'XCRA', 'XEC', 'XEL', 'XELA', 'XELB', 'XENE', 'XENT', 'XES', 'XFLT', 'XGTI', 'XGTIW', 'XHB', 'XHE', 'XHR', 'XHS', 'XIN', 'XINA', 'XITK', 'XIV', 'XIVH', 'XL', 'XLB', 'XLE', 'XLF', 'XLG', 'XLI', 'XLK', 'XLNX', 'XLP', 'XLRE', 'XLRN', 'XLU', 'XLV', 'XLY', 'XME', 'XMLV', 'XMPT', 'XMX', 'XNCR', 'XNET', 'XNTK', 'XNY', 'XOG', 'XOM', 'XOMA', 'XON', 'XONE', 'XOP', 'XOXO', 'XPER', 'XPH', 'XPLR', 'XPO', 'XPP', 'XRAY', 'XRF', 'XRLV', 'XRM', 'XRT', 'XRX', 'XSD', 'XSHD', 'XSHQ', 'XSLV', 'XSOE', 'XSW', 'XT', 'XTH', 'XTL', 'XTLB', 'XTN', 'XVZ', 'XWEB', 'XXV', 'XYL', 'Y', 'YANG', 'YAO', 'YCL', 'YCS', 'YDIV', 'YECO', 'YELP', 'YERR', 'YESR', 'YEXT', 'YGE', 'YGYI', 'YIN', 'YINN', 'YLCO', 'YLD', 'YLDE', 'YMLI', 'YMLP', 'YNDX', 'YOGA', 'YORW', 'YPF', 'YRCW', 'YRD', 'YTEN', 'YTRA', 'YUM', 'YUMC', 'YUME', 'YXI', 'YY', 'YYY', 'Z', 'ZAGG', 'ZAIS', 'ZAYO', 'ZBH', 'ZBIO', 'ZBK', 'ZBRA', 'ZB^A', 'ZB^G', 'ZB^H', 'ZEAL', 'ZEN', 'ZEUS', 'ZF', 'ZFGN', 'ZG', 'ZGNX', 'ZION', 'ZIONW', 'ZIONZ', 'ZIOP', 'ZIV', 'ZIXI', 'ZKIN', 'ZLAB', 'ZMLP', 'ZN', 'ZNGA', 'ZNH', 'ZNWAA', 'ZOES', 'ZROZ', 'ZSAN', 'ZSL', 'ZTO', 'ZTR', 'ZTS', 'ZUMZ', 'ZX', 'ZYME', 'ZYNE']

        });
}());