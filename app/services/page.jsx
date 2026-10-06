'use client';

import { useState, useEffect } from 'react';
import ServiceCard from '@/components/ServiceCard';
import OrderModal from '@/components/OrderModal';
import { Layers } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    try {
      let res = await fetch('/api/services', { cache: 'no-store' });
      if (!res.ok) {
        await new Promise((r) => setTimeout(r, 600));
        res = await fetch('/api/services', { cache: 'no-store' });
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.services) && data.services.length > 0) {
        setServices(data.services);
      } else {
        await fetch('/api/seed', { cache: 'no-store' }).catch(() => {});
        const retryRes = await fetch('/api/services', { cache: 'no-store' });
        const retryData = await retryRes.json();
        if (retryData.success && Array.isArray(retryData.services)) {
          setServices(retryData.services);
        }
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) return { success: false, user: null };
        return res.json();
      })
      .then((data) => {
        if (data.success && data.user) setUser(data.user);
      })
      .catch(() => {});

    let isMounted = true;
    (async () => {
      try {
        let res = await fetch('/api/services', { cache: 'no-store' });
        if (!res.ok) {
          await new Promise((r) => setTimeout(r, 600));
          res = await fetch('/api/services', { cache: 'no-store' });
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted) {
          if (data.success && Array.isArray(data.services) && data.services.length > 0) {
            setServices(data.services);
          } else {
            await fetch('/api/seed', { cache: 'no-store' }).catch(() => {});
            const retryRes = await fetch('/api/services', { cache: 'no-store' });
            const retryData = await retryRes.json();
            if (retryData.success && Array.isArray(retryData.services)) {
              setServices(retryData.services);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOrderService = (service) => {
    setSelectedService(service);
    setIsOrderModalOpen(true);
  };

  return (
    <div className="relative min-h-screen py-8 sm:py-12 md:py-20 cosmic-stars overflow-hidden">
      {/* Nebula Ambient Glows */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-fuchsia-600/15 blur-[100px] pointer-events-none" />
      <div className="absolute top-20 right-10 h-80 w-80 rounded-full bg-cyan-500/15 blur-[100px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/40 bg-purple-950/50 px-4 py-1.5 text-xs font-mono font-medium text-cyan-300 shadow-[0_0_15px_rgba(217,70,239,0.2)]">
            <Layers className="h-3.5 w-3.5 text-cyan-400" />
            <span>KELDORATHAL CORE OFFERINGS</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight break-words">
            Software & Web Development Services
          </h1>
          <p className="text-purple-200/90 text-sm sm:text-base leading-relaxed">
            From full-stack web platforms and cross-platform apps to REST APIs and custom software architecture.
          </p>
        </div>

        {/* SERVICES GRID */}
        {loading ? (
          <div className="py-20 text-center text-purple-300 text-sm font-mono flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span>Loading Keldorathal services...</span>
          </div>
        ) : services.length === 0 ? (
          <div className="py-20 text-center text-purple-300 text-sm font-mono space-y-4">
            <p>Unable to load services at this time.</p>
            <button
              onClick={() => fetchServices()}
              className="px-5 py-2.5 rounded-full border border-purple-500/40 bg-purple-950/60 text-cyan-300 hover:text-white hover:border-cyan-400 transition-all text-xs font-bold"
            >
              Retry Loading Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service) => (
              <ServiceCard key={service._id || service.slug} service={service} onOrder={handleOrderService} />
            ))}
          </div>
        )}
      </div>

      {/* ORDER MODAL */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        selectedService={selectedService}
        user={user}
      />
    </div>
  );
}
