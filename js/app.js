var info;
var courseData;

function getPara(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return (r[2]);
    return null;
}

function getName(data, code, name) {
    for (let i = 0; i < data.length; i++) {
        if (data[i]["cid"] == code) {
            return data[i][name];
        }
    }
    return null;
}

function getCourseData() {
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://sustechflow.top/api/rate", false);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhttp.send();
    let data = JSON.parse(xhttp.responseText)["data"];
    courseData = data;
    return data;
}

function getInfo() {
    let data = getCourseData();
    let info = [];
    let checked = getPara("checked");
    if (checked == null) {
        checked = "";
    }
    for (let i = 0; i < 100; i++) {
        item = [];
        if (getPara("t" + i) == null) {
            break;
        }
        item["isTwoLevelGrade"] = getPara("t" + i) == 'A';
        item["courseCode"] = decodeURI(getPara("cc" + i));
        item["grade"] = getPara("g" + i);
        item["semesterCode"] = decodeURI(getPara("s" + i));
        item["credits"] = parseInt(getPara("c" + i));
        item["learningHours"] = getPara("lh" + i);
        item["checked"] = true;
        if (checked.length > i) {
            item["checked"] = checked.charAt(i) != '0';
        }
        if (item["semesterCode"].length == 3) {
            item["semester"] = "20" + item["semesterCode"].substring(0, 2) + 
                "-20" + (parseInt(item["semesterCode"].substring(0, 2)) + 1) +
                "-" + item["semesterCode"].substring(2, 3);
        } else {
            item["semester"] = item["semesterCode"];
        }
        item["courseName"] = getName(data, item["courseCode"], "name");
        item["department"] = getName(data, item["courseCode"], "faculty");
        if (item["courseName"] == null) {
            item["courseName"] = decodeURI(getPara("cn" + i));
            item["department"] = decodeURI(getPara("d") + i);
        }
        info.push(item);
    }
    return info;
}

function display() {
    let str = "";
    for (let i = 0; i < info.length; i++) {
        let iconName = "";
        if (info[i]["isTwoLevelGrade"]) {
            iconName = "view_agenda";
        } else if (info[i]["grade"] == "F") {
            iconName = "cancel"
        } else {
            iconName = "add_box"
        }
        let color = "";
        if (info[i]["grade"].charAt(0) == 'A') {
            color = "blue";
        } else if (info[i]["grade"].charAt(0) == 'B') {
            color = "green";
        } else if (info[i]["grade"].charAt(0) == 'C') {
            color = "yellow";
        } else if (info[i]["grade"].charAt(0) == 'D') {
            color = "orange";
        } else if (info[i]["grade"].charAt(0) == 'F') {
            color = "red";
        }
        if (info[i]["grade"].charAt(1) == '+') {
            color += " darken-2";
        } else if (info[i]["grade"].charAt(1) == "-") {
            color += " lighten-2";
        }
        let node = "\t\t\t\t\t<li class=\"collection-item avatar\">\n" +
        "\t\t\t\t\t\t<i class=\"material-icons circle " + color + "\">" + iconName + "</i>\n" +
        "\t\t\t\t\t\t<span class=\"title\">" + info[i]["courseName"] + "</span><br />\n" +
        "\t\t\t\t\t\t<label>" + info[i]["courseCode"] + " " + info[i]["department"] + "</label><br />\n" +
        "\t\t\t\t\t\t<label>学期：" + info[i]["semester"] + " 学时：" + info[i]["learningHours"]+ " 小时</label>\n" +
        "\t\t\t\t\t\t<div class=\"secondary-content\"><input type=\"checkbox\" class=\"filled-in\" id=\"course" + i + "\"  checked=\"checked\" /><label for=\"course" + i + "\">" + info[i]["credits"] + " 学分<br />" + info[i]["grade"] + "</label></div>\n" +
        "\t\t\t\t\t</li>\n";
        str += node;
    }
    document.getElementById("courseList").innerHTML = str;
    for (let i = 0; i < info.length; i++) {
        document.getElementById("course" + i).checked = info[i].checked;
    }
}

