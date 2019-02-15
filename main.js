// File manager
var fileEncoding = [
	0x0000,0x0001,0x0002,0x0003,0x0004,0x0005,0x0006,0x0007,0x0008,0x0009,0x000A,0x000B,0x000C,0x000D,0x000E,0x000F,
	0x0010,0x0011,0x0012,0x0013,0x0014,0x0015,0x0016,0x0017,0x0018,0x0019,0x001C,0x001B,0x007F,0x001D,0x001E,0x001F,
	0x0020,0x0021,0x0022,0x0023,0x0024,0x0025,0x0026,0x0027,0x0028,0x0029,0x002A,0x002B,0x002C,0x002D,0x002E,0x002F,
	0x0030,0x0031,0x0032,0x0033,0x0034,0x0035,0x0036,0x0037,0x0038,0x0039,0x003A,0x003B,0x003C,0x003D,0x003E,0x003F,
	0x0040,0x0041,0x0042,0x0043,0x0044,0x0045,0x0046,0x0047,0x0048,0x0049,0x004A,0x004B,0x004C,0x004D,0x004E,0x004F,
	0x0050,0x0051,0x0052,0x0053,0x0054,0x0055,0x0056,0x0057,0x0058,0x0059,0x005A,0x005B,0x005C,0x005D,0x005E,0x005F,
	0x0060,0x0061,0x0062,0x0063,0x0064,0x0065,0x0066,0x0067,0x0068,0x0069,0x006A,0x006B,0x006C,0x006D,0x006E,0x006F,
	0x0070,0x0071,0x0072,0x0073,0x0074,0x0075,0x0076,0x0077,0x0078,0x0079,0x007A,0x007B,0x007C,0x007D,0x007E,0x001A,
	0x0410,0x0411,0x0412,0x0413,0x0414,0x0415,0x0416,0x0417,0x0418,0x0419,0x041A,0x041B,0x041C,0x041D,0x041E,0x041F,
	0x0420,0x0421,0x0422,0x0423,0x0424,0x0425,0x0426,0x0427,0x0428,0x0429,0x042A,0x042B,0x042C,0x042D,0x042E,0x042F,
	0x0430,0x0431,0x0432,0x0433,0x0434,0x0435,0x0436,0x0437,0x0438,0x0439,0x043A,0x043B,0x043C,0x043D,0x043E,0x043F,
	0x2591,0x2592,0x2593,0x2502,0x2524,0x2561,0x2562,0x2556,0x2555,0x2563,0x2551,0x2557,0x255D,0x255C,0x255B,0x2510,
	0x2514,0x2534,0x252C,0x251C,0x2500,0x253C,0x255E,0x255F,0x255A,0x2554,0x2569,0x2566,0x2560,0x2550,0x256C,0x2567,
	0x2568,0x2564,0x2565,0x2559,0x2558,0x2552,0x2553,0x256B,0x256A,0x2518,0x250C,0x2588,0x2584,0x258C,0x2590,0x2580,
	0x0440,0x0441,0x0442,0x0443,0x0444,0x0445,0x0446,0x0447,0x0448,0x0449,0x044A,0x044B,0x044C,0x044D,0x044E,0x044F,
	0x0401,0x0451,0x0404,0x0454,0x0407,0x0457,0x040E,0x045E,0x00B0,0x2219,0x00B7,0x221A,0x2116,0x00A4,0x25A0,0x00A0
];
for (var i=0; i<256; ++i) fileEncoding[i] = String.fromCharCode(fileEncoding[i]);
var fso = new ActiveXObject('scripting.filesystemobject');
function file(fn) {
	var adb = new ActiveXObject("ADODB.Stream");
	adb.type = 2; // adTypeText
	adb.charset = 'IBM866';
	adb.open();
	adb.loadFromFile(fn);
	var t = adb.readText(-1); // adReadAll 
	adb.close();
	if(t.slice(0,3)==fileEncoding[0xef]+fileEncoding[0xbb]+fileEncoding[0xbf]) t=t.slice(3);
	var s = t.split('\n');
	return s;
}
function createTextFile(n, cont) {
	var a = n.split('/');
	for (var i=1; i<a.length; ++i) {
		try {
			fso.CreateFolder(a.slice(0,i).join('/'));
		} catch(e) {
			// folder exists
		}
	}
	var adb = new ActiveXObject("ADODB.Stream");
	adb.type = 2; // adTypeText
	adb.charset = 'IBM866';
	adb.open();
	adb.writeText(cont);
	adb.saveToFile(n, 2); //adSaveCreateOverWrite 
	adb.close();
}

