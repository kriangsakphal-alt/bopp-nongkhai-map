import { chromium } from "playwright";
import fs from "node:fs";
const areas=[["139",152],["140",104],["26",31]];
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({locale:"th-TH",userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36"});
const out=[];
for(const [area,expected] of areas){
  console.log("AREA",area);
  await page.goto(`https://info.bopp.go.th/area/${area}`,{waitUntil:"domcontentloaded",timeout:60000});
  await page.waitForTimeout(2500);
  const links=await page.$$eval('a[href*="/school/"]',els=>els.map(a=>({href:a.href,name:a.textContent.trim()})).filter(x=>x.href));
  const uniq=[...new Map(links.map(x=>[(x.href.match(/\\/school\\/(\\d+)/)||[])[1],x])).values()].filter(x=>x.name);
  console.log("found",uniq.length,"expected",expected);
  for(let i=0;i<uniq.length;i++){
    const sm=(uniq[i].href.match(/\\/school\\/(\\d+)/)||[])[1]; if(!sm)continue;
    try{
      await page.goto(uniq[i].href,{waitUntil:"domcontentloaded",timeout:60000});
      await page.waitForTimeout(500);
      const data=await page.evaluate(()=>{
        const txt=document.body.innerText.replace(/\\r/g,"").split("\\n").map(x=>x.trim()).filter(Boolean);
        const val=(label)=>{const i=txt.findIndex(x=>x===label);return i>=0?txt[i+1]:""};
        return {name:val("ชื่อโรงเรียน")||"",district:val("อำเภอ"),subdistrict:val("ตำบล"),lat:val("ละติจูด"),lng:val("ลองจิจูด"),affiliation:val("สังกัด")};
      });
      const lat=Number(data.lat),lng=Number(data.lng);
      out.push({id:sm,area,name:data.name||uniq[i].name,district:data.district,subdistrict:data.subdistrict,affiliation:data.affiliation,lat:Number.isFinite(lat)?lat:null,lng:Number.isFinite(lng)?lng:null});
      console.log(i+1,"/",uniq.length,sm,lat,lng);
    }catch(e){console.log("FAIL",sm,e.message);out.push({id:sm,area,name:uniq[i].name,lat:null,lng:null,error:e.message})}
  }
}
await browser.close();
const result={source:"https://info.bopp.go.th",generatedAt:new Date().toISOString(),count:out.length,schools:out};
fs.writeFileSync("data/cache.json",JSON.stringify(result,null,2));
console.log("WROTE",out.length);
