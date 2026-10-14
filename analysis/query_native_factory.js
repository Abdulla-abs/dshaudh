var f=G_UnitManager.getFactory();var out={request:'factory-contract-20261013',keys:Object.keys(f),functions:{},globals:{}};
['initUnit','solveComponent','CheckAndCreateComponent','CreateComponent'].forEach(function(n){out.functions[n]=f[n]&&f[n].length;});
['ExistingComponentMap','NewBuildingComponentMap','ConvertComp','ComponentMap','UnitCompMap'].forEach(function(n){try{var x=eval(n);out.globals[n]=x;}catch(e){}});
out.unitConfig=data.unit_main[20101];
return out;