// Content proxy
fCont = file('test.txt').concat('}');
function getCont() {
	if (fCont.length)
		return fCont.shift();
	else
		throw 'EOF';
}

// Namer
function localName() {
	return 'temp' + ++localName.t;
}
localName.t = 0;
function macroName() {
	return '\u8888' + ++macroName.t;
}
macroName.t = 0;
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
	var f = createTextFile('data/' + t[1] + '/functions/' + t[2] + '.mcfunction', a.join('\n'));
	return t[0]
}

// Parser
var VALID_EXPR = /^(?:\d+(?:\.\d*)?(?:e[\+\-]?\d+)?|[+\-\*\/%\(\)\!\&\|<>\s]|<=|>=|!=|==)*$/m;
var vars = {'':'%'};
function g(args, arr) {
	var str, kstr, t, lbkp = {}, i;
	arr = arr || [];
	var ifstate = false;
	if(args) for (var i in args) lbkp[i] = vars[i], vars[i] = args[i];
	while (1) {
		// Also appear in #while
		str = /\S(?:.*\S)?/.exec(kstr=getCont())[0].replace(/%([:A-Za-z0-9_$]*)%/g,function(_,n){return vars[1+n]||''});
		if (str == '}') {
			for (var i in lbkp) vars[i] = lbkp[i];
			return arr;
		} else if (str.charAt(0) == '/') {
			arr.push(str.slice(1));
		} else if (t = /^function\s+([:a-z0-9\/\._\-]*)\s+{$/.exec(str)) {
			f(t[1]);
		} else if (t = /^;/.exec(str)) {
		} else if (t = /^call\s+([:a-z0-9\/\._\-]*)$/.exec(str)) {
			arr.push(fcaller(t[1])[0]);
		} else if (t = /^set\s+([:A-Za-z0-9_$]+)\s*=\s?(.*)$/.exec(str)) {
			vars[1+t[1]] = t[2];
		} else if (t = /^set\*\s([:A-Za-z0-9_$]+)\s*=\s*([:A-Za-z0-9_$]+)$/.exec(str)) {
			vars[1+t[1]] = vars[1+t[2]];
		} else if (t = /^set=\s([:A-Za-z0-9_$]+)\s*=(.*)$/.exec(str)) {
			try {
				if (!VALID_EXPR.test(t[2])) throw 0;
				vars[1+t[1]] = eval(t[2])+'';
			} catch(e) {
				WScript.Echo(t[2]);
				throw 'Invalid Expression';
			}
		} else if (t = /^as\s(.+)\s{$/.exec(str)) {
			arr.push('execute as '+t[1]+' run '+f());
		} else if (t = /^at\s(.+)\s{$/.exec(str)) {
			arr.push('execute at*'+t[1]+' run '+f());
		} else if (t = /^asat\s(.+)\s{$/.exec(str)) {
			arr.push('execute as '+t[1]+' at @s run '+f());
		} else if (t = /^execute\s(.+)\s{$/.exec(str)) {
			arr.push('execute '+t[1]+' run '+f());
		} else if (t = /^if\s(.+)\s{$/.exec(str)) {
			arr.push('execute if '+t[1]+' run '+f());
		} else if (t = /^unless\s(.+)\s{$/.exec(str)) {
			arr.push('execute unless '+t[1]+' run '+f());
		} else if (t = /^while\s(.+)\s{$/.exec(str)) {
			arr.push('execute if '+t[1]+' run '+f(t[0]=localName(), [], 'execute if '+t[1]+' run '+fcaller(t[0])[0]));
		} else if (t = /^until\s(.+)\s{$/.exec(str)) {
			arr.push('execute unless '+t[1]+' run '+f(t[0]=localName(), [], 'execute unless '+t[1]+' run '+fcaller(t[0])[0]));
		} else if (t = /^local\s(.+)$/.exec(str)) {
			t[0] = t[1].split(',');
			for (var i=0; i<t[0].length; ++i) {
				if (!(1+t[0][i] in lbkp)) lbkp[1+t[0][i]]=vars[1+t[0][i]];
			}
		} else if (t = /^#macro\s([:A-Za-z0-9_$]+)\s(.+)\s{$/.exec(str)) {
			macro (t[1], t[2].split(','));
		} else if (str == '#') {
		} else if (t = /^#for\s([:A-Za-z0-9_$]+)\s*=(.+)\s{$/.exec(str)) {
			var nam = macroName(), obj={};
			macro (nam, [t[1]]);
			t[2].replace(
				/(-?\d*)([\(\[])(-?\d*),(-?\d*)([\]\)])/g,
				function(r,step,tb,b,e,te){
					r=[];step=step?+step:1;b=+b;e=+e;
					for(var i=b; (i-e)*step<0; i+=step) {
						(tb=='('&&i==b) || r.push (i);
					}
					if (te==']' && e==i) r.push (i);
					return r;
				}
			).replace(/,/g,'\n').replace(/^.*$/mg,
				function(s){
					obj[1+t[1]]=s;
					fCont.unshift.apply(fCont, macro[1+nam]);
					g(obj, arr);
				}
			);
			delete macro[1+nam];
		} else if (t = /^#while\s(.*)\s{$/.exec(str)) {
			var nam = macroName();
			macro (nam, []);
			while (1) {
				str = /\S(?:.*\S)?/.exec(kstr)[0].replace(/%([:A-Za-z0-9_$]*)%/g,function(_,n){return vars[1+n]||''});
				if (!(t = /^#while\s(.*)\s{$/.exec(str))) throw '#while format broken';
				try {
					if (!VALID_EXPR.test(t[1])) throw 0;
					var r = eval(t[1]);
				} catch(e) {
					WScript.Echo(t[2]);
					throw 'Invalid Expression';
				}
				if(!r) break;
				fCont.unshift.apply(fCont, macro[1+nam]);
				g({}, arr);
			}
			delete macro[1+nam];
		} else if (t = /^#if\s(.*)\s{$/.exec(str)) {
			var nam = '\u8888:if';
			macro (nam, []);
			try {
				if (!VALID_EXPR.test(t[1])) throw 0;
				var r = eval(t[1]);
			} catch(e) {
				WScript.Echo(t[2]);
				throw 'Invalid Expression';
			}
			if (r) {
				ifstate=false;
				fCont.unshift.apply(fCont, macro[1+nam]);
				g({}, arr);
			} else ifstate=true;
		} else if (t = /^#else\sif\s(.*)\s{$/.exec(str)) {
			var nam = '\u8888:if';
			macro (nam, []);
			if(ifstate) {
				try {
					if (!VALID_EXPR.test(t[1])) throw 0;
					var r = eval(t[1]);
				} catch(e) {
					WScript.Echo(t[2]);
					throw 'Invalid Expression';
				}
				if (r) {
					ifstate=false;
					fCont.unshift.apply(fCont, macro[1+nam]);
					g({}, arr);
				} else ifstate=true;
			}
		} else if (t = /^#else\s{$/.exec(str)) {
			var nam = '\u8888:if';
			macro (nam, []);
			if(ifstate) {
				ifstate=false;
				fCont.unshift.apply(fCont, macro[1+nam]);
				g({}, arr);
			}
		} else if (t = /^#include (.*)$/.exec(str)) {
			fCont.unshift.apply(fCont, file(t[1]).concat('}'));
			g({}, arr);
		} else if ((t = /^([:A-Za-z0-9_$]+)(\s.*)?$/.exec(str)) && macro[1+t[1]]){
			fCont.unshift.apply(fCont, macro[1+t[1]]);
			var obj = {}, lst = macro[1+t[1]].args, ags = t[2].split(',');
			for (var i=0; i<lst.length; ++i) (obj[1+lst[i]] = /\S(?:.*\S)?/.exec(ags[i]||'')||[])[0];
			g(obj, arr);
		} else {
			WScript.Echo (str + '\n' + t);
			throw 'ERROR';
		}
	}
}
function macro(nam, args) {
	for (var i=0; i<args.length; ++i) args[i] = args[i] || '*';
	var m = [];
	m.args = args;
	while (1) {
		var s = getCont(), t;
		if (t=/^\s*#}\s*(.*)$/.exec(s)) {
			m.push ('}');
			fCont.unshift('#'+t[1]);
			return macro[1+nam] = m;
		}
		m.push(s.replace(/^\s*#\\/,'#'));
	}
}
defNamespace = 'foo';
f('foo:main');
