function run(){
	let xhttp = new XMLHttpRequest();
	xhttp.open("POST", "http://ehall.sustech.edu.cn/xhxsfw/sys/xsjwxx/educational/getMyScoreInfo.do", false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
	xhttp.send("json=json&pageSize=100&pageNumber=1");
	let responseText = xhttp.responseText;
	let data = JSON.parse(responseText)["datas"]["pageAction"]["rows"];
	let str = "?courseLength=" + data.length;
	let count = 0;
	for (item of data){
		str += "&t" + count + "=" + item["CJFS"];//twoLevelGrade
		str += "&cc" + count + "=" + item["KCBH"];//courseCode
		str += "&g" + count + "=" + item["ZCJ"];//grade
		str += "&cn" + count + "=" + item["KCMC"];//courseName
		str += "&d" + count + "=" + item["KKBM"];//department
		str += "&s" + count + "=" + item["XQMC"];//semester
		str += "&c" + count + "=" + item["XF"];//credits
		str += "&lh" + count + "=" + item["ZXS"];//learningHours
		count++;
	}
	console.log("Processing...");
	window.open('https://chenyuheng.github.io/SUSTech-GPA-Calculator/content.html' + str, 'target', '');
}