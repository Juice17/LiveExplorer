
var Hierarchy = function Hierarchy(){

	this.Element 	= document.getElementById('hierarchy');
	this.Tree 		= document.getElementById('hierarchy_tree');
	this.Display	= document.getElementById('display')

	this.ContextMenu = null;

	this.Instance 	= {
		Tree: {},
		Slider: {}
	};

	this.data = {
		nodes: []
	};
// 'plugins': ['contextmenu', 'dnd', 'search', 'sort', 'state', 'types'],

	this.settings = {
		jstree: { 'core' : {
						'data' : {
							'url': this.tree_data_url,
							'data': this.tree_data_data,
							'success': this.tree_data_success
						},
						'check_callback': true
					},
					'plugins': ['search', 'sort', 'state', 'types'],
					'expand_selected_onload': true,
					'progressive_render': true 
				}
	};

	this.init();
};

Hierarchy.prototype = {

	init: function Hierarchy_init(){
		var that = this;

		$(this.Element).resizable({
			handles: 'e',
			helper: 'ui-resizable-helper',
			maxWidth: 400,
			minWidth: 100,
			stop: function(e, ui){
				LE.Display.set_margin(ui.size.width);
				// prevent the resize from adding height
				that.Element.style.height = '';
			}
		});

		this.tree_create();

		this.Instance.Tree = $(this.Tree).jstree(true);

		$(window).on('hashchange', function(e){
			console.log(document.location.hash)
		})

		LO.console.info('Hierarchy loaded');
	},

	/*
	** ************ Tree definitions
	*/
	tree_create: function Hierarchy_tree_create(){
		var that = this;

		$(this.Tree)
			.toggleClass('open', 500)		
			.jstree(this.settings.jstree)
			.on('select_node.jstree', function(e, data){
				that.tree_select_node(e, data);
			})
			.on('create_node.jstree', function(node, parent, position){
				that.tree_create_node(node, parent, position);
			})
			.on('load_node.jstree', function(node, status){
				that.tree_load_node(node, status)
			})
			.on('open_node.jstree', function(node){
				that.tree_open_node(node)
			})
			.on('copy.jstree', function(node){
				LO.Utility.Copy(node);
			})
			.on('contextmenu.jstree', function(e){
				console.info(e);
				that.ContextMenu.open({ x: e.pageX, y: e.pageY });
			})
			.on('keydown.jstree', function(e){
				that.tree_keydown(e);
			})
			.on('state_ready.jstree', function(){
				that.tree_state_ready();
			})
			.on('loaded.jstree', function(e, data){
				that.tree_loaded(e, data);
			})
	},

	tree_data_url: function Hierarchy_tree_data_url(node){
		return LO.Data.Application.Domain + '/.treejson';
	},

	tree_data_data: function Hierarchy_tree_data_data(node){
		return node.id !== "#" ? { 'hpos': node.id } : null;
	},

	/*
	** Load node data into lookup tables
	*/
	tree_data_success: function Hierarchy_tree_data_success(data){
		data.forEach(function(item){
			var obj = {
				HierarchyPosition: item.id.toUpperCase(),
				NamePath: item.li_attr.namepath.toUpperCase(),
				ObjectCode: item.li_attr.objectcode.toUpperCase(),
				GUID: item.li_attr.guid.toUpperCase(),
				PrimaryObjectTypePosition: item.li_attr.potp.toUpperCase(),
				SecondaryObjectTypePosition: item.li_attr.sotp.toUpperCase(),
				Node: {}
			};
			LO.Data.Lookup.HierarchyPosition[obj.HierarchyPosition] = obj;
			LO.Data.Lookup.NamePath[obj.NamePath] = obj;
			LO.Data.Lookup.ObjectCode[obj.ObjectCode] = obj;
			LO.Data.Lookup.GUID[obj.GUID] = obj;
		});
	},

	/*
	** ************ Event handlers
	*/
	tree_keydown: function Hierarchy_tree_keydown(e){
		console.log(e)
		switch(e.keyCode){
			case 113:
				this.Instance.Tree.edit(e.target);
				break;
		}
	},

	tree_loaded: function Hierarchy_tree_loaded(e, data){
		this.Instance.Tree.open_node($('li:first-child', this.Tree));
		this.Instance.Tree.select_node($('li:first-child', this.Tree));

		this.ContextMenu = new ContextMenu_Hierarchy();
		this.ContextMenu.draw();
	},

	tree_create_node: function Hierarchy_create_node(node, parent, position){
		LO.console.info({ text: 'create_node', node: node })
	},

	tree_load_node: function Hierarchy_load_node(node, status){
		var that = this;
		LO.console.info({ text: 'load_node', node: node });
/*		status.node.children.forEach(function(id){
			setTimeout(function(){ 
				that.node_bind_lazy(id); 
			}, 200)
		});*/
	},

	tree_open_node: function Hierarchy_open_node(node){
		LO.console.info('open node')
	},

	tree_select_node: function Hierarchy_tree_select_node(e, data){
		var node = data.node;
		LE.AddressBar.set(data.node);

		document.getElementById(data.node.id).scrollIntoViewIfNeeded(true);
	},

	// runs when the state plugin has finished loading the saved state
	tree_state_ready: function Hierarchy_tree_state_ready(){
		LE.Display.set_margin(this.Element.offsetWidth);
		LE.Display.show();
	},

	/*
	** *************** Node actions
	*/
	node_lookup: function Hierarchy_node_lookup(input, callback){
		var node = null;

		if(!input || typeof input !== 'string') return node;
		
		input = input.toUpperCase();

		if(input.indexOf('\\\\') > 0 || input.indexOf('[') > 0){
			// NamePath
			node = LO.Data.Lookup.NamePath[input] && LO.Data.Lookup.NamePath[input].HierarchyPosition || null;
		} else if(input.indexOf(LO.Data.Application.HierarchyPosition) === 0){
			// HierarchyPosition
			node = LO.Data.Lookup.HierarchyPosition[input] && LO.Data.Lookup.HierarchyPosition[input].HierarchyPosition || null;
		} else if(input.indexOf('-') > 0){
			// GUID
			node = LO.Data.Lookup.GUID[input] && LO.Data.Lookup.GUID[input].HierarchyPosition || null;
		} else {
			// ObjectCode
			node = LO.Data.Lookup.ObjectCode[input] && LO.Data.Lookup.ObjectCode[input].HierarchyPosition || null;
		}

		var that = this;

		if(node && typeof node === "string") 
			return callback && typeof callback === "function" ? callback.call(that, node) : node;

		LO.Node.Get({ source: '', action: 'TreeObject', data: { id: input } }, function(response){
			if(callback && typeof callback === "function") 
				return callback.call(that, response.HierarchyPosition || null);
			return response.HierarchyPosition || null;
		}, that);

	},

	node_open: function Hierarchy_node_open(id){
		var node = this.node_lookup(id, this.node_open_complete);
	},

	node_open_complete: function Hierarchy_node_open_complete(node){
		if(!node) return LO.alert('\'' + node + '\' does not exist!')

		this.Instance.Tree.deselect_all();
		this.node_open_recurse(node);
	},

	node_open_recurse: function Hierarchy_node_open_recurse(node){
		var that = this;

		/* supplied node is found*/
		if(this.Instance.Tree.get_node(node)) {

			/* open the node*/
			this.Instance.Tree.open_node(node, function(node){

				/* check to see if this is the bottom most node */
				if(that.data.nodes && that.data.nodes.length > 0) {
					/* not bottom most, open next level down*/
					var n = that.data.nodes[0];
					that.data.nodes.shift();

					that.node_open_recurse(n);
				} else {
					/* bottom most, select node */
					that.Instance.Tree.select_node(node)
				}

			});

		} else {

			if(!that.data.nodes) that.data.nodes = [];

			that.data.nodes.unshift(node)
			this.node_open_recurse(node.substr(0, node.length-5))

		}

	}
};

/* 
*** TODO ***
** Add paging for subnodes 
-----------------------------------------------------------------------------------
		var node = $(LE.Hierarchy.Tree).jstree().get_node('XSAND0000300001');
		$(LE.Hierarchy.Tree).jstree().refresh_node(node)


** Add custom context menu options 
-----------------------------------------------------------------------------------
		http://stackoverflow.com/questions/6727387/jstree-contextmenu-create-file-folder-function

** Add copy/paste logic
-----------------------------------------------------------------------------------

** History -- back/forward.  Possibly use Hash
-----------------------------------------------------------------------------------

** Object.observe
-----------------------------------------------------------------------------------
		http://www.html5rocks.com/en/tutorials/es7/observe/
*/


