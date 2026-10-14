var s=LocalNativeGlobal.readRaw();
return {request:'hero-save-check-1014',units:s.level.units.map(function(u){return {sid:u.sid,typeid:u.typeid};}),heros:s.level.heros,valid:LocalNativeGlobal.validateStore(s),dumpAvailable:typeof LocalNativeGlobal.buildController.dumpLevelData};
