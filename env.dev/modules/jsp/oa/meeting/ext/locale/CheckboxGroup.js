Ext.override(Ext.form.CheckboxGroup,{    
    //在inputValue中找到定义的内容后，设置到items里的各个checkbox中    
    setValue : function(value){   
    	var val = value.ReminderType;
    	if(typeof(val) == 'undefined'){
    		return;
    	}
        this.items.each(function(f){
          if(val.indexOf(f.inputValue) != -1){  
                 f.setValue(true);   
             }else {   
                 f.setValue(false);   
             }      
          
        });   
    },   
    //以value1,value2的形式拼接group内的值   
    getValue : function(){   
        var re = "";   
        this.items.each(function(f){   
            if(f.getValue() == true){   
                re += f.inputValue + ",";   
            }   
        });   
        return re.substr(0,re.length - 1);   
    },   
    //在Field类中定义的getName方法不符合CheckBoxGroup中默认的定义，因此需要重写该方法使其可以被BasicForm找到   
    getName : function(){   
        return this.name;   
    }   
}); 