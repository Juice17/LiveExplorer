var LO = {
	GUI: require('nw.gui'),
	Clipboard: null,
	Data : {
		Lookup: {
			NamePath: {},
			HierarchyPosition: {},
			ObjectCode: {},
			GUID: {}
		},
		Application: {
			HierarchyPosition: 'XSAND',
			Domain: 'http://juicebox.dev.liveadmaker.com'
		},
		Content: {}
	},

	Request: require('request'),

	requestPromise: require('request-promise'),

	Node: {
		/*
			The current node that is being displayed in the address bar/selected in the hierarchy
		*/
		Active: {},

		/*
			p = {
				source: '',		// path to an object
				p.action: '',	// the action to call
				p.data: {} 		// querystring parameters
			}
		*/
		Get: function LO_Node_Get(p, callback, bindTo){
/*			var url = LO.Data.Application.Domain + '/' + p.source + '.' + p.action,
				 method = p.method || 'GET';

			$.ajax({
				'url': url,
				'data': p.data,
				'type': method,
				success: function(data){
					if(callback && typeof callback === 'function')
						callback.call(bindTo, data)
				},
				'error': LO.ErrorHandler && typeof LO.ErrorHandler === "function" ? LO.ErrorHandler : null
			})*/

/*			var path = '/' + p.source + '.' + p.action + '?' + LO.Utility.toQueryString(p.data)
				 options = {
					host: LO.Data.Application.Domain,
					port: 80,
					path: path,
					method: p.method
				 },
				 request = http.request(options, function(response){
				 	console.log(`Status: {$response.statusCode}`);
				 	console.log(`Headers: {$JSON.stringify(response.headers)}`);
				 	response.encoding('utf8');
				 	response.on('data', function(chunk){
				 		console.log(`Body: {$chunk}`)
				 	})
				 });
				 request.on('error', function(e){
				 	console.log(e);
				 });
				 request.end();
*/
			var path = LO.Data.Application.Domain + '/' + p.source + '.' + p.action + '?' + LO.Utility.toQueryString(p.data),
				 options = {
					host: LO.Data.Application.Domain,
					port: 80,
					path: path,
					method: p.method
				 },
				 ret;
			

			if(callback){

				LO.Request(path, function(error, response, body){
					if(error) 
						return LO.Node.Get_Error(error);

					if(callback && typeof callback === "function")
						callback.call(bindTo, JSON.parse(body));
				});

			} else {

				LO.requestPromise(path)
					.then(function(resp){ 
						return JSON.parse(resp) 
					})
			}

		},

		Get_Error: function LO_Node_Get_Error(error){
			console.log(error);
		},

		getUrl: function LO_Node_getUrl(p){
			return LO.Data.Application.Domain + '/' + p.source + '.' + p.action + '?' + LO.Utility.toQueryString(p.data);
		}

	},

	Window: {
		Width: window.innerWidth,

		Height: window.innerHeight,

		refreshSize: function (){
			LO.Window.Width = window.innerWidth;
			LO.Window.Height = window.innerHeight;
		},

		Focused: true,

		focus: function(e){
			LO.Window.Focused = true;
		},

		blur: function(e){
			LO.Window.Focused = false;
		},

		Debug: null
	},

	Utility: {
		Copy: function LO_Utility_Copy(node){

			// Load native UI library
			var gui = require('nw.gui');

			// We can not create a clipboard, we have to receive the system clipboard
			var clipboard = gui.Clipboard.get();

			// Read from clipboard
			// var text = clipboard.get('text');
			// console.log(text);

			// Or write something
			clipboard.set(node.id, 'text');
			LO.console.log(clipboard.get('text'))
			// And clear it!
			// clipboard.clear();
		},

		toQueryString(obj){
			var querystring = '';

			for(var key in obj){
				if(querystring.length)
					querystring += '&';
				querystring += key + '=' + escape(obj[key]);
			}

			return querystring;
		}
	},

	alert: function LO_alert(p){
		alert(p);
	},

	console: {
		log: function LO_console_log(p){
			console.log(p)
		},
		info: function LO_console_info(p){
			console.info(p)
		},
		watch: {}
	}
};
LO.Clipboard = LO.GUI.Clipboard.get();