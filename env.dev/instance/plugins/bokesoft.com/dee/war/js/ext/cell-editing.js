Ext.define("Ext.ux.comboboxtree", {
	extend : "Ext.form.field.Picker",
	alias : [ 'widget.comboboxtree' ],
	requires : [ "Ext.tree.Panel" ],
	initComponent : function() {
		var self = this;
		Ext.applyIf(self, {});
		self.on( {
			focus : function(me) {
				/* this will do before alignPicker */
				console.log(me.value);
				var me_tree_data = me.getPicker().getView().getStore().data;
				me.checkTree();
			}
		});
		self.callParent();
	},
	createPicker : function() {
		function createPicker1() {
			return new Ext.tree.Panel( {
				height : 300,
				autoScroll : true,
				floating : true,
				focusOnToFront : false,
				shadow : true,
				ownerCt : this.ownerCt,
				useArrows : true,
				store : store,
				rootVisible : false,
				listeners : {
					checkchange : function(node, checked) {
						clearTreeNodeChecked(this.getStore().getRootNode());
						doTreeCheckChangeForCombox(node, checked);
						checkchange();
					}
				}
			});
		}

		function checkchange() {
			var records = self.picker.getView().getChecked();
			var names = [], values = [];
			Ext.Array.each(records, function(rec) {
				names.push(rec.get('text'));
				values.push(rec.get('id'));
			})
			self.setRawValue(values.join('/'));/* 隐藏值*/
			self.setValue(names.join('/'));/* 显示值*/
		}
		var self = this;
		var store = Ext.create('Ext.data.TreeStore', {
			root : {
				//expanded: true,
				children :Ext.JSON.decode(this.Comstore)
			},
			autoLoad:true
		});
		self.picker = createPicker1();
		return self.picker;
	},
	checkTree : function() {
		var me = this;
		var me_tree = me.getPicker().getView().getStore().node;
		var temp = me_tree.childNodes
		clearTreeNodeChecked(me_tree);
		collapseTreeNodeChecked(temp[0]);
		var value = me.value;
		var array = value.split('/');
		for (var i in array) {
			var key = array[i];
			var isFind = false;
			var me_tree_node = temp;
			for ( var j in me_tree_node) {
				if (me_tree_node[j].data.text == key) {
					me_tree_node[j].set('checked', true);
					me_tree_node[j].expand();
					isFind = true;
					temp = me_tree_node[j].childNodes;
				} else {
					me_tree_node[j].collapse();
				}
			}
			if (!isFind) {
				if (i < array.length - 1) {
					clearTreeNodeChecked(me_tree);
				}
				break;
			}
		}
	},
	alignPicker : function() {
		var me = this, picker, isAbove, aboveSfx = '-above';
		if (me.isExpanded) {
			picker = me.getPicker();
			if (me.matchFieldWidth) {
				picker.setWidth(me.bodyEl.getWidth());
			}
			if (picker.isFloating()) {
				picker.alignTo(me.inputEl, "", me.pickerOffset);/* ""->tl */
				isAbove = picker.el.getY() < me.inputEl.getY();
				me.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls
						+ aboveSfx);
				picker.el[isAbove ? 'addCls' : 'removeCls'](picker.baseCls
						+ aboveSfx);
			}
		}
	}
});