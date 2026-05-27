import { useEffect, useState } from "react";
import api from "../../services/api";
function DirectorApprovals(){
  const [data,setData]=useState({reports:[],issues:[]}); const [comment,setComment]=useState({});
  const fetchData=async()=>setData((await api.get('/director/approvals')).data);
  useEffect(()=>{fetchData()},[]);
  const review=async(kind,id,status)=>{const c=comment[`${kind}-${id}`]; if(!c) return alert('Bắt buộc nhập nhận xét'); await api.patch(`/director/${kind}/${id}/review`,{status,comment:c}); setComment({...comment,[`${kind}-${id}`]:""}); fetchData();};
  return <div className="p-8 space-y-6"><div><h1 className="text-4xl font-black">Duyệt báo cáo & phát sinh</h1><p className="text-slate-500 mt-2">Duyệt hoặc từ chối đều bắt buộc nhập nhận xét.</p></div><Section title="Báo cáo chờ duyệt" items={data.reports} kind="reports" comment={comment} setComment={setComment} review={review}/><Section title="Phát sinh chờ duyệt" items={data.issues} kind="issues" comment={comment} setComment={setComment} review={review}/></div>
}
function Section({title,items,kind,comment,setComment,review}){return <section className="card p-6"><h2 className="text-2xl font-black mb-5">{title}</h2>{items.length===0&&<p className="text-slate-500">Không có mục chờ duyệt.</p>}{items.map(i=><div key={i.id} className="border border-slate-200 rounded-2xl p-5 mb-4"><div className="flex justify-between gap-4"><div><h3 className="text-xl font-black">{i.title}</h3><p className="text-slate-500 mt-1">{i.sender_name} • {i.project_name||'Không gắn dự án'}</p><p className="mt-3">{i.content || i.description}</p></div><span className="h-fit px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 text-xs font-bold">Chờ duyệt</span></div><textarea className="input mt-4" placeholder="Nhập nhận xét bắt buộc..." value={comment[`${kind}-${i.id}`]||''} onChange={e=>setComment({...comment,[`${kind}-${i.id}`]:e.target.value})}/><div className="flex gap-3 mt-3"><button className="btn-primary" onClick={()=>review(kind,i.id,'approved')}>Duyệt</button><button className="btn-danger" onClick={()=>review(kind,i.id,'rejected')}>Từ chối</button></div></div>)}</section>}
export default DirectorApprovals;
