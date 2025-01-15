import './App.css';

function App() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-700 text-white overflow-hidden">
      <h1 className="text-5xl font-bold mb-6 animate-bounce">Tailwind CSS Test 🚀</h1>
      <p className="text-lg text-center max-w-lg">
        If you see this, Tailwind CSS is working! Play around with the styles and test responsiveness.
      </p>
      <div className="mt-8 flex space-x-4">
        <button className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all">
          Click Me
        </button>
        <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-all">
          Another Button
        </button>
      </div>
    </div>
  );
}

export default App;
