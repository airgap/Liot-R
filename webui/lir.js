/* YupDev API v0 */

function Lir() {
	//var SERVER = "https://1.db.yup.place:4430";
	//var SESSION;
	//return self;
}

Lir.SERVER = "http://localhost:7474";//eye.lyku.org
Lir.SESSION = null;

Lir.post = (data, callback) => {
	var xml = new XMLHttpRequest();
	if(typeof callback == "function") {
		xml.addEventListener('load', ()=> {
	//alert(xml.response)
			callback(JSON.parse(xml.responseText))
		});
		xml.addEventListener('error', () => {
			callback({err: 'Unable to contact server.'})
		});
	}



	if(Lir.SESSION)data.sessionid = Lir.SESSION;

	//alert(JSON.stringify(data))
	xml.open('POST', Lir.SERVER);
	xml.setRequestHeader("Content-type", "application/json")
	xml.send(JSON.stringify(data));
	return xml;
}

Lir.addCollectors = (data, callback) => {
	data.action = "add collectors";
	return Lir.post(data, callback);
}

Lir.listCollectors = (data, callback) => {
	data.action = "list collectors";
	return Lir.post(data, callback);
}

Lir.listFilters = (data, callback) => {
	data.action = "list filters";
	return Lir.post(data, callback);
}

Lir.addFilters = (data, callback) => {
	data.action = "add filters";
	return Lir.post(data, callback);
}

Lir.addCollators = (data, callback) => {
	data.action = "add collators";
	return Lir.post(data, callback);
}

Lir.listCollators = (data, callback) => {
	data.action = "list collators";
	return Lir.post(data, callback);
}
