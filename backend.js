document.addEventListener('DOMContentLoaded', function() {
    const urlsTextarea = document.getElementById('urls');
    const scanBtn = document.getElementById('scan-btn');
    const stopBtn = document.getElementById('stop-btn');
    const exportBtn = document.getElementById('export-btn');
    const statusIcon = document.querySelector('#status i');
    const statusTextSpan = document.getElementById('status');
    const resultsContainer = document.getElementById('results-container');
    const resultsTable = document.getElementById('results-table');
    const resultsJson = document.getElementById('results-json');
    const resultsBody = document.getElementById('results-body');
    const statTotal = document.getElementById('stat-total');
    const statCritical = document.getElementById('stat-critical');
    const statWarnings = document.getElementById('stat-warnings');
    const statSecure = document.getElementById('stat-secure');

    let scanActive = false;
    let scanResults = [];

    function showStatusMessage(message, isSpinning = true) {
        statusTextSpan.textContent = message;
        statusIcon.style.display = isSpinning ? 'inline-block' : 'none';
        statusTextSpan.classList.remove('hidden');
    }
    function hideStatusMessage() {
        statusTextSpan.classList.add('hidden');
        statusTextSpan.textContent = '';
    }
    function updateStats() {
        const total = scanResults.length;
        const critical = scanResults.filter(r => r.status === 'critical').length;
        const warnings = scanResults.filter(r => r.status === 'warning').length;
        const secure = scanResults.filter(r => r.status === 'safe').length;
        statTotal.textContent = total;
        statCritical.textContent = critical;
        statWarnings.textContent = warnings;
        statSecure.textContent = secure;
    }
    function addResultToTable(result) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="px-6 py-4">${result.url}</td>
            <td class="px-6 py-4">${result.provider}</td>
            <td class="px-6 py-4">${result.status}</td>
            <td class="px-6 py-4">${result.findings.map(f => `[${f.severity}] ${f.message}`).join('<br>')}</td>
            <td class="px-6 py-4 text-right">
                <button class="text-indigo-600 view-details" data-url="${result.url}">Details</button>
                <button class="text-red-600 delete-result" data-url="${result.url}">Delete</button>
            </td>
        `;
        resultsBody.appendChild(row);
        updateStats();
    }

    async function runBackendScan(urls) {
        const options = {
            check_read: document.getElementById('check-read').checked,
            check_write: document.getElementById('check-write').checked,
            check_list: document.getElementById('check-list').checked,
            allow_write_test: document.getElementById('check-deep').checked
        };
        const res = await fetch('/scan', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ urls, options })
        });
        if (!res.ok) throw new Error("Scan failed");
        return res.json();
    }

    async function startScan() {
        const urlsText = urlsTextarea.value.trim();
        if (!urlsText) {
            alert('Please enter at least one URL.');
            return;
        }
        const urls = urlsText.split('\n').map(u => u.trim()).filter(Boolean);
        scanBtn.disabled = true;
        stopBtn.classList.remove('hidden');
        scanActive = true;
        resultsBody.innerHTML = '';
        scanResults = [];
        updateStats();
        resultsContainer.classList.remove('hidden');
        resultsTable.classList.remove('hidden');
        resultsJson.classList.add('hidden');
        try {
            showStatusMessage('Scanning...');
            const results = await runBackendScan(urls);
            if (!scanActive) return;
            results.forEach(r => {
                scanResults.push(r);
                addResultToTable(r);
            });
            showStatusMessage('Scan complete', false);
        } catch (err) {
            alert(err.message);
        } finally {
            stopScan();
        }
    }

    function stopScan() {
        scanActive = false;
        scanBtn.disabled = false;
        stopBtn.classList.add('hidden');
        hideStatusMessage();
    }

    function exportResults() {
        const format = document.querySelector('input[name="output-format"]:checked').value;
        if (format === 'json') {
            resultsTable.classList.add('hidden');
            resultsJson.classList.remove('hidden');
            document.querySelector('#results-json pre').textContent = JSON.stringify(scanResults, null, 2);
        } else if (format === 'csv') {
            let csv = 'URL,Provider,Status,Findings\\n';
            scanResults.forEach(r => {
                const findings = (r.findings||[]).map(f => `[${f.severity}] ${f.message}`).join('; ');
                csv += `"${r.url}","${r.provider}","${r.status}","${findings}"\\n`;
            });
            const blob = new Blob([csv], { type: 'text/csv' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'results.csv';
            a.click();
        }
    }

    scanBtn.addEventListener('click', startScan);
    stopBtn.addEventListener('click', stopScan);
    exportBtn.addEventListener('click', exportResults);
    resultsBody.addEventListener('click', e => {
        if (e.target.classList.contains('view-details')) {
            const url = e.target.dataset.url;
            const r = scanResults.find(x => x.url === url);
            alert(JSON.stringify(r, null, 2));
        }
        if (e.target.classList.contains('delete-result')) {
            const url = e.target.dataset.url;
            scanResults = scanResults.filter(x => x.url !== url);
            e.target.closest('tr').remove();
            updateStats();
        }
    });
});