// 参考：https://sustc.wiki/GPA
function convertGrade(levelGrade) {
    if (levelGrade == "A+") {
        return 4.00;
    } else if (levelGrade == "A") {
        return 3.94;
    } else if (levelGrade == "A-") {
        return 3.85;
    } else if (levelGrade == "B+") {
        return 3.73;
    } else if (levelGrade == "B") {
        return 3.55;
    } else if (levelGrade == "B-") {
        return 3.32;
    } else if (levelGrade == "C+") {
        return 3.09;
    } else if (levelGrade == "C") {
        return 2.78;
    } else if (levelGrade == "C-") {
        return 2.42;
    } else if (levelGrade == "D+") {
        return 2.08;
    } else if (levelGrade == "D") {
        return 1.63;
    } else if (levelGrade == "D-") {
        return 1.15;
    } else if (levelGrade == "F") {
        return 0;
    }
    return null;
}

function calculateGPA() {
    let credits = 0;
    let validCredits = 0;
    let courseNum = 0;
    let gradeSum = 0;
    for (let i = 0; i < info.length; i++) {
        if (info[i].checked) {
            credits += info[i]["credits"];
            if (!info[i]["isTwoLevelGrade"]) {
                validCredits += info[i]["credits"];
                gradeSum += info[i]["credits"] * convertGrade(info[i]["grade"]);
            }
            courseNum++;
        }
    }
    let GPA = gradeSum / validCredits;
    console.log("credits: " + credits);
    console.log("num: " + courseNum);
    console.log("GPA: " + GPA);
    document.getElementById("GPA").innerText = GPA.toFixed(2);
    document.getElementById("selectedCredits").innerText = credits.toString();
    document.getElementById("courseNum").innerText = courseNum.toString();
}

function refresh() {
    let allSelected = true;
    for (let i = 0; i < info.length; i++) {
        info[i].checked = document.getElementById("course" + i).checked;
        allSelected = allSelected && info[i].checked;
    }
    if (allSelected) {
        document.getElementById("selectAll").checked = true;
        document.getElementById("selectAllText").innerText = "全不选";
    } else {
        document.getElementById("selectAll").checked = false;
        document.getElementById("selectAllText").innerText = "全选";
    }
    calculateGPA();
    refreshAddress();
}

function refreshSelectAll() {
    if (document.getElementById("selectAll").checked) {
        for (let i = 0; i < info.length; i++) {
            document.getElementById("course" + i).checked = true;
        }
    } else {
        for (let i = 0; i < info.length; i++) {
            document.getElementById("course" + i).checked = false;
        }
    }
    refresh();
}

function refreshAddress() {
    let str = "content.html?checked=";
    for (let i = 0; i < info.length; i++) {
        str += info[i].checked ? "1" : "0";
    }
    let count = 0;
    for (item of info) {
        str += "&t" + count + "=" + item["isTwoLevelGrade"];//twoLevelGrade
        str += "&cc" + count + "=" + item["courseCode"];//courseCode
        str += "&g" + count + "=" + item["grade"];//grade
        str += "&s" + count + "=" + item["semesterCode"]
        str += "&c" + count + "=" + item["credits"];//credits
        str += "&lh" + count + "=" + item["learningHours"];//learningHours
        if (getName(courseData, item["courseCode"], "name") == null) {
            str += "&cn" + count + "=" + item["name"];//courseName
            str += "&d" + count + "=" + item["department"];//department
        }
        count++;
    }
    window.history.pushState(null, null, str);
}

function addEventListeners() {
    for (let i = 0; i < info.length; i++) {
        document.getElementById("course" + i).addEventListener("click", refresh);
    }
    document.getElementById("selectAll").addEventListener("click", refreshSelectAll);
}

function initiate() {
    info = getInfo();
    display();
    addEventListeners();
    refresh();
}