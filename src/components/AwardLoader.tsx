// AwardLoader.tsx
export const Loader = () => (
  <div className="flex items-center justify-center h-full w-full">
    <div className="flex space-x-2">
      <span className="block w-3 h-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0s" }} />
      <span className="block w-3 h-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0.2s" }} />
      <span className="block w-3 h-3 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0.4s" }} />
    </div>
  </div>
);
