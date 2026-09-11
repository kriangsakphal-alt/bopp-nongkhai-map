const fs=require("fs");
const path=require("path");
module.exports=(req,res)=>{
  try{
    const p=path.join(process.cwd(),"data","cache.json");
    const data=JSON.parse(fs.readFileSync(p,"utf8"));
    const u=new URL(req.url,"https://example.com");
    const area=u.searchParams.get("area");
    let schools=data.schools||[];
    if(area) schools=schools.filter(s=>String(s.area)===String(area));
    res.setHeader("Cache-Control","s-maxage=300, stale-while-revalidate=86400");
    res.status(200).json({ok:true,source:data.source,generatedAt:data.generatedAt||null,count:schools.length,schools});
  }catch(e){res.status(500).json({ok:false,error:e.message})}
};
