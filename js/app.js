var info;

function getPara(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return (r[2]);
    return null;
}

function getInfo() {
    let courseLength = getPara("courseLength");
    console.log(courseLength);
    let info = [];
    for (let i = 0; i < courseLength; i++) {
        item = [];
        item["isTwoLevelGrade"] = getPara("twoLevelGrade" + i);
        item["courseCode"] = decodeURI(getPara("courseCode" + i));
        item["grade"] = getPara("grade" + i);
        item["courseName"] = decodeURI(getPara("courseName" + i));
        item["department"] = decodeURI(getPara("department" + i));
        item["semester"] = decodeURI(getPara("semester" + i));
        item["credits"] = parseInt(getPara("credits" + i));
        item["learningHours"] = getPara("learningHours" + i);
        item["englishCourseName"] = decodeURI(getPara("englishCourseName" + i));
        info.push(item);
    }
    return info;
}

function display() {
    let str = "";
    for (let i = 0; i < info.length; i++) {
        let iconName = "";
        if (info[i]["isTwoLevelGrade"] == "true") {
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

function calculateGPA(checked) {
    let credits = 0;
    let validCredits = 0;
    let courseNum = 0;
    let gradeSum = 0;
    for (let i = 0; i < info.length; i++) {
        if (checked[i]) {
            credits += info[i]["credits"];
            if (info[i]["isTwoLevelGrade"] == "false") {
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
    let checked = new Array();
    let allSelected = true;
    for (let i = 0; i < info.length; i++) {
        checked[i] = document.getElementById("course" + i).checked;
        allSelected = allSelected && checked[i];
    }
    if (allSelected) {
        document.getElementById("selectAll").checked = true;
        document.getElementById("selectAllText").innerText = "全不选";
    } else {
        document.getElementById("selectAll").checked = false;
        document.getElementById("selectAllText").innerText = "全选";
    }
    calculateGPA(checked);
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