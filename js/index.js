function load() {
    syncdate();
    apply_meal(0);
    var dataToSend = {
        message: "Hello from JavaScript",
        additionalData: "Some additional data"
    };
    window.parent.postMessage(dataToSend, "*"); // "*"은 모든 origin에서 허용
}

function changearrow() {
    data = document.querySelector(".meal_div").style.height;
    mealdiv = document.querySelector(".meal_div");
    mealtext = document.querySelector(".mealtext");
    mealtime = document.querySelector(".mealTime");
    arrow = document.querySelector(".arrow");

    if (data != "500px") {
        mealdiv.style.height = "500px";
        mealtext.style.display = "block";
        mealtime.style.display = "flex";
        arrow.style.transform = "rotate(0deg)";
    } else if (data == "500px") {
        mealdiv.style.height = '30px';
        mealtext.style.display = "none";
        mealtime.style.display = "none";
        arrow.style.transform = "rotate(180deg)";
    }
}

function reload() {
    window.location.reload(true);
}

// clockstart = setInterval(function () {
//     clock();
// }, 1000);

// function clock() {
//     var time = new Date();
//     var hours = time.getHours();
//     var minutes = time.getMinutes();
//     var AmPm = "AM";
//     if (hours > 12) {
//         var AmPm = "PM";
//         hours %= 12;
//     }

//     document.getElementById("clock").innerText =
//         `${hours < 10 ? `${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;

//     document.getElementById("apm").innerText = `${AmPm}`;
// }
