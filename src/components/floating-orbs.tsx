"use client";

export default function FloatingOrbs() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      <div
        className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(45,212,191,0.25) 0%, transparent 70%)",
          animation: "float 12s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-1/3 -right-20 w-[400px] h-[400px] rounded-full opacity-15 blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
          animation: "float 10s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute bottom-20 left-1/4 w-[300px] h-[300px] rounded-full opacity-10 blur-[80px]"
        style={{
          background: "radial-gradient(circle, rgba(45,212,191,0.15) 0%, transparent 70%)",
          animation: "float 14s ease-in-out infinite",
          animationDelay: "-4s",
        }}
      />
    </div>
  );
}
