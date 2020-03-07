function run(){
	let xhttp = new XMLHttpRequest();
	xhttp.open("POST", "http://ehall.sustech.edu.cn/xhxsfw/sys/xsjwxx/educational/getMyScoreInfo.do", false);
	xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
	xhttp.send("json=json&pageSize=100&pageNumber=1");
	let responseText = xhttp.responseText;
	let data = JSON.parse(responseText)["datas"]["pageAction"]["rows"];
	console.log(data);
	let str = "?courseLength=" + data.length;
	let count = 0;
	for (item of data){
		str += "&twoLevelGrade" + count + "=" + (item["CJFS"] == 'A');
		str += "&courseCode" + count + "=" + item["KCBH"];
		str += "&grade" + count + "=" + item["ZCJ"];
		str += "&courseName" + count + "=" + item["KCMC"];
		str += "&department" + count + "=" + item["KKBM"];
		str += "&semester" + count + "=" + item["XQMC"];
		str += "&credits" + count + "=" + item["XF"];
		str += "&learningHours" + count + "=" + item["ZXS"];
		str += "&englishCourseName" + count + "=" + item["KCYWMC"];
		count++;
	}

	window.open('http://localhost:8000/content.html' + str, 'target', '');
}