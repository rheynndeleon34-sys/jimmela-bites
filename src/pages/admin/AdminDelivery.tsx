import { Truck, MapPin, Clock } from "lucide-react";

const deliveries = [
  { id: "DEL-0412", driver: "Kuya Rodel", destination: "Malolos, Bulacan", items: "Pork Siomai x50, Beef x30", status: "In Transit", eta: "2:30 PM" },
  { id: "DEL-0411", driver: "Kuya Jun", destination: "Meycauayan, Bulacan", items: "Longganisa Original x100", status: "Delivered", eta: "—" },
  { id: "DEL-0410", driver: "Kuya Rodel", destination: "San Jose del Monte", items: "Japanese Siomai x80", status: "In Transit", eta: "4:00 PM" },
  { id: "DEL-0409", driver: "Kuya Mark", destination: "Calumpit, Bulacan", items: "Shark's Fin x40, Garlic Longganisa x60", status: "Pending", eta: "Tomorrow" },
  { id: "DEL-0408", driver: "Kuya Jun", destination: "Hagonoy, Bulacan", items: "Pork Siomai x200", status: "Delivered", eta: "—" },
];

const statusStyles: Record<string, string> = {
  "In Transit": "bg-blue-50 text-blue-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
};

const AdminDelivery = () => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h3 className="font-display text-xl font-bold text-foreground">Delivery Tracking</h3>
      <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow-sm hover:shadow-md active:scale-[0.97] transition-all">
        + Schedule Delivery
      </button>
    </div>

    <div className="grid gap-4">
      {deliveries.map((d) => (
        <div key={d.id} className="bg-card rounded-xl border border-border shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-sm">{d.id}</p>
                <p className="text-muted-foreground text-xs">{d.driver}</p>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyles[d.status]}`}>
              {d.status}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" /> {d.destination}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" /> ETA: {d.eta}
            </span>
          </div>
          <p className="text-muted-foreground text-xs mt-2">{d.items}</p>
        </div>
      ))}
    </div>
  </div>
);

export default AdminDelivery;
