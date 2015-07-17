
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

	this.maxItems = 250;

// 'plugins': ['contextmenu', 'dnd', 'search', 'sort', 'state', 'types'],

	this.settings = {
		jstree: { 'core' : {
						'data' : {
							'url': this.tree_data_url.bind(this),
							'data': this.tree_data_data.bind(this),
							'success': this.tree_data_success.bind(this)
						},
						// 'check_callback': true
						'check_callback': this.tree_modify_allow.bind(this)
					},
					// 'plugins': ['search', 'sort', 'state', 'types'],
					'plugins': ['search', 'state', 'types'],
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
			// console.log(document.location.hash)
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
			.on('select_node.jstree', that.tree_select_node.bind(that))
			.on('create_node.jstree', that.tree_create_node.bind(that))
			.on('load_node.jstree', that.tree_load_node.bind(that))
			.on('open_node.jstree', that.tree_open_node.bind(that))
			.on('copy.jstree', LO.Utility.Copy.bind(that))
			.on('contextmenu.jstree', that.tree_contextmenu.bind(that))
			.on('keydown.jstree', that.tree_keydown.bind(that))
			.on('state_ready.jstree', that.tree_state_ready.bind(that))
			.on('loaded.jstree', that.tree_loaded.bind(that))
			.on('redraw.jstree', that.node_redraw.bind(that))
	},

	tree_contextmenu: function Hierarchy_tree_contextmenu(e){
		var id = $(e.target).closest('a')[0].id.replace('_anchor', '');


		this.ContextMenu.node = this.Instance.Tree.get_node(id);

		// LO.console.info({ text: "tree_contextmenu", node: this.ContextMenu.node, id: id })

		this.ContextMenu.open({ x: e.pageX, y: e.pageY })
	},

	tree_data_url: function Hierarchy_tree_data_url(node){
		return LO.Data.Application.Domain + '/.treejson';
	},

	tree_data_data: function Hierarchy_tree_data_data(node){
		var startItem = node.startItem || 1;
		startItem = ((parseInt(startItem) - 1) * parseInt(this.maxItems)) + 1;
		return node.id !== "#" ? { 'hpos': node.id, i: startItem } : null;
	},

	/*
	** Load node data into lookup tables
	*/
	tree_data_success: function Hierarchy_tree_data_success(data, x){
		// LO.console.info({ text: 'data_success', data: data})
		data.forEach(function(item){
			if(item.namepath && item.namepath.toUpperCase() === "PAGING") return;
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

	// tree_modify_allow: function Hierarchy_modify_allow(operation, node, node_parent, node_position, more){
	tree_modify_allow: function Hierarchy_modify_allow(){
		// console.log({text: 'tree_modify_allow', arguments: arguments })
		return true;
	},

	/*
	** ************ Event handlers
	*/
	tree_keydown: function Hierarchy_tree_keydown(e){
		console.log(e)
		var node = this.Instance.Tree.get_node(e.target);

		switch(e.keyCode){
			/* f2*/
			case 113:
				this.Instance.Tree.edit(e.target);
				break;
			/* N || n */
			case 78 || 110:
				if(e.ctrlKey && node)
					this.node_copy({ node: node, type: 'namepath'})
				break;
			/* H || h */
			case 72 || 104:
				if(e.ctrlKey && node)
					this.node_copy({ node: node, type: 'id'})
				break;
			/* G || g */
			case 71 || 103:
				if(e.ctrlKey && node)
					this.node_copy({ node: node, type: 'guid'})
				break;
			/* O || o */
			case 79 || 111:
				if(e.ctrlKey && node)
					this.node_copy({ node: node, type: 'objectcode'})
				break;

			/* D || d */
			case 68 || 100:
				if(e.ctrlKey && node)
					this.node_debug({ node: node })
				break;

		}
	},

	tree_loaded: function Hierarchy_tree_loaded(e, data){
		this.Instance.Tree.open_node($('li:first-child', this.Tree));
		this.Instance.Tree.select_node($('li:first-child', this.Tree));

		this.ContextMenu = new ContextMenu_Hierarchy({ Instance: this });
		this.ContextMenu.draw();
	},

	tree_create_node: function Hierarchy_create_node(e, node, parent, position, instance){
		LO.console.info({ text: 'create_node', node: node, parent: parent, position: position, instance: instance })
	},

	tree_load_node: function Hierarchy_load_node(e, node, status, instance){
		var that = this;
		// LO.console.info({ text: 'load_node', node: node, status: status, instance: instance, event: e });
/*		status.node.children.forEach(function(id){
			setTimeout(function(){ 
				that.node_bind_lazy(id); 
			}, 200)
		});*/
	},

	tree_open_node: function Hierarchy_open_node(e, node, instance){
		// LO.console.info({ text: 'open node', arguments: arguments })
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

	node_copy: function Hierarchy_node_copy(p){
    if(!p.type || !p.node || !p.node.li_attr[p.type]) return false;
    LO.Clipboard.set(p.node.li_attr[p.type], 'text');
	},

	node_debug: function Hierarchy_node_debug(p){
		if(!LO.Window.Debug)
			LO.Window.Debug = window.open('http://infrastructure.stage.liveadmaker.com/.objectinspector?aobject=' + p.node.li_attr['objectcode']);
		else
			LO.Window.Debug.location.href ='http://infrastructure.stage.liveadmaker.com/.objectinspector?aobject=' + p.node.li_attr['objectcode'];
	},

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

	},

	node_redraw: function Hierarchy_node_redraw(e, data){
		// LO.console.info({ text: 'node_redraw', this: this, e: e, data: data })
		if(!data.nodes || data.nodes.length >1)
			return false;
		var node = data.instance.get_node(data.nodes[0]),
			 kid	= node.children && node.children[0] && data.instance.get_node(node.children[0]) || null,
			 sibs = kid && kid.li_attr && kid.li_attr.siblings || 0,
			 page = kid && kid.li_attr && kid.li_attr.p || 1,
			 pages = Math.ceil(parseInt(sibs)/this.maxItems),
			 text = node.li_attr.text;

		if(pages > 1) data.instance.rename_node(node, text + ' <i><b>(' + parseInt(page) + '/' + parseInt(pages) + ')</b></i>')
		// console.info(node)
	}
};

/* 
*** TODO ***

** Context Menu

	-- Add new node
	-- Re-order node
	-- Remove node
	-- Order By
		-- Name
		-- Date
		-- Rank

** Only scrollIntoViewIfNeeded if outside of viewable area

** Hot keys to peform tasks on nodes
	-- Copy HPOS
	-- Copy NamePath
	-- Copy ObjectCode
	-- Copy GUID
	-- LiveServer Debug
		-- manage window in LO

** Tabs
	-- Show property tabs
	-- Populate Inheritance
		-----------------------------------------------------------------------------------
			http://sandboxjferrara.liveadmakerstage.com/Node:XSAND0000300001000030002E0000F.GetInheritanceTreeAsJson?fVersion=0&fLivePlatformVersion=0&aRfrshIdx=8&_nolivecache=42201.95187625
			Order by InsertOrder, Indent by recurse level

** History -- back/forward.  Possibly use Hash
-----------------------------------------------------------------------------------

** Object.observe
-----------------------------------------------------------------------------------
		http://www.html5rocks.com/en/tutorials/es7/observe/
*/


