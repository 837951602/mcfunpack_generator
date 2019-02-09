fso = new ActiveXObject('scripting.filesystemobject');
function file(fn) {
	var f = fso.OpenTextFile(fn);
	var s = f.ReadAll().split('\n');
	f.Close();
	return s;
}
function createTextFile(n) {
	var a = n.split('/');
	for (var i=1; i<a.length; ++i) {
		try {
			fso.CreateFolder(a.slice(0,i).join('/'));
		} catch(e) {
			// folder exists
		}
	}
	return fso.CreateTextFile(n);
}
function localName() {
	return 'temp' + ++localName.t;
}
localName.t = 0;
fCont = file('test.txt').concat('}');
function getCont() {
	if (fCont.length)
		return fCont.shift();
	else
		throw 'EOF';
}
function g() {
	var str, arr=[], t;
	while (1) {
		str = /\S(?:.*\S)?/.exec(getCont())[0];
		if (str == '}') {
			return arr;
		} else if (str.charAt(0) == '/') {
			arr.push(str.slice(1));
		} else if (t = /^function (.*) {$/.exec(str)) {
			f(t[1]);
		} else if (t = /^call (.*)$/.exec(str)) {
			arr.push(fcaller(t[1]));
		} else if (t = /^as (.*) {$/.exec(str)) {
			arr.push('execute as '+t[1]+' run '+f());
		} else if (t = /^at (.*) {$/.exec(str)) {
			arr.push('execute at '+t[1]+' run '+f());
		} else if (t = /^asat (.*) {$/.exec(str)) {
			arr.push('execute as '+t[1]+' at @s run '+f());
		} else if (t = /^if (.*) {$/.exec(str)) {
			arr.push('execute if '+t[1]+' run '+f());
		} else if (t = /^unless (.*) {$/.exec(str)) {
			arr.push('execute unless '+t[1]+' run '+f());
		} else if (t = /^while (.*) {$/.exec(str)) {
			arr.push('execute if '+t[1]+' run '+f(t[0]=localName(), [], 'execute if '+t[1]+' run '+fcaller(t[0])[0]));
		} else if (t = /^until (.*) {$/.exec(str)) {
			arr.push('execute unless '+t[1]+' run '+f(t[0]=localName(), [], 'execute unless '+t[1]+' run '+fcaller(t[0])[0]));
		} else {
			WScript.Echo (str);
			throw 'ERROR';
		}
	}
}
function fcaller(n) {
	var t = n.match(/^(.*?):(.*)$/) || [0,defNamespace,n];
	t[0] = 'function '+(t[1]==='minecraft'?'':t[1]+':')+t[2];
	return t;
}
function f(n, i0, i1) {
	var a = [].concat(i0||[], g(), i1||[]), t;
	if (!n && a.length<2)
		return a[0];
	if (!n || n === true)
		n = localName();
	t = fcaller(n);
	var f = createTextFile('data/' + t[1] + '/functions/' + t[2] + '.mcfunction');
	f.Write (a.join('\n'));
	f.Close();
	return t[0]
}
defNamespace = 'foo';
f('foo:main');
