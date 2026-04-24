const fs = require('fs');
const data = JSON.parse(fs.readFileSync('./result.json', 'utf-8'));

function getAllTests(suites, results = []) {
    suites.forEach(suite => {
        if (suite.specs) {
            suite.specs.forEach(spec => {
              if (spec.tests) {
      
                spec.tests.forEach(test => {
                  results.push({
                    title: spec.title,
                    tags: spec.tags,
                    test: test
                  });
                });
      
              }
            });
        }
        if (suite.suites) {
            getAllTests(suite.suites, results);
        }
    });

    return results;
}

function cleanError(msg) {
    return msg.replace(/\x1B\[[0-9;]*m/g, '');
}

// function flattenSteps(steps, results = []) {  //Dipakai jika steps nested
//     steps.forEach(step => {
//         results.push(step);
//         if (step.steps) {
//             flattenSteps(step.steps, results);
//         }
//     });
//     return results;
// }

const tests = getAllTests(data.suites);

let html = `
<html>
<head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <title>Laporan Hasil Test</title>
    <style>
        body { 
            font-family: Trebuchet MS, sans-serif; 
            background: #f5f7fb;
        }

        .header {
            background: #1b54a0;
            padding: 15px 15px 10px 15px;
            border-radius: 20px;
            margin-bottom: 20px;
        }

        .header h3 {
            text-align: center;
            color: #fff;
            margin-bottom: 20px;
        }

        .dashboard {
            display: flex;
            gap: 20px;
            margin-bottom: 10px;
        }
        .card {
            flex: 1;
            display: flex;
            justify-content: space-between;
            align-item: center;
            background: white;
            padding: 15px 15px 15px 15px;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .card-content {
            display: flex;
            flex-direction: column; /* teks & angka vertikal */
        }
        
        .card h4 {
            color: #555;
            margin: 5px;
        }
        
        .card p {
            font-size: 28px;
            font-weight: bold;
            margin: 5px;
        }

        .passed-card p {
            color: green;
        }
        
        .failed-card p {
            color: red;
        }

        .flaky-card p {
            color: orange;
        }

        table { 
            border-collapse: collapse; 
            width: 100%;
            table-layout: fixed;
        }
        th, td { 
            padding: 8px;
            word-wrap: break-word;
        }
        th { 
            border-bottom: 3px solid #b0b0b0; 
        }
        td {
            font-size: 14px;
            vertical-align: top;
        }

        td.step-status {
            text-align: center;
        }

        .error {
            display: block;
            text-align: left;
            margin-top: 5px;
            color: red;
        }

        .group-even td.passed-test-result,
        .group-odd td.passed-test-result {
            background: green;
            color: white;
            vertical-align: middle;
        }
        
        .group-even td.failed-test-result,
        .group-odd td.failed-test-result {
            background: red;
            color: white;
            vertical-align: middle;
        }

        .group-even td {
            background: #dcecfc;
        }
        
        .group-odd td {
            background: #edf5fc;
        }

        .group-start td {
            border-top: 2px solid #ccc;
            padding-top: 10px;
        }

        .passed { 
            color: white; 
            background: green;
            padding: 5px;
            border-radius: 15%;
        }
        .failed { 
            color: white; 
            background: red;
            padding: 5px;
            border-radius: 15%;
        }

        .json-box {
            padding: 10px;
            border-radius: 8px;
            font-size: 12px;
        }
        
        .json-row {
            margin-bottom: 5px;
        }
        
        .json-key {
            font-weight: bold;
            color: #2f5aa8;
        }
        
        .json-value {
            color: #333;
        }

        th:nth-child(1), td:nth-child(1) {width: 5%}
        th:nth-child(2), td:nth-child(2) {width: 10%}
        th:nth-child(3), td:nth-child(3) {width: 20%}
        th:nth-child(4), td:nth-child(4) {width: 5%}
        th:nth-child(5), td:nth-child(5) {width: 5%}
        th:nth-child(6), td:nth-child(6) {width: 15%}

    </style>
</head>
<body> `

// For Summary
const total_test = tests.length;
let total_passed = 0;
let total_failed = 0;
let total_flaky = 0;
let group_index = 0;

tests.forEach(test => {
    const status = test.test.results[0]?.status;
    if (status === 'passed') {
        total_passed++;
    } else if (status === 'flaky') {
        total_flaky++;
    } else {
        total_failed++;
    }
});

html += `

<div class="header">
<h3>Summary Test Report Asmat</h3>
    <div class="dashboard">
        <div class="card">
            <div class="card-content">
                <h4>TOTAL TEST</h4>
                <p>${total_test}</p>  
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24">
                <path fill="#555" fill-rule="evenodd" d="M7.263 3.26A2.25 2.25 0 0 1 9.5 1.25h5a2.25 2.25 0 0 1 2.237 2.01c.764.016 1.423.055 1.987.159c.758.14 1.403.404 1.928.93c.602.601.86 1.36.982 2.26c.116.866.116 1.969.116 3.336v6.11c0 1.367 0 2.47-.116 3.337c-.122.9-.38 1.658-.982 2.26s-1.36.86-2.26.982c-.867.116-1.97.116-3.337.116h-6.11c-1.367 0-2.47 0-3.337-.116c-.9-.122-1.658-.38-2.26-.982s-.86-1.36-.981-2.26c-.117-.867-.117-1.97-.117-3.337v-6.11c0-1.367 0-2.47.117-3.337c.12-.9.38-1.658.981-2.26c.525-.525 1.17-.79 1.928-.929c.564-.104 1.224-.143 1.987-.159m.002 1.5c-.718.016-1.272.052-1.718.134c-.566.104-.895.272-1.138.515c-.277.277-.457.665-.556 1.4c-.101.754-.103 1.756-.103 3.191v6c0 1.435.002 2.436.103 3.192c.099.734.28 1.122.556 1.399c.277.277.665.457 1.4.556c.754.101 1.756.103 3.191.103h6c1.435 0 2.436-.002 3.192-.103c.734-.099 1.122-.28 1.399-.556c.277-.277.457-.665.556-1.4c.101-.755.103-1.756.103-3.191v-6c0-1.435-.002-2.437-.103-3.192c-.099-.734-.28-1.122-.556-1.399c-.244-.243-.572-.41-1.138-.515c-.446-.082-1-.118-1.718-.133A2.25 2.25 0 0 1 14.5 6.75h-5a2.25 2.25 0 0 1-2.235-1.99M9.5 2.75a.75.75 0 0 0-.75.75v1c0 .414.336.75.75.75h5a.75.75 0 0 0 .75-.75v-1a.75.75 0 0 0-.75-.75zM6.25 10.5A.75.75 0 0 1 7 9.75h.5a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1-.75-.75m3.5 0a.75.75 0 0 1 .75-.75H17a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75M6.25 14a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1-.75-.75m3.5 0a.75.75 0 0 1 .75-.75H17a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75m-3.5 3.5a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5H7a.75.75 0 0 1-.75-.75m3.5 0a.75.75 0 0 1 .75-.75H17a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75" clip-rule="evenodd"/>
            </svg>
        </div>
        <div class="card passed-card">
            <div class="card-content">
                <h4>PASSED TEST</h4>
                <p>${total_passed}</p>
            </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 16 16">
            <g fill="#28a745"><path d="M10.648 5.646a.5.5 0 0 1 .707.707l-4 4a.504.504 0 0 1-.708 0l-2-2a.5.5 0 1 1 .707-.707L7 9.292l3.646-3.646z"/> 
            <path fill-rule="evenodd" d="M8 1c3.86 0 7 3.14 7 7s-3.14 7-7 7s-7-3.14-7-7s3.14-7 7-7m0 1C4.691 2 2 4.691 2 8s2.691 6 6 6s6-2.691 6-6s-2.691-6-6-6" clip-rule="evenodd"/></g>
        </svg>
        </div>
        <div class="card failed-card">
            <div class="card-content">
                <h4>FAILED TEST</h4>
                <p>${total_failed}</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 56 56">
                <path fill="#dc3545" d="M28 51.906c13.055 0 23.906-10.828 23.906-23.906c0-13.055-10.875-23.906-23.93-23.906C14.899 4.094 4.095 14.945 4.095 28c0 13.078 10.828 23.906 23.906 23.906m0-3.984C16.937 47.922 8.1 39.062 8.1 28c0-11.04 8.813-19.922 19.876-19.922c11.039 0 19.921 8.883 19.945 19.922c.023 11.063-8.883 19.922-19.922 19.922m-8.016-9.984c.516 0 .985-.211 1.336-.586l6.657-6.68l6.656 6.68c.351.351.82.586 1.36.586c1.03 0 1.874-.868 1.874-1.899c0-.539-.21-.984-.562-1.336l-6.657-6.656l6.68-6.703c.375-.399.563-.797.563-1.313a1.865 1.865 0 0 0-1.875-1.875c-.493 0-.915.164-1.313.563l-6.727 6.703l-6.703-6.68c-.351-.375-.773-.539-1.289-.539c-1.054 0-1.875.797-1.875 1.852c0 .515.188.96.563 1.312l6.656 6.68l-6.656 6.68c-.375.328-.563.796-.563 1.312c0 1.031.82 1.898 1.875 1.898"/>
            </svg>
        </div>
        <div class="card flaky-card">
            <div class="card-content">
                <h4>FLAKY TEST</h4>
                <p>${total_flaky}</p>
            </div>  
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 32 32">
                <path fill="#fd7e14" d="M17.25 22a1.25 1.25 0 1 1-2.5 0a1.25 1.25 0 0 1 2.5 0M16 9a1 1 0 0 0-1 1v8a1 1 0 1 0 2 0v-8a1 1 0 0 0-1-1m-3.064-5.191c1.332-2.41 4.796-2.41 6.128 0l10.493 18.999C30.846 25.14 29.158 28 26.494 28H5.507c-2.665 0-4.352-2.86-3.064-5.192zm4.377.967a1.5 1.5 0 0 0-2.626 0L4.194 23.775A1.5 1.5 0 0 0 5.507 26h20.987a1.5 1.5 0 0 0 1.313-2.225z"/>
            </svg>
        </div>
    </div>
</div>

<table>
    <tr>
        <th>Mitra </th>
        <th>Test case </th>
        <th>Steps </th>
        <th>Steps Status </th>
        <th>Test Result </th>
        <th>Details </th>
    </tr>
`;


tests.forEach(test => {
    const mitra = test.tags[0];
    const title = test.title;
    const steps_result = test.test.results[0].steps;
    const test_result = test.test.results[0].status === 'passed' ? 'Passed' : 'Failed';
    const result_class = test.test.results[0].status === 'passed' ? 'passed-test-result' : 'failed-test-result';
    const attachments = test.test.results[0].attachments;

    let detail;

    attachments.forEach(att => {
        if (att.name === 'booking_detail' && att.path) {
            detail = JSON.parse(fs.readFileSync(att.path, 'utf-8'));
        }
    })

    let firstRow = true;
    const group_class = group_index % 2 === 0 ? 'group-even' : 'group-odd';
    group_index++;

    steps_result.forEach((step, index) => {
        
        const status = step.error ? 'Failed' : 'Passed';
        const raw_message = step.error?.message || '';
        const error_message = cleanError(raw_message);

        let detailHtml = '';
        let row_class = '';

        if (index === 0) {
            row_class = 'group-start';
        }

        if (detail) {
            Object.entries(detail).forEach(([key, value]) => {
                let value_data;
                if (value !== null & typeof value === 'object') {
                    value_data = `Harga Pergi : ${value.harga_pergi}<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Harga Pulang : ${value.harga_pulang}`;
                } else {
                    value_data = value;
                }
                detailHtml += `
                    <div class="json-row">
                        <span class="json-key">${key}</span> :
                        <span class="json-value">${value_data}</span>
                    </div>`;
            });
        }

        html += `<tr class="${row_class} ${group_class}">`

        if (firstRow) {
            html += `<td rowspan = "${steps_result.length}">${mitra}</td>`;
            html += `<td rowspan = "${steps_result.length}">${title}</td>`;
        }

        html += `
            <td>${step.title}</td>
            <td class="step-status"> 
                <span class=${status.toLocaleLowerCase()}>${status}</span>
                ${error_message ? `<br><small class="error">${error_message}</small>` : ''}
            </td>`

        if (firstRow) {
            html += `<td rowspan = "${steps_result.length}" class="${result_class}">${test_result}</td>`;
            html += `<td rowspan = "${steps_result.length}">
                        <div class="json-box">${detailHtml}</div>
                    </td>`
            firstRow = false;
        }

        html += `</tr>`

    });

});

html += `
</table>
</body>
</html>
`;

fs.writeFileSync('reports/report.html', html);