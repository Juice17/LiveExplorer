"use strict"

class Node {

	constructor(p){
		this.Data = LO.Data.Lookup.HierarchyPosition[p.id];
		LE.Node = this;
		LE.Display
	}

	get(p, callback){
		LO.Node.Get({ source: this.Data.HierarchyPosition, action: 'TreeContent', data: { aType: p.type } }, callback);
	}

	setProperties(){

	}

	relationships(data){
		LO.console.log(data);
	}

}