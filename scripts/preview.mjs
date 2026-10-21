import http from 'node:http';
import worker from '../dist/server/index.js';
const port=Number(process.env.PORT||8766);
const env={AI_API_KEY:process.env.AI_API_KEY,AI_PROVIDER:process.env.AI_PROVIDER,AI_MODEL:process.env.AI_MODEL};
http.createServer(async(req,res)=>{try{const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>8192){res.writeHead(413);res.end('Input too large');return}chunks.push(chunk)}const request=new Request('http://'+(req.headers.host||'localhost:'+port)+req.url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});const response=await worker.fetch(request,env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()))}catch{res.writeHead(500);res.end('Preview error')}}).listen(port,'127.0.0.1',()=>console.log('Local preview: http://127.0.0.1:'+port));
