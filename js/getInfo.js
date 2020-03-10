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
    return data;
}

function run(){
	let xhttp = new XMLHttpRequest();
	xhttp.open("POST", "http://ehall.sustech.edu.cn/xhxsfw/sys/xsjwxx/educational/getMyScoreInfo.do", false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
	xhttp.send("json=json&pageSize=100&pageNumber=1");
	let responseText = xhttp.responseText;
	let data = JSON.parse(responseText)["datas"]["pageAction"]["rows"];
	let courseData = getCourseData();
	let str = "?checked=" + "1".repeat(data.length);
	let count = 0;
	for (item of data){
		str += "&t" + count + "=" + item["CJFS"];//twoLevelGrade
		str += "&cc" + count + "=" + item["KCBH"];//courseCode
		str += "&g" + count + "=" + item["ZCJ"];//grade
		str += "&s" + count + "=" + item["XQMC"].substring(3, 4) + item["XQMC"].substring(11, 11);//semester
		str += "&c" + count + "=" + item["XF"];//credits
		str += "&lh" + count + "=" + item["ZXS"];//learningHours
		if (getName(courseData, item["KCBH"], "name") == null) {
			str += "&cn" + count + "=" + item["KCMC"];//courseName
			str += "&d" + count + "=" + item["KKBM"];//department
		}
		count++;
	}
	console.log("Processing...");
	window.open('https://chenyuheng.github.io/SUSTech-GPA-Calculator/content.html' + str, 'target', '');
	//window.open('http://localhost:8000/content.html' + str, 'target', '');
}