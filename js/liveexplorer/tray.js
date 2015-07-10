"use strict"

class Tray {
	constructor(settings){
		this.Tray 		= new LO.GUI.Tray({ title: 'JuiceExplorer', tooltip: 'JuiceExplorer', icon: '/images/icons/tray.png' });
		this.Tray.menu = new LO.GUI.Menu();

		this.addTrayItem({ label: 'Exit', callback: function(){
			LO.GUI.App.closeAllWindows();
		}});

		this.Tray.on('click', function(e){
			if(LO.Window.Focused) {
				window.focus();
			} else {
				window.blur();
			}
		});
	}

	addTrayItem(p){
		this.Tray.menu.append(new LO.GUI.MenuItem({ label: p.label, click: p.callback }));
	}

	getOptions(settings){
		let Defaults = { name: 'HierarchyContextMenu' };
		this.options = $.extend({}, Defaults, settings || {})
	}

}
