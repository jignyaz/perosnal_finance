const ContactCarousel = () => {
    const contacts = [
        { name: 'Alex Rivera', id: 'AR-99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', status: 'online' },
        { name: 'Sarah Chen', id: 'SC-42', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', status: 'away' },
        { name: 'Mike Ross', id: 'MR-07', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', status: 'online' },
        { name: 'Elena Vance', id: 'EV-88', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', status: 'online' },
        { name: 'Julian Black', id: 'JB-13', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Julian', status: 'offline' },
        { name: 'Nova Skye', id: 'NS-01', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nova', status: 'online' },
    ];

    return (
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
            {contacts.map((contact, idx) => (
                <button
                    key={idx}
                    className="flex-shrink-0 w-32 glass-panel p-5 border-white/5 flex flex-col items-center gap-3 group hover:bg-white/5 hover:border-white/10 transition-all duration-500"
                >
                    <div className="relative">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-accent-blue/50 transition-colors duration-500">
                            <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-primary ${contact.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' :
                                contact.status === 'away' ? 'bg-amber-500' : 'bg-slate-600'
                            }`}></div>
                    </div>
                    <div className="text-center">
                        <div className="text-[11px] font-bold text-white tracking-tight leading-tight truncate w-24">
                            {contact.name}
                        </div>
                        <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1 opacity-60">
                            {contact.id}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default ContactCarousel;
