"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import Swal from "sweetalert2"; 
import { 
  Loader2, Plus, Trash2, Edit3, Eye, 
  MapPin, X, LayoutGrid, Monitor, School, Search, Save
} from "lucide-react"

export default function ClassroomManagement() {
  const { data: session } = useSession()
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<any>(null)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    name: "", roomNo: "", type: "Theory", building: "", capacity: ""
  })

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"

  useEffect(() => { fetchRooms() }, [])

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`${apiUrl}/classrooms`, {
        headers: { Authorization: `Bearer ${(session as any)?.user?.accessToken}` }
      })
      setRooms(res.data)
    } catch (e) { 
      toast.error("Failed to load rooms") 
    } finally { 
      setLoading(false) 
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Create a copy of formData to modify
      const payload = { ...formData };
      
      if (editingRoom) {
        // Remove _id from payload if it exists to avoid MongoDB immutable error
        const { _id, ...updateData } = payload as any;
        
        await axios.patch(`${apiUrl}/classrooms/${editingRoom._id}`, updateData, {
          headers: { Authorization: `Bearer ${(session as any)?.user?.accessToken}` }
        })
        toast.success("Room updated successfully")
      } else {
        await axios.post(`${apiUrl}/classrooms`, payload, {
          headers: { Authorization: `Bearer ${(session as any)?.user?.accessToken}` }
        })
        toast.success("New room added")
      }
      closeModal()
      fetchRooms()
    } catch (error: any) { 
      toast.error(error.response?.data?.message || "Operation failed") 
    }
  }

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this classroom data!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1e293b", 
      cancelButtonColor: "#f43f5e", 
      confirmButtonText: "Yes, delete it!",
      customClass: {
        popup: 'rounded-[2rem]', 
        confirmButton: 'rounded-xl px-6 py-3 font-black italic uppercase text-xs',
        cancelButton: 'rounded-xl px-6 py-3 font-black italic uppercase text-xs'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`${apiUrl}/classrooms/${id}`, {
            headers: { Authorization: `Bearer ${(session as any)?.user?.accessToken}` }
          });

          if (res.data.deletedCount > 0) {
            Swal.fire({
              title: "Deleted!",
              text: "Classroom has been removed.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              customClass: { popup: 'rounded-[2rem]' }
            });
            setRooms(rooms.filter((room: any) => room._id !== id));
          }
        } catch (error) {
          Swal.fire("Error!", "Something went wrong while deleting.", "error");
        }
      }
    });
  };

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingRoom(null)
    setFormData({ name: "", roomNo: "", type: "Theory", building: "", capacity: "" })
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  )

  return (
    <div className="p-6 md:p-10 bg-white min-h-screen space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-8">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">
            Room <span className="text-blue-600">Registry</span>
          </h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase italic tracking-widest mt-1">Infrastructure Control Panel</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black italic uppercase text-[10px] flex items-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-blue-100">
          <Plus size={16} /> Add New Classroom
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 font-black italic uppercase text-[10px] tracking-widest">
              <th className="p-6">Room Name & No</th>
              <th className="p-6">Building</th>
              <th className="p-6">Type</th>
              <th className="p-6">Capacity</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rooms.map((room: any) => (
              <tr key={room._id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-6">
                  <div className="font-black italic text-slate-900 text-sm">{room.name}</div>
                  <div className="text-[10px] font-bold text-blue-600 uppercase">Room: {room.roomNo}</div>
                </td>
                <td className="p-6 text-slate-600 font-bold italic text-xs uppercase">{room.building}</td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase italic ${room.type === 'Lab' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                    {room.type}
                  </span>
                </td>
                <td className="p-6 font-black italic text-slate-700 text-sm">{room.capacity} Seats</td>
                <td className="p-6">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => { setSelectedRoom(room); setIsViewModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Quick View">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => { setEditingRoom(room); setFormData(room); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => handleDelete(room._id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick View Modal */}
      {isViewModalOpen && selectedRoom && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl relative animate-in slide-in-from-bottom-4">
            <button onClick={() => setIsViewModalOpen(false)} className="absolute right-6 top-6 text-slate-300 hover:text-slate-900"><X size={20}/></button>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className={`p-6 rounded-3xl ${selectedRoom.type === 'Lab' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                {selectedRoom.type === 'Lab' ? <Monitor size={48}/> : <School size={48}/>}
              </div>
              <div>
                <h3 className="text-3xl font-black italic text-slate-900 uppercase tracking-tighter">{selectedRoom.name}</h3>
                <p className="text-blue-600 font-black italic text-xs uppercase">Official Code: {selectedRoom.roomNo}</p>
              </div>
              <div className="w-full grid grid-cols-2 gap-4 pt-6">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase italic">Building</p>
                  <p className="text-xs font-bold text-slate-700 uppercase italic">{selectedRoom.building}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-[9px] font-black text-slate-400 uppercase italic">Capacity</p>
                  <p className="text-xs font-bold text-slate-700 uppercase italic">{selectedRoom.capacity} People</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative animate-in zoom-in-95">
            <button onClick={closeModal} className="absolute right-8 top-8 text-slate-300 hover:text-slate-900"><X size={24}/></button>
            <h3 className="text-2xl font-black italic uppercase mb-8">{editingRoom ? "Edit" : "Register"} Room</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black italic uppercase text-slate-400 ml-2">Classroom Name</label>
                <input required placeholder="e.g. Newton Hall" className="w-full bg-slate-50 rounded-xl p-4 font-bold italic outline-none border-2 border-transparent focus:border-blue-600 transition-all" value={formData.name} onChange={(e)=>setFormData({...formData, name:e.target.value})}/>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black italic uppercase text-slate-400 ml-2">Room Number</label>
                <input required placeholder="e.g. 402" className="w-full bg-slate-50 rounded-xl p-4 font-bold italic outline-none border-2 border-transparent focus:border-blue-600 transition-all" value={formData.roomNo} onChange={(e)=>setFormData({...formData, roomNo:e.target.value})}/>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black italic uppercase text-slate-400 ml-2">Building</label>
                <input required placeholder="Building Name" className="w-full bg-slate-50 rounded-xl p-4 font-bold italic outline-none border-2 border-transparent focus:border-blue-600 transition-all" value={formData.building} onChange={(e)=>setFormData({...formData, building:e.target.value})}/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black italic uppercase text-slate-400 ml-2">Capacity</label>
                   <input type="number" placeholder="Seats" className="w-full bg-slate-50 rounded-xl p-4 font-bold italic outline-none" value={formData.capacity} onChange={(e)=>setFormData({...formData, capacity:e.target.value})}/>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black italic uppercase text-slate-400 ml-2">Type</label>
                  <select className="w-full bg-slate-50 rounded-xl p-4 font-bold italic outline-none cursor-pointer" value={formData.type} onChange={(e)=>setFormData({...formData, type:e.target.value})}>
                    <option value="Theory">Theory</option>
                    <option value="Lab">Lab</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white p-4 rounded-xl font-black italic uppercase text-xs mt-4 hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                <Save size={16} /> {editingRoom ? "Update Room" : "Save Classroom"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}