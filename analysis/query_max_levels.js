var prefixes=['201','202','203','204','205','206','207','212'];
var chains={};
var configs=[];
for(var pi=0;pi<prefixes.length;pi++){
    var prefix=prefixes[pi], ids=[];
    for(var n=1;n<=20;n++){
        var id=String(Number(prefix)*100+n);
        var cfg=data.unit_main[id];
        if(!cfg)continue;
        ids.push(id);
        var row={
            id:id,
            exists:true,
            typeid:cfg.typeid,
            lv:cfg.lv,
            lv_up_able:cfg.lv_up_able,
            lv_up_cost:cfg.lv_up_cost,
            lv_up_cost_type:cfg.lv_up_cost_type,
            lv_up_time:cfg.lv_up_time,
            rely_base_lv:cfg.rely_base_lv,
            need_worker:cfg.need_worker,
            wood_produce:cfg.wood_produce,
            gold_produce:cfg.gold_produce,
            temp_storage:cfg.temp_storage,
            wood_storage:cfg.wood_storage,
            gold_storage:cfg.gold_storage,
            home_res:cfg.home_res,
            origin_typeid:cfg.origin_typeid,
            name:cfg.name
        };
        try{
            var master={params:{},stage:GS_STAGE_BUILD,config:cfg,level:cfg.lv,getOriginType:function(){return cfg.typeid;}};
            var builder=new Comp.BuildingBuilder(master,cfg);
            row.builder={cost:builder.getRealCost(),buildTime:builder.buildTime,resType:builder.costType||builder.resType};
        }catch(e){row.builderError=String(e);}
        try{row.nameStr=G_StringManager.str(cfg.name);}catch(e){row.nameStr=null;}
        configs.push(row);
    }
    chains[prefix]=ids;
}
var map={};
Object.keys(chains).forEach(function(prefix){
    var ids=chains[prefix];
    for(var i=0;i<ids.length-1;i++){
        var cfg=data.unit_main[ids[i]];
        if(cfg && cfg.lv_up_able)map[ids[i]]=ids[i+1];
    }
});
return {request:'max-levels-001',chains:chains,upgradeTypes:map,configs:configs};
