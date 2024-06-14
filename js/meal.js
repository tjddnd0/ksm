// 급식 API 키
const APIKey = "fd28d46dcb2c4e1aa9563d4d593a748d"

// 시도교육청 코드
const AOSC = "N10"

// 표준학교 코드
const SSC = "8140472"

// 특일 API 키, URL
const Key = "dr1avprMcmI2vo2EJ0nwTXKt%2BmjgV4UGtr6gnNPmr2OGWV9BTeIXPKz5lEmaKxmQJxwt25dC47D%2FT94wqKGsXg%3D%3D"
const url = 'http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo';

var mealType = 0;
dayOfWeek = 10;
const week = new Array('일', '월', '화', '수', '목', '금', '토');

var nowmeal = 0;
var buttonclick = 0;
var count = 0;
var holidaysList = [];
var mealInfo = [];

function getHolidays() {
    const parser = new DOMParser();
    const xhr = new XMLHttpRequest();
    var holidays = [];

    var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + key;
    queryParams += '&' + encodeURIComponent('solYear') + '=' + encodeURIComponent(new Date().getFullYear());
    queryParams += '&' + encodeURIComponent('solMonth') + '=' + encodeURIComponent(new Date().getMonth());
    xhr.open('GET', url + queryParams);
    xhr.onreadystatechange = function () {
        if (this.readyState == 4) {
            xmlDoc = parser.parseFromString(this.responseText, "application/xml");
            const items = xmlDoc.getElementsByTagName("item");

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const dateName = item.getElementsByTagName("dateName")[0].textContent;
                const date = item.getElementsByTagName("locdate")[0].textContent;
                holidays.push({
                    dateName,
                    date
                });
            }
            for (const index in holidays) {
                console.log(holidays[index].date, holidays[index].dateName);
            }
            localStorage.setItem('holidaysDate', JSON.stringify(holidays));
        }
    }
    xhr.send('');
}

function checkHolidays() {
    holidaysList = JSON.parse(localStorage.getItem('holidaysDate'));
    console.log(holidaysList);
    if (holidaysList != null) {
        if (holidaysList[0].date.substring(6, 8) == new Date().getMonth()) {
            console.log("공휴일 리스트 존재 O");
        }
    } else if (holidaysList != null) {
        if (holdaysList[0].date.substring(6, 8) == fmonth.padStart(2, "0")) {
            console.log("공휴일 리스트 존재 X");
            getHolidays()
        }
    };
}

// 정규식으로 알레르기 정보 제거
function RX(item) {
    return item.replace(/\([^)]*\)/g, '');
}

// 당일 급식 정보 반환
async function todayMeal(API_URL) {
    response = await fetch(API_URL);
    result = await response.json();
    mealData = result.mealServiceDietInfo[1];

    let mealInfo = [];

    mealData['row'].forEach(i => {
        mealTime = i['MMEAL_SC_NM'];
        mealList = RX(i['DDISH_NM']);

        mealInfo.push([mealTime, mealList]);
    });
    return mealInfo;
}

async function syncMeal(API_URL, date, weekend, holiday) {
    let mealinfo = await todayMeal(API_URL);

    const hour = new Date().getHours();  // 시간
    const minutes = new Date().getMinutes();  // 분

    console.log("holiday => ",holiday);

    if (mealinfo[2] === undefined) {
        if (weekend == "금") {
            mealinfo.push(["석식", "즐거운 금요일 :)"]);
        } else if (holiday) {
            console.log(holiday);
        }
    }


    if (buttonclick != 0) {
        if (buttonclick == 1) {
            console.log(nowmeal);
            //document.getElementById("mealTime").innerHTML = mealinfo[nowmeal][0];
            document.getElementById("mealtext").innerHTML = mealinfo[nowmeal][1];
        } else if (buttonclick == 2) {
            console.log(nowmeal);
            //document.getElementById("mealTime").innerHTML = mealinfo[nowmeal][0];
            document.getElementById("mealtext").innerHTML = mealinfo[nowmeal][1];
        } else if (buttonclick == 3) {
            console.log(nowmeal);
            document.getElementById("mealtext").innerHTML = mealinfo[nowmeal][1];

            //document.getElementById("mealTime").innerHTML = mealinfo[nowmeal][0];

        }

    } else {
        if (hour < 13 && minutes <= 30) {
            //document.getElementById("mealTime").innerHTML = mealinfo[1][0];
            document.getElementById("mealtext").innerHTML = mealinfo[1][1];
            nowmeal = 1
        } else if (hour > 13 && minutes >= 0) {
            //document.getElementById("mealTime").innerHTML = mealinfo[2][0];
            document.getElementById("mealtext").innerHTML = mealinfo[2][1];
            nowmeal = 2
        }
    }

    if (mealinfo[nowmeal][0] == "조식") {
        document.getElementById('radio-1').checked = true;
    } else if (mealinfo[nowmeal][0] == "중식") {
        document.getElementById('radio-2').checked = true;
    } else if (mealinfo[nowmeal][0] == "석식") {
        document.getElementById('radio-3').checked = true;
    }
}

