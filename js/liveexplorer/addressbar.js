"use strict"

class AddressBar{

	constructor(){

		this.Element = document.getElementById('inp_address_bar');
		this.Data = {};
		this.ContextMenu = null;

		this.draw();
		this.bind();

		Object.observe(this, function(changes){
			// console.log(changes[0]);
		}, ['data']);

		console.info('AddressBar init')
	}

	bind(){
		var that = this;

		$(this.Element)
				.on('keypress', function(e){
				switch (e.which){
					case 13:
						LE.Hierarchy.node_open(this.value);
						e.preventDefault();
						break;
					default:
						return;
				}
			});

		this.Element.addEventListener('contextmenu', function(e){
			that.ContextMenu.open(e);
		});
	}

	draw(){
		this.ContextMenu = new ContextMenu_AddressBar();
		this.ContextMenu.draw();
	}

	set(node){
		var that = this;
		this.Element.value = node.li_attr.namepath;

		document.location.hash = node.id;

		document.getElementById(`${node.id}_anchor`).focus();

		Object.getNotifier(this).performChange('data', function(){
			that.Data = {
				NamePath: node.li_attr.namepath,
				HierarchyPosition: node.id,
				ObjectCode: node.li_attr.objectcode,
				GUID: node.li_attr.guid,
				PrimaryObjectTypePosition: node.li_attr.potp,
				SecondaryObjectTypePosition: node.li_attr.sotp
			};
			that.node()
			return that.Data;
		});
	}

	node(){
		// LO.Data.Lookup.HierarchyPosition[this.Data.HierarchyPosition].Node = new Node({ id: this.Data.HierarchyPosition });
		LE.Node = LO.Data.Lookup.HierarchyPosition[this.Data.HierarchyPosition]
		LE.Display.show();
		// LO.Data.Lookup.HierarchyPosition[this.Data.HierarchyPosition].Instance = LE.Node;
	}

}


/*
	Menu
	-------------------------
	https://github.com/nwjs/nw.js/wiki/Menu
*/
