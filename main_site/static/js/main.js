document.addEventListener("DOMContentLoaded", function() {
    initParser();
})

function initParser() {
    const parserButton = document.getElementById("startParsing")
    const resultContainer = document.getElementById("resultContainer")

    parserButton.addEventListener('click', function() {
        resultContainer.innerHTML = '<div class="flex justify-center items-center p-8"><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>'
        resultContainer.classList.remove('hidden')
        
        fetch('/parser/start', {}).then(response => {
            if (response.ok) {
                return response.json()
            }
        }).then(data => {
            if (data && data.result) {
                displayResults(data.result, resultContainer)
            }
        }).catch(error => {
            console.error('Error:', error)
            resultContainer.textContent = 'Произошла ошибка при получении данных'
            resultContainer.classList.remove('hidden')
        })
    })
}

const TABLE_HEADERS = [
    'Способ закупки',
    'Объект закупки',
    'Заказчик / Организация',
    'Начальная цена (руб.)',
    'Дедлайн подачи заявок',
    'Регион',
    'Обеспечение заявки',
    'Этап закупки'
]

const COLUMN_MAPPING = {
    'Способ закупки': 'Способ определения поставщика (подрядчика, исполнителя)',
    'Объект закупки': 'Наименование объекта закупки',
    'Заказчик / Организация': 'Организация, осуществляющая размещение',
    'Начальная цена (руб.)': 'Начальная (максимальная) цена контракта',
    'Дедлайн подачи заявок': 'Дата и время окончания срока подачи заявок',
    'Регион': 'Регион',
    'Обеспечение заявки': 'Размер обеспечения заявки',
    'Этап закупки': 'Этап закупки'
};

function displayResults(data, container) {
    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p>Нет данных для отображения</p>'
        container.classList.remove('hidden')
        return
    }

    let tableHTML = '<table class="w-full border-collapse border text-sm">'
    
    tableHTML += '<thead><tr class="bg-gray-100">'
    TABLE_HEADERS.forEach(header => {
        tableHTML += `<th class="border p-1 text-center">${header}</th>`
    })
    tableHTML += '</tr></thead>'
    
    tableHTML += '<tbody>'
    data.forEach(row => {
        tableHTML += '<tr>'
        TABLE_HEADERS.forEach(header => {
            const key = COLUMN_MAPPING[header] || header;
            const value = row[key] !== undefined ? row[key] : ''
            tableHTML += `<td class="border p-1 text-center">${value}</td>`
        })
        tableHTML += '</tr>'
    })
    tableHTML += '</tbody></table>'

    container.innerHTML = tableHTML
    container.classList.remove('hidden')
}