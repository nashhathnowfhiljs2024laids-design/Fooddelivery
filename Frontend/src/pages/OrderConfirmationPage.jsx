import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Clock3, Package, MapPin, Phone, ArrowRight, Loader2, Truck, User, Map } from 'lucide-react';

const stages = ['Order placed', 'Preparing food', 'Delivery partner picked up', 'Food is on the way', 'Delivered'];

const routePoints = [
  { x: 10, y: 18 },
  { x: 25, y: 24 },
  { x: 40, y: 37 },
  { x: 55, y: 48 },
  { x: 70, y: 60 },
  { x: 85, y: 78 },
];

const getPosition = (progress) => {
  const index = Math.min(routePoints.length - 1, Math.floor(progress * (routePoints.length - 1)));
  const start = routePoints[index];
  const end = routePoints[Math.min(routePoints.length - 1, index + 1)];
  const segmentProgress = (progress * (routePoints.length - 1)) % 1;

  return {
    x: start.x + (end.x - start.x) * segmentProgress,
    y: start.y + (end.y - start.y) * segmentProgress,
  };
};

const OrderConfirmationPage = ({ order, onContinue }) => {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(1);
  const [gpsAvailable, setGpsAvailable] = useState(true);
  const [eta, setEta] = useState('35 mins');
  const [agentPosition, setAgentPosition] = useState(routePoints[0]);

  const statusText = useMemo(() => {
    if (stageIndex === 0) return 'Order placed';
    if (stageIndex === 1) return 'Preparing food';
    if (stageIndex === 2) return 'Delivery partner picked up order';
    if (stageIndex === 3) return 'Food is on the way';
    return 'Delivered';
  }, [stageIndex]);

  useEffect(() => {
    if (!order) return undefined;

    setProgress(0);
    setStageIndex(1);
    setGpsAvailable(true);
    setEta('35 mins');
    setAgentPosition(routePoints[0]);

    const interval = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(1, current + 0.04);
        const nextStage = next >= 0.95 ? 4 : next >= 0.6 ? 3 : next >= 0.35 ? 2 : next >= 0.1 ? 1 : 0;
        setStageIndex(nextStage);
        setAgentPosition(getPosition(next));
        setEta(next >= 0.95 ? 'Arriving soon' : `${Math.max(1, Math.round(35 - next * 25))} mins`);
        return next;
      });
    }, 2000);

    const gpsTimer = setTimeout(() => {
      if (Math.random() < 0.08) {
        setGpsAvailable(false);
      }
    }, 8000);

    return () => {
      clearInterval(interval);
      clearTimeout(gpsTimer);
    };
  }, [order]);

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-semibold text-gray-900">No order available</h1>
          <p className="mt-3 text-gray-600">Please place an order to view tracking information.</p>
          <button onClick={onContinue} className="mt-6 btn-primary px-6 py-3">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_transparent_40%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-sky-300 uppercase tracking-[0.2em]">Live Tracking</p>
              <h1 className="text-3xl font-bold text-white">Your order is on the move</h1>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white shadow-lg backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>ETA</span>
              </div>
              <p className="mt-1 text-xl font-semibold">{eta}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
            <div className="relative h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-slate-800 shadow-xl">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 to-slate-950/90" />

              <div className="absolute inset-0 px-5 py-5">
                <div className="relative h-full w-full rounded-[2rem] border border-white/10 bg-slate-900/80">
                  <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                    <defs>
                      <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                    </defs>
                    <polyline
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.8"
                      strokeDasharray="3 2"
                      points={routePoints.map((point) => `${point.x},${point.y}`).join(' ')}
                    />
                    <line x1="10" y1="18" x2="90" y2="82" stroke="#60a5fa" strokeWidth="0.6" opacity="0.35" />
                  </svg>
                  <div
                    className="absolute left-[calc(10%-0.85rem)] top-[calc(18%-0.85rem)] flex h-6 w-6 items-center justify-center rounded-full bg-white text-sky-600 shadow-lg"
                    title="Restaurant"
                  >
                    R
                  </div>
                  <div
                    className="absolute left-[calc(85%-0.85rem)] top-[calc(78%-0.85rem)] flex h-6 w-6 items-center justify-center rounded-full bg-white text-emerald-600 shadow-lg"
                    title="You"
                  >
                    H
                  </div>
                  <div
                    className="absolute flex h-8 w-8 items-center justify-center rounded-full bg-orange-400 text-white shadow-2xl transition-all duration-1000 ease-linear"
                    style={{ left: `${agentPosition.x}%`, top: `${agentPosition.y}%`, transform: 'translate(-50%, -50%)' }}
                    title="Delivery partner"
                  >
                    <Truck className="h-4 w-4" />
                  </div>
                  <div className="absolute left-6 top-6 rounded-3xl border border-white/15 bg-slate-950/70 p-4 text-white shadow-xl backdrop-blur">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-sky-300">Map View</div>
                    <div className="mt-2 text-sm text-slate-200">Route from restaurant to your home</div>
                  </div>
                  {!gpsAvailable && (
                    <div className="absolute inset-x-6 bottom-6 rounded-3xl border border-amber-400/30 bg-amber-500/10 p-4 text-sm text-amber-100">
                      <strong className="font-semibold">No GPS signal</strong> — live location may be delayed. Showing fallback route.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-white/10 bg-white/95 p-6 shadow-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Delivery partner</p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">Aarav Singh</h2>
                  </div>
                  <div className="rounded-3xl bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                    {eta}
                  </div>
                </div>
                <div className="mt-5 grid gap-3 text-sm text-slate-600">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Vehicle</p>
                    <p className="font-medium text-slate-900">Bike • GS-04 ABC-1234</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-xs text-slate-500">Current Status</p>
                    <p className="font-medium text-slate-900">{statusText}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-white/95 p-6 shadow-xl">
                <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  <Map className="h-4 w-4" />
                  Delivery route details
                </div>
                <div className="mt-5 grid gap-4 text-sm text-slate-600">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="font-medium text-slate-900">Pickup</p>
                    <p>{order?.restaurant?.name || 'Local restaurant'}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="font-medium text-slate-900">Dropoff</p>
                    <p>{order.deliveryAddress}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/95 p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Order tracking</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Real-time status</h2>
              </div>
              <div className="rounded-full bg-sky-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                {Math.round(progress * 100)}% complete
              </div>
            </div>

            <div className="space-y-5">
              {stages.map((stage, index) => {
                const isComplete = index <= stageIndex;
                const isCurrent = index === stageIndex;
                return (
                  <div key={stage} className="flex items-start gap-4">
                    <div className="relative flex h-10 w-10 items-center justify-center">
                      <div className={`absolute inset-0 rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                      <div className={`relative flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${isComplete ? 'bg-slate-950 text-white' : 'bg-white text-slate-500'}`}>
                        {isComplete ? '✓' : index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className={`font-semibold ${isComplete ? 'text-slate-900' : 'text-slate-500'}`}>{stage}</p>
                        {isCurrent && <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase text-sky-700">Active</span>}
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {index === 0 && 'Order placed successfully.'}
                        {index === 1 && 'Preparing your meal in the kitchen.'}
                        {index === 2 && 'Delivery partner is picking up your order.'}
                        {index === 3 && 'Your meal is on the way to your home.'}
                        {index === 4 && 'Your order has been delivered.'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/95 p-6 shadow-xl">
            <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              <Clock3 className="h-4 w-4" />
              Live delivery updates
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Preparation window</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">10–20 mins</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Delivery window</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">30–45 mins</p>
              </div>
            </div>
          </div>

          <button onClick={onContinue} className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-slate-800">
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
