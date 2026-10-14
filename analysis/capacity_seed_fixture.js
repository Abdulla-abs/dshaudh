var keys=['dino.local.city.v1','dino.local.city.v2','dino.local.city.v3'];
var report={request:'capacity-fixture-001',preserved:{}};
keys.forEach(function(k){
    var v=sys.localStorage.getItem(k);
    if(v!==null && v!=='')report.preserved[k]=v;
});
var source=report.preserved['dino.local.city.v3']||report.preserved['dino.local.city.v2'];
if(!source)throw Error('Missing source save for capacity fixture');
var fixture=JSON.parse(source);
fixture.version=4;
fixture.revision=0;
fixture.buildings[0].type='20102';
fixture.resources={gold:7000,wood:7000};
fixture.production=fixture.production||{};
Object.keys(fixture.production).forEach(function(k){
    fixture.production[k]={stored:50,lastHour:DA.getSystemCurrentTimeHour()};
});
for(var i=0;i<fixture.buildings.length;i++)delete fixture.buildings[i].upgrade;
sys.localStorage.setItem('dino.local.city.v4.validation-20261012',JSON.stringify(fixture));
report.fixture=JSON.parse(sys.localStorage.getItem('dino.local.city.v4.validation-20261012'));
return report;
