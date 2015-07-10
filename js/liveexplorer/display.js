"use strict"

class Display{

	constructor(p){

		this.Container = document.getElementById('display');
		this.Element 	= document.getElementById('tab_container');
		this.Tabs 		= {
			smart: 						{ index: 0, className: smartTab, element: document.getElementById('tab_smart') },
			datatypes: 					{ index: 1, className: datatypesTab, element: document.getElementById('tab_datatypes') },
			relationships: 			{ index: 2, className: relationshipsTab, element: document.getElementById('tab_relationships') },
			reverserelationships: 	{ index: 3, className: reverserelationshipsTab, element: document.getElementById('tab_reverserelationships') },
			virtualnodes: 				{ index: 4, className: virtualnodesTab, element: document.getElementById('tab_virtualnodes') },
			inheritance: 				{ index: 5, className: inheritanceTab, element: document.getElementById('tab_inheritance') },
			items: 						{ index: 6, className: itemsTab, element: document.getElementById('tab_items') }
		};

		this.CurrentTab = "relationships"

		this.Instance = {
			Tabs: null
		};

		this.draw();
	}

	draw(){

		var that = this;

		if(this.Instance.Tabs) {
			this.Instance.Tabs.destroy();
			this.Instance.Tabs = null;
		}

		var $tabs = $(this.Element);

		$tabs.tabs({
			active: this.Tabs[this.CurrentTab].index,
			beforeActivate: function(e, ui){
				var tab = ui.newPanel.selector.replace('#tab_', '');
				that.CurrentTab = tab;
				that.Tabs[tab].Instance.get();
			}
		});

		this.Instance.Tabs = $tabs.tabs('instance');

		for(let tab in this.Tabs){
			// this.Tabs[tab].Instance = new Tab($.extend({}, { name: tab, Tabs: this.Element }, this.Tabs[tab] ));
			if(this.Tabs[tab].className && typeof this.Tabs[tab].className === 'function')
				this.Tabs[tab].Instance = new this.Tabs[tab].className($.extend({}, { name: tab, Tabs: this.Element }, this.Tabs[tab] ));
		}

	}

	set_margin(margin){
		margin = parseFloat(margin) || 0;
		this.Container.style.left = margin + "px";
	}

	show(){
		this.Tabs[this.CurrentTab].Instance.get();
		this.Container.style.display = "block";
	}

	hide(){
		this.Container.style.display = "none";
	}

}

class Tab extends Display{

	constructor(p){
		this.Element 	= p.element;
		this.Index 		= p.index;
		this.Name		= p.name;
		this.Tabs 		= p.Tabs;
		this.Content 	= document.getElementById('content_' + this.Name)
	}

	get(){
		if(!LE.Node) return false;
		LO.Node.Get({ source: LE.Node.HierarchyPosition, action: 'TreeContent', data: { aType: this.Name } }, this.populate, this);
	}

	show(){
		$(this.Tabs).tabs({ active: this.Index })
	}

	populate(data){
		LO.console.log(data)
	}
}

class smartTab extends Tab{
	constructor(p){
		super(p)
	}

}

class datatypesTab extends Tab{
	constructor(p){
		super(p)
	}
}

class relationshipsTab extends Tab{
	constructor(p){
		super(p)
	}

	populate(data){
		let content = '';
		data.forEach(function(item){
			content += `<tr>
				<td>${item.ObjectName}</td>
				<td>${item.Category}</td>
				<td>${item.CategoryTag}</td>
				<td>${item.Rank}</td>
				<td>${item.Type}</td>
				<td>${item.NamePath}</td>
				</tr>`;
		});
		this.Content.innerHTML = content;
	}
}

class reverserelationshipsTab extends relationshipsTab{
	constructor(p){
		super(p)
	}

	populate(data){
		super.populate(data)
	}

}

class inheritanceTab extends Tab{
	constructor(p){
		super(p)
	}
}

class itemsTab extends Tab{
	constructor(p){
		super(p)
	}

	populate(data){
		let content = '';
		data.forEach(function(item){
			content += `<tr>
				<td>${item.ObjectName}</td>
				<td>${item.Created}</td>
				<td>${item.Modified}</td>
				<td>${item.ObjectType}</td>
				<td>${item.NodeType}</td>
				<td>${item.NamePath}</td>
				</tr>`;
		});
		this.Content.innerHTML = content;
	}

}

class virtualnodesTab extends Tab{
	constructor(p){
		super(p)
	}
}

/*
programattically select tab
---------------------------------------------------------
	$(LE.Content.Tabs).tabs({ active: 4 })
*/
/*
	populate(data){
		super.populate(data)
	}
*/