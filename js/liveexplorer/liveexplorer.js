var LiveExplorer = function LiveExplorer(){
	this.Elements = {
		Tray: {},
		AddressBar: {},
		Hierarchy: {},
		Content: {}
	};

	this.Node = null;

	this.init();
};

LiveExplorer.prototype = {
	
	init: function LiveExplorer_init(){
		this.Node = null;

		this.Tray 			= new Tray();
		this.AddressBar 	= new AddressBar();
		this.Hierarchy 	= new Hierarchy();
		this.Display 		= new Display();

		this.bind();
	},

	bind: function LiveExplorer_bind(){
		var that = this;
	}
};

/*
	Tray
	--------------------------
	https://github.com/nwjs/nw.js/wiki/Tray

*/