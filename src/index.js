var $ = require('jquery');
var dt = require('datatables.net')();
var AWS = require('aws-sdk');
var dataGrid;
// Set the region 
AWS.config.update({
    region: 'us-west-1'
});
var ep = new AWS.Endpoint('http://localhost:8000');

dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-10-08',
    endpoint: ep
});

$(document).ready(function () {
    loadData();

});

function loadData() {
    var params = {
        TableName: 'Event'
    };

    // Call DynamoDB to add the item to the table
    dynamodb.scan(params, function (err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            for (const element in data.Items) {
                console.log('====================================');
                console.log(JSON.stringify(data.Items[element]));
            }

            var nColNumber = -1;
            dataGrid = $('#example').DataTable({
                data: data.Items,
                "columnDefs": [{

                        "targets": [++nColNumber],
                        'title': 'StartDate',
                        'name': 'StartDate',
                        'render': function (data, type, row) {
                            return syntaxHighlight(JSON.stringify(row.StartDate));
                        }
                    },
                    {
                        'targets': [++nColNumber],
                        'title': 'Environment',
                        'name': 'Environment',
                        'render': function (data, type, row) {
                            return syntaxHighlight(JSON.stringify(row.Environment));
                        }
                    }, {
                        'targets': [++nColNumber],
                        'title': 'Duration',
                        'name': 'Duration',
                        'render': function (data, type, row) {
                            return syntaxHighlight(JSON.stringify(row.Duration));
                        }
                    }, {

                        "targets": [++nColNumber],
                        'title': 'EventType',
                        'name': 'EventType',
                        'render': function (data, type, row) {
                            return syntaxHighlight(JSON.stringify(row.EventType));
                        }
                    }, {
                        'targets': [++nColNumber],
                        'title': 'EndDate',
                        'name': 'EndDate',
                        'render': function (data, type, row) {
                            return syntaxHighlight(JSON.stringify(row.EndDate));
                        }
                    }, {
                        'targets': [++nColNumber],
                        'title': 'EntityFrameworkEvent',
                        'name': 'EntityFrameworkEvent',
                        'render': function (data, type, row) {
                            return syntaxHighlight(JSON.stringify(row.EntityFrameworkEvent));
                        }
                    },
                ]
            });
            console.log('finish');
            // console.log("Success", JSON.stringify(data));
        }
    });
}

function Reload() {
    dataGrid.destroy();
    loadData();
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function deleteTable() {
    var params = {
        TableName: 'Event'
    };

    dynamodb.deleteTable(params, function (err, data) {
        if (err) {
            console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
            dataGrid.destroy();
            loadData();
        }
    });

}