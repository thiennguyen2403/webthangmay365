import { roleLabels } from "../utils/roles";
function Profile(){
 const user=JSON.parse(localStorage.getItem('user')||'{}');
 return <div className="p-8"><div className="card p-8 max-w-2xl"><div className="w-20 h-20 rounded-3xl bg-blue-600 text-white flex items-center justify-center text-3xl font-black">365</div><h1 className="text-3xl font-black mt-5">{user.full_name}</h1><p className="text-slate-500 mt-2">{user.email}</p><div className="grid grid-cols-2 gap-4 mt-6"><div className="bg-slate-50 rounded-2xl p-4"><p className="text-slate-500 font-bold">Chức vụ</p><p className="font-black mt-1">{roleLabels[user.role]||user.role}</p></div><div className="bg-slate-50 rounded-2xl p-4"><p className="text-slate-500 font-bold">Trạng thái</p><p className="font-black mt-1">{user.status}</p></div></div></div></div>
}
export default Profile;
