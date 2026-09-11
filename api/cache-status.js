const fs=require("fs"),path=require("path");
module.exports=(req,res)=>{
 try{
  const d=JSON.parse(fs.readFileSync(path.join(process.cwd(),"data","cache.json"),"utf8"));
  const all=d.schools||[], withCoords=all.filter(s=>Number.isFinite(+s.lat)&&Number.isFinite(+s.lng));
  const byArea={};
  for(const a of ["139","140","26"]){
    const x=all.filter(s=>String(s.area)===a);
    byArea[a]={count:x.length,withCoordinates:x.filter(s=>Number.isFinite(+s.lat)&&Number.isFinite(+s.lng)).length};
  }
  res.status(200).json({ok:true,generatedAt:d.generatedAt||null,total:all.length,withCoordinates:withCoords.length,expected:287,byArea});
 }catch(e){res.status(500).json({ok:false,error:e.message})}
};
