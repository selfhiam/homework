let dataItems = [
    '개인위치정보 침해',
    '기타 불법 콘텐츠',
    '기타 정보통신망 이용형 범죄',
    '사이버 도박',
    '사이버 명예훼손 및 모욕',
    '사이버 성폭력',
    '사이버금융범죄',
    '사이버저작권침해',
    '서비스거부공격',
    '악성프로그램',
    '인터넷사기',
    '해킹'
]

function fetchData() {
    const API_URL = 'http://api.odcloud.kr/api/15085999/v1/uddi:2fc6e9d4-2f49-46ef-b0f1-9ae138a803ad?page=1&perPage=10'
    const API_KEY = 'Infuser Z1u+2AjoHqXkSMSoWAexkkjRMKhswjj2EK7ZRyTVzmyQz2JF/8f+HAc5kb3JRwcSFYwboY/c24XRJt+8STqyOA=='
    fetch(API_URL, {
    headers: {
        'Authorization': API_KEY
    }
})
.then((res) => {
    if (!res.ok) {
        throw new Error('API 호출 실패');
    }
    return res.json();
})

.then((datas) => {
    const data = datas.data;

    const dataByYear = data.reduce((acc, datalist) => {
        (acc[datalist['연도']] = acc[datalist['연도']] || []).push(datalist);
        return acc;
    }, {});

    Object.keys(dataByYear).sort().reverse().forEach((year) => {
        const yearDiv = document.querySelector(`#container${year}`);
        if (!yearDiv) return;

        let count = 0;
        dataByYear[year].forEach(record => {
            if (record['구분'] === '발생건수'){
                dataItems.forEach(item => {
                    count += parseInt(record[item], 10) || 0;
                })
            }
        })
    
    
        const yearTitle = document.createElement('h3');
        yearTitle.textContent = `${year}년 데이터`;
        yearDiv.appendChild(yearTitle);

        const totalLabel = document.createElement('span');
        totalLabel.textContent = ` 발생건수 총합: ${count}건`;
        yearDiv.appendChild(totalLabel);

        const dataTable = document.createElement('table');
        dataTable.style.display = 'none';
        yearDiv.appendChild(dataTable);

        const tableHead = document.createElement('thead');
        dataTable.appendChild(tableHead);

        const headRow = document.createElement('tr');
        tableHead.appendChild(headRow);

        ['구분', '발생건수', '검거건수', '검거인원'].forEach(header => {
            const headerCell = document.createElement('th');
            headerCell.textContent = header;
            headRow.appendChild(headerCell);
        });

        const tableBody = document.createElement('tbody');
        dataTable.appendChild(tableBody);

        dataItems.forEach(item => {
            const row = document.createElement('tr');
            tableBody.appendChild(row);
        
            const categoryCell = document.createElement('td');
            categoryCell.textContent = item;
            row.appendChild(categoryCell);
        
            ['발생건수', '검거건수', '검거인원'].forEach(key => {
                const cell = document.createElement('td');
                
                const foundData = dataByYear[year].find(d => d['구분'] === key && d.hasOwnProperty(item));

                cell.textContent = foundData ? foundData[item] : '데이터 없음';
                row.appendChild(cell);
            });
        });

        const yearTitle2 = yearDiv.querySelector('h3');
        yearTitle2.addEventListener('click', function() {
            dataTable.style.display = dataTable.style.display === 'none' ? '' : 'none';
        });

        yearDiv.appendChild(dataTable);
    });
})

.catch((e) => {
    console.error('데이터 가져오기 실패:', e);
});
}

window.onload = function() {
    fetchData(); 
};