function syncdate() {
    today = new Date();
    year = today.getFullYear();
    month = String(today.getMonth() + 1).padStart(2, '0');
    day = String(today.getDate()).padStart(2, '0');

    date = year + '-' + month + '-' + day
    document.getElementById("inputdate").value = date;
}

function syncinputdata(n) {
    let year = n.substring(0, 4);
    let month = n.substring(4, 6);
    let day = n.substring(6, 8);

    document.getElementById("inputdate").value = `${year}-${month}-${day}`;
}

async function apply_meal(n) {
    data = document.getElementById("meal_div").style.height;
    if (data != '500px') {
        document.getElementById("meal_div").style.height = '500px';
        document.getElementById("mealtext").style.display = "block";
        document.getElementById("mealTime").style.display = "flex";
        document.getElementById("arrow").style.transform = "rotate(0deg)";
    }

    DATE = document.getElementById("inputdate").value.replace(/-/g, '');
    if (buttonclick != 0) {
        DATE = getNextDay(new Date());
        console.log('다음 날 :', DATE)
    }
    syncinputdata(DATE)

    API_URL = `https://open.neis.go.kr/hub/mealServiceDietInfo?KEY=${APIKey}&Type=json&ATPT_OFCDC_SC_CODE=${AOSC}&SD_SCHUL_CODE=${SSC}&MLSV_FROM_YMD=${DATE}&MLSV_TO_YMD=${DATE}`;

    dayOfWeek = new Date(document.getElementById("inputdate").value).getDay();

    
    try {
        exists = holidaysList.find(holiday => holiday.date === DATE) !== undefined;
    } catch (err) {
        exists = false;
    }
    if ((week[dayOfWeek] == '토') || (week[dayOfWeek] == '일')) {
        document.getElementById("mealtext").innerHTML = '주말입니다.';
    } else if (exists){
        document.getElementById("mealtext").innerHTML = '공휴일입니다.';
    } else {
        await syncMeal(API_URL, DATE, week[dayOfWeek], exists);
    }
}

// 날짜를 yyyymmdd 형식으로 변환하는 함수
function formatDate(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, "0");
    var day = date.getDate().toString().padStart(2, "0");
    return year + month + day;
}

// 다음 날을 계산하는 함수
function getNextDay(currentDate) {
    var DDate = new Date(currentDate);
    DDate.setDate(DDate.getDate() + count);
    return formatDate(DDate);
}

function optionClicked(btn, n) {
    if (n == 0) {
        buttonclick = 3;
        nowmeal = btn.value;
    } else if (n == 1) {
        buttonclick = 1;
        count -= 1;
        console.log("왼쪽 버튼 클릭 => ", count);
    } else if (n == 2) {
        buttonclick = 2;
        count += 1;
        console.log("오른쪽 버튼 클릭 => ", count);
    }

    apply_meal();
}


syncdate();
checkHolidays();
apply_meal();








// if (n == 0) {
//     buttonclick = 3;
//     nowmeal = btn.value;
// } else if (n == 1) {
//     buttonclick = 1;
//     if (nowmeal == 0) {
//         count -= 1;
//         nowmeal = 2;
//         console.log(nowmeal);
//     } else {
//         nowmeal -= 1;
//     }
// } else if (n == 2) {
//     buttonclick = 2;
//     if (nowmeal == 2) {
//         count += 1;
//         nowmeal = 0;
//         console.log(nowmeal);
//     } else {
//         nowmeal += 1;
//     }
// }


// dayOfWeek = new Date(document.getElementById("inputdate").value).getDay();
    // exists = holidaysList.find(holiday => holiday.date === DATE) !== undefined;
    // console.log(exists);
    // console.log(count);

// while(week[dayOfWeek] == "토" || week[dayOfWeek] == "일" || exists) { //true
    //     dayOfWeek = new Date(document.getElementById("inputdate").value).getDay();
    //     exists = holidaysList.find(holiday => holiday.date === DATE) !== undefined;
    //     console.log("반복");
    //     console.log(week[dayOfWeek]);
    //     console.log(exists);
    //     if (week[dayOfWeek] == '토') {
    //         count -= 1;
    //         nowmeal = 1;
    //     } else if (week[dayOfWeek] == '일') {
    //         count -= 2;
    //         nowmeal = 1;
    //     } else if (exists) {
    //         count -= 1;
    //         nowmeal = 1;
    //     }
    //     DATE = getNextDay(new Date());
    //     syncinputdata(DATE)
    // }